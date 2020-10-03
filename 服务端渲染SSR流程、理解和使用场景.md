#### 服务端渲染SSR

SSR解决方案，后端渲染出完整的首屏的dom结构返回，前端拿到的内容包括首屏及完整spa结构，应用激活后依然按照spa方式运行，这种⻚面渲染方式被称为服务端渲染 (server side render)

#### Vue SSR实战

###### 安装依赖

```bash
npm install vue-server-renderer@2.6.10 -S
```

> 要确保vue、vue-server-renderer版本一致

##### 路由

路由支持仍然使用vue-router

###### 安装

若未引入vue-router则需要安装

```bash
npm i vue-router -s
```

###### 路由配置

```javascript
import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
//导出工厂函数
export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      // 客户端没有编译器，这里要写成渲染函数
      { path: "/", component: { render: h => h('div', 'index page') } },
      { path: "/detail", component: { render: h => h('div', 'detail page') } }
      ] });
}
```

###### 主文件 main.js

跟之前不同，主文件是负责创建vue实例的工厂，每次请求均会有独立的vue实例创建。创建main.js:

```javascript
import Vue from "vue";
import App from "./App.vue";
import { createRouter } from "./router";
// 导出Vue实例工厂函数，为每次请求创建独立实例 // 上下文用于给vue实例传递参数
export function createApp(context) {
  const router = createRouter();
  const app = new Vue({
    router,
    context,
    render: h => h(App)
});
  return { app, router };
}
```

###### 服务端入口

上面的bundle就是webpack打包的服务端bundle，我们需要编写服务端入口文件src/entry-server.js 它的任务是创建Vue实例并根据传入url指定首屏

```javascript
import { createApp } from "./main";
// 返回一个函数，接收请求上下文，返回创建的vue实例 
export default context => {
// 这里返回一个Promise，确保路由或组件准备就绪 
  return new Promise((resolve, reject) => {
const { app, router } = createApp(context); // 跳转到首屏的地址
router.push(context.url);
// 路由就绪，返回结果
    router.onReady(() => {
      resolve(app);
    }, reject);
  });
};
```

###### 客户端入口

客户端入口只需创建vue实例并执行挂载，这一步称为激活。创建entry-client.js:

```javascript
import { createApp } from "./main";
// 创建vue、router实例
const { app, router } = createApp(); // 路由就绪，执行挂载
router.onReady(() => {
  app.$mount("#app");
});
```

###### webpack配置

安装依赖

```bash
npm install webpack-node-externals lodash.merge -D
```

具体配置，vue.config.js

```javascript
// 两个插件分别负责打包客户端和服务端
const VueSSRServerPlugin = require("vue-server-renderer/server-plugin"); 
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");
const nodeExternals = require("webpack-node-externals");
const merge = require("lodash.merge");
// 根据传入环境变量决定入口文件和相应配置项
const TARGET_NODE = process.env.WEBPACK_TARGET === "node";
const target = TARGET_NODE ? "server" : "client";
module.exports = {
  css: {
    extract: false
  },
  outputDir: './dist/'+target,
  configureWebpack: () => ({
      // 将 entry 指向应用程序的 server / client 文件 entry: `./src/entry-${target}.js`,
      // 对 bundle renderer 提供 source map 支持 devtool: 'source-map',
      // target设置为node使webpack以Node适用的方式处理动态导入， // 并且还会在编译Vue组件时告知`vue-loader`输出面向服务器代码。 target: TARGET_NODE ? "node" : "web",
      // 是否模拟node全局变量
      node: TARGET_NODE ? undefined : false,
      output: {
      // 此处使用Node⻛格导出模块

      libraryTarget: TARGET_NODE ? "commonjs2" : undefined
    },
    // https://webpack.js.org/configuration/externals/#function
    // https://github.com/liady/webpack-node-externals
    // 外置化应用程序依赖模块。可以使服务器构建速度更快，并生成较小的打包文件。
    externals: TARGET_NODE
? nodeExternals({
// 不要外置化webpack需要处理的依赖模块。
// 可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件， // 还应该将修改`global`(例如polyfill)的依赖模块列入白名单 
  whitelist: [/\.css$/]
        })
      : undefined,
    optimization: {
      splitChunks: undefined
},
// 这是将服务器的整个输出构建为单个 JSON 文件的插件。
// 服务端默认文件名为 `vue-ssr-server-bundle.json`
// 客户端默认文件名为 `vue-ssr-client-manifest.json`。 
    plugins: [TARGET_NODE ? new VueSSRServerPlugin() : new
VueSSRClientPlugin()]
  }),
chainWebpack: config => { // cli4项目添加
if (TARGET_NODE) {
        config.optimization.delete('splitChunks')
    }
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap(options => {
        merge(options, {
          optimizeSSR: false
}); });
} };
```

###### 脚本配置

```bash
npm i cross-env -D
```

定义创建脚本，package.json

```javascript
"scripts": {
    "build:client": "vue-cli-service build",
    "build:server": "cross-env WEBPACK_TARGET=node vue-cli-service build",
    "build": "npm run build:server && npm run build:client"
},
```

> 执行打包:npm run build

###### 宿主文件

最后需要定义宿主文件，修改./public/index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    <!--vue-ssr-outlet-->
  </body>
</html>
```

###### 服务器启动文件

```javascript
// node服务器：koa,express,egg.js
const express = require('express')
const app = express()

