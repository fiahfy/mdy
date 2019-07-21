import React from 'react'
import Router from 'next/router'
import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import firebase from 'firebase/app'
import app from '../src/firebase'
import withAuth from '../src/withAuth'

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

function SignIn() {
  const classes = useStyles()

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  async function afterSignIn() {
    const user = app.auth().currentUser
    await app
      .firestore()
      .collection('users')
      .doc(user.uid)
      .set({ uid: user.uid })
    Router.push('/notes')
  }

  function handleEmailChange(e) {
    setEmail(e.target.value)
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    await app.auth().signInWithEmailAndPassword(email, password)
    await afterSignIn()
  }

  async function handleClick() {
    const provider = new firebase.auth.GithubAuthProvider()
    await app.auth().signInWithPopup(provider)
    await afterSignIn()
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box mt={8} display="flex" flexDirection="column" alignItems="center">
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
            margin="normal"
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

export default withAuth()(SignIn)
