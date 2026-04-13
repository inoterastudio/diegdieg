/**
 * Performance optimization utilities for client-side
 */

/**
 * Defers loading of non-critical scripts
 * @param urls List of script URLs to load
 * @param delay Optional delay in ms before loading starts
 */
export function deferScripts(urls: string[], delay: number = 2000): void {
  if (typeof window === 'undefined') return;
  
  const loadScript = (src: string) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(true);
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };
  
  // Use requestIdleCallback if available, otherwise setTimeout
  const scheduleLoad = () => {
    urls.forEach(url => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          loadScript(url).catch(err => console.warn(`Failed to load script: ${url}`, err));
        });
      } else {
        setTimeout(() => {
          loadScript(url).catch(err => console.warn(`Failed to load script: ${url}`, err));
        }, 50); // Small additional delay to stagger loads
      }
    });
  };
  
  // Delay the loading to prioritize critical resources
  setTimeout(scheduleLoad, delay);
}

/**
 * Lazy loads stylesheets with a callback when loaded
 * @param href Stylesheet URL
 * @param onLoad Optional callback when loaded
 */
export function lazyLoadStylesheet(href: string, onLoad?: () => void): void {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.onload = () => onLoad?.();
  document.head.appendChild(link);
}

/**
 * Injects critical CSS rules directly into the document head
 * @param cssRules CSS rules as a string
 */
export function injectCriticalCSS(cssRules: string): void {
  if (typeof window === 'undefined') return;
  
  const style = document.createElement('style');
  style.setAttribute('data-critical', 'true');
  style.textContent = cssRules;
  document.head.appendChild(style);
}

/**
 * Remove or disable non-critical 3rd party resources until user interacts
 */
export function optimizeThirdPartyResources(): void {
  if (typeof window === 'undefined') return;
  
  // List of non-critical third-party script domains
  const nonCriticalDomains = [
    'connect.facebook.net',
    'platform.twitter.com',
    'www.google-analytics.com',
    'www.googletagmanager.com',
    'consentcdn.cookiebot.com',
    'platform.instagram.com',
    'platform.linkedin.com',
    'ads.google.com',
    'widget.trustpilot.com'
  ];
  
  // Disable scripts until user interaction
  const scripts = document.querySelectorAll('script[src]');
  scripts.forEach(script => {
    const scriptEl = script as HTMLScriptElement;
    const src = scriptEl.src;
    if (src && nonCriticalDomains.some(domain => src.includes(domain))) {
      // Save original src and set to a blank data URI
      scriptEl.setAttribute('data-original-src', src);
      scriptEl.src = 'data:text/plain,//deferred';
    }
  });
  
  // Add listener to restore scripts on user interaction
  const restoreScripts = () => {
    const deferredScripts = document.querySelectorAll('script[data-original-src]');
    deferredScripts.forEach(script => {
      const scriptEl = script as HTMLScriptElement;
      const originalSrc = scriptEl.getAttribute('data-original-src');
      if (originalSrc) {
        // Create a new script element to force loading
        const newScript = document.createElement('script');
        newScript.src = originalSrc;
        scriptEl.parentNode?.insertBefore(newScript, scriptEl);
        scriptEl.parentNode?.removeChild(scriptEl);
      }
    });
    
    // Remove event listeners after first interaction
    ['keydown', 'mousedown', 'touchstart', 'scroll'].forEach(type => {
      window.removeEventListener(type, restoreScripts, { passive: true });
    });
  };
  
  // Add listeners for user interaction
  ['keydown', 'mousedown', 'touchstart', 'scroll'].forEach(type => {
    window.addEventListener(type, restoreScripts, { passive: true, once: true });
  });
}

/**
 * Optimize font loading to prevent layout shifts
 */
export function optimizeFontLoading(): void {
  if (typeof window === 'undefined') return;
  
  // Apply font-display: swap to all font-face definitions
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-display: swap !important;
    }
  `;
  document.head.appendChild(style);
  
  // Add font loading observer to know when fonts are active
  if ('FontFace' in window) {
    document.fonts.ready.then(() => {
      document.documentElement.classList.add('fonts-loaded');
    });
  } else {
    // Fallback for browsers without Font Loading API
    document.documentElement.classList.add('fonts-loaded');
  }
}

/**
 * Prefetch links on hover/focus
 * @param selector CSS selector for links to prefetch
 */
export function prefetchOnHover(selector: string = 'a[href^="/"]:not([href^="#"])') {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
  
  // Check if the browser supports prefetch
  const prefetchSupported = document.createElement('link').relList.supports('prefetch');
  if (!prefetchSupported) return;
  
  // Keep track of what's been prefetched
  const prefetched = new Set<string>();
  
  // Prefetch function
  const prefetch = (url: string) => {
    if (prefetched.has(url)) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = 'document';
    link.type = 'text/html';
    document.head.appendChild(link);
    prefetched.add(url);
  };
  
  // Set up observer for links in viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const link = entry.target as HTMLAnchorElement;
        // Don't observe this link anymore
        observer.unobserve(link);
        
        // Wait a bit before prefetching
        setTimeout(() => {
          prefetch(link.href);
        }, 300);
      }
    });
  });
  
  // Observe links in viewport and add hover/focus event listeners
  const attachPrefetchBehavior = () => {
    const links = document.querySelectorAll(selector);
    links.forEach(link => {
      observer.observe(link);
      
      link.addEventListener('mouseenter', () => {
        prefetch((link as HTMLAnchorElement).href);
      }, { once: true });
      
      link.addEventListener('focus', () => {
        prefetch((link as HTMLAnchorElement).href);
      }, { once: true });
    });
  };
  
  // Initial setup
  attachPrefetchBehavior();
  
  // Handle dynamic content by re-attaching periodically
  setInterval(attachPrefetchBehavior, 3000);
}

/**
 * Initialize all performance optimizations
 */
export function initPerformanceOptimizations(): void {
  if (typeof window === 'undefined') return;
  
  // Add flag to indicate JS is loaded 
  document.documentElement.classList.add('js-enabled');
  
  // Critical CSS already present in the HTML
  optimizeFontLoading();
  
  // Wait for after load event to handle non-critical optimizations
  if (document.readyState === 'complete') {
    setTimeout(() => {
      prefetchOnHover();
      optimizeThirdPartyResources();
    }, 300);
  } else {
    window.addEventListener('load', () => {
      setTimeout(() => {
        prefetchOnHover();
        optimizeThirdPartyResources();
      }, 300);
    });
  }
}