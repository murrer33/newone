import Link from 'next/link';

export default function About() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
        <div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="max-w-lg">
                <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  About Finpulses.tech
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  We're on a mission to democratize stock market predictions using cutting-edge AI technology.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Mission</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            At Finpulses.tech, we believe that everyone should have access to sophisticated market analysis tools.
            Our platform combines artificial intelligence with real-time market data to provide accurate stock predictions
            and insights, helping investors make informed decisions.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Values</h2>
          <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                Innovation
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  We constantly push the boundaries of what's possible with AI and machine learning in financial markets.
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                Transparency
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  We believe in being open and honest about our methods and predictions.
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                Accessibility
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  We make sophisticated market analysis tools available to everyone, regardless of their experience level.
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Team Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Team</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We're a diverse team of data scientists, financial experts, and software engineers passionate about
            revolutionizing stock market analysis.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
        >
          <li>
            <img
              className="aspect-[3/2] w-full rounded-2xl object-cover"
              src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
              alt="Team member"
            />
            <h3 className="mt-6 text-lg font-semibold leading-8 text-gray-900">John Doe</h3>
            <p className="text-base leading-7 text-gray-600">CEO & Founder</p>
          </li>
          <li>
            <img
              className="aspect-[3/2] w-full rounded-2xl object-cover"
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
              alt="Team member"
            />
            <h3 className="mt-6 text-lg font-semibold leading-8 text-gray-900">Jane Smith</h3>
            <p className="text-base leading-7 text-gray-600">Lead Data Scientist</p>
          </li>
          <li>
            <img
              className="aspect-[3/2] w-full rounded-2xl object-cover"
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
              alt="Team member"
            />
            <h3 className="mt-6 text-lg font-semibold leading-8 text-gray-900">Mike Johnson</h3>
            <p className="text-base leading-7 text-gray-600">Head of Engineering</p>
          </li>
        </ul>
      </div>

      {/* CTA Section */}
      <div className="relative isolate mt-32 px-6 py-32 sm:mt-56 sm:py-40 lg:px-8">
        <div className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-30 blur-3xl">
          <div
            className="ml-[max(50%,38rem)] aspect-[1313/771] w-[82.125rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Ready to start predicting?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Join thousands of investors who are already using Finpulses.tech to make better investment decisions.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/register"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get started
            </Link>
            <Link href="/contact" className="text-sm font-semibold leading-6 text-gray-900">
              Contact sales <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 