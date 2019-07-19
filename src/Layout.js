import React from 'react'
import PropTypes from 'prop-types'
import NextLink from 'next/link'
import Router from 'next/router'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListSubheader from '@material-ui/core/ListSubheader'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'
import { grey } from '@material-ui/core/colors'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import MoveToInboxIcon from '@material-ui/icons/MoveToInbox'
import AddIcon from '@material-ui/icons/Add'
import app from '../src/firebase'

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
    flexGrow: 1
  },
  accountIcon: {
    width: 40,
    height: 40
  },
  menuPaper: {
    width: drawerWidth - theme.spacing(2) * 2
  },
  addItemIcon: {
    color: grey[600]
  },
  addItemText: {
    color: grey[600]
  }
}))

export default function Layout(props) {
  const classes = useStyles()

  const user = app.auth().currentUser

  const [anchorEl, setAnchorEl] = React.useState(null)

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
      .set({
        title: Date.now(),
        created_at: new Date(),
        updated_at: new Date()
      })
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
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
            getContentAnchorEl={null}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            classes={{ paper: classes.menuPaper }}
          >
            <NextLink href="/profile" passHref>
              <MenuItem component="a" href="/profile">
                Profile
              </MenuItem>
            </NextLink>
            <Divider />
            <MenuItem onClick={handleLogOut}>Logout</MenuItem>
          </Menu>
        </List>
        <Divider />
        <List dense>
          <ListSubheader>Notes</ListSubheader>
          <NextLink href="/notes" passHref>
            <ListItem button>
              <ListItemIcon>
                <MoveToInboxIcon />
              </ListItemIcon>
              <ListItemText primary="All notes" />
            </ListItem>
          </NextLink>
          <ListItem button onClick={handleNewNoteClick}>
            <ListItemIcon className={classes.addItemIcon}>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="New note" className={classes.addItemText} />
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
