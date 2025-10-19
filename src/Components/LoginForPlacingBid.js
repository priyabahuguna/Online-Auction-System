import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

function LoginForPlacingBid(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state.product;
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // Check if OTP is already sent
      if (otpSent) {
        // Verify OTP
        const otpResponse = await axios.post("http://localhost:5000/api/auth/verifyotp", {
          email,
          otp,
        });

        if (!otpResponse.data.success) {
          setError("Invalid OTP. Please try again.");
          setLoading(false);
          return;
        }

        // OTP verified, navigate to home page
        props.showAlert("Logged in successfully", "success");
        localStorage.setItem("useruniqueid", response.data.uniqueid);
        navigate("/product-details-for-bid", { state: { product } });
        login(response.data.authToken);
        setLoading(false);
      } else {
        // Send OTP
        const otpResponse = await axios.post("http://localhost:5000/api/auth/sendotp", {
          email,
        });

        if (!otpResponse.data.success) {
          setError(otpResponse.data.error);
          setLoading(false);
          return;
        }

        // OTP sent successfully
        setOtpSent(true);
        setLoading(false);
        props.showAlert("OTP sent successfully", "success");
      }
    } catch (error) {
      setLoading(false);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-300">
      <div className="w-full max-w-md bg-blue-100 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700">
              Email address
            </label>
            <input
              type="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {otpSent && (
            <div>
              <label htmlFor="otp" className="block text-gray-700">
                Enter OTP
              </label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
          )}
          <button
            type="submit"
            className={`w-full py-2 px-4 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForPlacingBid;
