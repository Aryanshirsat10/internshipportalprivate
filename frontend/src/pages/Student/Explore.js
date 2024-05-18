import React from 'react'
import Sidebar from '../../components/Sidebar'

const Explore = () => {
  return (
    <div className='flex w-full h-screen '>
      <div className='flex-col bg-red-50 p-5 w-[15%] '>
        <Sidebar/>
      </div>
      <div className='rounded-lg bg-slate-100 w-[85%] p-5'>
        <h1 className='text-xl font-bold'>Explore</h1>
      </div>
    </div>
  )
}

export default Explore