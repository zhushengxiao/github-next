// pm2配置文件
module.exports = {
	apps: [
		{
			name: 'github-next',
			script: './server.js',
			instances: 1,
			autorestart: true,
			watch: false,
			max_memory_restart: '1G', // 分配1g内存
			env: {
				NODE_ENV: 'production',
			},
		},
	],
}
