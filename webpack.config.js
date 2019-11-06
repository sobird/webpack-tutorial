/**
 * webpack.config.js
 * 
 * @see https://webpack.js.org/concepts/configuration/
 * 
 * sobird<i@sobird.me> at 2019-11-06 16:53:47 build.
 */

var path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};