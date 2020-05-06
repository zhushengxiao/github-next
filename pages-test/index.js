import { useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Router from 'next/router'
import { Button } from 'antd'
import { connect } from 'react-redux'
import getConfig from 'next/config'

import { update, add } from './store'
const { publicRuntimeConfig } = getConfig()

const events = [
	'routeChangeStart',
	'routeChangeComplete',
	'routeChangeError',
	'beforeHistoryChange',
	'hashChangeStart',
	'hashChangeComplete',
]

const makeEvent = (type) => {
	return (...args) => {
		console.log('TCL: makeEvent -> args', type, ...args)
	}
}

// events.forEach((event) => {
// 	Router.events.on(event, makeEvent)
// })

const color = '#ededed'
const Home = ({ counter, user, rename }) => {
	const getToA = () => {
		Router.push(
			{
				pathname: '/a',
				query: {
					id: 212,
				},
			},
			'/a/123'
		)
	}

	useEffect(() => {
		axios.get('/api/user/info').then((resp) => {
			console.log('TCL: Home -> resp', resp)
		})
	}, [])

	return (
		<div>
			<div>
				redux---{counter}--{user}
			</div>
			<input
				type="text"
				value={user}
				onChange={(e) => rename(e.target.value)}
			/>
			<div>index</div>
			<a href={publicRuntimeConfig.OAUTH_URL}>登录</a>
			<div>
				<Link href="/a:123" as="/a/123">
					<Button type="primary" size="large">
						antd
					</Button>
				</Link>

				<Button onClick={getToA}>to a</Button>
			</div>
			<style jsx global>{`
				div {
					font-size: 32px;
					font-weight: bold;
					color: ${color};
				}
			`}</style>
		</div>
	)
}

Home.getInitialProps = async ({ reduxStore }) => {
	reduxStore.dispatch(add(3))
	reduxStore.dispatch(update('测试redux'))
	return {}
}

function mapStateToProps(state) {
	return {
		counter: state.counter.count,
		user: state.user.username,
	}
}
function mapDispatchToProps(dispatch) {
	return {
		add: (num) => dispatch({ type: 'ADD', num }),
		rename: (name) => dispatch({ type: 'UPDATE_USERNAME', name }),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
