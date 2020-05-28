import useMagicLink from 'use-magic-link'
// import useMagicLink from '../hooks/useMagicLink'
import Head from 'next/head'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from '../lib/theme'

export default function App({ Component, pageProps }) {
  const auth = useMagicLink(process.env.NEXT_PUBLIC_MAGIC_LINK_PUBLIC_KEY) || {}

  return (
    <>
      <Head>
        <title>Yes No Maybe</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} auth={auth} />
      </ThemeProvider>
    </>
  )
}
