import React from 'react'
import firebase from '~/firebase'

type Props = {
  user: firebase.User | null
  loadingUser: boolean
}

const UserContext = React.createContext<Props>({
  user: null,
  loadingUser: false,
})

export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = React.useState<firebase.User | null>(null)
  const [loadingUser, setLoadingUser] = React.useState(true) // Helpful, to update the UI accordingly.

  React.useEffect(() => {
    // Listen authenticated user
    const unsubscriber = firebase.auth().onAuthStateChanged(async (user) => {
      setLoadingUser(true)
      try {
        if (user) {
          // User is signed in.
          // You could also look for the user doc in your Firestore (if you have one):
          // const userDoc = await firebase.firestore().doc(`users/${uid}`).get()
          setUser(user)
        } else {
          setUser(null)
        }
      } catch (error) {
        // Most probably a connection error. Handle appropriately.
      } finally {
        setLoadingUser(false)
      }
    })

    // Unsubscribe auth listener on unmount
    return () => unsubscriber()
  }, [])

  return (
    <UserContext.Provider value={{ user, loadingUser }}>
      {children}
    </UserContext.Provider>
  )
}

// Custom hook that shorhands the context!
const useUser = (): Props => React.useContext(UserContext)

export default useUser
