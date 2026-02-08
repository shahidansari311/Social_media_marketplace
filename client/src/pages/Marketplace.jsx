import { ArrowLeftIcon, FilterIcon, Verified } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom'
import ListingCard from '../components/ListingCard';
import Filterbox from '../components/Filterbox';

const Marketplace = () => {

  const [phone,setPhone]=useState(false);
  const [filters,setFilters]=useState({
    platform:null,
    maxPrice:1000000,
    minFollowers:0,
    niche:null,
    verified:false,
    monetized:false,
  });
  const navigate =useNavigate();
  const {listings}=useSelector(state=> state.listing)
  const [searchParams]=useSearchParams();
  const search=searchParams.get("search");
  const filterlisting=listings.filter((listing)=>{
    
    if(filters.platform && filters.platform.length>0){
        if(!filters.platform.includes(listing.platform)) return false;
    }
    
    if(filters.maxPrice){
        if(listing.price > filters.maxPrice) return false;
    }
    
    if(filters.minFollowers){
        if(listing.followers_count < filters.minFollowers) return false;
    }
    
    if(filters.niche && filters.niche.length >0 ){
        if(!filters.niche.includes(listing.niche)) return false;
    }
    
    if(filters.verified && listing.verified!==filters.verified) return false;
    
    if(filters.monetized && listing.monetized!==filters.monetized) return false;

    if(search){
      const trimed=search.trim();
      if(
        !listing.title.toLowerCase().includes(trimed.toLowerCase()) &&
        !listing.username.toLowerCase().includes(trimed.toLowerCase()) &&
        !listing.description.toLowerCase().includes(trimed.toLowerCase()) &&
        !listing.platform.toLowerCase().includes(trimed.toLowerCase()) &&
        !listing.niche.toLowerCase().includes(trimed.toLowerCase())
      )
      return false;
    }

    return true
  })

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32'>

      <div className='flex items-center justify-between text-slate-500 '>
        <button onClick={()=>{navigate('/');
          window.scrollTo(0,0);
        }}
        className='flex items-center gap-2 py-5'>
          <ArrowLeftIcon className='size-4'/>
          Back to Home
        </button>
        <button className='flex items-center gap-2 py-5 sm:hidden'
        onClick={()=>{
            setPhone(true);
        }}>
          <FilterIcon className='size-4'/>
          Filters
        </button>
      </div>
      <div className='relative flex items-start justify-between gap-8 pb-8'>
        
        <Filterbox filters={filters} setFilters={setFilters} phone={phone} setPhone={setPhone}/>
        
        <div className='flex-1 grid xl:grid-cols-2 gap-4'>
          {filterlisting.sort((a,b)=>a.featured ? -1 : b.featured ? 1 : 0).map((listing,index)=>(
            <ListingCard listing={listing} key={index}/>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Marketplace