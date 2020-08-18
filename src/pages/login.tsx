import React from 'react'
import { NextPage } from 'next'
import Router from 'next/router'
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
import app from '../firebase'

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

const SignIn: NextPage = () => {
  const classes = useStyles()

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  const afterSignIn = async () => {
    const user = app.auth().currentUser
    if (!user) {
      return
    }
    await app
      .firestore()
      .collection('users')
      .doc(user.uid)
      .set({ uid: user.uid })
    Router.push('/notes')
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await app.auth().signInWithEmailAndPassword(email, password)
    await afterSignIn()
  }

  const handleClick = async () => {
    const provider = new firebase.auth.GithubAuthProvider()
    await app.auth().signInWithPopup(provider)
    await afterSignIn()
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box my={8} display="flex" flexDirection="column" alignItems="center">
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            id="email"
            name="email"
            type="email"
            label="Email Address"
            autoComplete="email"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            autoFocus
            onChange={handleEmailChange}
            value={email}
          />
          <TextField
            id="password"
            name="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            onChange={handlePasswordChange}
            value={password}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleClick}
          >
            Sign In with GitHub
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/password-reset" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  )
}

export default SignIn
