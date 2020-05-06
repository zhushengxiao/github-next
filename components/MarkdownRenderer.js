import { memo, useMemo } from 'react'
import MarkdownIt from 'markdown-it'
import 'github-markdown-css'

const md = new MarkdownIt({
	html: true, // 将ms里的html转换
	linkify: true, // 把链接转成可点击的连接
})

// 解决atob中文解码后乱码问题
function b64_to_utf8(str) {
	return decodeURIComponent(escape(atob(str)))
}

export default memo(function MarkdownRender({ content, isBase64 }) {
	const markdown = isBase64 ? b64_to_utf8(content) : content
	const html = useMemo(() => md.render(markdown), [markdown])
	return (
		<div className="markdown-body">
			<div dangerouslySetInnerHTML={{ __html: html }}></div>
		</div>
	)
})
