import App, { Container } from 'next/app'
import Layout from '../components/Layout'
import MyContext from '../lib/my-context'
import { Provider } from 'react-redux'
import store from './store'
import hoc from '../lib/with-redux'
import { Button } from 'antd'

import 'antd/dist/antd.css'

class myApp extends App {
	state = {
		msg: '全局的',
		context: 'value',
	}
	// 这个方法每次页面切换都会调用
	static async getInitialProps(ctx) {
		const { Component } = ctx
		let pageProps
		// 自义定app后,如果页面有用到getInitialProps,则需要手动从这里传过去
		if (Component.getInitialProps) {
			pageProps = await Component.getInitialProps(ctx)
		}

		return { pageProps }
	}

	render() {
		const { Component, pageProps, reduxStore } = this.props // Component对应的是页面
		console.log(this.state.context)
		return (
			<Container>
				<Layout>
					<Provider store={reduxStore}>
						<MyContext.Provider value={this.state.context}>
							<Component {...pageProps}></Component>
							<Button
								type="primary"
								onClick={() =>
									this.setState({
										context: `000${this.state.context}000`,
									})
								}
							>
								update context
							</Button>
						</MyContext.Provider>
					</Provider>
				</Layout>
			</Container>
		)
	}
}

export default hoc(myApp)
