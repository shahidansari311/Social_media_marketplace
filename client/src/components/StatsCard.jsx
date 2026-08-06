import React from 'react'

const StatsCard = ({title, value ,icon ,color}) => {

    const colorMap={             
        indigo:'bg-indigo-50',
        green:'bg-green-50',
        yellow:'bg-yellow-50'
    }

  return (
    <div className='glass-card rounded-3xl p-6 card-hover'>
        <div className='flex items-center justify-between'>
            <div>
                <p className='text-sm font-bold text-gray-400 uppercase tracking-wider'>{title}</p>
                <p className='text-2xl font-black text-gray-900 mt-1'>{value}</p>
            </div>
            <div className={`size-12 ${colorMap[color]} rounded-2xl flex items-center justify-center`}>
                {icon}
            </div>
        </div>
    </div>
  )
}

export default StatsCard