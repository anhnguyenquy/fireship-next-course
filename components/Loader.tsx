interface LoaderProps {
  show: boolean
}

// Loading Spinner
export const Loader = (props: LoaderProps): JSX.Element => {
  const { show } = props
  return show ? <div className='loader'></div> : <></>
}