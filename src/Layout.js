import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import MailIcon from '@material-ui/icons/Mail'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import firebaseApp from '../src/firebase'

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3)
  },
  accountIcon: {
    width: 40,
    height: 40
  }
}))

export default function Layout(props) {
  const classes = useStyles()

  // console.log('browser')
  // console.log(firebaseApp.auth().currentUser)
  // if (!firebaseApp.auth().currentUser) {
  //   return null
  // }
  // const { displayName, photoURL } = firebaseApp.auth().currentUser

  const [anchorEl, setAnchorEl] = React.useState(null)
  const [user, setUser] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  function MyAvatar() {
    if (user.photoURL) {
      return (
        <ListItemAvatar>
          <Avatar src={user.photoURL} />
        </ListItemAvatar>
      )
    } else {
      return (
        <ListItemIcon>
          <AccountCircleIcon className={classes.accountIcon} />
        </ListItemIcon>
      )
    }
  }

  function handleClick(event) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }

  async function handleLogOut() {
    await firebaseApp.auth().signOut()
    Router.push('/')
  }

  useEffect(() => {
    console.log('start effect')
    firebaseApp.auth().onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        return Router.push('/')
      }
      setUser(currentUser)
      setLoading(false)
      console.log('did effect')
      console.log(currentUser)
    })
  })

  if (loading) {
    return <div>loading...</div>
  }

  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper
        }}
        anchor="left"
      >
        <List>
          <ListItem
            button
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MyAvatar />
            <ListItemText primary={user.displayName} />
            <ListItemSecondaryAction>
              <ArrowDropDownIcon />
            </ListItemSecondaryAction>
          </ListItem>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem component="a" href="/profile/">
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogOut}>Logout</MenuItem>
          </Menu>
        </List>
        <Divider />
        <List>
          <ListItem button>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="All note" />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>{props.children}</main>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
}
Layout.getInitialProps = () => {
  console.log(1)
}
