import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import NextLink from 'next/link'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Layout from '../src/Layout'
import app from '../src/firebase'
import withAuth from '../src/withAuth'

function Notes(props) {
  const [notes, setNotes] = React.useState([])

  const { id } = props

  const uid = app.auth().currentUser.uid

  useEffect(() => {
    const unsubscribe = app
      .firestore()
      .collection(`users/${uid}/notes`)
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
      })

    return () => unsubscribe()
  }, [uid])

  return (
    <Layout>
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
                  primary={note.title}
                  secondary={"I'll be in your neighborhood doing errands this"}
                />
              </ListItem>
            </NextLink>
          )))()}
      </List>
    </Layout>
  )
}

Notes.propTypes = {
  id: PropTypes.string
}

Notes.getInitialProps = ({ query }) => {
  return { id: query.id }
}

export default withAuth(Notes)
