import React, { useState } from 'react';
import axios from 'axios';
import './OnboardingPage.css';

const OnboardingPage = () => {
  const [accountLink, setAccountLink] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreateExpressAccount = async () => {
    setLoading(true);
    setError(null);
    setAccountLink(null);

    try {
      const response = await axios.post(
        'http://localhost:8080/stripe/create-express-account',
        {},
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_JWT_TOKEN}`, // Using the token from .env
          },
        }
      );

      const { accountLink } = response.data;
      setAccountLink(accountLink);
    } catch (error) {
      setError('Failed to create Stripe Express account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-container">
      <h2>Stripe Onboarding</h2>
      <button onClick={handleCreateExpressAccount} disabled={loading}>
        {loading ? 'Creating Account...' : 'Start Onboarding'}
      </button>
      {accountLink && (
        <div className="onboarding-link">
          <p>Click the link below to complete the onboarding process:</p>
          <a href={accountLink} target="_blank" rel="noopener noreferrer">
            Complete Onboarding
          </a>
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default OnboardingPage;
