const Redis = require('ioredis')
const redis = new Redis({
	port: 6379,
	password: 'cd',
})

redis.keys('*').then((data) => {
	console.log('TCL: keys', data)
})
