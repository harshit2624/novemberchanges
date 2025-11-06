import React, { useEffect, useState } from "react";
import axios from "axios";
import { getWpBaseUrl, consumer_key, consumer_secret } from "../utils";
import { connect } from "frontity";
import Loading from "./loading";

const ThankYouPage = ({ state }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState(null);

  const apiUrl = `${getWpBaseUrl(state)}/wp-json`;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = new URLSearchParams(window.location.search).get("order_id");
      if (id) setOrderId(id);
    }
  }, []);

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${apiUrl}/wc/v3/orders/${orderId}`, {
        auth: {
          username: consumer_key,
          password: consumer_secret,
        },
      });
      if (typeof window !== "undefined" && window.fbq && res.data) {
        const order = res.data;
        const products = order.line_items.map(item => ({
          id: item.product_id,
          quantity: item.quantity,
          price: item.price
        }));
      
        window.fbq('track', 'Purchase', {
          value: order.total,
          currency: order.currency,
          contents: products,
          content_type: 'product'
        });
      }
      setOrder(res.data);
    } catch (err) {
      console.error("Error fetching order:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!order) return <p>Order not found.</p>;

  return (
    <div className="thankYouWrapper">
      <h2 className="thankYouHeading">Thank You for Your Order!</h2>
      <p>
        Your order <strong>#{order.id}</strong> has been placed successfully.
      </p>

      <p>Customer Details</p>
      <p>
        <strong>Name:</strong> {order.billing.first_name} {order.billing.last_name}
        <br />
        <strong>Email:</strong> {order.billing.email}
      </p>

      <h3 className="thankYouHeading">Items Ordered</h3>
      <ul className="orderGrid">
        {order.line_items.map((item) => (
          <li key={item.id}>
            <div className="imageContainer">
              <img src={item.image?.src} alt={item.name} />
            </div>
            <div className="orderDetails">
              <p><strong>{item.name}</strong></p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ₹{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default connect(ThankYouPage);
