/**
 * index.js
 * 
 * sobird<i@sobird.me> at 2019-11-06 18:23:36 build.
 */

import _ from 'lodash';
import './style.css';
import Icon from './icon.svg';

function component() {
  let element = document.createElement('div');

  // lodash（目前通过一个 script 引入）对于执行这一行是必需的
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('hello');

  // 将图像添加到我们已经存在的div中
  var myIcon = new Image();
  myIcon.src = Icon;

  element.appendChild(myIcon);

  var myFont = document.createElement('span');
  myFont.classList.add('iconfont');
  myFont.classList.add('wb-home');

  element.appendChild(myFont);

  return element;
}

document.body.appendChild(component());
