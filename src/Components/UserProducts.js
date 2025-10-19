import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            const id = localStorage.getItem("id");
            try {
                const response = await axios.get(`http://localhost:5000/api/product/products/${id}`);
                setProducts(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    const calculateElapsedTime = (endDate) => {
        const end = new Date(endDate);
        const now = new Date();
        const timeDiff = Math.abs(now - end);
        const diffMinutes = Math.floor(timeDiff / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) {
            return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
        } else if (diffHours > 0) {
            return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
        } else {
            return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto py-10 mt-20 px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(product => (
                    <div
                        key={product._id}
                        className={`p-4 rounded-lg shadow-md border ${product.status === 'active' ? 'bg-pink-200' : 'bg-gray-200'} flex flex-col justify-between hover:shadow-lg transition-shadow duration-200`}
                    >
                    {/*   {product.image && (
                    <img
                    src={`http://localhost:5000/productImages/${product.image}`}
                    alt={product.name}
                    className="w-full max-h-64 h-auto object-contain mb-4 rounded-lg"
                /> 
                )}*/}
                        <div className="product-details flex-1 mb-4">
                            <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
                            <p className="text-sm text-gray-700 mb-1">Category: {product.category}</p>
                            <p className="text-sm text-gray-700 mb-1">Description: {product.description}</p>
                            <p className="text-sm text-gray-700 mb-1">Starting Bid Price: ${product.startingbidprice}</p>
                            <p className="text-sm text-gray-700 mb-1">Current Bid Price: ${product.currentbidprice}</p>
                            <p className="text-sm text-gray-700 mb-1">Duration: {product.durationInMinutes} minutes</p>
                            <p className="text-sm text-gray-700 mb-1">Elapsed Time: {calculateElapsedTime(product.createdAt)}</p>
                            <p className="text-sm text-gray-700 mb-1">Condition: {product.condition}</p>
                            <p className="text-sm text-gray-700 mb-1">Status: {product.status}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserProducts;
