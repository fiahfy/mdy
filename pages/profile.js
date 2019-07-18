import React from 'react'
import Layout from '../src/Layout'
import withAuth from '../src/withAuth'

function Profile() {
  return <Layout>Profile</Layout>
}

Profile.getInitialProps = () => {
  return {}
}

export default withAuth(Profile)
