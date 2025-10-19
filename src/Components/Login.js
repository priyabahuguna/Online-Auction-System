import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';

function Login(props) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      props.showAlert('Please verify OTP', 'danger');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        ...credentials,
        otp
      });

      const json = response.data;

      if (response.status === 200) {
        localStorage.setItem('useruniqueid', json.uniqueid);
        login(json.authToken);
        navigate('/');
        props.showAlert('Logged in Successfully', 'success');
      } else {
        props.showAlert('Invalid Credentials', 'danger');
      }
    } catch (error) {
      console.error('Error during login:', error);
      props.showAlert('An error occurred during login', 'danger');
    }
  };

  const sendOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/sendotp', {
        email: credentials.email
      });

      const json = response.data;

      if (json.success) {
        props.showAlert('OTP sent successfully', 'success');
        setOtpSent(true);
      } else {
        props.showAlert(json.error, 'danger');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      props.showAlert('An error occurred while sending OTP. Please try again.', 'danger');
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verifyotp', {
        email: credentials.email,
        otp
      });

      const json = response.data;

      if (json.success) {
        props.showAlert('OTP verified successfully', 'success');
        setOtpVerified(true);
      } else {
        props.showAlert(json.error, 'danger');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      props.showAlert('An error occurred while verifying OTP. Please try again.', 'danger');
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="container max-w-md bg-blue-100 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Log in Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700">
              Email address
            </label>
            <input
              type="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              id="email"
              name="email"
              value={credentials.email}
              onChange={onChange}
              minLength={5}
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
              name="password"
              value={credentials.password}
              onChange={onChange}
              minLength={5}
              required
            />
          </div>
          {otpSent && !otpVerified && (
            <div>
              <label htmlFor="otp" className="block text-gray-700">
                Enter OTP
              </label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button
                type="button"
                className="mt-2 w-full py-2 px-4 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
                onClick={verifyOtp}
              >
                Verify OTP
              </button>
            </div>
          )}
          <button
            type="button"
            className={`w-full py-2 px-4 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300 ${otpSent ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={sendOtp}
            disabled={otpSent}
          >
            {otpSent ? 'OTP Sent' : 'Send OTP'}
          </button>
          <button
            type="submit"
            className={`mt-4 w-full py-2 px-4 bg-green-500 text-white rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring focus:border-green-300 ${!otpVerified ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!otpVerified}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
