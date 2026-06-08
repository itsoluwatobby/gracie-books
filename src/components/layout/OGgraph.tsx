import { Helmet } from 'react-helmet-async';
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
  /** Open Graph type. Defaults to "website". */
  type?: 'website' | 'article' | 'book';
  /** Comma-separated keywords for the meta keywords tag. */
  keywords?: string;
  /** Author name — rendered as <meta name="author"> and og:book:author / og:article:author. */
  author?: string;
  /** ISO 8601 date string for og:article:published_time / og:book:release_date. */
  publishedTime?: string;
  /** JSON-LD structured data object(s) injected alongside the automatic WebSite schema. */
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
  /** Set true for private/auth pages to prevent indexing. */
  noindex?: boolean;
};

export const MetaTags = ({
  title,
  description,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  keywords,
  author,
  publishedTime,
  structuredData,
  noindex = false,
}: MetaProps) => {
  const { app } = useAuthContext();
  const { pathname } = useLocation();

  const siteName = app.name;
  const safeTitle = title.length > 60 ? `${title.slice(0, 57)}...` : title;
  const fullTitle = `${safeTitle} | ${siteName}`;
  const safeDescription = description.length > 160 ? `${description.slice(0, 157)}...` : description;
  const canonicalUrl = `${SITE_URL}${pathname}`;

  const twitterHandle = app.socials?.twitter
    ? app.socials.twitter.startsWith('@') ? app.socials.twitter : `@${app.socials.twitter}`
    : null;

  const baseSchemas: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      url: SITE_URL,
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: siteName,
      url: SITE_URL,
      email: app.email,
    },
  ];

  const extraSchemas = structuredData
    ? Array.isArray(structuredData) ? structuredData : [structuredData]
    : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={safeDescription} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      {author ? <meta name="author" content={author} /> : null}
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />

      {/* Open Graph */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={safeDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:image:width" content="1260" />
      <meta property="og:image:height" content="750" />
      <meta property="og:image:alt" content={fullTitle} />
      {image === DEFAULT_OG_IMAGE ? <meta property="og:image:type" content="image/jpeg" /> : null}
      <meta property="og:locale" content="en_US" />
      {type === 'article' && author ? <meta property="og:article:author" content={author} /> : null}
      {type === 'article' && publishedTime ? <meta property="og:article:published_time" content={publishedTime} /> : null}
      {type === 'book' && author ? <meta property="og:book:author" content={author} /> : null}
      {type === 'book' && publishedTime ? <meta property="og:book:release_date" content={publishedTime} /> : null}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      {twitterHandle ? <meta name="twitter:site" content={twitterHandle} /> : null}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={safeDescription} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={fullTitle} />

      {/* JSON-LD Structured Data */}
      {[...baseSchemas, ...extraSchemas].map((schema, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(schema)}</script>
      ))}
    </Helmet>
  );
};
