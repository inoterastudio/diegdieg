import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { 
  getOptimizedImageUrl, 
  getLowQualityPlaceholder, 
  getResponsiveSrcSet, 
  getResponsiveSizes 
} from '@/lib/image-utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  priority?: boolean;
  placeholder?: string; // URL for the placeholder image
  generateBlurPlaceholder?: boolean;
  blurDataURL?: string;
  onLoad?: () => void;
  fill?: boolean;
  fadeIn?: boolean;
  quality?: number;
  useSrcSet?: boolean;
  rounded?: boolean | string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  sizes,
  loading = 'lazy',
  objectFit = 'cover',
  priority = false,
  placeholder,
  generateBlurPlaceholder = true,
  blurDataURL,
  onLoad,
  fill = false,
  fadeIn = true,
  quality = 80,

  useSrcSet = true,
  rounded = false,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [mainImageSrc, setMainImageSrc] = useState<string | null>(null);
  const [placeholderSrc, setPlaceholderSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate appropriate sizes value if not provided
  const defaultSizes = sizes || getResponsiveSizes([
    { maxWidth: 640, size: '100vw' },
    { maxWidth: 768, size: '100vw' },
    { maxWidth: 1024, size: '50vw' },
    { maxWidth: 1280, size: '33vw' },
  ]);

  // Generate optimized main image source
  useEffect(() => {
    if (!src) return;

    // Generate and set optimized URL
    const optimizedSrc = getOptimizedImageUrl(src, width, height, quality);
    setMainImageSrc(optimizedSrc);

    // Generate placeholder if needed
    if ((generateBlurPlaceholder && !placeholder && !blurDataURL) || placeholder === 'auto') {
      const lowQualityPlaceholder = getLowQualityPlaceholder(src);
      setPlaceholderSrc(lowQualityPlaceholder);
    } else if (blurDataURL) {
      setPlaceholderSrc(blurDataURL);
    } else if (placeholder && placeholder !== 'auto') {
      setPlaceholderSrc(placeholder);
    }
  }, [src, width, height, quality, placeholder, blurDataURL, generateBlurPlaceholder]);

  // Handle priority preloading
  useEffect(() => {
    if (!priority || !mainImageSrc) return;

    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = mainImageSrc;
    document.head.appendChild(preloadLink);

    return () => {
      document.head.removeChild(preloadLink);
    };
  }, [priority, mainImageSrc]);

  // Determine final display state
  const displayPlaceholder = placeholderSrc && !isLoaded && fadeIn;
  const showImg = mainImageSrc && (isLoaded || !fadeIn || priority);
  const srcSet = useSrcSet && src ? getResponsiveSrcSet(src) : undefined;

  // Handle rounded corners
  const roundedClass = rounded 
    ? (typeof rounded === 'string' 
        ? `rounded-${rounded}` 
        : 'rounded-lg') 
    : '';

  // Handle image loading
  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleImageError = () => {
    setIsError(true);
    console.error(`Failed to load image: ${src}`);
  };

  return (
    <div 
      className={cn(
        "overflow-hidden relative",
        roundedClass,
        className
      )}
      style={{ 
        width: fill ? '100%' : (width ? `${width}px` : '100%'),
        height: fill ? '100%' : (height ? `${height}px` : 'auto'),
        aspectRatio: (!height && width) ? `${width} / ${width}` : undefined,
      }}
    >
      {/* Main Image */}
      {showImg && (
        <img
          ref={imgRef}
          src={mainImageSrc}
          srcSet={srcSet}
          sizes={defaultSizes}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : loading}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={cn(
            'transition-opacity',
            fadeIn ? 'duration-500' : 'duration-0',
            objectFit === 'cover' && 'object-cover',
            objectFit === 'contain' && 'object-contain',
            objectFit === 'fill' && 'object-fill',
            objectFit === 'none' && 'object-none',
            objectFit === 'scale-down' && 'object-scale-down',
            roundedClass,
            (displayPlaceholder && fadeIn) ? 'opacity-0' : 'opacity-100',
            'w-full h-full'
          )}
          style={{ 
            opacity: (displayPlaceholder && fadeIn) ? 0 : 1
          }}
        />
      )}
      
      {/* Blur Placeholder */}
      {displayPlaceholder && (
        <img
          src={placeholderSrc}
          alt=""
          aria-hidden="true"
          className={cn(
            'absolute inset-0 w-full h-full',
            objectFit === 'cover' && 'object-cover',
            objectFit === 'contain' && 'object-contain',
            objectFit === 'fill' && 'object-fill',
            objectFit === 'none' && 'object-none',
            objectFit === 'scale-down' && 'object-scale-down',
            roundedClass,
            'filter blur-md opacity-60 transition-opacity duration-500'
          )}
        />
      )}
      
      {/* Error Fallback */}
      {isError && (
        <div 
          className={cn(
            'absolute inset-0 w-full h-full flex items-center justify-center bg-gray-100',
            roundedClass
          )}
          aria-hidden="true"
        >
          <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        </div>
      )}
    </div>
  );
}