import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { generateImageURL } from '../../../utils';
import './Register.scss';

const Register = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formInput, setFormInput] = useState({
    username: "",
    email: "",
    password: "",
    phone: '',
    description: '',
    isSeller: false,
  });

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    for (let key in formInput) {
      if (formInput[key] === '') {
        toast.error('Please fill all input field: ' + key);
        return;
      }
      else if (key === 'phone' && formInput[key].length < 9) {
        toast.error('Enter valid phone number!');
        return;
      }
    }

    setLoading(true);
    try {
      let imageUrl = '';
      if (image) {
        const result = await generateImageURL(image);
        imageUrl = result?.url || '';
      }

      const payload = { ...formInput, image: imageUrl };

      console.log('Submitting payload:', payload); // ✅ DEBUG LOG

      const res = await axios.post('http://localhost:5000/api/auth/register', payload, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      toast.success('Registration successful!');
      setLoading(false);
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error?.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { value, name, type, checked } = event.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setFormInput({
      ...formInput,
      [name]: inputValue
    });
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <div className="left">
          <h1>Create a new account</h1>
          <label>Username</label>
          <input
            name="username"
            type="text"
            placeholder="johndoe"
            onChange={handleChange}
          />
          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="email"
            onChange={handleChange}
          />
          <label>Password</label>
          <input name="password" type="password" onChange={handleChange} />
          <label>Profile Picture</label>
          <input type="file" onChange={(event) => setImage(event.target.files[0])} />
          <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Register'}</button>
        </div>
        <div className="right">
          <p>Already have an account? <Link to='/login'>Signin</Link></p>
          <h1>I want to become a seller</h1>
          <div className="toggle">
            <label>Activate the seller account</label>
            <label className="switch">
              <input type="checkbox" name='isSeller' onChange={handleChange} />
              <span className="slider round"></span>
            </label>
          </div>
          <label>Phone Number</label>
          <input
            name="phone"
            type="text"
            placeholder="+1 1234 567 890"
            onChange={handleChange}
          />
          <label>Description</label>
          <textarea
            placeholder="A short description of yourself"
            name="description"
            cols="30"
            rows="10"
            onChange={handleChange}
          ></textarea>
        </div>
      </form>
    </div>
  );
};

export default Register;
