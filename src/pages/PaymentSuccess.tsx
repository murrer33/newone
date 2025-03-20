import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!sessionId) {
      setStatus('error');
      return;
    }

    const verifyPayment = async () => {
      try {
        // Call API to verify the payment session with Stripe
        const response = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            userId: user.uid,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus('success');
          setSubscriptionDetails(data.subscription);
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setStatus('error');
      }
    };

    verifyPayment();
  }, [sessionId, user, navigate]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold">Verifying your payment...</h2>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="max-w-lg mx-auto mt-16 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Verification Failed</h2>
        <p className="text-gray-700 mb-6">
          We couldn't verify your payment. If you believe this is an error, please contact our support team.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/pricing"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center"
          >
            Try Again
          </Link>
          <Link
            to="/contact"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded text-center"
          >
            Contact Support
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-16 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        <h2 className="text-3xl font-bold text-gray-900 mt-4">Payment Successful!</h2>
      </div>

      <div className="mb-6">
        <p className="text-gray-700">
          Thank you for subscribing to Finpulses! Your payment has been processed successfully.
        </p>
      </div>

      {subscriptionDetails && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-lg mb-2">Subscription Details</h3>
          <p className="text-gray-700">
            <span className="font-medium">Plan:</span> {subscriptionDetails.planName}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Price:</span> ${subscriptionDetails.price}/month
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Status:</span>{' '}
            <span className="text-green-600 font-medium">Active</span>
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center"
        >
          Go to Dashboard
        </Link>
        <Link
          to="/contact"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded text-center"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess; 