import React, { useEffect, useState } from 'react'
import InterncoSidebar from '../../components/InterncoSidebar'
import TopInternCoSidebar from '../../components/TopInternCoSidebar'
import Cookies from 'js-cookie';
import ApplicationCard from '../../components/Applicationcard';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // Fetch all applications
        const response = await fetch(`${process.env.REACT_APP_API_URL}/getapplications`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': Cookies.get('token'),
            'x-session-id': Cookies.get('sessionId'),
          },
        });
        const applicationsData = await response.json();
        // console.log(applicationsData);
        // Fetch details for each application
        const detailedApplications = await Promise.all(applicationsData.map(async (application) => {
          // Fetch internship details
          const internshipResponse = await fetch(`${process.env.REACT_APP_API_URL}/getsingleinternship`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': Cookies.get('token'),
              'x-session-id': Cookies.get('sessionId'),
            },
            body: JSON.stringify({ internshipId: application.internship }),
          });
          const internshipData = await internshipResponse.json();

          // Fetch student details
          const studentResponse = await fetch(`${process.env.REACT_APP_API_URL}/faculty/getstudent`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': Cookies.get('token'),
              'x-session-id': Cookies.get('sessionId'),
            },
            body: JSON.stringify({ studentId: application.student}),
          });
          const studentData = await studentResponse.json();

          return {
            ...application,
            internship: internshipData,
            student: studentData,
          };
        }));
        console.log(detailedApplications);
        setApplications(detailedApplications);
      } catch (error) {
        console.log('Failed to fetch applications', error);
      }
    };

    fetchApplications();
  }, []);
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
        <h1 className="flex flex-col text-3xl font-bold items-start">Applications for Certificate</h1>
        <div className="flex flex-wrap">
          {applications.map((application) => (
            <ApplicationCard key={application._id} applicationData={application} />
          ))}
        </div>
        </div>
        </div>
  )
}

export default Applications