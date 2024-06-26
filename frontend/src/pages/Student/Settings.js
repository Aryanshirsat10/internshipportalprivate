import React from 'react'
import Sidebar from '../../components/Sidebar'
import Topsidebar from '../../components/Topsidebar'

const Settings = () => {
  return (
    <div className='min-[990px]:flex w-full h-screen'>
      <div className='min-[990px]:flex min-[990px]:flex-col bg-red-50 p-5 w-[20%] hidden'>
        <Sidebar/>
      </div>
      <div className='flex flex-col bg-red-50 h-fit min-[990px]:p-5 p-2 min-[990px]:hidden items-center'>
      <h3 className='text-xl font-semibold'>Internship Portal</h3>
      <div className='overflow-x-scroll w-screen pt-5'>
        <Topsidebar/>
      </div>
      </div>
      <div className='rounded-lg bg-slate-100 min-[990px]:w-[80%] p-5 overflow-y-auto h-full'>
      <div className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-500">Customize your internship portal experience.</p>
        </div>
        <div className="space-y-6">
          <div className='bg-white shadow-md shadow-gray-300 rounded-lg p-7'>
            <h2 className="text-xl font-bold">Notifications</h2>
            <p>Manage your notification preferences.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div className="space-y-2 flex gap-5 items-center">
                <h2 className="block text-lg font-medium text-gray-700">New Internship Postings</h2>
                <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" class="sr-only peer"/>
                <div class="group peer ring-0 bg-gray-300  rounded-full outline-none duration-300 after:duration-300 w-16 h-8  shadow-md peer-checked:bg-gray-900  peer-focus:outline-none after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:h-6 after:w-6 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-8 peer-hover:after:scale-95">
                </div>
                </label>
              </div>
              <div className="space-y-2 flex gap-5 items-center">
                <label htmlFor="push-notifications" className="block text-lg font-medium text-gray-700">Application Updates</label>
                <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" class="sr-only peer"/>
                <div class="group peer ring-0 bg-gray-300  rounded-full outline-none duration-300 after:duration-300 w-16 h-8  shadow-md peer-checked:bg-gray-900  peer-focus:outline-none after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:h-6 after:w-6 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-8 peer-hover:after:scale-95">
                </div>
                </label>
              </div>
              <div className="space-y-2 flex gap-5 items-center">
                <label htmlFor="deadline-notifications" className="block text-lg font-medium text-gray-700">Deadlines</label>
                <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" class="sr-only peer"/>
                <div class="group peer ring-0 bg-gray-300  rounded-full outline-none duration-300 after:duration-300 w-16 h-8  shadow-md peer-checked:bg-gray-900  peer-focus:outline-none after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:h-6 after:w-6 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-8 peer-hover:after:scale-95">
                </div>
                </label>
              </div>
            </div>
          </div>
          <div className='bg-white shadow-md shadow-gray-300 rounded-lg p-7'>
            <h2 className="text-xl font-bold">Privacy Settings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div className="space-y-2 flex gap-5 items-center">
                <label htmlFor="public-profile" className="block text-lg font-medium text-gray-700">Public Profile</label>
                <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" class="sr-only peer"/>
                <div class="group peer ring-0 bg-gray-300  rounded-full outline-none duration-300 after:duration-300 w-16 h-8  shadow-md peer-checked:bg-gray-900  peer-focus:outline-none after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:h-6 after:w-6 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-8 peer-hover:after:scale-95">
                </div>
                </label>
              </div>
              <div className="space-y-2 flex gap-5 items-center">
                <label htmlFor="share-application-data" className="block text-lg font-medium text-gray-700">Share Application Data</label>
                <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" class="sr-only peer"/>
                <div class="group peer ring-0 bg-gray-300  rounded-full outline-none duration-300 after:duration-300 w-16 h-8  shadow-md peer-checked:bg-gray-900  peer-focus:outline-none after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:h-6 after:w-6 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-8 peer-hover:after:scale-95">
                </div>
                </label>
              </div>
            </div>
          </div>
          <div className='bg-white shadow-md shadow-gray-300 rounded-lg p-7'>
            <h2 className="text-xl font-bold">Appearance Settings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div className="space-y-2 flex gap-5 items-center">
                <label htmlFor="theme" className="block text-lg font-medium text-gray-700">Theme</label>
                <select id="theme" className="mt-1 block w-15 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button className="px-4 py-2 font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">Save Changes</button>
        </div>
      </div>
    </div>
      </div>
      </div>
  )
}

export default Settings