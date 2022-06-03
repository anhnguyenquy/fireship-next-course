import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { doc, collection, deleteDoc, where, limit, query, getDocs } from 'firebase/firestore'
import { UserContext, auth, firestore } from '../lib'

// Top navbar
export const Navbar = (): JSX.Element => {
  const { user, username } = useContext(UserContext)
  const router = useRouter()

  const signOut = async () => {
    // @ts-ignore
    if (user.isAnonymous) {
      await deleteDoc(doc(firestore, 'users', (user as any).uid))
      const colRef = collection(firestore, 'usernames')
      const q = query(colRef, where('uid', '==', (user as any).uid), limit(1))
      const userDoc = (await getDocs(q)).docs[0]
      await deleteDoc(doc(firestore, 'usernames', userDoc.id))
    }
    auth.signOut()
    router.reload()
  }

  return (
    <nav className='navbar'>
      <ul>
        <li>
          <Link href='/'>
            <button className='btn-logo'>NXT</button>
          </Link>
        </li>
        {username ? (
          <>
            <li className='push-left'>
              <button onClick={signOut}>Sign Out</button>
            </li>
            <li>
              <Link href='/admin'>
                <button className='btn-blue'>Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                {/* @ts-ignore */}
                <img src={user?.photoURL || '/hacker.png'} />
              </Link>
            </li>
          </>
        ) : (
          <li>
            <Link href='/enter'>
              <button className='btn-blue'>Log in</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}