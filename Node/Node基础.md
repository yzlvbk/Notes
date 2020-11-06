#### Node基础

##### 1.http

###### 设置状态码和响应头

```js
response.writeHead(200, {
    'Content-Type': 'text/plain'
  })
```

###### 设置响应头

```js
response.setHeader('Content-Type', 'text/html')
```

###### 写入内容

```js
response.write()
```

###### 结束响应

```js
response.end()
```

###### 设置状态码

```js
response.statusCode = 200
```

##### 2.path模块提供了一些实用工具，用于处理文件和目录的路径

###### 2.1 ——path.dirname(path) 会返回path的目录名

```js
const dirName = path.dirname('/abc/class.js')
// '/abc'
```

###### 2.2 ——path.extname(path) 返回path的扩展名

```js
path.extname('index.html');
// 返回: '.html'

path.extname('index.coffee.md');
// 返回: '.md'

path.extname('index.');
// 返回: '.'

path.extname('index');
// 返回: ''

path.extname('.index');
// 返回: ''

path.extname('.index.md');
// 返回: '.md'
```

###### 2.3——path.basename(path，[ext]) ext为<string>可选的文件扩展名

```js
path.basename('/目录1/目录2/文件.html');
// 返回: '文件.html'

path.basename('/目录1/目录2/文件.html', '.html');
// 返回: '文件'
```

###### 2.4——path.join([...paths])——将所有给定的 `path` 片段连接到一起，然后规范化生成的路径

```js
path.join('/目录1', '目录2', '目录3/目录4', '目录5', '..');
// 返回: '/目录1/目录2/目录3/目录4'
```

###### 2.5——path.resolve([...paths]) —— 方法会将路径或路径片段的序列解析为绝对路径。

```js
path.resolve('/目录1/目录2', './目录3');
// 返回: '/目录1/目录2/目录3'

path.resolve('/目录1/目录2', '/目录3/目录4/');
// 返回: '/目录3/目录4'

path.resolve('目录1', '目录2/目录3/', '../目录4/文件.gif');
// 如果当前工作目录是 /目录A/目录B，
// 则返回 '/目录A/目录B/目录1/目录2/目录4/文件.gif'
```

###### 2.6——path.format(pathObject)

pathObject<Object>

- dir
- root
- base
- name
- ext

```js
// 如果提供了 `dir`、 `root` 和 `base`，
// 则返回 `${dir}${path.sep}${base}`。
// `root` 会被忽略。
path.format({
  root: '/ignored',
  dir: '/home/user/dir',
  base: 'file.txt'
});
// 返回: '/home/user/dir/file.txt'

// 如果未指定 `dir`，则使用 `root`。 
// 如果只提供 `root`，或 'dir` 等于 `root`，则将不包括平台分隔符。 
// `ext` 将被忽略。
path.format({
  root: '/',
  base: 'file.txt',
  ext: 'ignored'
});
// 返回: '/file.txt'

// 如果未指定 `base`，则使用 `name` + `ext`。
path.format({
  root: '/',
  name: 'file',
  ext: '.txt'
});
// 返回: '/file.txt'
```

##### 3.fs（文件系统）

所有的文件系统操作都具有同步的、回调的、以及基于 promise 的形式

###### 3.1readDir(读取目录)

```js
const fs = require('fs')
const path = require('path')

// 读取目录并判断是否为文件
fs.readdir(path.resolve(__dirname, '../'), (err, files) => {
  files.forEach(file => {
    const isFile = fs.stat(path.resolve(__dirname, '../'), (err, stats) => {
      const isfile = stats.isFile()
      console.log('isfile:', isfile)
    })
  })
})
```

###### 3.2readFile(读取文件)

```js
const fs = require('fs')

// 读取文件（同步方式）
// * 1.第一步打开文件（文件描述符方式）
const fd = fs.openSync(__dirname + '/hello.txt', 'r') // 返回的为文件在内存中的标识
// * 2.读取文件
const buf = Buffer.alloc(20)
const conent = fs.readFileSync(fd, 'utf-8') // 文件描述符

// 直接文件地址打开
const conent = fs.readFileSync(__dirname + '/hello.txt', 'utf-8') // 直接文件名

// 异步方式
fs.readFile(__dirname + '/hello.txt', 'utf-8', (err, data) => {
  console.log(data)
})
```

###### 3.3writeFile(写入文件)

```js
const fs = require('fs')

// * 方法一：写入内容为字符串
// fs.writeFile(__dirname + '/test.txt', '晚上吃啥?', 'utf-8', (err) => {

//   if (err) {
//     console.log(err);
//   }
//   console.log('文件被写入')
// })

// * 方法二：写入内容为文件描述符 如果data是 buffer，则encoding选项会被忽略。
// const data = new Uint8Array(Buffer.from('Node.js 中文网'))
// fs.writeFile(__dirname + '/test.txt', data, (err) => {

//   if (err) {
//     console.log(err);
//   }
//   console.log('文件被写入')s
// })


// * 文件追加
// fs.writeFile(__dirname + '/test.txt', '青椒肉丝\n', { encoding: 'utf-8', flag: 'a' }, (err) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log('文件被写入')
// })

