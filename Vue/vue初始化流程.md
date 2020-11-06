vue初始化流程

入口**src/platforms/web/entry-runtime-with-compiler.js**

- 扩展$mount方法:处理template或el选项，编译成render函数，将vdom转换成dom并执行挂载。模板优先级：render>template>el。

查找Vue文件进入**src/ platforms/web/runtime/index.js**文件

- 1.安装web平台补丁函数patch，用于初始化和更新
- 2.实现了$mount

查找Vue文件进入**src/core/index.js**

1. 初始化全局API，entend、nextTick、defineReactive、set、del

重要：**src/core/instance/index.js** 

Vue构造函数定义

1. 初始化this._init(来自initMixin)
2. 定义实例属性和方法

进入init方法**src/core/instance/init.js**

1. 合并选项
2. initLifecycle(vm)  // $parent、$root、$children、$refs
3. initEvents(vm)  // 处理父组件传递的事件和回调
4. initRender(vm)  // $slots、$scopedSlots、_c、$createElement
5. callHook(vm, 'beforeCreate')
6. initInjections(vm) // 注入祖辈传入数据
7. initState(vm) // 初始化props，methods，data，computed，watch
8. initProvide(vm) // 向后代提供数据
9. **$mount**  // 执行挂载，获取vdom并转换为dom



整体流程捋一捋

new Vue() => _init() => $mount() => mountComponent() => updateComponent()/new Watcher() => render() => _update()=>__patch__

#### 数据响应式

**initState (vm: Component) src\core\instance\state.js**

初始化数据，包括props、methods、data、computed和watch

**initData**核心代码是将**data**数据响应化

```javascript
 
function initData (vm: Component) {
// 执行数据响应化
observe(data, true /* asRootData */)
}
```

