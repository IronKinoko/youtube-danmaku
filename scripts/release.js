const pkg = require('../package.json')
const fs = require('fs')
const path = require('path')
const cp = require('child_process')
const inquirer = require('inquirer')

const rPath = (filePath) => path.resolve(__dirname, filePath)

async function release() {
  const versionSplite = pkg.version.split('.').map((v) => +v)
  const patchVersion = [
    versionSplite[0],
    versionSplite[1],
    versionSplite[2] + 1,
  ].join('.')
  const minorVersion = [versionSplite[0], versionSplite[1] + 1, 0].join('.')
  const majorVersion = [versionSplite[0] + 1, 0, 0].join('.')
  const options = await inquirer.prompt([
    {
      type: 'list',
      name: 'version',
      message: 'Version:',
      choices: [
        { name: 'patch', checked: true, value: patchVersion },
        { name: 'minor', value: minorVersion },
        { name: 'major', value: majorVersion },
      ],
    },
  ])

  pkg.version = options.version

  cp.execSync('git pull')
  cp.execSync('npm i')
  cp.execSync('npm run build')

  let template = fs.readFileSync(rPath('./ytb-danmaku.template'), 'utf-8')
  const ytbDanmakuCore = fs.readFileSync(
    rPath('../dist/ytb-danmaku-core.min.js'),
    'utf-8'
  )

  const oneLineCoreCode = ytbDanmakuCore.replace(/[\r\n]/g, '')
  template = template.replace(/##version##/gim, pkg.version)

  // fs.writeFileSync(rPath('../package.json'), JSON.stringify(pkg, null, 2))
  fs.writeFileSync(rPath('../dist/ytb-danmaku-core.min.js'), oneLineCoreCode)
  fs.writeFileSync(rPath('../dist/ytb-danmaku.user.js'), template)

  cp.execSync('git add .')
  cp.execSync(`git commit -m "${pkg.version} build core"`)

  template = template.replace(
    /##hash##/gim,
    cp.execSync('git rev-parse HEAD').toString().trim()
  )
  fs.writeFileSync(rPath('../dist/ytb-danmaku.user.js'), template)

  // cp.execSync('git add .')
  // cp.execSync(`git commit -m "${pkg.version} release"`)
  // cp.execSync(`git tag v${pkg.version}`)
  // cp.execSync('git push')
  // cp.execSync('git push origin --tags')

  console.log(`build success, version: ${pkg.name}@${pkg.version}`)
}

release()
