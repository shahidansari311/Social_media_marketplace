import { Link } from "react-router-dom"
import { Rocket, ArrowLeft } from "lucide-react"
import { UserButton } from "@clerk/clerk-react"

const AdminNavbar = () => {

    return (
        <div className="relative flex items-center justify-between px-6 md:px-10 h-16 bg-gray-900 text-white">
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent"></div>
            
            <div className="flex items-center gap-6">
                <Link to="/admin" className='flex items-center gap-2 group transition-transform active:scale-95'>
                    <div className='premium-gradient p-2 rounded-xl shadow-lg shadow-brand-500/30 group-hover:rotate-12 transition-transform duration-500'>
                        <Rocket className='size-5 text-white' />
                    </div>
                    <span className='font-black text-xl tracking-tighter text-white'>
                        SocialBazar
                    </span>
                    <span className='text-[10px] font-bold bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full uppercase tracking-widest border border-brand-500/20'>
                        Admin
                    </span>
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <Link to="/" className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-white/5">
                    <ArrowLeft className="size-4" />
                    <span className="hidden sm:inline">Back to Site</span>
                </Link>
                <div className="h-6 w-px bg-white/10"></div>
                <UserButton afterSignOutUrl="/" />
            </div>
        </div>
    )
}

export default AdminNavbar