import React, { useState } from 'react';
import './SignIn.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    try {
      const response = await axios.post('/users/login', { gmail: email, password });

      const data = response.data;
      console.log('Login successful:', data);
      // Save token and user in context
      auth.login(data.token, data.user);

      // Redirect to task manager
      navigate('/');
    } catch (err) {
      console.error('Error during login:', err);
      setError(err.response?.data?.message || 'Failed to sign in');
    }
  };

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h1 className="signin-title">Sign In</h1>
        {error && <p className="signin-error">{error}</p>}
        <label className="signin-label">
          E-Mail Address
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="signin-input"
            placeholder="E-Mail Address"
            required
          />
        </label>
        <label className="signin-label">
          Password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="signin-input"
            placeholder="Password"
            required
          />
        </label>
        <button type="submit" className="signin-button">SIGN IN</button>
        <a href="/SignUp" className="signin-link">Sign Up.</a>
      </form>
    </div>
  );
}

export default SignIn;
