import React, { useEffect } from 'react'
import Router from 'next/router'
import Container from '@material-ui/core/Container'
import Loader from './Loader'
import app from '../firebase'

export default function withAuth(required = false) {
  return (Component) => {
    function WrappedComponent(props) {
      const loggedIn = !!app.auth().currentUser

      const [loading, setLoading] = React.useState(!loggedIn)

      useEffect(() => {
        const unsubscribe = app.auth().onAuthStateChanged((currentUser) => {
          if (currentUser && !required) {
            return Router.push('/notes')
          }
          if (!currentUser && required) {
            return Router.push('/')
          }
          setLoading(false)
        })

        return () => unsubscribe()
      }, [])

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
      return Component.getInitialProps
        ? await Component.getInitialProps(ctx)
        : {}
    }

    return WrappedComponent
  }
}
