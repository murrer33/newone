import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">About</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/about" className="text-base text-gray-500 hover:text-gray-900">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-base text-gray-500 hover:text-gray-900">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-base text-gray-500 hover:text-gray-900">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/help" className="text-base text-gray-500 hover:text-gray-900">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-base text-gray-500 hover:text-gray-900">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-base text-gray-500 hover:text-gray-900">
                  System Status
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/privacy" className="text-base text-gray-500 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-base text-gray-500 hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-base text-gray-500 hover:text-gray-900">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Connect</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="https://twitter.com/finpulses" className="text-base text-gray-500 hover:text-gray-900">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://linkedin.com/company/finpulses" className="text-base text-gray-500 hover:text-gray-900">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://github.com/finpulses" className="text-base text-gray-500 hover:text-gray-900">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} Finpulses.tech. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 