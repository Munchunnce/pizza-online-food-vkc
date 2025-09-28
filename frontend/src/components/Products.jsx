import React, { useEffect, useState } from 'react'
import Product from './Product'

const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('/api/products')
         .then(res => res.json())
         .then(products =>
            setProducts(products)
        )
    }, []);
  return (
    <div className='container bg-[#F8F8F8] mx-auto pb-24 px-4'>
        <h1 className='text-xl sm:text-2xl md:text-3xl font-bold my-8 text-center md:text-left'>All Pizza</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 lg:gap-16 justify-items-center'>
        {
            products.map(product => <Product product={product} key={product._id}/>)
        }
      </div>
    </div>
  )
}

export default Products;
