#### React组件化

------

##### 1.组件跨层级通信 **- Context**

在⼀一个典型的 React 应⽤用中，数据是通过 props 属性⾃上⽽下(由⽗及子)进⾏行传递的，但这种做法对于某些类型的属性⽽言是极其繁琐的(例如:地区偏好，UI 主题)，这些属性是应⽤程序中许多组件都需要的。Context 提供了一种在组件之间共享此类值的方式，⽽不必显式地通过组件树的逐层传递 props。

**Context API**

###### 步骤一：React.createContext —— 创建React上下文

创建一个 Context 对象。当 React 渲染一个订阅了这个 Context 对象的组件，这个组件会从组件树中离自身最近的那个匹配的 Provider 中读取到当前的 context 值。

```react
// 新建Context.js
import React from 'react'
export const ThemeContext = React.createContext({ themeColor: 'green' })
```

###### 步骤二：Context.Provider —— 提供给消费组件

Provider 接收⼀个 value 属性，传递给消费组件，允许消费组件订阅 context 的变化。一个 Provider 可以和多个消费组件有对应关系。多个 Provider 也可以嵌套使用，⾥层的会覆盖外层的数据。

当 Provider 的 value 值发⽣生变化时，它内部的所有消费组件都会重新渲染。Provider 及其内部 consumer 组件都不受制于 shouldComponentUpdate 函数，因此当 consumer 组件在其祖先组件退出更新的情况下也能更新。

```react
import { ThemeContext } from './Context'
...
	// 接收⼀个 value 属性，传递给消费组件, theme更新，消费组件也会重新渲染
  <ThemeContext.Provider value={theme}> 
    <div>
      <p>ContextPage</p>
      <button onClick={this.changeColor}>change color</button>
      <SonPage />
    </div>
  </ThemeContext.Provider>
```

###### 步骤三：消费组件接收value

方式一：class组件的contextType —— *只能用在类组件，只能订阅单一的context来源*

挂载在 class 上的 `contextType` 属性会被重赋值为一个由 [`React.createContext()`](https://react.docschina.org/docs/context.html#reactcreatecontext) 创建的 Context 对象。这能让你使用 `this.context` 来消费最近 Context 上的那个值。你可以在任何生命周期中访问到它，包括 render 函数中。

```react
import { ThemeContext } from './Context'
export default class GrandsonPage extends Component {
  static contextType = ThemeContext
  render() {
    const { themeColor } = this.context
    return (
      <div>
        <h3 className={themeColor}>GrandsonPage</h3>
      </div>
    )
  }
}
```

方式二：Context.Consumer —— *没有明显的限制，就是写起来有点麻烦而已~*

这需要[函数作为子元素（function as a child）](https://react.docschina.org/docs/render-props.html#using-props-other-than-render)这种做法。这个函数接收当前的 context 值，返回一个 React 节点。

```react
// 
<ThemeContext.Consumer>
 {
    (themeContext) => 
      {<h3 className={themeContext.themeColor}>SonPage</h3>}
  }
</ThemeContext.Consumer>
```

方式三：useContext —— *只能用在函数组件或者自定hook*

接收一个 context 对象（`React.createContext` 的返回值）并返回该 context 的当前值。当前的 context 值由上层组件中距离当前组件最近的 `value` prop 决定。

```react
import React, { useContext } from 'react'
import { ThemeContext } from './Context'

export default function UseContext() {
  const context = useContext(ThemeContext)
  return (
    <div>
      <h3 className={context.themeColor}>UseContext</h3>
    </div>
  )
}
```

###### 注意事项

因为 context 会使⽤参考标识(reference identity)来决定何时进⾏渲染，这⾥可能会有一些陷阱，当 provider 的父组件进⾏重渲染时，可能会在 consumers 组件中触发意外的渲染。举个例⼦，当每一次 Provider 重渲染时，以下的代码会重渲染所有下⾯的 consumers 组件，因为 value 属性总是被赋值为新的对象:

```react
class App extends React.Component {
  render() {
    return (
      //{something: 'something'} === {something: 'something'}为flase
      <Provider value={{something: 'something'}}>
        <Toolbar />
      </Provider>
); }
}
```

为了防⽌这种情况，将 value 状态提升到父节点的 state ⾥:

```react
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {something: 'something'},
    };
	}
  render() {
    return (
      	<Provider value={this.state.value}>
            <Toolbar />
    		</Provider>
    ); 
	}
}
 
```

总结

在React的官⽅文档中， Context 被归类为高级部分(Advanced)，属于React的⾼高级API，建议不要滥用。