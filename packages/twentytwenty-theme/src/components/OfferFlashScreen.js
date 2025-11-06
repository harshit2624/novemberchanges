// OfferFlashScreen.js - Create this new file in the same directory as FlashScreen.js

import React, { useState, useEffect } from 'react';
import { styled, connect } from "frontity";
import logo from '../../../../static/image/crosWHT.png';

const OfferFlashScreen = ({ state, actions, onClose, isVisible = true, couponCode = '' }) => {
  const [showScreen, setShowScreen] = useState(isVisible);
  const [animate, setAnimate] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowScreen(true);
      setTimeout(() => {
        setAnimate(true);
      }, 100);
    }
  }, [isVisible]);

  const handleClose = () => {
    setAnimate(false);
    setTimeout(() => {
      setShowScreen(false);
      onClose && onClose();
    }, 300);
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText(couponCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!showScreen) return null;

  return (
    <Overlay animate={animate}>
      <Modal animate={animate}>
        <CloseButton onClick={handleClose}>×</CloseButton>
        
        <Header>
          <HeaderTop>
            <Logo animate={animate} src={logo} alt="Croscrow" />
          </HeaderTop>
          <HeaderTitle>🎉 Special Offer Just for You! 🎉</HeaderTitle>
          <HeaderSubtitle>Exclusive discount code inside</HeaderSubtitle>
        </Header>

        <Content>
          <OfferTitle>Your Exclusive Coupon Code</OfferTitle>
          
          <CouponContainer animate={animate}>
            <CouponBox onClick={handleCopyCoupon}>
              <CouponCode>{couponCode}</CouponCode>
              <CopyIcon>{copied ? '✓' : '📋'}</CopyIcon>
            </CouponBox>
            <CopyText>{copied ? 'Copied!' : 'Click to copy'}</CopyText>
          </CouponContainer>

          <OfferDetails>
            <DetailItem>✨ Valid for limited time only</DetailItem>
            <DetailItem>🛍️ Applicable on all products</DetailItem>
            <DetailItem>🎁 Exclusive for you</DetailItem>
          </OfferDetails>

          <ContinueButton onClick={handleClose} animate={animate}>
            Continue Shopping →
          </ContinueButton>
        </Content>
      </Modal>
    </Overlay>
  );
};

export default connect(OfferFlashScreen);

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  opacity: ${props => props.animate ? '1' : '0'};
  transition: opacity 0.3s ease;
`;

const Modal = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  width: 90%;
  max-width: 480px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transform: ${props => props.animate ? 'scale(1)' : 'scale(0.9)'};
  transition: transform 0.3s ease;
  scrollbar-width: none;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 32px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
  }
`;

const Header = styled.div`
  padding: 25px 24px 24px;
  text-align: center;
  color: white;
`;

const HeaderTop = styled.div`
  margin-bottom: 20px;
`;

const Logo = styled.img`
  width: 120px;
  height: auto;
  opacity: ${props => props.animate ? '1' : '0'};
  transform: ${props => props.animate ? 'translateY(0)' : 'translateY(-20px)'};
  transition: all 0.5s ease 0.1s;
`;

const HeaderTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 8px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const HeaderSubtitle = styled.p`
  font-size: 16px;
  margin: 0;
  opacity: 0.9;
`;

const Content = styled.div`
  background: white;
  border-radius: 24px 24px 0 0;
  padding: 20px 24px;
`;

const OfferTitle = styled.h2`
  text-align: center;
  font-size: 18px;
  color: #333;
  margin: 0 0 24px 0;
  font-weight: 600;
`;

const CouponContainer = styled.div`
  margin: 14px 0;
  opacity: ${props => props.animate ? '1' : '0'};
  transform: ${props => props.animate ? 'translateY(0)' : 'translateY(20px)'};
  transition: all 0.5s ease 0.3s;
`;

const CouponBox = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 3px dashed white;
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(-2px);
  }
`;

const CouponCode = styled.span`
  font-size: 32px;
  font-weight: bold;
  color: white;
  letter-spacing: 4px;
  font-family: 'Courier New', monospace;
`;

const CopyIcon = styled.span`
  font-size: 28px;
  transition: transform 0.3s ease;
`;

const CopyText = styled.p`
  text-align: center;
  color: #667eea;
  font-size: 14px;
  margin: 12px 0 0 0;
  font-weight: 500;
`;

const OfferDetails = styled.div`
  padding: 10px;
  background: #f8f9fa;
  border-radius: 12px;
`;

const DetailItem = styled.p`
  font-size: 14px;
  color: #555;
  margin: 12px 0;
  padding-left: 8px;
`;

const ContinueButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 24px;
  opacity: ${props => props.animate ? '1' : '0'};
  transform: ${props => props.animate ? 'translateY(0)' : 'translateY(20px)'};
  transition: all 0.5s ease 0.4s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;