import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Postproduct(props) {
  const [productCredentials, setProductCredentials] = useState({
    name: "",
    category: "",
    description: "",
    startingbidprice: "",
    reserveprice: "",
    durationInMinutes: "",
    paymentmethods: "",
    condition: "",
    status: "active",
  });
  const [image, setImage] = useState(null);
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const seller = localStorage.getItem("id");

    console.log(seller);

    const formData = new FormData();
    formData.append('name', productCredentials.name);
    formData.append('category', productCredentials.category);
    formData.append('description', productCredentials.description);
    formData.append('startingbidprice', productCredentials.startingbidprice);
    formData.append('reserveprice', productCredentials.reserveprice);
    formData.append('durationInMinutes', productCredentials.durationInMinutes);
    formData.append('paymentmethods', productCredentials.paymentmethods);
    formData.append('condition', productCredentials.condition);
    formData.append('status', productCredentials.status);
    formData.append('seller', seller);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/product/createproduct', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const json = response.data;
      if (json.success) {
        props.showAlert("Product Added Successfully", "success");
        navigate("/profile", props);
      } else {
        props.showAlert(json.error, "danger");
      }
    } catch (error) {
      console.error(error);
      props.showAlert("An error occurred while adding the product. Kindly Login Again", "danger");
    }
  };

  const handleChange = (e) => {
    setProductCredentials({ ...productCredentials, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="mt-24 flex items-center justify-center mb-8">
      <div className="container max-w-screen-md bg-blue-100 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Add Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-xl font-medium text-gray-700">Name</label>
            <input type="text" name="name" className="form-input mt-1 block w-full" id="name" value={productCredentials.name} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-xl font-medium text-gray-700">Category</label>
            <select className="form-select mt-1 block w-full" id="category" name="category" onChange={handleChange} required>
              <option value="">Select Category</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-xl font-medium text-gray-700">Description</label>
            <textarea name="description" className="form-input mt-1 block w-full" id="description" value={productCredentials.description} onChange={handleChange} required></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="startingbidprice" className="block text-xl font-medium text-gray-700">Starting Bid Price</label>
            <input type="number" name="startingbidprice" className="form-input mt-1 block w-full" id="startingbidprice" value={productCredentials.startingbidprice} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label htmlFor="reserveprice" className="block text-xl font-medium text-gray-700">Reserve Price</label>
            <input type="number" name="reserveprice" className="form-input mt-1 block w-full" id="reserveprice" value={productCredentials.reserveprice} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label htmlFor="durationInMinutes" className="block text-xl font-medium text-gray-700">Duration (Minutes)</label>
            <input type="number" name="durationInMinutes" className="form-input mt-1 block w-full" id="durationInMinutes" value={productCredentials.durationInMinutes} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label htmlFor="paymentmethods" className="block text-xl font-medium text-gray-700">Payment Methods</label>
            <select className="form-select mt-1 block w-full" id="paymentmethods" name="paymentmethods" onChange={handleChange} required>
              <option value="">Select Payment Method Accepted</option>
              <option value="upitransfer">UPI Transfer</option>
              <option value="banktransfer">Bank Transfer</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="condition" className="block text-xl font-medium text-gray-700">Condition</label>
            <input type="text" name="condition" className="form-input mt-1 block w-full" id="condition" value={productCredentials.condition} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block text-xl font-medium text-gray-700">Image</label>
            <input type="file" name="image" className="form-input mt-1 block w-full" id="image" onChange={handleImageChange} required />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Postproduct;
