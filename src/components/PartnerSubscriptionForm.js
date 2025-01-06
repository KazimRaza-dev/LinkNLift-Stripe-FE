import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import './PartnerSubscriptionForm.css';

const PartnerSubscriptionForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [priceId, setPriceId] = useState(''); // State to hold selected price ID

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
          price_id: priceId, // Use the selected price ID
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
        <h2>Partner Subscription</h2>
        <div className="plan-info">
          <div
            className={`plan-option ${
              priceId === 'price_1PfR1QDE8JmvRXeYKRoJpb4Q' ? 'selected' : ''
            }`}
            onClick={() => setPriceId('price_1PfR1QDE8JmvRXeYKRoJpb4Q')}
          >
            <h3>1 Month Plan</h3>
            <p>$15.99 per month</p>
            <p>See Who likes you, Boost, LiftLine Questions</p>
          </div>
          <div
            className={`plan-option ${
              priceId === 'price_1PfR6sDE8JmvRXeYDEWqHnT1' ? 'selected' : ''
            }`}
            onClick={() => setPriceId('price_1PfR6sDE8JmvRXeYDEWqHnT1')}
          >
            <h3>3 Months Plan</h3>
            <p>$31.99 per 3 months</p>
            <p>See Who likes you, Boost, LiftLine Questions</p>
          </div>
          <div
            className={`plan-option ${
              priceId === 'price_1PfR8ADE8JmvRXeYeujkMGoC' ? 'selected' : ''
            }`}
            onClick={() => setPriceId('price_1PfR8ADE8JmvRXeYeujkMGoC')}
          >
            <h3>12 Months Plan</h3>
            <p>$89.99 per year</p>
            <p>See Who likes you, Boost, LiftLine Questions</p>
          </div>
        </div>
        <CardElement className="card-element" />
        <button
          type="submit"
          disabled={!stripe || loading || !priceId}
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

export default PartnerSubscriptionForm;
