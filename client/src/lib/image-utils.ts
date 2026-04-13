// Utility functions for image optimization

/**
 * Generate an optimized image URL for different providers
 * 
 * @param url Original image URL
 * @param width Desired image width
 * @param height Optional desired image height
 * @param quality Image quality (1-100)
 * @param format Image format (webp, jpeg, png, etc.)
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  url: string,
  width?: number,
  height?: number,
  quality: number = 80,
  format: 'webp' | 'jpeg' | 'png' | 'avif' = 'webp'
): string {
  if (!url || typeof url !== 'string') return '';
  
  // Handle different image providers
  try {
    const parsedUrl = new URL(url);
    
    // Unsplash optimization
    if (parsedUrl.hostname === 'images.unsplash.com') {
      const widthParam = width ? `&w=${width}` : '';
      const heightParam = height ? `&h=${height}` : '';
      const qualityParam = `&q=${quality}`;
      const formatParam = `&fm=${format}`;
      const fitParam = '&fit=crop';
      
      // Add optimization parameters
      if (url.includes('?')) {
        return `${url}${widthParam}${heightParam}${qualityParam}${formatParam}${fitParam}`;
      } else {
        return `${url}?${widthParam.substring(1)}${heightParam}${qualityParam}${formatParam}${fitParam}`;
      }
    }
    
    // Pexels optimization
    if (parsedUrl.hostname.includes('pexels.com')) {
      // Extract existing parameters
      const existingParams = parsedUrl.searchParams;
      
      // Set or update parameters
      if (width) existingParams.set('w', width.toString());
      if (height) existingParams.set('h', height.toString());
      existingParams.set('auto', 'compress');
      existingParams.set('cs', 'tinysrgb');
      existingParams.set('dpr', '2');
      
      // Recreate URL with updated parameters
      parsedUrl.search = existingParams.toString();
      return parsedUrl.toString();
    }
  } catch (error) {
    console.warn('Error optimizing image URL:', error);
    return url;
  }
  
  // Return original URL if we don't have optimizations for it
  return url;
}

/**
 * Generate a low-quality image placeholder URL
 * 
 * @param url Original image URL
 * @returns Low quality placeholder URL
 */
export function getLowQualityPlaceholder(url: string): string {
  if (!url || typeof url !== 'string') return '';
  
  try {
    const parsedUrl = new URL(url);
    
    // Unsplash tiny placeholder
    if (parsedUrl.hostname === 'images.unsplash.com') {
      // Very small image with blur
      const placeholderParams = '?w=20&q=10&blur=10&fm=webp';
      if (url.includes('?')) {
        // Remove existing parameters and add placeholder params
        return url.split('?')[0] + placeholderParams;
      } else {
        return url + placeholderParams;
      }
    }
  } catch (error) {
    console.warn('Error generating placeholder URL:', error);
  }
  
  return url;
}

/**
 * Generate responsive image sources for different screen sizes
 * 
 * @param url Base image URL
 * @param sizes Array of sizes to generate [small, medium, large, etc.]
 * @returns Array of srcSet entries
 */
export function getResponsiveSrcSet(
  url: string, 
  sizes: Array<{width: number, screenWidth: number}> = [
    {width: 640, screenWidth: 640},  // mobile
    {width: 768, screenWidth: 768},  // tablet
    {width: 1024, screenWidth: 1024}, // small desktop
    {width: 1280, screenWidth: 1280}, // desktop
    {width: 1920, screenWidth: 1920}  // large desktop
  ]
): string {
  if (!url) return '';
  
  const srcSetEntries = sizes.map(size => {
    const optimizedUrl = getOptimizedImageUrl(url, size.width);
    return `${optimizedUrl} ${size.screenWidth}w`;
  });
  
  return srcSetEntries.join(', ');
}

/**
 * Generate appropriate sizes attribute for responsive images
 * 
 * @param breakpoints Custom breakpoints configuration
 * @returns Sizes attribute string
 */
export function getResponsiveSizes(
  breakpoints: Array<{maxWidth: number, size: string}> = [
    {maxWidth: 640, size: '100vw'},
    {maxWidth: 768, size: '100vw'},
    {maxWidth: 1024, size: '50vw'},
    {maxWidth: 1280, size: '33vw'},
  ]
): string {
  // Start with default size for largest screens
  const sizesArray = ['100vw'];
  
  // Add breakpoints from largest to smallest
  breakpoints
    .sort((a, b) => b.maxWidth - a.maxWidth)
    .forEach(breakpoint => {
      sizesArray.unshift(`(max-width: ${breakpoint.maxWidth}px) ${breakpoint.size}`);
    });
  
  return sizesArray.join(', ');
}

/**
 * Preload critical images
 * @param urls Array of image URLs to preload
 */
export function preloadCriticalImages(urls: string[]): void {
  if (typeof window === 'undefined') return;
  
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Get image dimensions (width and height) from an image URL
 * Only works for images with dimensions in URL params
 * 
 * @param url Image URL
 * @returns Object with width and height if available
 */
export function getImageDimensions(url: string): {width?: number, height?: number} {
  if (!url || typeof url !== 'string') return {};
  
  try {
    const parsedUrl = new URL(url);
    const width = parsedUrl.searchParams.get('w') || parsedUrl.searchParams.get('width');
    const height = parsedUrl.searchParams.get('h') || parsedUrl.searchParams.get('height');
    
    return {
      width: width ? parseInt(width) : undefined,
      height: height ? parseInt(height) : undefined
    };
  } catch (error) {
    return {};
  }
}