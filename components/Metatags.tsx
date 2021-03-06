

import Head from 'next/head'

export const Metatags = ({
  title = 'Blog',
  description = 'A Next.js blog',
  image = 'https://nextjs.org/static/favicon/android-chrome-512x512.png',
}): JSX.Element => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@ANQ_ML" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  )
}