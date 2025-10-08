import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/CartSlice";
import Toast from "../components/Toast/Toast";

const SingleProducts = () => {
  const [product, setProduct] = useState({});
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [toast, setToast] = useState(null); //  Toast info

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart(product));
    setToast({ message: `🛒 added to cart!`, type: "success" });
  };

  useEffect(() => {
    fetch(`/api/products/${params._id}`)
      .then((res) => res.json())
      .then((product) => {
        setProduct(product);
      });
  }, [params._id]);
  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="container mx-auto mt-9 p-4 sm:p-6">
        {/* Back Button */}
        <div className="mb-6 flex justify-start">
          <button
            onClick={() => navigate("/")}
            className="bg-white border border-[#FE5F1E] text-[#FE5F1E] hover:bg-[#FE5F1E] hover:text-white py-2 px-6 rounded-full font-bold cursor-pointer transition-colors duration-200"
          >
            Back
          </button>
        </div>

        {/* Product Card */}
        <div className="bg-[#F8F8F8] rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col lg:flex-row items-center lg:items-start p-4 sm:p-6 w-full max-w-5xl mx-auto">
          {/* Product Image with hover zoom */}
          <div className="overflow-hidden rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-70 h-70 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-70 lg:h-70 object-cover transition-transform duration-500 ease-in-out transform hover:scale-105"
            />
          </div>

          {/* Product Info */}
          <div className="lg:ml-8 flex flex-col justify-between text-center lg:text-left w-full lg:w-1/2 mt-4 lg:mt-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold mb-2">
                {product.name}
              </h1>
              <p className="text-gray-500 text-md mb-4">{product.size}</p>
              <p className="font-bold text-lg sm:text-xl mb-6">
                ₹ {product.price}
              </p>
            </div>

            <button
              onClick={handleAddToCart}
              className="mx-auto lg:mx-0 bg-white border border-[#FE5F1E] text-[#FE5F1E] hover:bg-[#FE5F1E] hover:text-white py-2 px-6 rounded-full font-bold cursor-pointer transition-colors duration-200"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleProducts;
