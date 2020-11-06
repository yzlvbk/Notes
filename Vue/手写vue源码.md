#### Vue的设计思想

- MVVM模式

------

![vueMVVM](./image/vueMVVM.png)

MVVM框架的三要素：**数据响应式、模板引擎及渲染**

数据响应式：监听数据变化并在视图中更新

- Object.defineProperty()
- Proxy 

模板引擎：提供描述视图的模板语法

- 差值：{{}}
- 指令：v-bind、v-on、v-model、v-for、v-if

渲染：如何将模板转换为html

- 模板 => vdom => dom

##### 数据响应式原理

数据变更能够响应在视图中，就是数据响应式。vue2中利用Object.defineProperty()实现变更监测。

实现原理

```javascript
 
const obj = {}
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    get() {
      console.log(`get ${key}:${val}`);
      return val
    },
    set(newVal) {
      if (newVal !== val) {
        console.log(`set ${key}:${newVal}`);
        val = newVal
} }
}) }
defineReactive(obj, 'foo', 'foo')
obj.foo
obj.foo = 'foooooooooooo'
```

遍历需要响应化的对象

```javascript
 
// 对象响应化:遍历每个key，定义getter、setter function observe(obj) {
  if (typeof obj !== 'object' || obj == null) {
    return
  }
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key])
  })
} 
const obj = {foo:'foo',bar:'bar',baz:{a:1}}
observe(obj)
obj.foo
obj.foo = 'foooooooooooo' obj.bar
obj.bar = 'barrrrrrrrrrr' obj.baz.a = 10 // 嵌套对象no ok
```

解决嵌套对象问题

```javascript
 
function defineReactive(obj, key, val) {
    observe(val)
    Object.defineProperty(obj, key, {
    //...
```

解决赋的值是对象的情况，在赋值是判断：如果是对象，进行响应式处理

```javascript
obj.baz = {a:1}
obj.baz.a = 10 // no ok
```

```javascript
set(newVal) {
    if (newVal !== val) {
observe(newVal) // 新值是对象的情况 notifyUpdate()
```

如果添加/删除了新属性无法检测

```javascript
 obj.dong = 'dong'
 obj.dong // 并没有get信息
```

解决方法：增加set Api

```javascript
function set(obj, key, val) {
  defineReactive(obj, key, val)
}
```

##### 原理分析

1. new Vue()首先执行**初始化**，对data执行响应式处理，这个过程发生在Observer中
2. 同时对模板执行编译，找到其中动态绑定的数据，从data中获取并初始化视图，这个过程发生在Compile中
3. 同时定义一个更新函数和watcher，将来对应数据变化时Watcher会调用更新函数
4. 由于data的某个key在一个视图中可能出现多次，所以每个key都需要一个管家Dep来管理多个Watcher
5. 将来data中数据一旦发生变化，会首先找到对应的Dep，通知所有Watcher执行更新函数

![vue流程图](./image/vue流程图.png)



##### 涉及类型介绍

- Vue：框架构造函数
- Observer：执行数据响应式(分辨数据对象还是数组)
- Compile：编译模板，初始化视图，手机依赖(更新函数、watcher创建)
- Watcher：执行更新函数(更新dom)
- Dep：管理多个Watcher，批量更新

##### 完整代码

