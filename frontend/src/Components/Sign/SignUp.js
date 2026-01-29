import React, { useState } from "react";
import "./SignUp.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

function SignUp() {
  const [name, setName] = useState("");
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();

  const hadleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/users', { name, gmail, password });
      const data = response.data;
      // Save token and user in auth context
      if (data.token) {
        auth.login(data.token, data.user || { name, gmail });
      }
      // Redirect to task manager
      navigate('/');
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err.response?.data?.error || 'Failed to create user');
    }

    //clearing form after submiting.
    setName("");
    setGmail("");
    setPassword("");
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={hadleSubmit}>
        <h1 className="signup-title">Sign Up</h1>

        {error && <p className="signup-error">{error}</p>}

        <label className="signup-label">
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="signup-input"
            placeholder="Enter Name"
            required
          />
        </label>
        <label className="signup-label">
          G-Mail Adress
          <input
            type="email"
            value={gmail}
            onChange={(e) => setGmail(e.target.value)}
            className="signup-input"
            placeholder="Enter a valid gmail"
            required
          />
        </label>
        <label className="signup-label">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signup-input"
            placeholder="Give a strong password."
            required
          />
        </label>

        <button type="submit" className="signup-button">
          REGISTER
        </button>
        <a href="/SignIn" className="signin-link">
          Sign In.
        </a>
      </form>
    </div>
  );
}

export default SignUp;