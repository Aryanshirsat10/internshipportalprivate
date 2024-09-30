import React from 'react'
import { Popover, PopoverTrigger, PopoverContent } from "../../components/ui/popover"
import { Button } from "../../components/ui/button"
import { Calendar } from "../../components/ui/calendar"
import InterncoSidebar from '../../components/InterncoSidebar'
import TopInternCoSidebar from '../../components/TopInternCoSidebar'

const Reports = () => {
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
      {/* <h1 className="flex flex-col text-3xl font-bold items-start">Welcome back</h1> */}
    <div className="container mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Download Reports</h1>
          <p className="mt-2 text-muted-foreground">Select a date range to download your reports.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="start-date">Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button id="start-date" variant="outline" className="w-full justify-start font-normal">
                  <CalendarDaysIcon className="mr-2 h-4 w-4" />
                  <span>Select start date</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <label htmlFor="end-date">End Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button id="end-date" variant="outline" className="w-full justify-start font-normal">
                  <CalendarDaysIcon className="mr-2 h-4 w-4" />
                  <span>Select end date</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex justify-end">
          <Button className="w-full sm:w-auto bg-black text-white">Download</Button>
        </div>
      </div>
    </div>
    </div>
    </div>
  )

}

function CalendarDaysIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  )
}


function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}


export default Reports