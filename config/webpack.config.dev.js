const path = require('path')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = merge(baseConfig, {
  mode: 'development',
  output: {
    filename: 'ytb-danmaku-core.js',
  },
  devServer: {
    contentBase: path.resolve(__dirname, '../public'),
    port: 1234,
    open: true,
  },
  devtool: 'eval-cheap-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
    }),
  ],
})
