import { useEffect, useState } from 'react';
import { Loader2Icon, Inbox } from 'lucide-react';
import AdminTitle from '../../components/AdminTitle';
import WithdrawalDetail from '../../components/WithdrawalDetail';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminWithdrawals } from '../../app/features/adminSlice';
import { useAuth } from '@clerk/clerk-react';

const Withdrawal = () => {
    const currency = import.meta.env.VITE_CURRENCY || '$';
    const dispatch = useDispatch();
    const { getToken } = useAuth();
    const { withdrawals, loading } = useSelector(state => state.admin);

    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        dispatch(fetchAdminWithdrawals({ getToken }));
    }, [dispatch, getToken]);

    if (loading) {
        return (
            <div className='flex items-center justify-center h-full'>
                <div className='flex flex-col items-center gap-3'>
                    <Loader2Icon className='animate-spin text-brand-500 size-8' />
                    <p className='text-sm text-gray-400 font-medium'>Loading withdrawals...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-8'>
            <AdminTitle text1='Finance' text2='Withdrawals' subtitle={`${withdrawals?.length || 0} total requests`} />
            
            <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm'>
                <div className='overflow-x-auto'>
                    <table className='w-full text-sm text-left text-gray-700'>
                        <thead>
                            <tr className='border-b border-gray-100 bg-gray-50/50'>
                                <th className='pl-5 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>#</th>
                                <th className='px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>User</th>
                                <th className='px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Email</th>
                                <th className='px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Amount</th>
                                <th className='px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Status</th>
                                <th className='px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {withdrawals?.length === 0 ? (
                                <tr>
                                    <td colSpan='6' className='text-center py-16'>
                                        <div className='flex flex-col items-center gap-3'>
                                            <div className='size-14 bg-gray-50 rounded-2xl flex items-center justify-center'>
                                                <Inbox className='size-7 text-gray-300' />
                                            </div>
                                            <p className='text-sm text-gray-400 font-medium'>No withdrawal requests found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                withdrawals?.map((req, index) => (
                                    <tr key={req.id} className='border-t border-gray-50 hover:bg-brand-50/30 transition-colors'>
                                        <td className='pl-5 py-3.5 text-gray-400 font-medium'>{index + 1}</td>
                                        <td className='px-4 py-3.5'>
                                            <div className='flex items-center gap-3'>
                                                <img src={req.user?.image} alt={req.user?.name} className='size-8 rounded-xl object-cover border border-gray-100' />
                                                <span className='font-semibold text-gray-900'>{req.user?.name}</span>
                                            </div>
                                        </td>
                                        <td className='px-4 py-3.5 text-gray-500 text-xs'>{req.user?.email}</td>
                                        <td className='px-4 py-3.5 font-bold text-gray-900'>{currency}{req.amount.toLocaleString()}</td>
                                        <td className='px-4 py-3.5'>
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${req.isWithdrawn ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                                {req.isWithdrawn ? 'Paid' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className='px-4 py-3.5 text-center'>
                                            <button onClick={() => setSelectedRequest(req)} className='text-xs font-bold text-brand-600 hover:text-brand-700 transition hover:underline'>
                                                Manage
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {selectedRequest && (
                    <WithdrawalDetail
                        data={selectedRequest}
                        onClose={() => {
                            dispatch(fetchAdminWithdrawals({ getToken }));
                            setSelectedRequest(null);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default Withdrawal;
