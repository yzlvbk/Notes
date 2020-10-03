##### 1.function组件

函数组件通常⽆无状态，仅关注内容展示，返回渲染结果即可。

> 从React16.8开始引⼊入了了hooks，函数组件也能够拥有状态。

⽤用function组件创建⼀一个Clock:

```react
import React, { useState, useEffect } from 'react'

export default function ReactComponentFunction() {
  const [date, setDate] = useState(new Date())

  // useEffect在组件挂载之后执行
  useEffect(() => {
    console.log('useEffect')
    const timer = setInterval(() => {
      setDate(new Date())
    }, 1000)

    // return的函数会在函数组件将卸载时执行，相当于componentWillUnmoune
    return () => clearInterval(timer)

    // []中代表依赖项，当依赖项的发生变化是，useEffect重新执行，相当于componentDidUpdate
  }, [])

  return <div>function component: {date.toLocaleTimeString()}</div>
}
```

> 熟悉 React class 的⽣生命周期函数，可以把 useEffect Hook 看做 componentDidMount ， componentDidUpdate 和 componentWillUnmount 这三个函数的组合。

##### 2.正确使用setState

setState(partialState, callback)

1. partialState:object|function ⽤用于产⽣生与当前state合并的⼦子集。
2. callback:function state更更新之后被调⽤用

###### 关于setState()应该了解的三件事：

###### 1.不要直接修改State

```react
// 错误示范:此代码不会重新渲染组件
this.state.comment = 'Hello';
// 正确使用
this.setState({comment: 'Hello'});
```

###### 2.State的更新可能是异步的

出于性能考虑，React 可能会把多个 setState() 调用合并成⼀个调用。

如果想要获取到最新的状态值有以下方式：

1. 在setState第二个参数—>回调函数中执行
2. 使用定时器setTimeout中执行
3. 在原生事件中修改状态

总结: **setState**只有在合成事件和生命周期函数中是异步的，在原生事件和**setTimeout**中都是同步的，这里的异步其实是批量更更新

###### 3.State的更新会被合并

```react
 
changeValue = v => {
    this.setState({
      counter: this.state.counter + v
    });
};
setCounter = () => {
    this.changeValue(1);
    this.changeValue(2);
  	// 只会执行this.changeValue(2);
};
```

如果想要链式更新State：将setState第一个参数写成函数形式

```react
changeValue = v => {
    this.setState(state => ({ counter: state.counter + v }));
};
setCounter = () => {
    this.changeValue(1);
    this.changeValue(2);
};
```

##### 3.组件复合

不具名用法：直接使用props.children

```react
<div>
  {showTop && <div>top</div>}
  // 直接使用props.children
	{this.props.children}
  {showBottom && <div>bottom</div>}
</div>
```

具名用法：传个对象进去

```react
<Layout title="home" showTop={true} showBottom={true}>
  {
    // 具名，传个对象
    {
      content: <h3>HomePage</h3>,
      text: '这是个文本',
      btnClick: () => console.log('btnClick'),
    }
  }
</Layout>

// 接收时使用
render() {
    const { children, showTop, showBottom } = this.props
    return (
      <div>
        {showTop && <div>top</div>}
        {children.content}
        {children.text}
        <button onClick={children.btnClick}>button</button>
        {showBottom && <div>bottom</div>}
      </div>
    )
  }
```

##### 4.Redux用法

###### 1.创建store，src/store/index.js

```react
import { createStore } from 'redux'
// 创建规则reducer，接受两个参数state、action，返回最新的state
const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'ADD':
      return (state += 1)

    case 'MINUS':
      return (state -= 1)

    default:
      return state
  }
}
const store = createStore(counterReducer)

export default store

```

###### 2.使用store

```react
import React, { Component } from 'react'
import store from '../../store/index'

export default class ReduxPage extends Component {
  componentDidMount() {
    // 订阅store更新，强制更新
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate()
    })
  }
  componentWillUnmount() {
    // 组件销毁时，取消订阅
    this.unsubscribe()
  }
  render() {
    return (
      <div>
        <div>redux: {store.getState()}</div>
        <button onClick={() => store.dispatch({ type: 'ADD' })}>ADD</button>
        <button onClick={() => store.dispatch({ type: 'MINUS' })}>MINUS</button>
      </div>
    )
  }
}
```

