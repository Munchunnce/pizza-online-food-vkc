import React, { useState } from "react";
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Both fields are required!");
      return;
    }

    setError("");
    console.log("Login Submitted:", formData);

    // Yaha API call karni ho to fetch/axios ka use kar sakte ho
    // Example:
    // fetch("/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(formData),
    // })
    //   .then((res) => res.json())
    //   .then((data) => console.log(data))
    //   .catch((err) => setError("Something went wrong!"));
  };

  return (
    <div>
      <section className="login flex justify-center pt-24">
        <div className="w-full max-w-xs">
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            {error && <span className="text-red-500 text-sm">{error}</span>}

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="******************"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                className="btn-primary rounded-full text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Log In
              </button>
              <Link
                className="inline-block align-baseline font-bold text-sm"
                to="/register"
              >
                Don't have account?
              </Link>
            </div>
          </form>
          <p className="text-center text-gray-500 text-xs">
            &copy;2025 Vimal's Gyan. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Login;
