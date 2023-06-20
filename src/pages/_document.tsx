import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <title>Lingpal</title>
        <meta name="description" content="A multiplayer game to practice language skills by playing the taboo game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/lingpal.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}