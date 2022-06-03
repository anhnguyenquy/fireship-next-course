import { DocumentData, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import styles from '../styles/Admin.module.css'
import { ImageUploader } from './ImageUploader'

interface Props {
  defaultValues: any
  postRef: DocumentData
  preview: boolean
}

export const PostForm = (props: Props): JSX.Element => {
  const { defaultValues, postRef, preview } = props
  const { register, handleSubmit, reset, watch, formState } = useForm({ defaultValues, mode: 'onChange' })

  const { isValid, isDirty, errors } = formState // isDirty means user has interacted with the data

  const contentReg = register('content', {
    maxLength: { value: 20000, message: 'content is too long' },
    minLength: { value: 10, message: 'content is too short' },
    required: { value: true, message: 'content is required' },
  })

  const publishedReg = register('published')
  // @ts-ignore
  const updatePost = async ({ content, published }) => {
    // @ts-ignore
    await updateDoc(postRef, {
      content,
      published,
      updatedAt: serverTimestamp()
    })
    reset({ content, published })
    toast.success('Post updated successfully!')
  }
  
  return (
    <form onSubmit={handleSubmit(updatePost)}> {/*handleSubmit automatically pass an object as argument into updatePost and execute it*/}
      {
        preview &&
        <div className='card'>
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      }
      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader />
        <textarea name={contentReg.name} ref={contentReg.ref} onChange={contentReg.onChange} />
        {errors.content && <p className='text-danger'>{errors.content.message}</p>}
        <fieldset> {/* renders a box around the form */}
          <input className={styles.checkbox} name={publishedReg.name} type='checkbox' ref={publishedReg.ref} onChange={publishedReg.onChange}/>
          <label>Published</label>
        </fieldset>
        <button type='submit' className='btn-green'>Save Changes</button>
      </div>
    </form>
  )
}