import { withRouter } from 'next/router'
import { memo, isValidElement, useEffect } from 'react'
import { Row, Col, List, Pagination } from 'antd'
import Link from 'next/link'

import { request } from '../lib/api'
import Repo from '../components/Repo'
import { cacheArray } from '../lib/repo-basic-cache'

const isServer = typeof window === 'undefined'

const per_page = 20
const LANGUAGE = ['JavaScript', 'HTML', 'CSS', 'TypeScript', 'Java', 'Python']
const SORT_TYPE = [
	{
		name: 'Best Match',
	},
	{
		name: 'Most Stars',
		value: 'stars',
		order: 'desc', // 降序
	},
	{
		name: 'Fewest Stars',
		value: 'stars',
		order: 'asc',
	},
	{
		name: 'Most Forks',
		value: 'forks',
		order: 'desc',
	},
	{
		name: 'Fewest Forks',
		value: 'forks',
		order: 'asc',
	},
]

const selectedItemStyle = {
	borderLeft: '2px solid #e36209',
	fontWeight: 'bold',
}

const FilterLink = memo(({ name, query, lang, sort, order, page }) => {
	// 拼接路由参数
	let queryString = `?query=${query}`
	if (lang) queryString += `&lang=${lang}`
	if (sort) queryString += `&sort=${sort}&order=${order || 'desc'}`
	if (page) queryString += `&page=${page}`
	queryString += `&per_page=${per_page}`

	return (
		<Link href={`/search${queryString}`}>
			{isValidElement(name) ? name : <a>{name}</a>}
		</Link>
	)
})

const noop = () => {}

/**
 * sort: 排序方式
 * order: 排序顺序
 * lang: 仓库项目开发的主语言
 * page: 分页页面
 */
const Search = ({ router, repos }) => {
	const query = router.query
	console.log('router.query', query)
	const { lang, sort, order, page } = router.query

	useEffect(() => {
		!isServer && cacheArray(repos.items)
	}, [])
	return (
		<div className="root">
			<Row gutter={20}>
				<Col span={6}>
					<List
						bordered
						header={<span className="list-header">语言</span>}
						style={{ marginBottom: 20 }}
						dataSource={LANGUAGE}
						renderItem={(item) => {
							const selected = lang === item
							return (
								<List.Item
									style={selected ? selectedItemStyle : null}
								>
									{selected ? (
										<span>{item}</span>
									) : (
										<FilterLink
											{...query}
											name={item}
											lang={item}
										/>
									)}
								</List.Item>
							)
						}}
					></List>
					<List
						bordered
						header={<span className="list-header">排序</span>}
						dataSource={SORT_TYPE}
						renderItem={(item) => {
							let selected = false
							if (item.name === 'Best Match' && !sort) {
								selected = true
							} else if (
								item.value === sort &&
								item.order === order
							) {
								selected = true
							}
							return (
								<List.Item
									style={selected ? selectedItemStyle : null}
								>
									{selected ? (
										<span>{item.name}</span>
									) : (
										<FilterLink
											{...query}
											name={item.name}
											sort={item.value}
											order={item.order}
										/>
									)}
								</List.Item>
							)
						}}
					></List>
				</Col>
				<Col span={18}>
					<h2 className="repos-title">{repos.total_count} 个仓库</h2>
					{repos.items.map((repo) => (
						<Repo repo={repo} key={repo.id} />
					))}
					<div className="pagination">
						<Pagination
							pageSize={per_page}
							current={Number(page) || 1}
							total={1000}
							onChange={noop}
							itemRender={(page, type, ol) => {
								const p =
									type === 'page'
										? page
										: type === 'prev'
										? page - 1
										: page + 1
								const name = type === 'page' ? page : ol
								return (
									<FilterLink
										{...query}
										page={p}
										name={name}
									/>
								)
							}}
						/>
					</div>
				</Col>
			</Row>
			<style jsx>{`
				.root {
					padding: 20px 0;
				}
				.list-header {
					font-weight: 800;
					font-size: 16px;
				}
				.repos-title {
					border-bottom: 1px solid #eee;
					font-size: 24px;
					line-height: 50px;
				}
				.pagination {
					padding: 20px;
					text-align: center;
				}
			`}</style>
		</div>
	)
}

// github限制，搜索结果只能给前1000个
Search.getInitialProps = async ({ ctx }) => {
	const { query, sort, lang, order, page, per_page } = ctx.query
	console.log('ctx.query', ctx.query)
	if (!query) {
		return {
			repos: {
				total_count: 0,
			},
		}
	}

	// 拼接请求接口参数
	// 例子: ?q=react+language:react&sort=stars&order=desc&page=2
	let queryString = `?q=${query}`
	if (lang) queryString += `+language:${lang}`
	if (sort) queryString += `&sort=${sort}&order=${order || 'desc'}`
	if (page) queryString += `&page=${page}`
	queryString += `&per_page=${per_page}`

	const result = await request(
		{ url: `/search/repositories${queryString}` },
		ctx.req,
		ctx.res
	)

	// console.log(result.data.items.length)

	return {
		repos: result.data,
	}
}

export default withRouter(Search)