function writeFs(path, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, { encoding: 'utf-8', flag: 'a' }, (err) => {
      if (err) {
        reject(err)
      } else {
        console.log('文件被写入')
        resolve()
      }
    })
  })
}

async function startWrite() {
  await writeFs(__dirname + '/test2.txt', 'js\n')
  await writeFs(__dirname + '/test2.txt', 'cssdddddd\n')
  await writeFs(__dirname + '/test2.txt', 'java\n')
  await writeFs(__dirname + '/test2.txt', 'js2\n')
  await writeFs(__dirname + '/test2.txt', 'js3\n')
  await writeFs(__dirname + '/test2.txt', 'js4\n')
}
// 执行写入文件
// startWrite()


// !删除文件
// fs.unlink(__dirname + '/test.txt', (err) => {
//   if (err) console.log(err)
//   console.log('文件删除成功')
// })

```



##### 4.url

###### 4.1new URL(input[, base])

```js
const url = require('url')
const myURL = new URL('https://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash')
console.log(myURL)
输出：
/*
URL {
  href: 'https://user:pass@sub.host.com:8080/p/a/t/h?		  query=string#hash',
  origin: 'https://sub.host.com:8080',
  protocol: 'https:',
  username: 'user',
  password: 'pass',
  host: 'sub.host.com:8080',
  hostname: 'sub.host.com',
  port: '8080',
  pathname: '/p/a/t/h',
  search: '?query=string',
  searchParams: URLSearchParams { 'query' => 'string' },
  hash: '#hash'
}
*/
```

##### 5.querystring ——查询字符串

###### 5.1`querystring.stringify(obj[, sep[, eq[, options]]])` —— 将对象解析成字符串

```js
const querystring = require('querystring')
const ret1 = querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '2' })
输出：'foo=bar&baz=qux&baz=quux&corge=2'

querystring.stringify(obj[, sep[, eq[, options]]])
// sep <string> 用于在查询字符串中分隔键值对的子字符串。默认值: '&'
// eq <string> 用于在查询字符串中分隔键和值的子字符串。默认值: '='

```

###### 5.2`querystring.parse(str[, sep[, eq[, options]]])` —— 将字符串解析成对象

##### 6.readline(逐行读取)

```js
const readline = require('readline')
const fs = require('fs')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


function lcQuestion(title) {
  return new Promise((resolve, reject) => {
    rl.question(title, (answer) => {
      resolve(answer)
    })
  })
}

async function createPackge() {
  const name = await lcQuestion('您的包名叫什么？')
  const description = await lcQuestion('您的包如何描述？')
  const main = await lcQuestion('您的包主程序入口文件是什么？')
  const author = await lcQuestion('您的包的作者是谁？')

  const content = `
  {
  "name": "${name}",
  "version": "1.0.0",
  "description": "${description}",
  "main": "${main}",
  "scripts": {
    "test": "jest"
  },
  "keywords": [],
  "author": "${author}",
  "license": "ISC"
}
`
  fs.writeFile(__dirname + '/package.json', content, 'utf-8', (err) => {
    console.log('写入成功')
    // 最终写完内容，关闭输入进程
    rl.close()
  })
}

rl.on('close', function () {
  // 停止程序
  process.exit(0)
})

createPackge()
```

##### 7.stream(文件流)

###### 7.1createWriteStream

```js
const fs = require('fs')

// ! 1.创建写入流
const ws = fs.createWriteStream(__dirname + '/hello.txt')
// * 监听文件打开事件
ws.on('open', () => {
  console.log('文件写入打开状态')
})

// * 监听文件准备事件
ws.on('ready', () => {
  console.log('文件写入已准备状态')
})

ws.write('hellow world1', (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log('内容写入完成')
  }
})

ws.write('hellow world2', (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log('内容写入完成')
  }
})

ws.write('hellow world3', (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log('内容写入完成')
  }
})

ws.end(() => {
  console.log('end：文件写入完成')
})

// * 监听文件关闭事件
ws.on('close', () => {
  console.log('文件写入已关闭状态')
})
```

###### 7.1createReadStream

```js
const fs = require('fs')

// ! 创建读取文件流
const rs = fs.createReadStream(__dirname + '/宠物.mp4')
// ! 创建写入文件流
const ws = fs.createWriteStream(__dirname + '/宠物copy.mp4')

rs.on('open', () => {
  console.log('读取的文件打开')
})

// * 每一次数据流入完成
rs.on('data', (chunk) => {
  console.log('单皮数据流入:', chunk)
  // 写入文件
  ws.write(chunk)
})

rs.on('close', () => {
  console.log('读取流结束')
  // 写入也完成
  ws.end()
})

```

###### 7.2pipe(管道流)

```js
// 管道流
const fs = require('fs')

// ! 创建读取文件流
const rs = fs.createReadStream(__dirname + '/宠物.mp4')
// ! 创建写入文件流
const ws = fs.createWriteStream(__dirname + '/宠物copy2.mp4')

// !读取文件内容并将内容写入新的文件中
rs.pipe(ws)
```

##### 8.events(事件触发器)

```js
const events = require('events')

const ee = new events.EventEmitter()

ee.on('hello', (name) => {
  console.log('你好！', name)
})

ee.emit('hello', '咸鱼')
```