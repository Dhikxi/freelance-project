import { useState, useEffect } from 'react';
import './ProjectPopup.scss';
import axiosFetch from '../utils/axiosFetch';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../atoms';

const ProjectPopup = ({ freelancerId, freelancerName, onClose }) => {
  const user = useRecoilValue(userState);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    freelancerId: freelancerId,
  });

  const [submitMessage, setSubmitMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableProjects, setAvailableProjects] = useState([]);
useEffect(() => {
  const fetchAvailableProjects = async () => {
    try {
      const res = await axiosFetch.get('/projects/my'); // <-- fetch buyer's projects
      setAvailableProjects(res.data);
    } catch (error) {
      console.error('Error fetching buyer projects:', error);
    }
  };

  fetchAvailableProjects();
}, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProjectSelect = (e) => {
    const selectedId = e.target.value;
    if (selectedId === '') return;

    const selectedProject = availableProjects.find((p) => p._id === selectedId);
    if (selectedProject) {
      setForm((prev) => ({
        ...prev,
        title: selectedProject.title,
        budget: selectedProject.budget,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitMessage('');

    try {
      const res = await axiosFetch.post('/projects', form);

      const projectId = res.data._id;

      const paymentRes = await axiosFetch.post('/orders/create-payment-intent', {
        projectId,
        freelancerId,
        amount: form.budget,
      });

      const clientSecret = paymentRes.data.clientSecret;

      localStorage.setItem('projectId', projectId);
      localStorage.setItem('clientSecret', clientSecret);

      navigate('/pay', {
        state: {
          projectId,
          clientSecret,
          freelancerId,
        },
      });
    } catch (err) {
      console.error('Error submitting project or creating payment:', err);
      setSubmitMessage('Failed to create project or payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="project-popup-overlay">
      <div className="project-popup">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>Hire {freelancerName}</h2>
        <form onSubmit={handleSubmit}>
          <label>Choose From Existing Projects (Optional)</label>
          <select onChange={handleProjectSelect} defaultValue="">
            <option value="">-- Select Existing Project --</option>
            {availableProjects.map((proj) => (
              <option key={proj._id} value={proj._id}>
                {proj.title} (₹{proj.budget})
              </option>
            ))}
          </select>

          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Project Description"
            value={form.description}
            onChange={handleChange}
            required
          ></textarea>
          <input
            type="number"
            name="budget"
            placeholder="Budget (INR)"
            value={form.budget}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Continue to Payment'}
          </button>
          {submitMessage && <p className="submit-message">{submitMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default ProjectPopup;
