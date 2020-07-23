var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = {

  entry: {
    main: path.resolve(__dirname, './src/index.js'),
  },

  output: {
    path:  __dirname + '/dist',
    filename: '[name].[chunkhash].js',
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
    }]
  },
  plugins: [
    // new CopyWebpackPlugin([{ from: './assets/main.css', to: './' }]),
    new HtmlWebpackPlugin({
        template: 'index.html'
    }),
    new CleanWebpackPlugin()
  ],

//   devServer: {
//     host: 'localhost',
//     port: 8081,
//     disableHostCheck: true
//   }
}

module.exports = config;