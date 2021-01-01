import React from 'react'
import { NextPage } from 'next'
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
import { makeStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile'
import Layout from '~/components/Layout'
import Loader from '~/components/Loader'
import NoteListItem from '~/components/NoteListItem'
import { Note } from '~/models'
import withAuth from '~/hoc/withAuth'
import useUser from '~/hooks/useUser'

const debounce = <T extends any[]>(
  callback: (...args: T) => any,
  milli: number
) => {
  let timer: number
  return (...args: T) => {
    clearTimeout(timer)
    timer = window.setTimeout(() => {
      callback(...args)
    }, milli)
    return timer
  }
}

const useStyles = makeStyles((theme) => ({
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
}))

const IndexList: React.FC = () => {
  const classes = useStyles()
  const { user } = useUser()
  const [loading, setLoading] = React.useState(true)
  const [notes, setNotes] = React.useState<Note[]>([])

  React.useEffect(() => {
    if (!user) {
      return
    }
    const unsubscribe = firebase
      .firestore()
      .collection(`users/${user.uid}/notes`)
      .where('deleted_at', '==', null)
      .orderBy('updated_at', 'desc')
      .limit(10)
      .onSnapshot((snapshot) => {
        const notes = snapshot.docs.map((doc) => {
          const data = doc.data() as Note
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

  const NewNoteFab = () => {
    async function handleClick() {
      if (!user) {
        return
      }
      const ref = await firebase
        .firestore()
        .collection(`users/${user.uid}/notes`)
        .add({
          content: '',
          edited_at: null,
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
            {notes.map((note) => (
              <NextLink href={`/notes?id=${note.id}`} key={note.id} passHref>
                <NoteListItem button note={note} />
              </NextLink>
            ))}
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

const IndexShow: React.FC<{ id: string }> = (props) => {
  const { id } = props

  const { user } = useUser()
  const [loading, setLoading] = React.useState(true)
  const [note, setNote] = React.useState<Note>()
  const [content, setContent] = React.useState('')
  const [lastEditedAt, setLastEditedAt] = React.useState<Date>()
  const [timer, setTimer] = React.useState<number>()
  const title = React.useMemo(() => {
    const match = (content || '').match(/# (.*)\n?/)
    return match && match[1] ? match[1] : '(Untitled)'
  }, [content])
  const update = React.useCallback(
    async (content: string, lastEditedAt?: Date) => {
      if (!user || !lastEditedAt) {
        return
      }
      await firebase.firestore().doc(`users/${user.uid}/notes/${id}`).update({
        content,
        edited_at: lastEditedAt,
        updated_at: firebase.firestore.FieldValue.serverTimestamp(),
      })
    },
    [id, user]
  )
  const debounced = React.useCallback(debounce(update, 3 * 1000), [])
  React.useEffect(() => {
    if (!user) {
      return
    }
    const unsubscribe = firebase
      .firestore()
      .doc(`users/${user.uid}/notes/${id}`)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data() as Note
          const note = {
            ...data,
            id: doc.id,
          }
          if (!lastEditedAt) {
            setLastEditedAt(new Date())
            setNote(note)
            setContent(note.content || '# ')
          } else if (
            note.edited_at &&
            note.edited_at.toMillis() > lastEditedAt.getTime()
          ) {
            setNote(note)
            setContent(note.content || '# ')
          }
        }
        setLoading(false)
      })
    return () => {
      unsubscribe()
      clearTimeout(timer)
      // TODO: last update
    }
  }, [id, user])

  const handleTextChange = (value: string) => {
    setContent(value)
    setLastEditedAt(new Date())
    setTimer(debounced(content, lastEditedAt))
  }

  const handleDeleteClick = async () => {
    if (!user) {
      return
    }
    await firebase.firestore().doc(`users/${user.uid}/notes/${id}`).update({
      deleted_at: firebase.firestore.FieldValue.serverTimestamp(),
    })
    Router.push('/notes')
  }

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
          onClick={handleDeleteClick}
        >
          <DeleteIcon />
        </IconButton>
      }
      title={title}
    >
      <Box>
        <SimpleMDE
          onChange={handleTextChange}
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

const Index: NextPage<{ id: string | string[] }> = (props) => {
  let { id } = props

  if (Array.isArray(id)) {
    id = id[0]
  }

  return id ? <IndexShow id={id} /> : <IndexList />
}

Index.getInitialProps = ({ query }) => {
  return { id: query.id }
}

export default withAuth(true)(Index)
