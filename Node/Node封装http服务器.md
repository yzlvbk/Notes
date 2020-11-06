#### Node封装http服务器

###### app.js

```js
const http = require('http')
const url = require('url')

class App {
  constructor() {
    this.server = http.createServer()
    this.reqEvent = {}
    this.server.on('request', (req, res) => {
      // 解析路径
      let pathObj = url.parse(req.url)
      console.log('pathObj', pathObj)
      if (pathObj.pathname in this.reqEvent) {
        this.reqEvent[pathObj.pathname](req, res)
      } else {
        res.writeHead(404, {
          'content-type': 'text/html;charset=utf8'
        })
        res.end('404!页面找不到')
      }
    })
  }

  on(url, fn) {
    this.reqEvent[url] = fn
  }

  run(port, callback) {
    this.server.listen(port, callback)
  }
}

module.exports = App
```

###### 使用例子：

```js
const App = require('./app')

let app = new App()

app.on('/', (req, res) => {
  res.setHeader('content-type', 'text/html;charset=utf8')
  res.statusCode = 200
  res.end('这是首页')
})

app.on('/user', (req, res) => {
  res.setHeader('content-type', 'text/html;charset=utf8')
  res.end('这是user页')
})

app.run(4000, () => {
  console.log('启动成功！')
})
```

