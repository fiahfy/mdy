import React, { useEffect } from 'react'
import Router from 'next/router'
import Container from '@material-ui/core/Container'
import Loader from '../src/Loader'
import app from '../src/firebase'

export default function withAuth(WrappedComponent) {
  function Component(props) {
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
        <Container component="main" maxWidth="xs">
          <Loader />
        </Container>
      )
    }

    return <WrappedComponent {...props} />
  }

  Component.getInitialProps = async (ctx) => {
    return (
      WrappedComponent.getInitialProps &&
      (await WrappedComponent.getInitialProps(ctx))
    )
  }

  return Component
}
