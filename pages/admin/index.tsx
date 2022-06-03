import { NextPage } from 'next'
import { AuthCheck, CreateNewPost, PostList } from '../../components'
import _ from 'lodash'

interface Props {
  
}

const AdminPostsPage: NextPage<Props> = () => { 
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  )
}

export default AdminPostsPage