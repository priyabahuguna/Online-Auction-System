import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

function ProductDetailsForBid(props) {
  const [bidAmount, setBidAmount] = useState("");
  const location = useLocation();
  const product = location.state.product;
  const { authToken } = useAuth();
  const navigate = useNavigate();

  const handlePlaceBid = async () => {
    const uniqueid = localStorage.getItem("useruniqueid");

    if (parseInt(product.seller) === parseInt(uniqueid)) {
      props.showAlert("You cannot place a bid on your own product", "danger");
      return;
    }

    if (parseFloat(bidAmount) <= parseFloat(product.currentbidprice)) {
      props.showAlert("Bid amount should be greater than current bid price", "danger");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/product/place-bid/${product._id}`,
        {
          bidAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const json = response.data;
      if (json.success) {
        console.log("Bid placed successfully:", response.data);
        props.showAlert("Bid placed successfully", "success");
        navigate("/");
      } else {
        props.showAlert(json.error, "danger");
      }
    } catch (error) {
      console.error("Error placing bid:", error);
    }
  };

  return (
    <div className="container mx-auto my-auto mt-24 px-4 max-w-screen-md">
      <h2 className="text-2xl font-bold">Product Details</h2>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/*{product.image && (
            <img
            src={`http://localhost:5000/productImages/${product.image}`}
            alt={product.name}
            className="w-full max-h-64 h-auto object-contain mb-4 rounded-lg"
          />
        )}*/}
        <p className="mb-4"><span className="font-bold">Name:</span> {product.name}</p>
        <p className="mb-4"><span className="font-bold">Description:</span> {product.description}</p>
        <p className="mb-4"><span className="font-bold">Starting Bid Price:</span> ${product.startingbidprice}</p>
        <p className="mb-4"><span className="font-bold">Current Bid Price:</span> ${product.currentbidprice}</p>
        <p className="mb-4"><span className="font-bold">Duration:</span> {product.durationInMinutes} minutes</p>
        <p className="mb-4"><span className="font-bold">Condition:</span> {product.condition}</p>
        <p className="mb-4"><span className="font-bold">Status:</span> {product.status}</p>
        <div className="mb-4">
          <label htmlFor="bidAmount" className="block text-sm font-bold text-black-700">Your Bid Amount:</label>
          <input
            type="number"
            className="form-input mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-500 focus:ring-opacity-50 px-3 py-2"
            id="bidAmount"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            required
          />
        </div>
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          onClick={handlePlaceBid}
        >
          Place Bid
        </button>
      </div>
    </div>
  );
}

export default ProductDetailsForBid;
