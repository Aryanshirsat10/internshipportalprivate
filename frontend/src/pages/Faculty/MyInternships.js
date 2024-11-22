import React, { useEffect, useState } from 'react'
import InternshipCard from '../../components/InternshipsCard'
import FacultySidebar from '../../components/FacultySidebar';
import Cookies from "js-cookie";
import AddInternship from '../../components/AddInternship';
import TopfacultySidebar from '../../components/TopfacultySidebar';

const MyInternship = () => {
    const [internships, setInternships] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const togglePopup = () => {
      setIsModalOpen(true);
    };
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };

    const fetchInternships = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/faculty/myinternships`,{
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
    <div className='min-[990px]:flex w-screen h-screen '>
      <div className='min-[990px]:flex min-[990px]:flex-col bg-red-50 p-5 w-[20%] hidden'>
        <FacultySidebar/>
      </div>
      <div className='flex flex-col bg-red-50 h-fit min-[990px]:p-5 p-2 min-[990px]:hidden items-center'>
      <h3 className='text-xl font-semibold'>Internship Portal</h3>
      <div className='overflow-x-scroll w-screen pt-5'>
        <TopfacultySidebar/>
      </div>
      </div>
      <div className='rounded-lg bg-slate-100 min-[990px]:w-[80%] p-5 overflow-y-auto h-full'>
        <h1 className='text-xl font-bold'>Current Internships</h1>
        <div className="flex flex-wrap w-full">
        {internships.map((internship) => (
          <InternshipCard key={internship._id} internship={internship} />
        ))}
      </div>
      <div className='absolute w-16 h-16 flex bottom-5 rounded-full bg-rose-500 right-5 items-center justify-center shadow-xl hover:bg-rose-600' onClick={togglePopup}>
        <img src='/assets/plus.svg' className='w-8 h-8'/>
      </div>
      {isModalOpen && <AddInternship showModal={isModalOpen} handleCloseModal={handleCloseModal} />}
      </div>
    </div>
  )
}

export default MyInternship