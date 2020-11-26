const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
module.exports = merge(baseConfig, {
  mode: 'production',
  output: {
    filename: 'ytb-danmaku-core.min.js',
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    mobx: 'mobx',
    'mobx-react': 'mobxReact',
  },
})
