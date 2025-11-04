## Colors

```js
console.log('\u001b[37;1m White')
console.log('\u001b[36;1m Cyan')
console.log('\u001b[35;1m Magenta')
console.log('\u001b[34;1m Blue')
console.log('\u001b[33;1m Yellow')
console.log('\u001b[32;1m Green')
console.log('\u001b[31;1m Red')
console.log('\u001b[30;1m Grey')

console.log('\u001b[0m RESET')
```

## Action Path

CJS

```js
const path = require('node:path')

console.log(`__dirname: ${__dirname}`)
const src = path.resolve(__dirname, '../src')
console.log(`src: ${src}`)
```

ESM

```js
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
console.log(`__filename: ${__filename}`)
const __dirname = path.dirname(__filename)
console.log(`__dirname: ${__dirname}`)
const src = path.resolve(__dirname, '../src')
console.log(`src: ${src}`)
```

GitHub Variables

```js
console.log(`GITHUB_ACTION_REPOSITORY: ${process.env.GITHUB_ACTION_REPOSITORY}`)
console.log(`GITHUB_ACTION_REF: ${process.env.GITHUB_ACTION_REF}`)
console.log(`GITHUB_WORKSPACE: ${process.env.GITHUB_WORKSPACE}`)
let src = `${process.env.GITHUB_WORKSPACE}/src`
if (process.env.GITHUB_ACTION_REPOSITORY && process.env.GITHUB_ACTION_REF) {
  const actionPath = `/home/runner/work/_actions/${process.env.GITHUB_ACTION_REPOSITORY}/${process.env.GITHUB_ACTION_REF}`
  console.log(`actionPath: ${actionPath}`)
  src = `${actionPath}/src`
}
console.log(`src: ${src}`)
```
