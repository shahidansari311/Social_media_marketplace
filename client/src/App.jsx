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
import Chatbox from './components/Chatbox'
import { Toaster } from 'react-hot-toast'
import Layout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import Withdrawal from './pages/admin/Withdrawal'
import AllListings from './pages/admin/AllListings'
import CredentialChange from './pages/admin/CredentialChange'
import CredentialVerify from './pages/admin/CredentialVerify'
import Transaction from './pages/admin/Transactions'

const App = () => {

  const {pathname}=useLocation();

  return (
    <div>
      <Toaster />
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
        <Route path='/admin' element={<Layout/>}>
          <Route index element={<Dashboard/>}/>
          <Route path='verify-credentials' element={<CredentialVerify/>}/>
          <Route path='change-credentials' element={<CredentialChange/>}/>
          <Route path='list-listings' element={<AllListings/>}/>
          <Route path='transactions' element={<Transaction/>}/>
          <Route path='withdrawal' element={<Withdrawal/>}/>
        </Route>
      </Routes>
      <Chatbox/>
    </div>
  )
}

export default App