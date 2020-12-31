// TODO:
import React, { Component, useEffect } from 'react'
import * as PropTypes from 'prop-types'
import NextLink from 'next/link'
import Router from 'next/router'
import Error from 'next/error'
import firebase from 'firebase/app'
import SimpleMDE from 'react-simplemde-editor'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Fab from '@material-ui/core/Fab'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile'
import Layout from '~/components/Layout'
import Loader from '~/components/Loader'
import NoteListItem from '~/components/NoteListItem'
import withAuth from '~/hoc/withAuth'
import app from '~/firebase'

const debounce = (callback, milli) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      callback(...args)
    }, milli)
    return timer
  }
}

const styles = (theme) => ({
  '@global': {
    '.CodeMirror': {
      border: 'none',
    },
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
})

function Index(props) {
  const classes = makeStyles(styles)()

  const user = app.auth().currentUser

  const { id } = props

  const [loading, setLoading] = React.useState(true)
  const [notes, setNotes] = React.useState([])

  useEffect(() => {
    const unsubscribe = app
      .firestore()
      .collection(`users/${user.uid}/notes`)
      .where('deleted_at', '==', null)
      .orderBy('updated_at', 'desc')
      .limit(10)
      .onSnapshot((snapshot) => {
        const notes = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            ...data,
            id: doc.id,
          }
        })
        setNotes(notes)
        setLoading(false)
      })

    return () => unsubscribe()
  }, [user])

  function NewNoteFab() {
    async function handleClick() {
      const ref = await app
        .firestore()
        .collection(`users/${user.uid}/notes`)
        .add({
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
          updated_at: firebase.firestore.FieldValue.serverTimestamp(),
          deleted_at: null,
        })
      Router.push(`/notes?id=${ref.id}`)
    }

    return (
      <Fab
        aria-label="Add"
        className={classes.fab}
        color="primary"
        onClick={handleClick}
      >
        <AddIcon />
      </Fab>
    )
  }

  return (
    <Layout title="All Notes">
      {loading ? (
        <Loader />
      ) : notes.length ? (
        <>
          <List dense>
            {(() =>
              notes.map((note) => (
                <NextLink href={`/notes?id=${note.id}`} key={note.id} passHref>
                  <NoteListItem button note={note} selected={note.id === id} />
                </NextLink>
              )))()}
          </List>
          <NewNoteFab />
        </>
      ) : (
        <Container component="main">
          <Box alignItems="center" display="flex" flexDirection="column" mt={8}>
            <Box color="lightgray" fontSize={96}>
              <InsertDriveFileIcon fontSize="inherit" />
            </Box>
            <Typography align="center" variant="h6">
              Empty in notes
            </Typography>
            <Typography align="center" variant="body2">
              Create a note and it will show up here.
            </Typography>
          </Box>
          <NewNoteFab />
        </Container>
      )}
    </Layout>
  )
}

Index.propTypes = {
  id: PropTypes.string,
}

class InnerShow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      note: null,
      content: '',
    }

    this.user = app.auth().currentUser
    this.debounced = debounce(() => this.update(), 10 * 1000)
    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleDeleteClick = this.handleDeleteClick.bind(this)
  }

  handleTextChange(value) {
    this.setState({ content: value })
    this.lastEditedAt = new Date()
    this.timer = this.debounced()
  }

  async handleDeleteClick() {
    const { id } = this.props
    await app.firestore().doc(`users/${this.user.uid}/notes/${id}`).update({
      deleted_at: firebase.firestore.FieldValue.serverTimestamp(),
    })
    Router.push('/notes')
  }

  title() {
    const { content } = this.state
    const match = (content || '').match(/# (.*)\n?/)
    return match && match[1] ? match[1] : '(Untitled)'
  }

  async update() {
    const { id } = this.props
    const { content } = this.state
    await app.firestore().doc(`users/${this.user.uid}/notes/${id}`).update({
      content,
      edited_at: this.lastEditedAt,
      updated_at: firebase.firestore.FieldValue.serverTimestamp(),
    })
  }

  componentDidMount() {
    const { id } = this.props

    this.unsubscribe = app
      .firestore()
      .doc(`users/${this.user.uid}/notes/${id}`)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data()
          const note = {
            ...data,
            id: doc.id,
          }
          if (!this.lastEditedAt) {
            this.lastEditedAt = new Date()
            this.setState({ note, content: note.content || '# ' })
          } else if (
            note.edited_at &&
            note.edited_at.toMillis() > this.lastEditedAt.getTime()
          ) {
            this.setState({ note, content: note.content || '# ' })
          }
        }
        this.setState({ loading: false })
      })
  }

  componentWillUnmount() {
    this.unsubscribe()
    clearTimeout(this.timer)
    this.update()
  }

  render() {
    const { loading, note, content } = this.state

    if (loading) {
      return (
        <Layout>
          <Loader />
        </Layout>
      )
    }

    if (!note) {
      return <Error statusCode={404} />
    }

    return (
      <Layout
        menu={
          <IconButton
            aria-label="Delete Note"
            color="inherit"
            edge="end"
            onClick={this.handleDeleteClick}
          >
            <DeleteIcon />
          </IconButton>
        }
        title={this.title()}
      >
        <Box>
          <SimpleMDE
            onChange={this.handleTextChange}
            options={{
              minHeight: `${window.innerHeight}px`, // eslint-disable-line no-undef
              indentWithTabs: false,
              placeholder: '# Title',
              autofocus: true,
              toolbar: false,
              status: false,
            }}
            value={content}
          />
        </Box>
      </Layout>
    )
  }
}

InnerShow.propTypes = {
  id: PropTypes.string.isRequired,
}

const Show = withStyles(styles)(InnerShow)

function Notes(props) {
  const { id } = props

  const Component = id ? Show : Index

  return <Component id={id} />
}

Notes.propTypes = {
  id: PropTypes.string,
}

Notes.getInitialProps = ({ query }) => {
  return { id: query.id }
}

export default withAuth(true)(Notes)
