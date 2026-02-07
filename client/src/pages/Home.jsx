import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Latestlisting from '../components/Latestlisting'
import Plans from '../components/Plans'
import CTA from '../components/CTA'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
      <Hero/>
      <Latestlisting/>
      <Plans/>
      <CTA/>
      <Footer/>
    </div>
  )
}

export default Home