import React from 'react'
import { NextPage } from 'next'
import firebase from 'firebase/app'
import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined'
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

const PasswordReset: NextPage = () => {
  const classes = useStyles()
  const [formValues, setFormValues] = React.useState({
    email: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ email: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await firebase.auth().sendPasswordResetEmail(formValues.email)
    setFormValues({ email: '' })
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box alignItems="center" display="flex" flexDirection="column" mt={8}>
        <Avatar className={classes.avatar}>
          <EmailOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset your password
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
          <Button
            className={classes.submit}
            color="primary"
            fullWidth
            type="submit"
            variant="contained"
          >
            Send password reset email
          </Button>
        </form>
      </Box>
    </Container>
  )
}

export default withAuth()(PasswordReset)
