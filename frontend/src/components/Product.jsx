import React from 'react'
import { Link } from 'react-router-dom';

const Product = (props) => {
    const { product } = props;
  return (
    <Link to={`/products/${product._id}`}>
      <div>
          <img className="w-59 h-59 object-cover rounded-lg" src={product.image} alt="pizza" />
          <div className='text-center'>
              <h2 className='text-large font-bold py-2'>{product.name}</h2>
              <span className='bg-gray-200 py-1 rounded-full text-sm px-4'>{product.size}</span>
          </div>
          <div className='flex justify-between items-center mt-4'>
              <span className='font-bold'>₹ {product.price}</span>
              <button className='bg-white border border-[#FE5F1E] text-[#FE5F1E] hover:bg-[#FE5F1E] hover:text-white py-1 px-4 rounded-full font-bold cursor-pointer transition-colors duration-200'><span className='mr-4'>+</span>ADD</button>
          </div>
      </div>
    </Link>
  )
}

export default Product;