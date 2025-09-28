import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosFetch from '../utils/axiosFetch';
import ProjectPopup from '../components/ProjectPopup';
import './FreelancerProfile.scss';

const FreelancerProfile = () => {
  const { freelancerId } = useParams();
  const [freelancer, setFreelancer] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: ''
  });

  useEffect(() => {
    const fetchFreelancer = async () => {
      try {
        const res = await axiosFetch.get(`/users/${freelancerId}`);
        setFreelancer(res.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch freelancer details:", err);
        setError("Could not load freelancer profile. Please try again.");
      }
    };

    fetchFreelancer();
  }, [freelancerId]);

  const handleHire = () => {
    setShowPopup(true);
  };

  const handleInputChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosFetch.post('/projects', {
        ...form,
        freelancerId
      });
      setSubmitMessage("Project posted successfully!");
      setForm({ title: '', description: '', budget: '', deadline: '' });
    } catch (err) {
      console.error("Failed to post project:", err);
      setSubmitMessage("Failed to post project. Please try again.");
    }
  };

  if (error) return <div className="freelancer-profile error">{error}</div>;
  if (!freelancer) return <div className="freelancer-profile loading">Loading...</div>;

  return (
    <div className="freelancer-profile">
      <div className="profile-card">
        <img
          src={freelancer.image ? `/uploads/${freelancer.image}` : '/media/default-user.jpg'}
          alt={freelancer.username}
          className="profile-image"
        />
        <h2>{freelancer.username}</h2>
        <p className="email">📧 {freelancer.email}</p>
        <p className="country">🌍 Country: {freelancer.country}</p>
        <p className="phone">📞 Phone: {freelancer.phone}</p>
        <p className="desc">{freelancer.description}</p>

        <button className="hire-btn" onClick={handleHire}>
          Hire Now
        </button>
      </div>

      {showPopup && (
        <ProjectPopup
          freelancerId={freelancer._id}
          freelancerName={freelancer.username}
          onClose={() => setShowPopup(false)}
        />
      )}

      <div className="post-project-form">
        <h3>Post a Project to {freelancer.username}</h3>
        <form onSubmit={handleProjectSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={form.title}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="description"
            placeholder="Project Description"
            value={form.description}
            onChange={handleInputChange}
            required
          ></textarea>
          <input
            type="number"
            name="budget"
            placeholder="Budget (INR)"
            value={form.budget}
            onChange={handleInputChange}
            required
          />
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Post Project</button>
        </form>
        {submitMessage && <p className="submit-message">{submitMessage}</p>}
      </div>
    </div>
  );
};

export default FreelancerProfile;
