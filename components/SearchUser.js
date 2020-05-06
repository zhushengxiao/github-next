import { useState, useCallback, useRef } from 'react'
import { Select, Spin } from 'antd'
import debounce from 'lodash/debounce'
import { request } from '../lib/api'

const Option = Select.Option

function SearchUser({ onChange, value }) {
	// lastFetchIdRef作用是避免搜索结果请求过程中,又发起新的请求
	// 这样导致用户可能会看到现象，即一个数组刚显示就被立马替换的过程
	const lastFetchIdRef = useRef(0)

	const [fetching, setFetching] = useState(false)
	const [options, setOptions] = useState([])

	// 搜索用户
	const fetchUser = useCallback(
		debounce((value) => {
			lastFetchIdRef.current += 1
			const fetchId = lastFetchIdRef.current

			setFetching(true)
			setOptions([])

			if (!value) {
				setFetching(false)
				setOptions([])
				return
			}

			request({
				url: `/search/users?q=${value}`,
			}).then((resp) => {
				console.log('TCL: fetchUser -> resp', resp)

				if (fetchId !== lastFetchIdRef.current) {
					return
				}
				const data = resp.data.items.map((user) => ({
					text: user.login,
					value: user.login,
				}))

				setFetching(false)
				setOptions(data)
			})
		}, 500),
		[]
	)

	// 用户选中了搜索结果后
	const handleChange = (value) => {
		setOptions([])
		setFetching(false)
		onChange(value)
	}

	return (
		<Select
			style={{ width: 200 }}
			showSearch={true}
			notFoundContent={
				fetching ? <Spin size="small" /> : <span>nothing</span>
			}
			filterOption={false}
			placeholder="创建者"
			allowClear={true}
			value={value}
			onSearch={fetchUser}
			onChange={handleChange}
		>
			{options.map((op) => (
				<Option value={op.value} key={op.value}>
					{op.text}
				</Option>
			))}
		</Select>
	)
}

export default SearchUser
