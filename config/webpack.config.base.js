const path = require('path')
const webpack = require('webpack')

/** @type {webpack.Configuration} */
module.exports = {
  entry: path.resolve(__dirname, '../src/index.js'),

  output: {
    path: path.resolve(__dirname, '../dist'),
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },
  
  module: {
    rules: [
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          cacheDirectory: true,
        },
      },
    ],
  },
}
