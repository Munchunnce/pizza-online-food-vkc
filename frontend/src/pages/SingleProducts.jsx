import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { addToCart } from "../store/CartSlice";
import Toast from '../components/Toast/Toast';


const SingleProducts = () => {
    const [product, setProduct] = useState({});
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [toast, setToast] = useState(null); //  Toast info

const handleAddToCart = (e) => {
  e.preventDefault();
  dispatch(addToCart(product));
  setToast({ message: `🛒 added to cart!`, type: 'success' });
};


    useEffect(() => {
        fetch(`/api/products/${params._id}`)
        .then(res => res.json())
        .then(product => {
            setProduct(product);
        })
    }, [params._id]);
  return (
    <>
      { toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )

      }
      <div className='container mx-auto mt-12'>
        <button onClick={() => navigate('/')} className='mb-12 bg-white border border-[#FE5F1E] text-[#FE5F1E] hover:bg-[#FE5F1E] hover:text-white py-1 px-4 rounded-full font-bold cursor-pointer transition-colors duration-200'>Back</button>
        <div className='flex justify-center'>
          <img className="w-80 h-80 object-cover rounded-lg" src={product.image} alt="pizza" />
          <div className='ml-16'>
            <h1 className='text-xl font-bold'>{product.name}</h1>
            <div className='text-md text-gray-500'>{product.size}</div>
            <div className='font-bold mt-2'>₹ {product.price}</div>
            <button onClick={handleAddToCart} className='bg-white border border-[#FE5F1E] text-[#FE5F1E] hover:bg-[#FE5F1E] hover:text-white py-1 px-4 mt-4 rounded-full font-bold cursor-pointer transition-colors duration-200'>Add to cart</button>
          </div>
        </div>
      </div>  
    </>   
  )
}

export default SingleProducts;
