import { babel } from '@rollup/plugin-babel'
import styles from 'rollup-plugin-styles'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import Copy from 'rollup-plugin-copy'
import { genUserScriptInfo } from './template/userscript'
import pkg from './package.json'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'

const globals = {
  mobx: 'mobx',
  'mobx-react': 'mobxReact',
  react: 'React',
  'react-dom': 'ReactDOM',
  '@ironkinoko/danmaku': 'Danmaku',
}

/** @type {import('rollup').RollupOptions} */
const config = {
  input: 'src/index.js',
  output: {
    dir: 'dist',
    entryFileNames: 'index.user.js',
    format: 'iife',
    banner: genUserScriptInfo(pkg),
    globals,
  },
  external: Object.keys(globals),
  plugins: [
    babel({ babelHelpers: 'bundled' }),
    styles(),
    nodeResolve({
      extensions: ['.js', '.jsx'],
    }),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.APP_VERSION': JSON.stringify(pkg.version),
      preventAssignment: true,
    }),
    Copy({
      targets: [
        {
          src: ['README.md', 'package.json', 'LICENSE'],
          dest: 'dist',
        },
      ],
    }),
  ],
}

export default config
