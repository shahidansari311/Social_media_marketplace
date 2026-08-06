import { XIcon, CheckCircleIcon, BadgeInfoIcon, GlobeIcon, UserIcon, Sparkles } from "lucide-react";
import { useEffect } from "react";

const ListingDetailsModal = ({ listing, onClose }) => {
    
    const currency = import.meta.env.VITE_CURRENCY || "$";

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => (document.body.style.overflow = "auto");
    }, []);

    const getStatusColor = (status) => {
        const colors = {
            active: 'bg-emerald-50 text-emerald-700 border-emerald-100',
            inactive: 'bg-gray-50 text-gray-600 border-gray-100',
            sold: 'bg-indigo-50 text-indigo-700 border-indigo-100',
            ban: 'bg-red-50 text-red-700 border-red-100',
            deleted: 'bg-gray-100 text-gray-500 border-gray-200',
            pending: 'bg-amber-50 text-amber-700 border-amber-100',
        };
        return colors[status] || colors.inactive;
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="premium-gradient text-white p-6 rounded-t-3xl flex items-center justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="flex flex-col relative">
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="size-3.5 text-white/70" />
                            <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Listing Details</span>
                        </div>
                        <h3 className="font-bold text-lg">{listing.title}</h3>
                        <p className="text-sm text-white/70">
                            @{listing.username} on <span className="capitalize">{listing.platform}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="ml-4 p-2 hover:bg-white/10 rounded-xl transition-colors relative">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto space-y-6 text-gray-700">
                    {/* Image Carousel */}
                    {listing.images?.length > 0 && (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {listing.images.map((img, i) => (
                                <img key={i} src={img} alt={`${listing.title}-${i}`} className="rounded-2xl border border-gray-100 object-cover aspect-video" />
                            ))}
                        </div>
                    )}

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                        <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Followers</p>
                            <p className="text-lg font-black text-gray-900">{listing.followers_count?.toLocaleString()}</p>
                        </div>
                        <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Engagement</p>
                            <p className="text-lg font-black text-gray-900">{listing.engagement_rate}%</p>
                        </div>
                        <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Monthly Views</p>
                            <p className="text-lg font-black text-gray-900">{listing.monthly_views?.toLocaleString()}</p>
                        </div>
                        <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Niche</p>
                            <p className="text-base font-bold text-gray-900 capitalize">{listing.niche}</p>
                        </div>
                        <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Country</p>
                            <p className="text-base font-bold text-gray-900">{listing.country || '—'}</p>
                        </div>
                        <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Age Range</p>
                            <p className="text-base font-bold text-gray-900">{listing.age_range || '—'}</p>
                        </div>
                    </div>

                    {/* Description */}
                    {listing.description && (
                        <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100">
                            <h4 className="font-bold mb-2 flex items-center gap-1.5 text-sm text-gray-400 uppercase tracking-wider">
                                <BadgeInfoIcon className="w-4 h-4 text-brand-500" /> Description
                            </h4>
                            <p className="text-sm leading-relaxed text-gray-600">{listing.description}</p>
                        </div>
                    )}

                    {/* Status / Verification */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(listing.status)}`}>
                            {listing.status}
                        </span>
                        {listing.verified && (
                            <span className="flex items-center gap-1 text-[10px] font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100 uppercase tracking-wider">
                                <CheckCircleIcon size={10} /> Verified
                            </span>
                        )}
                        {listing.monetized && <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-wider">Monetized</span>}
                        {listing.featured && <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-3 py-1 rounded-full border border-amber-100 uppercase tracking-wider">Featured</span>}
                        {listing.platformAssured && <span className="text-[10px] font-bold bg-cyan-50 text-cyan-600 px-3 py-1 rounded-full border border-cyan-100 uppercase tracking-wider">Platform Assured</span>}
                    </div>

                    {/* Owner Info */}
                    {listing.owner && (
                        <div className="border-t border-gray-100 pt-5">
                            <h4 className="font-bold mb-3 flex items-center gap-1.5 text-sm text-gray-400 uppercase tracking-wider">
                                <UserIcon className="w-4 h-4 text-gray-400" /> Owner
                            </h4>
                            <div className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                                <img src={listing.owner.image} alt={listing.owner.name} className="size-10 rounded-xl object-cover border border-gray-200" />
                                <div>
                                    <p className="font-bold text-gray-900">{listing.owner.name}</p>
                                    <p className="text-xs text-gray-500">{listing.owner.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Customer Info */}
                    {listing.customer && (
                        <div className="border-t border-gray-100 pt-5">
                            <h4 className="font-bold mb-3 flex items-center gap-1.5 text-sm text-gray-400 uppercase tracking-wider">
                                <UserIcon className="w-4 h-4 text-gray-400" /> Customer
                            </h4>
                            <div className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                                <img src={listing.customer.image} alt={listing.customer.name} className="size-10 rounded-xl object-cover border border-gray-200" />
                                <div>
                                    <p className="font-bold text-gray-900">{listing.customer.name}</p>
                                    <p className="text-xs text-gray-500">{listing.customer.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Price Section */}
                    <div className="border-t border-gray-100 pt-5 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                            <GlobeIcon size={14} /> Listed on {new Date(listing.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <p className="text-xl font-black premium-text-gradient">{currency}{listing.price?.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingDetailsModal;
