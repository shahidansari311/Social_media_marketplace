import { useClerk, useUser, UserButton } from '@clerk/clerk-react';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { GripIcon , MessageCircle } from 'lucide-react';

const Navbar = () => {
    const { user } = useUser();
    const { openSignIn } = useClerk();
    const { signOut } = useClerk();
    const navigate=useNavigate();

    const handleLogout = async () => {
        await signOut();
        window.location.href = "/";
    };


    const [mobileOpen, setMobileOpen] = React.useState(false);

    return (
        <div className='flex place-self-center border border-gray-300 rounded-full m-2'>
            <nav className="flex items-center justify-between gap-8 bg-white/60 border border-white rounded-full px-4 md:px-2 py-2.5 w-full max-w-3xl" >
                <a href="/" className='flex items-center md:pl-3 font-bold text-xl'>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="m12.75 8.3 6.75 3.884L26.25 8.3m-13.5 23.28v-7.755L6 19.94m27 0-6.75 3.885v7.754M6.405 12.408 19.5 19.954l13.095-7.546M19.5 35V19.94M33 25.914V13.962a2.98 2.98 0 0 0-1.5-2.585L21 5.4a3.01 3.01 0 0 0-3 0L7.5 11.377A3 3 0 0 0 6 13.962v11.953A2.98 2.98 0 0 0 7.5 28.5L18 34.477a3.01 3.01 0 0 0 3 0L31.5 28.5a3 3 0 0 0 1.5-2.585" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    SocialBazar
                </a>
                <div className='w-0.5 h-8 bg-gray-50 hidden md:flex'></div>
                <div id="menu" className={`max-md:absolute max-md:bg-white/70 max-md:h-[785px] max-md:overflow-hidden max-md:transition-[width] max-md:duration-300 max-md:top-0 max-md:left-0 max-md:flex-col max-md:justify-center max-md:backdrop-blur flex items-center gap-8 z-50 md:gap-10 flex-1 ${mobileOpen ? 'max-md:w-full' : 'max-md:w-0'}`}>
                    <Link to="/" onClick={() => setMobileOpen(false)} className="text-gray-600 hover:text-gray-700 text-sm">Home</Link>
                    <Link to="/Marketplace" onClick={() => setMobileOpen(false)} className="text-gray-600 hover:text-gray-700 text-sm">Marketplace</Link>
                    {user ? (
                        <Link
                            to="/Mylisting"
                            onClick={() => setMobileOpen(false)}
                            className="text-gray-600 hover:text-gray-700 text-sm"
                        >
                            Listings
                        </Link>
                    ) : (
                        <button
                            onClick={() => {
                                setMobileOpen(false);
                                openSignIn();
                            }}
                            className="text-gray-600 hover:text-gray-700 text-sm"
                        >
                            Listings
                        </button>
                    )}

                    {user ? (
                        <Link
                            to="/Messages"
                            onClick={() => setMobileOpen(false)}
                            className="text-gray-600 hover:text-gray-700 text-sm"
                        >
                            Messages
                        </Link>
                    ) : (
                        <button
                            onClick={() => {
                                setMobileOpen(false);
                                openSignIn();
                            }}
                            className="text-gray-600 hover:text-gray-700 text-sm"
                        >
                            Messages
                        </button>
                    )}
                    <button id="close-menu" onClick={() => setMobileOpen(false)} className="md:hidden bg-violet-500 active:bg-violet-600 text-white p-2 rounded-md aspect-square font-medium transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex items-center gap-2 md:pr-1">
                    {user ? (
                        <UserButton>
                            <UserButton.MenuItems>
                                <UserButton.Action label="Messages" labelIcon={<MessageCircle size={16}/>} onClick={()=>{
                                navigate('/Messages');
                            }}/>
                            </UserButton.MenuItems> 
                            <UserButton.MenuItems> 
                                <UserButton.Action label="My Orders" labelIcon={<GripIcon size={16}/>} onClick={()=>{
                                navigate('/Myorders');
                            }}/>
                            </UserButton.MenuItems>
                        </UserButton>
                    ) : (
                        <button
                            onClick={openSignIn}
                            className="hidden md:inline-block bg-violet-600 hover:bg-violet-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm transition cursor-pointer"
                        >
                            Get Started
                        </button>
                    )}
                    <button id="open-menu" onClick={() => setMobileOpen(true)} className="md:hidden text-gray-700 p-2 rounded-md aspect-square font-medium transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 12h16" />
                            <path d="M4 18h16" />
                            <path d="M4 6h16" />
                        </svg>
                    </button>
                </div>
            </nav>
        </div>
    )
}

export default Navbar