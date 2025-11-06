// /components/login-page.js
import React, { useState } from "react";
import { connect, useActions } from "frontity";

const LoginPage = ({ actions }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await fetch("https://www.croscrow.com/a/wp-json/jwt-auth/v1/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      alert("Logged in successfully!");
      actions.router.set("/my-account/");
    } else {
      alert("Login failed: " + data.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
    </div>
  );
};

export default connect(LoginPage);
