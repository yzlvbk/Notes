#### React Hook

**Hook** 是什什么? Hook 是一个特殊的函数，它可以让你“钩入” React 的特性。例如， useState 是允许你在 React 函数组件中添加 state 的 Hook。

什什么时候我会⽤ **Hook**? 如果你在编写函数组件并意识到需要向其添加一些 state，以前的做法是必须 将其它转化为 class。现在你可以在现有的函数组件中使用 Hook。

##### 1.useState

```react
 // 声明一个叫 “count” 的 state 变量，初始化为0
 const [count, setcount] = useState(0)
 // 返回一个数组，第一个参数为变量，第二个参数为设置变量方法
 return (
 		<button onClick={() => setcount(count + 1)}>{count}</button>
  )
```

##### 2.useEffect

*Effect Hook* 可以让你在函数组件中执⾏副作⽤操作。

数据获取，设置订阅以及⼿动更改 React 组件中的 DOM 都属于副作⽤。不管你知不知道这些操作，或是“副作用”这个名字，应该都在组件中使用过它们。

1. useEffect执行时机相当于componentDidMount，componentDidUpdate
2. useEffect条件执行，接收第二个参数，为所依赖值的数组
3. 清除effect，return一个函数，组件卸载时执行

```react
const [date, setdate] = useState(new Date())
// useEffect和componentDidMount和componentDidUpdate相似
useEffect(() => {
    const timer = setInterval(() => {
      setdate(new Date())
    }, 1000)
    // 组件卸载时需要清除 effect 
    return () => {
      clearInterval(timer)
    }
  }, [date]) // useEffect 传递第二个参数，它是 effect 所依赖的值数组
```

##### 3.useMemo —— 返回一个值

把“创建”函数和依赖项数组作为参数传⼊ useMemo ，它仅会在某个依赖项改变时才重新计算 memorized 值。这种优化有助于避免在每次渲染时都进⾏高开销的计算。

```react
// 只有count改变时才会执行
const expensize = useMemo(() => {
    let num = 0
    for (let i = 0; i <= count; i++) {
      num += i
    }
    return num
  }, [count])
```

##### 4.useCallback —— 返回一个函数

把内联回调函数及依赖项数组作为参数传入 useCallback ，它将返回该回调函数的 memorized 版本， 该回调函数仅在某个依赖项改变时才会更新。当你把回调函数传递给经过优化的并使⽤引用相等性去避免非必要渲染(例如 shouldComponentUpdate )的⼦组件时，它将非常有用。

```react
const [count, setCount] = useState(0);
const addClick = useCallback(() => {
    let sum = 0;
    for (let i = 0; i < count; i++) {
			sum += i; 
    }
    return sum;
}, [count]);

return (
    <div>
      <Child addClick={addClick} />
		</div>
);

// 当子组件为纯组件时，会比较上一次props，由于useCallback使用的为memorized版本，所以不会引起子组件更新
class Child extends PureComponent {
  render() {
    console.log("child render");
    const { addClick } = this.props;
    return <button onClick={() => addClick()}>add</button>
	}
}
```



##### 自定义Hook

⾃定义 **Hook** 是一个以 **“use”** 开头，函数内部可以调⽤其他的 **Hook**的函数

```react
//⾃自定义hook，命名必须以use开头 
function useClock() {
  const [date, setDate] = useState(new Date());
  useEffect(() => {
		console.log("date effect"); 
    //只需要在didMount时候执⾏就可以了 
    const timer = setInterval(() => {
setDate(new Date());
}, 1000); //清除定时器器，类似willUnmount
return () => clearInterval(timer);
}, []);
  return date;
}
```

**Hook** 使⽤规则
 Hook 就是 JavaScript 函数，但是使用它们会有两个额外的规则:

1. 只能在函数最外层调用 Hook。不要在循环、条件判断或者⼦函数中调用。
2.  只能在 **React** 的函数组件中调用 Hook。不要在其他 JavaScript 函数中调用。(还有一个地⽅可以调用 Hook —— 就是自定义的 Hook 中。)