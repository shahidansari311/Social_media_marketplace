import React from 'react';
import { Target, Users2, ShieldCheck, Globe, Rocket, Award, Sparkles, MessageCircle } from 'lucide-react';
import Footer from '../components/Footer';

const About = () => {
    return (
        <div className="min-h-screen pt-28">
            {/* Hero Section */}
            <section className="relative py-20 px-6 md:px-16 lg:px-24 xl:px-40 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                    <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-500/10 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[100px] rounded-full"></div>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 rounded-full text-brand-600 text-xs font-bold uppercase tracking-widest border border-brand-100">
                            <Sparkles className="size-3.5" />
                            Our Visionary Journey
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[0.9] tracking-tight">
                            Redefining the <br /> <span className="premium-text-gradient">Social Economy.</span>
                        </h1>
                        <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-xl">
                            SocialBazar was born from a simple observation: digital influence is the new real estate. We've built the world's most secure environment for trading high-value social assets.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="flex items-center gap-3 px-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                <Users2 className="size-5 text-brand-600" />
                                <div className="text-left">
                                    <p className="text-xl font-bold text-gray-900">12k+</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Active Users</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 px-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                <Globe className="size-5 text-indigo-600" />
                                <div className="text-left">
                                    <p className="text-xl font-bold text-gray-900">45+</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Countries</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-brand-500/20 to-indigo-500/20 blur-2xl rounded-[3rem] -z-10"></div>
                        <img 
                            src="/about_team.png" 
                            alt="Our Team" 
                            className="w-full rounded-[2.5rem] shadow-2xl border border-white/50 object-cover aspect-[4/3]"
                        />
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-gray-50/50">
                <div className="px-6 md:px-16 lg:px-24 xl:px-40">
                    <div className="text-center space-y-4 mb-20">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">The Pillars of <span className="text-brand-600">Trust.</span></h2>
                        <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto">We operate on three core principles that ensure our marketplace remains the gold standard for social media asset exchange.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { 
                                icon: ShieldCheck, 
                                title: 'Escrow Security', 
                                desc: 'We hold every payment in a secure neutral account until the asset transfer is verified by both parties and our audit team.',
                                color: 'bg-emerald-50 text-emerald-600'
                            },
                            { 
                                icon: Award, 
                                title: 'Verified Quality', 
                                desc: 'Every listing on SocialBazar undergoes a 12-point audit to verify engagement authenticity, history, and ownership.',
                                color: 'bg-brand-50 text-brand-600'
                            },
                            { 
                                icon: MessageCircle, 
                                title: 'Pro Support', 
                                desc: 'Our dedicated account managers provide 24/7 assistance to ensure smooth handovers and dispute resolution.',
                                color: 'bg-indigo-50 text-indigo-600'
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all card-hover group">
                                <div className={`size-16 rounded-2xl flex items-center justify-center mb-8 ${item.color} group-hover:scale-110 transition-transform`}>
                                    <item.icon className="size-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                                <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-24 px-6 md:px-16 lg:px-24 xl:px-40">
                <div className="bg-gray-900 rounded-[3rem] p-8 md:p-20 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    
                    <div className="max-w-3xl space-y-8 relative">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-brand-400 text-xs font-bold uppercase tracking-widest border border-white/10 backdrop-blur-sm">
                            <Target className="size-3.5" />
                            Our Mission
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                            Enabling anyone to <br /> <span className="text-brand-500">monetize </span> their digital legacy.
                        </h2>
                        <p className="text-xl text-gray-400 font-medium leading-relaxed">
                            We are building the infrastructure for the next generation of digital entrepreneurs. Whether you're an influencer moving to new projects or a brand looking for immediate reach, SocialBazar is your gateway to the digital frontier.
                        </p>
                        <div className="flex gap-6 pt-4">
                            <button className="px-8 py-4 bg-white text-gray-900 font-black rounded-2xl hover:scale-105 transition transform active:scale-95 shadow-xl">Get Started</button>
                            <button className="px-8 py-4 border-2 border-white/20 text-white font-black rounded-2xl hover:bg-white/5 transition px-6">Learn More</button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;