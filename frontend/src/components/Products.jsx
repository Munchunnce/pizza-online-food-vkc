import React, { useEffect, useState } from "react";
import Product from "./Product";


const Products = () => {
  const [products, setProducts] = useState([]);
  const [filterSize, setFilterSize] = useState("all");
  const [sortPrice, setSortPrice] = useState("default"); // low, high, medium
  const [showFilters, setShowFilters] = useState(false); // toggle filter

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((products) => {
        setProducts(products);
      });
  }, []);

  // Filter logic
  let filteredProducts =
    filterSize === "all"
      ? products
      : products.filter((p) => p.size.toLowerCase() === filterSize);

  if (sortPrice === "low") {
    filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortPrice === "high") {
    filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortPrice === "medium") {
    // Medium price range, example 200-500
    filteredProducts = filteredProducts.filter(
      (p) => p.price >= 200 && p.price <= 500
    );
  }

  return (
    <div className="container bg-[#F8F8F8] mx-auto pb-24 px-4">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold my-8 text-center md:text-left">
        <em>All Pizza</em>
      </h1>
      {/* 🔥 Toggle Filter Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-[#FE5F1E] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#e64e10] transition duration-300 cursor-pointer"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>
      {/* 🔥 Filters Section */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        {/* Size Filter */}
        <div className="flex gap-2 flex-wrap">
          {["all", "small", "medium", "large"].map((size) => (
            <button
              key={size}
              onClick={() => setFilterSize(size)}
              className={`px-4 py-2 rounded-full border font-semibold transition duration-300 cursor-pointer
                ${
                  filterSize === size
                    ? "bg-[#FE5F1E] text-white border-[#FE5F1E]"
                    : "bg-white text-[#FE5F1E] border-[#FE5F1E]"
                }`}
            >
              {size.charAt(0).toUpperCase() + size.slice(1)}
            </button>
          ))}
        </div>

        {/* Price Filter */}
        <div className="flex gap-2 flex-wrap">
          {["default", "low", "medium", "high"].map((sort) => (
            <button
              key={sort}
              onClick={() => setSortPrice(sort)}
              className={`px-4 py-2 rounded-full border font-semibold transition duration-300 cursor-pointer
                ${
                  sortPrice === sort
                    ? "bg-[#FE5F1E] text-white border-[#FE5F1E]"
                    : "bg-white text-[#FE5F1E] border-[#FE5F1E]"
                }`}
            >
              {sort === "default"
                ? "Price"
                : sort === "low"
                ? "Low → High"
                : sort === "high"
                ? "High → Low"
                : "Medium Range"}
            </button>
          ))}
        </div>
      </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 lg:gap-16 justify-items-center">
        {
          // products.map(product => <Product product={product} key={product._id}/>)
          filteredProducts.map((product) => (
            <Product key={product._id} product={product} />
          ))
        }
      </div>
    </div>
  );
};

export default Products;
