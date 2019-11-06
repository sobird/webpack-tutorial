/**
 * index.js
 * 
 * sobird<i@sobird.me> at 2019-11-06 18:23:36 build.
 */

import _ from 'lodash';
import './style.css';
import Icon from './icon.svg';

/**
 * 在使用 d3 等工具实现某些数据可视化时，这个功能极其有用。
 * 可以不用在运行时再去发送一个 ajax 请求获取和解析数据，
 * 而是在构建过程中将其提前加载到模块中，以便浏览器加载模块后，
 * 直接就可以访问解析过的数据。
 */
import Data from './data.xml';

import printMe from './print.js';

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

  console.log(Data);

  var btn = document.createElement('button');
  btn.innerHTML = '点击这里，然后查看 console！';
  btn.onclick = printMe;
  element.appendChild(btn);

  return element;
}

document.body.appendChild(component());
