import React, { Component, useEffect } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import NextLink from 'next/link'
import Router from 'next/router'
import Error from 'next/error'
import SimpleMDE from 'react-simplemde-editor'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import DeleteIcon from '@material-ui/icons/Delete'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile'
import NoteListItem from '../../src/NoteListItem'
import Layout from '../../src/Layout'
import Loader from '../../src/Loader'
import app from '../../src/firebase'
import withAuth from '../../src/withAuth'

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

const styles = () => ({
  '@global': {
    '.CodeMirror': {
      border: 'none'
    }
  }
})

function Index(props) {
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
            id: doc.id
          }
        })
        setNotes(notes)
        setLoading(false)
      })

    return () => unsubscribe()
  }, [user])

  return (
    <Layout title="All Notes">
      <Head>
        <title>All Notes - Mdy</title>
      </Head>
      {loading ? (
        <Loader />
      ) : notes.length ? (
        <List dense>
          {(() =>
            notes.map((note) => (
              <NextLink key={note.id} href={`/notes?id=${note.id}`} passHref>
                <NoteListItem button note={note} selected={note.id === id} />
              </NextLink>
            )))()}
        </List>
      ) : (
        <Container component="main" maxWidth="xs">
          <Box align="center" mt={8} color="lightgray" fontSize={96}>
            <InsertDriveFileIcon fontSize="inherit" />
          </Box>
          <Typography align="center" variant="h6">
            Empty in notes
          </Typography>
          <Typography align="center" variant="body2">
            Create a note and it will show up here.
          </Typography>
        </Container>
      )}
    </Layout>
  )
}

Index.propTypes = {
  id: PropTypes.string
}

class InnerShow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      note: null,
      content: ''
    }

    this.user = app.auth().currentUser
    this.debounced = debounce(() => this.update(), 3 * 1000)
    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleDeleteClick = this.handleDeleteClick.bind(this)
  }

  handleTextChange(value) {
    this.setState({ content: value })
    this.lastUpdatedAt = new Date()
    this.timer = this.debounced()
  }

  async handleDeleteClick() {
    const { id } = this.props
    await app
      .firestore()
      .doc(`users/${this.user.uid}/notes/${id}`)
      .update({
        deleted_at: new Date()
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
    await app
      .firestore()
      .doc(`users/${this.user.uid}/notes/${id}`)
      .update({
        content,
        updated_at: this.lastUpdatedAt
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
            id: doc.id
          }
          const lastUpdatedAt = this.lastUpdatedAt
          if (
            !lastUpdatedAt ||
            note.updated_at.toMillis() > lastUpdatedAt.getTime()
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
    if (this.lastUpdatedAt) {
      this.update()
    }
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
        title={this.title()}
        rightMenu={
          <IconButton
            aria-label="Delete Note"
            edge="end"
            color="inherit"
            onClick={this.handleDeleteClick}
          >
            <DeleteIcon />
          </IconButton>
        }
      >
        <Head>
          <title>{this.title()} - Mdy</title>
        </Head>
        <Box>
          <SimpleMDE
            value={content}
            onChange={this.handleTextChange}
            options={{
              minHeight: `${window.innerHeight}px`,
              indentWithTabs: false,
              placeholder: '# Title',
              autofocus: true,
              toolbar: false,
              status: false
            }}
          />
        </Box>
      </Layout>
    )
  }
}

InnerShow.propTypes = {
  id: PropTypes.string.isRequired
}

const Show = withStyles(styles)(InnerShow)

function Notes(props) {
  const { id } = props

  const Component = id ? Show : Index

  return <Component id={id} />
}

Notes.propTypes = {
  id: PropTypes.string
}

Notes.getInitialProps = ({ query }) => {
  return { id: query.id }
}

export default withAuth(Notes)
