import { NextPage } from 'next'
import { signInWithPopup, signInAnonymously } from 'firebase/auth'
import { doc, getDoc, writeBatch, query, where, collection, limit, getDocs, deleteDoc } from 'firebase/firestore'
import { auth, provider, firestore, UserContext } from '../lib'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import _ from 'lodash'
import Image from 'next/image'

const Enter: NextPage = () => {
  const { user, username } = useContext(UserContext)
  return (
    <main>
      {
        user ? username ? <SignOutButton /> : <UsernameForm /> : <SignInButton />
      }
    </main>
  )
}

const SignInButton = (): JSX.Element => {
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, provider)
  }
  return (
    <>
      <button className='btn-google' onClick={signInWithGoogle}>
        <Image src='/google.png' width='30px' height='30px' /> Sign in with Google
      </button>
      <button onClick={async () => await signInAnonymously(auth)}>
        Sign in Anonymously
      </button>
    </>
  )
}

const SignOutButton = (): JSX.Element => {
  const { user, username } = useContext(UserContext)
  return (
    <button onClick={async () => { 
      if ((user as any).isAnonymous) {
        await deleteDoc(doc(firestore, 'users', (user as any).uid ))
        const colRef = collection(firestore, 'usernames')
        const q = query(colRef, where('uid', '==', (user as any).uid), limit(1))
        const userDoc = (await getDocs(q)).docs[0]
        await deleteDoc(doc(firestore, 'usernames', userDoc.id))
      }
      auth.signOut() 
    }}>Sign Out</button>
  )
}

const UsernameForm = (): JSX.Element => {
  const [formValue, setFormValue] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [loading, setLoading] = useState(false)

  const { user, username } = useContext(UserContext)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Create refs for both documents
    // @ts-ignore
    const userDoc = doc(firestore, `users/${user.uid}`)
    const usernameDoc = doc(firestore, `usernames/${formValue}`)

    // Commit both docs together as a batch write.
    const batch = writeBatch(firestore)
    // @ts-ignore
    batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName })
    // @ts-ignore
    batch.set(usernameDoc, { uid: user.uid })

    await batch.commit()
  }
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase()
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val)
      setLoading(false)
      setIsValid(false)
    }

    if (re.test(val)) {
      setFormValue(val)
      setLoading(true)
      setIsValid(false)
    }
  }

  useEffect(() => {
    checkUsername(formValue)
  }, [formValue])

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    _.debounce(async (username) => {
      if (username.length >= 3) {
        const ref = doc(firestore, `usernames/${username}`)
        const data = await getDoc(ref)
        console.log('Firestore read executed!')
        setIsValid(!data.exists())
        setLoading(false)
      }
    }, 500),
    []
  )

  return (
    <>
      {
        !username && (
          <section>
            <h3>Choose Username</h3>
            <form onSubmit={onSubmit}>
              <input placeholder='myname' value={formValue} onChange={onChange} />
              <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
              <button type='submit' className='btn-green' disabled={!isValid}>
                Choose
              </button>
              <h3>Debug State</h3>
              <div>
                Username: {formValue}
                <br />
                Loading: {loading.toString()}
                <br />
                Username Valid: {isValid.toString()}
              </div>
            </form>
          </section>
        )
      }
    </>
  )
}

const UsernameMessage = (props: { username: string, isValid: boolean, loading: boolean }): JSX.Element => {
  const { username, isValid, loading } = props
  if (loading) {
    return <p>Checking...</p>
  }
  else if (isValid) {
    return <p className='text-success'>{username} is available!</p>
  }
  else if (username && !isValid) {
    return <p className='text-danger'>That username is taken!</p>
  }
  else {
    return <p></p>
  }
}

export default Enter