import React from 'react'
import Head from 'next/head'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import Layout from '../utils/Layout'
import app from '../utils/firebase'
import withAuth from '../utils/withAuth'

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}))

function Settings() {
  const classes = useStyles()

  const user = app.auth().currentUser

  const [displayName, setDisplayName] = React.useState(user.displayName || '')
  const [photoURL, setPhotoURL] = React.useState(user.photoURL || '')
  const [, updateState] = React.useState()
  const forceUpdate = React.useCallback(() => updateState({}), [])

  function handleDisplayNameChange(e) {
    setDisplayName(e.target.value)
  }

  function handlePhotoURLChange(e) {
    setPhotoURL(e.target.value)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    await app.auth().currentUser.updateProfile({
      displayName,
      photoURL
    })
    forceUpdate()
  }

  return (
    <Layout title="Settings">
      <Head>
        <title>Settings - Mdy</title>
      </Head>
      <Container maxWidth="xs">
        <Box mt={3} display="flex" flexDirection="column" alignItems="center">
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              id="nickname"
              name="nickname"
              label="Display Name"
              autoComplete="nickname"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              autoFocus
              onChange={handleDisplayNameChange}
              value={displayName}
            />
            <TextField
              id="photo"
              name="photo"
              type="url"
              label="Photo URL"
              autoComplete="url"
              variant="outlined"
              margin="normal"
              fullWidth
              onChange={handlePhotoURLChange}
              value={photoURL}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Save
            </Button>
          </form>
        </Box>
      </Container>
    </Layout>
  )
}

export default withAuth(true)(Settings)
