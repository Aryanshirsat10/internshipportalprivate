import React, { useState } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from "../../components/ui/popover"
import { Button } from "../../components/ui/button"
import { Calendar } from "../../components/ui/calendar"
import SuperAdminSidebar from '../../components/SuperAdminSidebar'
import TopSuperAdminSidebar from '../../components/TopSuperAdmin'

const columns = [
  'Project Title',
  'Mentor Name',
  'Mentor Email',
  'Name of Students',
  'Branch',
  'Class',
  'Student Email',
  'Mobile No',
  'Status',
  'Duration in hrs',
  'Starting Date',
  'Completion Date',
  'Remark'
];

const SuperReports = () => {
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Handle selecting or deselecting all columns
  const handleSelectAll = () => {
    if (selectedColumns.length === columns.length) {
      setSelectedColumns([]); // Deselect all
    } else {
      setSelectedColumns(columns); // Select all
    }
  };

  // Handle individual column selection
  const handleColumnSelection = (column) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter((col) => col !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };

  const handleDownload = async () => {
    try {
      console.log(startDate,endDate,selectedColumns);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/download-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate,
          endDate,
          selectedColumns
        }),
      });
  
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reports.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        console.error('Failed to download report');
      }
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };
  
  return (
    <div className="min-[990px]:flex w-full h-screen">
      <div className="min-[990px]:flex min-[990px]:flex-col bg-red-50 p-5 w-[20%] hidden">
        <SuperAdminSidebar />
      </div>
      <div className="flex flex-col bg-red-50 h-fit min-[990px]:p-5 p-2 min-[990px]:hidden items-center">
        <h3 className="text-xl font-semibold">Internship Portal</h3>
        <div className="overflow-x-scroll w-screen pt-5">
          <TopSuperAdminSidebar />
        </div>
      </div>
      <div className="rounded-lg bg-slate-100 min-[990px]:w-[80%] p-5 overflow-y-auto h-full">
        <div className="container mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Download Reports</h1>
              <p className="mt-2 text-muted-foreground">Select a date range and columns to download your report.</p>
            </div>

            {/* Date Range Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="start-date">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button id="start-date" variant="outline" className="w-full justify-start font-normal">
                      <CalendarDaysIcon className="mr-2 h-4 w-4" />
                      <span>{startDate ? startDate.toLocaleDateString() : "Select start date"}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single"  selected={startDate} onSelect={setStartDate}/>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label htmlFor="end-date">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button id="end-date" variant="outline" className="w-full justify-start font-normal">
                      <CalendarDaysIcon className="mr-2 h-4 w-4" />
                      <span>{endDate ? endDate.toLocaleDateString() : "Select end date"}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate}/>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Column Selection Dropdown */}
            <div>
              <h2 className="text-xl font-semibold">Select Columns</h2>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start font-normal overflow-auto hide-scrollbar">
                    <span>{selectedColumns.length >=1 ? selectedColumns.join(', ') :"Select columns"}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="select-all"
                      checked={selectedColumns.length === columns.length}
                      onChange={handleSelectAll}
                    />
                    <label htmlFor="select-all" className="text-sm">
                      Select All
                    </label>
                  </div>
                  <hr className="my-2" />
                  <div className="max-h-48 overflow-y-auto">
                    {columns.map((column, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`column-${index}`}
                          checked={selectedColumns.includes(column)}
                          onChange={() => handleColumnSelection(column)}
                        />
                        <label htmlFor={`column-${index}`} className="text-sm">
                          {column}
                        </label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Download Button */}
            <div className="flex justify-end">
              <Button
                className="w-full sm:w-auto bg-black text-white"
                onClick={handleDownload}
              >
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



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


export default SuperReports