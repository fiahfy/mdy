import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import NextLink from 'next/link'
import Error from 'next/error'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Layout from '../src/Layout'
import Loader from '../src/Loader'
import app from '../src/firebase'
import withAuth from '../src/withAuth'

function Index(props) {
  const uid = app.auth().currentUser.uid

  const { id } = props

  const [notes, setNotes] = React.useState([])

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
    <Layout title="All Notes">
      <Head>
        <title>All Notes - Mdy</title>
      </Head>
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

Index.propTypes = {
  id: PropTypes.string
}

function Show(props) {
  const uid = app.auth().currentUser.uid

  const { id } = props

  const [loading, setLoading] = React.useState(true)
  const [note, setNote] = React.useState(null)

  useEffect(() => {
    app
      .firestore()
      .doc(`users/${uid}/notes/${id}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setNote(doc.data())
        }
        console.log(1)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return <Loader />
  } else if (!note) {
    return <Error statusCode={404} />
  } else {
    return (
      <Layout title={String(note.title)}>
        <Head>
          <title>{note.title} - Mdy</title>
        </Head>
        <div>{note.title}</div>
      </Layout>
    )
  }
}

Show.propTypes = {
  id: PropTypes.string.isRequired
}

function Notes(props) {
  const { id } = props

  return id ? <Show id={id} /> : <Index id={id} />
}

Notes.propTypes = {
  id: PropTypes.string
}

Notes.getInitialProps = ({ query }) => {
  return { id: query.id }
}

export default withAuth(Notes)
