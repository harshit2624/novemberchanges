import React, { useEffect, useState } from "react";
import Link from "@frontity/components/link";
import Loading from "./loading";
import { showToast } from "../utils"

const apiBase = "https://www.croscrow.com/a/wp-json/friends/v1";
const customApiBase = "https://www.croscrow.com/a/wp-json/custom/v1";

const FriendsPage = () => {
  const [customers, setCustomers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [sentRequests, setSentRequests] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [tab, setTab] = useState("people");
  const [showRequests, setShowRequests] = useState(false);
  const [expandedFriendId, setExpandedFriendId] = useState(null);
  const [friendWishlists, setFriendWishlists] = useState({});
  const [viewportSize, setViewportSize] = useState("desktop");
  const [loadingWishlists, setLoadingWishlists] = useState({});
  const [wishlistCounts, setWishlistCounts] = useState({});
  const [publicWishlists, setPublicWishlists] = useState({});
  const [expandedPublic, setExpandedPublic] = useState({});

  // Enhanced viewport detection
  useEffect(() => {
    const getViewportSize = () => {
      const width = window.innerWidth;
      if (width <= 767) return "mobile";
      if (width <= 1024) return "tablet";
      return "desktop";
    };

    setViewportSize(getViewportSize());

    const handleResize = () => {
      setViewportSize(getViewportSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper functions for responsive values
  const getResponsiveValue = (mobile, tablet, desktop) => {
    switch (viewportSize) {
      case "mobile": return mobile;
      case "tablet": return tablet;
      case "desktop": return desktop;
      default: return desktop;
    }
  };

  const isMobile = viewportSize === "mobile";
  const isTablet = viewportSize === "tablet";
  const isDesktop = viewportSize === "desktop";


  useEffect(() => {
    const storedToken = localStorage.getItem("jwt_token");
    if (!storedToken) {
      setLoading(false);
      return;
    }
    setToken(storedToken);
  }, []);

  const fetchCurrentUser = async (jwtToken) => {
    try {
      const res = await fetch("https://www.croscrow.com/a/wp-json/wp/v2/users/me", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      const user = await res.json();
      console.log("🔑 Current User Response:", user);
      return user?.id || null;
    } catch (err) {
      console.error("Failed to fetch current user", err);
      return null;
    }
  };

  const fetchCustomers = async (searchTerm = "") => {
    try {
      const res = await fetch(`https://www.croscrow.com/a/wp-json/custom/v1/users`);
      const data = await res.json();
      console.log("🔍 Custom Users Response:", data);

      // Exclude current user, admins, and vendors
      let filtered = data.filter(
        (user) =>
          user.id !== currentUserId &&
          !["administrator", "vendor"].includes(user.role)
      );

      // Apply client-side search (case-insensitive)
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (user) =>
            user.username?.toLowerCase().includes(term) ||
            user.name?.toLowerCase().includes(term) ||
            user.email?.toLowerCase().includes(term)
        );
      }

      return filtered;
    } catch (err) {
      console.error("Error fetching users:", err);
      return [];
    }
  };





  const fetchSentRequests = async () => {
    try {
      const res = await fetch(`${apiBase}/requests/sent`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setSentRequests(data);
    } catch (err) {
      console.error("Error fetching sent requests:", err);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const res = await fetch(`${apiBase}/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("📩 Friend Requests Response:", data);
      if (Array.isArray(data)) setFriendRequests(data);
    } catch (err) {
      console.error("❌ Error fetching friend requests:", err);
    }
  };


  const fetchFriends = async () => {
    try {
      const res = await fetch(`${apiBase}/friends`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
  
      if (Array.isArray(data)) {
        setFriendsList(data);
  
        const wishlistCounts = {};
        await Promise.all(
          data.map(async (friend) => {
            try {
              const res = await fetch(`${apiBase}/wishlist/friend/${friend.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              
              // Check if response is ok before parsing
              if (res.ok) {
                const wishlist = await res.json();
                console.log(`📦 Wishlist for Friend ${friend.id}:`, wishlist);
                wishlistCounts[friend.id] = { count: wishlist.length, products: null };
              } else {
                // If forbidden or error, set count to 0
                console.log(`⚠️ Cannot access wishlist for Friend ${friend.id}: ${res.status}`);
                wishlistCounts[friend.id] = { count: 0, products: null };
              }
            } catch (err) {
              console.error(`❌ Error fetching wishlist for ${friend.id}`, err);
              wishlistCounts[friend.id] = { count: 0, products: null };
            }
          })
        );
  
        setFriendWishlists((prev) => ({ ...prev, ...wishlistCounts }));
      }
    } catch (err) {
      console.error("❌ Error fetching friends:", err);
    }
  };


  const respondToRequest = async (senderId, action) => {
    try {
      const res = await fetch(`${apiBase}/request/respond`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sender_id: senderId, action }),
      });

      const result = await res.json();
      if (res.ok) {
        showToast(`Request ${action}ed successfully`, 'success');
        fetchFriendRequests();
        fetchFriends();
        fetchSentRequests();
      } else {
        showToast(result.message || "Failed to update request", 'error');
      }
    } catch (err) {
      console.error("Error updating request", err);
      showToast("Something went wrong", 'error');
    }
  };

  const sendFriendRequest = async (receiverId) => {
    try {
      const res = await fetch(`${apiBase}/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiver_id: receiverId }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast("Friend request sent successfully!", 'success');
        setSentRequests((prev) => [...prev, { receiver_id: receiverId, status: 1 }]);
      } else {
        showToast(data.message || "Failed to send request.", 'error');
      }
    } catch (error) {
      console.error("Request error:", error);
      showToast("Something went wrong while sending the request.", 'error');
    }
  };

  const getRequestStatus = (receiverId) => {
    const match = sentRequests.find((req) => req.receiver_id === receiverId);
    if (!match) return null;
    return match.status === 1 ? "Pending" : match.status === 2 ? "Friends" : "Rejected";
  };

  const unfollowFriend = async (friendId) => {
    try {
      const res = await fetch(`${apiBase}/unfollow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ friend_id: friendId }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Unfollowed successfully.", 'success');
        await fetchFriends();
        const allCustomers = await fetchCustomers();
        setCustomers(allCustomers);

      } else {
        showToast(data.message || "Failed to unfollow.", 'error');
      }
    } catch (err) {
      console.error("Unfollow error:", err);
      showToast("Something went wrong.", 'error');
    }
  };

  const viewFriendWishlist = async (friendId) => {
    setExpandedFriendId(friendId === expandedFriendId ? null : friendId);
  
    const wishlist = friendWishlists[friendId];
    if (wishlist?.products) return;
  
    setLoadingWishlists(prev => ({ ...prev, [friendId]: true }));
  
    try {
      const res = await fetch(`${apiBase}/wishlist/friend/${friendId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        // Handle forbidden or error response
        setFriendWishlists((prev) => ({
          ...prev,
          [friendId]: {
            count: 0,
            products: [],
          },
        }));
        return;
      }
      
      const wishlistData = await res.json();
  
      const productDetails = await Promise.all(
        wishlistData.map(async (item) => {
          try {
            const productRes = await fetch(
              `https://www.croscrow.com/a/wp-json/wc/v3/products/${item.product_id}`
            );
            if (productRes.ok) {
              return await productRes.json();
            }
            return null;
          } catch (err) {
            console.error(`Error fetching product ${item.product_id}:`, err);
            return null;
          }
        })
      );
  
      setFriendWishlists((prev) => ({
        ...prev,
        [friendId]: {
          count: wishlistData.length,
          products: productDetails.filter(Boolean),
        },
      }));
    } catch (err) {
      console.error("Error loading wishlist", err);
      setFriendWishlists((prev) => ({
        ...prev,
        [friendId]: {
          count: 0,
          products: [],
        },
      }));
    } finally {
      setLoadingWishlists(prev => {
        const newState = { ...prev };
        delete newState[friendId];
        return newState;
      });
    }
  };

  const fetchUserWishlistCount = async (userId) => {
    try {
      const res = await fetch(`${apiBase}/wishlist/friend/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        // If forbidden or error, return 0
        return 0;
      }
      
      const wishlist = await res.json();
      return wishlist.length;
    } catch (err) {
      console.error("Error fetching wishlist for user", userId, err);
      return 0;
    }
  };

  const fetchPublicWishlist = async (userId) => {
    try {
      const res = await fetch(`${apiBase}/wishlist/public/${userId}`);
      if (!res.ok) return [];
      return await res.json();
    } catch (err) {
      console.error("Error fetching public wishlist", err);
      return [];
    }
  };

  useEffect(() => {
    const loadCounts = async () => {
      const counts = {};
      const expandedStates = {};
      const publicWishlistData = {};
  
      for (const user of customers) {
        if (user.account_visibility === "public") {
          try {
            const res = await fetch(`${apiBase}/wishlist/public/${user.id}`);
            if (res.ok) {
              const data = await res.json();
              counts[user.id] = data.length;
              expandedStates[user.id] = true;
              publicWishlistData[user.id] = data;
            } else {
              counts[user.id] = 0;
              expandedStates[user.id] = true;
              publicWishlistData[user.id] = [];
            }
          } catch (err) {
            console.error(`Error loading public wishlist for ${user.id}`, err);
            counts[user.id] = 0;
            expandedStates[user.id] = true;
            publicWishlistData[user.id] = [];
          }
        }
      }
      setWishlistCounts(counts);
      setExpandedPublic(expandedStates);
      setPublicWishlists(publicWishlistData);
    };
  
    if (customers.length > 0) loadCounts();
  }, [customers, token]);

  // ---- Toggle Expand ----
  const toggleExpandPublic = async (userId) => {
    setExpandedPublic((prev) => ({ ...prev, [userId]: !prev[userId] }));
    if (!publicWishlists[userId]) {
      const wishlist = await fetchPublicWishlist(userId);
      setPublicWishlists((prev) => ({ ...prev, [userId]: wishlist }));
    }
  };

  const ProductList = ({ items }) => (
    <div style={{ marginTop: "10px", display: 'flex', gap: '20px', overflowX: 'auto', scrollbarWidth: 'none' }}>
      {items?.length > 0 ? (
        items.map((item) => (
          <div
            key={item.product_id}
            className="productSec"
            style={{
              border: "1px solid #eee",
              padding: "8px",
              marginBottom: "6px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              borderRadius: "6px",
              background: "#fafafa",
              flexDirection: 'column',
              width: isMobile ? '70%' : 'calc(100% /4)',
              minWidth: isMobile ? '70%' : 'calc(100% /4)',
            }}
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            )}
            <div>
              <Link
                link={item.permalink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontWeight: "bold", display: "block", fontSize: '13px', textDecoration: 'none', color: 'rgb(51, 51, 51)' }}
              >
                {item.name}
              </Link>
              {/* <span
                dangerouslySetInnerHTML={{ __html: item.price }}
                style={{ color: "rgb(51, 51, 51)", fontSize: "12px" }}
              /> */}
            </div>
          </div>
        ))
      ) : (
        <p style={{ fontSize: "13px", color: "#777" }}>
          No products in wishlist
        </p>
      )}
    </div>
  );

  useEffect(() => {
    const init = async () => {
      if (!token) return;
  
      const userId = await fetchCurrentUser(token);
      setCurrentUserId(userId);
  
      const allCustomers = await fetchCustomers();
      const filtered = userId ? allCustomers.filter((c) => c.id !== userId) : allCustomers;
  
      setCustomers(filtered);
  
      await fetchSentRequests();
      await fetchFriends();
  
      setLoading(false);
    };
  
    init();
  }, [token]);

  useEffect(() => {
    const searchCustomers = async () => {
      if (!token || currentUserId === null) return;

      const results = await fetchCustomers(search);
      setCustomers(results);
    };

    searchCustomers();
  }, [search, token, currentUserId]);


  if (loading) {
    return <Loading />;
  }

  return (
    <div style={{
      maxWidth: '1680px',
      margin: '0 auto',
      padding: getResponsiveValue('15px', '20px 3rem', '20px 5rem'),
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: getResponsiveValue('20px', '25px', '30px'),
        padding: getResponsiveValue('15px', '18px', '20px'),
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          margin: '0',
          fontSize: getResponsiveValue('24px', '26px', '28px'),
          color: '#333',
          fontWeight: 'bold'
        }}>
          Friends & People
        </h1>
        <p style={{
          margin: '10px 0 0 0',
          color: '#666',
          fontSize: getResponsiveValue('14px', '15px', '16px')
        }}>
          Connect with friends and discover new people
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        marginBottom: '25px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <button
          onClick={() => {
            setTab("people");
            setShowRequests(false);
          }}
          style={{
            flex: 1,
            padding: getResponsiveValue('12px 15px', '14px 18px', '15px 20px'),
            background: tab === "people" ? '#000' : '#fff',
            color: tab === "people" ? '#fff' : '#666',
            border: 'none',
            cursor: 'pointer',
            fontSize: getResponsiveValue('14px', '15px', '16px'),
            fontWeight: tab === "people" ? 'bold' : 'normal',
            transition: 'all 0.3s ease',
            borderRight: isMobile ? 'none' : '1px solid #eee'
          }}
        >
          PEOPLE
        </button>
        <button
          onClick={() => {
            setTab("friends");
            setShowRequests(false);
          }}
          style={{
            flex: 1,
            padding: getResponsiveValue('12px 15px', '14px 18px', '15px 20px'),
            background: tab === "friends" ? '#000' : '#fff',
            color: tab === "friends" ? '#fff' : '#666',
            border: 'none',
            cursor: 'pointer',
            fontSize: getResponsiveValue('14px', '15px', '16px'),
            fontWeight: tab === "friends" ? 'bold' : 'normal',
            transition: 'all 0.3s ease'
          }}
        >
          FRIENDS
        </button>
      </div>

      {/* Search & Access */}
      {tab === "people" && (
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '15px',
          marginBottom: '25px',
          backgroundColor: '#fff',
          padding: getResponsiveValue('15px', '18px', '20px'),
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <input
            type="text"
            placeholder="Search Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              padding: getResponsiveValue('12px 15px', '14px 18px', '15px 20px'),
              fontSize: getResponsiveValue('14px', '15px', '16px'),
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              outline: 'none',
              transition: 'border-color 0.3s ease',
              width: isMobile ? '100%' : 'auto'
            }}
            onFocus={(e) => e.target.style.borderColor = '#007cba'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
          <button
            onClick={() => {
              setShowRequests(true);
              fetchFriendRequests();
            }}
            style={{
              padding: getResponsiveValue('12px 20px', '14px 22px', '15px 25px'),
              background: '#000',
              color: '#fff',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: getResponsiveValue('14px', '15px', '16px'),
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              minWidth: getResponsiveValue('auto', '160px', '180px'),
              width: isMobile ? '100%' : 'auto'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#333'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#000'}
          >
            ACCESS REQUEST
          </button>
        </div>
      )}

      {!token ? (
        <div style={{
          textAlign: 'center',
          padding: getResponsiveValue('30px 20px', '35px 25px', '40px'),
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          fontSize: getResponsiveValue('16px', '17px', '18px'),
          color: '#666'
        }}>
          Please{" "}
          <Link link="/my-account" style={{
            color: '#007cba',
            textDecoration: 'underline',
            fontWeight: 'bold'
          }}>
            log in to your account
          </Link>{" "}
          to view the friends list.
        </div>
      ) : showRequests ? (
        <div style={{
          backgroundColor: '#fff',
          padding: getResponsiveValue('20px', '22px', '25px'),
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            margin: '0 0 20px 0',
            fontSize: getResponsiveValue('20px', '21px', '22px'),
            color: '#333',
            fontWeight: 'bold'
          }}>
            Follow Requests
          </h3>
          {friendRequests.length === 0 ? (
            <p style={{
              color: '#666',
              fontSize: getResponsiveValue('14px', '15px', '16px'),
              textAlign: 'center',
              padding: '20px'
            }}>
              No incoming friend requests.
            </p>
          ) : (
            friendRequests.map((req) => (
              <div key={req.id} style={{
                background: 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)',
                padding: getResponsiveValue('15px', '18px', '20px'),
                marginBottom: '15px',
                borderRadius: '12px',
                border: '1px solid #ffc107',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'stretch' : 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                gap: isMobile ? '15px' : '0'
              }}>
                <span style={{
                  fontSize: getResponsiveValue('14px', '15px', '16px'),
                  fontWeight: 'bold',
                  color: '#333'
                }}>
                  {req.display_name || `User ID: ${req.sender_id}`}
                </span>
                <div style={{
                  display: 'flex',
                  gap: getResponsiveValue('10px', '12px', '10px'),
                  flexDirection: isMobile ? 'column' : 'row'
                }}>
                  <button
                    onClick={() => respondToRequest(req.sender_id, "accept")}
                    style={{
                      background: '#28a745',
                      color: '#fff',
                      padding: getResponsiveValue('10px 20px', '11px 22px', '10px 20px'),
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      textAlign: 'center',
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => respondToRequest(req.sender_id, "reject")}
                    style={{
                      background: '#dc3545',
                      color: '#fff',
                      padding: getResponsiveValue('10px 20px', '11px 22px', '10px 20px'),
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      textAlign: 'center',
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : tab === "friends" ? (
        <div style={{
          backgroundColor: '#fff',
          padding: getResponsiveValue('20px', '22px', '25px'),
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            margin: '0 0 25px 0',
            fontSize: getResponsiveValue('20px', '21px', '22px'),
            color: '#333',
            fontWeight: 'bold'
          }}>
            FRIENDS
          </h3>
          {friendsList.length === 0 ? (
            <p style={{
              color: '#666',
              fontSize: getResponsiveValue('14px', '15px', '16px'),
              textAlign: 'center',
              padding: '20px'
            }}>
              No friends yet. Start connecting with people!
            </p>
          ) : (
            friendsList.map((friend) => (
              <div key={friend.id} style={{
                marginBottom: '20px',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}>

                <div style={{
                  padding: getResponsiveValue('15px', '18px', '20px'),
                  backgroundColor: '#f8f9fa',
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: 'space-between',
                  alignItems: isMobile ? 'stretch' : 'center',
                  cursor: 'pointer',
                  gap: isMobile ? '15px' : '0'
                }}
                  onClick={() => viewFriendWishlist(friend.id)}
                >
                  <div>
                    <div style={{
                      fontWeight: 'bold',
                      fontSize: getResponsiveValue('16px', '17px', '18px'),
                      color: '#333',
                      marginBottom: '5px'
                    }}>
                      {friend.name}
                    </div>
                    <div style={{
                      color: '#666',
                      fontSize: getResponsiveValue('12px', '13px', '14px')
                    }}>
                      WISHLIST: {friendWishlists[friend.id]?.count ?? 0} ITEMS
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      unfollowFriend(friend.id);
                    }}
                    style={{
                      background: '#dc3545',
                      color: '#fff',
                      border: 'none',
                      padding: getResponsiveValue('10px 20px', '11px 22px', '10px 20px'),
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      width: isMobile ? '100%' : 'auto',
                      textAlign: 'center'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                  >
                    UNFOLLOW
                  </button>
                </div>
                {expandedFriendId === friend.id && (
                  <div style={{
                    padding: getResponsiveValue('15px', '18px', '20px'),
                    backgroundColor: '#fff',
                    borderTop: '1px solid #e0e0e0',
                    display: 'flex',
                    overflowX: 'auto',
                    scrollbarWidth: 'none',
                    gap: '15px'
                  }}>
                    {loadingWishlists[friend.id] ? (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '100%',
                          padding: '40px',
                          height: '100%',
                          overflow: 'hidden',
                        }}
                        className="loaderContainer"
                      >
                        <Loading />
                      </div>
                    ) : friendWishlists[friend.id]?.products?.length > 0 ? (
                      friendWishlists[friend.id].products.map((product) => (
                        <div key={product.id} style={{
                          display: 'flex',
                          flexDirection: 'column',
                          marginBottom: '15px',
                          padding: '10px',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '8px',
                          transition: 'all 0.3s ease',
                          gap: '10px',
                          maxWidth: getResponsiveValue('70%', '33.33%', '20%'),
                          minWidth: getResponsiveValue('70%', '33.33%', '20%'),
                          width: '100%',
                          flexShrink: 0
                        }}>
                          <Link link={`/product/${product.slug}/`}>
                            <img
                              src={product.images[0]?.src}
                              alt={product.name}
                              style={{
                                width: '100%',
                                height: getResponsiveValue('200px', '180px', '200px'),
                                objectFit: 'contain',
                                borderRadius: '8px',
                                border: '1px solid #e0e0e0',
                                maxWidth: getResponsiveValue('100%', '180px', '200px')
                              }}
                            />
                          </Link>
                          <Link link={`/product/${product.slug}/`} style={{
                            color: '#007cba',
                            textDecoration: 'none',
                            fontSize: getResponsiveValue('14px', '15px', '16px'),
                            fontWeight: '500',
                            flex: 1,
                            textAlign: 'left',
                            width: getResponsiveValue('100%', '90%', '70%'),
                            display: 'block'
                          }}>
                            {product.name}
                          </Link>
                        </div>
                      ))
                    ) : (
                      <p style={{
                        color: '#666',
                        fontSize: getResponsiveValue('14px', '15px', '16px'),
                        textAlign: 'center',
                        padding: '20px',
                        width: '100%'
                      }}>
                        No wishlist items found.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div style={{
          backgroundColor: '#fff',
          padding: getResponsiveValue('20px', '22px', '25px'),
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          {customers.length === 0 ? (
            <p style={{
              color: '#666',
              fontSize: getResponsiveValue('14px', '15px', '16px'),
              textAlign: 'center',
              padding: '20px'
            }}>
              No people found. Try searching for someone!
            </p>
          ) : (
            customers.map((user) => (
              <div
                key={user.id}
                style={{
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  padding: getResponsiveValue('15px', '18px', '20px'),
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  marginBottom: '15px',
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: 'space-between',
                  alignItems: isMobile ? 'stretch' : 'center',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  gap: isMobile ? '15px' : '0'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <div style={{ width: isMobile ? '100%' : '80%' }}>

                  {/* Show account visibility */}
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: getResponsiveValue("16px", "17px", "18px"),
                      color: "#333",
                      marginBottom: "5px",
                    }}
                  >
                    {user.username || user.name || user.id}
                  </div>

                  {/* Wishlist count depending on visibility */}
                  {user.account_visibility === "public" ? (
                    <>
                      <div
                        style={{
                          cursor: "pointer",
                          color: "#666", // grey
                          marginTop: "4px",
                          fontWeight: "500",
                          fontSize: '14px',
                        }}
                        onClick={() => toggleExpandPublic(user.id)}
                      >
                        PRODUCTS: {wishlistCounts[user.id] ?? 0}
                      </div>
                      {expandedPublic[user.id] && (
                        <ProductList items={publicWishlists[user.id]} />
                      )}
                    </>
                  ) : (
                    <div
                      style={{
                        fontSize: getResponsiveValue("12px", "13px", "14px"),
                        color: "#666", // grey
                        fontWeight: "500",
                        marginTop: "4px",
                      }}
                    >
                      PRODUCTS: 0
                    </div>
                  )}
                </div>


                <div style={{ width: isMobile ? '100%' : '20%', display: 'flex', justifyContent: 'flex-end' }}>
                  {getRequestStatus(user.id) ? (
                    <span style={{
                      padding: getResponsiveValue('10px 20px', '11px 22px', '10px 20px'),
                      background: '#6c757d',
                      color: '#fff',
                      borderRadius: '8px',
                      fontSize: '14px',
                      textAlign: 'center'
                    }}>
                      {getRequestStatus(user.id)}
                    </span>
                  ) : (
                    <button
                      onClick={() => sendFriendRequest(user.id)}
                      style={{
                        padding: isMobile ? '10px 20px' : '12px 25px',
                        background: '#000',
                        color: '#fff',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'all 0.3s ease',
                        width: isMobile ? '100%' : 'auto',
                        textAlign: 'center',
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#333'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#000'}
                    >
                      FOLLOW
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FriendsPage;