// 获取文件绝对路径
const resolve = dir => require('path').resolve(__dirname, dir)
// 第 1 步:开放dist/client目录，关闭默认下载index⻚的选项，不然到不了后面路由
app.use(express.static(resolve('../dist/client'), {index: false}))

// 第 2 步:获得服务端渲染模块vue-server-renderer
const {createBundleRenderer} = require('vue-server-renderer')

// 第 3 步:服务端打包文件地址
const bundle = resolve("../dist/server/vue-ssr-server-bundle.json")

// 第 4 步:创建渲染器
const renderer = createBundleRenderer(bundle, {
  runInNewContext: false, // https://ssr.vuejs.org/zh/api/#runinnewcontext
  template: require('fs').readFileSync(resolve("../public/index.html"), "utf-8"), // 宿主文件
  clientManifest: require(resolve("../dist/client/vue-ssr-client-manifest.json")) // 客户端清单
})

// 路由
app.get('*', async (req, res) => {
  try {
    const context = {
      url: req.url
    }
    const html = await renderer.renderToString(context)
    res.send(html)
  } catch (error) {
    res.status(500).send('服务器内部错误')
  }
  
})

// 监听
app.listen(3000)
```

###### 整合Vuex

```bash
npm install -S vuex
```

store/index.js

```javascript
 
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export function createStore () {
  return new Vuex.Store({
    state: {
        count:108
    },
    mutations: {
      add(state){
        state.count += 1;
} }
}) }
```

挂载store，main.js

```javascript
 
import { createStore } from './store'
export function createApp (context) { // 创建实例
    const store = createStore()
    const app = new Vue({
store, // 挂载
        render: h => h(App)
    })
    return { app, router, store }
}
```

使用，.src/App.vue

```javascript
<h2 @click="$store.commit('add')">{{$store.state.count}}</h2>
```

###### 数据预取

服务器端渲染的是应用程序的"快照"，如果应用依赖于一些异步数据，那么在开始渲染之前，需要先预取和解析好这些数据。

异步数据获取，store/index.js

```javascript
 
export function createStore() {
  return new Vuex.Store({
mutations: {
// 加一个初始化 init(state, count) {
        state.count = count;
      },
}, actions: {
// 加一个异步请求count的action getCount({ commit }) {
        return new Promise(resolve => {
          setTimeout(() => {
            commit("init", Math.random() * 100);
            resolve();
          }, 1000);
}); },
}, });
}
```

组件中的数据预取逻辑，Index.vue

```javascript
export default {
asyncData({ store, route }) { // 约定预取逻辑编写在预取钩子asyncData中
// 触发 action 后，返回 Promise 以便确定请求结果
    return store.dispatch("getCount");
  }
};
```

服务端数据预取，entry-server.js

```javascript
import createApp from './main';

export default context => {
  return new Promise((resolve, reject) => {
    // 拿出store和router实例
    const { app, router, store } = createApp(context); router.push(context.url);
    router.onReady(() => {
      // 获取匹配的路由组件数组
      const matchedComponents = router.getMatchedComponents();
      // 若无匹配则抛出异常
      if (!matchedComponents.length) {
        return reject({ code: 404 });
      }
      // 对所有匹配的路由组件调用可能存在的`asyncData()` 
      Promise.all(
        matchedComponents.map(Component => {
          if (Component.asyncData) {
            return Component.asyncData({
              store,
              route: router.currentRoute,
            });
          }
        }),
      )
        .then(() => {
          // 所有预取钩子 resolve 后，
          // store 已经填充入渲染应用所需状态
          // 将状态附加到上下文，且 `template` 选项用于 renderer 时，
          // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML。

          context.state = store.state;
          resolve(app);
        })
        .catch(reject);
    }, reject);
  });
};
```

客户端在挂载到应用程序之前，store 就应该获取到状态，entry-client.js

```javascript
// 导出store
const { app, router, store } = createApp();
// 当使用 template 时，context.state 将作为 window.__INITIAL_STATE__ 状态自动嵌入到 最终的 HTML // 在客户端挂载到应用程序之前，store 就应该获取到状态:
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
}
```

客户端数据预取处理，main.js

```javascript
Vue.mixin({
  beforeMount() {
    const { asyncData } = this.$options;
    if (asyncData) {
// 将获取数据操作分配给 promise
// 以便在组件中，我们可以在数据准备就绪后
// 通过运行 `this.dataPromise.then(...)` 来执行其他任务 this.dataPromise = asyncData({
        store: this.$store,
        route: this.$route,
      });
} },
});
```

#### 总结：

##### 对服务端渲染的理解(SSR)

服务端渲染的定义:

前端页面都是后端将html拼接好，然后将它返回给前端完整的html文件。浏览器拿到这个html文件之后就可以直接显示了，这就是所谓的服务器端渲染。（vue里：将vue实例渲染为HTML字符串直接返回，在前端激活为交互程序）。

服务端渲染的优点：

1. 首屏渲染快
2. 利于SEO

服务端渲染的缺点：

1. 不容易维护，通常前端改了部分html或者css，后端也需要修改。
2. 会增加项目整体复杂度（前后端耦合，互相依赖 (较高的学习成本)）。
3. 库的支持性（兼容性）
4. 对服务器压力较大

##### SSR使用场景：

1. 项目对首屏加载速度要求很高。比如：移动端
2. 项目对seo要求很高：比如：企业官网、电商类（有推广页面）

##### 必要性：

spa应用不使用ssr也可以对seo进行优化：
   有预渲染prerender、google抓AJAX、静态化、爬虫实现puppeteer：让它直接从spa项目中爬出结果