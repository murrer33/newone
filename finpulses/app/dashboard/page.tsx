import React from 'react'
import Link from 'next/link'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Dashboard</h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            {/* Main content */}
            <div className="px-4 py-8 sm:px-0">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Stock Predictions Card */}
                <div className="rounded-lg bg-white px-6 py-8 shadow">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Stock Predictions</h3>
                      <p className="mt-2 text-sm text-gray-500">View AI-powered predictions for your watchlist</p>
                    </div>
                  </div>
                </div>

                {/* Market Sentiment Card */}
                <div className="rounded-lg bg-white px-6 py-8 shadow">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Market Sentiment</h3>
                      <p className="mt-2 text-sm text-gray-500">Real-time sentiment analysis from market news</p>
                    </div>
                  </div>
                </div>

                {/* Technical Analysis Card */}
                <div className="rounded-lg bg-white px-6 py-8 shadow">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Technical Analysis</h3>
                      <p className="mt-2 text-sm text-gray-500">Live technical indicators and chart patterns</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Watchlist Section */}
              <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-900">Your Watchlist</h2>
                <div className="mt-4 rounded-lg bg-white shadow">
                  <div className="px-4 py-5 sm:p-6">
                    <p className="text-sm text-gray-500">Add stocks to your watchlist to get personalized predictions and analysis.</p>
                    <button
                      type="button"
                      className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Add Stock
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 