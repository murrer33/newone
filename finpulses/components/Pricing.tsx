import React from 'react'
import { CheckIcon } from '@heroicons/react/20/solid'

const tiers = [
  {
    name: 'Basic',
    id: 'tier-basic',
    href: '#',
    priceMonthly: '$29',
    description: 'Perfect for individual investors getting started with AI-powered predictions.',
    features: [
      'Basic stock predictions',
      'Daily market insights',
      'Basic technical indicators',
      'Email support',
      '5 watchlist slots',
    ],
    featured: false,
  },
  {
    name: 'Professional',
    id: 'tier-professional',
    href: '#',
    priceMonthly: '$79',
    description: 'Ideal for active traders seeking advanced analysis and predictions.',
    features: [
      'Advanced AI predictions',
      'Real-time market insights',
      'Advanced technical analysis',
      'Priority email support',
      'Sentiment analysis',
      'Unlimited watchlists',
      'Portfolio optimization',
    ],
    featured: true,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    href: '#',
    priceMonthly: '$299',
    description: 'For professional trading firms and institutional investors.',
    features: [
      'Custom AI models',
      'API access',
      'Real-time alerts',
      'Dedicated support',
      'Custom integrations',
      'Team collaboration',
      'Advanced analytics dashboard',
      'White-label options',
    ],
    featured: false,
  },
]

export default function Pricing() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose the right plan for&nbsp;you
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Unlock the power of AI-driven stock predictions with our flexible pricing plans. Choose the tier that best fits your investment needs.
        </p>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 xl:gap-x-12">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-3xl p-8 ring-1 ring-gray-200 ${
                tier.featured ? 'bg-gray-900 text-white ring-gray-900' : 'bg-white text-gray-900'
              }`}
            >
              <h3 className={`text-2xl font-bold tracking-tight ${tier.featured ? 'text-white' : 'text-gray-900'}`}>
                {tier.name}
              </h3>
              <p className="mt-4 text-base leading-6 text-gray-600">{tier.description}</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight">{tier.priceMonthly}</span>
                <span className={tier.featured ? 'text-gray-300' : 'text-gray-500'}>/month</span>
              </p>
              <a
                href={tier.href}
                className={`mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  tier.featured
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600'
                }`}
              >
                Get started today
              </a>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-300">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      className={`h-6 w-5 flex-none ${tier.featured ? 'text-white' : 'text-indigo-600'}`}
                      aria-hidden="true"
                    />
                    <span className={tier.featured ? 'text-white' : 'text-gray-600'}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 