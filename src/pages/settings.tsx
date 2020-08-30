import React from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import useFirebase from '~/hooks/useFirebase'
import useUser from '~/hooks/useUser'
import Layout from '../components/Layout'
import withAuth from '~/hoc/withAuth'

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

const Settings: NextPage = () => {
  const classes = useStyles()
  const firebase = useFirebase()
  const { user } = useUser()

  const [formValues, setFormValues] = React.useState({
    displayName: user?.displayName ?? '',
    photoURL: user?.photoURL ?? '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues((formValues) => ({
      ...formValues,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await firebase.auth().currentUser?.updateProfile({
      displayName: formValues.displayName,
      photoURL: formValues.photoURL,
    })
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
              onChange={handleChange}
              value={formValues.displayName}
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
              onChange={handleChange}
              value={formValues.photoURL}
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
