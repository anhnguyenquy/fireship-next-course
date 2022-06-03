import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import { UserContext } from '../lib'
import { Navbar } from '../components'
import { useUserData } from '../hooks'

function MyApp({ Component, pageProps }: AppProps) {
  const userData = useUserData()
  return (
    // @ts-ignore
    <UserContext.Provider value={userData}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  )
}

export default MyApp
