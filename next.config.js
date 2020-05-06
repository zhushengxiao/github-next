const webpack = require('webpack')
const withCss = require('@zeit/next-css')
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer')
const config = require('./config.backup')

const configs = {
	//编译输出目录
	distDir: 'dest',
	// 是否给每个路由生成Etag
	generateEtags: true,
	// 页面内容缓存配置
	onDemandEntries: {
		// 内容在内存中缓存时间(ms)
		maxInactiveAge: 25 * 1000,
		// 同时缓存多少个页面
		pagesBufferLength: 2,
	},
	// page目录下哪些后缀是页面
	pageExtensions: ['jsx', 'js'],
	// 配置buildId
	generateBuildId: async () => {
		if (process.env.YOUR_BUILD_ID) {
			return process.env.YOUR_BUILD_ID
		}
		// 返回Null使用默认的unique id
		return null
	},

	// 收到修改webpack config
	webpack(config, options) {
		return config
	},

	// 修改webpackDevMiddleware配置
	webpackDevMiddleware: (config) => {
		return config
	},

	env: {
		customKey: 'value',
	},

	// 下面两个通过'next/config'来读取
	// 只有在服务器渲染时才会获取配置
	serverRuntimeConfig: {
		mySecret: 'secret',
		secondSecret: process.env.SECOND_SECRET,
	},
	// 在服务端渲染和客户端渲染都可获取的配置
	publicRuntimeConfig: {
		staticFolder: '/static',
	},
}

if (typeof require !== 'undefined') {
	require.extensions['.css'] = (file) => {}
}

module.exports = withBundleAnalyzer(
	withCss({
		webpack(config) {
			// 忽略mement语言包
			config.plugins.push(
				new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
			)
			return config
		},
		publicRuntimeConfig: {
			GITHUB_OAUTH_URL: config.GITHUB_OAUTH_URL,
			OAUTH_URL: config.OAUTH_URL,
		},
		analyzeBrowser: ['browser', 'both'].includes(
			process.env.BUNDLE_ANALYZE
		),
		bundleAnalyzerConfig: {
			server: {
				analyzerMode: 'static',
				reportFilename: '../bundles/server.html',
			},
			browser: {
				analyzerMode: 'static',
				reportFilename: '../bundles/client.html',
			},
		},
	})
)
