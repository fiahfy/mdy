import React from 'react'
import Layout from '../src/Layout'
import withAuth from '../src/withAuth'

function Settings() {
  return <Layout>Settings</Layout>
}

Settings.getInitialProps = () => {
  return {}
}

export default withAuth(Settings)
