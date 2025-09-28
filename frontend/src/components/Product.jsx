import React from "react";
import { Link } from "react-router-dom";

const Product = ({ product }) => {
  return (
    <Link to={`/products/${product._id}`}>
      <div className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition duration-300">
        {/* Product Image */}
        <div className="overflow-hidden rounded-lg">
          <img
            className="w-full h-48 sm:h-56 md:h-64 object-cover transform transition-transform duration-300 hover:scale-110"
            src={product.image}
            alt={product.name}
          />
        </div>

        {/* Product Info */}
        <div className="text-center mt-3">
          <h2 className="text-lg sm:text-xl font-bold">{product.name}</h2>
          <span className="bg-gray-200 py-1 px-4 rounded-full text-xs sm:text-sm inline-block mt-2">
            {product.size}
          </span>
        </div>

        {/* Price & Button */}
        <div className="flex justify-between items-center mt-4">
          <span className="font-bold text-base sm:text-lg">
            ₹ {product.price}
          </span>
          <button className="bg-white border border-[#FE5F1E] text-[#FE5F1E] hover:bg-[#FE5F1E] hover:text-white py-1 px-4 sm:px-6 rounded-full font-bold cursor-pointer transition-colors duration-200 flex items-center">
            <span className="mr-2 text-lg">+</span> ADD
          </button>
        </div>
      </div>
    </Link>
  );
};

export default Product;
