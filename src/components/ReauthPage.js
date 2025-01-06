import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const ReauthPage = () => {
  const [accountLink, setAccountLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchAccountLink = async () => {
      try {
        const userId = searchParams.get('userId');
        const response = await axios.get(
          `http://localhost:8080/stripe/retry-onboarding`,
          {
            params: { userId },
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_JWT_TOKEN}`, // Using the token from .env
            },
          }
        );

        const { accountLink } = response.data;
        setAccountLink(accountLink);
      } catch (error) {
        setError('Failed to fetch Stripe account link. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccountLink();
  }, [searchParams]);

  return (
    <div className="reauth-container">
      {loading && <p>Loading...</p>}
      {error && <div className="error-message">{error}</div>}
      {accountLink && (
        <div className="reauth-link">
          <p>Click the link below to complete the onboarding process:</p>
          <a href={accountLink} target="_blank" rel="noopener noreferrer">
            Complete Onboarding
          </a>
        </div>
      )}
    </div>
  );
};

export default ReauthPage;
