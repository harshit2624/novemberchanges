import React, { useState } from "react";
import axios from "axios";
import {
  getWpBaseUrl,
  handleLogin
} from "../utils";

const OTPLogin = ({ state, actions }) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone"); // phone | otp
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Send OTP
  const sendOtp = async () => {
    try {
      setLoading(true);
      const res = await axios.post("https://www.croscrow.com/a/wp-json/otp/v1/send", {
        phone: `+91${phone}`,
      });
      console.log("Send OTP Response:", res.data);
      setMessage("OTP sent successfully");
      setStep("otp");
    } catch (err) {
      setMessage("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${getWpBaseUrl(state)}/wp-json/otp/v1/verify`, {
        phone: `+91${phone}`,
        code: otp,
      });

      if (res.data.success) {
        setMessage("Login successful ✅");

        // Use the global login handler to integrate with your existing system
        if (res.data.token) {
          await handleLogin(state, actions, res.data.token, res.data.user_data);
        }

        // Reset form
        setPhone("");
        setOtp("");
        setStep("phone");

      } else {
        setMessage(res.data.message || "Invalid OTP ❌");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setMessage("Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Login with Mobile OTP</h2>

      {step === "phone" && (
        <div>
          <span>+91</span>
          <input
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <button
            onClick={sendOtp}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </div>
      )}

      {step === "otp" && (
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <button
            onClick={verifyOtp}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      )}

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default OTPLogin;
