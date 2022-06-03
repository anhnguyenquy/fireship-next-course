import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore, collection, query, where, getDocs, limit } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyCRsqW124UF9DCfy5KxTrMqSKNqd1M32Eo',
  authDomain: 'fireship-course-75428.firebaseapp.com',
  databaseURL: 'https://fireship-course-75428-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'fireship-course-75428',
  storageBucket: 'fireship-course-75428.appspot.com',
  messagingSenderId: '903618039752',
  appId: '1:903618039752:web:cb47a5a7695f7d65c77afd',
  measurementId: 'G-VW1Z05EYVK',
}

const app = initializeApp(firebaseConfig)
// getAnalytics(app) // enable in production only

export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const firestore = getFirestore(app)
export const storage = getStorage(app)

/**`
 * Gets a users/{uid} document with username
 * @param {string} username
 */
export async function getUserWithUsername(username) {
  const usersRef = collection(firestore, 'users')
  const q = query(usersRef, where('username', '==', username), limit(1))
  const userDoc = (await getDocs(q)).docs[0]
  return userDoc
}

/**`
 * Converts a firestore document to JSON
 * @param {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
  const data = doc.data()
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  }
}