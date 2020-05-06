const { requestGithub } = require('../lib/api.js')

module.exports = (server) => {
	server.use(async (ctx, next) => {
		const { path, method } = ctx
		if (path.startsWith('/github/')) {
			const session = ctx.session
			const githubAuth = session && session.githubAuth
			const url = ctx.url.replace('/github/', '/')
			// 如果用户登录过就带上请求头
			const token = githubAuth && githubAuth.access_token
			let headers = {}
			if (token) {
				headers[
					'Authorization'
				] = `${githubAuth.token_type} ${githubAuth.access_token}`
			}
			console.log('服务器转发请求', url)
			// post请求从body里去参数
			// get直接url拿参数就行
			const result = await requestGithub(
				method,
				url,
				ctx.request.body || {},
				headers
			)

			ctx.status = result.status
			ctx.body = result.data
		} else {
			await next()
		}
	})
}
