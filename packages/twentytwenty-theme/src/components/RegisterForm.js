import React, { useState } from "react";
import { styled } from "frontity";
import { getWpBaseUrl, handleRegistration } from "../utils";

const RegisterForm = ({ state, actions, onSwitchToLogin }) => {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${getWpBaseUrl(state)}/wp-json/custom/v1/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: registerUsername,
          email: registerEmail,
          password: registerPassword,
        }),
      });
      const json = await res.json();

      if (json.success) {
        // Use the global registration handler
        await handleRegistration(state, actions, {
          username: registerUsername,
          email: registerEmail,
          password: registerPassword
        });
        setLoading(false);
        // Optionally switch to login after successful registration
        // onSwitchToLogin();
      } else {
        setError(json.message || "Registration failed");
        setLoading(false);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleRegisterSubmit}>
      <h3>Register</h3>
      {error && <Error>{error}</Error>}
      <input 
        type="text" 
        placeholder="Username" 
        value={registerUsername} 
        onChange={(e) => setRegisterUsername(e.target.value)} 
        required 
        disabled={loading}
      />
      <input 
        type="email" 
        placeholder="Email" 
        value={registerEmail} 
        onChange={(e) => setRegisterEmail(e.target.value)} 
        required 
        disabled={loading}
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={registerPassword} 
        onChange={(e) => setRegisterPassword(e.target.value)} 
        required 
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
      <SwitchText onClick={onSwitchToLogin}>Back to Login</SwitchText>
    </Form>
  );
};

export default RegisterForm;

// Styled components
const Form = styled.form`
  display: flex;
  flex-direction: column;
  input {
    margin-bottom: 1rem;
    padding: 0.6rem;
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
  button {
    padding: 0.6rem;
    background: black;
    color: white;
    border: none;
    cursor: pointer;
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
`;

const SwitchText = styled.p`
  color: blue;
  margin-top: 1rem;
  cursor: pointer;
  font-size: 14px;
`;

const Error = styled.p`
  color: red;
`;