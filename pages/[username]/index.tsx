import { GetServerSideProps, NextPage } from 'next'
import { getDocs, where, collection, orderBy, query, limit } from 'firebase/firestore'
import { PostFeed, UserProfile, Post } from '../../components'
import { firestore, getUserWithUsername, postToJSON } from '../../lib'

export const getServerSideProps: GetServerSideProps = async (context) => {
  // @ts-ignore
  const { username } = context.params
  // @ts-ignore  
  const userDoc = await getUserWithUsername(username)
  let user, posts
  if (userDoc) {
    user = userDoc.data()
    const q = query(collection(userDoc.ref, 'posts'), where('published', '==', true), orderBy('createdAt', 'desc'), limit(5))
    posts = (await getDocs(q)).docs.map(postToJSON)
  }
  else {
    return {
      notFound: true
    }
  }

  return {
    props: { user, posts }
  }
}

interface UserProfilePageProps {
  user: {
    photoURL: string
    username: string
    displayName: string
  }
  posts: Post[]
}

const UserProfilePage: NextPage<UserProfilePageProps> = (props) => {
  const { user, posts } = props
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  )
}

export default UserProfilePage