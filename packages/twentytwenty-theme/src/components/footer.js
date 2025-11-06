import React, { useState, useEffect } from "react";
import { styled, connect } from "frontity";

// === ICONS ===
const renderIcon = (iconType, isActive) => {
  const iconProps = {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: isActive ? "#000000" : "none",
    stroke: isActive ? "none" : "#666666",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };

  switch (iconType) {
    case "home":
      return (
        <svg {...iconProps}>
          {isActive ? (
            <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" fill="#000000" />
          ) : (
            <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
          )}
        </svg>
      );
    case "calendar":
      return (
        <svg {...iconProps}>
          {isActive ? (
            <path
              d="M19 3h-1V2a1 1 0 00-2 0v1H8V2a1 1 0 00-2 0v1H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM5 8h14v11H5V8z"
              fill="#000000"
            />
          ) : (
            <>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </>
          )}
        </svg>
      );
    case "friends":
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none">
          {isActive ? (
            <path
              d="M6 8C6 5.79 7.79 4 10 4C12.21 4 14 5.79 14 8C14 10.21 12.21 12 10 12C7.79 12 6 10.21 6 8ZM2 20C2 17 7 15.5 10 15.5C13 15.5 18 17 18 20V21H2V20ZM16 12C14.9 12 14 11.1 14 10C14 8.9 14.9 8 16 8C17.1 8 18 8.9 18 10C18 11.1 17.1 12 16 12ZM22 21V20C22 18.34 19.33 17.21 17.5 17C17.83 16.39 18 15.72 18 15C20.67 15.33 22 17.33 22 19V21Z"
              fill="#000000"
            />
          ) : (
            <>
              <path d="M10 12C12.21 12 14 10.21 14 8C14 5.79 12.21 4 10 4C7.79 4 6 5.79 6 8C6 10.21 7.79 12 10 12Z" strokeWidth="2" />
              <path d="M2 20C2 17 7 15.5 10 15.5C13 15.5 18 17 18 20V21H2V20Z" strokeWidth="2" />
              <path d="M16 12C17.1046 12 18 11.1046 18 10C18 8.89543 17.1046 8 16 8C14.8954 8 14 8.89543 14 10C14 11.1046 14.8954 12 16 12Z" strokeWidth="2" />
              <path d="M22 21V20C22 18.34 19.33 17.21 17.5 17" strokeWidth="2" />
            </>
          )}
        </svg>
      );
    case "bag":
      return (
        <svg {...iconProps}>
          {isActive ? (
            <path
              d="M19 7h-3V6a4 4 0 00-8 0v1H5a1 1 0 00-1 1v11a3 3 0 003 3h10a3 3 0 003-3V8a1 1 0 00-1-1zM10 6a2 2 0 014 0v1h-4V6z"
              fill="#000000"
            />
          ) : (
            <>
              <path d="M6 2l-3 4v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </>
          )}
        </svg>
      );
    default:
      return null;
  }
};

// === ROUTE DETECTION ===
const getActiveNavFromRoute = (currentRoute) => {
  const route = currentRoute.replace(/\/$/, "").toLowerCase();
  if (route === "" || route === "/home") return "home";
  if (route.includes("/calendar") || route.includes("/events")) return "calendar";
  if (route.includes("/friends")) return "friends";
  if (route.includes("/cart") || route.includes("/checkout")) return "bag";
  return "home";
};

// === FOOTER COMPONENT ===
const Footer = ({ state, actions }) => {
  const [activeNav, setActiveNav] = useState("home");
  const [token, setToken] = useState(null);

  useEffect(() => {
    const currentRoute = state.router.link;
    const activeNavFromRoute = getActiveNavFromRoute(currentRoute);
    setActiveNav(activeNavFromRoute);

    const storedToken = localStorage.getItem("jwt_token");
    setToken(storedToken);
  }, [state.router.link]);

  useEffect(() => {
    const footerHeight = "70px";
    document.body.style.paddingBottom = footerHeight;
    return () => {
      document.body.style.paddingBottom = "0";
    };
  }, []);

  const handleNavClick = (item, e) => {
    e.preventDefault();
    setActiveNav(item.id);
    actions.router.set(item.path);
  };

  const navItems = [
    { id: "home", path: "/", icon: "home" },
    { id: "calendar", path: "/calendar", icon: "calendar" },
    { id: "friends", path: "/friends", icon: "friends" },
    { id: "bag", path: "/cart", icon: "bag" },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'white',
      padding: '5px 0',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      zIndex: 999,
      height: '60px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        maxWidth: '1680px',
        margin: '0 auto',
        width: '100%',
        padding: '0 20px'
      }}>
        {navItems.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <a
              key={item.id}
              href={item.path}
              onClick={(e) => handleNavClick(item, e)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                padding: '8px 12px',
                position: 'relative',
                flex: 1,
                justifyContent: 'center'
              }}
            >
              {renderIcon(item.icon, isActive)}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default connect(Footer);
