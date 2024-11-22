import React, { useEffect, useState } from 'react';
import InternshipCard from '../../components/InternshipsCard';
import Sidebar from '../../components/Sidebar';
import Cookies from 'js-cookie';
import Topsidebar from '../../components/Topsidebar';

// Skeleton loader component
const SkeletonLoader = () => (
  <div className="animate-pulse flex space-x-4">
    <div className="rounded-lg bg-gray-300 h-40 w-80"></div> {/* Placeholder for image */}
    <div className="flex-1 space-y-4 py-1">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div> {/* Placeholder for title */}
      <div className="h-4 bg-gray-300 rounded"></div> {/* Placeholder for company */}
      <div className="h-4 bg-gray-300 rounded w-1/2"></div> {/* Placeholder for location */}
      <div className="flex space-x-4">
        <div className="h-4 bg-gray-300 rounded w-1/4"></div> {/* Placeholder for start date */}
        <div className="h-4 bg-gray-300 rounded w-1/4"></div> {/* Placeholder for duration */}
        <div className="h-4 bg-gray-300 rounded w-1/4"></div> {/* Placeholder for apply by */}
      </div>
    </div>
  </div>
);

const MyInternship = () => {
  const [internships, setInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  const fetchInternships = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/student/myinternships`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': Cookies.get('token'),
          'x-session-id': Cookies.get('sessionId'),
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch internships');
      }

      const data = await response.json();
      console.log(data);
      setInternships(data);
      setIsLoading(false); // Set loading to false after data is fetched
      console.log(data);
    } catch (error) {
      console.error('Error fetching internships:', error);
      setIsLoading(false); // Set loading to false on error
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  return (
    <div className='min-[990px]:flex w-screen h-screen'>
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
        <h1 className='text-xl font-bold'>Current Internships</h1>
        {isLoading ? (
          // Display skeleton loader while loading
          <>
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
          </>
        ) : internships.length === 0 ? (
          <p>No ongoing internships.</p>
        ) : (
          // Display internships once loaded
          <div className='flex flex-wrap w-full'>
            {internships.map((internship) => (
              <InternshipCard key={internship._id} internship={internship} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyInternship;
