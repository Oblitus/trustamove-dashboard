import { useEffect, useRef } from 'react';

/**
 * API Documentation Page using Redoc
 * 
 * Automatically fetches OpenAPI spec from backend and renders beautiful docs
 * Supports:
 * - Code samples in multiple languages
 * - Try it out functionality
 * - Search
 * - Deep linking to specific endpoints
 */
export default function ApiDocsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Redoc library
    const script = document.createElement('script');
    script.src = 'https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js';
    script.async = true;
    
    script.onload = () => {
      if (containerRef.current && (window as any).Redoc) {
        // Initialize Redoc with OpenAPI spec from backend
        (window as any).Redoc.init(
          // Fetch OpenAPI spec from live backend
          import.meta.env.VITE_API_URL + '/q/openapi',
          {
            scrollYOffset: 50,
            hideDownloadButton: false,
            downloadFileName: 'trustamove-api.yaml',
            expandResponses: '200,201',
            jsonSampleExpandLevel: 2,
            hideSingleRequestSampleTab: true,
            menuToggle: true,
            nativeScrollbars: false,
            pathInMiddlePanel: true,
            requiredPropsFirst: true,
            sortPropsAlphabetically: false,
            theme: {
              colors: {
                primary: {
                  main: '#3b82f6' // Blue-500 to match dashboard
                }
              },
              typography: {
                fontSize: '14px',
                fontFamily: '"Inter", sans-serif',
                code: {
                  fontFamily: '"Fira Code", monospace'
                }
              },
              sidebar: {
                backgroundColor: '#f9fafb',
                textColor: '#1f2937'
              },
              rightPanel: {
                backgroundColor: '#1f2937',
                textColor: '#f9fafb'
              }
            }
          },
          containerRef.current
        );
      }
    };
    
    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="h-full">
      <div className="bg-white border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">API Documentation</h1>
        <p className="text-sm text-gray-600 mt-1">
          Complete API reference with code examples and interactive testing
        </p>
      </div>
      
      {/* Redoc container */}
      <div ref={containerRef} className="h-[calc(100vh-120px)] overflow-auto" />
    </div>
  );
}
