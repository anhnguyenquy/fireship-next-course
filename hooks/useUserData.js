import { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { collection, doc, onSnapshot } from 'firebase/firestore'
import { auth, firestore } from '../lib'

export const useUserData = () => {
  const [user] = useAuthState(auth)
  const [username, setUsername] = useState('')
  useEffect(() => {
    let unsubscribe
    if (user) {
      const collectionRef = collection(firestore, 'users')
      const docRef = doc(collectionRef, user.uid)
      // If docRef's content on the server is changed, the callback will be called.
      unsubscribe = onSnapshot(docRef, doc => {
        setUsername(doc.data()?.username)
      })
    }
    else {
      setUsername('')
    }
  }, [user])
  return { user, username }
}