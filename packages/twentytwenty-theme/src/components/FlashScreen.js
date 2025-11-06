import React, { useState, useEffect, useRef } from 'react';
import { styled, connect } from "frontity";
import axios from "axios";
import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import logo from '../../../../static/image/crosWHT.png';
import { getWpBaseUrl, handleLogin } from "../utils";
import GoogleLoginButton from "./GoogleLoginButton";

// Firebase Configuration
const firebaseConfig = {
  "apiKey": "AIzaSyC7n3-j3ansXVWyYdHXfum9-W-o5c55EzU",
  "authDomain": "ss99-35d8f.firebaseapp.com",
  "projectId": "ss99-35d8f",
  "storageBucket": "ss99-35d8f.appspot.com",
  "messagingSenderId": "538495467374",
  "appId": "1:538495467374:web:91dd8b5d03b989dafc4b7f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const FlashScreen = ({ state, actions, onClose, isVisible = true }) => {
  const [showScreen, setShowScreen] = useState(isVisible);
  const [animate, setAnimate] = useState(false);
  const isMountedRef = useRef(true);

  // OTP Login States
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone"); // phone | otp
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
  const recaptchaContainerRef = useRef(null);

  // Safe state setter to prevent memory leaks
  const safeSetState = (setter, value) => {
    if (isMountedRef.current) {
      setter(value);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    
    if (isVisible) {
      setShowScreen(true);
      setTimeout(() => {
        if (isMountedRef.current) {
          setAnimate(true);
        }
      }, 100);
      
      // Initialize reCAPTCHA verifier with better error handling
      initializeRecaptcha();
    }

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      cleanupRecaptcha();
    };
  }, [isVisible]);

  const initializeRecaptcha = () => {
    try {
      // Clean up existing verifier first
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
        setRecaptchaVerifier(null);
      }

      // Wait for DOM element to be available
      setTimeout(() => {
        const recaptchaElement = document.getElementById('recaptcha-container');
        if (recaptchaElement && !recaptchaVerifier) {
          const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {
              console.log('reCAPTCHA solved');
            },
            'expired-callback': () => {
              console.log('reCAPTCHA expired');
              if (isMountedRef.current) {
                setMessage("reCAPTCHA expired. Please try again ❌");
              }
            },
            'error-callback': (error) => {
              console.error('reCAPTCHA error:', error);
              if (isMountedRef.current) {
                setMessage("reCAPTCHA error. Please refresh and try again ❌");
              }
            }
          });
          
          if (isMountedRef.current) {
            setRecaptchaVerifier(verifier);
          }
        }
      }, 500);
    } catch (error) {
      console.error('Error initializing reCAPTCHA:', error);
      if (isMountedRef.current) {
        setMessage("Failed to initialize reCAPTCHA ❌");
      }
    }
  };

  const cleanupRecaptcha = () => {
    if (recaptchaVerifier) {
      try {
        recaptchaVerifier.clear();
      } catch (error) {
        console.error('Error clearing reCAPTCHA:', error);
      }
    }
  };

  const handleClose = () => {
    isMountedRef.current = false;
    setAnimate(false);
    setTimeout(() => {
      setShowScreen(false);
      onClose && onClose();
    }, 300);
  };

  // Validate phone number
  const isValidPhoneNumber = (phoneNum) => {
    return /^[6-9]\d{9}$/.test(phoneNum); // Indian mobile number format
  };

  // Send OTP using Firebase
  const sendOtp = async () => {
    if (!isValidPhoneNumber(phone)) {
      safeSetState(setMessage, "Please enter a valid 10-digit mobile number ❌");
      return;
    }

    try {
      safeSetState(setLoading, true);
      safeSetState(setMessage, "");
      
      const phoneNumber = `+91${phone}`;
      
      // Ensure reCAPTCHA is ready
      if (!recaptchaVerifier) {
        await new Promise((resolve) => {
          const checkVerifier = setInterval(() => {
            if (recaptchaVerifier || !isMountedRef.current) {
              clearInterval(checkVerifier);
              resolve();
            }
          }, 100);
        });
      }

      if (!recaptchaVerifier && isMountedRef.current) {
        safeSetState(setMessage, "reCAPTCHA not ready. Please refresh and try again ❌");
        return;
      }
      
      // Method 1: Direct Firebase Authentication (Recommended)
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      
      if (isMountedRef.current) {
        setConfirmationResult(confirmation);
        setMessage("OTP sent successfully ✅");
        setStep("otp");
      }
      
    } catch (err) {
      console.error("Error sending OTP:", err);
      
      if (!isMountedRef.current) return;
      
      // Handle specific Firebase errors
      let errorMessage = "Failed to send OTP ❌";
      
      switch (err.code) {
        case 'auth/invalid-phone-number':
          errorMessage = "Invalid phone number format ❌";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many requests. Please try again later ❌";
          break;
        case 'auth/captcha-check-failed':
          errorMessage = "reCAPTCHA verification failed. Please try again ❌";
          break;
        case 'auth/quota-exceeded':
          errorMessage = "SMS quota exceeded. Please try again later ❌";
          break;
        default:
          if (err.message && err.message.includes('auth/internal-error')) {
            errorMessage = "Service temporarily unavailable. Please try again ❌";
          }
      }
      
      safeSetState(setMessage, errorMessage);
      
      // Reset reCAPTCHA verifier on error
      setTimeout(() => {
        if (isMountedRef.current) {
          initializeRecaptcha();
        }
      }, 1000);
      
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  // Alternative method: Send OTP via WordPress backend
  const sendOtpViaBackend = async () => {
    if (!isValidPhoneNumber(phone)) {
      safeSetState(setMessage, "Please enter a valid 10-digit mobile number ❌");
      return;
    }

    try {
      safeSetState(setLoading, true);
      safeSetState(setMessage, "");
      
      if (!recaptchaVerifier) {
        safeSetState(setMessage, "reCAPTCHA not ready. Please try again ❌");
        return;
      }
      
      // Get reCAPTCHA token
      const recaptchaToken = await recaptchaVerifier.verify();
      
      const res = await axios.post(`${getWpBaseUrl(state)}/wp-json/otp/v1/send`, {
        phone: `+91${phone}`,
        recaptcha_token: recaptchaToken,
      });
      
      if (!isMountedRef.current) return;
      
      if (res.data.success) {
        setConfirmationResult({ sessionInfo: res.data.sessionInfo });
        setMessage("OTP sent successfully ✅");
        setStep("otp");
      } else {
        setMessage(res.data.message || "Failed to send OTP ❌");
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      if (isMountedRef.current) {
        setMessage("Failed to send OTP ❌");
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  // Verify OTP using Firebase
  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      safeSetState(setMessage, "Please enter a valid 6-digit OTP ❌");
      return;
    }

    try {
      safeSetState(setLoading, true);
      safeSetState(setMessage, "");

      // Method 1: Direct Firebase verification (Recommended)
      if (confirmationResult && confirmationResult.confirm) {
        const result = await confirmationResult.confirm(otp);
        
        if (!isMountedRef.current) return;
        
        const user = result.user;
        const firebaseToken = await user.getIdToken();
        
        // Send Firebase token to WordPress for user creation/login
        const loginRes = await axios.post(`${getWpBaseUrl(state)}/wp-json/otp/v1/firebase-login`, {
          firebase_token: firebaseToken,
          phone: `+91${phone}`,
        });

        if (!isMountedRef.current) return;

        if (loginRes.data.success) {
          setMessage("Login successful ✅");
          
          // Use the global login handler
          await handleLogin(state, actions, loginRes.data.token, loginRes.data.user_data);
          
          // Reset form and close modal after successful login
          setTimeout(() => {
            if (isMountedRef.current) {
              setPhone("");
              setOtp("");
              setStep("phone");
              handleClose();
            }
          }, 1500);
        } else {
          setMessage(loginRes.data.message || "Login failed ❌");
        }
      } 
      // Method 2: Backend verification (Alternative)
      else if (confirmationResult && confirmationResult.sessionInfo) {
        const res = await axios.post(`${getWpBaseUrl(state)}/wp-json/otp/v1/verify`, {
          phone: `+91${phone}`,
          code: otp,
          sessionInfo: confirmationResult.sessionInfo,
        });

        if (!isMountedRef.current) return;

        if (res.data.success) {
          setMessage("Login successful ✅");
          
          if (res.data.token) {
            await handleLogin(state, actions, res.data.token, res.data.user_data);
          }

          setTimeout(() => {
            if (isMountedRef.current) {
              setPhone("");
              setOtp("");
              setStep("phone");
              handleClose();
            }
          }, 1500);
        } else {
          setMessage(res.data.message || "Invalid OTP ❌");
        }
      } else {
        setMessage("Invalid session. Please try again ❌");
        setStep("phone");
        setOtp("");
      }

    } catch (err) {
      console.error("OTP verification error:", err);
      
      if (!isMountedRef.current) return;
      
      let errorMessage = "Error verifying OTP ❌";
      
      switch (err.code) {
        case 'auth/invalid-verification-code':
          errorMessage = "Invalid OTP. Please check and try again ❌";
          break;
        case 'auth/code-expired':
          errorMessage = "OTP has expired. Please request a new one ❌";
          break;
        case 'auth/session-expired':
          errorMessage = "Session expired. Please request a new OTP ❌";
          break;
        default:
          if (err.message && err.message.includes('INVALID_CODE')) {
            errorMessage = "Invalid OTP. Please check and try again ❌";
          }
      }
      
      setMessage(errorMessage);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const handleBackToPhone = () => {
    if (isMountedRef.current) {
      setStep("phone");
      setOtp("");
      setMessage("");
      setConfirmationResult(null);
      // Re-initialize reCAPTCHA for new attempt
      initializeRecaptcha();
    }
  };

  const handleResendOtp = async () => {
    if (isMountedRef.current) {
      setOtp("");
      setMessage("");
      setConfirmationResult(null);
      await sendOtp();
    }
  };

  if (!showScreen) return null;

  return (
    <Overlay animate={animate}>
      <Modal animate={animate}>
        {/* Close button */}
        <CloseButton onClick={handleClose}>
          ×
        </CloseButton>

        {/* Header with gradient background */}
        <Header>
          <HeaderTop>
            <Logo animate={animate} src={logo} alt="Croscrow" />
          </HeaderTop>
          <HeaderTitle>Exclusive Deals Await!</HeaderTitle>
          <HeaderSubtitle>Join thousands of satisfied customers</HeaderSubtitle>
        </Header>

        {/* Content with OTP Login Form */}
        <Content>
          <MainTitle>Login with Mobile OTP</MainTitle>

          {/* reCAPTCHA container (invisible) */}
          <div id="recaptcha-container" ref={recaptchaContainerRef}></div>

          {/* OTP Form */}
          <OTPFormContainer animate={animate}>
            {step === "phone" && (
              <PhoneStep animate={animate}>
                <InputGroup>
                  <InputLabel>Mobile Number</InputLabel>
                  <div className='mobileInput'>
                    <span>+91</span>
                    <PhoneInput
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setPhone(value);
                        if (message && message.includes("valid")) {
                          setMessage("");
                        }
                      }}
                      animate={animate}
                    />
                  </div>
                </InputGroup>
                <SendOTPButton
                  onClick={sendOtp}
                  disabled={loading || !phone || phone.length !== 10 || !isValidPhoneNumber(phone)}
                  animate={animate}
                >
                  {loading ? "Sending..." : "Send OTP 📱"}
                </SendOTPButton>
                
                {/* Alternative backend method button */}
                {/* <FallbackButton
                  onClick={sendOtpViaBackend}
                  disabled={loading || !phone || phone.length !== 10 || !isValidPhoneNumber(phone)}
                  style={{ marginTop: '8px' }}
                >
                  {loading ? "Sending..." : "Try Alternative Method"}
                </FallbackButton> */}
              </PhoneStep>
            )}

            {step === "otp" && (
              <OTPStep animate={animate}>
                <InputGroup>
                  <InputLabel>Enter OTP sent to +91{phone}</InputLabel>
                  <OTPInput
                    type="text"
                    placeholder="XXXXXX"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setOtp(value);
                      if (message && message.includes("valid")) {
                        setMessage("");
                      }
                    }}
                    animate={animate}
                    maxLength="6"
                  />
                </InputGroup>
                <ButtonGroup>
                  <VerifyButton
                    onClick={verifyOtp}
                    disabled={loading || !otp || otp.length !== 6}
                    animate={animate}
                  >
                    {loading ? "Verifying..." : "Verify OTP ✅"}
                  </VerifyButton>
                  <BackButton onClick={handleBackToPhone}>
                    ← Back
                  </BackButton>
                </ButtonGroup>
                <ResendButton onClick={handleResendOtp} disabled={loading}>
                  Resend OTP
                </ResendButton>
              </OTPStep>
            )}

            {/* Message Display */}
            {message && (
              <MessageBox isError={message.includes("❌")} animate={animate}>
                {message}
              </MessageBox>
            )}
          </OTPFormContainer>

          <GoogleBtn animate={animate}>
              <GoogleLoginButton state={state} actions={actions} isVisible={isVisible} />
          </GoogleBtn>

          {/* Later Button */}
          <LaterButton onClick={handleClose}>
            Maybe Later
          </LaterButton>

          {/* Small print */}
          <SmallPrint>
            *Offers valid for registered users only. Terms & conditions apply.
          </SmallPrint>
        </Content>
      </Modal>
    </Overlay>
  );
};

export default connect(FlashScreen);

// ... (keeping all your existing styled components exactly the same)

const GoogleBtn = styled.div`
    margin-block: 15px;
`;

// Animation keyframes
const pulseAnimation = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

const slideInFromTop = `
  @keyframes slideInFromTop {
    0% { 
      transform: translateY(-100px) scale(0.8);
      opacity: 0;
    }
    100% { 
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }
`;

const fadeInUp = `
  @keyframes fadeInUp {
    0% { 
      opacity: 0;
      transform: translateY(20px);
    }
    100% { 
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const logoFadeIn = `
  @keyframes logoFadeIn {
    0% { 
      opacity: 0;
      transform: translateY(-20px) scale(0.8);
    }
    50% {
      transform: translateY(-5px) scale(1.1);
    }
    100% { 
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const logoFloat = `
  @keyframes logoFloat {
    0%, 100% { 
      transform: translateY(0px) scale(1);
    }
    50% { 
      transform: translateY(-8px) scale(1.02);
    }
  }
`;

const logoGlow = `
  @keyframes logoGlow {
    0%, 100% { 
      filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
    }
    50% { 
      filter: drop-shadow(0 0 16px rgba(255, 255, 255, 0.6));
    }
  }
`;

// Styled Components
const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.animate ? 'rgba(0, 0, 0, 0.6)' : 'transparent'};
    backdrop-filter: ${props => props.animate ? 'blur(4px)' : 'none'};
    transition: all 0.3s ease;
`;

const Modal = styled.div`
    position: relative;
    background: white;
    border-radius: 16px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    max-width: 400px;
    width: 90%;
    margin: 0 16px;
    overflow: hidden;
    transform: ${props => props.animate ? 'scale(1)' : 'scale(0.95)'};
    opacity: ${props => props.animate ? '1' : '0'};
    transition: all 0.3s ease;
    
    ${slideInFromTop}
    ${fadeInUp}
    ${pulseAnimation}
    ${logoFadeIn}
    ${logoFloat}
    ${logoGlow}
    
    animation: ${props => props.animate ? 'slideInFromTop 0.6s ease-out' : 'none'};
`;

const CloseButton = styled.button`
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 10;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    cursor: pointer;
    font-size: 24px;
    font-weight: bold;
    color: #666;
    transition: background-color 0.2s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    
    &:hover {
        background: rgba(255, 255, 255, 1);
    }
`;

const Header = styled.div`
    background: linear-gradient(135deg, #090c0e, #7e8e9a);
    padding: 20px 24px;
    text-align: center;
    color: white;
    position: relative;
    overflow: hidden;
`;

const HeaderTitle = styled.h2`
    font-size: 24px;
    font-weight: bold;
    margin: 0 0 8px 0;
`;

const HeaderSubtitle = styled.p`
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    margin: 0;
`;

const Content = styled.div`
    padding: 24px;
`;

const MainTitle = styled.h3`
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 24px 0;
    text-align: center;
`;

const HeaderTop = styled.div`
    display: flex; 
    align-items: center; 
    gap: 1rem; 
    padding: 1rem 2rem; 
    justify-content: center;
`;

const Logo = styled.img`
    height: 35px; 
    width: auto; 
    opacity: ${props => props.animate ? '1' : '0'};
    transform: ${props => props.animate ? 'translateX(0)' : 'translateX(-30px)'};
    transition: all 0.5s ease;
    transition-delay: ${props => props.delay || '0.3s'};
    cursor: pointer;
    
    animation: ${props => props.animate ?
    'logoFadeIn 0.8s ease-out 0.2s both, logoFloat 3s ease-in-out infinite 1.5s, logoGlow 2s ease-in-out infinite 2s'
    : 'none'};
    
    &:hover {
        transform: scale(1.1) rotate(2deg);
        filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.5));
        transition: all 0.3s ease;
    }
`;

// OTP Form Styles
const OTPFormContainer = styled.div`
    margin-bottom: 24px;
    opacity: ${props => props.animate ? '1' : '0'};
    transform: ${props => props.animate ? 'translateY(0)' : 'translateY(20px)'};
    transition: all 0.5s ease;
    transition-delay: 0.4s;
`;

const PhoneStep = styled.div`
    opacity: ${props => props.animate ? '1' : '0'};
    animation: ${props => props.animate ? 'fadeInUp 0.6s ease-out 0.5s both' : 'none'};
`;

const OTPStep = styled.div`
    opacity: ${props => props.animate ? '1' : '0'};
    animation: ${props => props.animate ? 'fadeInUp 0.6s ease-out both' : 'none'};
`;

const InputGroup = styled.div`
    margin-bottom: 16px;
    
    .mobileInput {
        position: relative;
        display: flex;
        align-items: center;
        
        span {
            position: absolute;
            z-index: 2;
            font-weight: 600;
            color: #fff;
            font-size: 16px;
        }
    }
`;

const InputLabel = styled.label`
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 8px;
`;

const PhoneInput = styled.input`
    width: 100%;
    padding: 12px 16px 12px 62px !important;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.3s ease;
    background: #f9fafb;
    
    &:focus {
        outline: none;
        border-color: #3b82f6;
        background: white;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
    }
    
    &::placeholder {
        color: #9ca3af;
    }
`;

const OTPInput = styled.input`
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 18px;
    text-align: center;
    font-weight: 600;
    letter-spacing: 2px;
    transition: all 0.3s ease;
    background: #f9fafb;
    
    &:focus {
        outline: none;
        border-color: #10b981;
        background: white;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
    }
    
    &::placeholder {
        color: #9ca3af;
        letter-spacing: normal;
    }
`;

const SendOTPButton = styled.button`
    width: 100%;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -200px;
        width: 200px;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
        );
        transition: left 0.5s;
    }
    
    &:hover:not(:disabled) {
        background: linear-gradient(135deg, #2563eb, #1e40af);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
        
        &::before {
            left: 100%;
        }
    }
    
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    animation: ${props => props.animate ? 'pulse 2s ease-in-out infinite 2s' : 'none'};
`;

const VerifyButton = styled.button`
    flex: 1;
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -200px;
        width: 200px;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
        );
        transition: left 0.5s;
    }
    
    &:hover:not(:disabled) {
        background: linear-gradient(135deg, #059669, #047857);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
        
        &::before {
            left: 100%;
        }
    }
    
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const BackButton = styled.button`
    padding: 12px 16px;
    background: white;
    color: #6b7280;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background: #f9fafb;
        color: #374151;
        border-color: #9ca3af;
    }
`;

const ResendButton = styled.button`
    width: 100%;
    background: transparent;
    color: #3b82f6;
    padding: 8px 16px;
    border: none;
    font-weight: 500;
    cursor: pointer;
    font-size: 14px;
    margin-top: 12px;
    transition: all 0.2s ease;
    
    &:hover:not(:disabled) {
        color: #1d4ed8;
        text-decoration: underline;
    }
    
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 12px;
    align-items: center;
`;

const LaterButton = styled.button`
    width: 100%;
    background: white;
    color: #374151;
    padding: 12px 24px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
    margin-bottom: 16px;
    
    &:hover {
        background: #f9fafb;
    }
`;

const SmallPrint = styled.p`
    text-align: center;
    font-size: 12px;
    color: #9ca3af;
    margin: 0;
`;

const FallbackButton = styled.button`
    width: 100%;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
    border: none;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 8px;
    
    &:hover:not(:disabled) {
        background: linear-gradient(135deg, #d97706, #b45309);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
    }
    
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const MessageBox = styled.div`
    padding: 12px 16px;
    border-radius: 8px;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    margin: 16px 0;
    background: ${props => props.isError ? '#fee2e2' : '#d1fae5'};
    color: ${props => props.isError ? '#dc2626' : '#065f46'};
    border: 1px solid ${props => props.isError ? '#fca5a5' : '#a7f3d0'};
    opacity: ${props => props.animate ? '1' : '0'};
    animation: ${props => props.animate ? 'fadeInUp 0.4s ease-out both' : 'none'};
`;