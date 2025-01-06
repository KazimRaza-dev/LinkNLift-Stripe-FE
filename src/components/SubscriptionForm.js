import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import './SubscriptionForm.css';

const SubscriptionForm = () => {
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
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      const response = await axios.post(
        'http://localhost:8080/stripe/create-subscription',
        {
          price_id: 'price_1PIaMeDE8JmvRXeYiB0msyt5', // Replace with your actual price ID
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_JWT_TOKEN}`, // Using the token from .env
          },
        }
      );

      const { client_secret } = response.data;

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: paymentMethod.id,
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          setSuccess('Subscription successful!');
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscription-form-container">
      <form onSubmit={handleSubmit} className="subscription-form">
        <h2>LinkNLift Trainer Subscription Fee</h2>
        <CardElement className="card-element" />
        <button
          type="submit"
          disabled={!stripe || loading}
          className="submit-button"
        >
          {loading ? 'Processing...' : 'Subscribe'}
        </button>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </form>
    </div>
  );
};

export default SubscriptionForm;
