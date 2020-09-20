#### webpack

##### 安装本地webpack

```bash
npm init - y
npm webpack webpack-cli -D
```

###### webpack可以进行0配置

```bash
npx webpack
```

打包工具 -->输出后的结果(js模块)

打包(支持我们的js的模块化)

###### 手动配置webpack

默认配置文件的名字 ：webpack.config.js

修改默认配置文件名：

```bash
npx webpack --config webpack.config.my.js
```

安装本地服务器

```bash
cnpm install webpack-dev-server -D
```

服务器启动命令

```bahs
npx webpack-dev-server
```

###### html-webpack-plugin插件

```JavaScript
new HtmlWebpackPlugin({
      template: './src/index.html', // 以'./src/index.html'作为模板
      filemae: 'index.html', // 打包后名字 
    })
```

###### mini-css-extract-plugin插件 抽离css

```JavaScript
new MiniCssExtractPlugin({
      filename: 'main.css' // 抽离的css名字为'main.css'
    })
```

###### 安装自动添加css前缀

```bash
cnpm i postcss-loader autoprefixer -D
```

