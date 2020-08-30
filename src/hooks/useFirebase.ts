import firebase from 'firebase/app'
import app from '../firebase'

const useFirebase = (): typeof firebase => {
  return app
}

export default useFirebase
