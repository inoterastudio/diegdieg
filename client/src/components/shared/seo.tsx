import { useEffect } from 'react';
import { SEOProps, defaultSEO, getPageTitle } from '@/lib/seo';

interface Props extends SEOProps {
  structuredData?: string;
}

export function SEO({ 
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage,
  twitterCard = 'summary_large_image',
  structuredData
}: Props) {
  const pageTitle = getPageTitle(title);
  const pageDescription = description || defaultSEO.description;
  const pageImage = ogImage || defaultSEO.ogImage;
  
  // Update document title 
  useEffect(() => {
    document.title = pageTitle;
    
    // Update meta tags
    const metaTags = [
      { name: 'description', content: pageDescription },
      { property: 'og:title', content: pageTitle },
      { property: 'og:description', content: pageDescription },
      { property: 'og:type', content: ogType },
      { property: 'og:image', content: pageImage },
      { name: 'twitter:card', content: twitterCard },
      { name: 'twitter:title', content: pageTitle },
      { name: 'twitter:description', content: pageDescription },
      { name: 'twitter:image', content: pageImage }
    ];
    
    // Remove existing meta tags to avoid duplicates
    document.querySelectorAll('meta[data-dynamic="true"]').forEach(el => el.remove());
    
    // Add new meta tags
    metaTags.forEach(({ name, property, content }) => {
      if (!content) return;
      
      const meta = document.createElement('meta');
      if (name) meta.setAttribute('name', name);
      if (property) meta.setAttribute('property', property);
      meta.setAttribute('content', content);
      meta.setAttribute('data-dynamic', 'true');
      document.head.appendChild(meta);
    });
    
    // Update canonical URL if provided
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl || window.location.href);
    
    // Add structured data if provided
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"][data-dynamic="true"]');
      if (script) {
        script.textContent = structuredData;
      } else {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('data-dynamic', 'true');
        script.textContent = structuredData;
        document.head.appendChild(script);
      }
    }
    
    // Cleanup function
    return () => {
      document.querySelectorAll('meta[data-dynamic="true"], script[data-dynamic="true"]').forEach(el => el.remove());
    };
  }, [pageTitle, pageDescription, ogType, pageImage, twitterCard, canonicalUrl, structuredData]);
  
  return null;
}