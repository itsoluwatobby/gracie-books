import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import useAuthContext from '../../context/useAuthContext';

export const SITE_URL = 'https://booksales.wandyte.com';
export const DEFAULT_OG_IMAGE =
  'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750';

type MetaProps = {
  title: string;
  description: string;
  /** Override the OG image. Defaults to the site hero image. */
  image?: string;
  /** Open Graph type. Defaults to "website". Use "book" for book detail pages. */
  type?: 'website' | 'article' | 'book' | 'product';
  /** Comma-separated keywords for the meta keywords tag. */
  keywords?: string;
  /** Set true for private/auth pages to prevent indexing. */
  noindex?: boolean;
};

export const MetaTags = ({
  title,
  description,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  keywords,
  noindex = false,
}: MetaProps) => {
  const { appName } = useAuthContext();
  const { pathname } = useLocation();

  const siteName = appName.name;
  const fullTitle = `${title} | ${siteName}`;
  const canonicalUrl = `${SITE_URL}${pathname}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <link rel="canonical" href={canonicalUrl} />
      {noindex ? <meta name="robots" content="noindex, nofollow" /> : null}

      {/* Open Graph */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1260" />
      <meta property="og:image:height" content="750" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};
