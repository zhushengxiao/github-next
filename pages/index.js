import { useEffect } from 'react'
import { Button, Icon } from 'antd'
import Router, { withRouter } from 'next/router'
import { connect } from 'react-redux'
import { Tabs } from 'antd'
import LRU from 'lru-cache'

import Repo from '../components/Repo'
import { request } from '../lib/api'
import { cacheArray } from '../lib/repo-basic-cache'

const cache = new LRU({
	maxAge: 1000 * 60 * 10, // 有效期十分钟
})

// let cachedUserRepos, cachedUserStaredRepos
const isServer = typeof window === 'undefined'

const Index = ({ userRepos, userStaredRepos, user, router }) => {
	const tabKey = router.query.key || '1'

	const handleTabChange = (activeKey) => {
		Router.push(`/?key=${activeKey}`)
	}

	// userRepos, userStaredRepos依赖的作用是,数据过期后,将重新请求的数据进行缓存
	useEffect(() => {
		if (!isServer) {
			userRepos && cache.set('userRepos', userRepos)
			userStaredRepos && cache.set('userStaredRepos', userStaredRepos)
		}
	}, [userRepos, userStaredRepos])

	// 缓存每个仓库的数据
	useEffect(() => {
		if (!isServer) {
			userRepos && cacheArray(userRepos)
			userStaredRepos && cacheArray(userStaredRepos)
		}
	}, [])

	if (!user || !user.id) {
		return (
			<div className="root">
				<p>亲，您还没有登录哦~</p>
				<Button
					type="primary"
					href={`/prepare-auth?url=${router.asPath}`}
				>
					点击登录
				</Button>
				<style jsx>{`
					.root {
						height: 400px;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
					}
				`}</style>
			</div>
		)
	}

	return (
		<div className="root">
			<div className="user-info">
				<img
					src={user.avatar_url}
					alt="avatar_url"
					className="avatar"
				/>
				<span className="login">{user.login}</span>
				<span className="name">{user.name}</span>
				<span className="bio">{user.bio}</span>
				<p className="email">
					<Icon type="mail" style={{ marginRight: 10 }} />
					<a href={`mailto:${user.email}`}>
						{user.email
							? user.email
							: 'https://github.com/IFreeOvO'}
					</a>
				</p>
			</div>
			<div className="user-repos">
				<Tabs
					activeKey={tabKey}
					onChange={handleTabChange}
					animated={false}
				>
					<Tabs.TabPane tab="你的仓库" key="1">
						{userRepos.map((repo) => (
							<Repo repo={repo} key={repo.id} />
						))}
					</Tabs.TabPane>
					<Tabs.TabPane tab="你关注的仓库" key="2">
						{userStaredRepos.map((repo) => (
							<Repo repo={repo} key={repo.id} />
						))}
					</Tabs.TabPane>
				</Tabs>
			</div>
			<style jsx>{`
				.root {
					display: flex;
					padding: 20px 0;
				}
				.user-info {
					width: 200px;
					margin-right: 40px;
					flex-shrink: 0;
					display: flex;
					flex-direction: column;
				}
				.login {
					font-weight: 800;
					font-size: 20px;
					margin-top: 20px;
				}
				.name {
					font-size: 16px;
					color: #777;
				}
				.bio {
					margin-top: 20px;
					color: #333;
				}
				.avatar {
					width: 100%;
					border-radius: 5px;
				}
				.user-repos {
					flex-grow: 1;
				}
			`}</style>
		</div>
	)
}

// getInitialProps在服务端渲染会执行一次(服务端执行),跳转到这个页面也会执行一次(客户端执行)
// req 和 res只有在服务端渲染时才能拿到
Index.getInitialProps = async ({ ctx, reduxStore }) => {
	// '/github/search/repositories?q=react'在服务端和客户端会读取成不同地址
	// 客户端是localhost的80端口
	// const result = await axios.get('/github/search/repositories?q=react')
	const user = reduxStore.getState().user

	if (!user || !user.id) {
		return {
			isLogin: false,
		}
	}

	// 服务端不进行缓存
	console.log('isServer----', isServer)
	if (!isServer) {
		if (cache.get('userRepos') && cache.get('userStaredRepos')) {
			return {
				userRepos: cache.get('userRepos'),
				userStaredRepos: cache.get('userStaredRepos'),
			}
		}
	}

	console.log('请求数据')
	const userRepos = await request({ url: `/user/repos` }, ctx.req, ctx.res)

	const userStaredRepos = await request(
		{ url: `/user/starred` },
		ctx.req,
		ctx.res
	)

	return {
		isLogin: true,
		userRepos: userRepos.data,
		userStaredRepos: userStaredRepos.data,
	}
}

export default withRouter(
	connect(function mapState(state) {
		return {
			user: state.user,
		}
	})(Index)
)
