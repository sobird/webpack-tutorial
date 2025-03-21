/**
 * webpack.config.js
 * 
 * @see https://webpack.js.org/concepts/configuration/
 * 
 * 通过将 mode 选项设置为 production，启用 minification(代码压缩) 和 tree shaking
 * 
 * sobird<i@sobird.me> at 2019-11-06 16:53:47 build.
 */

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import webpack from 'webpack';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import Dotenv from 'dotenv-webpack';

import MyWebpackPlugin from './plugins/MyWebpackPlugin.js';

// https://github.com/shellscape/webpack-manifest-plugin
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';

import pkg from './package.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const isProduction = process.env.NODE_ENV === 'production';
const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';

export default (env, argv) => {
  const config = {
    devtool: isProduction ? false : 'inline-source-map',
    entry: {
      app: [
        './src/index.tsx'
      ]
    },
    output: {
      path: resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].bundle.js',
      chunkFilename: '[name].[contenthash].chunk.js',
      assetModuleFilename: 'assets/[contenthash][ext][query]',
      clean: true,
      /**
       * 如果在编译时，不知道最终输出文件的 publicPath 是什么地址，则可以将其留空，
       * 并且在运行时通过入口起点文件中的 __webpack_public_path__ 动态设置。
       */
      publicPath: '',
      // chunkFilename: '[name].bundle.js',
      clean: {
        keep(asset) {
          return asset.includes('sample');
        },
      },
      hashDigestLength: 8,
    },
    devServer: {
      // open: true,
      host: '0.0.0.0',
      port: 3000,
      hot: true, // 开启HMR功能
      historyApiFallback: true,
      static: {
        directory: resolve(__dirname, 'public')
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/i,
          use: [
            {
              loader: 'ts-loader',
              options: {
                // transpileOnly: true,
                happyPackMode: true
              },
              
            },
          ],
          include: resolve(__dirname, 'src'),
          exclude: ['/node_modules/'],
        },
        {
          test: /\.s[ac]ss$/i,
          use: [stylesHandler, 'css-loader', 'postcss-loader', 'sass-loader'],
        },
        {
          test: /\.css$/i,
          use: [stylesHandler, 'css-loader', 'postcss-loader'],
        },
        // {
        //   test: /\.js$/,
        //   exclude: /(node_modules)/,//排除掉node_module目录
        //   use: {
        //     loader: 'babel-loader',
        //     options: {
        //       presets: ['@babel/preset-env']
        //     }
        //   }
        // },
        {
          test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|mp3)$/i,
          type: 'asset',
        },
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: pkg.description,
        template: resolve('public/index.html'),
        minify: {
          collapseWhitespace: isProduction,
          removeComments: isProduction,
          minifyJS: isProduction,
          minifyCSS: isProduction,
        },
      }),
      new Dotenv({
        path: resolve(__dirname, `.env.${process.env.NODE_ENV}`),
        safe: true,
        silent: true,
        systemvars: true,
        expand: true,
        allowEmptyValues: true,
        defaults: resolve(__dirname, '.env.defaults'),
      }),
      new MyWebpackPlugin({
        appId: pkg.name
      }),
      // https://www.webpackjs.com/plugins/hashed-module-ids-plugin/
      // new webpack.ids.HashedModuleIdsPlugin(),
      // new webpack.ProvidePlugin({
      //   join: ['lodash', 'join']
      // }),
      // new WebpackManifestPlugin()
    ],
    resolve: {
      extensions: ['.tsx', '.ts', 'jsx', '.js'],
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    // optimization: {
    //   // usedExports: true,
    //   splitChunks: {
    //     cacheGroups: {
    //       vendor: {
    //         test: /[\\/]node_modules[\\/]/,
    //         name: 'vendors',
    //         chunks: 'all'
    //       }
    //     }
    //   },
    //   runtimeChunk: 'single',
    // },
  };

  if (isProduction) {
    config.mode = 'production';
    config.plugins.push(new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }));
    // config.plugins.push(new webpack.SourceMapDevToolPlugin({
    //   test: /\.(tsx|jsx|js)$/,
    //   filename: '[file].map',
    //   publicPath: '/',
    // }));
  } else {
    config.mode = 'development';
    config.plugins.push(new webpack.ProgressPlugin({
      activeModules: true,
    }));
  }

  return config;
};