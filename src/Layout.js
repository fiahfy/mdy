import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
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
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import SettingsIcon from '@material-ui/icons/Settings'
import app from '../src/firebase'

import AppBar from '@material-ui/core/AppBar'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  rootShift: {
    [theme.breakpoints.down('xs')]: {
      overflow: 'hidden'
    }
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
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
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`
    },
    [theme.breakpoints.down('xs')]: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    }
  },
  appBarShift: {
    [theme.breakpoints.down('xs')]: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    }
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    [theme.breakpoints.down('xs')]: {
      marginLeft: -drawerWidth,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    }
  },
  contentShift: {
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    }
  },
  mask: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'none'
  },
  maskShift: {
    [theme.breakpoints.down('xs')]: {
      display: 'block'
    }
  }
}))

export default function Layout(props) {
  const classes = useStyles()

  const user = app.auth().currentUser

  const { title } = props

  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState(null)

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen)
  }

  function handleDrawerClose(e) {
    e.stopPropagation()
    setMobileOpen(false)
  }

  function handleMenuShow(e) {
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

  const drawer = (
    <>
      <List>
        <ListItem
          button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleMenuShow}
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
          <NextLink href="/settings" passHref>
            <MenuItem dense>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </MenuItem>
          </NextLink>
          <Divider />
          <MenuItem dense onClick={handleLogOut}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </MenuItem>
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
            <ListItemText primary="All Notes" />
          </ListItem>
        </NextLink>
        <ListItem button onClick={handleNewNoteClick}>
          <ListItemIcon className={classes.addItemIcon}>
            <AddCircleOutlineIcon />
          </ListItemIcon>
          <ListItemText primary="New Note" className={classes.addItemText} />
        </ListItem>
      </List>
    </>
  )

  return (
    <div
      className={clsx(classes.root, {
        [classes.rootShift]: mobileOpen
      })}
    >
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: mobileOpen
        })}
      >
        <Toolbar variant="dense">
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        <Hidden smUp implementation="css">
          <Drawer
            variant="persistent"
            anchor="left"
            open={mobileOpen}
            classes={{
              paper: classes.drawerPaper
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: mobileOpen
        })}
      >
        <div className={classes.toolbar} />
        {props.children}
        <div
          className={clsx(classes.mask, {
            [classes.maskShift]: mobileOpen
          })}
          onClick={handleDrawerClose}
        />
      </main>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string
}
