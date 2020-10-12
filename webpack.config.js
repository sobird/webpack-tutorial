/**
 * webpack.config.js
 * 
 * @see https://webpack.js.org/concepts/configuration/
 * 
 * 通过将 mode 选项设置为 production，启用 minification(代码压缩) 和 tree shaking
 * 
 * sobird<i@sobird.me> at 2019-11-06 16:53:47 build.
 */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// https://github.com/shellscape/webpack-manifest-plugin
const ManifestPlugin = require('webpack-manifest-plugin');

const webpack = require('webpack');

module.exports = env => {
  return {
    //mode: 'production',
    devtool: 'inline-source-map',
    entry: {
      index: './src/index.ts',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      //publicPath: '../dist/',
      filename: '[name].js',
      //chunkFilename: '[name].bundle.js',
    },
    optimization: {
      // usedExports: true,
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      },
      runtimeChunk: 'single',
    },
    devServer: {
      contentBase: './dist',
      //hot: true,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,//排除掉node_module目录
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [
            'file-loader'
          ]
        },
        {
          test: /\.(csv|tsv)$/,
          use: [
            'csv-loader'
          ]
        },
        {
          test: /\.xml$/,
          use: [
            'xml-loader'
          ]
        },
        {
          test: require.resolve('./src/globals.js'),
          use: 'exports-loader?file,parse=helpers.parse'
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: '管理输出',
        template: 'public/index.html',
      }),
      new webpack.HashedModuleIdsPlugin(),
      new webpack.ProvidePlugin({
        join: ['lodash', 'join']
      }),
      new ManifestPlugin()
    ]
  };
}