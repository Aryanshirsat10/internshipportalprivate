import React from 'react'
import FacultySidebar from '../../components/FacultySidebar'
import TopfacultySidebar from '../../components/TopfacultySidebar'

const FacultyProfile = () => {
  return (
    <div className='min-[990px]:flex w-screen h-screen'>
        <div className='min-[990px]:flex min-[990px]:flex-col bg-red-50 p-5 w-[20%] hidden'>
        <FacultySidebar/>
      </div>
      <div className='flex flex-col bg-red-50 h-fit min-[990px]:p-5 p-2 min-[990px]:hidden items-center'>
      <h3 className='text-xl font-semibold'>Internship Portal</h3>
      <div className='overflow-x-scroll w-screen pt-5'>
        <TopfacultySidebar/>
      </div>
      </div>
        <div className='flex min-[990px]:w-[80%]'>
            
        </div>
        
    </div>
  )
}

export default FacultyProfile