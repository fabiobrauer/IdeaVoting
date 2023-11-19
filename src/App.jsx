

import './App.css'
import Register from './pages/register'
import Login from './pages/login'
import Homepage from './pages/Homepage'
import { Routes, Route, Link } from 'react-router-dom'


function App() {


  return (
    <>
    <nav>
      <li><Link to={'/'}>home</Link></li>
      <li><Link to={'/Login'}>Login</Link></li>
      <li><Link to={'/Register'}>Register</Link></li>
    </nav>
    <Routes>

      <Route path='/' element={<Homepage></Homepage>}></Route>
      <Route path='/Login' element={<Login></Login>}></Route>
      <Route path='/Register' element={<Register></Register>}></Route>

    </Routes>
    </>
  )
}

export default App
