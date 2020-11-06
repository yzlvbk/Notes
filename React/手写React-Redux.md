#### 手写React-Redux

```jsx
import React, { useContext, useReducer, useLayoutEffect, useCallback, useState } from "react"

// ? 1.创建Context对象
const Context = React.createContext()

// ? 2.通过Provider传递
export function Provider({ store, children }) {
  return <Context.Provider value={store}>{children}</Context.Provider>
}

// ? 3.子组件接受context value
// ? connect是个HOC， 接受组件作为参数，然后返回一个新的组件，新的组件可以选择映射state和dispatch
export const connect = (
  masStateToProps = state => state,
  mapDispatchToProps // 数据类型为undefined，function，object
) => WarppendComponent => props => {
  // 首先获取store
  const store = useContext(Context)
  const { getState, dispatch, subscribe } = store

  // 获取选择的state
  const stateProps = masStateToProps(getState())

  // 获取选择的dispatch
  let dispatchProps = { dispatch }
  if (typeof mapDispatchToProps === 'function') {
    dispatchProps = mapDispatchToProps(dispatch)
  } else if (typeof mapDispatchToProps === 'object') {
    dispatchProps = bindActionCreators(mapDispatchToProps, dispatch)
  }

  // 组件更新
  const forceUpdate = useForceUpdate()
  useLayoutEffect(() => {
    const unsubscribe = subscribe(() => {
      forceUpdate()
    })

    return () => {
      unsubscribe()
    }
  }, [store])

  return <WarppendComponent {...props} {...stateProps} {...dispatchProps} />
}

//react-redux Hook方法
export function useSelector(selector) {
  const store = useContext(Context)
  const { getState, subscribe } = store
  // 获取选择的state
  const selectedState = selector(getState())

  // 组件更新
  const forceUpdate = useForceUpdate()
  useLayoutEffect(() => {
    const unsubscribe = subscribe(() => {
      forceUpdate()
    })

    return () => {
      unsubscribe()
    };
  }, [store])

  return selectedState
}

//react-redux Hook方法
export function useDispatch() {
  const store = useContext(Context)
  return store.dispatch
}


// 自定义更新hook, 便于复用
function useForceUpdate() {
  const [state, setState] = useState(0)
  const update = useCallback(() => {
    setState(prev => prev + 1)
  }, [])

  return update
}


function bindActionCreator(creator, dispatch) {
  return (...args) => dispatch(creator(...args))
}
export function bindActionCreators(creators, dispatch) {
  let obj = {}

  for (let key in creators) {
    obj[key] = bindActionCreator(creators[key], dispatch)
  }
  return obj
}


```

