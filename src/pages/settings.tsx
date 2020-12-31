import React from 'react'
import { NextPage } from 'next'
import firebase from 'firebase/app'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import Layout from '~/components/Layout'
import withAuth from '~/hoc/withAuth'
import useUser from '~/hooks/useUser'

const useStyles = makeStyles((theme) => ({
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
      <Container maxWidth="xs">
        <Box alignItems="center" display="flex" flexDirection="column" mt={3}>
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              autoComplete="nickname"
              autoFocus
              fullWidth
              id="nickname"
              label="Display Name"
              margin="normal"
              name="nickname"
              onChange={handleChange}
              required
              value={formValues.displayName}
              variant="outlined"
            />
            <TextField
              autoComplete="url"
              fullWidth
              id="photo"
              label="Photo URL"
              margin="normal"
              name="photo"
              onChange={handleChange}
              type="url"
              value={formValues.photoURL}
              variant="outlined"
            />
            <Button
              className={classes.submit}
              color="primary"
              fullWidth
              type="submit"
              variant="contained"
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
