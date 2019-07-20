import React, { Component, useEffect } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import NextLink from 'next/link'
import Error from 'next/error'
import SimpleMDE from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'
import Box from '@material-ui/core/Box'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Layout from '../src/Layout'
import Loader from '../src/Loader'
import app from '../src/firebase'
import withAuth from '../src/withAuth'

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
  },
  listItemSecondaryText: {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    minHeight: 40
  },
  textarea: {
    width: '100%'
  }
})

function Index(props) {
  const classes = makeStyles(styles)

  const { id, user } = props

  const [loading, setLoading] = React.useState(true)
  const [notes, setNotes] = React.useState([])

  function title(note) {
    const match = (note.content || '').match(/# (.*)\n?/)
    return match && match[1] ? match[1] : '(Untitled)'
  }

  function body(note) {
    const replaced = (note.content || '').replace(/# (.*)\n?/, '')
    return replaced
  }

  useEffect(() => {
    const unsubscribe = app
      .firestore()
      .collection(`users/${user.uid}/notes`)
      .orderBy('updated_at', 'desc')
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
    <Layout user={user} title="All Notes">
      <Head>
        <title>All Notes - Mdy</title>
      </Head>
      {loading ? (
        <Loader />
      ) : (
        <List>
          {(() =>
            notes.map((note, i) => (
              <NextLink key={i} href={`/notes?id=${note.id}`} passHref>
                <ListItem
                  alignItems="flex-start"
                  button
                  selected={note.id === id}
                >
                  <ListItemText
                    primary={title(note)}
                    secondary={body(note)}
                    secondaryTypographyProps={{
                      className: classes.listItemSecondaryText
                    }}
                  />
                </ListItem>
              </NextLink>
            )))()}
        </List>
      )}
    </Layout>
  )
}

Index.propTypes = {
  id: PropTypes.string,
  user: PropTypes.object.isRequired
}

class InnerShow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      note: null,
      content: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.debounced = debounce(() => this.update(), 3 * 1000)
  }

  handleChange(value) {
    this.setState({ content: value })
    this.lastUpdatedAt = new Date()
    this.timer = this.debounced()
  }

  title() {
    const { content } = this.state
    const match = (content || '').match(/# (.*)\n?/)
    return match && match[1] ? match[1] : '(Untitled)'
  }

  async update() {
    const { id, user } = this.props
    const { content } = this.state
    await app
      .firestore()
      .doc(`users/${user.uid}/notes/${id}`)
      .update({
        content,
        updated_at: this.lastUpdatedAt
      })
    console.log('update')
  }

  componentDidMount() {
    const { id, user } = this.props

    this.unsubscribe = app
      .firestore()
      .doc(`users/${user.uid}/notes/${id}`)
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
    const { user } = this.props
    const { loading, note, content } = this.state

    if (loading) {
      return (
        <Layout user={user}>
          <Loader />
        </Layout>
      )
    }

    if (!note) {
      return <Error statusCode={404} />
    }

    return (
      <Layout user={user} title={this.title()}>
        <Head>
          <title>{this.title()} - Mdy</title>
        </Head>
        <Box>
          <SimpleMDE
            value={content}
            onChange={this.handleChange}
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
  id: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired
}

const Show = withStyles(styles)(InnerShow)

function Notes(props) {
  const { id } = props

  const user = app.auth().currentUser

  const Component = id ? Show : Index

  return <Component id={id} user={user} />
}

Notes.propTypes = {
  id: PropTypes.string
}

Notes.getInitialProps = ({ query }) => {
  return { id: query.id }
}

export default withAuth(Notes)
