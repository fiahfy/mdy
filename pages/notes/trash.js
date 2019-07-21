import React from 'react'
import Head from 'next/head'
import Layout from '../../src/Layout'
import withAuth from '../../src/withAuth'

function Trash() {
  return (
    <Layout title="Trash">
      <Head>
        <title>Trash - Mdy</title>
      </Head>
      Trash
    </Layout>
  )
}

Trash.getInitialProps = () => {
  return {}
}

export default withAuth(Trash)
