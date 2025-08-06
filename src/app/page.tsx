'use client';

import { useState, useEffect } from 'react';
import { codeToHtml } from 'shiki';

export default function Home() {
  const [apiResponse, setApiResponse] = useState(null);
  const [apiHeaders, setApiHeaders] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlightedCode, setHighlightedCode] = useState<string>('');

  const fetchApiData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api');
      const data = await response.json();
      setApiResponse(data);
      setApiHeaders(formatHeaders(response.headers));
    } catch (error) {
      console.error('Error fetching API:', error);
      setError('Failed to fetch API data');
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch data on component mount
  useEffect(() => {
    fetchApiData();
  }, []);

  const formatHeaders = (headers: Headers) => {
    const formattedHeaders: string[] = [];
    headers.forEach((value, key) => {
      formattedHeaders.push(`${key}: ${value}`);
    });
    return formattedHeaders.join('\n');
  };

  const routeHandlerCode = `import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export const revalidate = 5;

export const GET = () => {
  const uuid = randomUUID();
  return NextResponse.json({ uuid });
};`;

  // Generate syntax highlighted code
  useEffect(() => {
    const generateHighlightedCode = async () => {
      try {
        const html = await codeToHtml(routeHandlerCode, {
          lang: 'typescript',
          theme: 'min-light'
        });
        setHighlightedCode(html);
      } catch (error) {
        console.error('Error highlighting code:', error);
        setHighlightedCode('');
      }
    };

    generateHighlightedCode();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-2">
            Route Handler ISR Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Demonstrating Incremental Static Regeneration with Route Handlers
          </p>
        </div>

        {/* Code Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-black dark:text-white mb-2">
            Route Handler Code
          </h2>
          <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded border border-gray-200 dark:border-gray-700">
            {highlightedCode ? (
              <div
                className="text-sm overflow-x-auto font-mono [&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:!m-0 [&_pre]:!font-mono [&_code]:!font-mono"
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
              />
            ) : (
              <pre className="text-sm text-black dark:text-white font-mono overflow-x-auto">
                {routeHandlerCode}
              </pre>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* API Response Display */}
        {apiResponse && (
          <div className="space-y-6 mb-8">
            {/* JSON Response */}
            <div>
              <h2 className="text-lg font-bold text-black dark:text-white mb-2">
                API Response
              </h2>
              <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded border border-gray-200 dark:border-gray-700">
                <pre className="text-sm text-black dark:text-white font-mono">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>
            </div>

            {/* Response Headers */}
            <div>
              <h2 className="text-lg font-bold text-black dark:text-white mb-2">
                Response Headers
              </h2>
              <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded border border-gray-200 dark:border-gray-700">
                <pre className="text-sm text-black dark:text-white font-mono whitespace-pre-wrap break-all">
                  {apiHeaders || 'No headers available'}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="text-center">
          <button
            onClick={fetchApiData}
            disabled={loading}
            className="px-4 py-2 bg-black hover:bg-gray-800 disabled:bg-gray-600 text-white rounded"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>
    </div>
  );
}
