import React from 'react'
import Products from '../components/Products';


const Home = () => {
  return (
    <>
      <div className='hero py-12'>
        <div className="container mx-auto flex items-center justify-between pl-10">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h6 className="text-base sm:text-lg md:text-xl"><em>Are you hungry?</em></h6>
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mt-2">Don't wait !</h1>
            <button className="px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base md:text-lg text-white font-bold mt-4 bg-[#FE5F1E] hover:bg-[#e64e10] transition duration-300">Order Now</button>
          </div>
          <div className="w-1/2">
            <img className="w-3/4 md:w-11/12 lg:w-medium" src="/images/pizza-main.png" alt="pizza" />
          </div>
        </div>
      </div>
      <div className="pb-15">
        <Products />
      </div>
    </>  
  )
}

export default Home
