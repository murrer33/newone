import React, { useState } from 'react';
import { Mail, Phone, MapPin, Globe, Clock, MessageSquare } from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactOffice {
  name: string;
  address: string[];
  phone: string;
  email: string;
  hours: string;
}

const offices: ContactOffice[] = [
  {
    name: 'San Francisco (HQ)',
    address: ['123 Market Street', 'Suite 456', 'San Francisco, CA 94105', 'USA'],
    phone: '+1 (555) 123-4567',
    email: 'sf@finpulses.tech',
    hours: 'Mon-Fri: 9AM - 6PM PT'
  },
  {
    name: 'New York',
    address: ['55 Wall Street', '10th Floor', 'New York, NY 10005', 'USA'],
    phone: '+1 (555) 987-6543',
    email: 'nyc@finpulses.tech',
    hours: 'Mon-Fri: 9AM - 6PM ET'
  },
  {
    name: 'London',
    address: ['125 Old Broad Street', 'Floor 7', 'London EC2N 1AR', 'United Kingdom'],
    phone: '+44 20 7123 4567',
    email: 'london@finpulses.tech',
    hours: 'Mon-Fri: 9AM - 5:30PM GMT'
  }
];

const quickLinks = [
  { name: 'FAQs', href: '/faq', description: 'Find answers to common questions' },
  { name: 'API Documentation', href: '/docs/api', description: 'Developer resources and guides' },
  { name: 'Knowledge Base', href: '/help', description: 'Tutorials and how-to articles' },
  { name: 'Pricing', href: '/pricing', description: 'Subscription plans and features' }
];

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOffice, setSelectedOffice] = useState<number>(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Here you would typically send the form data to your backend
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-700 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl">
            Contact Us
          </h1>
          <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
            Have questions about our platform or need assistance with your account?
            Our team is here to help.
          </p>
        </div>
      </div>

      {/* Contact Options Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Contact Methods */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Get in Touch</h2>
            <div className="flex items-start">
              <Mail className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Email</h3>
                <p className="mt-1 text-gray-600">support@finpulses.tech</p>
                <p className="mt-1 text-sm text-gray-500">We respond within 24 hours</p>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                <p className="mt-1 text-gray-600">+1 (555) 123-4567</p>
                <p className="mt-1 text-sm text-gray-500">Mon-Fri from 9AM to 6PM EST</p>
              </div>
            </div>

            <div className="flex items-start">
              <MessageSquare className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Live Chat</h3>
                <p className="mt-1 text-gray-600">Available for Pro plan subscribers</p>
                <p className="mt-1 text-sm text-gray-500">Chat with our support team in real-time</p>
              </div>
            </div>

            <div className="flex items-start">
              <Globe className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Social Media</h3>
                <div className="mt-2 flex space-x-4">
                  <a href="#" className="text-gray-500 hover:text-gray-700">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-500 hover:text-gray-700">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-500 hover:text-gray-700">
                    <span className="sr-only">Facebook</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              {success ? (
                <div className="text-center py-12 px-6">
                  <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <h3 className="mt-4 text-xl font-medium text-green-600">
                    Thank you for your message!
                  </h3>
                  <p className="mt-2 text-gray-600">
                    We'll get back to you as soon as possible.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>

                  {error && (
                    <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="subject"
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select a topic</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Account Issues">Account Issues</option>
                      <option value="Billing Questions">Billing Questions</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        required
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms" className="font-medium text-gray-700">
                        I agree to the <a href="/privacy" className="text-blue-600 hover:underline">privacy policy</a>
                      </label>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      aria-disabled={loading}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Office Locations */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Offices</h2>
          
          {/* Office tabs */}
          <div className="flex overflow-x-auto space-x-4 pb-4 mb-8 justify-center">
            {offices.map((office, index) => (
              <button
                key={index}
                onClick={() => setSelectedOffice(index)}
                className={`px-4 py-2 rounded-md text-sm font-medium shrink-0 ${
                  selectedOffice === index 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {office.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Office details */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{offices[selectedOffice].name}</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-gray-700 font-medium">Address</p>
                    {offices[selectedOffice].address.map((line, i) => (
                      <p key={i} className="text-gray-600">{line}</p>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-gray-700 font-medium">Phone</p>
                    <p className="text-gray-600">{offices[selectedOffice].phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-gray-700 font-medium">Email</p>
                    <p className="text-gray-600">{offices[selectedOffice].email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-gray-700 font-medium">Office Hours</p>
                    <p className="text-gray-600">{offices[selectedOffice].hours}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Map image */}
            <div className="h-64 md:h-80 bg-gray-300 rounded-lg overflow-hidden shadow-md">
              <iframe 
                title={`${offices[selectedOffice].name} Office Location`}
                className="w-full h-full border-0"
                src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(
                  offices[selectedOffice].address.join(', ')
                )}`}
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Quick Links</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <a 
                key={index}
                href={link.href}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-medium text-blue-600 mb-2">{link.name}</h3>
                <p className="text-gray-600">{link.description}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs; 