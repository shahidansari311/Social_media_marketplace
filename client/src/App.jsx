import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import Home from './pages/Home'
import Marketplace from './pages/Marketplace'
import About from './pages/About'
import Mylisting from './pages/Mylisting'
import Myorders from './pages/Myorders'
import Managelisting from './pages/Managelisting'
import Listingdetails from './pages/Listingdetails'
import Messages from './pages/Messages'
import Loading from './pages/Loading'
import Navbar from './components/Navbar'

const App = () => {

  const {pathname}=useLocation();

  return (
    <div>
      {!pathname.includes('/admin') && <Navbar/>}
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/Marketplace' element={<Marketplace/>}/>
        <Route path='/Mylisting' element={<Mylisting/>}/>
        <Route path='/listing/:listingId' element={<Listingdetails/>}/>
        <Route path='/create-listing' element={<Managelisting/>}/>
        <Route path='/edit-listing/:id' element={<Managelisting/>}/>
        <Route path='/messages' element={<Messages/>}/>
        <Route path='/Myorders' element={<Myorders/>}/>
        <Route path='/loading' element={<Loading/>}/>
        <Route path='/about-us' element={<About/>}/>

      </Routes>
    </div>
  )
}

export default App