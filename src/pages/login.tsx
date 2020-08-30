import React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
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
import useFirebase from '~/hooks/useFirebase'
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

const SignIn: NextPage = () => {
  const classes = useStyles()
  const router = useRouter()
  const firebase = useFirebase()

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
    await firebase.auth().signInWithPopup(provider)
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
            onChange={handleChange}
            value={formValues.email}
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
            onChange={handleChange}
            value={formValues.password}
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

export default withAuth()(SignIn)
