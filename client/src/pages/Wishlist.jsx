import React, { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import api from '../config/axios';
import ListingCard from '../components/ListingCard';
import { Loader2Icon, HeartIcon } from 'lucide-react';

const Wishlist = () => {
    const { isLoaded, user } = useUser();
    const { getToken } = useAuth();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWishlist = async () => {
        try {
            const token = await getToken();
            const { data } = await api.get('/api/listing/wishlist', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setListings(data.listings || []);
        } catch (error) {
            console.error("Error fetching wishlist", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoaded && user) {
            fetchWishlist();
        }
    }, [isLoaded, user]);

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <Loader2Icon className='animate-spin text-indigo-600 size-7' />
            </div>
        );
    }

    return (
        <div className='min-h-screen px-6 md:px-16 lg:px-24 xl:px-32 pt-28 pb-20'>
            <div className='flex flex-col mb-8'>
                <h1 className='text-3xl font-bold text-gray-800 flex items-center gap-3'>
                    <HeartIcon className='text-red-500 fill-red-500' /> My Wishlist
                </h1>
                <p className='text-gray-600 mt-1'>Accounts you are interested in.</p>
            </div>

            {listings.length === 0 ? (
                <div className='bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-2xl mx-auto mt-10 shadow-sm'>
                    <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <HeartIcon className='text-gray-300 w-8 h-8 ' />
                    </div>
                    <h3 className='text-xl font-semibold text-gray-900 mb-2'>Wishlist is empty</h3>
                    <p className='text-sm text-gray-500 mb-6'>
                        Browse the marketplace and save accounts you like!
                    </p>
                    <button
                        onClick={() => window.location.href = '/Marketplace'}
                        className='premium-gradient text-white px-6 py-2.5 rounded-xl font-semibold shadow-md'
                    >
                        Go to Marketplace
                    </button>
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {listings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
