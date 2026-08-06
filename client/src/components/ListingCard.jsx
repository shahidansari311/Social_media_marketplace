import React from 'react'
import { platformIcons } from '../assets/assets'
import { BadgeCheck, LineChart, MapPin, User, ArrowRight, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/clerk-react'
import toast from 'react-hot-toast'
import api from '../config/axios'

const ListingCard = ({ listing }) => {

    const navigate=useNavigate();
    const { user } = useUser();
    const { getToken } = useAuth();
    const currency = import.meta.env.VITE_CURRENCY || '$'

    const toggleWishlist = async (e) => {
        e.stopPropagation();
        if (!user) return toast.error("Please login to add to wishlist");
        try {
            const token = await getToken();
            await api.post(`/api/listing/wishlist/${listing.id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Wishlist updated");
        } catch (error) {
            toast.error("Failed to update wishlist");
        }
    }

    return (
        <div className='group relative bg-white rounded-[2rem] border border-gray-100 overflow-hidden card-hover'>
            {/* Wishlist Button */}
            <button onClick={toggleWishlist} className='absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full shadow-sm z-20 hover:scale-110 active:scale-95 transition'>
                <Heart className='size-4 text-gray-400' />
            </button>

            {/* Featured Banner */}
            {listing.featured && (
                <div className='absolute top-0 left-0 w-full premium-gradient text-white text-[10px] text-center font-bold py-1.5 tracking-[0.2em] uppercase z-10'>
                    Featured Account
                </div>
            )}

            <div className={`p-6 ${listing.featured ? 'pt-10' : 'pt-6'}`}>
                {/* Header*/}
                <div className='flex items-start gap-4 mb-6'>
                   <div className='p-3 bg-brand-50 rounded-2xl group-hover:scale-110 transition duration-500'>
                        { platformIcons[listing.platform]}
                   </div>

                   <div className="flex flex-col flex-1 min-w-0">
                        <div className='flex items-center gap-1.5'>
                            <h2 className='text-lg font-bold text-gray-900 truncate'>{listing.title}</h2>
                            {listing.verified && <BadgeCheck className='text-brand-500 w-4 h-4 shrink-0'/>}
                        </div>
                        <p className='text-sm text-gray-500 font-medium truncate'>
                            @{listing.username} <span className='mx-1 opcity-50'>•</span> 
                            <span className='capitalize italic'> {listing.platform}</span> 
                        </p>
                    </div> 
                </div>

                {/* Metrics Grid */}
                <div className='grid grid-cols-2 gap-4 mb-6'>
                    <div className='bg-gray-50/50 rounded-2xl p-3 border border-gray-100/50 hover:bg-brand-50/30 transition shadow-sm'>
                        <div className='flex items-center gap-2 mb-1'>
                            <User className='size-3.5 text-brand-400'/>
                            <span className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Followers</span>
                        </div>
                        <p className='text-xl font-black text-gray-900 leading-none'>
                            {listing.followers_count >= 1000000 ? (listing.followers_count / 1000000).toFixed(1) + 'M' : listing.followers_count.toLocaleString()}
                        </p>
                    </div>
                    {listing.engagement_rate && (
                        <div className='bg-gray-50/50 rounded-2xl p-3 border border-gray-100/50 hover:bg-indigo-50/30 transition shadow-sm'>
                            <div className='flex items-center gap-2 mb-1'>
                                <LineChart className='size-3.5 text-indigo-400'/>
                                <span className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Engagement</span>
                            </div>
                            <p className='text-xl font-black text-gray-900 leading-none'>
                                {listing.engagement_rate}%
                            </p>
                        </div>
                    )}
                </div>

                {/* Meta details */}
                <div className='flex flex-wrap items-center gap-2 mb-5'>
                    <span className='text-[10px] font-bold bg-brand-50 text-brand-600 px-3 py-1 rounded-full uppercase tracking-wider border border-brand-100'>
                        {listing.niche}
                    </span>
                    {listing.country && (
                        <div className='flex items-center gap-1 px-3 py-1 rounded-full bg-slate-50 border border-slate-100'>
                            <MapPin className='size-3 text-slate-400'/>
                            <span className='text-[10px] font-bold text-slate-500 uppercase tracking-wider'>{listing.country}</span>
                        </div>
                    )}
                </div>

                <p className='text-sm text-gray-500 mb-6 line-clamp-2 font-medium leading-relaxed'>
                    {listing.description}
                </p>

                <div className='flex items-center justify-between pt-5 border-t border-gray-50'>
                    <div className='flex flex-col'>
                        <span className='text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5'>Price</span>
                        <span className='text-2xl font-black premium-text-gradient'>
                            {currency}{listing.price.toLocaleString()}
                        </span>
                    </div>
                    <button
                        onClick={()=>{navigate(`/listing/${listing.id}`);window.scrollTo(0,0)}} 
                        className='h-12 w-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:bg-brand-600 hover:scale-110 active:scale-95 transition-all shadow-lg hover:shadow-brand-500/20 group/btn'
                    >
                        <ArrowRight className='size-5 group-hover/btn:translate-x-1 transition-transform'/>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ListingCard