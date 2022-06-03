import { NextPage } from 'next'
import { AuthCheck, PostManager } from '../../components'

interface Props {

}
const AdminPostEdit: NextPage<Props> = (props) => { 
  
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  )
}

export default AdminPostEdit