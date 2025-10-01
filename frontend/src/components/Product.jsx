import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../store/CartSlice";

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const [isAdding, setIsAdding ] = useState(false);

  const handleAdd = (e, product) => {
    e.preventDefault();
    dispatch(addToCart(product));
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);

  };

  return (
    <Link to={`/products/${product._id}`}>
      <div className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition duration-300 flex flex-col">
        {/* Product Image */}
        <div className="overflow-hidden rounded-lg flex justify-center">
          <img
            className="object-cover transform transition-transform duration-300 hover:scale-110 
                       w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 lg:w-52 lg:h-52 xl:w-56 xl:h-56"
            src={product.image}
            alt={product.name}
          />
        </div>

        {/* Product Info */}
        <div className="text-center mt-4 flex-1">
          <h2 className="text-base sm:text-lg md:text-xl font-bold leading-tight">
            {product.name}
          </h2>
          <span className="bg-gray-200 py-1 px-4 rounded-full text-xs sm:text-sm inline-block mt-2">
            {product.size}
          </span>
        </div>

        {/* Price & Button */}
        <div className="flex justify-between items-center mt-4">
          <span className="font-bold text-sm sm:text-base md:text-lg">
            ₹ {product.price}
          </span>
          <button onClick={(e) => handleAdd(e, product)}
           className={`${isAdding ? 'bg-green-500 hover:bg-green-500 text-white' : 'bg-white'} border border-[#FE5F1E] text-[#FE5F1E] hover:bg-[#FE5F1E] hover:text-white py-1 px-3 sm:px-5 rounded-full font-bold cursor-pointer transition-colors duration-200 flex items-center`}>
            <span className="mr-2 text-lg">+</span> ADD{isAdding ? 'ED' : '' }
          </button>
        </div>
      </div>
    </Link>
  );
};

export default Product;