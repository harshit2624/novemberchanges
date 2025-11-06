import React, { useEffect, useState } from "react";
import { connect, styled } from "frontity";
import axios from "axios";
import Loading from "./loading";

const apiUrl = "https://www.croscrow.com/a/wp-json";

// Styled Components
const Container = styled.div`
  max-width: 1680px !important;
  margin: 0 auto !important;
  padding-inline: 5rem !important;

  @media (max-width: 767px) {
    max-width: 100% !important;
    padding-inline: 15px !important;
  }

  @media screen and (min-width: 767px) and (max-width: 992px) {
    max-width: 100% !important;
    padding-inline: 25px !important;
  }
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const OrderTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #222;
  margin: 0 0 10px 0;
`;

const OrderStatus = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.5;
`;

const FlexWrapper = styled.div`
  display: flex;
  gap: 30px;
  align-items: flex-start;
  
  @media (max-width: 992px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const MainContent = styled.div`
  flex: 2;
  @media (max-width: 992px) {
    flex: unset;
    width: 100%;
  }
`;

const Sidebar = styled.div`
  flex: 1;
  min-width: 300px;
  @media (max-width: 992px) {
    flex: unset;
    width: 100%;
  }
`;

const OrderBox = styled.div`
  padding: 25px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  @media (max-width: 992px) {
    padding: 20px;
    margin-bottom: 15px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #222;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 6px;
  border-left: 4px solid rgb(20, 24, 27);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #222;
  margin: 0 0 5px 0;
`;

const ItemDetails = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`;

const ItemPrice = styled.div`
  text-align: right;
  font-weight: 600;
  color: #007cba;
  font-size: 14px;
  
  @media (max-width: 768px) {
    text-align: left;
  }
`;

const AddressGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AddressBox = styled.div`
  padding: 20px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
`;

const AddressTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #222;
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: "📍";
    font-size: 16px;
  }
`;

const AddressText = styled.p`
  font-size: 14px;
  color: #555;
  margin: 0 0 8px 0;
  line-height: 1.4;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const PaymentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: #e8f5e8;
  border-radius: 6px;
  border: 1px solid #c3e6c3;
`;

const PaymentIcon = styled.span`
  font-size: 1.3rem;
`;

const PaymentText = styled.span`
  font-weight: 500;
  color: #2d5a2d;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${({ status }) => {
    switch (status) {
      case 'pending': return '#fff3cd';
      case 'processing': return '#d1ecf1';
      case 'completed': return '#d4edda';
      case 'cancelled': return '#f8d7da';
      default: return '#e2e3e5';
    }
  }};
  color: ${({ status }) => {
    switch (status) {
      case 'pending': return '#856404';
      case 'processing': return '#0c5460';
      case 'completed': return '#155724';
      case 'cancelled': return '#721c24';
      default: return '#383d41';
    }
  }};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  background: #f8d7da;
  color: #721c24;
  border-radius: 8px;
  border: 1px solid #f5c6cb;
`;

const OrderDetailsPage = ({ state }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Extract orderId from URL like /my-account/view-order/370/
  const link = state.router.link;
  const orderId = link.match(/view-orders\/(\d+)/)?.[1];

  useEffect(() => {
    if (orderId) fetchOrder(orderId);
  }, [orderId]);

  const fetchOrder = async (id) => {
    try {
      const res = await axios.get(`${apiUrl}/wc/v3/orders/${id}`, {
        auth: {
          username: "ck_2732dde9479fa4adf07d8c7269ae22f39f2c74a5",
          password: "cs_14996e7e8eed396bced4ac30a0acfd9fea836214",
        },
      });
      setOrder(res.data);
    } catch (err) {
      console.error("Error fetching order:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Container>
        <Loading />;
      </Container>
    );
  }

  if (!order) {
    return (
      <Container>
        <ErrorMessage>Order not found.</ErrorMessage>
      </Container>
    );
  }
  console.log(order, 'orderorderorderorderorder');
  return (
    <Container>
      <Header>
        <OrderTitle>Order #{order.id}</OrderTitle>
        <OrderStatus>
          Placed on <strong>{formatDate(order.date_created)}</strong> and is currently{' '}
          <StatusBadge status={order.status}>{order.status}</StatusBadge>
        </OrderStatus>
      </Header>

      <FlexWrapper>
        <MainContent>
          <OrderBox>
            <SectionTitle>Order Details</SectionTitle>
            <ItemsList>
              {order.line_items.map((item) => (
                <OrderItem key={item.id}>
                  <ItemInfo>
                    <ItemName>{item.name}</ItemName>
                    <ItemDetails>Quantity: {item.quantity}</ItemDetails>
                  </ItemInfo>
                  <ItemPrice>₹{(item.price * item.quantity).toFixed(2)}</ItemPrice>
                </OrderItem>
              ))}
            </ItemsList>
          </OrderBox>

          <OrderBox>
            <SectionTitle>Addresses</SectionTitle>
            <AddressGrid>
              <AddressBox>
                <AddressTitle>Billing Address</AddressTitle>
                <AddressText><strong>{order.billing.first_name} {order.billing.last_name}</strong></AddressText>
                <AddressText>{order.billing.address_1}</AddressText>
                <AddressText>{order.billing.city}, {order.billing.postcode}</AddressText>
                <AddressText>{order.billing.country}</AddressText>
              </AddressBox>
              <AddressBox>
                <AddressTitle>Shipping Address</AddressTitle>
                <AddressText><strong>{order.shipping.first_name} {order.shipping.last_name}</strong></AddressText>
                <AddressText>{order.shipping.address_1}</AddressText>
                <AddressText>{order.shipping.city}, {order.shipping.postcode}</AddressText>
                <AddressText>{order.shipping.country}</AddressText>
              </AddressBox>
            </AddressGrid>
          </OrderBox>
        </MainContent>

        <Sidebar>
          <OrderBox>
            <SectionTitle>Payment Information</SectionTitle>
            <PaymentInfo>
              <PaymentIcon>💳</PaymentIcon>
              <PaymentText>{order.payment_method_title}</PaymentText>
            </PaymentInfo>
          </OrderBox>
        </Sidebar>
      </FlexWrapper>
    </Container>
  );
};

export default connect(OrderDetailsPage);