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

const Login: NextPage = () => {
  const classes = useStyles()
  const router = useRouter()
  const [formValues, setFormValues] = React.useState({
    email: '',
    password: '',
  })

  const afterSignIn = async () => {
    const user = firebase.auth().currentUser
    if (!user) {
      return
    }
    await firebase
      .firestore()
      .collection('users')
      .doc(user.uid)
      .set({ uid: user.uid })
    router.push('/notes')
  }

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
      .signInWithEmailAndPassword(formValues.email, formValues.password)
    await afterSignIn()
  }

  const handleClick = async () => {
    const provider = new firebase.auth.GithubAuthProvider()
    await firebase.auth().signInWithRedirect(provider)
    await afterSignIn()
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box alignItems="center" display="flex" flexDirection="column" my={8}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            autoComplete="email"
            autoFocus
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
            Sign In
          </Button>
          <Button
            className={classes.submit}
            color="primary"
            fullWidth
            onClick={handleClick}
            variant="contained"
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

export default withAuth()(Login)
