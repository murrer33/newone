import React from 'react';

interface PricingPlan {
  title: string;
  price: string;
  features: string[];
  isFeatured?: boolean;
}

const Pricing: React.FC = () => {
  const plans: PricingPlan[] = [
    {
      title: 'Basic',
      price: '$9.99',
      features: ['Basic Technical Indicators', 'Daily Stock Analysis', 'Email Alerts'],
    },
    {
      title: 'Pro',
      price: '$19.99',
      features: ['All Basic Features', 'Advanced Technical Analysis', 'Real-time Alerts', 'Portfolio Tracking'],
      isFeatured: true,
    },
    {
      title: 'Enterprise',
      price: '$49.99',
      features: ['All Pro Features', 'AI Price Predictions', 'Custom Indicators', 'API Access', 'Priority Support'],
    },
  ];

  return (
    <section id="pricing" className="pricing">
      <h2>Pricing Plans</h2>
      <div className="pricing-cards">
        {plans.map((plan, index) => (
          <div key={index} className={`card ${plan.isFeatured ? 'featured' : ''}`}>
            <h3>{plan.title}</h3>
            <p className="price">{plan.price}<span>/month</span></p>
            <ul>
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex}>{feature}</li>
              ))}
            </ul>
            <button>Choose Plan</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing; 