import firebase from 'firebase/app'

export type Note = {
  id: string
  content: string
  edited_at: firebase.firestore.Timestamp | null
  created_at: firebase.firestore.Timestamp
  updated_at: firebase.firestore.Timestamp | null
  deleted_at: firebase.firestore.Timestamp | null
}
