import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

// function withLog(Comp) {
//   return (props) => {
//     // console.log("TCL: withLog -> props", props)
//     return <Comp {...props}/>
//   }
// }

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const sheet = new ServerStyleSheet()
		const originalRenderPage = ctx.renderPage
		try {
			ctx.renderPage = () =>
				originalRenderPage({
					enhanceApp: (App) => (props) =>
						sheet.collectStyles(<App {...props}></App>),
				})
			const props = await Document.getInitialProps(ctx)
			return {
				...props,
				style: (
					<div>
						{props.styles}
						{sheet.getStyleElement()}
					</div>
				),
			}
		} finally {
			sheet.seal()
		}
	}

	render() {
		return (
			<Html>
				<Head></Head>
				<body>
					<Main></Main>
					<NextScript></NextScript>
				</body>
			</Html>
		)
	}
}

export default MyDocument
