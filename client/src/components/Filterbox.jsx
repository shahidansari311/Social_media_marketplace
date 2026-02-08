import { ChevronDown, CrossIcon, FilterIcon, X } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';

const Filterbox = ({ phone, setPhone, filters, setFilters }) => {

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setsearch] = useState(searchParams.get("search") || "");


    const onsearchchange = (e) => {
        if (e.target.value) {
            setSearchParams({ search: e.target.value });
            setsearch(e.target.value);
        }
        else {
            navigate('/Marketplace');
            setsearch("");
        }
    }

    const [expanded, setExpanded] = useState({
        platform: true,
        price: true,
        followers: true,
        niche: true,
        status: true,
    });

    const toggleSection = (section) => {
        setExpanded((prev) => ({ ...prev, [section]: !prev[section] }))
    }

    const onfilterchange = (newfilter) => {
        setFilters({ ...filters, ...newfilter });
    }

    const platforms = [
        { value: "youtube", label: "Youtube" },
        { value: "instagram", label: "Instagram" },
        { value: "tiktok", label: "Tiktok" },
        { value: "facebook", label: "Facebook" },
        { value: "twitter", label: "Twitter" },
        { value: "linkedin", label: "LinkedIn" },
        { value: "discord", label: "Discord" },
    ]

    const statuses = [
        {value:"verified", label:"Verified account only"},
        {value:"monetized", label:"Monetized account only"},
    ]

    const niches=[
        // {value:"All",label:"All niches"},
        {value:"lifestyle", label:"Lifestyle"},
        {value:"fitness", label:"Fitness"},
        {value:"food", label:"Food"},
        {value:"travel", label:"Travel"},
        {value:"tech", label:"Technology"},
        {value:"gaming", label:"Gaming"},
        {value:"fashion", label:"Fashion"},
        {value:"beauty", label:"Beauty"},
        {value:"business", label:"Business"},
        {value:"education", label:"Education"},
        {value:"enterntainment", label:"Entertainment"},
        {value:"music", label:"Music"},
        {value:"art", label:"Art"},
        {value:"sports", label:"Sports"},
        {value:"health", label:"Health"},
        {value:"finance", label:"Finance"},
    ]

    const currency = import.meta.env.VITE_CURRENCY || "$";

    const onclearfilter=()=>{
       if(search){
        navigate('/marketplace');
       } 
       setsearch("");
       setFilters({
            platform:null,
            maxPrice: 100000,
            minFollowers:0,
            niche:null,
            verified:false,
            monetized:false
       })
    }

    return (
        <div className={`${phone ? "max-sm:fixed" : "max-sm:hidden"} max-sm:inset-0 z-100 max-sm:h-screen max-sm:overflow-scroll bg-white rounded-xl shadow-sm border border-gray-200 h-fit sticky top-24 md:min-w-[300px]`}>
            <div className='p-4 border border-gray-200 rounded-xl'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2 text-gray-700'>
                        <FilterIcon className='size-4' />
                        <h3 className='font-semibold'>Filters</h3>
                    </div>
                    <div className='flex items-center gap-2'>
                        <X onClick={onclearfilter} className='size-6
                    text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer'/>
                        <button
                            onClick={() => setPhone(false)} className='sm:hidden text-sm border text-gray-700 px-3 py-1 rounded'>Apply</button>
                    </div>
                </div>
            </div>
            <div className='p-4 space-y-6 sm:max-h-[calc(100vh-200px)] overflow-y-scroll no-scrollbar'>
                {/* Search Bar */}
                <div className='flex items-center justify-between'>
                    <input type="text" placeholder='Search by username, platform , niche , etc.' className='w-full text-sm px-3 py-2 border border-gray-300 rounded-md outline-indigo-500' onChange={onsearchchange} value={search} />
                </div>
                
                {/* Platform filter */}
                <div>
                    <button className='flex items-center justify-between w-full mb-3' onClick={() => toggleSection("platform")}>
                        <label className='text-sm font-medium text-gray-800'>
                            Platform
                        </label>
                        <ChevronDown className={`size-4 transition transform ${expanded.platform ? "rotate-180" : ""} `} />
                    </button>
                    {expanded.platform && (
                        <div className='flex flex-col gap-2'>
                            {platforms.map((platform) => (
                                <label key={platform.value} className='flex items-center gap-2 text-gray-700 text-sm'>
                                    <input type="checkbox" checked={filters.platform?.includes(platform.value) || false} onChange={(e) => {
                                        const checked = e.target.checked;
                                        const current = filters.platform || [];
                                        const updated = checked ? [...current, platform.value] : current.filter((p) => p !== platform.value);

                                        onfilterchange({
                                            ...filters,
                                            platform: updated.length > 0 ? updated : null
                                        })
                                    }} />
                                    <span>{platform.label}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Price range */}
                <div>
                    <button className='flex items-center justify-between w-full mb-3' onClick={() => toggleSection("price")}>
                        <label className='text-sm font-medium text-gray-800'>
                            Price Range
                        </label>
                        <ChevronDown className={`size-4 transition transform ${expanded.price ? "rotate-180" : ""} `} />
                    </button>
                    {expanded.price && (
                        <div className='space-y-3'>
                            <input type="range" min="0" max="1000000" step="100" value={filters.maxPrice || 1000000} onChange={(e)=>onfilterchange({...filters, maxPrice:parseInt(e.target.value)})} className='w-full h-2 bg-gray-200 rounded-ls appearance-none cursor-pointer accent-indigo-600 rounded-2xl' />
                            <div className='flex items-center justify-between text-sm text-gray-600'>
                                <span>{currency} 0</span>
                                <span>{currency} {(filters.maxPrice || 100000 ).toLocaleString()}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Minimum followers */}
                <div>
                    <button className='flex items-center justify-between w-full mb-3' onClick={() => toggleSection("followers")}>
                        <label className='text-sm font-medium text-gray-800'>
                            Minimum Followers
                        </label>
                        <ChevronDown className={`size-4 transition transform ${expanded.followers ? "rotate-180" : ""} `} />
                    </button>
                    {expanded.followers && (
                        <select className='w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 outline-indigo-500'
                        value={filters.minFollowers?.toString() || "0"} 
                        onChange={(e)=>onfilterchange({...filters, minFollowers : parseInt(e.target.value) || 0 })}>
                            <option value="0">
                                Any amount
                            </option>
                            <option value="1000">
                                1K+
                            </option>
                            <option value="50000">
                                50K+
                            </option>
                            <option value="10000">
                                100K+
                            </option>
                            <option value="500000">
                                500K+
                            </option>
                        </select>
                    )}
                    
                </div>
                
                {/* Niche */}
                <div>
                    <button className='flex items-center justify-between w-full mb-3' onClick={() => toggleSection("niche")}>
                        <label className='text-sm font-medium text-gray-800'>
                            Niche
                        </label>
                        <ChevronDown className={`size-4 transition transform ${expanded.niche ? "rotate-180" : ""} `} />
                    </button>

                    {expanded.niche && (
                        <select className='w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 outline-indigo-500'
                        value={filters.niche || ""}
                        onChange={(e)=>onfilterchange({...filters,niche:e.target.value || null })}>
                            <option>All niches</option>
                            {niches.map((nich,index)=>(
                                <option key={nich.value} value={nich.value}>{nich.label}</option>
                            ))}
                        </select>
                    )}

                </div>
                
                {/* Account Status */}
                <div>
                    <button className='flex items-center justify-between w-full mb-3' onClick={() => toggleSection("status")}>
                        <label className='text-sm font-medium text-gray-800'>
                            Account Status
                        </label>
                        <ChevronDown className={`size-4 transition transform ${expanded.status ? "rotate-180" : ""} `} />
                    </button>
                    {expanded.status && (
                        <div className='flex flex-col gap-2'>
                            {statuses.map((status) => (
                                <label key={status.value} className='flex items-center gap-2 text-gray-700 text-sm'>
                                    <input type="checkbox" checked={filters.status ?.includes(status.value) || false} onChange={(e) => {
                                        const checked = e.target.checked;
                                        const current = filters.status || [];
                                        const updated = checked ? [...current, status.value] : current.filter((p) => p !== status.value);

                                        onfilterchange({
                                            ...filters,
                                            status: updated.length > 0 ? updated : null
                                        })
                                    }} />
                                    <span>{status.label}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default Filterbox