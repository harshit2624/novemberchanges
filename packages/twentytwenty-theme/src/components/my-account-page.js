import React, { useState, useEffect } from "react";
import { connect, styled } from "frontity";
import Link from "@frontity/components/link";
import Loading from "./loading";
import FlashScreen from "./FlashScreen";
import {
  getWpBaseUrl,
  // Import the new event management functions
  eventManager,
  handleLogin,
  handleLogout,
  handleRegistration,
  handleProfileUpdate,
  subscribeToAuthEvents
} from "../utils";

const MyAccountPage = ({ state, actions }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [accountVisibility, setAccountVisibility] = useState("private");
  const [GoogleUser, setGoogleUser] = useState("Normal");
  const [showFlashScreen, setShowFlashScreen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("jwt_token");
    const GoogleUser = localStorage.getItem("User") || "Normal";
    if (savedToken) {
      setToken(savedToken);
      fetchOrders(savedToken);
      fetchUserDetails(savedToken);
      setGoogleUser(GoogleUser);
    }

    // Subscribe to global auth events
    const unsubscribeAuth = subscribeToAuthEvents({
      onLogin: async (data) => {
        setToken(data.token);

        // Force refetch for Google login users
        if (data.userData) {
          setUserDetails(data.userData);
          // Refetch both orders and user details to ensure sync
          await fetchOrders(data.token);
          await fetchUserDetails(data.token);
        }
      },
      onLogout: () => {
        setToken(null);
        setUserDetails(null);
        setOrders([]);
        setCurrentTab("dashboard");
      },
      onRegister: (userData) => {
        // console.log('User registered globally:', userData);
      }
    });

    // Subscribe to other events if needed
    const unsubscribeProfile = eventManager.on('user:profile_updated', (data) => {
      setUserDetails(data.updatedData);
    });

    // Cleanup on unmount
    return () => {
      unsubscribeAuth();
      unsubscribeProfile();
    };
  }, []);

  const fetchUserDetails = async (token) => {
    try {
      // Step 1: Fetch WP core user data
      const userRes = await fetch(`${getWpBaseUrl(state)}/wp-json/wp/v2/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userJson = await userRes.json();

      if (!userJson?.id) {
        console.error("User not found.");
        return;
      }

      // Step 2: Fetch WooCommerce customer details
      const customerRes = await fetch(
        `${getWpBaseUrl(state)}/wp-json/wc/v3/customers/${userJson.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const customerJson = await customerRes.json();

      if (customerJson?.message) {
        console.error("Customer fetch error:", customerJson.message);
      }

      // Step 3: Fetch account visibility from your custom API
      const visibilityRes = await fetch(
        `${getWpBaseUrl(state)}/wp-json/friends/v1/visibility`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const visibilityJson = await visibilityRes.json();

      // Fallback if custom API didn’t return
      const visibility =
        visibilityJson?.account_visibility ||
        userJson.meta?.account_visibility ||
        "private";

      setAccountVisibility(visibility);

      // Step 4: Merge all data into one object
      const combinedData = {
        ...customerJson,
        username: userJson.username,
        email: userJson.email,
        id: userJson.id,
        account_visibility: visibility,
      };

      setUserDetails(combinedData);
    } catch (err) {
      console.error("User fetch failed:", err);
    }
  };


  const fetchOrders = async (token) => {
    try {
      setLoading(true);
      const userRes = await fetch(`${getWpBaseUrl(state)}/wp-json/wp/v2/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userJson = await userRes.json();
      if (!userJson?.id) return;

      const ordersRes = await fetch(
        `${getWpBaseUrl(state)}/wp-json/wc/v3/orders?customer=${userJson.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const ordersJson = await ordersRes.json();
      setLoading(false);
      if (!ordersJson.message) setOrders(ordersJson);
    } catch (err) {
      console.error("Orders fetch failed:", err);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${getWpBaseUrl(state)}/wp-json/jwt-auth/v1/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const json = await res.json();

      if (json.token) {
        // Use the global login handler
        setIsRedirecting(true);
        await handleLogin(state, actions, json.token, json.user_data);

        // Update local state
        setToken(json.token);
        fetchOrders(json.token);
        fetchUserDetails(json.token);
        setIsRedirecting(false);
      } else {
        setError(json.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please try again.");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
        setIsRedirecting(true);
        // Use the global registration handler
        await handleRegistration(state, actions, {
          username: registerUsername,
          email: registerEmail,
          password: registerPassword
        });
        setIsRedirecting(false);
        // Update local state will be handled by the event listener
      } else {
        setError(json.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Registration failed. Please try again.");
    }
  };

  const handleLogoutClick = () => {
    // Use the global logout handler
    handleLogout(state, actions);
    // Local state will be updated by the event listener
  };

  const handleUpdateDetails = async () => {
    if (!token || !userDetails) return;

    // Password validation logic
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        alert("Please fill in all password fields.");
        return;
      }
      if (newPassword !== confirmPassword) {
        alert("New password and confirm password do not match.");
        return;
      }

      const authRes = await fetch(`${getWpBaseUrl(state)}/wp-json/jwt-auth/v1/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userDetails.email,
          password: currentPassword,
        }),
      });
      const authJson = await authRes.json();
      if (!authJson.token) {
        alert("Current password is incorrect.");
        return;
      }
    }

    // Check for changes
    const originalRes = await fetch(`${getWpBaseUrl(state)}/wp-json/wc/v3/customers/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const original = await originalRes.json();

    const hasChanges =
      userDetails.first_name !== original.first_name ||
      userDetails.last_name !== original.last_name ||
      userDetails.email !== original.email ||
      userDetails.billing?.phone !== original.billing?.phone ||
      userDetails.billing?.address_1 !== original.billing?.address_1 ||
      userDetails.shipping?.address_1 !== original.shipping?.address_1 ||
      newPassword;

    if (!hasChanges) {
      alert("No changes detected.");
      return;
    }

    const updatedData = {
      id: userDetails.id, // Make sure to include the ID
      first_name: userDetails.first_name,
      last_name: userDetails.last_name,
      email: userDetails.email,
      billing: {
        address_1: userDetails.billing?.address_1 || "",
        phone: userDetails.billing?.phone || "",
      },
      shipping: {
        address_1: userDetails.shipping?.address_1 || "",
      },
      ...(newPassword && { password: newPassword }),
    };

    // Use the global profile update handler
    const result = await handleProfileUpdate(state, token, updatedData);

    if (result.success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      // userDetails will be updated by the event listener
    }
  };

  const handleVisibilityChange = async (e) => {
    const newValue = e.target.checked ? "public" : "private";

    try {
      const res = await fetch(`${getWpBaseUrl(state)}/wp-json/friends/v1/visibility`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account_visibility: newValue,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setAccountVisibility(json.account_visibility);
      } else {
        console.error("API error:", json);
      }
    } catch (err) {
      console.error("Visibility update error:", err);
    }
  };

  if (isRedirecting) return <Loading />;

  return (
    <Wrapper isAuth={!token}>
      {!token ? (
        <>
          {!isRegister ? (
            <Form onSubmit={handleLoginSubmit}>
              <h3>Login</h3>

              {error && <Error>{error.replace(/<[^>]+>/g, "")}</Error>}
              <input type="text" placeholder="Username / Email" value={username} onChange={(e) => setUsername(e.target.value)} required />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit">Login</button>
              <span className="register-account"><span style={{fontSize: '14px'}}>Don't have an account?</span>
                <SwitchText onClick={() => setIsRegister(true)}>Register Now</SwitchText>
              </span>
            </Form>
          ) : (
            <Form onSubmit={handleRegisterSubmit}>
              <h3>Register</h3>
              <input type="text" placeholder="Username" value={registerUsername} onChange={(e) => setRegisterUsername(e.target.value)} required />
              <input type="email" placeholder="Email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required />
              <input type="password" placeholder="Password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} required />
              <button type="submit">Register</button>
              <SwitchText onClick={() => setIsRegister(false)}>Back to Login</SwitchText>
            </Form>
          )}
          <div className="thirdLogin">
            <SwitchText><span onClick={() => { setShowFlashScreen(!showFlashScreen) }}>Continue With Mobile or Google</span></SwitchText>
          </div>
          {showFlashScreen && (
            <FlashScreen
              isVisible={showFlashScreen}
              onClose={() => setShowFlashScreen(false)}
              actions={actions}
              state={state}
            />
          )}
        </>
      ) : (
        <div className="AccountDashboard">
          <FlexWrapper>
            <Tabs>
              <Tab onClick={() => setCurrentTab("dashboard")} active={currentTab === "dashboard"}>Dashboard</Tab>
              <Tab onClick={() => setCurrentTab("orders")} active={currentTab === "orders"}>Orders</Tab>
              <Tab onClick={() => setCurrentTab("details")} active={currentTab === "details"}>Account Details</Tab>
              <Tab onClick={() => setCurrentTab("privacy")} active={currentTab === "privacy"}>Privacy</Tab>
              <Tab onClick={handleLogoutClick}>Logout</Tab>
            </Tabs>
          </FlexWrapper>

          <Content>
            {currentTab === "dashboard" && <p className="content_text">Welcome to your account dashboard!</p>}

            {currentTab === "orders" && (
              <div>
                {loading ? (
                  <Loading />
                ) : (
                  <>
                    <h4 className="content_heading">Your Orders</h4>
                    <div className="accountOrderContainer">
                      {orders.length === 0 ? (
                        <p className="content_text">No orders found.</p>
                      ) : (
                        <OrderBox>
                          <table className="orderTable" style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                              <tr>
                                <th>Order</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Total</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orders.map((order) => (
                                <tr key={order.id}>
                                  <td>#{order.id}</td>
                                  <td>{new Date(order.date_created).toLocaleDateString()}</td>
                                  <td>{order.status}</td>
                                  <td>
                                    ₹{Number(order.total).toLocaleString("en-IN")} for {order.line_items.length}{" "}
                                    {order.line_items.length === 1 ? "item" : "items"}
                                  </td>
                                  <td>
                                    <Link link={`view-orders/${order.id}`}>
                                      <button className="viewBtn">View</button>
                                    </Link>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </OrderBox>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {currentTab === "details" && (
              <div className="AccountDetails">
                <h4 className="content_heading">Account Details</h4>

                <div className="inputContainer">
                  <div>
                    <label>First Name:</label>
                    <input type="text" value={userDetails.first_name || ""} onChange={(e) => setUserDetails({ ...userDetails, first_name: e.target.value })} />
                  </div>
                  <div>
                    <label>Last Name:</label>
                    <input type="text" value={userDetails.last_name || ""} onChange={(e) => setUserDetails({ ...userDetails, last_name: e.target.value })} />
                  </div>
                </div>

                <div className="inputContainer">
                  <div>
                    <label>Email:</label>
                    <input type="email" value={userDetails.email || ""} onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })} />
                  </div>
                  <div>
                    <label>Phone Number:</label>
                    <input type="tel" value={userDetails.billing?.phone || ""} onChange={(e) =>
                      setUserDetails({ ...userDetails, billing: { ...userDetails.billing, phone: e.target.value } })} />
                  </div>
                </div>

                <label>Billing Address:</label>
                <input type="text" value={userDetails.billing?.address_1 || ""} onChange={(e) =>
                  setUserDetails({ ...userDetails, billing: { ...userDetails.billing, address_1: e.target.value } })} />

                <label>Shipping Address:</label>
                <input type="text" value={userDetails.shipping?.address_1 || ""} onChange={(e) =>
                  setUserDetails({ ...userDetails, shipping: { ...userDetails.shipping, address_1: e.target.value } })} />

                {GoogleUser !== "GoogleLogin" && <div> <h4>Password Change</h4>
                  <div className="inputContainer">
                    <div>
                      <label>Current password:</label>
                      <input type="password" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                    </div>
                    <div>
                      <label>New password:</label>
                      <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                  </div>
                  <label>Confirm new password:</label>
                  <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /> </div>}
                <button className="savebtn" onClick={handleUpdateDetails}>Save</button>
              </div>
            )}

            {currentTab === "privacy" && (
              <div>
                <h4 className="content_heading">Privacy Settings</h4>
                <p>Control your profile visibility:</p>
                <label style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span>Make my account public</span>
                  <input
                    type="checkbox"
                    checked={accountVisibility === "public"}
                    onChange={handleVisibilityChange}
                    style={{ marginRight: "8px" }}
                  />
                </label>
                <p style={{ color: "#666", fontSize: "14px", marginTop: "0.5rem" }}>
                  When your account is public, friends can view your wishlist and profile.
                </p>
              </div>
            )}

          </Content>
        </div>
      )}
    </Wrapper>
  );
};

export default connect(MyAccountPage);

// Styled components
const Wrapper = styled.div`
  max-width: ${({ isAuth }) => (isAuth ? "600px" : "1200px")};
  margin: 2rem auto;
  padding: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  input {
    margin-bottom: 1rem;
    padding: 0.6rem;
  }
  button {
    padding: 0.6rem;
    background: black;
    color: white;
    border: none;
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

const Tabs = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-right: 2rem;
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: flex-start;
`;

const Tab = styled.button`
  padding: 20px;
  border: none;
  background: ${({ active }) => (active ? "#222" : "#ddd")};
  color: ${({ active }) => (active ? "#fff" : "#000")};
  cursor: pointer;
`;

const Content = styled.div`
  padding: 1rem;
  background: #f9f9f9;
`;

const OrderBox = styled.div`
  padding: 1rem;
  background: white;
  border: 1px solid #ddd;
  margin-bottom: 1rem;

  @media (max-width: 992px) {
    padding: 0;
    background: none;
    border: 0;
    margin-bottom: 0;
    width: 500px;
  }
`;