import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProfileLink, platformIcons } from '../assets/assets';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeftIcon, ArrowUpRightFromSquareIcon, Calendar,BadgeCheck, CheckCircle2, ChevronLeft, ChevronLeftIcon, ChevronRightIcon, DollarSign, EyeIcon, LineChart, Loader2Icon, MapPin, MessageSquareMoreIcon, ShoppingBagIcon, Users } from 'lucide-react';
import { setChat } from '../app/features/chatSlice';
import { useAuth, useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import api from '../config/axios';
import { getAllPublicListing } from '../app/features/listingSlice';

const Listingdetails = () => {
  const {user,isLoaded}=useUser();
  const {getToken}=useAuth();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { listingId } = useParams();
  const { listings } = useSelector((state) => state.listing);
  const listing = React.useMemo(() => listings?.find((item) => item.id === listingId), [listings, listingId]);
  const profileLink = listing && getProfileLink(listing.platform, listing.username);
  const [curr, setCurr] = useState(0);
  const images = listing?.images || [];

  const prevSlide = () => {
    setCurr((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurr((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (!listings || listings.length === 0) {
      dispatch(getAllPublicListing());
    }
  }, [listings, dispatch]);

  const purchaseaccount = async () => {
    if (!user || !isLoaded) return toast("Please login to purchase");
    if (user.id === listing.ownerId) return toast("You cannot purchase your own listing");

    try {
      toast.loading('Processing purchase...');
      const token = await getToken();
      const { data } = await api.post(`/api/listing/purchase-account/${listingId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.dismissAll();
      
      if (data.paymentLink) {
        window.location.href = data.paymentLink;
      } else {
        toast.success(data.message || "Purchase initiated");
        // Refresh listing data or navigate
        dispatch(getAllPublicListing());
        navigate('/Myorders');
      }
    } catch (error) {
      toast.dismissAll();
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  }

  const chatnow = () => {
    if(!user || !isLoaded) return toast("PLease login to chat with user");
    if(user.id === listing.ownerId) return toast("You can't chat with your own listing");
    dispatch(setChat({ listing: listing }));
  }

  const currency = import.meta.env.VITE_CURRENCY || '$';


  return listing ? (
    <div className='mx-auto min-h-screen px-6 md:px-16 lg:px-24 xl:px-40 pt-24 pb-20'>
      <div className='flex items-center justify-between py-6'>
        <button className='flex items-center gap-2 text-slate-500 hover:text-brand-600 transition'
          onClick={() => navigate(-1)}>
          <ArrowLeftIcon className='size-4' /> Go Back
        </button>
      </div>

      <div className='flex items-start max-md:flex-col gap-10'>
        <div className='flex-1 max-md:w-full space-y-6'>
          {/* Top section */}
          <div className='glass-card rounded-3xl p-8 card-hover'>
            <div className='flex items-start gap-5 flex-col md:flex-row'>
              <div className='p-4 bg-brand-50 rounded-2xl'>{platformIcons[listing.platform]}</div>
              <div className='flex-1'>
                <div className='flex items-center gap-2 flex-wrap'>
                    <h2 className='text-3xl font-bold text-gray-900 leading-tight'>{listing.title}</h2>
                    <Link target="_blank" to={profileLink} className='p-2 hover:bg-brand-50 rounded-full transition text-gray-400 hover:text-brand-600'>
                        <ArrowUpRightFromSquareIcon className='size-5' />
                    </Link>
                </div>
                <p className='text-gray-500 font-medium mt-1'>
                  @{listing.username} <span className='mx-2 opacity-30'>•</span> {listing.platform?.charAt(0).toUpperCase() + listing.platform?.slice(1)}
                </p>
                <div className='flex gap-3 mt-4'>
                  {listing.verified && (
                    <span className='flex items-center text-xs font-bold bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full border border-indigo-100 uppercase tracking-wider'>
                      <CheckCircle2 className='w-3.5 h-3.5 mr-1.5' />
                      Verified
                    </span>
                  )}
                  {listing.monetized && (
                    <span className='flex items-center text-xs font-bold bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full border border-emerald-100 uppercase tracking-wider'>
                      <DollarSign className='w-3.5 h-3.5 mr-0.5' />
                      Monetized
                    </span>
                  )}
                </div>
              </div>

              <div className='md:text-right mt-4 md:mt-0'>
                <h3 className='text-4xl font-extrabold premium-text-gradient'>
                  {currency}
                  {listing.price?.toLocaleString()}
                </h3>
                <p className='text-sm text-gray-400 font-medium mt-1 uppercase tracking-widest'>
                  Listing Price
                </p>
              </div>
            </div>
          </div>

          {/* Screenshot Section  */}
          {images?.length > 0 && (
            <div className='glass-card rounded-3xl overflow-hidden card-hover'>
              <div className='p-6 border-b border-gray-100/50 flex justify-between items-center'>
                <h4 className='font-bold text-gray-900'>Platform Statistics & Proof</h4>
                <div className='text-xs font-bold text-gray-400 uppercase tracking-tighter'>
                    {curr + 1} / {images.length}
                </div>
              </div>
              {/* Slider container */}
              <div className='relative w-full aspect-video overflow-hidden bg-gray-50'>
                <div className='flex transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]' style={{ transform: ` translateX(-${curr * 100}%)` }}>
                  {images.map((img, index) => (
                    <img key={index} src={img} alt="listing proof" className='w-full shrink-0 object-cover' />
                  ))}
                </div>
                {/* Navigation button  */}
                <button className='absolute left-5 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg backdrop-blur hover:scale-110 active:scale-95 transition cursor-pointer z-10' onClick={prevSlide}>
                  <ChevronLeftIcon className='w-6 h-6 text-gray-800' />
                </button>
                <button onClick={nextSlide} className='absolute right-5 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg backdrop-blur hover:scale-110 active:scale-95 transition cursor-pointer z-10'>
                  <ChevronRightIcon className='w-6 h-6 text-gray-800' />
                </button>

                {/* Dots indicator */}
                <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/20 backdrop-blur-md px-3 py-2 rounded-full'>
                  {images.map((_, index) => (
                    <button onClick={() => setCurr(index)}
                      key={index}
                      className={`h-1.5 transition-all duration-300 rounded-full ${curr === index ? "w-6 bg-white" : "w-1.5 bg-white/50"}`} />
                  ))}
                </div>
              </div>
            </div>
          )}


          {/* Account Metrics */}
          <div className='glass-card rounded-3xl overflow-hidden card-hover'>
            <div className='p-6 border-b border-gray-100/50'>
              <h4 className='font-bold text-gray-900'>Deep Account Insights</h4>
            </div>
            <div className='grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 p-8 text-center'>
              <div className='px-4'>
                <Users className='mx-auto text-brand-500 w-6 h-6 mb-3 opacity-80' />
                <p className='text-2xl font-bold text-gray-900'>{listing.followers_count?.toLocaleString()}</p>
                <p className='text-xs font-bold text-gray-400 uppercase mt-1'>Audience</p>
              </div>
              <div className='px-4'>
                <LineChart className='mx-auto text-brand-500 w-6 h-6 mb-3 opacity-80' />
                <p className='text-2xl font-bold text-gray-900'>{listing.engagement_rate?.toLocaleString()}%</p>
                <p className='text-xs font-bold text-gray-400 uppercase mt-1'>Engagement</p>
              </div>
              <div className='px-4'>
                <EyeIcon className='mx-auto text-brand-500 w-6 h-6 mb-3 opacity-80' />
                <p className='text-2xl font-bold text-gray-900'>{listing.monthly_views?.toLocaleString()}</p>
                <p className='text-xs font-bold text-gray-400 uppercase mt-1'>Views / Mo</p>
              </div>
              <div className='px-4'>
                <Calendar className='mx-auto text-brand-500 w-6 h-6 mb-3 opacity-80' />
                <p className='text-2xl font-bold text-gray-900'>
                  {new Date(listing.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
                <p className='text-xs font-bold text-gray-400 uppercase mt-1'>Listed since</p>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Description */}
            <div className='glass-card rounded-3xl card-hover'>
                <div className='p-6 border-b border-gray-100/50'>
                <h4 className='font-bold text-gray-900'>Seller's Note</h4>
                </div>
                <div className='p-6 text-gray-600 leading-relaxed text-sm'>
                {listing.description || "No description provided."}
                </div>
            </div>

            {/* Additional details */}
            <div className='glass-card rounded-3xl card-hover'>
                <div className='p-6 border-b border-gray-100/50'>
                <h4 className='font-bold text-gray-900'>Technical Artifacts</h4>
                </div>
                <div className='grid grid-cols-2 gap-y-6 gap-x-4 p-6 text-sm'>
                <div>
                    <p className='text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-1'>Audit Niche</p>
                    <p className='font-bold text-gray-900 capitalize text-base'>{listing.niche}</p>
                </div>
                <div>
                    <p className='text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-1'>Primary GEO</p>
                    <p className='font-bold text-gray-900 flex items-center text-base'>
                    <MapPin className='size-3.5 text-brand-500 mr-1.5' />{listing.country}</p>
                </div>
                <div>
                    <p className='text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-1'>Demographics</p>
                    <p className='font-bold text-gray-900 text-base'>{listing.age_range}</p>
                </div>
                <div>
                    <p className='text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-1'>Sync Status</p>
                    <p className='font-bold text-gray-900 text-base'>
                    {listing.platformAssured ? "Platform Verified" : "Direct Listing"}</p>
                </div>
                </div>
            </div>
          </div>
        </div>

        {/* Seller info and purchase option */}
        <div className='w-full md:w-[400px] space-y-6 sticky top-6'>
            <div className='glass-card rounded-3xl p-8 card-hover overflow-hidden relative'>
                <div className='absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full -translate-y-16 translate-x-16'></div>
                <h4 className='font-bold text-gray-900 mb-6'>Purchase Decision</h4>
                <div className='flex items-center gap-4 mb-8 p-4 rounded-2xl bg-gray-50/50'>
                    <div className='relative'>
                        <img src={listing.owner?.image} alt="Seller image" className='size-14 rounded-2xl object-cover ring-4 ring-white shadow-sm' />
                        <div className='absolute -bottom-1 -right-1 size-5 bg-green-500 border-2 border-white rounded-full'></div>
                    </div>
                    <div>
                    <p className='font-bold text-gray-900'>{listing.owner?.name}</p>
                    <p className='text-xs text-brand-600 font-bold uppercase tracking-tighter mt-0.5'>Pro Seller</p>
                    </div>
                </div>
                
                <div className='space-y-3 mb-8 text-sm'>
                    <div className='flex justify-between text-gray-500'>
                        <span>Profile Transfer</span>
                        <span className='font-bold text-gray-900'>Instant</span>
                    </div>
                    <div className='flex justify-between text-gray-500'>
                        <span>Escrow Protected</span>
                        <span className='font-bold text-gray-900 text-emerald-600 flex items-center'>Yes <CheckCircle2 className='size-3 ml-1'/></span>
                    </div>
                </div>

                <div className='space-y-4'>
                    <button onClick={chatnow}
                        className='w-full py-4 rounded-2xl bg-white border-2 border-brand-100 text-brand-600 hover:bg-brand-50 transition font-bold flex items-center justify-center gap-2.5'>
                        <MessageSquareMoreIcon className='size-5' /> Open Negotiation
                    </button>
                    {listing.isCredentialChanged && (
                        <button onClick={purchaseaccount} className='w-full premium-gradient text-white py-4 rounded-2xl shadow-xl shadow-brand-500/20 hover:shadow-brand-500/40 transition font-bold flex items-center justify-center gap-2.5'>
                        <ShoppingBagIcon className='size-5' /> Buy Account Now
                        </button>
                    )}
                </div>
                
                <p className='text-[10px] text-gray-400 text-center mt-6 font-medium'>
                    Protected by SocialBazar Anti-Fraud Protection. Terms and conditions apply.
                </p>
            </div>
            
            {/* Safety badge */}
            <div className='p-6 bg-brand-50 rounded-3xl border border-brand-100 flex items-start gap-3'>
                <div className='p-2 bg-brand-100 rounded-xl text-brand-600'>
                    <BadgeCheck className='size-5'/>
                </div>
                <div>
                    <p className='text-sm font-bold text-gray-900 mb-1'>Verified Seller Guarantee</p>
                    <p className='text-xs text-gray-500 leading-relaxed font-medium'>This account has passed our preliminary verification checks for followers and engagement authenticity.</p>
                </div>
            </div>
        </div>
      </div>

      {/* Footer */}
      <div className='mt-20 pt-10 border-t border-gray-100 text-center'>
        <p className='text-xs font-bold text-gray-400 uppercase tracking-widest'>&copy; 2026 SocialBazar by Shahid Ansari</p>
      </div>
    </div>
  ) : (
    <div className='h-screen flex justify-center items-center'>
      <Loader2Icon className='size-7 animate-spin text-indigo-600' />
    </div>
  )
}

export default Listingdetails