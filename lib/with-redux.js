import React from 'react'
import createStore from '../store/store'

const isServer = typeof window === 'undefined' // 判断是否是服务端
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'

// 每次触发渲染重新返回一个store对象
function getOrCreateStore(initialState) {
	// 服务端用新的store对象
	if (isServer) {
		return createStore(initialState)
	}

	// 客户端用缓存
	if (!window[__NEXT_REDUX_STORE__]) {
		window[__NEXT_REDUX_STORE__] = createStore(initialState)
	}
	return window[__NEXT_REDUX_STORE__]
}

export default (Comp) => {
	class WithReduxApp extends React.Component {
		constructor(props) {
			super(props)
			this.reduxStore = getOrCreateStore(props.initialReduxState)
		}

		render() {
			const { Component, pageProps, ...rest } = this.props
			// console.log('TCL: HOC', Component, pageProps)
			if (pageProps) {
				pageProps.hoc = 'hoc啊哈'
			}

			return (
				<Comp
					reduxStore={this.reduxStore}
					{...rest}
					Component={Component}
					pageProps={pageProps}
				/>
			)
		}
	}

	// TestHocComp.getInitialProps = Comp.getInitialProps
	WithReduxApp.getInitialProps = async (ctx) => {
		// console.log('TCL: WithReduxApp.getInitialProps -> ctx', ctx)
		let reduxStore
		// console.log('isServer', isServer)
		if (isServer) {
			const { req } = ctx.ctx
			const session = req.session
			if (session && session.userInfo) {
				reduxStore = getOrCreateStore({
					user: session.userInfo,
				})
			} else {
				reduxStore = getOrCreateStore()
			}
		} else {
			reduxStore = getOrCreateStore()
		}

		ctx.reduxStore = reduxStore

		let pageProps = {}
		if (typeof Comp.getInitialProps === 'function') {
			pageProps = await Comp.getInitialProps(ctx)
		}

		return {
			...pageProps,
			initialReduxState: reduxStore.getState(),
		}
	}

	return WithReduxApp
}
