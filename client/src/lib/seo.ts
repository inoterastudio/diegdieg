// SEO Helper Functions
export interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
}

export const defaultSEO: SEOProps = {
  title: 'DIEGMA | Studio Arsitektur & Desain Interior Jakarta',
  description: 'DIEGMA adalah studio arsitektur dan desain interior premium di Jakarta yang menawarkan jasa desain, konstruksi, dan furniture custom dengan pendekatan modern dan inovatif.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  ogImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d',
};

export function getPageTitle(title?: string): string {
  if (!title) return defaultSEO.title;
  return `${title} | DIEGMA`;
}

export function generateStructuredData(type: 'Organization' | 'LocalBusiness' | 'Article' | 'Service' | 'Product', data: Record<string, any>): string {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
  };
  
  const structuredData = { ...baseData, ...data };
  
  return JSON.stringify(structuredData);
}

// Pre-defined structured data
export const organizationSchema = generateStructuredData('Organization', {
  name: 'DIEGMA',
  url: 'https://www.diegma.com',
  logo: 'https://www.diegma.com/logo.png',
  sameAs: [
    'https://www.facebook.com/diegma',
    'https://www.instagram.com/diegma',
    'https://www.linkedin.com/company/diegma',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+62-21-12345678',
    contactType: 'customer service',
    email: 'info@diegma.com',
    areaServed: 'ID',
    availableLanguage: ['Indonesian', 'English'],
  },
});

export const localBusinessSchema = generateStructuredData('LocalBusiness', {
  name: 'DIEGMA Studio',
  image: 'https://www.diegma.com/studio-image.jpg',
  '@id': 'https://www.diegma.com',
  url: 'https://www.diegma.com',
  telephone: '+62-21-12345678',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Jalan Sudirman No. 123',
    addressLocality: 'Jakarta',
    postalCode: '12345',
    addressCountry: 'ID',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '-6.2088',
    longitude: '106.8456',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
  ],
  priceRange: '$$',
});

// Breadcrumb schema
export function generateBreadcrumbSchema(items: Array<{name: string; url: string}>): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url,
    })),
  });
}

// Service Schema generator
export function generateServiceSchema(service: {
  name: string;
  description: string;
  url: string;
  provider: string;
  image?: string;
  area?: string;
}): string {
  return generateStructuredData('Service', {
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: service.provider,
    },
    url: service.url,
    ...(service.image && { image: service.image }),
    ...(service.area && { areaServed: service.area }),
  });
}

// Product Schema Generator for furniture
export function generateProductSchema(product: {
  name: string;
  description: string;
  image: string;
  price: string;
  priceCurrency?: string;
  availability?: 'InStock' | 'OutOfStock';
  url: string;
  sku?: string;
  brand?: string;
}): string {
  return generateStructuredData('Product', {
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price.replace(/[^0-9.]/g, ''),
      priceCurrency: product.priceCurrency || 'IDR',
      availability: `https://schema.org/${product.availability || 'InStock'}`,
      url: product.url,
    },
    ...(product.sku && { sku: product.sku }),
    ...(product.brand && { 
      brand: {
        '@type': 'Brand',
        name: product.brand,
      }
    }),
  });
}

// Article Schema for blog posts and project case studies
export function generateArticleSchema(article: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  publisherName: string;
  publisherLogo: string;
  url: string;
}): string {
  return generateStructuredData('Article', {
    headline: article.headline,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      name: article.authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: article.publisherName,
      logo: {
        '@type': 'ImageObject',
        url: article.publisherLogo,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  });
}

// FAQ Schema Generator
export function generateFAQSchema(questions: Array<{question: string; answer: string}>): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': questions.map(item => ({
      '@type': 'Question',
      'name': item.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.answer,
      },
    })),
  });
}