#### Node基础

##### 1.Jest测试

进入项目，然后运行一下命令初始化`jest`配置

```bash
npx jest --init				
```

jest断言————toBe

```js
test('helloworld测试', () => {
  const helloworld = require('../index')
  expect(helloworld).toBe('hello world')
})
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

###### 3.1fs.existsSync(pathName) —— 文件是否存在

###### 3.2fs.readdirSync(sourcePath) —— 读取路径下文件

###### 3.3fs.statSync(pathName).isFile() —— 判断是否为文件

###### 3.4fs.writeFileSync(fileName, content) —— 写入内容