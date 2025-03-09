/* eslint-disable no-param-reassign */
// https://pomb.us/build-your-own-react/
interface Element {
  type: string;
  props: {
    children: Element[];
  }
}

interface Fiber {
  type: string | Function;
  props: {
    children: Element[];
  }

  dom?: HTMLElement | null;
  parent: Fiber | null; // react use return
  child: Fiber | null;
  sibling: Fiber | null;
  alternate: Fiber | null;
  effectTag: string;
  hooks: Function[];
}

function createTextElement(text: string) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createElement(type, props, children) {
  if (!Array.isArray(children)) {
    children = [children];
  }

  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === 'object' ? child : createTextElement(child);
      }),
    },
  };
}

let nextUnitOfWork = null;
let wipRoot = null;
let currentRoot = null;
let deletions = null;

function reconcileChildren(fiber, elements) {
  let index = 0;
  let oldFiber = fiber.alternate && fiber.alternate.child;

  let prevSibling: Fiber = null;

  while (index < elements.length || oldFiber !== null) {
    const element = elements[index];
    let newFiber: Fiber = null;

    const sameType = oldFiber && element && oldFiber.type === element.type;

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        parent: fiber,
        dom: oldFiber.dom,
        sibling: null,
        child: null,
        alternate: oldFiber,
        effectTag: 'UPDATE',
      };
    }
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: fiber,
        alternate: null,
        effectTag: 'PLACEMENT',
        sibling: null,
        child: null,
      };
    }
    if (oldFiber && !sameType) {
      oldFiber.effectTag = 'DELETION';
      deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index += 1;
  }
}

let wipFiber: Fiber = null;
let hookIndex: number = 0;

function updateFunctionComponent(fiber: Fiber) {
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = [];

  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function useState(initial) {
  const oldHook = wipFiber.alternate
    && wipFiber.alternate.hooks
    && wipFiber.alternate.hooks[hookIndex];

  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  };

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((action) => {
    hook.state = action(hook.state);
  });

  const setState = (action) => {
    hook.queue.push(action);
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    };
    nextUnitOfWork = wipRoot;
    deletions = [];
  };

  wipFiber.hooks.push(hook);
  hookIndex++;

  return [hook.state, setState];
}

function updateHostComponent(fiber: Fiber) {
  if (!fiber.dom) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define, no-param-reassign
    fiber.dom = createDom(fiber);
  }

  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);
}

function performUnitOfWork(fiber: Fiber) {
  const isFunctionComponent = fiber.type instanceof Function;

  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  // if (fiber.parent) {
  //   fiber.parent.dom?.appendChild(fiber.dom);
  // }

  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

const isEvent = (key: string) => { return key.startsWith('on'); };
const isProperty = (key: string) => { return key !== 'children' && !isEvent(key); };
const isNew = (prev, next) => { return (key: string) => { return prev[key] !== next[key]; }; };
const isGone = (prev, next) => { return (key: string) => { return !(key in next); }; };
function updateDom(dom, prevProps, nextProps) {
  // Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(
      (key) => {
        return !(key in nextProps)
        || isNew(prevProps, nextProps)(key);
      },
    )
    .forEach((name) => {
      const eventType = name
        .toLowerCase()
        .substring(2);
      dom.removeEventListener(
        eventType,
        prevProps[name],
      );
    });

  // remove old props
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = '';
    });

  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = nextProps[name];
    });

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name
        .toLowerCase()
        .substring(2);
      dom.addEventListener(
        eventType,
        nextProps[name],
      );
    });
}

function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  }
}

function commitWork(fiber: Fiber) {
  if (!fiber) {
    return;
  }
  let domParentFiber = fiber.parent;
  while (!domParentFiber?.dom) {
    domParentFiber = domParentFiber?.parent;
  }
  const domParent = domParentFiber.dom;

  if (
    fiber.effectTag === 'PLACEMENT'
    && fiber.dom != null
  ) {
    domParent?.appendChild(fiber.dom);
  } else if (
    fiber.effectTag === 'UPDATE'
    && fiber.dom != null
  ) {
    updateDom(
      fiber.dom,
      fiber.alternate?.props,
      fiber.props,
    );
  } else if (fiber.effectTag === 'DELETION') {
    commitDeletion(fiber, domParent);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function commitRoot() {
  deletions.forEach(commitWork);

  commitWork(wipRoot.child);
  currentRoot = wipRoot;

  wipRoot = null;
}

function workLoop(deadLine: IdleDeadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);

    shouldYield = deadLine.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function createDom(fiber: Fiber): HTMLElement {
  const dom = fiber.type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(fiber.type);

  const { children, ...props } = fiber.props;

  Object.keys(props).forEach((name) => {
    dom[name] = props[name];
  });

  return dom;
}

function render(element: Element, container: HTMLElement | null) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  };

  deletions = [];
  nextUnitOfWork = wipRoot;
}

export default {
  render,
  createElement,
  useState,
};

setTimeout(() => {
  console.log('wipRoot', wipRoot);
}, 100);
