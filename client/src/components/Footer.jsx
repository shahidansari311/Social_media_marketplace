import React from 'react'
import { Rocket, Github, Twitter, Linkedin, Youtube, Mail, MapPin, Phone } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="bg-gray-900 pt-24 pb-12 px-6 md:px-16 lg:px-24 xl:px-40 text-gray-400">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                {/* Brand Section */}
                <div className="space-y-6">
                    <div className='flex items-center gap-2 group cursor-pointer'>
                        <div className='premium-gradient p-2 rounded-xl shadow-lg shadow-brand-500/10'>
                            <Rocket className='size-5 text-white' />
                        </div>
                        <span className='font-black text-xl tracking-tighter text-white'>
                            SocialBazar
                        </span>
                    </div>
                    <p className="text-sm leading-relaxed max-w-xs">
                        The world's most trusted marketplace for premium digital assets. Buying and selling social influence has never been this secure.
                    </p>
                    <div className="flex items-center gap-4">
                        {[Twitter, Linkedin, Github, Youtube].map((Icon, i) => (
                            <a key={i} href="#" className="p-2.5 rounded-xl bg-white/5 hover:bg-brand-600 hover:text-white transition-all card-hover">
                                <Icon className="size-4" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Marketplace</h4>
                    <ul className="space-y-4 text-sm font-medium">
                        <li><a href="/Marketplace" className="hover:text-brand-400 transition">Explore Listings</a></li>
                        <li><a href="/Marketplace?featured=true" className="hover:text-brand-400 transition">Premium Accounts</a></li>
                        <li><a href="/Marketplace?platform=instagram" className="hover:text-brand-400 transition">Instagram Assets</a></li>
                        <li><a href="/Marketplace?platform=youtube" className="hover:text-brand-400 transition">YouTube Channels</a></li>
                    </ul>
                </div>

                {/* Company */}
                <div>
                    <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Support</h4>
                    <ul className="space-y-4 text-sm font-medium">
                        <li><a href="#" className="hover:text-brand-400 transition">How it Works</a></li>
                        <li><a href="#" className="hover:text-brand-400 transition">Verification Process</a></li>
                        <li><a href="#" className="hover:text-brand-400 transition">Safety Center</a></li>
                        <li><a href="#" className="hover:text-brand-400 transition">Help Desk</a></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Connect</h4>
                    <ul className="space-y-4 text-sm font-medium">
                        <li className="flex items-start gap-3">
                            <Mail className="size-4 text-brand-500 shrink-0 mt-0.5" />
                            <span>shahidansari945256@gmail.com</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <MapPin className="size-4 text-brand-500 shrink-0 mt-0.5" />
                            <span>Ghaziabad , Uttar Pradesh, India</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-xs font-bold text-gray-500 tracking-wider">
                    © 2026 SOCIALBAZAR. ALL RIGHTS RESERVED.
                </p>
                <div className="flex gap-8 text-xs font-bold text-gray-500 tracking-wider">
                    <a href="#" className="hover:text-white transition">PRIVACY POLICY</a>
                    <a href="#" className="hover:text-white transition">TERMS OF SERVICE</a>
                    <a href="#" className="hover:text-white transition">COOKIES</a>
                </div>
            </div>
        </footer>
    )
}

export default Footer