```javascript
// 利用Object.defineProperty(obj,key,val)
// Vue.util.defineReactive() 设置响应式属性

// 设置响应式属性
function defineReactive(obj, key, val) {
    // 如果val是对象，递归遍历
    observer(val)

    // 每个key对应一个Dep实例
    const dep = new Dep()

    Object.defineProperty(obj, key, {
        get() {
            // 关系映射：dep和watcher
            Dep.target && dep.addDep(Dep.target)
            return val
        },
        set(newval) {
            if (newval !== val) {
                // 新值如果是对象，则要对它进行响应式处理
                observer(newval)
                // 进行赋值
                val = newval

                // 通知更新
                dep.notify()
            }
        }
    })
}

// 遍历指定数据对象每个key，拦截他们
function observer(obj) {
    // obj必须是对象
    if(typeof obj !== 'object' || obj === null) {
        return obj
    }
    // 每遇到一个对象，就创建一个Observe实例
    // 创建一个Observe实例去拦截
    new Observer(obj)
}

// 根据传入不同类型值，做不同操作
class Observer {
    constructor(value) {
        this.value = value

        if(Array.isArray(value)) { // Array
            // to do
        } else { // obj
            this.walk(value)
        }
    }

    // 对象的响应式处理
    walk(obj) {
        Object.keys(obj).forEach((key) => {
            defineReactive(obj, key, obj[key])
        })
    }
}

// proxy代理函数：让用户可以直接访问data中的key
function proxy(vm) {
    Object.keys(vm.$data).forEach((key) => {
        Object.defineProperty(vm, key, {
            get() {
                return vm.$data[key]
            },
            set(newVal) {
                vm.$data[key] = newVal
            }   
        })
    })
}

// 遍历dom树，找到动态的表达式或者指令等
class Compile {
    constructor(el, vm) {
        this.$vm = vm
        this.$el = document.querySelector(el)

        // 解析模板
        if(this.$el) {
            // 编译
            this.compile(this.$el)
        }
    }

    // 递归传入节点，根据节点类型不同做不同操作
    compile(el) {
        // 获取所有孩子节点(包括文本节点，元素节点，注释节点)
        const childNodes = el.childNodes
        childNodes.forEach((node) => {
            if(node.nodeType === 1) {
                // 编译元素节点
                this.compilElement(node)
                // 递归
                if (node.childNodes && node.childNodes.length > 0) {
                    this.compile(node)
                }
            } else if (this.isInter(node)) { // 文本节点并且为差值表达式 形如：{{xxx}}
                // 编译文本节点
                this.compileText(node)
            }

            
        })
    }

    // 判断文本节点并且为差值表达式 形如：{{xxx}}
    isInter(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }

    // 编译文本节点
    compileText(node) {
        this.update(node, RegExp.$1, 'text')
    }


    // 编译元素节点
    compilElement(node) {
        const nodeAttrs = node.attributes
        Array.from(nodeAttrs).forEach((attr) => {
            // v-text = 'xxx'
            const attrName = attr.name // v-text
            const exp = attr.value // 'xxx'
            if (attrName.indexOf('v-') === 0) { // 判断以k-开头的指令
                const dir = attrName.substring(2)
                this[dir] && this[dir](node, exp)
            }
        })
    }


    // 遇到绑定表达式或者指令
    // 1.首先初始化
    // 2.创建watcher实例，管理node它的更新
    update(node, exp, dir) {
        // 初始化编译
        const fn = this[dir + 'Updater']
        fn && fn(node, this.$vm[exp])

        // 创建watcher实例，添加更新函数
        new Watcher(this.$vm, exp, function (val) {
            fn && fn(node, val)
        })
    }


    // v-text
    text(node, exp) {
        this.update(node, exp, 'text')
    }
    textUpdater(node, value) {
        node.textContent = value
    }

    // v-html
    html(node, exp) {
        this.update(node, exp, 'html')
    }
    htmlUpdater(node, value) {
        node.innerHTML = value
    }
}



// 负责更新视图
class Watcher {
    constructor(vm, key, updater) {
        this.vm = vm
        this.key = key
        this.updaterFn = updater

        // 创建实例时，把当前实例指定到Dep.target静态属性上
        Dep.target = this
        // 读一下，触发get
        this.vm[this.key]
        // 置空
        Dep.target = null
    }

    update() {
        this.updaterFn.call(this.vm, this.vm[this.key])
    }
}

// 依赖：defineReactive中每一个key，对应一个Dep实例
class Dep {
    constructor() {
        this.deps = []
    }

    // 添加依赖
    addDep(watcher) {
        this.deps.push(watcher)
    }

    // 通知更新
    notify() {
        this.deps.forEach(watcher => watcher.update())
    }
}


class Vue {
    constructor(options) {
        this.$options = options
        this.$data = options.data

        // 对data进行响应式处理
        new Observe(this.$data)

        // 代理data到vm上 -- 用户使用不需要加$data
        proxy(this)

        // 执行编译
        new Compile(this.$options.el, this)

    }
}
```

总结：

1.在new Vue()过程中执行了3件事。

2.第一件事进行data响应式处理，在Observer中进行判断对象还是数组，分别执行不同的方式，并且递归处理。对象采用的是Object.defineProperty()方式，对象中每个key对应一个Dep。数组是改写7中原型方法，进行拦截。

3.第二件事进行模板编译，获取根节点，递归遍历字元素。判断是否为文本节点、元素节点、注释节点。进行不同的编译，在编译过程中发现动态的指令、差值，会new 一个 Watcher()，在new Watcher()的过程中会保存更新方法，并将该watcher实例添加到该data中的dep中，将来数据变化时，在set中执行dep中所有watcher实例的更新方法。

4.第三件是则将data中的key代理到vm实例上，这么每次访问直接使用this,而不需要this.$data。

