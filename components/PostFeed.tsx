import { Timestamp } from 'firebase/firestore'
import Link from 'next/link'

export interface Post {
  content: string
  createdAt: string
  heartCount: number
  hearts: string[]
  published: boolean
  slug: string
  title: string
  uid: string
  updatedAt: Timestamp
  username: string
}

interface PostFeedProps {
  posts: Post[]
  admin?: boolean
}

export const PostFeed = (props: PostFeedProps): JSX.Element => {
  const { posts, admin = false } = props
  return (
    <>
      {posts && posts.map((post) => <PostItem post={post} key={post.slug} admin={admin} />)}
    </>
  )
}

interface PostItemProps {
  post: Post
  admin: boolean
}

const PostItem = (props: PostItemProps): JSX.Element => {
  const { post, admin } = props
  // Naive method to calc word count and read time
  const wordCount = post?.content.trim().split(/\s+/g).length
  const minutesToRead = (wordCount / 100 + 1).toFixed(0)

  return (
    <div className='card'>
      <Link href={`/${post.username}`}>
        <a>
          <strong>By @{post.username}</strong>
        </a>
      </Link>
      <Link href={`/${post.username}/${post.slug}`}>
        <h2>
          <a>{post.title}</a>
        </h2>
      </Link>
      <footer>
        <span>
          {wordCount} words. {minutesToRead} min read
        </span>
        <span className='push-left'>💗 {post.heartCount || 0} Hearts</span>
      </footer>
      {/* If admin view, show extra controls for user */}
      {
        admin &&
        <>
          <Link href={`/admin/${post.slug}`}>
            <h3>
              <button className='btn-blue'>Edit</button>
            </h3>
          </Link>
          {post.published ? <p className='text-success'>Live</p> : <p className='text-danger'>Unpublished</p>}
        </>
      }
    </div>
  )
}