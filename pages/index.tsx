import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { collectionGroup, getDocs, limit, orderBy, query, where, FieldValue, Timestamp, startAfter } from 'firebase/firestore'
import { firestore, postToJSON } from '../lib'
import { Loader, Post, PostFeed, Metatags } from '../components'
import { useState } from 'react'

const LIMIT = 10

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const postsQuery = query(collectionGroup(firestore, 'posts'), where('published', '==', true), orderBy('createdAt', 'desc'), limit(LIMIT))
  const postDocs = (await getDocs(postsQuery)).docs.map(postToJSON)
  return {
    props: { postDocs }
  }
}

interface HomeProps {
  postDocs: Post[]
}

const Home: NextPage<HomeProps> = (props) => {
  const { postDocs } = props
  const [posts, setPosts] = useState(postDocs)
  const [loading, setLoading] = useState(false)
  const [postsEnd, setPostsEnd] = useState(false)

  const getMorePosts = async () => {
    setLoading(true)
    const last = posts[posts.length - 1]

    const cursor = typeof last.createdAt === 'number' ? Timestamp.fromMillis(last.createdAt) : last.createdAt

    const postsQuery = query(
      collectionGroup(firestore, 'posts'),
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      startAfter(cursor),
      limit(LIMIT)
    )

    const newPosts = (await getDocs(postsQuery)).docs.map((doc) => doc.data())

    //@ts-ignore
    setPosts(posts.concat(newPosts))
    setLoading(false)

    if (newPosts.length < LIMIT) {
      setPostsEnd(true)
    }
  }

  return (
    <main>
      <Metatags title='Home Page' description='Get the latest posts on our site' />

      <div className='card card-info'>
        <h2>💡 Next.js Blog</h2>
        <p>Welcome! This app is built with Next.js and Firebase and is loosely inspired by Dev.to.</p>
        <p>Sign up for an 👨‍🎤 account, ✍️ write posts, then 💞 heart content created by other users. All public content is server-rendered and search-engine optimized.</p>
      </div>

      <PostFeed posts={posts} />

      {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}

      <Loader show={loading} />

      {postsEnd && 'You have reached the end!'}
    </main>
  )
}

export default Home
