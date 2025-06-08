import { useEffect } from 'react';
import { Helmet } from 'react-helmet';

type MetaProps = {
  appName: string;
  title: string;
  description: string;
  url: string;
  image: string;
}
export const MetaTags = ({ appName, title, description, url, image }: MetaProps) => {
  
  useEffect(() => {
    let isMounted = true
    if (isMounted) document.title = title
    return () => {
      isMounted = false
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Helmet>
      
      <meta name='description' content={description} />

      {/* FACEBOOK OG-graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={appName}></meta>

      {/* TWITTER CARD */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  )
} 