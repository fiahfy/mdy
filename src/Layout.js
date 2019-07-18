import React from 'react'
import PropTypes from 'prop-types'
import NextLink from 'next/link'
import Router from 'next/router'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListSubheader from '@material-ui/core/ListSubheader'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import MoveToInboxIcon from '@material-ui/icons/MoveToInbox'
import AddIcon from '@material-ui/icons/Add'
import { makeStyles } from '@material-ui/core/styles'
import app from '../src/firebase'

const drawerWidth = 240

const useStyles = makeStyles(() => ({
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
    flexGrow: 1
  },
  accountIcon: {
    width: 40,
    height: 40
  }
}))

export default function Layout(props) {
  const classes = useStyles()

  const [anchorEl, setAnchorEl] = React.useState(null)

  const user = app.auth().currentUser

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

  function handleMenuClick(e) {
    setAnchorEl(e.currentTarget)
  }

  function handleMenuClose() {
    setAnchorEl(null)
  }

  async function handleLogOut() {
    await app.auth().signOut()
    Router.push('/')
  }

  async function handleNewNoteClick() {
    await app
      .firestore()
      .collection(`users/${app.auth().currentUser.uid}/notes`)
      .doc()
      .set({ title: Date.now() })
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
            onClick={handleMenuClick}
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
            onClose={handleMenuClose}
          >
            <NextLink href="/profile" passHref>
              <MenuItem component="a" href="/profile">
                Profile
              </MenuItem>
            </NextLink>
            <MenuItem onClick={handleLogOut}>Logout</MenuItem>
          </Menu>
        </List>
        <Divider />
        <List>
          <ListSubheader>
            New note
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="New note"
                onClick={handleNewNoteClick}
              >
                <AddIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListSubheader>
          <NextLink href="/notes" passHref>
            <ListItem button>
              <ListItemIcon>
                <MoveToInboxIcon />
              </ListItemIcon>
              <ListItemText primary="All notes" />
            </ListItem>
          </NextLink>
        </List>
      </Drawer>
      <main className={classes.content}>{props.children}</main>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
}
