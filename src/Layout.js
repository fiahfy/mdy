import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import NextLink from 'next/link'
import Router from 'next/router'
import firebase from 'firebase/app'
import AppBar from '@material-ui/core/AppBar'
import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Menu from '@material-ui/core/Menu'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import DeleteIcon from '@material-ui/icons/Delete'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile'
import MenuIcon from '@material-ui/icons/Menu'
import NoteAddIcon from '@material-ui/icons/NoteAdd'
import app from '../src/firebase'

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
  grow: {
    flexGrow: 1
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

function MyAvatar({ src }) {
  const classes = useStyles()

  if (src) {
    return (
      <ListItemAvatar>
        <Avatar src={src} />
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

export default function Layout(props) {
  const classes = useStyles()

  const user = app.auth().currentUser

  const { title, rightMenu } = props

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

  async function handleSignOut() {
    await app.auth().signOut()
    Router.push('/')
  }

  async function handleNewNoteClick() {
    const ref = await app
      .firestore()
      .collection(`users/${user.uid}/notes`)
      .add({
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        updated_at: firebase.firestore.FieldValue.serverTimestamp(),
        deleted_at: null
      })
    Router.push(`/notes?id=${ref.id}`)
  }

  const listItems = [
    { Icon: InsertDriveFileIcon, text: 'All Notes', href: '/notes' },
    { Icon: DeleteIcon, text: 'Trash', href: '/notes/trash' }
  ]

  const drawer = (
    <>
      <List dense>
        <ListItem
          button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleMenuShow}
        >
          <MyAvatar src={user.photoURL} />
          <ListItemText>
            <Box overflow="hidden" textOverflow="ellipsis">
              {user.displayName}
            </Box>
          </ListItemText>
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
        >
          <NextLink href="/settings" passHref>
            <ListItem dense button>
              <ListItemText primary="Settings" />
            </ListItem>
          </NextLink>
          <Divider />
          <ListItem dense button onClick={handleSignOut}>
            <ListItemText primary="Sign out" />
          </ListItem>
        </Menu>
      </List>
      <Divider />
      <List dense>
        <ListItem button onClick={handleNewNoteClick}>
          <ListItemIcon>
            <NoteAddIcon />
          </ListItemIcon>
          <ListItemText primary="New Note" />
        </ListItem>
      </List>
      <Divider />
      <List dense>
        {(() =>
          listItems.map(({ Icon, text, href }, i) => (
            <NextLink key={i} href={href} passHref>
              <ListItem button selected={Router.pathname === href}>
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            </NextLink>
          )))()}
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
        <Toolbar>
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
          <div className={classes.grow} />
          {rightMenu}
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
  title: PropTypes.string,
  rightMenu: PropTypes.node
}
