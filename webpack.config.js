const path = require('path')

/**
 * @type {import('webpack').Configuration}
 */
const config = {
  entry: ['./index.js'],
  output: { filename: 'index.js', path: path.resolve(__dirname, 'dist') },
}

module.exports = config
