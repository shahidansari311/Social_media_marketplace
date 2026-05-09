import { NavLink } from 'react-router-dom'
import { BanknoteIcon, CheckIcon, LayoutDashboardIcon, ListIcon, Settings2Icon, WalletIcon } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

const AdminSidebar = () => {
    const { user, isLoaded } = useUser();

    if (!isLoaded) return null;

    const adminNavlinks = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboardIcon },
        { name: 'Verify', path: '/admin/verify-credentials', icon: CheckIcon },
        { name: 'Change', path: '/admin/change-credentials', icon: Settings2Icon },
        { name: 'Listings', path: '/admin/list-listings', icon: ListIcon },
        { name: 'Transactions', path: '/admin/transactions', icon: BanknoteIcon },
        { name: 'Withdrawal', path: '/admin/withdrawal', icon: WalletIcon },
    ];

    return (
        <div className='h-[calc(100vh-64px)] flex flex-col items-center pt-8 w-16 md:w-60 border-r border-gray-200 text-sm bg-white shrink-0'>
            <img className='size-9 md:size-12 rounded-full mx-auto border-2 border-indigo-100' src={user?.imageUrl} alt="sidebar" />
            <p className='mt-2 text-base font-semibold text-gray-800 max-md:hidden'>{user?.firstName} {user?.lastName}</p>
            <div className='w-full'>
                {adminNavlinks.map((link, index) => (
                    <NavLink key={index} to={link.path} end className={({ isActive }) => `relative flex items-center justify-center md:justify-start gap-3 w-full py-4 md:pl-8 text-gray-500 transition-all ${isActive ? 'bg-indigo-50 text-indigo-600 font-bold' : 'hover:bg-gray-50 hover:text-gray-900'}`}>
                        {({ isActive }) => (
                            <>
                                <link.icon className="w-5 h-5" />
                                <p className="max-md:hidden">{link.name}</p>
                                <span className={`w-1.5 h-10 rounded-l right-0 absolute ${isActive && 'bg-indigo-500'}`} />
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </div>
    )
}

export default AdminSidebar