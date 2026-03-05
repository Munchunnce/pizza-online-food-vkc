import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return alert("Please enter your email!");
    // Backend API call can go here
    alert(`Subscribed successfully with ${email}!`);
    setEmail("");
  };

  
  return (
    <footer className="bg-[#1F1F1F] text-white py-16 mt-12">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 lg:gap-0">

        {/* Logo & About */}
        <div className="lg:w-1/3">
          <h1 className="text-2xl font-bold text-[#FE5F1E]">@Vimal</h1>
          <p className="mt-2 text-gray-400">
            Fresh, hot & delicious pizzas delivered to your doorstep. Join our newsletter for updates & offers!
          </p>
        </div>

        {/* Quick Links */}
        <div className="lg:w-1/3">
          <h2 className="text-xl font-bold mb-4">Quick Links</h2>
          <div className="flex flex-col space-y-2 text-gray-300">
            <Link to="/" className="hover:text-[#FE5F1E] transition duration-300">Home</Link>
            <Link to="/products" className="hover:text-[#FE5F1E] transition duration-300">Products</Link>
            <Link to="/cart" className="hover:text-[#FE5F1E] transition duration-300">Cart</Link>
            <Link to="/login" className="hover:text-[#FE5F1E] transition duration-300">Login</Link>
          </div>
        </div>

        {/* Newsletter + Social Links */}
        <div className="lg:w-1/3 flex flex-col space-y-6">
          {/* Newsletter */}
          <div>
            <h2 className="text-xl font-bold mb-4">Newsletter</h2>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 rounded-l-full rounded-r-full sm:rounded-r-none w-full sm:w-auto flex-1 border border-gray-600 text-black focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#FE5F1E] hover:bg-[#e64e10] text-white px-6 py-2 rounded-full font-bold transition duration-300 cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Social Links */}
          <div>
            <h2 className="text-xl font-bold mb-4">Follow Us</h2>
            <div className="flex space-x-4">
              {/* <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-[#FE5F1E] transition duration-300">Facebook</a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-[#FE5F1E] transition duration-300">Instagram</a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-[#FE5F1E] transition duration-300">Twitter</a> */}
              <a href="https://www.linkedin.com/in/vimal-kumar-chaudhary-7890961a6/" target="_blank" rel="noopener noreferrer" className="hover:text-[#FE5F1E] transition duration-300">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="mt-16 text-center text-gray-500 text-sm border-t border-gray-700 pt-6">
        © {new Date().getFullYear()} @Vimal. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
