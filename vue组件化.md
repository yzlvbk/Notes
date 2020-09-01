## Vue组件化

vue组件系统提供了一种抽象，让我们可以使用独立可复用的组件来构建大型应用，任意类型的应用界面都可以抽象为一个组件数。组件化能**提高开发效率，方便重复使用，简化调试步骤，提升项目可维护性，便于多人协同开发。**

##### 组件通信常用方式:

- props
- $emit/$on
- Event bus
- vuex

##### 边界情况:

- $parent
- $children
- $root
- $refs
- provide/inject
- 非prop特性
  - $attrs
  - $listeners



#### 组件通信

###### 1.props方式

父给子传值

```javascript
// child
props: { msg: String }

// parent
<HelloWorld msg="Welcome to your Vue.js App" />
```

###### 2.自定义事件$emit

子给父传值

```javascript
// child
this.$emit('add', good)

// parent
<Cart @add="cartAdd($event)"></Cart>
```

###### 3.事件总线 event bus

任意两个组件之间常用事件总线

```javascript
// main.js
Vue.prototype.$bus = new Vue()

// child1
this.$bus.$emit('event', data)

// child2 注册在mounted()
this.$bus.$on('event', (data) => {...})
```

###### 4. vuex

创建唯一的全局数据管理者store，通过它管理数据并通知状态

###### 5.$parent/$root

兄弟组件之间通信科通过共同祖辈搭桥，$parent/$root

```javascript
// borther1
this.$parent.$emit('foo')

//borther2
this.$parent.$on('foo', handle)
```

###### 6.refs

获取子节点引用

```javascript
// parent
<HelloWord ref="name" />

mounted() {
	this.$refs.name.xx = 'xxx'
}
```

###### 7.$attrs/$listeners

包含了父作用域中不作为props被识别(且获取)的特性绑定(class和style除外)。当一个组件没有声明任何prop时，这里会包含所有负作用域的绑定(class和style除外),并且可以通过v-bind="$attrs"传入内部组件--在创建高级别的组件是非常有用。

```javascript
// child:并未在props中声明foo 
<p>{{$attrs.foo}}</p>

// parent
<HelloWorld foo="foo"/>
```

```javascript
// 给隔代GrandSon隔代传值，communication/index.vue
<child msg="lala" @some-event="onSomeEvent" />
  
// 在child中展开
<GrandSon v-bind="$attrs" v-on="$listeners" />
  
// 在GrandSon中使用
  <div @click="$emit('some-event', '我是你的孙子')">
  {{$attrs.msg}}
  </div>
```

###### 8.provide/inject

能够实现祖先和后代之间传值

```javascript
// ancestor
provide() {
  return { foo: 'foo' }
}

//descendant
inject: ['foo']
```

