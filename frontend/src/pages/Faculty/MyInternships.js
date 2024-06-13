import React, { useEffect, useState } from 'react'
import InternshipCard from '../../components/InternshipsCard'
import FacultySidebar from '../../components/FacultySidebar';
import Cookies from "js-cookie";

const MyInternship = () => {
    const [internships, setInternships] = useState([]);

    const fetchInternships = async () => {

      try {
        const response = await fetch("http://localhost:5000/api/faculty/myinternships",{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': Cookies.get('token'),
                'x-session-id':Cookies.get('sessionId')
            },
        })
        // setInternships(response.data);
        const data = await response.json();
        setInternships(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching internships:', error);
      }
    };
  useEffect(() => {
    fetchInternships();
  }, []);
  return (
    <div className='flex w-screen h-screen '>
      <div className='flex-col bg-red-50 p-5 w-[15%] '>
        <FacultySidebar/>
      </div>
      <div className='rounded-lg bg-slate-100 w-[85%] p-5'>
        <h1 className='text-xl font-bold'>Current Internships</h1>
        <div className="flex flex-wrap w-full">
        {internships.map((internship) => (
          <InternshipCard key={internship._id} internship={internship} />
        ))}
      </div>
      <div className='absolute w-16 h-16 flex bottom-5 rounded-full bg-rose-500 right-5 items-center justify-center shadow-xl'>
        <img src='/assets/plus.svg' className='w-8 h-8'/>
      </div>
      </div>
    </div>
  )
}

export default MyInternship