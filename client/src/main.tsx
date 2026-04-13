import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App";
import "./index.css";
import { initPerformanceOptimizations } from "./lib/performance";

// Initialize performance optimizations when JS loads
if (typeof window !== 'undefined') {
  // Mark when JS starts executing for performance tracking
  window.performance.mark('js-start');
  
  // Initialize performance optimizations
  initPerformanceOptimizations();
  
  // Mark which device type for responsive debugging
  const deviceClass = window.innerWidth < 640 ? 'mobile' 
    : window.innerWidth < 1024 ? 'tablet' 
    : 'desktop';
  document.documentElement.classList.add(deviceClass);
}

// Use concurrent mode and StrictMode for better performance and debugging
const rootElement = document.getElementById("root");

// Hydration with error handling
if (rootElement) {
  const root = createRoot(rootElement);
  try {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    
    // Mark when app is rendered
    if (typeof window !== 'undefined') {
      window.performance.mark('app-rendered');
      window.performance.measure('app-startup', 'js-start', 'app-rendered');
      
      // Log render time in development
      if (process.env.NODE_ENV === 'development') {
        const measurePerf = performance.getEntriesByName('app-startup')[0];
        console.log(`App rendered in ${measurePerf.duration.toFixed(2)}ms`);
      }
    }
  } catch (error) {
    console.error('Error rendering app:', error);
    
    // Fallback content in case of render failure
    root.render(
      <div style={{ 
        padding: '20px', 
        fontFamily: 'system-ui, sans-serif',
        maxWidth: '600px',
        margin: '0 auto',
        textAlign: 'center' 
      }}>
        <h1>Oops! Something went wrong.</h1>
        <p>We're having trouble loading the application. Please try refreshing the page.</p>
      </div>
    );
  }
}
