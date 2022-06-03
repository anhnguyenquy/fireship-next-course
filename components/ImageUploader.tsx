import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage'
import { useState, ChangeEvent } from 'react'
import { auth, storage } from '../lib/firebase'
import { Loader } from './Loader'

export const ImageUploader = (): JSX.Element => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadURL, setDownloadURL] = useState<string | null>(null)

  const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = Array.from(e.target.files!)[0]
    console.log(file)
    const ext = file.type.split('/')[1]

    const storageRef = ref(storage, `uploads/${auth.currentUser!.uid}/${Date.now()}.${ext}}`)
    setUploading(true)

    const uploadTask = uploadBytesResumable(storageRef, file)
    uploadTask.on('state_changed', (snapshot) => {
      const pct = parseInt(((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0))
      setProgress(pct)
    },
      (error) => { console.log(error) },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref)
        setDownloadURL(url)
        setUploading(false)
      }
    )
  }

  return (
    <div className='box'>
      <Loader show={uploading} />
      {
        uploading ?
          <h3>{progress}%</h3>
          :
          <>
            <label className='btn'>
              📸 Upload Img
              <input type='file' onChange={uploadFile} accept='image/x-png,image/gif,image/jpeg' />
            </label>
          </>
      }
      {
        downloadURL &&
        <code className='upload-snippet'>{`![alt](${downloadURL})`}</code>
      }
    </div>
  )
}