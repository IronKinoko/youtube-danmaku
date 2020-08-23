const package = require('../package.json')
const fs = require('fs')
const path = require('path')
const exec = require('exec-sh')
const inquirer = require('inquirer')

const rPath = (filePath) => path.resolve(__dirname, filePath)

async function release() {
  await exec.promise('npm run build')

  const options =  await inquirer.prompt([
    {
      type:'list',
      name: 'version',
      message: 'Version:',
      choices: [
        {name: 'patch',value:'patch'},
        {name: 'minor',value:'minor'},
        {name: 'major',value:'major'},
      ]
    }
  ])

  const version = package.version
  let template = fs.readFileSync(rPath('./ytb-danmaku.template'), 'utf-8')
  const ytbDanmakuCore = fs.readFileSync(
    rPath('../dist/ytb-danmaku-core.js'),
    'utf-8'
  )

  const oneLineCoreCode = ytbDanmakuCore.replace(/[\r\n]/g, '')
  template = template.replace('##version##', version)

  fs.writeFileSync(rPath('../dist/ytb-danmaku-core.js'), oneLineCoreCode)
  fs.writeFileSync(rPath('../dist/ytb-danmaku.js'), template)

  console.log(`build success, version: ${package.name}@${version}`)
}

release()
