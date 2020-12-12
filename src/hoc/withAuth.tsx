import React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Container from '@material-ui/core/Container'
import Loader from '~/components/Loader'
import useUser from '~/hooks/useUser'

const withAuth = (required = false) => {
  return (WrappedComponent: NextPage): NextPage => {
    const Page: NextPage = (props) => {
      const router = useRouter()
      const { user, loadingUser } = useUser()
      const [redirecting, setRedirecting] = React.useState(false)

      React.useEffect(() => {
        if (user && !required) {
          router.push('/settings')
          setRedirecting(true)
        } else if (!user && required) {
          router.push('/')
          setRedirecting(true)
        }
      }, [router, user])

      if (loadingUser || redirecting) {
        return (
          <Container component="main">
            <Loader />
          </Container>
        )
      }

      return <WrappedComponent {...props} />
    }

    Page.getInitialProps = WrappedComponent.getInitialProps

    return Page
  }
}

export default withAuth
