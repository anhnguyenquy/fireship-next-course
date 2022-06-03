import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { kebabCase } from 'lodash'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { auth, firestore, UserContext } from '../lib'
import styles from '../styles/Admin.module.css'

export const CreateNewPost = (): JSX.Element => {
  const router = useRouter()
  const { username } = useContext(UserContext)
  const [title, setTitle] = useState('')

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title))

  // Validate length
  const isValid = title.length > 3 && title.length < 100

  // Create a new post in firestore
  const createPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const uid = auth.currentUser!.uid
    // const ref = firestore.collection('users').doc(uid).collection('posts').doc(slug);
    const ref = doc(firestore, 'users', uid, 'posts', slug)

    // Tip: give all fields a default value here
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: '# hello world!',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    }
    await setDoc(ref, data)

    toast.success('Post created!')

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`)
  }

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='My Awesome Article!'
        className={styles.input}
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type='submit' disabled={!isValid} className='btn-green'>
        Create New Post
      </button>
    </form>
  )
}