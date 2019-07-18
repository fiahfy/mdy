import React, { useEffect } from 'react'
import Router from 'next/router'
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'
import app from '../src/firebase'

const useStyles = makeStyles((theme) => ({
  loading: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}))

export default function withAuth(WrappedComponent) {
  function Component(props) {
    const classes = useStyles()

    const [loading, setLoading] = React.useState(true)

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
          <div className={classes.loading}>
            <CircularProgress />
          </div>
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
