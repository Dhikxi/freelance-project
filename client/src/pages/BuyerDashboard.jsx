import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosFetch from '../utils/axiosFetch';
import './BuyerDashboard.scss';
import { userState } from '../atoms';
import { useRecoilValue } from 'recoil';

const BuyerDashboard = () => {
  const [freelancers, setFreelancers] = useState([]);
  const navigate = useNavigate();
  const user = useRecoilValue(userState);

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const res = await axiosFetch.get('/users/freelancers');
        setFreelancers(res.data);
      } catch (err) {
        console.error('Failed to fetch freelancers:', err);
      }
    };
    fetchFreelancers();
  }, []);

  const handleMessage = async (freelancerId) => {
    try {
      const res = await axiosFetch.post('/conversations', {
        to: freelancerId,
        from: user._id,
      });
      navigate(`/message/${res.data.conversationID}`);
    } catch (err) {
      console.error('Failed to start conversation:', err);
    }
  };

  const handleViewProfile = (freelancerId) => {
    navigate(`/freelancer/${freelancerId}`);
  };

  return (
    <div className="buyer-dashboard">
      <h2>Top Freelancers</h2>
      {freelancers.length === 0 ? (
        <p>No freelancers available right now.</p>
      ) : (
        <div className="freelancer-grid">
          {freelancers.slice(0, 6).map((freelancer) => (
            <div className="freelancer-card" key={freelancer._id}>
              <img
                src={freelancer.image ? `/uploads/${freelancer.image}` : '/media/default-user.jpg'}
                alt={freelancer.username}
                className="freelancer-img"
              />
              <h3>{freelancer.username}</h3>
              <p>{freelancer.category || 'General'}</p>
              <div className="btn-group">
                <button className="message-btn" onClick={() => handleMessage(freelancer._id)}>
                  Message
                </button>
                <button className="profile-btn" onClick={() => handleViewProfile(freelancer._id)}>
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;
