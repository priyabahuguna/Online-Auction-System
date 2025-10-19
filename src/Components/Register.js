import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';

function Register(props) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    contactnumber: '',
    password: '',
    confirmpassword: '',
    uniqueid:'',
    image: null
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const resetFields = () => {
    setCredentials({
      name: '',
      email: '',
      contactnumber: '',
      password: '',
      confirmpassword: '',
      uniqueid:'',
      image: null
    });
    setPasswordsMatch(true);
    setOtp('');
    setOtpSent(false);
    setOtpVerified(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, contactnumber, password } = credentials;

    if (!otpVerified) {
      props.showAlert('Please verify OTP', 'danger');
      return;
    }
    const uniqueid = Math.floor(Math.random() * 1000000000);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/createuser', {
        name,
        email,
        contactnumber,
        password,
        uniqueid,
        image: null
      });

      const json = response.data;

      if (response.status === 200) {
        localStorage.setItem('useruniqueid', json.uniqueid);
        login(json.authToken);
        navigate('/');
        props.showAlert('Account created successfully', 'success');
      } else {
        props.showAlert(json.error, 'danger');
        resetFields();
      }
    } catch (error) {
      console.error('Error during registration:', error);
      props.showAlert('An error occurred during registration', 'danger');
      resetFields();
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => {
      const newState = { ...prevState, [name]: value };
      if (name === 'password' || name === 'confirmpassword') {
        setPasswordsMatch(newState.password === newState.confirmpassword);
      }
      return newState;
    });
  };

  const sendOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/sendotp', {
        email: credentials.email,
      });

      const json = response.data;

      if (json.success) {
        props.showAlert('OTP sent successfully', 'success');
        setOtpSent(true);
      } else {
        props.showAlert(json.error, 'danger');
        resetFields();
      }
    } catch (error) {
      props.showAlert('An error occurred while sending OTP. Please try again.', 'danger');
      resetFields();
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
        resetFields();
      }
    } catch (error) {
      props.showAlert('An error occurred while verifying OTP. Please try again.', 'danger');
      resetFields();
    }
  };

  return (
    <div className="mt-16 flex items-center justify-center min-h-screen">
      <div className="container max-w-md bg-blue-100 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700">Name</label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              id="name"
              name="name"
              value={credentials.name}
              onChange={onChange}
              minLength={2}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700">Email address</label>
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
            <label htmlFor="contactnumber" className="block text-gray-700">Contact Number</label>
            <input
              type="number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              id="contactnumber"
              name="contactnumber"
              value={credentials.contactnumber}
              onChange={onChange}
              minLength={10}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700">Password</label>
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
          <div>
            <label htmlFor="confirmpassword" className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              id="confirmpassword"
              name="confirmpassword"
              value={credentials.confirmpassword}
              onChange={onChange}
              minLength={5}
              required
            />
            {!passwordsMatch && (
              <div className="text-red-500 text-sm mt-1">Passwords do not match</div>
            )}
          </div>
          {otpSent && !otpVerified && (
            <div>
              <label htmlFor="otp" className="block text-gray-700">Enter OTP</label>
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
            className={`mt-4 w-full py-2 px-4 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300 ${otpSent ? 'opacity-50 cursor-not-allowed' : ''}`}
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

export default Register;
