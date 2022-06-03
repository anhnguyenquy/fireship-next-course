import Link from 'next/link'
import { FC, useContext } from 'react'
import { UserContext } from '../lib'


interface Props {
  children: JSX.Element | JSX.Element[] | null
  fallback?: JSX.Element | JSX.Element[] | null
}

export const AuthCheck = (props: Props): JSX.Element => {
  const { children, fallback } = props
  const { username } = useContext(UserContext)
  return <>
    {
      username ? children : fallback || <Link href='/enter'>You must be signed in.</Link>
    }
  </>
}