import React from 'react'
import Head from 'next/head'
import Layout from '../src/Layout'
import withAuth from '../src/withAuth'

function Settings() {
  return (
    <Layout title="Settings">
      <Head>
        <title>Settings - Mdy</title>
      </Head>
      Settings
    </Layout>
  )
}

Settings.getInitialProps = () => {
  return {}
}

export default withAuth(Settings)
