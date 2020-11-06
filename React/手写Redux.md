#### 手写Redux

------

##### Redux核心实现

1. 存储状态state
2. 获取状态getState
3. 更新状态dispatch
4. 变更订阅subscribe

```jsx
export default function createStore(reducer, enhancer) {
  // 如果传入enhancer, 则返回执行增强的中间件的store
  if (enhancer) {
    return enhancer(createStore)(reducer)
  }

  // 创建一个state
  let state
  // 创建订阅函数数组
  let listeners = []

  function getState() {
    // 返回state
    return state
  }

  function dispatch(action) {
    // 传入action参数，执行reducer，返回一个新的state
    state = reducer(state, action)
    // 批量执行订阅函数
    listeners.forEach(listener => listener())
  }

  function subscribe(listener) {
    // 将订阅函数添加到数组中，dispatch时批量执行
    listeners.push(listener)

    // 返回一个取消订阅函数
    return () => {
      const index = listeners.indexOf(listener)
      listeners.split(index, 1)
    }
  }

  // 初始化state，派发一个reducer看不懂的动作，这样可以获取默认值
  dispatch({ type: new Date() })


  return {
    getState,
    dispatch,
    subscribe
  }
}

```

##### Redux中间件

原先dispatch只能接受对象

现在希望dispacth接收一个函数，可以处理逻辑。

```jsx
export default function applyMiddleware(...middlewares) {
  return createStore => reducer => {
    const store = createStore(reducer)
    let dispatch = store.dispatch

    // 这两个方法是需要给中间件的
    const midApi = {
      getState: store.getState,
      dispatch: (action, ...args) => dispatch(action, ...args)
    }

    // 得到一个新的中间件的链，这个链上的中间件能获取midApi
    const middlewareChain = middlewares.map(middleware => middleware(midApi))

    // 每当调用dispatch时，会依次执行中间件，再返回dispatch
    dispatch = compose(...middlewareChain)(store.dispatch)

    // 返回增强的store，其实把dispatch增强就行了
    return {
      ...store,
      dispatch
    }

  }
}

// 聚合函数
function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }
  if (funcs.length === 1) {
    return funcs[0]
  }
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

```

##### combineReducers

```jsx
export default function combineReducers(reducers) {
  return function combination(state = {}, action) {
    let nextState = {}
    let hasChanged = false
    for (let key in reducers) {
      const reducer = reducers[key]
      nextState[key] = reducer(state[key], action)
      hasChanged = hasChanged || nextState[key] !== state[key]
    }

    return hasChanged ? nextState : state
  }
}
```

