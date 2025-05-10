'use client';

import { useEffect } from 'react';

export default function HydrationSuppressor() {
  useEffect(() => {
    // This is a workaround for browser extensions that modify the DOM
    // and cause hydration mismatches
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (typeof args[0] === 'string' && 
          (args[0].includes('Hydration failed') || 
           args[0].includes('Hydration mismatch') ||
           args[0].includes('Text content did not match') ||
           args[0].includes('A tree hydrated but some attributes'))) {
        // Suppress various hydration errors
        return;
      }
      originalConsoleError.apply(console, args);
    };

    // Remove Grammarly or other browser extension attributes that cause hydration mismatches
    const body = document.querySelector('body');
    if (body) {
      if (body.hasAttribute('data-new-gr-c-s-check-loaded')) {
        body.removeAttribute('data-new-gr-c-s-check-loaded');
      }
      if (body.hasAttribute('data-gr-ext-installed')) {
        body.removeAttribute('data-gr-ext-installed');
      }
    }

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  // Return null as this component doesn't render anything
  return null;
}
