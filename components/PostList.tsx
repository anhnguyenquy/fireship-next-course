import { collection, orderBy, query } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { auth, firestore } from '../lib'
import { PostFeed } from './PostFeed'

export const PostList = (): JSX.Element => {
  const colRef = query(collection(firestore, `users/${auth.currentUser!.uid}/posts`), orderBy('createdAt', 'desc'))
  const [posts] = useCollectionData(colRef)
  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  )
}