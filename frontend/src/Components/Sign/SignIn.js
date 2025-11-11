import React, { useState } from 'react';
import './SignIn.css';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    // to show in console.
    console.log('Submitted:', { email, password });
  };

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h1 className="signin-title">Sign In</h1>
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
