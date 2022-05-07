import '../styles/globals.css'
import Head from 'next/head'
import React from 'react'
import { AuthProvider, PageLayout } from '../components'
import { settings } from '/project/shared'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps, ...appProps }: AppProps) {
  console.log([settings.basePath + '/login', appProps.router.pathname ])
  const Layout = [settings.basePath + '/login'].some(p => p == appProps.router.pathname)
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
