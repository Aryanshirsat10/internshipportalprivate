import React from 'react'
import InterncoSidebar from '../../components/InterncoSidebar'
import TopInternCoSidebar from '../../components/TopInternCoSidebar'

const InternshipCoordinatorDashboard = () => {
  return (
    <div className='min-[990px]:flex w-full h-screen'>
      <div className='min-[990px]:flex min-[990px]:flex-col bg-red-50 p-5 w-[20%] hidden'>
        <InterncoSidebar/>
      </div>
      <div className='flex flex-col bg-red-50 h-fit min-[990px]:p-5 p-2 min-[990px]:hidden items-center'>
      <h3 className='text-xl font-semibold'>Internship Portal</h3>
      <div className='overflow-x-scroll w-screen pt-5'>
        <TopInternCoSidebar/>
      </div>
      </div>
      <div className='rounded-lg bg-slate-100 min-[990px]:w-[80%] p-5 overflow-y-auto h-full'>
        <h1 className="flex flex-col text-3xl font-bold items-start">Welcome back</h1>
    </div>
    </div>
  )
}

export default InternshipCoordinatorDashboard