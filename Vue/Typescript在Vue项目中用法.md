#### Typescript在Vue项目中用法

##### 首先介绍typescript在vue中3中使用方式

###### 1.class+装饰器模式

```vue
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <!-- 新增特性 -->
    <p><input type="text" @keydown.enter="addFeature"></p>
    <div>特性总数: {{count}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Provide, Inject Watch } from 'vue-property-decorator'

@Component({
  // 注册组件
  components: {
    YouComponent
  }
})
export default class HelloWorld extends Vue {
	// props使用方式
  @Prop({ type: String, required: true, default: 'hello' }) private msg!: string;
  
  // data直接声明，！为断言，告诉ts将来这里会传值，让ts不用操心
  features: string[] = ['html', 'css', 'js']

  // 生命周期正常使用就行
  created() {
    console.log('create正常使用')
  }
  
  // get存储器作为计算属性
  get count() {
    return this.features.length
  }

  // emit调用方式，向父组件传递信息 —— 在父组件接受需要羊肉串命名法，add-feature
  @Emit() // @Emit如果想传参就return一个值
  addFeature (e: KeyboardEvent) {
    // 断言：用户确定变量的类型，可以使用断言
    const inp = e.target as HTMLInputElement
    this.features.push(inp.value)
    inp.value = ''
    return feature
  }

  // watch监听features
  @Watch('features', { deep: true, immediate: true })
  onFeaturesChange (val: any, old: any) {
    console.log('features变化了', val, old)
  }
  
  // 依赖注入的使用方式
  @Provide() foo = 'foo' // 在父组件中提供foo
  
  // 在子组件中注入
  @Inject() foo!: string
}
</script>
```

###### 2.Vue.extend模式

```vue
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  created () {},
  data () {
    return {
      title: '使用ts的extend方法1 '
    }
  },
  methods: {},
 
  watch: {},
  
  computed: {},
  
})
</script>
```

这种模式和原来的写法一样，也会有ts的提示

###### 3.tsx模式

```tsx
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class HelloWorld extends Vue {
  xianyu = 'tsx方式'
  add () {
    console.log(1)
  }

  render () {
    return (
      <div>
        <span>{this.xianyu}</span>
      </div>
    )
  }
}
```

这种模式更适合于react的同学。模板位于class中，编写模板是也会有提示

[附上官方链接,解锁更多的用法](https://github.com/kaorun343/vue-property-decorator)

##### 这里介绍typescript版vuex的用法

vuex-module-decorators 通过装饰器提供模块化声明vuex模块的方法，可以有效利用ts的类型系统。

安装

```bash
npm i vuex-module-decorators -D
```

添加store根文件store/index.ts

```javascript
import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)

// 这种方式为动态导入模块，不需要配置Vuex.store
// 也不需要在main.ts中引入
export default new Vuex.Store({
})
```

定义counter模块，创建store/counter.ts

```javascript

import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from './index'
// 动态注册模块
@Module({ dynamic: true, store: store, name: 'counter', namespaced: true })
class CounterModule extends VuexModule {
  count = 1

  @Mutation
  add () {
    // 通过this直接访问count
    this.count++
  }

  // 定义getters
  get doubleCount () {
    return this.count * 2
  }

  @Action
  asyncAdd () {
    setTimeout(() => {
      // 通过this直接访问add
      // this.context.commit('add') 等价于下面
      this.add()
    }, 1000)
  }
}
// 导出模块应该是getModule的结果
export default getModule(CounterModule)
```

使用方式，App.vue

```vue
<template>
  <div>
    <h1 @click="add">mutation：{{count}}</h1>
    <h1 @click="asyncAdd">action：{{count}}</h1>
    <h1>getter：{{doubleCount}}</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Counter from '@/store/counter'

@Component
export default class extends Vue {
  get count () {
    return Counter.count
  }

  get doubleCount () {
    return Counter.doubleCount
  }

  add () {
    Counter.add()
  }

  asyncAdd () {
    Counter.asyncAdd()
  }
}
</script>
```

[Vuex模块装饰器官方链接](https://championswimmer.in/vuex-module-decorators/pages/core/actions.html)

