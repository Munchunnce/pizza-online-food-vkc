import React from "react";
import Products from "../components/Products";

const Home = () => {
  return (
    <>
      <div className="hero py-12">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-10">
          {/* LEFT SECTION */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="font-black font-sans leading-tight tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-5xl">
              <span className="block">Super Delicious Pizza in</span>
              <span className="block text-[#FE5F1E] mt-2">Only 45 Minutes!</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl mt-6 text-black max-w-md mx-auto md:mx-0 leading-snug">
              Enjoy a Free Meal if Your Order Takes More Than 45 Minutes!
            </p>

            <button className="px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg text-white font-bold mt-8 bg-[#FE5F1E] hover:bg-[#e64e10] transition duration-300 shadow-md hover:shadow-lg">
              Get your pizza now
            </button>
          </div>

          {/* RIGHT SECTION (IMAGE) */}
          <div className="w-full md:w-1/2 flex justify-center mt-10 md:mt-0">
            <img
              className="w-3/4 sm:w-2/3 md:w-5/6 lg:w-[80%] max-w-[500px] h-auto object-contain transition-transform duration-500 hover:scale-105"
              src="/images/pizza-main.png"
              alt="pizza"
            />
          </div>
        </div>
      </div>

      <div className="pb-15">
        <Products />
      </div>
    </>
  );
};

export default Home;
