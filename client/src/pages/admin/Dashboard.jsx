import { ChartLineIcon, CircleDollarSignIcon, ListIcon, Loader2Icon, UsersIcon, TrendingUp, ArrowUpRight } from 'lucide-react';
import AdminTitle from '../../components/AdminTitle';
import { useState } from 'react';
import { useEffect } from 'react';
import ListingDetailsModal from '../../components/ListingDetailsModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminDashboard } from '../../app/features/adminSlice';
import { useAuth } from '@clerk/clerk-react';

const Dashboard = () => {
    const currency = import.meta.env.VITE_CURRENCY || '$';
    const dispatch = useDispatch();
    const { getToken } = useAuth();
    const { dashboard, loading } = useSelector(state => state.admin);

    const [showModal, setShowModal] = useState(null);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const dashboardCards = [
        { title: 'Total Listings', value: dashboard?.totalListings || '0', icon: ChartLineIcon, color: 'from-brand-500 to-indigo-600', bgLight: 'bg-brand-50' },
        { title: 'Total Revenue', value: currency + (dashboard?.totalRevenue?.toLocaleString() || '0'), icon: CircleDollarSignIcon, color: 'from-emerald-500 to-teal-600', bgLight: 'bg-emerald-50' },
        { title: 'Active Listings', value: dashboard?.activeListings || '0', icon: ListIcon, color: 'from-blue-500 to-cyan-600', bgLight: 'bg-blue-50' },
        { title: 'Total Users', value: dashboard?.totalUser || '0', icon: UsersIcon, color: 'from-orange-500 to-amber-600', bgLight: 'bg-orange-50' },
    ];

    useEffect(() => {
        dispatch(fetchAdminDashboard({ getToken }));
    }, [dispatch, getToken]);

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
                <p className='text-sm text-gray-400 font-medium'>Loading dashboard...</p>
            </div>
        </div>
    ) : (
        <div className='space-y-8'>
            {/* Welcome */}
            <div>
                <p className='text-sm font-medium text-gray-400 mb-1'>{getGreeting()} 👋</p>
                <AdminTitle text1='Admin' text2='Dashboard' subtitle='Overview of your marketplace performance' />
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
                {dashboardCards.map((card, index) => (
                    <div key={index} className='relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 group'>
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} opacity-5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500`}></div>
                        <div className='flex items-start justify-between relative'>
                            <div>
                                <p className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-2'>{card.title}</p>
                                <p className='text-2xl font-black text-gray-900'>{card.value}</p>
                            </div>
                            <div className={`${card.bgLight} p-2.5 rounded-xl`}>
                                <card.icon className='size-5 text-gray-700' />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Listings */}
            <div>
                <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-lg font-bold text-gray-900'>Recent Listings</h3>
                    <span className='text-xs font-bold text-gray-400 uppercase tracking-wider'>{dashboard?.recentListings?.length || 0} entries</span>
                </div>
                <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm'>
                    <table className='w-full text-sm text-left text-gray-700'>
                        <thead>
                            <tr className='border-b border-gray-100 bg-gray-50/50'>
                                <th className='pl-5 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>#</th>
                                <th className='px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Title</th>
                                <th className='px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Platform</th>
                                <th className='px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Niche</th>
                                <th className='px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Username</th>
                                <th className='px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboard?.recentListings?.map((listing, index) => (
                                <tr onClick={() => setShowModal(listing)} key={index} className='border-t border-gray-50 hover:bg-brand-50/30 cursor-pointer transition-colors'>
                                    <td className='pl-5 py-3.5 text-gray-400 font-medium'>{index + 1}</td>
                                    <td className='px-4 py-3.5 font-semibold text-gray-900'>{listing.title}</td>
                                    <td className='px-4 py-3.5 capitalize'>{listing.platform}</td>
                                    <td className='px-4 py-3.5 capitalize'>{listing.niche}</td>
                                    <td className='px-4 py-3.5 text-gray-500'>@{listing.username}</td>
                                    <td className='px-4 py-3.5'>
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${getStatusColor(listing.status)}`}>
                                            {listing.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && <ListingDetailsModal listing={showModal} onClose={() => setShowModal(null)} />}
        </div>
    );
};

export default Dashboard;
