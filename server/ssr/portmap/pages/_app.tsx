import '../styles/globals.css'
import Head from 'next/head'
import React from 'react'
import { AuthProvider, PageLayout } from '../components'
import type { AppProps } from 'next/app'

// default fontawesome
import { config, library } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { fas } from '@fortawesome/free-solid-svg-icons' 
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
config.autoAddCss = false
library.add(fas, far, fab)

// end default fontawesome


function MyApp({ Component, pageProps, ...appProps }: AppProps) {
  const Layout = ['/login'].some(p => p == appProps.router.pathname)
    ? React.Fragment
    : PageLayout

  return (
    <AuthProvider>
      <Head>
        <title>IT System</title>
        <link href="" rel="icon"/>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>

  )
}

export default MyApp
