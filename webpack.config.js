var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");   
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const config = {

  entry: {
    main: path.resolve(__dirname, './src/index.js'),
  },

  output: {
    path:  __dirname + '/dist',
    filename: '[name].[chunkhash].js',
    publicPath: "./"
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
        // options: {
        //   name: '[hash:8].[name].[ext]',
        //   outputPath: 'assets/'
        // }
      }]
      // use: [{
      //   loader: 'url-loader?limit=8192&name=assets/[hash:8].[name].[ext]'
      // }]
    }]
  },
  plugins: [
    // new CopyWebpackPlugin([{ from: './assets/main.css', to: './' }]),
    new HtmlWebpackPlugin({
        template: 'index.html'
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "./[name].css",
      chunkFilename: "./[id].css"
    }),
    new FaviconsWebpackPlugin('./assets/images/icon-192x192.png')
  ],

//   devServer: {
//     host: 'localhost',
//     port: 8081,
//     disableHostCheck: true
//   }
}

module.exports = config;