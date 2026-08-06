import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ListingCard from './ListingCard'

const Latestlisting = () => {
    const navigate = useNavigate();

  // const {listings}=useSelector(state=> state.listing)
const listings = useSelector(state => state.listing?.listings) || [];
  return (
    <div className='mt-24 mb-16 px-6 md:px-16 lg:px-24'>
        <div className='flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6'>
            <div className='space-y-4'>
                <h2 className='text-4xl md:text-5xl font-black text-gray-900'>Newest <span className='premium-text-gradient'>Drops</span></h2>
                <p className='text-gray-500 font-medium max-w-md'>The freshest social assets added to our ultra-secure marketplace in the last 24 hours.</p>
            </div>
            <button onClick={() => navigate('/Marketplace')} className='group flex items-center gap-2 text-brand-600 font-bold hover:gap-3 transition-all'>
                View Marketplace <ArrowRight className='size-4'/>
            </button>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
            {listings.slice(0, 4).map((listing, index) => (
                <ListingCard key={index} listing={listing} />
            ))}
        </div>
    </div>
  )
}

export default Latestlisting