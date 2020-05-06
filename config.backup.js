const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
const SCOPE = 'user'
const client_id = '10134e9ddcae4187b1cc'

module.exports = {
	github: {
		github_base_url: 'https://api.github.com',
		request_token_url: 'https://github.com/login/oauth/access_token',
		client_id,
		client_secret: '74d77a793c0b1f277910e3adff0875c68c568cbc',
	},
	radis: {
		port: 6379,
		password: '',
	},
	GITHUB_OAUTH_URL,
	OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${client_id}&scope=${SCOPE}`,
}
