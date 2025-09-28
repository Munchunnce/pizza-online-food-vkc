import { Link } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const items = useSelector((state) => state.cart.totalItems);

  const cartStyle = {
    display: "flex",
    padding: "6px 12px",
    borderRadius: "50px",
  };

  return (
    <nav className="container bg-[#F8F8F8] mx-auto flex items-center justify-between py-4 px-4 md:px-8">
      {/* Logo */}
      <Link to="/">
        <img style={{ height: 45 }} src="/images/logo.png" alt="logo" />
      </Link>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden block text-2xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* Links */}
      <ul
        className={`md:flex items-center md:space-x-6 absolute md:static bg-[#F8F8F8] left-0 w-full md:w-auto transition-all duration-300 ease-in-out ${
          isOpen ? "top-16" : "top-[-400px]"
        }`}
      >
        <li className="py-2 md:py-0 text-center">
          <Link to="/" className="hover:text-[#e64e10]">
            Home
          </Link>
        </li>
        <li className="py-2 md:py-0 text-center">
          <Link to="/products" className="hover:text-[#e64e10]">
            Products
          </Link>
        </li>
        <li className="py-2 md:py-0 text-center">
          <Link to="/register" className="hover:text-[#e64e10]">
            Register
          </Link>
        </li>
        <li className="py-2 md:py-0 text-center">
          <Link to="/login" className="hover:text-[#e64e10]">
            Login
          </Link>
        </li>
        <li className="py-2 md:py-0 text-center">
          <Link to="/cart">
            <div
              className="bg-[#FE5F1E] hover:bg-[#e64e10] inline-flex items-center justify-center"
              style={cartStyle}
            >
              <span className="text-white">{items}</span>
              <img className="ml-2" src="/images/cart.png" alt="cart-icon" />
            </div>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
