import AdminTitle from '../../components/AdminTitle';
import { useEffect, useState } from 'react';
import { CheckCircleIcon, Loader2Icon, MailCheckIcon, XIcon } from 'lucide-react';
import ListingDetailsModal from '../../components/ListingDetailsModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminListings, updateListingStatus } from '../../app/features/adminSlice';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

const AllListings = () => {
    const dispatch = useDispatch();
    const { getToken } = useAuth();
    const { listings, loading } = useSelector(state => state.admin);
    const [showModal, setShowModal] = useState(null);

    const changeListingStatus = async (status, listing) => {
        try {
            await dispatch(updateListingStatus({ id: listing.id, status, getToken })).unwrap();
            toast.success('Status updated successfully');
            dispatch(fetchAdminListings({ getToken }));
        } catch (error) {
            toast.error(error.message || 'Failed to update status');
        }
    };

    useEffect(() => {
        dispatch(fetchAdminListings({ getToken }));
    }, [dispatch, getToken]);

    const colorMapCredentials = {
        notSubmit: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', icon: XIcon, label: 'Not Submitted' },
        submitted: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', icon: MailCheckIcon, label: 'Submitted' },
        verified: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', icon: CheckCircleIcon, label: 'Verified' },
        changed: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', icon: CheckCircleIcon, label: 'Changed' },
    };

    const getStatusColor = (status) => {
        const colors = {
            active: 'bg-emerald-50 text-emerald-700 border-emerald-100',
            inactive: 'bg-gray-50 text-gray-600 border-gray-100',
            sold: 'bg-indigo-50 text-indigo-700 border-indigo-100',
            ban: 'bg-red-50 text-red-700 border-red-100',
            deleted: 'bg-gray-100 text-gray-500 border-gray-200',
        };
        return colors[status] || colors.inactive;
    };

    return loading ? (
        <div className='flex items-center justify-center h-full'>
            <div className='flex flex-col items-center gap-3'>
                <Loader2Icon className='animate-spin text-brand-500 size-8' />
                <p className='text-sm text-gray-400 font-medium'>Loading listings...</p>
            </div>
        </div>
    ) : (
        <div className='space-y-8'>
            <div className='flex items-center justify-between'>
                <AdminTitle text1='Manage' text2='All Listings' subtitle={`${listings.length} total listings`} />
            </div>

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
                                <th className='px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Credentials</th>
                                <th className='px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listings.map((listing, index) => {
                                const credStatus = listing.isCredentialChanged ? 'changed' : listing.isCredentialVerified ? 'verified' : listing.isCredentialSubmitted ? 'submitted' : 'notSubmit';
                                const cred = colorMapCredentials[credStatus];

                                return (
                                    <tr onClick={() => setShowModal(listing)} key={index} className='border-t border-gray-50 hover:bg-brand-50/30 cursor-pointer transition-colors'>
                                        <td className='pl-5 py-3.5 text-gray-400 font-medium'>{index + 1}</td>
                                        <td className='px-4 py-3.5 font-semibold text-gray-900'>{listing.title}</td>
                                        <td className='px-4 py-3.5 capitalize'>{listing.platform}</td>
                                        <td className='px-4 py-3.5 capitalize'>{listing.niche}</td>
                                        <td className='px-4 py-3.5 text-gray-500'>@{listing.username}</td>
                                        <td className='px-4 py-3.5'>
                                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${cred.bg} ${cred.text} ${cred.border}`}>
                                                <cred.icon size={10} /> {cred.label}
                                            </span>
                                        </td>
                                        <td className='px-4 py-3.5'>
                                            <div onClick={(e) => e.stopPropagation()}>
                                                {listing.status !== 'deleted' ? (
                                                    <select value={listing.status} onChange={(e) => changeListingStatus(e.target.value, listing)} className='text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer'>
                                                        <option value='active'>Active</option>
                                                        <option value='inactive'>Inactive</option>
                                                        <option value='ban'>Ban</option>
                                                        <option value='sold'>Sold</option>
                                                    </select>
                                                ) : (
                                                    <span className='text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border bg-gray-100 text-gray-500 border-gray-200'>Deleted</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            {showModal && <ListingDetailsModal listing={showModal} onClose={() => setShowModal(null)} />}
        </div>
    );
};

export default AllListings;
