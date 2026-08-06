import { ArrowLeftIcon, FilterIcon, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom'
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
  const listings = useSelector(state => state.listing?.listings) ?? [];
  const [searchParams]=useSearchParams();
  const search=searchParams.get("search");

  const filterlisting = listings.filter((listing) => {
    if(filters.platform && filters.platform.length > 0) {
        if(!filters.platform.includes(listing.platform)) return false;
    }
    if(filters.maxPrice && listing.price > filters.maxPrice) return false;
    if(filters.minFollowers && listing.followers_count < filters.minFollowers) return false;
    if(filters.niche && filters.niche.length > 0) {
        if(!filters.niche.includes(listing.niche)) return false;
    }
    if(filters.verified && listing.verified !== filters.verified) return false;
    if(filters.monetized && listing.monetized !== filters.monetized) return false;

    if(search) {
      const trimed = search.trim().toLowerCase();
      if(
        !listing.title.toLowerCase().includes(trimed) &&
        !listing.username.toLowerCase().includes(trimed) &&
        !listing.description.toLowerCase().includes(trimed) &&
        !listing.platform.toLowerCase().includes(trimed) &&
        !listing.niche.toLowerCase().includes(trimed)
      ) return false;
    }
    return true;
  });

  return (
    <div className='min-h-screen pt-28 px-6 md:px-16 lg:px-24 xl:px-40 pb-20'>
      
      {/* Header Section */}
      <div className='flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8'>
        <div className='space-y-4'>
            <div className='flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest'>
                <Sparkles className='size-3.5 text-brand-500 fill-brand-500' />
                Live Marketplace
            </div>
            <h1 className='text-4xl md:text-6xl font-black text-gray-900 tracking-tight'>
                Finding your <br/> perfect <span className='premium-text-gradient'>Audience.</span>
            </h1>
        </div>
        
        <div className='flex items-center gap-4'>
            <button 
                onClick={() => { setPhone(true); }}
                className='sm:hidden flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl font-bold text-gray-600 shadow-sm overflow-hidden relative group'
            >
              <FilterIcon className='size-4'/>
              Filters
            </button>
            <div className='hidden sm:flex bg-gray-100/50 p-1 rounded-2xl border border-gray-100'>
                <button className='px-6 py-2 rounded-xl bg-white shadow-sm text-sm font-bold text-brand-600'>List View</button>
                <button className='px-6 py-2 rounded-xl text-sm font-bold text-gray-400 hover:text-gray-600'>Grid View</button>
            </div>
        </div>
      </div>

      <div className='relative flex flex-col lg:flex-row items-start gap-12'>
        {/* Sidebar Filters */}
        <aside className='lg:w-80 w-full sticky top-32'>
            <Filterbox filters={filters} setFilters={setFilters} phone={phone} setPhone={setPhone}/>
        </aside>
        
        {/* Listings Grid */}
        <div className='flex-1 w-full'>
            {filterlisting.length > 0 ? (
                <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
                    {filterlisting.sort((a,b)=>a.featured ? -1 : b.featured ? 1 : 0).map((listing,index)=>(
                        <ListingCard listing={listing} key={index}/>
                    ))}
                </div>
            ) : (
                <div className='flex flex-col items-center justify-center py-32 glass-card rounded-[3rem] text-center border-dashed border-2 border-gray-200'>
                    <div className='p-6 bg-gray-50 rounded-full mb-6'>
                        <FilterIcon className='size-12 text-gray-200' />
                    </div>
                    <h3 className='text-2xl font-black text-gray-900 mb-2'>No matching accounts</h3>
                    <p className='text-gray-400 font-medium max-w-xs mx-auto'>Try adjusting your filters or search terms to find what you're looking for.</p>
                    <button 
                        onClick={() => setFilters({
                            platform:null, maxPrice:1000000, minFollowers:0, niche:null, verified:false, monetized:false
                        })}
                        className='mt-8 text-brand-600 font-black text-sm uppercase tracking-widest hover:tracking-[0.2em] transition-all'
                    >
                        Reset All Filters
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* Footer Branding */}
      <div className='mt-32 pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6'>
        <p className='text-xs font-bold text-gray-400 uppercase tracking-widest'>&copy; 2026 SocialBazar Engine Environment</p>
        <div className='flex gap-8'>
            <a href="#" className='text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-brand-600 transition'>Terms</a>
            <a href="#" className='text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-brand-600 transition'>Privacy</a>
            <a href="#" className='text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-brand-600 transition'>Security</a>
        </div>
      </div>
    </div>
  )
}

export default Marketplace