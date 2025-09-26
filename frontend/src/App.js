import './App.css';
import { BrowserRouter, Route, Routes,  } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navigation/>
        <Routes>
          <Route path='/' exact element={<Home/>}></Route>
          {/* <Route path='/cart' element={<Cart/>}></Route> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
