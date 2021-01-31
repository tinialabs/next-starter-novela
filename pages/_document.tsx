import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render(): JSX.Element {
    const Meta = require('@/content/theme/favicon.png')

    return (
      <Html lang="en">
        <Head>{Meta}</Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
