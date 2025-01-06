import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import './SessionPaymentPage.css';

const SessionPaymentPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!stripe || !elements) {
      setError('Stripe has not loaded properly.');
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      // Call your backend to create the payment intent
      const response = await axios.post(
        'http://localhost:8080/stripe/create-session-payment',
        {
          booking_id: '66e32672b1e8e3e913c1a658', // Replace with the actual booking ID
          session_price: 1500, // Replace with the actual session price in cents (e.g., $50.00 = 5000 cents)
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_JWT_TOKEN}`,
          },
        }
      );

      const { client_secret } = response.data;

      // Confirm the payment with Stripe
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          setSuccess('Session payment successful!');
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="session-payment-container">
      <form onSubmit={handleSubmit} className="session-payment-form">
        <h2>Session Payment</h2>
        <CardElement className="card-element" />
        <button
          type="submit"
          disabled={!stripe || loading}
          className="submit-button"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </form>
    </div>
  );
};

export default SessionPaymentPage;
