const Koa = require('koa')
const Router = require('koa-router')
const next = require('next') // 作为中间件
const session = require('koa-session')
const Redis = require('ioredis')
const config = require('./config.backup')
const auth = require('./server/auth')

const RedisSessionStore = require('./server/session-store')

const redis = new Redis(config.redis)

// 判断开发状态
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler() //处理app请求用到

app.prepare().then(() => {
	const server = new Koa()
	const router = new Router()

	//用来给cookie加密
	server.keys = ['Jocky develop Github App']

	//设置在浏览器的key叫什么
	const SESSION_CONFIG = {
		key: 'jid',
		maxAge: 24 * 60 * 60 * 1000,
		store: new RedisSessionStore(redis),
	}

	server.use(session(SESSION_CONFIG, server))

	// 配置处理github oauth登录
	auth(server)

	server.use(async (ctx, next) => {
		// ctx.session = ctx.session || {}
		// ctx.session.user = {
		//   name: 'jokcy',
		//   age: 19
		// }

		// if (!ctx.session.user) {
		//   ctx.session.user = {
		//     name: 'jokcy',
		//     age: 18
		//   }
		// } else {
		console.log('session is: ', ctx.session.githubAuth)
		// }
		await next()
	})

	// 获取用户信息
	router.get('/api/user/info', async (ctx) => {
		const user = ctx.session.userInfo
		if (!user) {
			ctx.status = 402
			ctx.body = 'Need Login'
		} else {
			ctx.body = user
			ctx.set('Content-Type', 'application/json')
		}
	})

	router.get('/a/:id', async (ctx) => {
		const id = ctx.params.id
		await handle(ctx.req, ctx.res, {
			pathname: '/a',
			query: { id },
		})
		ctx.respond = false
	})

	router.get('/b/:id', async (ctx) => {
		const id = ctx.params.id
		await handle(ctx.req, ctx.res, {
			pathname: '/b',
			query: { id },
		})
		ctx.respond = false
	})

	router.get('/set/user', async (ctx) => {
		ctx.session.user = {
			name: 'jokcy',
			age: 19,
		}
		ctx.body = 'set session'
	})

	server.use(router.routes())

	server.use(async (ctx, next) => {
		await handle(ctx.req, ctx.res)
		ctx.respond = false
	})

	server.listen(3000, () => {
		console.log('TCL: server on http://localhost:3000')
	})
})
