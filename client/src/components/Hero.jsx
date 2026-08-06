import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Sparkles, ShieldCheck, Zap, ArrowRight, BadgeCheck } from 'lucide-react'

const Hero = () => {
    const [input, setInput] = React.useState('')
    const navigate = useNavigate();

    const onSubmitHandler = (e) => {
        e.preventDefault()
        if(input.trim()) {
            navigate(`/Marketplace?search=${input.trim()}`);
        }
    }

    return (
        <div className="relative overflow-hidden pt-32 pb-24 md:pt-36 md:pb-32">
            {/* Background blobs for premium feel */}
            <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] -z-10 overflow-hidden pointer-events-none'>
                <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/10 blur-[120px] rounded-full animate-pulse'></div>
                <div className='absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-500/10 blur-[100px] rounded-full' style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative flex flex-col items-center justify-center px-6 md:px-16 lg:px-24">
                
                {/* Trust Badge */}
                <div className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm px-4 py-2 rounded-full mb-10 hover:shadow-md transition card-hover">
                    <div className="flex avatar-stack">
                        <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" alt="user" className="size-6 object-cover rounded-full border-2 border-white ring-1 ring-gray-100" />
                        <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" alt="user" className="size-6 object-cover rounded-full border-2 border-white ring-1 ring-gray-100" />
                        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200" alt="user" className="size-6 object-cover rounded-full border-2 border-white ring-1 ring-gray-100" />
                    </div>
                    <div className="flex items-center gap-1.5 border-l border-gray-100 pl-3">
                        <Sparkles className="size-3.5 text-brand-600 fill-brand-600" />
                        <p className="text-xs font-bold text-gray-600"> Trusted by 5,000+ power users </p>
                    </div>
                </div>

                {/* Main Heading */}
                <h1 className="text-5xl md:text-8xl font-black max-w-4xl text-center leading-[0.9] tracking-tight text-gray-900">
                    Trade Your <span className="premium-text-gradient italic">Digital</span> <br className="hidden md:block" /> Influence Fast.
                </h1>

                <p className="max-w-xl text-center text-gray-500 text-lg md:text-xl font-medium mt-8 leading-relaxed">
                    The ultra-secure marketplace for premium social assets. Buy and sell accounts with escrow protection and zero friction.
                </p>

                {/* Search / CTA Box */}
                <div className='w-full max-w-2xl mt-12'>
                    <form onSubmit={onSubmitHandler} className='relative group'>
                        <div className='absolute -inset-1 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200'></div>
                        <div className='relative flex items-center bg-white border border-gray-200 shadow-2xl rounded-[2.2rem] p-2 pr-2.5'>
                            <div className='pl-6 pr-3 text-gray-400'>
                                <Search className='size-6' />
                            </div>
                            <input 
                                onChange={e => setInput(e.target.value)} 
                                value={input} 
                                type="text" 
                                placeholder='Search for "YouTube Gaming" or "@username"' 
                                className='w-full py-4 text-lg font-semibold placeholder:text-gray-300 outline-none' 
                            />
                            <button className='premium-gradient text-white px-8 py-4 rounded-[1.8rem] font-bold shadow-xl shadow-brand-500/20 hover:scale-[1.02] active:scale-95 transition cursor-pointer flex items-center gap-2'> 
                                Explore <ArrowRight className='size-4'/>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Features Grid */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full max-w-5xl'>
                    {[
                        { icon: ShieldCheck, title: 'Escrow Protection', desc: 'Secure payments held until transfer is verified.' },
                        { icon: Zap, title: 'Instant Transfer', desc: 'Automated profile migration for select platforms.' },
                        { icon: BadgeCheck, title: 'Verified Only', desc: 'Every listing undergoes a 12-point quality audit.' }
                    ].map((feat, i) => (
                        <div key={i} className='flex items-start gap-4 p-6 glass-card rounded-3xl card-hover'>
                            <div className='p-3 bg-brand-50 rounded-2xl text-brand-600'>
                                <feat.icon className='size-6' />
                            </div>
                            <div>
                                <h3 className='font-bold text-gray-900 mb-1'>{feat.title}</h3>
                                <p className='text-sm text-gray-500 font-medium leading-snug'>{feat.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Hero;