import React, { useEffect } from 'react';
import { handleLogin, getWpBaseUrl, syncWishlistFromServer, showToast } from '../utils';

const GoogleLoginButton = ({ state, actions, isVisible }) => {
    useEffect(() => {
        // Check if Google API is loaded
        if (!window.google || !window.google.accounts) {
            console.error('Google API not loaded');
            return;
        }

        window.google.accounts.id.initialize({
            client_id: '816847953826-00tcio59f8u2cu7c4krhsuqq6qps1kvb.apps.googleusercontent.com',
            callback: handleCredentialResponse,
        });

        const buttonContainer = document.getElementById('google-login-button');
        if (buttonContainer) {
            window.google.accounts.id.renderButton(
                buttonContainer,
                { theme: 'outline', size: 'large' }
            );
        }
    }, []);

    const handleCredentialResponse = async (response) => {
        try {
            // Send the Google token to your WordPress backend for verification
            const res = await fetch(`${getWpBaseUrl(state)}/wp-json/custom/v1/google-login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    google_token: response.credential
                }),
            });

            const json = await res.json();

            if (json.success && json.token) {
                // Store the token first
                localStorage.setItem("jwt_token", json.token);

                // IMPORTANT: Verify the token is valid for cart operations
                try {
                    const tokenValidationRes = await fetch(`${getWpBaseUrl(state)}/wp-json/wp/v2/users/me`, {
                        headers: {
                            Authorization: `Bearer ${json.token}`,
                            "Content-Type": "application/json"
                        },
                    });

                    if (!tokenValidationRes.ok) {
                        console.error("Token validation failed, attempting to get JWT token");

                        // If the Google token doesn't work for WP API, get a proper JWT token
                        if (json.user_data && json.user_data.user_login) {
                            const jwtRes = await fetch(`${getWpBaseUrl(state)}/wp-json/jwt-auth/v1/token/validate`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${json.token}`
                                }
                            });

                            if (!jwtRes.ok) {
                                // If validation fails, we need to create a proper JWT session
                                // This might require a backend modification to return a proper JWT token
                                console.warn("JWT validation failed for Google user");
                            }
                        }
                    }
                } catch (validationError) {
                    console.error("Token validation error:", validationError);
                }

                // Fetch complete user details after Google login
                const userDetailsRes = await fetch(`${getWpBaseUrl(state)}/wp-json/wp/v2/users/me`, {
                    headers: {
                        Authorization: `Bearer ${json.token}`,
                        "Content-Type": "application/json"
                    },
                });

                let completeUserData = json.user_data;
                if (userDetailsRes.ok) {
                    const userDetails = await userDetailsRes.json();
                    completeUserData = { ...json.user_data, ...userDetails };
                }

                // Sync wishlist from server for Google users
                await syncWishlistFromServer(state);

                // Use the global login handler to trigger events with complete user data
                await handleLogin(state, actions, json.token, completeUserData);
                localStorage.setItem("User", "GoogleLogin");
                isVisible = false;
            } else {
                console.error("Google login failed:", json.message);
                showToast("Google login failed: " + (json.message || "Please try again"), "error");
            }
        } catch (error) {
            console.error("Google login error:", error);
            showToast("Google login failed. Please try again.", "error");
        }
    };

    return <div id="google-login-button"></div>;
};

export default GoogleLoginButton;