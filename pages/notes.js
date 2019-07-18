import React, { useEffect } from 'react'
import Layout from '../src/Layout'
import app from '../src/firebase'

export default function Notes() {
  const [notes, setNotes] = React.useState(null)

  useEffect(() => {
    if (!app.auth().currentUser) {
      return
    }
    app
      .firestore()
      .collection(`users/${app.auth().currentUser.uid}/notes`)
      .get()
      .docs.map((doc) => {
        const data = doc.data()
        return {
          ...data,
          id: doc.id
        }
      })
      .then((notes) => {
        setNotes(notes)
      })
  })

  console.log(notes)

  return <Layout>Notes</Layout>
}

Notes.getInitialProps = () => {
  return {}
}
