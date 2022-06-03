import { arrayRemove, arrayUnion, doc, DocumentReference, increment, writeBatch } from 'firebase/firestore'
import { auth, firestore } from '../lib'

interface Props {
  post: any
  postRef: any
}

export const HeartButton = (props: Props): JSX.Element => {
  const { postRef, post } = props

  const addHeart = async () => {
    const uid = auth.currentUser!.uid
    const batch = writeBatch(firestore)

    batch.update(postRef, {
      heartCount: increment(1),
      hearts: arrayUnion(auth.currentUser!.uid)
    })

    await batch.commit()
  }

  const removeHeart = async () => {
    const batch = writeBatch(firestore)

    batch.update(postRef, {
      heartCount: increment(-1),
      hearts: arrayRemove(auth.currentUser!.uid)
    })

    await batch.commit()
  }
  return (
    <>
      {
        post.hearts.includes(auth.currentUser!.uid) ?
          <button onClick={removeHeart}>💔 Unheart</button>
          :
          <button onClick={addHeart}>💗 Heart</button>
      }
    </>
  )
}