const axios = require('axios')
const config = require('../config.backup')
const { client_id, client_secret, request_token_url } = config.github

// github 授权
module.exports = (server) => {
	server.use(async (ctx, next) => {
		if (ctx.path === '/auth') {
			const code = ctx.query.code
			if (!code) {
				ctx.body = 'code not exist'
				return
			}

			// 获取token
			const result = await axios({
				methods: 'POST',
				url: request_token_url,
				data: {
					client_id,
					client_secret,
					code,
				},
				headers: {
					Accept: 'application/json',
				},
			})
			// console.log("TCL: result", result.data)

			if (result.status === 200 && result.data && !result.data.error) {
				console.log('TCL: 获取token成功')
				ctx.session.githubAuth = result.data
				const { access_token, token_type } = result.data

				// 获取用户信息
				const userInfoResp = await axios({
					methods: 'GET',
					url: 'https://api.github.com/user',
					headers: {
						Authorization: `${token_type} ${access_token}`,
					},
				})
				console.log('TCL: userInfoResp', userInfoResp)
				ctx.session.userInfo = userInfoResp.data
				ctx.userInfo = userInfoResp.data
				ctx.body = ctx.session.userInfo
				ctx.redirect(
					ctx.session && ctx.session.urlBeforeOAuth
						? ctx.session.urlBeforeOAuth
						: '/'
				)
				if (ctx.session) {
					ctx.session.urlBeforeOAuth = ''
				}
			} else {
				console.log('TCL: 获取token失败')
				const errorMsg = result.data && result.data.error
				ctx.body = `request token failed ${errorMsg}`
			}
		} else {
			await next()
		}
	})

	server.use(async (ctx, next) => {
		const { path, method } = ctx
		if (path === '/loginout' && method === 'POST') {
			ctx.session = null
			ctx.body = `loginout success`
		} else {
			await next()
		}
	})

	server.use(async (ctx, next) => {
		const { path, method } = ctx
		// 记录授权登录之前的页面地址
		// 作为授权成功后返回的地址
		if (path === '/prepare-auth' && method === 'GET') {
			const { url } = ctx.query
			ctx.session.urlBeforeOAuth = url
			// ctx.body = 'ready'
			ctx.redirect(`${config.OAUTH_URL}`)
		} else {
			await next()
		}
	})
}
