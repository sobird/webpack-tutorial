/**
 * index.js
 * 
 * sobird<i@sobird.me> at 2019-11-06 18:23:36 build.
 */
import 'babel-polyfill';
import Print from './print';
import { file, parse } from './globals.js';

console.log(file);

function component() {
  var element = document.createElement('div');
  var button = document.createElement('button');
  var br = document.createElement('br');

  element.innerHTML = join(['Hello', 'webpack'], ' ');
  element.appendChild(br);
  element.appendChild(button);

  // Note that because a network request is involved, some indication
  // of loading would need to be shown in a production-level site/app.

  button.onclick = e => import(/* webpackChunkName: "print" */ './print').then(module => {
    var print = module.default;

    print();

  });

  //element.onclick = Print.bind(null, 'Hello webpack!');

  return element;
}

document.body.appendChild(component());