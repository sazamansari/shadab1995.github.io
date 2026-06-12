import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website' 
}) {
  const siteName = 'Md Shadab Azam Ansari Portfolio';
  const defaultTitle = 'Md Shadab Azam Ansari | Software Engineer | Cloud & DevOps Engineer';
  const defaultDesc = 'Portfolio of Md Shadab Azam Ansari, a Cloud & DevOps Engineer specializing in AWS, Docker, Kubernetes, Terraform, Node.js, and React.';
  const defaultKeywords = 'Md Shadab Azam Ansari, Shadab Ansari, DevOps Engineer, Cloud Engineer, Software Engineer, React, Node.js, AWS, Kubernetes, Docker, Terraform, CI/CD';
  const defaultImage = 'https://md-shadab-azam-ansari.vercel.app/profile.jpeg';
  const defaultUrl = 'https://md-shadab-azam-ansari.vercel.app/';

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDesc,
    keywords: keywords || defaultKeywords,
    image: image || defaultImage,
    url: url || defaultUrl,
    type: type,
  };

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <link rel="canonical" href={seo.url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={seo.type} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@tipu___" />
      <meta name="twitter:url" content={seo.url} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
    </Helmet>
  );
}
