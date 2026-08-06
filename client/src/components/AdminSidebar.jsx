import { NavLink } from 'react-router-dom'
import { BanknoteIcon, CheckIcon, LayoutDashboardIcon, ListIcon, Settings2Icon, WalletIcon, LogOutIcon } from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';

const AdminSidebar = () => {
    const { user, isLoaded } = useUser();
    const { signOut } = useClerk();

    if (!isLoaded) return null;

    const adminNavlinks = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboardIcon },
        { name: 'Verify Credentials', path: '/admin/verify-credentials', icon: CheckIcon },
        { name: 'Change Credentials', path: '/admin/change-credentials', icon: Settings2Icon },
        { name: 'All Listings', path: '/admin/list-listings', icon: ListIcon },
        { name: 'Transactions', path: '/admin/transactions', icon: BanknoteIcon },
        { name: 'Withdrawals', path: '/admin/withdrawal', icon: WalletIcon },
    ];

    return (
        <div className='h-[calc(100vh-64px)] flex flex-col w-16 md:w-64 bg-gray-900 border-r border-white/5 shrink-0'>
            {/* User Profile Section */}
            <div className='p-4 md:p-6 border-b border-white/5'>
                <div className='flex items-center gap-3'>
                    <img className='size-9 md:size-11 rounded-2xl border-2 border-brand-500/30 shadow-lg shadow-brand-500/10' src={user?.imageUrl} alt="Admin" />
                    <div className='max-md:hidden'>
                        <p className='text-sm font-bold text-white truncate'>{user?.firstName} {user?.lastName}</p>
                        <p className='text-[10px] text-brand-400 font-bold uppercase tracking-widest'>Administrator</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className='flex-1 py-4 space-y-1 px-2 md:px-3 overflow-y-auto'>
                <p className='text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-3 max-md:hidden'>Navigation</p>
                {adminNavlinks.map((link, index) => (
                    <NavLink key={index} to={link.path} end className={({ isActive }) => `relative flex items-center justify-center md:justify-start gap-3 w-full py-3 px-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive ? 'bg-brand-500/10 text-brand-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                        {({ isActive }) => (
                            <>
                                <link.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-brand-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                                <p className="max-md:hidden truncate">{link.name}</p>
                                {isActive && <span className='absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-500 rounded-l-full' />}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className='p-2 md:p-3 border-t border-white/5'>
                <button 
                    onClick={() => signOut()}
                    className='flex items-center justify-center md:justify-start gap-3 w-full py-3 px-3 rounded-xl text-sm font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all'
                >
                    <LogOutIcon className='w-5 h-5 shrink-0' />
                    <span className='max-md:hidden'>Sign Out</span>
                </button>
            </div>
        </div>
    )
}

export default AdminSidebar