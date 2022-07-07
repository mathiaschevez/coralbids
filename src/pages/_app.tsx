import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Layout } from '../components'
import { SessionProvider } from 'next-auth/react'
import { StateContext } from '../context/StateContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StateContext>
      <SessionProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </StateContext>
  )
}

export default MyApp
