import { Sparkles } from 'lucide-react';

const AdminTitle = ({ text1, text2, subtitle }) => {
    return (
        <div className='space-y-1'>
            <div className='flex items-center gap-2'>
                <Sparkles className='size-4 text-brand-500' />
                <span className='text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]'>{text1}</span>
            </div>
            <h1 className='text-2xl md:text-3xl font-black text-gray-900 tracking-tight'>
                {text2}
            </h1>
            {subtitle && <p className='text-sm text-gray-500 font-medium'>{subtitle}</p>}
        </div>
    )
}

export default AdminTitle