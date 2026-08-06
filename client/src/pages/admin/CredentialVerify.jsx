import React, { useEffect, useState } from 'react';
import AdminTitle from '../../components/AdminTitle';
import CredentialVerifyModal from '../../components/CredentialVerifyModal';
import { Loader2Icon, ShieldCheck, Inbox } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import api from '../../config/axios';

const CredentialVerify = () => {

    const { getToken } = useAuth();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(null);

    const fetchAllUnverifiedListings = async () => {
        try {
            const token = await getToken();
            const { data } = await api.get('/api/admin/credential-requests', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setListings(data.filter(l => l.isCredentialSubmitted && !l.isCredentialVerified));
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllUnverifiedListings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return loading ? (
        <div className='flex items-center justify-center h-full'>
            <div className='flex flex-col items-center gap-3'>
                <Loader2Icon className='animate-spin text-brand-500 size-8' />
                <p className='text-sm text-gray-400 font-medium'>Loading credentials...</p>
            </div>
        </div>
    ) : (
        <div className='space-y-8 h-full'>
            {listings.length === 0 ? (
                <div className='flex flex-col items-center justify-center text-center h-full'>
                    <div className='glass-card rounded-3xl p-12 max-w-md w-full space-y-4'>
                        <div className='size-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto'>
                            <ShieldCheck className='size-8 text-emerald-500' />
                        </div>
                        <h3 className='text-2xl font-black text-gray-900'>All Verified!</h3>
                        <p className='text-gray-500 font-medium text-sm'>No pending credential verifications at this time.</p>
                    </div>
                </div>
            ) : (
                <>
                    <AdminTitle text1='Security' text2='Verify Credentials' subtitle={`${listings.length} pending verifications`} />
                    
                    <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm'>
                        <div className='overflow-x-auto'>
                            <table className='w-full text-sm text-left text-gray-700'>
                                <thead>
                                    <tr className='border-b border-gray-100 bg-gray-50/50'>
                                        <th className='pl-5 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>#</th>
                                        <th className='px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Title</th>
                                        <th className='px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Platform</th>
                                        <th className='px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Niche</th>
                                        <th className='px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Username</th>
                                        <th className='px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listings.map((listing, index) => (
                                        <tr key={index} className='border-t border-gray-50 hover:bg-brand-50/30 transition-colors'>
                                            <td className='pl-5 py-3.5 text-gray-400 font-medium'>{index + 1}</td>
                                            <td className='px-4 py-3.5 font-semibold text-gray-900'>{listing.title}</td>
                                            <td className='px-4 py-3.5 capitalize'>{listing.platform}</td>
                                            <td className='px-4 py-3.5 capitalize'>{listing.niche}</td>
                                            <td className='px-4 py-3.5 text-gray-500'>@{listing.username}</td>
                                            <td className='px-4 py-3.5'>
                                                <button onClick={() => setShowModal(listing)} className='text-xs font-bold premium-gradient text-white px-4 py-1.5 rounded-lg hover:opacity-90 transition shadow-sm'>
                                                    Verify
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {showModal && (
                            <CredentialVerifyModal
                                listing={showModal}
                                onClose={() => {
                                    fetchAllUnverifiedListings();
                                    setShowModal(null);
                                }}
                            />
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default CredentialVerify;
