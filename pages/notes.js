import React, { useEffect } from 'react'
import Layout from '../src/Layout'
import app from '../src/firebase'
import withAuth from '../src/withAuth'

function Notes() {
  const [notes, setNotes] = React.useState([])

  const uid = app.auth().currentUser.uid

  useEffect(() => {
    const unsubscribe = app
      .firestore()
      .collection(`users/${uid}/notes`)
      .orderBy('title')
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

  console.log(notes)

  return (
    <Layout>
      {(() => {
        return notes.map((note) => {
          return <div key={note.id}>{note.title}</div>
        })
      })()}
    </Layout>
  )
}

Notes.getInitialProps = () => {
  return {}
}

export default withAuth(Notes)
