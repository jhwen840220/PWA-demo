var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInjector = require('html-webpack-injector');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");   
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const config = {

  entry: {
    main: path.resolve(__dirname, './src/index.js'),
    // sw: path.resolve(__dirname, './sw.js'),
    // idb_head: path.resolve(__dirname, './idb.js'),  // add "_head" at the end to inject in head.
    // utility_head: path.resolve(__dirname, './utility.js'),  // add "_head" at the end to inject in head.
  },

  output: {
    path:  __dirname + '/dist',
    filename: '[name].[chunkhash].js'
  },

  module: {
    rules: [{
      test: /\.js(x)?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        }
      }
    }, {
      test: /\.(scss|sass)$/,
      use: [
        "css-loader",
        "sass-loader",
        MiniCssExtractPlugin.loader,
      ]
    }, {
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        "css-loader"
      ]
    }, {
      test: /\.(png|jpg|jpeg)$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          // outputPath: 'assets/'
        }
      }]
      // use: [{
      //   loader: 'url-loader?limit=8192&name=assets/[hash:8].[name].[ext]'
      // }]
    }]
  },
  plugins: [
    // new CopyWebpackPlugin([{ from: './assets/main.css', to: './' }]),
    new HtmlWebpackPlugin({
      template: 'index.html',
      // chunks: ['idb_head','utility_head','main'],
      chunks: ['main'],
    }),
    // new HtmlWebpackInjector(),      // Initialize plugin
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "./[name].[hash].css",
      chunkFilename: "./[id].css"
    }),
    new FaviconsWebpackPlugin('./assets/images/icon-192x192.png')
  ],

  devServer: {
    historyApiFallback: true
  }
}

module.exports = config;