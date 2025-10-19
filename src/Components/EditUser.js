import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";

function EditUser(props) {
  const [credentials, setCredentials] = useState({
    name: "",
    contactnumber: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, authToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, contactnumber, password } = credentials;

    if (!authToken) {
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(
        "http://localhost:5000/api/auth/updateuser",
        { name, contactnumber, password },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`
          }
        }
      );

      if (response.data.success) {
        setCredentials({ name: "", contactnumber: "", password: "" });
        navigate("/profile", props);
        props.showAlert("Account updated Successfully", "success");
      } else {
        props.showAlert(response.data.error, "danger");
      }
    } catch (error) {
      console.error(error);
      props.showAlert("An error occurred.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    isAuthenticated && (
      <div className="flex items-center justify-center min-h-screen">
        <div className="container max-w-md bg-blue-100 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Update Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                id="name"
                name="name"
                value={credentials.name}
                onChange={onChange}
                minLength={2}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="contactnumber" className="block text-sm font-medium mb-1">Contact Number</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                id="contactnumber"
                name="contactnumber"
                value={credentials.contactnumber}
                onChange={onChange}
                minLength={10}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                id="password"
                value={credentials.password}
                onChange={onChange}
                minLength={5}
                required
              />
            </div>
            {loading ? (
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-md flex items-center justify-center"
                type="button"
                disabled
              >
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.137 1.336 5.955 3.517 7.832l2.483-2.541z"
                  ></path>
                </svg>
                Loading...
              </button>
            ) : (
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Submit
              </button>
            )}
          </form>
        </div>
      </div>
    )
  );
}

export default EditUser;
