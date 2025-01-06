import React, { useState } from 'react';
import axios from 'axios';

const StripeDashboardLink = () => {
  const [loginLink, setLoginLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLoginLink = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        'http://localhost:8080/stripe/login-link',
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_JWT_TOKEN}`, // Using the token from .env
          },
        }
      );

      const { loginLink } = response.data;
      setLoginLink(loginLink);
    } catch (error) {
      setError('Failed to fetch login link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stripe-dashboard-link">
      <h2>Stripe Dashboard</h2>
      <button onClick={fetchLoginLink} disabled={loading}>
        {loading ? 'Generating Link...' : 'Access Stripe Dashboard'}
      </button>
      {loginLink && (
        <div>
          <a href={loginLink} target="_blank" rel="noopener noreferrer">
            Go to Stripe Dashboard
          </a>
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default StripeDashboardLink;
