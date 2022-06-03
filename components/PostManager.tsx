import { doc } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { auth, firestore } from '../lib'
import { PostForm } from './PostForm'

export const PostManager = (): JSX.Element => {
  const [preview, setPreview] = useState(false)
  const router = useRouter()
  const { slug } = router.query
  const postRef = doc(firestore, `users/${auth.currentUser!.uid}/posts/${slug}`)
  const [post] = useDocumentData(postRef)
  return (
    <main>
      {
        post &&
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>
            <PostForm postRef={postRef} defaultValues={post} preview={preview} />
          </section>
          <aside>
            <h3>
              <button onClick={() => { setPreview(prev => !prev) }}>
                {preview ? 'Edit' : 'Preview'}
              </button>
              <Link href={`/${post.username}/${post.slug}`}>
                <button className='btn-blue'>Live view</button>
              </Link>
            </h3>
          </aside>
        </>
      }
    </main>
  )
}