import React, { useState } from "react";
import "./../styles/RegistrationPage.css";
import { registerUser } from "../services/rservice"; // Assuming you have an authService.js file
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

function RegistrationPage() {
  const navigate = useNavigate(); // Initialize navigate

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async () => {
    try {
      const userData = {
        email,
        password,
        department,
        role,
        username,
      };

      const response = await registerUser(userData); // API call
      console.log("Registration successful:", response);
      setSuccessMessage("Registration successful! Please login.");
      navigate("/login"); // Use navigate for redirection
    } catch (error) {
      setError("Failed to register. Please try again.");
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-form">
        <h2>Create Account</h2>
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
        <div className="input-group">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input
            type="password" // Change type to "password" for security
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input
            type="text"
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>
        <button className="register-btn" onClick={handleRegister}>
          Register
        </button>
      </div>
    </div>
  );
}

export default RegistrationPage;
