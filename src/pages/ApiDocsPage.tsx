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
    
    script.onload = async () => {
      if (containerRef.current && (window as any).Redoc) {
        try {
          // Fetch OpenAPI spec with proper Accept header
          const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/q/openapi', {
            headers: {
              'Accept': 'application/json'
            }
          });
          
          if (!response.ok) {
            throw new Error(`Failed to fetch OpenAPI spec: ${response.status}`);
          }
          
          const spec = await response.json();
          
          // Initialize Redoc with fetched spec
          (window as any).Redoc.init(
            spec,
            {
              scrollYOffset: 50,
              hideDownloadButton: false,
              downloadFileName: 'trustamove-api.json',
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
        } catch (error) {
          console.error('Failed to load API documentation:', error);
          if (containerRef.current) {
            containerRef.current.innerHTML = `
              <div class="flex items-center justify-center h-full">
                <div class="text-center">
                  <h2 class="text-xl font-semibold text-gray-900 mb-2">Failed to load API documentation</h2>
                  <p class="text-gray-600">Please check if the backend is running and try again.</p>
                  <p class="text-sm text-gray-500 mt-2">${error instanceof Error ? error.message : 'Unknown error'}</p>
                </div>
              </div>
            `;
          }
        }
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
