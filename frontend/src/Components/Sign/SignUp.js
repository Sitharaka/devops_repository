import React, { useState } from "react";
import "./SignUp.css";

function SignUp() {
  const [name, setName] = useState("");
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");

  const hadleSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      name,
      gmail,
      password,
    };

    //To diplay in console
    console.log("New User : ", newUser);

    //clearing form after submiting.
    setName("");
    setGmail("");
    setPassword("");
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={hadleSubmit}>
        <h1 className="signup-title">Sign Up</h1>

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
            type="text"
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
            type="text"
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