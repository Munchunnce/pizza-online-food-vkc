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
        <div className="bg-[#F8F8F8] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col lg:flex-row items-center lg:items-start p-4 sm:p-6 w-full max-w-5xl mx-auto">
          {/* Product Image with hover zoom */}
          <div className="overflow-hidden rounded-xl mb-6 lg:mb-0">
            <img
              src={product.image}
              alt={product.name}
              className="
          object-cover rounded-xl
          transition-transform duration-500 ease-in-out transform hover:scale-105
          w-[200px] h-[200px]       /* 📱 mobile */
          sm:w-[260px] sm:h-[260px] /* 📲 small tablet */
          md:w-[300px] md:h-[300px] /* 💻 medium screen */
          lg:w-[400px] lg:h-[400px] /* 🖥️ large screen */
          xl:w-[300px] xl:h-[300px] /* 🖥️ big desktop */
        "
            />
          </div>

          {/* Product Info */}
          <div className="lg:ml-10 flex flex-col justify-between text-center lg:text-left w-full lg:w-1/2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                {product.name}
              </h1>
              <p className="text-gray-500 text-md mb-3">{product.size}</p>
              <p className="font-bold text-xl sm:text-2xl mb-6">
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
