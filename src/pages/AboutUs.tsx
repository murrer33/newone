import React from 'react';
import { BarChart, Brain, Globe, Shield, Award, Clock, Users, Zap } from 'lucide-react';

const features = [
  {
    icon: <Brain className="h-8 w-8 text-blue-500" />,
    title: 'AI-Powered Analysis',
    description: 'Our advanced AI algorithms analyze market data and trends to provide accurate predictions and insights.'
  },
  {
    icon: <Globe className="h-8 w-8 text-blue-500" />,
    title: 'Global Market Coverage',
    description: 'Access real-time data and analysis for stocks, ETFs, and cryptocurrencies from markets worldwide.'
  },
  {
    icon: <BarChart className="h-8 w-8 text-blue-500" />,
    title: 'Advanced Technical Analysis',
    description: 'Comprehensive technical indicators and chart patterns to help you make informed trading decisions.'
  },
  {
    icon: <Shield className="h-8 w-8 text-blue-500" />,
    title: 'Secure & Reliable',
    description: 'Bank-level security measures to protect your data and investments, with 99.9% platform uptime.'
  }
];

const teamMembers = [
  {
    name: 'Berke U.',
    title: 'Founder & CEO',
    image: 'https://www.save-free.com/cdn/https://scontent-fra5-2.cdninstagram.com/v/t51.2885-19/461992421_901441847995471_2092891303507707244_n.jpg?_nc_ht=scontent-fra5-2.cdninstagram.com&_nc_cat=107&_nc_oc=Q6cZ2QFBdMEmtRtAZ_ZHTz3MAU2NFILQ7RUoJkC_AjG61GW89nLcelg7e2iLa-L1JhlPw5qT1zSJfdV5OOKRI5VJZlX7&_nc_ohc=h1jYVjF0hKsQ7kNvwHqsBlH&_nc_gid=A9scZGg7HdRK4P4fxCxt2g&edm=AEF8tYYBAAAA&ccb=7-5&oh=00_AfHjLeI2IGE9d_XkgApqkSKrCXFbYsyI_g6yuqnoptZVtA&oe=68046546&_nc_sid=1e20d2',
    bio: 'Found the Finpulses in 2025.' 
  },
  {
    name: 'Ata Ö.',
    title: 'Co-Founder & Marketing Manager',
    image: 'https://www.save-free.com/cdn/https://scontent-iev1-1.cdninstagram.com/v/t51.2885-19/404000244_317760777731785_8398678948957984784_n.jpg?_nc_ht=scontent-iev1-1.cdninstagram.com&_nc_cat=101&_nc_oc=Q6cZ2QGWjp523PRYrCIsuEbyhfkwpUPSuLf7JVi_mqMMvtW6vvQ85wFSHmCZePLyJjACCAc&_nc_ohc=E9da8Rfk16cQ7kNvwGVReKz&_nc_gid=cgYlrQuoursq_Xx9X-4emw&edm=AEF8tYYBAAAA&ccb=7-5&oh=00_AfFNt3AwsHCx4CQJ8_B0435_dUGwJHefQaG_pdIEng8pqw&oe=68049499&_nc_sid=1e20d2',
    bio: 'Expert in AI and Marketing.Loves to create AI-Built cockroach photos.'
  },
  {
    name: 'Erdem D.',
    title: 'Marketing Manager',
    image: 'https://www.save-free.com/cdn/https://scontent-iev1-1.cdninstagram.com/v/t51.2885-19/404000244_317760777731785_8398678948957984784_n.jpg?_nc_ht=scontent-iev1-1.cdninstagram.com&_nc_cat=101&_nc_oc=Q6cZ2QGWjp523PRYrCIsuEbyhfkwpUPSuLf7JVi_mqMMvtW6vvQ85wFSHmCZePLyJjACCAc&_nc_ohc=E9da8Rfk16cQ7kNvwGVReKz&_nc_gid=cgYlrQuoursq_Xx9X-4emw&edm=AEF8tYYBAAAA&ccb=7-5&oh=00_AfFNt3AwsHCx4CQJ8_B0435_dUGwJHefQaG_pdIEng8pqw&oe=68049499&_nc_sid=1e20d2',
    bio: 'Expert in Social Media Management and Trend Analysis.'
  }
];

