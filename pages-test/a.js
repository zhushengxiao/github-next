import { withRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import styled from 'styled-components'
import dynamic from 'next/dynamic'
// import moment from 'moment'

const Title = styled.h1`
	color: green;
	font-size: 40px;
`

//异步加载组件
const Comp = dynamic(import('../components/Comp'))

const A = ({ router, name, time }) => (
	<div>
		<Title>标题 {time}</Title>
		<Comp></Comp>
		<Link href="#aa">
			<div>
				aaaab {router.query.id} {name}
			</div>
		</Link>
		<style jsx>{`
			div {
				color: blue;
			}
		`}</style>
	</div>
)

A.getInitialProps = async () => {
	const moment = await import('moment')
	return {
		name: 'jack',
		time: moment.default(Date.now() - 60 * 1000).fromNow(),
	}
}
export default withRouter(A)
