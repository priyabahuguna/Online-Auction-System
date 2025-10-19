import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import defaultPhoto from "./pro.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Profile = (props) => {
  const navigate = useNavigate();
  const { logout, authToken } = useAuth();
  const [userData, setUserData] = useState({
    name: "",
    contactnumber: "",
    email: "",
    uniqueid: "",
    productUploadedForSale: 0,
    productBought: 0,
    image: "", // Include image in the state
  });
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!authToken) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/auth/getuser", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        props.showAlert("Failed to fetch user data", "danger");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authToken, navigate, props]);

  const handlePhotoChange = async (event) => {
    const selectedPhoto = event.target.files[0];
    if (!selectedPhoto) return;

    const formData = new FormData();
    formData.append("image", selectedPhoto);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/uploadphoto", formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUserData((prevUserData) => ({
        ...prevUserData,
        image: response.data.imageUrl,
      }));

      props.showAlert("Photo uploaded successfully", "success");
    } catch (error) {
      console.error("Error uploading photo:", error);
      props.showAlert("Failed to upload photo", "danger");
    }
  };

  const handleUploadPhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    props.showAlert("Logged out successfully", "success");
  };

  const handleEditDetails = () => {
    navigate("/edituser");
  };

  const handlePostProduct = () => {
    //console.log(userData._id);
    localStorage.setItem("id", userData._id);
    navigate("/postproduct");
  };

  const handleViewProduct = () => {
    localStorage.setItem("id", userData._id);
    navigate("/viewproduct");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-300 to-blue-500">
      <div className="bg-white rounded-lg p-8 shadow-lg w-full md:w-4/5 lg:w-3/5 xl:w-2/5">
        <h1 className="text-3xl font-semibold text-black text-center mb-4">DASHBOARD</h1>
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-x-4">
          <div className="md:mr-8 flex-shrink-0">
            <img
              src={userData.image ? `http://localhost:5000${userData.image}` : defaultPhoto}
              alt="Profile"
              className="w-48 h-48 rounded-full object-cover"
              onError={(e) => {
                console.error("Error loading image:", e);
                e.target.src = defaultPhoto;
              }}
            />
            <div className="mt-4">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                ref={fileInputRef}
                className="hidden"
              />
              <button
                onClick={handleUploadPhotoClick}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mx-8 rounded-lg"
              >
                Upload Photo
              </button>
            </div>
            
          </div>
          {!loading && (
            <div className="bg-gray-100 p-4 rounded-lg shadow-md flex-1">
              <p className="text-lg font-semibold mb-2">Name: {userData.name}</p>
              <p>Contact Number: {userData.contactnumber}</p>
              <p>Email: {userData.email}</p>
              <p>Products Uploaded for Selling: {userData.productUploadedForSale}</p>
              <p>Products Bought: {userData.productBought}</p>
            </div>
          )}
        </div>
        <div className="flex flex-col md:flex-row justify-center mt-4 space-y-2 md:space-x-4">
          <button
            onClick={handleEditDetails}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mb-2 md:mb-0 w-full md:w-auto"
          >
            Edit Details
          </button>
          <button
            onClick={handlePostProduct}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mb-2 md:mb-0 w-full md:w-auto"
          >
            Post Product for Selling
          </button>
          <button
            onClick={handleViewProduct}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mb-2 md:mb-0 w-full md:w-auto"
          >
            View Products
          </button>
          <button
            onClick={handleLogout}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg w-full md:w-auto"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