const milestones = [
  {
    year: '2024',
    title: 'Research Begins',
    description: 'Our founders begin researching AI applications in financial markets.'
  },
  {
    year: '2025',
    title: 'Company Founded',
    description: 'FinPulses is officially founded with seed funding from tech investors.'
  },
  {
    year: 'SOON',
    title: 'Beta Launch',
    description: 'First version of our platform launches to beta testers with promising results.'
  },
  
];

const stats = [
  { icon: <Users className="h-6 w-6 text-blue-400" />, value: '1,000+', label: 'Active Users' },
  { icon: <Globe className="h-6 w-6 text-blue-400" />, value: '30+', label: 'Stocks Covered' },
  { icon: <Award className="h-6 w-6 text-blue-400" />, value: '90%', label: 'Prediction Accuracy' },
  { icon: <Clock className="h-6 w-6 text-blue-400" />, value: '24/7', label: 'Market Monitoring' }
];

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-800 text-white overflow-hidden">
        {/* Background pattern */}
        <div className="hidden sm:block sm:absolute sm:inset-0">
          <svg className="absolute bottom-0 right-0 transform translate-x-1/2 mb-48" width="404" height="404" fill="none" viewBox="0 0 404 404" aria-hidden="true">
            <defs>
              <pattern id="85737c0e-0916-41d7-917f-596dc7edfa27" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" className="text-blue-500" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
          </svg>
          <svg className="absolute bottom-0 right-0 transform -translate-x-1/2 -translate-y-1/2 sm:translate-y-0" width="404" height="404" fill="none" viewBox="0 0 404 404" aria-hidden="true">
            <defs>
              <pattern id="85737c0e-0916-41d7-917f-596dc7edfa28" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" className="text-blue-400" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa28)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto py-20 px-4 sm:py-28 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
              About Finpulses.tech
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100">
              Empowering investors with AI-driven market insights and analysis since 2024
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-50 mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="mt-1 text-sm font-medium text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Story
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            FinPulses was born from a simple observation: while institutional investors have access to
            sophisticated AI tools for market analysis, individual investors are left behind. We set out
            to change that by making advanced financial analysis accessible to everyone.
          </p>
          
          {/* Timeline */}
          <div className="mt-16 relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gray-200"></div>
            <div className="space-y-16">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative ${index % 2 === 0 ? 'text-right pr-16 md:pr-24' : 'text-left pl-16 md:pl-24'}`}>
                  <div className={`absolute top-0 ${index % 2 === 0 ? 'right-0 mr-7 md:mr-16' : 'left-0 ml-7 md:ml-16'}`}>
                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white">
                      <span className="text-lg font-bold">{milestone.year}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{milestone.title}</h3>
                    <p className="mt-2 text-gray-600">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Our Mission
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                At Finpulses.tech, we're committed to democratizing access to sophisticated
                financial analysis tools. By combining cutting-edge AI technology with
                comprehensive market data, we help investors make more informed decisions
                and achieve their financial goals.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                We believe that everyone deserves access to the same quality of financial insights,
                regardless of their portfolio size or technical expertise. Our platform distills
                complex data into clear, actionable recommendations that anyone can understand and apply.
              </p>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="relative h-64 sm:h-72 md:h-96 lg:h-full rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                  alt="Trading floor visualization"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            What Sets Us Apart
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Our platform combines the latest in artificial intelligence with deep financial expertise
            to deliver insights you won't find anywhere else.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-2">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg transition-transform hover:transform hover:scale-105">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Meet Our Team
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Our diverse team combines expertise in finance, data science, and technology
              to build the future of investment analysis.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    className="object-cover w-full h-48"
                    src={member.image}
                    alt={member.name}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-blue-600 mb-4">{member.title}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                  <div className="mt-4 flex space-x-3">
                    <a href="#" className="text-gray-400 hover:text-gray-500">
                      <span className="sr-only">LinkedIn</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Twitter</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Values
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do at FinPulses.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">
                Continuously pushing the boundaries of what's possible in financial
                technology and analysis.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-4">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600">
                Committing to the highest standards in every aspect of our platform
                and service.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Accessibility</h3>
              <p className="text-gray-600">
                Making sophisticated financial tools available to everyone, regardless
                of experience level.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-blue-300">Join thousands of investors using FinPulses today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="/demo-stock"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-100"
              >
                Try Demo
              </a>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 