import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined'
import withAuth from '../src/withAuth'
import app from '../src/firebase'

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

function PasswordReset() {
  const classes = useStyles()

  const [email, setEmail] = React.useState('')

  function handleEmailChange(e) {
    setEmail(e.target.value)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    await app.auth().sendPasswordResetEmail(email)
    setEmail('')
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box mt={8} display="flex" flexDirection="column" alignItems="center">
        <Avatar className={classes.avatar}>
          <EmailOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset your password
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Send password reset email
          </Button>
        </form>
      </Box>
    </Container>
  )
}

export default withAuth()(PasswordReset)
