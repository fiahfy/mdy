import React from 'react'
import clsx from 'clsx'
import Head from 'next/head'
import { useRouter } from 'next/router'
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
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import DeleteIcon from '@material-ui/icons/Delete'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile'
import MenuIcon from '@material-ui/icons/Menu'
import NoteAddIcon from '@material-ui/icons/NoteAdd'
import Link from '~/components/Link'
import useUser from '~/hooks/useUser'

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  rootShift: {
    [theme.breakpoints.down('xs')]: {
      overflow: 'hidden',
    },
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  accountIcon: {
    width: 40,
    height: 40,
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
    },
    [theme.breakpoints.down('xs')]: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
  },
  appBarShift: {
    [theme.breakpoints.down('xs')]: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  grow: {
    flexGrow: 1,
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    [theme.breakpoints.down('xs')]: {
      marginLeft: -drawerWidth,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
  },
  contentShift: {
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  },
  mask: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'none',
  },
  maskShift: {
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
}))

const MyAvatar: React.FC<{ src: string | null }> = (props) => {
  const { src } = props

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

const Layout: React.FC<{ menu?: React.ReactNode; title?: string }> = (
  props
) => {
  const { menu, title } = props

  const classes = useStyles()
  const router = useRouter()
  const { user } = useUser()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)

  if (!user) {
    return null
  }

  const handleClickMenuButton = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleClickMask = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMobileOpen(false)
  }

  const handleClickAccount = (e: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(e.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleClickSignOut = async () => {
    await firebase.auth().signOut()
    router.push('/')
  }

  const handleClickNew = async () => {
    const ref = await firebase
      .firestore()
      .collection(`users/${user.uid}/notes`)
      .add({
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        updated_at: firebase.firestore.FieldValue.serverTimestamp(),
        deleted_at: null,
      })
    router.push(`/notes?id=${ref.id}`)
  }

  const listItems = [
    { Icon: InsertDriveFileIcon, text: 'All Notes', href: '/notes' },
    { Icon: DeleteIcon, text: 'Trash', href: '/notes/trash' },
  ]

  const drawer = (
    <>
      <List>
        <ListItem
          aria-controls="simple-menu"
          aria-haspopup="true"
          button
          onClick={handleClickAccount}
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
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          getContentAnchorEl={null}
          id="simple-menu"
          keepMounted
          onClose={handleCloseMenu}
          open={Boolean(anchorEl)}
        >
          <MenuItem component={Link} href="/settings" naked>
            Settings
          </MenuItem>
          <MenuItem onClick={handleClickSignOut}>Sign out</MenuItem>
        </Menu>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleClickNew}>
          <ListItemIcon>
            <NoteAddIcon />
          </ListItemIcon>
          <ListItemText primary="New Note" />
        </ListItem>
      </List>
      <Divider />
      <List>
        {(() =>
          listItems.map(({ Icon, text, href }, i) => (
            <ListItem
              button
              component={Link}
              href={href}
              key={i}
              naked
              selected={router.pathname === href}
            >
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          )))()}
      </List>
    </>
  )

  return (
    <>
      <Head>{title && <title>{title} - Mdy</title>}</Head>
      <div
        className={clsx(classes.root, {
          [classes.rootShift]: mobileOpen,
        })}
      >
        <AppBar
          className={clsx(classes.appBar, {
            [classes.appBarShift]: mobileOpen,
          })}
          position="fixed"
        >
          <Toolbar>
            <IconButton
              aria-label="Open drawer"
              className={classes.menuButton}
              color="inherit"
              edge="start"
              onClick={handleClickMenuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography noWrap variant="h6">
              {title}
            </Typography>
            <div className={classes.grow} />
            {menu}
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer}>
          <Hidden smUp>
            <Drawer
              anchor="left"
              classes={{
                paper: classes.drawerPaper,
              }}
              open={mobileOpen}
              variant="persistent"
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown>
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              open
              variant="permanent"
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: mobileOpen,
          })}
        >
          <div className={classes.toolbar} />
          {props.children}
          <div
            className={clsx(classes.mask, {
              [classes.maskShift]: mobileOpen,
            })}
            onClick={handleClickMask}
          />
        </main>
      </div>
    </>
  )
}

export default Layout
