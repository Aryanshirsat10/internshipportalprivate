import React, { useEffect, useState } from 'react';
import { MdOutlineLocationOn } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Cookies from 'js-cookie';
import CertificateModal from '../../components/CertificateModal';
import { toast } from 'react-toastify';

const ApplicationDetail = () => {
  const location = useLocation();
  const [faculty,setFaculty] = useState();
  const navigate = useNavigate();
  const { applicationData } = location.state || {};
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [icKjsceInternshipCell, setIcKjsceInternshipCell] = useState('');

  const internship = applicationData?.internship || {};
  const student = applicationData?.student || {};
  // console.log(applicationData);
  const formatDate = (date) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('en-US', { month: 'short' });
    const year = dateObj.getFullYear().toString().slice(-2);
    return `${day} ${month} '${year}`;
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return `${totalMonths} ${totalMonths === 1 ? 'month' : 'months'}`;
  };

  const formattedStartDate = formatDate(internship.startDate);
  const duration = calculateDuration(internship.startDate, internship.endDate);
  const formattedApplyDate = formatDate(internship.applicationDeadline);

  const generateShareableLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const queryParams = new URLSearchParams({
      title: internship.title,
      company: internship.company,
      startDate: internship.startDate,
      endDate: internship.endDate,
      applicationDeadline: internship.applicationDeadline,
      skillsRequired: JSON.stringify(internship.skillsRequired),
      internshipId: internship.internshipId,
    }).toString();
    return `${baseUrl}?${queryParams}`;
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitModal = (icKjsceInternshipCell) => {
    setIcKjsceInternshipCell(icKjsceInternshipCell);
    handleGenerateCertificate(icKjsceInternshipCell); // Call the function with input
  };

  useEffect(()=>{
    const fetchFaculty = async(facultyid)=>{
      // console.log(facultyid)
      const response = await fetch(`${process.env.REACT_APP_API_URL}/getfacutly/${facultyid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': Cookies.get('token'),
          'x-session-id': Cookies.get('sessionId'),
        },
      });
      if(response.ok){
        const faculty = await response.json();
        // console.log(faculty);
        setFaculty(faculty);
      }
    }
    fetchFaculty(internship.postedby);
  },[internship.postedby]);

  const handleGenerateCertificate = async(icKjsceInternshipCell) => {
    if (applicationData?.certificateIssued === 'yes') {
      toast.warning('Certificate already generated.');
      return;
    }

    const { name } = student;
    const { startDate, endDate, title } = internship;
    const facultyName = faculty?.name;
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/generate-certificate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': Cookies.get('token'),
          'x-session-id': Cookies.get('sessionId'),
        },
        body: JSON.stringify({
          name,
          studentId:student._id,
          facultyName,
          startDate,
          endDate,
          title,
          internshipId: internship._id,
          icKjsceInternshipCell,
        }),
      });
    if(response.status == 401){
      navigate(0);
    }
      if (response.ok) {
        // Check if the response is a PDF
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/pdf')) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          
          // Create a hidden link and trigger the download
          const link = document.createElement('a');
          link.href = url;
          link.download = 'certificate.pdf';
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          
          // Clean up
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          navigate(0);
        } else {
          throw new Error('Received non-PDF response from server');
        }
      } else {
        // If response is not OK, try to get error message from response
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to generate certificate');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`An error occurred while generating the certificate: ${error.message}`);
    }
  };
  

  return (
    <div className='w-screen h-screen flex flex-col items-center justify-center p-5 overflow-x-hidden'>
      <h1 className='flex font-bold text-3xl pb-5 mt-5'>{internship.title}</h1>
      <div className='flex flex-col w-3/5 h-fit border-gray-400 items-center p-7 overflow-y-scroll rounded-lg shadow-lg shadow-gray-400'>
        <div className='flex flex-col w-full border-b-2 border-gray-300'>
          <div className='flex flex-col w-full'>
            <h3 className='flex text-xl text-black font-semibold'>{internship.title}</h3>
            <h5 className='flex text-lg text-slate-400 font-medium'>{internship.company}</h5>
          </div>
          <p className='text-md font-normal flex flex-row pt-7'>
            <MdOutlineLocationOn style={{ fontSize: 20 }} />
            {internship.location}
          </p>
          <div className='flex flex-row gap-20 pt-5 pb-5'>
            <div className='flex flex-col items-center'>
              <span className='text-slate-500 font-medium'>Start Date</span>
              <span className='text-slate-500 font-medium'>{formattedStartDate}</span>
            </div>
            <div className='flex flex-col items-center'>
              <span className='text-slate-500 font-medium'>Duration</span>
              <span className='text-slate-500 font-medium'>{duration}</span>
            </div>
            <div className='flex flex-col items-center'>
              <span className='text-slate-500 font-medium'>Apply By</span>
              <span className='text-slate-500 font-medium'>{formattedApplyDate}</span>
            </div>
          </div>
          <div className='flex flex-row justify-end'>
            {/* <p className='flex pb-5 font-normal text-lg text-slate-700'>{internship.currentApplicants.length} applications</p> */}
            <div
              onClick={() => {
                const shareableLink = generateShareableLink();
                navigator.clipboard.writeText(shareableLink)
                  .then(() => alert('Link copied to clipboard!'))
                  .catch(err => alert('Failed to copy link: ', err));
              }}
              className='mt-4 py-2 px-4 rounded'
            >
              <img src='/assets/share.svg' className='w-7 h-7' alt='Share Icon' />
            </div>
          </div>
        </div>
        <div className='flex flex-col w-full h-full'>
          <h2 className='flex justify-start font-medium text-lg text-slate-800 pt-5 pb-5'>About the internship</h2>
          <p className='flex font-normal text-md text-slate-800 pb-3'>{internship.description}</p>
          <div className='flex flex-col w-full gap-3'>
            <h2 className='flex justify-start text-lg text-slate-800 font-medium'>Skill(s) required</h2>
            <div className='w-full flex flex-row gap-3'>
              {internship.skillsRequired.map((skill, index) => (
                <div key={index} className='text-slate-500 font-medium bg-gray-100 p-2 rounded-xl'>
                  {skill}
                </div>
              ))}
            </div>
            <div className='flex w-full flex-col pt-2 pb-3'>
              <h2 className='flex font-medium text-lg text-slate-800'>Eligibility Criteria</h2>
              <p className='flex font-normal text-md text-slate-800'>{internship.eligibilityCriteria}</p>
            </div>
          </div>
        </div>
        <div className='flex flex-col w-full h-full'>
            <h2 className='flex justify-start font-medium text-lg text-slate-800 pt-5 pb-5'>Under guidance of {faculty?.name}</h2>
        </div>
        <div className='flex flex-col w-full h-full'>
          <h2 className='flex justify-start font-medium text-lg text-slate-800 pt-5 pb-5'>Students Working</h2>
          {internship.studentsworking.map((studentWorking, index) => {
            // const studentInfo = students.find(student => student._id === studentWorking.studentId);
            return (
              <div key={index} className='flex flex-col bg-gray-100 p-3 rounded-lg mb-3'>
                <p className='flex font-medium text-md text-slate-800'>Name: {student.name}</p>
                <p className='flex font-normal text-md text-slate-800'>Email: {student.email}</p>
                <p className='flex font-normal text-md text-slate-800'>Department: {student.department}</p>
                <p className='flex font-normal text-md text-slate-800'>Status: {studentWorking.status}</p>
                <p className='flex font-normal text-md text-slate-800'>Credits: {studentWorking.credits}</p>
                <p className='flex font-normal text-md text-slate-800'>Number of Hours: {studentWorking.noofhours}</p>
              </div>
            );
          })}
        </div>
        {applicationData?.certificateIssued === "no"?(
          <button
          onClick={openModal}
          className='mt-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600'
        >
          Generate Certificate
        </button>
        ):(
          <div className='text-slate-500 font-medium p-2 capitalize'>
                Certificate Generated: {applicationData?.certificateIssued}
          </div>
        )}

        <CertificateModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleSubmitModal}
        />
      </div>
    </div>
  );
};

export default ApplicationDetail;
