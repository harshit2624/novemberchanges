import React, { useState, useEffect } from 'react';

const OrderSuccessAnimation = ({ orderId, onClose, isLoading = true }) => {
  const [show, setShow] = useState(false);
  const [checkmarkComplete, setCheckmarkComplete] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
    
    // Only show checkmark and auto-close when not loading (success state)
    if (!isLoading && orderId) {
      setTimeout(() => setCheckmarkComplete(true), 1200);

      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [onClose, isLoading, orderId]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#14181B',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000,
        opacity: show ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
      }}
    >
      {isLoading ? (
        // Loading State
        <>
          {/* Spinner */}
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: '4px solid rgba(255, 255, 255, 0.1)',
              borderTop: '4px solid #ffffff',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '30px',
              animation: 'spin 1s linear infinite',
            }}
          />

          {/* Loading Text */}
          <h1
            style={{
              color: '#ffffff',
              fontSize: '32px',
              fontWeight: 'bold',
              marginBottom: '10px',
              textAlign: 'center',
              opacity: show ? 1 : 0,
              transform: show ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease-in-out',
              letterSpacing: '2px',
            }}
          >
            Processing Order...
          </h1>

          {/* Loading Subtitle */}
          <p
            style={{
              color: '#8a8a8a',
              fontSize: '16px',
              textAlign: 'center',
              opacity: show ? 1 : 0,
              transform: show ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease-in-out 0.2s',
            }}
          >
            Please wait while we process your order
          </p>

          {/* Loading dots animation */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginTop: '20px',
              opacity: show ? 1 : 0,
              transition: 'opacity 0.6s ease-in-out 0.4s',
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        </>
      ) : (
        // Success State
        <>
          {/* Success Checkmark Circle */}
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: '4px solid #ffffff',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '30px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              transform: show ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-180deg)',
              transition: 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              animation: checkmarkComplete ? 'pulse 2s infinite' : 'none',
            }}
          >
            {/* Checkmark */}
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              style={{
                opacity: show ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out 0.4s',
              }}
            >
              <path
                d="M15 30 L25 40 L45 20"
                stroke="#ffffff"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: 60,
                  strokeDashoffset: show ? 0 : 60,
                  transition: 'stroke-dashoffset 0.6s ease-in-out 0.6s',
                }}
              />
            </svg>
          </div>

          {/* Thank You Text */}
          <h1
            style={{
              color: '#ffffff',
              fontSize: '48px',
              fontWeight: 'bold',
              marginBottom: '10px',
              textAlign: 'center',
              opacity: show ? 1 : 0,
              transform: show ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease-in-out 0.8s',
              letterSpacing: '3px',
              textTransform: 'uppercase',
            }}
          >
            Thank You!
          </h1>

          {/* Subtitle */}
          <p
            style={{
              color: '#8a8a8a',
              fontSize: '18px',
              marginBottom: '25px',
              textAlign: 'center',
              opacity: show ? 1 : 0,
              transform: show ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease-in-out 1s',
            }}
          >
            Your order has been placed successfully
          </p>

          {/* Order ID Box */}
          {orderId && (
            <div
              style={{
                backgroundColor: '#1f2428',
                padding: '20px 40px',
                borderRadius: '8px',
                marginBottom: '30px',
                border: '1px solid #2d3339',
                opacity: show ? 1 : 0,
                transform: show ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.6s ease-in-out 1.2s',
              }}
            >
              <p style={{ color: '#6a6a6a', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Order ID
              </p>
              <p style={{ color: '#ffffff', fontSize: '28px', fontWeight: 'bold', letterSpacing: '2px' }}>
                #{orderId}
              </p>
            </div>
          )}

          {/* Message */}
          <p
            style={{
              color: '#6a6a6a',
              fontSize: '15px',
              maxWidth: '450px',
              textAlign: 'center',
              lineHeight: '1.7',
              opacity: show ? 1 : 0,
              transform: show ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease-in-out 1.4s',
              padding: '0 20px',
            }}
          >
            We've sent a confirmation email with your order details. You'll receive
            another email when your order ships.
          </p>

          {/* Floating particles effect */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '3px',
                height: '3px',
                backgroundColor: '#ffffff',
                borderRadius: '50%',
                opacity: 0,
                animation: show ? `float ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s infinite` : 'none',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </>
      )}

      <style>
        {`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          @keyframes bounce {
            0%, 80%, 100% {
              transform: translateY(0);
              opacity: 0.5;
            }
            40% {
              transform: translateY(-15px);
              opacity: 1;
            }
          }

          @keyframes pulse {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
            }
            50% {
              box-shadow: 0 0 0 25px rgba(255, 255, 255, 0);
            }
          }

          @keyframes float {
            0% {
              transform: translateY(0) scale(0);
              opacity: 0;
            }
            50% {
              opacity: 0.6;
            }
            100% {
              transform: translateY(-120px) scale(1);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default OrderSuccessAnimation;