###### redux api:

1. createStore(reducer)  —— 创建store
2. store.getState() —— 获取state值
3. store.dispatch({type: 'XXX'}) —— 修改state状态
4. store.subscribe(() => {}) —— 订阅state变化，并返回一个取消订阅方法

##### 5.React-Redux用法

react-redux提供了了两个api

1.  Provider 为后代组件提供store <Provide store={store}></Provide>
2. connect 为组件提供数据和变更方法 —— connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])

全局提供store，index.js

```react
import { Provider } from 'react-redux'
import store from './store/index'
<Provider store={store}>
  <App />
</Provider>
```

获取状态数据，ReactReduxPage.jsx

```react
 
import React, { Component } from "react";
import { connect } from "react-redux";
class ReactReduxPage extends Component {
  render() {
    const { num, add, minus } = this.props;
    return (
      <div>
        <h1>ReactReduxPage</h1>
        <p>{num}</p>
        <button onClick={add}>add</button>
        <button onClick={minus}>minus</button>
</div>
); }
}
const mapStateToProps = state => {
  return {
    num: state,
  };
};
const mapDispatchToProps = {
  add: () => {
    return { type: "add" };
  },
  minus: () => {
    return { type: "minus" };
  }
};
export default connect(
mapStateToProps, //状态映射 mapStateToProps
mapDispatchToProps, //派发事件映射 
)(ReactReduxPage);
```

##### 6.React-Redux Hook API

1. userSelect() —— 获取store state
2. useDispatch() —— 获取dispatch

```react
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

export default function ReactReduxHook() {
  const num = useSelector((state) => state)
  const dispatch = useDispatch()
  const add = () => dispatch({ type: 'ADD' })
  const minus = () => dispatch({ type: 'MINUS' })
  return (
    <div>
      <h3>ReactReduxHook</h3>
      <p>{num}</p>
      <button onClick={add}>add</button>
      <button onClick={minus}>minus</button>
    </div>
  )
}
```

##### 7.react-router

react-router中奉⾏⼀切皆组件的思想，路由器-**Router**、链接-**Link**、路由-**Route**、独占-**Switch**、重定向-**Redirect**都以组件形式存在

**Route**渲染内容的三种方式 Route渲染优先级:children>component>render。

```
这三种⽅方式互斥，你只能⽤用⼀一种。
```

**children**:**func** 有时候，不管location是否匹配，你都需要渲染⼀些内容，这时候你可以⽤用children。 除了不管location是否匹配都会被渲染之外，其它工作⽅方法与render完全⼀一样。

**render**:**func** 但是当你用render的时候，你调用的只是个函数。 只在当location匹配的时候渲染。

**component: component**

只在当location匹配的时候渲染。

```react
{/* 添加Switch表示仅匹配⼀一个*/} 
<Switch>
{/* 根路路由要添加exact，实现精确匹配 */} 
  <Route
    exact
    path="/"
    component={HomePage}
  />
  <Route path="/user" component={UserPage} />
  <Route component={EmptyPage} />
</Switch>
```

##### 8.纯组件PureComponent

React.PureComponent 与 React.Component 很相似。两者的区别在于 React.Component 并未实 现 shouldComponentUpdate() ，⽽而 React.PureComponent 中以浅层对⽐比 prop 和 state 的⽅方式来 实现了了该函数。

如果赋予 React 组件相同的 props 和 state， render() 函数会渲染相同的内容，那么在某些情况下使用 React.PureComponent 可提高性能。

##### 9.react生命周期

挂载时：

1. constructor
2. static getDerivedStateFormProps(props, state) 返回null 或对象，返回对象则用于更新state
3. render
4. componentDidMount

更新时：

1. static getDerivedStateFormProps(props, state) 
2. shouldComponentUpdate 返回true或false
3. render
4. getSnapshotBeforeUpdate 任何返回值将作为componentDidUpdate第三个参数
5. componentDidUpdate(prevProps,prevState,snapshot)

卸载时：

1. componentWillUnmount