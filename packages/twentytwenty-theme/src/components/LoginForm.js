import React, { useState, useEffect } from "react";
import { connect, styled } from "frontity";
import Link from "@frontity/components/link";
import FlashScreen from "./FlashScreen";
import {
  getWpBaseUrl,
  handleLogin,
  subscribeToAuthEvents
} from "../utils";

const LoginPage = ({ state, actions }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFlashScreen, setShowFlashScreen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const savedToken = localStorage.getItem("jwt_token");
    if (savedToken) {
      setIsLoggedIn(true);
      // Optionally redirect to account page
      actions.router.set("/my-account");
      return;
    }

    // Subscribe to global auth events
    const unsubscribeAuth = subscribeToAuthEvents({
      onLogin: async (data) => {
        setIsLoggedIn(true);
        // Redirect to account page after login
        actions.router.set("/my-account");
      },
      onLogout: () => {
        setIsLoggedIn(false);
      },
      onRegister: (userData) => {
        // Handle registration if needed
      }
    });

    // Cleanup on unmount
    return () => {
      unsubscribeAuth();
    };
  }, [actions.router]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const res = await fetch(`${getWpBaseUrl(state)}/wp-json/jwt-auth/v1/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const json = await res.json();

      if (json.token) {
        // Use the global login handler
        await handleLogin(state, actions, json.token, json.user_data);
        setLoading(false);
        // Redirect will be handled by the useEffect subscription
      } else {
        setError(json.message || "Login failed");
        setLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please try again.");
      setLoading(false);
    }
  };

  const handleShowFlashScreen = () => {
    setShowFlashScreen(!showFlashScreen);
  };

  // If already logged in, show a message or redirect
  if (isLoggedIn) {
    return (
      <Wrapper>
        <Message>
          <h3>You are already logged in!</h3>
          <p>Redirecting to your account...</p>
          <Link link="/my-account">
            <button>Go to My Account</button>
          </Link>
        </Message>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Container>
        <Form onSubmit={handleLoginSubmit}>
          <h2>Login to Your Account</h2>
          {error && <Error>{error.replace(/<[^>]+>/g, "")}</Error>}
          
          <InputGroup>
            <label>Username or Email</label>
            <input 
              type="text" 
              placeholder="Enter your username or email" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              disabled={loading}
            />
          </InputGroup>

          <InputGroup>
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              disabled={loading}
            />
          </InputGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </SubmitButton>

          <LinksContainer>
            <Link link="/forgot-password">
              <LinkText>Forgot Password?</LinkText>
            </Link>
          </LinksContainer>

          <Divider>or</Divider>

          <SocialLoginButton onClick={handleShowFlashScreen}>
            Continue With Mobile or Google
          </SocialLoginButton>

          <RegisterPrompt>
            <span>Don't have an account? </span>
            <Link link="/register">
              <RegisterLink>Create Account</RegisterLink>
            </Link>
          </RegisterPrompt>
        </Form>

        {showFlashScreen && (
          <FlashScreen
            isVisible={showFlashScreen}
            onClose={() => setShowFlashScreen(false)}
            actions={actions}
            state={state}
          />
        )}
      </Container>
    </Wrapper>
  );
};

export default connect(LoginPage);

// Styled components
const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  padding: 1rem;
`;

const Container = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;

  h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #555;
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s ease;

    &:focus {
      outline: none;
      border-color: #007cba;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background-color: #f9f9f9;
    }
  }
`;

const SubmitButton = styled.button`
  background: #000;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: background-color 0.3s ease;

  &:hover:not(:disabled) {
    background: #333;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LinksContainer = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

const LinkText = styled.span`
  color: #007cba;
  text-decoration: none;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
`;

const Divider = styled.div`
  text-align: center;
  margin: 1rem 0;
  position: relative;
  color: #666;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #ddd;
  }

  &::after {
    content: 'or';
    background: white;
    padding: 0 1rem;
  }
`;

const SocialLoginButton = styled.button`
  background: #4285f4;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: background-color 0.3s ease;

  &:hover {
    background: #357ae8;
  }
`;

const RegisterPrompt = styled.div`
  text-align: center;
  color: #666;
  font-size: 0.9rem;
`;

const RegisterLink = styled.span`
  color: #007cba;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const Message = styled.div`
  text-align: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;

  h3 {
    color: #28a745;
    margin-bottom: 1rem;
  }

  p {
    color: #666;
    margin-bottom: 1.5rem;
  }

  button {
    background: #007cba;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;

    &:hover {
      background: #005a87;
    }
  }
`;

const Error = styled.div`
  color: #dc3545;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;