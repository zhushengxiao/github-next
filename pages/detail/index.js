import withRopoBasic from '../../components/with-repo-basic'
import { request } from '../../lib/api'
import dynamic from 'next/dynamic'
import { withRouter } from 'next/router'

const MDRenderer = dynamic(() => import('../../components/MarkdownRenderer'), {
	loading: () => <p>Loading</p>,
}) // 动态导入

const Detail = ({ readme }) => {
	return <MDRenderer content={readme.content} isBase64={true} />
}
Detail.getInitialProps = async ({
	ctx: {
		query: { owner, name },
		req,
		res,
	},
}) => {
	const readmeResp = await request(
		{
			url: `/repos/${owner}/${name}/readme`,
		},
		req,
		res
	)
	// console.log('rademeResp', readmeResp.data)

	return {
		readme: readmeResp.data,
	}
}

export default withRopoBasic(Detail)
