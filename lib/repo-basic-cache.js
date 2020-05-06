import LRU from 'lru-cache'

const REPO_CACHE = new LRU({
	maxAge: 1000 * 60 * 60,
})

export function cache(repo) {
	const full_name = repo.full_name
	return REPO_CACHE.set(full_name, repo)
}

//facebook/react
export function get(function_name) {
	return REPO_CACHE.get(function_name)
}

export function cacheArray(repos) {
	// 考虑用户没登录的情况
	if (repos && Array.isArray(repos)) {
		repos.forEach((repo) => cache(repo))
	}
}
