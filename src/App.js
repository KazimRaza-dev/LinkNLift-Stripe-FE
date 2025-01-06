// // src/App.js
// import React from 'react';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements } from '@stripe/react-stripe-js';
// import SubscriptionForm from './components/SubscriptionForm';

// // Load your publishable key from Stripe
// const stripePromise = loadStripe('pk_test_51JjI6XDE8JmvRXeYlN0DuPMze9qJMBsg2CjUZ5ELgqsxxsO7btOS9kZc3O2ErWqNdwVD8EQ48MPDHf8YZM5gbeTe00GYeMLxNI');

// const App = () => (
//   <Elements stripe={stripePromise}>
//     <SubscriptionForm />
//   </Elements>
// );

// export default App;

// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import SubscriptionForm from './components/SubscriptionForm';
import PartnerSubscriptionForm from './components/PartnerSubscriptionForm';
import OnboardingPage from './components/OnboardingPage';
import ReauthPage from './components/ReauthPage'; 
import ReturnPage from './components/ReturnPage'; 
import StripeDashboardLink from './components/StripeDashboardLink';
import SessionPaymentPage from './components/SessionPaymentPage';


// Load your publishable key from Stripe
const stripePromise = loadStripe(
  'pk_test_51PkklsDiyZydOJ5tvACOvTk4BL3FysTD0EWUShj6rtHONsNuUJbwjBf4dkl4vC0KbrgBNBPgxFHYxpszI97Cg8o700HUudMohd'
);

const App = () => (
  <Router>
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Trainer Subscription</Link>
          </li>
          <li>
            <Link to="/partner">Partner Subscription</Link>
          </li>
          <li>
            <Link to="/onboarding">Stripe Onboarding</Link>
          </li>
          <li><Link to="/dashboard">Stripe Dashboard</Link></li>
          <li><Link to="/session-payment">Session Payment</Link></li> {/* New Link */}

        </ul>
      </nav>
      <Elements stripe={stripePromise}>
        <Routes>
          <Route path="/" element={<SubscriptionForm />} />
          <Route path="/partner" element={<PartnerSubscriptionForm />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/reauth" element={<ReauthPage />} />
          <Route path="/return" element={<ReturnPage />} />
          <Route path="/dashboard" element={<StripeDashboardLink />} />
          <Route path="/session-payment" element={<SessionPaymentPage />} /> {/* New Route */}

        </Routes>
      </Elements>
    </div>
  </Router>
);

export default App;
