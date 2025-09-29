import './App.css';
import { BrowserRouter, Route, Routes,  } from 'react-router-dom';
import { Provider } from 'react-redux';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Cart from './pages/Cart';
import ProductsPage from './pages/ProductsPage';
import SingleProducts from './pages/SingleProducts';
import store from './store/store';
import Footer from './pages/Footer';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <div className="App flex flex-col min-h-screen">
      <Provider store={store}>
        <BrowserRouter>
        <Navigation/>
          <div className="flex-1">
            <Routes>
              <Route path='/' exact element={<Home/>}></Route>
              <Route path='/register' element={<Register/>}></Route>
              <Route path='/login' element={<Login/>}></Route>
              <Route path='/products' exact element={<ProductsPage/>}></Route>
              <Route path='/products/:_id' element={<SingleProducts/>}></Route>
              <Route path='/cart' element={<ProtectedRoute>
                <Cart/>
              </ProtectedRoute>}></Route>
            </Routes>
          </div>
          <Footer/>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
