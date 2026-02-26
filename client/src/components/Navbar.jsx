import { useClerk, useUser, UserButton } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GripIcon, MessageCircle, Menu, X, Rocket, LayoutDashboard, ShoppingBag, Heart } from 'lucide-react';

const Navbar = () => {
    const { user } = useUser();
    const { openSignIn } = useClerk();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Marketplace', path: '/Marketplace' },
        { name: 'Listings', path: '/Mylisting', protected: true },
        { name: 'Wishlist', path: '/wishlist', protected: true },
        { name: 'Messages', path: '/Messages', protected: true },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 py-4 ${scrolled ? 'pt-2' : ''}`}>
            <nav className={`mx-auto max-w-5xl transition-all duration-500 ${scrolled ? 'glass-card border-white/40 shadow-2xl rounded-3xl px-6 py-3' : 'bg-transparent border-transparent px-2 py-4'}`}>
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className='flex items-center gap-2 group transition-transform active:scale-95'>
                        <div className='premium-gradient p-2 rounded-xl shadow-lg shadow-brand-500/20 group-hover:rotate-12 transition-transform duration-500'>
                            <Rocket className='size-5 text-white' />
                        </div>
                        <span className='font-black text-xl tracking-tighter text-gray-900 group-hover:premium-text-gradient transition-all'>
                            SocialBazar
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className='hidden md:flex items-center gap-1 bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100/50'>
                        <Link to="/" className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${isActive('/') ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
                            Home
                        </Link>
                        {navLinks.map((link) => (
                            <Link 
                                key={link.path}
                                to={link.path} 
                                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${isActive(link.path) ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Action Area */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <div className='flex items-center gap-3'>
                                <UserButton afterSignOutUrl="/">
                                    <UserButton.MenuItems>
                                        <UserButton.Action label="My Messages" labelIcon={<MessageCircle size={16}/>} onClick={() => navigate('/Messages')} />
                                        <UserButton.Action label="My Orders" labelIcon={<ShoppingBag size={16}/>} onClick={() => navigate('/Myorders')} />
                                        <UserButton.Action label="My Wishlist" labelIcon={<Heart size={16}/>} onClick={() => navigate('/wishlist')} />
                                        <UserButton.Action label="Inventory" labelIcon={<LayoutDashboard size={16}/>} onClick={() => navigate('/Mylisting')} />
                                    </UserButton.MenuItems>
                                </UserButton>
                            </div>
                        ) : (
                            <button
                                onClick={() => openSignIn()}
                                className="hidden md:flex premium-gradient text-white px-7 py-2.5 rounded-2xl text-sm font-black shadow-xl shadow-brand-500/20 hover:scale-[1.05] active:scale-95 transition-all cursor-pointer"
                            >
                                Login
                            </button>
                        )}
                        
                        {/* Mobile Toggle */}
                        <button 
                            onClick={() => setMobileOpen(!mobileOpen)} 
                            className="md:hidden p-2.5 rounded-xl bg-gray-100/50 text-gray-900 hover:bg-gray-200 transition"
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown */}
                <div className={`md:hidden absolute left-6 right-6 top-[calc(100%+16px)] glass-card rounded-3xl p-6 transition-all duration-500 origin-top ${mobileOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                    <div className='flex flex-col gap-2'>
                        <Link to="/" onClick={() => setMobileOpen(false)} className={`p-4 rounded-2xl text-base font-bold transition ${isActive('/') ? 'bg-brand-50 text-brand-600' : 'text-gray-600'}`}>Home</Link>
                        {navLinks.map((link) => (
                            <Link 
                                key={link.path}
                                to={link.path} 
                                onClick={() => setMobileOpen(false)}
                                className={`p-4 rounded-2xl text-base font-bold transition ${isActive(link.path) ? 'bg-brand-50 text-brand-600' : 'text-gray-600'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        {!user && (
                            <button onClick={() => { openSignIn(); setMobileOpen(false); }} className='w-full mt-4 premium-gradient p-4 rounded-2xl text-white font-black'>Get Started</button>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar