import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: 'What is Finpulses.tech?',
    answer: 'Finpulses.tech is an AI-powered stock analysis platform that provides real-time market insights, technical analysis, and stock predictions to help investors make informed decisions.'
  },
  {
    question: 'How accurate are the AI predictions?',
    answer: 'Our AI model combines multiple data sources, technical indicators, and market sentiment analysis to provide predictions with high accuracy rates. However, all investments carry risk, and past performance does not guarantee future results.'
  },
  {
    question: 'What subscription plans do you offer?',
    answer: 'We offer three subscription tiers: Basic, Intermediate, and Advanced. Each plan provides different levels of access to our features, with the Advanced plan offering unlimited access to all features including AI predictions.'
  },
  {
    question: 'Can I cancel my subscription at any time?',
    answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.'
  },
  {
    question: 'How do I get started?',
    answer: 'Simply create an account, choose your subscription plan, and start exploring our platform. We offer a comprehensive onboarding process to help you get familiar with all our features.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards and debit cards through our secure payment processor, Stripe.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we take security seriously. We use industry-standard encryption and security measures to protect your data and financial information.'
  },
  {
    question: 'Do you offer technical support?',
    answer: 'Yes, we provide technical support via email and live chat. Advanced plan subscribers also get priority support.'
  }
];

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Find answers to common questions about Finpulses.tech
          </p>
        </div>

        <div className="mt-12 space-y-6">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 flex justify-between items-center focus:outline-none"
                onClick={() => toggleItem(index)}
              >
                <span className="text-lg font-medium text-gray-900">
                  {item.question}
                </span>
                {openItems.includes(index) ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {openItems.includes(index) && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-base text-gray-600">
            Still have questions?{' '}
            <a
              href="/contact"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 