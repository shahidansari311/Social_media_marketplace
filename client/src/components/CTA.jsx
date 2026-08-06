import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Rocket, ArrowRight } from 'lucide-react'

const CTA = () => {
  const navigate = useNavigate();

  return (
        <div className="max-w-5xl mx-2 mb-20 md:mx-auto p-px rounded-[2.5rem] bg-gradient-to-r from-brand-600/20 to-indigo-600/30">
            <div className="flex flex-col items-center justify-center text-center py-12 md:py-16 rounded-[calc(2.5rem-1px)] bg-gradient-to-r from-brand-50 to-indigo-50">  
                <div className="flex items-center justify-center bg-white px-3 py-1.5 shadow gap-1.5 rounded-full text-xs">
                    <Rocket className="size-3.5 text-brand-600" />
                    <span className="premium-text-gradient font-bold">Trusted by Millions</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-black mt-4 leading-[1.2] text-gray-900 tracking-tight">
                    Sell Your Social Accounts <br />
                    <span className="premium-text-gradient">with Confidence </span> 
                    & Earn money.
                </h2>
                <p className="text-gray-500 mt-3 max-w-lg max-md:text-sm font-medium">We are the leading social media marketplace that connects brands with their customers with our user-friendly interface.</p>
                <button 
                    onClick={() => navigate('/create-listing')}
                    type="button" 
                    className="premium-gradient text-white text-sm px-7 py-3 rounded-2xl font-bold mt-6 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-brand-500/20 flex items-center gap-2"
                > 
                    Get Started Today <ArrowRight className="size-4" />
                </button>
            </div>
    </div>
  )
}

export default CTA