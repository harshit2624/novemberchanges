// /components/register-page.js
import React, { useState } from "react";
import { connect } from "frontity";
import { getWpBaseUrl } from "../utils";

const RegisterPage = ({ state }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    const baseUrl = getWpBaseUrl(state);
    const res = await fetch(`${baseUrl}/wp-json/wp/v2/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });

    const data = await res.json();
    if (!data.code) {
      alert("Registration successful! Please login.");
    } else {
      alert("Error: " + data.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={register}>Register</button>
    </div>
  );
};

export default connect(RegisterPage);
