import { useState, useEffect, ReactNode, useRef } from 'react';
import { useIntersectionObserver } from '@/hooks/use-intersection';

interface LazyLoadProps {
  children: ReactNode;
  threshold?: number;
  rootMargin?: string;
  placeholder?: ReactNode;
  skipLazyLoad?: boolean;
  onVisible?: () => void;
  height?: string | number;
  className?: string;
}

export function LazyLoad({
  children,
  threshold = 0.1,
  rootMargin = '100px 0px',
  placeholder,
  skipLazyLoad = false,
  onVisible,
  height = 'auto',
  className = ''
}: LazyLoadProps) {
  const [shouldRender, setShouldRender] = useState(skipLazyLoad);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const result = useIntersectionObserver(containerRef, {
    threshold,
    rootMargin,
    freezeOnceVisible: true,
  });

  useEffect(() => {
    if (result.isIntersecting && !shouldRender) {
      setShouldRender(true);
      onVisible?.();
    }
  }, [result.isIntersecting, shouldRender, onVisible]);

  // Default placeholder with adjustable height
  const defaultPlaceholder = (
    <div 
      className="animate-pulse bg-gray-200 rounded-lg w-full" 
      style={{ 
        height: typeof height === 'number' ? `${height}px` : height 
      }}
    ></div>
  );

  return (
    <div ref={containerRef} className={className}>
      {shouldRender ? children : placeholder || defaultPlaceholder}
    </div>
  );
}