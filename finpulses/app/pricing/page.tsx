import Link from 'next/link'

export default function Pricing() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose the right plan for you
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Get started with our AI-powered stock prediction platform. All plans include a 14-day free trial.
          </p>
        </div>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10 ${
                tier.mostPopular ? 'lg:z-10 lg:rounded-b-none' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    className={`text-lg font-semibold leading-8 ${
                      tier.mostPopular ? 'text-indigo-600' : 'text-gray-900'
                    }`}
                  >
                    {tier.name}
                  </h3>
                  {tier.mostPopular ? (
                    <p className="rounded-full bg-indigo-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-600">
                      Most popular
                    </p>
                  ) : null}
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">${tier.price}</span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/register"
                className={`mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  tier.mostPopular
                    ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-600'
                    : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300'
                }`}
              >
                Get started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const tiers = [
  {
    id: 'tier-basic',
    name: 'Basic',
    description: 'Perfect for getting started with stock predictions.',
    price: '29',
    features: [
      'Basic AI predictions',
      'Real-time market data',
      'Personal watchlist',
      'Email notifications',
      'Basic technical analysis',
    ],
  },
  {
    id: 'tier-pro',
    name: 'Pro',
    description: 'Advanced features for serious investors.',
    price: '99',
    mostPopular: true,
    features: [
      'Advanced AI predictions',
      'Real-time market data',
      'Personal watchlist',
      'Email & SMS notifications',
      'Advanced technical analysis',
      'Sentiment analysis',
      'Priority support',
    ],
  },
  {
    id: 'tier-enterprise',
    name: 'Enterprise',
    description: 'Custom solutions for large organizations.',
    price: '299',
    features: [
      'Custom AI models',
      'Real-time market data',
      'Multiple watchlists',
      'Custom notifications',
      'Advanced technical analysis',
      'Sentiment analysis',
      'API access',
      'Dedicated support',
      'Custom integrations',
    ],
  },
]

function CheckIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  )
} 