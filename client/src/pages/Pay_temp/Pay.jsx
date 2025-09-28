import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useParams } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import axiosFetch from '../../utils/axiosFetch';
import { CheckoutForm } from '../../components';
import './Pay.scss';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Pay = () => {
  const { _id } = useParams(); // project ID
  const [clientSecret, setClientSecret] = useState('');
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      try {
        const [{ data: projectData }, { data: intentData }] = await Promise.all([
          axiosFetch.get(`/projects/${_id}`),
          axiosFetch.post(`/orders/create-payment-intent/${_id}`)
        ]);
        setProject(projectData);
        setClientSecret(intentData.clientSecret);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load payment details.');
        setLoading(false);
      }
    })();
  }, [_id]);

  const appearance = {
    theme: 'stripe',
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className='pay'>
      <h2>Pay Securely with Stripe</h2>

      {loading && <p>Loading payment information...</p>}
      {error && <p className="error">{error}</p>}

      {project && (
        <div className="project-summary">
          <h3>Project: {project.title}</h3>
          <p><strong>Freelancer:</strong> {project.freelancerName || "Unknown"}</p>
          <p><strong>Gig:</strong> {project.gigTitle || "Gig not specified"}</p>
          <p><strong>Budget:</strong> ₹{project.budget}</p>
          <p><strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}</p>
        </div>
      )}

      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default Pay;
