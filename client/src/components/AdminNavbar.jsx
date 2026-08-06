import { Link } from "react-router-dom"
import { Rocket } from "lucide-react"

const AdminNavbar = () => {

    return (
        <div className="flex items-center justify-between px-6 md:px-10 h-16 border-b border-gray-200 bg-white">
            <Link to="/" className='flex items-center gap-2 group transition-transform active:scale-95'>
                <div className='premium-gradient p-2 rounded-xl shadow-lg shadow-brand-500/20 group-hover:rotate-12 transition-transform duration-500'>
                    <Rocket className='size-5 text-white' />
                </div>
                <span className='font-black text-xl tracking-tighter text-gray-900 group-hover:premium-text-gradient transition-all'>
                    SocialBazar
                </span>
            </Link>
        </div>
    )
}

export default AdminNavbar