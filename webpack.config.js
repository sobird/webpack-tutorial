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

// https://github.com/shellscape/webpack-manifest-plugin
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';

export default (env) => {
  const config = {
    devtool: isProduction ? false : 'inline-source-map',
    entry: {
      app: [
        './src/index.tsx'
      ]
    },
    output: {
      path: resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      clean: true,
      // publicPath: '../dist/',
      // chunkFilename: '[name].bundle.js',
      clean: {
        keep(asset) {
          return asset.includes('sample');
        },
      }
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
                transpileOnly: true,
              },
            },
          ],
          exclude: ['/node_modules/'],
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
        // {
        //   test: import.meta.resolve('./src/globals.js'),
        //   use: 'exports-loader?file,parse=helpers.parse'
        // }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: '管理输出',
        template: resolve('public/index.html'),
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

  return config;
};