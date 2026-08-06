import AdminTitle from '../../components/AdminTitle';
import { useState } from 'react';
import { useEffect } from 'react';
import ListingDetailsModal from '../../components/ListingDetailsModal';
import { Loader2Icon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminTransactions } from '../../app/features/adminSlice';
import { useAuth } from '@clerk/clerk-react';

const Transactions = () => {
    const currency = import.meta.env.VITE_CURRENCY || '$';
    const dispatch = useDispatch();
    const { getToken } = useAuth();
    const { transactions, loading } = useSelector(state => state.admin);

    const [showModal, setShowModal] = useState(null);

    useEffect(() => {
        dispatch(fetchAdminTransactions({ getToken }));
    }, [dispatch, getToken]);

    return loading ? (
        <div className='flex items-center justify-center h-full'>
            <div className='flex flex-col items-center gap-3'>
                <Loader2Icon className='animate-spin text-brand-500 size-8' />
                <p className='text-sm text-gray-400 font-medium'>Loading transactions...</p>
            </div>
        </div>
    ) : (
        <div className='space-y-8'>
            <AdminTitle text1='Finance' text2='Transactions' subtitle={`${transactions.length} total transactions`} />

            <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm'>
                <div className='overflow-x-auto'>
                    <table className='w-full text-sm text-left text-gray-700'>
                        <thead>
                            <tr className='border-b border-gray-100 bg-gray-50/50'>
                                <th className='pl-5 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>#</th>
                                <th className='px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Account</th>
                                <th className='px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Platform</th>
                                <th className='px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Amount</th>
                                <th className='px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Status</th>
                                <th className='px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Date</th>
                                <th className='px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((t, index) => (
                                <tr key={index} className='border-t border-gray-50 hover:bg-brand-50/30 transition-colors'>
                                    <td className='pl-5 py-3.5 text-gray-400 font-medium'>{index + 1}</td>
                                    <td className='px-4 py-3.5 font-semibold text-gray-900'>@{t.listing?.username}</td>
                                    <td className='px-4 py-3.5 capitalize'>{t.listing?.platform}</td>
                                    <td className='px-4 py-3.5 font-bold text-gray-900'>
                                        {currency}{Number(t.amount).toLocaleString()}
                                    </td>
                                    <td className='px-4 py-3.5'>
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${t.isPaid ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                            {t.isPaid ? 'Paid' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className='px-4 py-3.5 text-gray-500 text-xs'>{new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                    <td className='px-4 py-3.5'>
                                        <button onClick={() => setShowModal(t.listing)} className='text-xs font-bold text-brand-600 hover:text-brand-700 transition hover:underline'>
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {showModal && (
                <ListingDetailsModal listing={showModal} onClose={() => { setShowModal(null); }} />
            )}
        </div>
    );
};

export default Transactions;
