import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";


function Home(props) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:5000/api/product/upcoming")
      .then(response => {
        const activeProducts = response.data.filter(product => product.status === "active");
        const updatedProducts = activeProducts.map(product => {
          const endDate = new Date(product.createdAt);
          endDate.setMinutes(endDate.getMinutes() + product.durationInMinutes);
          return { ...product, endDate };
        });
        setProducts(updatedProducts);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching upcoming auctions:", error);
        props.showAlert("Failed to fetch upcoming auctions.", "danger");
        setLoading(false);
      });
  }, [props]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!category || !searchTerm) {
      props.showAlert("Please select a category and enter a product name.", "danger");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/product/search/${category}/${searchTerm}`);
      const searchResults = response.data;
      if (!searchResults || searchResults.length === 0) {
        props.showAlert("No results found", "message");
      } else {
        navigate("/search-results", { state: { searchResults } });
      }
    } catch (error) {
      console.error("Error searching for products:", error);
      props.showAlert("An error occurred while searching for products.", "danger");
    }
    setLoading(false);
    setCategory("");
    setSearchTerm("");
  };

  const handlePlaceBid = (product) => {
    if (isAuthenticated) {
      navigate("/product-details-for-bid", { state: { product } });
    } else {
      navigate("/login", { state: { product } });
    }
  };

  return (
    <>
      <div className="container mx-auto flex justify-center items-center font-serif text-black mt-40">
        <ul className="text-center space-y-7">
          <li className="list-none text-4xl">Welcome to</li>
          <li className="list-none text-6xl">BIDMASTER</li>
          <li className="list-none font-bold text-7xl">ONLINE AUCTION SYSTEM</li>
          <li className="list-none text-4xl">Auctions held over Internet</li>
        </ul>
      </div>

      <div className="container mx-auto mt-24">
        <div className="flex justify-center mt-5">
          <div className="w-full md:w-8/12">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row">
              <select className="form-select mb-2 md:mb-0 md:mr-2 w-full md:w-auto px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">Select Category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="books">Books</option>
              </select>
              <input className="form-control mb-2 md:mb-0 md:mr-2 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" type="search" placeholder="Product Name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} required />
              <button className="btn btn-outline-success bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300" type="submit">Search</button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-24">
        <h1 className="text-center text-4xl font-bold mb-8">UPCOMING AUCTIONS</h1>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="container mx-auto py-10 mt-20 px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product._id} className="flex flex-col justify-between card border border-gray-300 rounded-lg p-4 shadow-md bg-white">
                  {/*{product.image && (
                   <img
                      src={`http://localhost:5000/productImages/${product.image}`}
                      alt={product.name}
                      className="w-full h-full object-cover mb-4 rounded-lg"
                    />
                  )}*/}
                  <div className="card-body flex-grow">
                    <h5 className="text-xl font-semibold mb-2">{product.name}</h5>
                    <p className="text-gray-700 text-1xl mb-2">Category: {product.category}</p>
                    <p className="text-gray-700 text-1xl mb-2">Description: {product.description}</p>
                    <p className="text-gray-700 text-1xl mb-2">Starting Bid Price: ${product.startingbidprice}</p>
                    <p className="text-gray-700 text-1xl mb-2">Current Bid Price: ${product.currentbidprice}</p>
                    <p className="text-gray-700 text-1xl mb-2">End Date: {product.endDate.toLocaleString()}</p>
                    <p className="text-gray-700 text-1xl mb-2">Condition: {product.condition}</p>
                    <p className="text-gray-700 text-1xl mb-4">Status: {product.status}</p>
                  </div>
                  <div className="flex justify-center mt-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300" onClick={() => handlePlaceBid(product)}>Place Bid</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
