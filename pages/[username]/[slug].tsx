import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, NextPage, PreviewData } from 'next'
import { getDocs, doc, getDoc, collectionGroup } from 'firebase/firestore'
// import { PostFeed, UserProfile, Post } from '../../components'
import { auth, firestore, getUserWithUsername, postToJSON, UserContext } from '../../lib'
import { ParsedUrlQuery } from 'querystring'
import { useContext, useEffect } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { AuthCheck, HeartButton, Metatags, PostContent } from '../../components'
import styles from '../../styles/Post.module.css'
import { useRouter } from 'next/router'
import Link from 'next/link'

export const getStaticProps: GetStaticProps = async (context) => {
  // @ts-ignore
  const { username, slug } = context.params
  const userDoc = await getUserWithUsername(username)

  let post, path

  if (userDoc) {
    const postRef = doc(userDoc.ref, 'posts', slug)
    post = postToJSON(await getDoc(postRef))
    path = postRef.path
  }

  return {
    props: { post, path },
    revalidate: 5000 // Revalidates whenever a new request comes in but not more than once every 5 seconds
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const snapshot = await getDocs(collectionGroup(firestore, 'posts'))
  const paths = snapshot.docs.map(doc => {
    const { username, slug } = doc.data()
    return {
      params: { username, slug }
    }
  })
  return { paths, fallback: 'blocking' } // fallback: 'blocking' SSR if path doesn't exist and then cache as SSG
}

const Post: NextPage = (props) => {
  // @ts-ignore
  const { post, path } = props
  const postRef = doc(firestore, path)
  const [realtimePost] = useDocumentData(postRef)

  const postData = realtimePost || post
  const { user, username } = useContext(UserContext)

  const router = useRouter()

  return (
    <main className={styles.container}>
      <Metatags title={postData.title} description={postData.title} />
      <section>
        <PostContent post={postData} />
      </section>

      <aside className='card'>
        <p>
          <strong>{postData.heartCount} 🤍</strong>
        </p>

        <AuthCheck
          fallback={
            <Link href='/enter'>
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <HeartButton post={realtimePost} postRef={postRef} />
        </AuthCheck>
        {
          auth.currentUser?.uid === post.uid &&
            <Link href={`/admin/${post.slug}`}>
              <button className='btn-blue'>Edit Post</button>
            </Link>
        }
      </aside>
    </main>
  )
}

export default Post