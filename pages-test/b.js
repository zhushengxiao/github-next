import {
	useState,
	useEffect,
	useReducer,
	useLayoutEffect,
	useContext,
	useRef,
	memo,
	useMemo,
	useCallback,
} from 'react'

import myContext from '../lib/my-context'

const countReducer = (state, action) => {
	switch (action.type) {
		case 'add':
			return state + 1
		case 'minus':
			return state - 1
		default:
			return state
	}
}

// 每次渲染都会重新执行一遍函数
// config对象会每次重新创建一个新的,导致child组件拿到的config跟着变化

function myCount() {
	const [count, dispatchCount] = useReducer(countReducer, 0)
	const [name, setName] = useState('jack')

	const context = useContext(myContext)

	const ipt = useRef()

	const countRef = useRef()
	countRef.current = count

	//if this count stady ,the memo will back same object
	const config = useMemo(
		() => ({
			text: `count is ${count}`,
			color: count > 3 ? 'red' : 'blue',
		}),
		[count]
	)

	//usecallback可以避免每次渲染都会声明一个新函数的问题

	const handleButtonClick = useCallback(
		() => dispatchCount({ type: 'add' }),
		[]
	)

	// 不传[]的话,每次渲染都会执行
	// 依赖什么变量更新,[]就放什么
	// 在html更新之后执行
	useEffect(() => {
		console.log('TCL: ipt', ipt)
		console.log('TCL: useEffect invoked')
		return () => console.log('TCL: useEffect deteched')
	}, [name])

	// 在useEffect之前执行
	// 在html更新之前执行
	useLayoutEffect(() => {
		console.log('TCL: useLayoutEffect invoked')
		return () => console.log('TCL: useLayoutEffect deteched')
	}, [])

	const handleAlertBtnClick = () => {
		setTimeout(() => {
			alert(countRef.current)
		}, 2000)
	}

	return (
		<div>
			<input
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			<Child config={config} onButtonClick={handleButtonClick}></Child>
			<button onClick={handleAlertBtnClick}>alert</button>
		</div>
	)
}

// memo作用是指在props变化时重新渲染
const Child = memo(({ onButtonClick, config }) => {
	console.log('TCL: child render')

	return (
		<button onClick={onButtonClick} style={{ color: config.color }}>
			{config.text}
		</button>
	)
})

export default myCount
