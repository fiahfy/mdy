import React from 'react'
import { NextPage } from 'next'
import firebase from 'firebase/app'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import DeleteIcon from '@material-ui/icons/Delete'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import Layout from '~/components/Layout'
import Loader from '~/components/Loader'
import NoteListItem from '~/components/NoteListItem'
import { Note } from '~/models'
import withAuth from '~/hoc/withAuth'
import useUser from '~/hooks/useUser'

const Trash: NextPage = () => {
  const { user } = useUser()
  const [loading, setLoading] = React.useState(true)
  const [notes, setNotes] = React.useState<Note[]>([])

  async function handleDeleteClick() {
    if (!user) {
      return
    }
    const batch = firebase.firestore().batch()
    for (const { id } of notes) {
      const ref = firebase.firestore().doc(`users/${user.uid}/notes/${id}`)
      batch.delete(ref)
    }
    await batch.commit()
  }

  React.useEffect(() => {
    if (!user) {
      return
    }
    const unsubscribe = firebase
      .firestore()
      .collection(`users/${user.uid}/notes`)
      .where('deleted_at', '>', new Date(0))
      .orderBy('deleted_at', 'desc')
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

  return (
    <Layout
      menu={
        <IconButton
          aria-label="Delete Note"
          color="inherit"
          edge="end"
          onClick={handleDeleteClick}
        >
          <DeleteSweepIcon />
        </IconButton>
      }
      title="Trash"
    >
      {loading ? (
        <Loader />
      ) : notes.length ? (
        <List dense>
          {notes.map((note) => (
            <NoteListItem key={note.id} note={note} />
          ))}
        </List>
      ) : (
        <Container component="main">
          <Box alignItems="center" display="flex" flexDirection="column" mt={8}>
            <Box color="lightgray" fontSize={96}>
              <DeleteIcon fontSize="inherit" />
            </Box>
            <Typography align="center" variant="h6">
              Empty in deleted notes
            </Typography>
            <Typography align="center" variant="body2">
              Delete a note and it will show up here.
            </Typography>
          </Box>
        </Container>
      )}
    </Layout>
  )
}

export default withAuth(true)(Trash)
