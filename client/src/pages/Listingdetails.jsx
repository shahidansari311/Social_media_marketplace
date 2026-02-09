import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProfileLink, platformIcons } from '../assets/assets';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeftIcon, ArrowUpRightFromSquareIcon, CheckCircle2, DollarSign, Loader2Icon } from 'lucide-react';

const Listingdetails = () => {

  const navigate = useNavigate();
  const currency  = import.meta.env.VITE_CURRENCY || '$';

  const [listing, setListinging] = useState(null);
  const profileLink = listing && getProfileLink(listing.platform, listing.username);

  const { listingId } = useParams();
  const { listings } = useSelector((state) => state.listing);
  // console.log('listingId:', listingId);
  // console.log('listings:', listings);


  useEffect(() => {
  if (!listings || listings.length === 0) return;

  const foundListing = listings.find(
    (item) => item.id === listingId
  );

  if (foundListing) {
    setListinging(foundListing);
  }
}, [listings, listingId]);


  return listing ? (
    <div className='mx-auto min-h-screen px-6 md:px-16 lg:px-24 xl:px-32'>
      <button className='flex items-center gap-2 text-slate-600 py-5'
        onClick={() => navigate(-1)}>
        <ArrowLeftIcon className='size-4' /> Go to Previous page
      </button>

      <div className='flex items-start max-md:flex-col gap-10'>
        <div className='flex-1 max-md:w-full'>
          {/* Top section */}
          <div className='b-white rounded-xl border boredr-gray-200 p-6 mb-5'>
            <div className='flex items-start gap-3'>
              <div className='p-2 rounded-xl'>{platformIcons[listing.platform]}</div>
              <div className=''>
                <h2 className='flex items-center gap-2 text-xl font-semibold text-gray-800'>{listing.title}
                  <Link target="_blank" to={profileLink}>
                    <ArrowUpRightFromSquareIcon className='size-4 hover:text-indigo-500' />
                  </Link>
                </h2>
                <p className='text-gray-500 text-sm'>
                  @{listing.username} . {listing.platform?.charAt(0).toUpperCase() + listing.platform?.slice(1)}
                </p>
                <div className='flex gap-2 mt-2'>
                    {listing.verified && (
                      <span className='flex items-center text-xs bg-indigo-50 text-indigo-600 px-6 py-1 rounded-md'>
                        <CheckCircle2 className='w-3 h-3 mr-1'/>
                        Verified
                      </span>
                    )}
                    {listing.monetized && (
                      <span className='flex items-center text-xs bg-green-50 text-green-600 px-6 py-1 rounded-md'>
                        <DollarSign className='w-3 h-3 mr-1'/>
                        Monetized
                      </span>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seller info and purchase option */}
        <div>

        </div>
      </div>
    </div>
  ) : (
    <div className='h-screen flex justify-center items-center'>
      <Loader2Icon className='size-7 animate-spin text-indigo-600' />
    </div>
  )
}

export default Listingdetails