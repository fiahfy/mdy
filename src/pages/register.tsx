import React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import firebase from 'firebase/app'
import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Link from '~/components/Link'
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

const Register: NextPage = () => {
  const classes = useStyles()
  const router = useRouter()
  const [formValues, setFormValues] = React.useState({
    displayName: '',
    email: '',
    password: '',
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
    await firebase
      .auth()
      .createUserWithEmailAndPassword(formValues.email, formValues.password)
    await firebase
      .auth()
      .currentUser?.updateProfile({ displayName: formValues.displayName })
    router.push('/notes')
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box alignItems="center" display="flex" flexDirection="column" mt={8}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
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
            autoComplete="email"
            fullWidth
            id="email"
            label="Email Address"
            margin="normal"
            name="email"
            onChange={handleChange}
            required
            type="email"
            value={formValues.email}
            variant="outlined"
          />
          <TextField
            autoComplete="current-password"
            fullWidth
            id="password"
            label="Password"
            margin="normal"
            name="password"
            onChange={handleChange}
            required
            type="password"
            value={formValues.password}
            variant="outlined"
          />
          <Button
            className={classes.submit}
            color="primary"
            fullWidth
            type="submit"
            variant="contained"
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  )
}

export default withAuth()(Register)
