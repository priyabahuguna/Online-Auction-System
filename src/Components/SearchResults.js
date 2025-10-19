import React from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

function SearchResults(props) {
  const location = useLocation();
  const results = location.state.searchResults || [];
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handlePlaceBid = (product) => {
    if (isAuthenticated) {
      navigate("/product-details-for-bid", { state: { product } });
    } else {
      navigate("/login-for-placing-bid", { state: { product } });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">Search Results</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {results.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-md">
            <div className="p-4">
              <h5 className="text-xl font-semibold mb-2">{product.name}</h5>
              <p className="text-sm text-gray-600 mb-2">Category: {product.category}</p>
              <p className="text-sm text-gray-600 mb-2">Description: {product.description}</p>
              <p className="text-sm text-gray-600 mb-2">Starting Bid Price: ${product.startingbidprice}</p>
              <p className="text-sm text-gray-600 mb-2">Current Bid Price: ${product.currentbidprice}</p>
              <p className="text-sm text-gray-600 mb-2">Duration: {product.durationInMinutes} minutes</p>
              <p className="text-sm text-gray-600 mb-2">Condition: {product.condition}</p>
              <p className="text-sm text-gray-600 mb-2">Status: {product.status}</p>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mt-4 inline-block"
                onClick={() => handlePlaceBid(product)}
              >
                Place Bid
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchResults;
