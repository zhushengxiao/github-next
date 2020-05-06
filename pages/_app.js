import App from 'next/app'
import Layout from '../components/Layout'
import { Provider } from 'react-redux'
import withRedux from '../lib/with-redux'
import PageLoading from '../components/PageLoading'
import Router from 'next/router'
import 'antd/dist/antd.css' // 用这个方法导入，antd不会出现样式冲突警告

// 自定义app
class myApp extends App {
	state = {
		loading: false,
	}

	startLoading = () => {
		this.setState({
			loading: true,
		})
	}

	stopLoading = () => {
		this.setState({
			loading: false,
		})
	}

	componentDidMount() {
		Router.events.on('routeChangeStart', this.startLoading)
		Router.events.on('routeChangeComplete', this.stopLoading)
		Router.events.on('routeChangeError', this.stopLoading)
	}

	componentWillUnmount() {
		Router.events.off('routeChangeStart', this.startLoading)
		Router.events.off('routeChangeComplete', this.stopLoading)
		Router.events.off('routeChangeError', this.stopLoading)
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

		return (
			<Provider store={reduxStore}>
				{this.state.loading ? <PageLoading /> : null}
				<Layout>
					<Component {...pageProps}></Component>
				</Layout>
			</Provider>
		)
	}
}

export default withRedux(myApp)
