import { Link } from 'react-router-dom'


const Navigation = () => {

  const cartStyle = {
    // background: '#FE5F1E',
    display: 'flex',
    padding: '6px 12px',
    borderRadius: '50px',
  }

  return (
    <>
      <nav className='container bg-[#F8F8F8] max-auto flex items-center justify-between py-4 m-auto'>
        <Link to='/'>
          <img style={{ height: 45 }} src="/images/logo.png" alt="logo" />
        </Link>
        <ul className='flex items-center'>
          <li><Link to='/'>Home</Link></li>
          <li className='ml-6'><Link to='/products'>Products</Link></li>
          <li className='ml-6'><Link to='/register'>SignIn</Link></li>
          <li className='ml-6'><Link to='/login'>Login</Link></li>
          <li className='ml-6'>
            <Link to='/cart'>
              <div className='bg-[#FE5F1E] hover:bg-[#e64e10]' style={cartStyle}>
                <span>10</span>
                <img className='ml-2' src="/images/cart.png" alt="cart-icon" />
              </div>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default Navigation;
