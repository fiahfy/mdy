import React, { useEffect } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Container from '@material-ui/core/Container'
import Loader from '~/components/Loader'
import useUser from '~/hooks/useUser'

const withAuth = (required = false) => {
  return (Page: NextPage): React.FC => {
    const WrappedComponent: NextPage = (props) => {
      const router = useRouter()
      const { user, loadingUser } = useUser()

      const [redirecting, setRedirecting] = React.useState(false)

      useEffect(() => {
        if (user && !required) {
          router.push('/settings')
          setRedirecting(true)
        } else if (!user && required) {
          router.push('/')
          setRedirecting(true)
        }
      }, [router, user, loadingUser])

      if (loadingUser || redirecting) {
        return (
          <Container component="main">
            <Loader />
          </Container>
        )
      }

      return <Page {...props} />
    }

    WrappedComponent.getInitialProps = Page.getInitialProps

    return WrappedComponent
  }
}

export default withAuth
