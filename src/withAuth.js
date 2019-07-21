import React, { useEffect } from 'react'
import Router from 'next/router'
import Container from '@material-ui/core/Container'
import Loader from '../src/Loader'
import app from '../src/firebase'

export default function withAuth(Component) {
  function WrappedComponent(props) {
    const loggedIn = !!app.auth().currentUser

    const [loading, setLoading] = React.useState(!loggedIn)

    useEffect(() => {
      const unsubscribe = app.auth().onAuthStateChanged((currentUser) => {
        if (!currentUser) {
          return Router.push('/')
        }
        setLoading(false)
      })

      return () => unsubscribe()
    })

    if (loading) {
      return (
        <Container component="main">
          <Loader />
        </Container>
      )
    }

    return <Component {...props} />
  }

  WrappedComponent.getInitialProps = async (ctx) => {
    return Component.getInitialProps ? await Component.getInitialProps(ctx) : {}
  }

  return WrappedComponent
}
