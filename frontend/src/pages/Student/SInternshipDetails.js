import React, { useEffect, useState } from 'react';
import { MdOutlineLocationOn } from 'react-icons/md';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Modal from '../../components/Modal';
import Cookies from "js-cookie";
import { toast } from 'react-toastify';

const InternshipDetail = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Initialize state to hold internship details
  const [internship, setInternship] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    applicationDeadline: '',
    skillsRequired: [],
    currentApplicants: 0,
    description: '',
    eligibilityCriteria: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [resume, setResume] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState('');
  const [student, setStudent] = useState({});
  const [appliedForCertificateStatus, setAppliedForCertificateStatus] = useState('');
  // Function to parse date into a readable format
  const formatDate = (date) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('en-US', { month: 'short' });
    const year = dateObj.getFullYear().toString().slice(-2);
    return `${day} ${month} '${year}`;
  };

  // Function to calculate duration
  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return `${totalMonths} ${totalMonths === 1 ? 'month' : 'months'}`;
  };

  useEffect(() => {
    // Check if location.state contains internship details
    if (location.state && location.state.internship) {
      setInternship(location.state.internship);
    } else {
      // Fallback to query parameters if state is not available
      setInternship({
        title: queryParams.get('title') || '',
        company: queryParams.get('company') || '',
        location: queryParams.get('location') || '',
        startDate: queryParams.get('startDate') || '',
        endDate: queryParams.get('endDate') || '',
        applicationDeadline: queryParams.get('applicationDeadline') || '',
        skillsRequired: JSON.parse(queryParams.get('skillsRequired')) || [],
        internshipId: queryParams.get('internshipId') || uuidv4(),
        currentApplicants: parseInt(queryParams.get('currentApplicants')) || 0,
        description: queryParams.get('description') || '',
        eligibilityCriteria: queryParams.get('eligibilityCriteria') || '',
      });
    }
  }, [location.state, queryParams, ]);

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

  const handleUpload = (event) => {
    setResume(event.target.files[0]);
  };

  const handleApplyClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleDownloadCertificate = async()=>{
    try {
      const certificate = await fetch('http://localhost:5000/api/downloadcertificate',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': Cookies.get('token'),
          'x-session-id': Cookies.get('sessionId')
        },
        body: JSON.stringify({ internshipId: internship._id, studentId : student._id }),
      });
      if(!certificate.ok){
        const errorData = await certificate.json();
        throw new Error(errorData.message || 'Failed to generate certificate');
      }
      if (certificate.ok) {
        // Check if the response is a PDF
        const contentType = certificate.headers.get('content-type');
        if (contentType && contentType.includes('application/pdf')) {
          const blob = await certificate.blob();
          const url = window.URL.createObjectURL(blob);
          
          // Create a hidden link and trigger the download
          const link = document.createElement('a');
          link.href = url;
          link.download = `${student.name}_${internship.title}_certificate.pdf`;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          
          // Clean up
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } else {
          throw new Error('Received non-PDF response from server');
        }
      toast.success("Certificate downloaded successfully");
    }
  } catch (error) {
      console.error('Error applying for internship:', error);
    }
  }
  const handleApply = async () => {
    try {
      const studentResponse = await fetch('http://localhost:5000/api/students/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': Cookies.get('token'),
          'x-session-id': Cookies.get('sessionId')
        },
      });

      if (!studentResponse.ok) {
        const errorData = await studentResponse.json();
        throw new Error(errorData.message || 'Failed to fetch student ID');
      }

      const student = await studentResponse.json();
      // Update student's internshipApplications status to 'applied'
      // console.log('started put');
      const updatedStudent = await fetch(`http://localhost:5000/api/students/updateInternshipStatus`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': Cookies.get('token'),
          'x-session-id': Cookies.get('sessionId')
        },
        body: JSON.stringify({
          internshipId: internship._id,
          status: 'applied'
        }),
      });

      if (!updatedStudent.ok) {
        const errorData = await updatedStudent.json();
        throw new Error(errorData.message || 'Failed to update student internship status');
      }

      // Update the internship's current applicants list
      const response = await fetch(`http://localhost:5000/api/updateCurrentApplicants/${internship._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': Cookies.get('token'),
          'x-session-id': Cookies.get('sessionId')
        },
        body: JSON.stringify({ currentApplicants: [...internship.currentApplicants, student._id] }),
      });

      if (response.ok) {
        const data = await response.json();
        setInternship(data.internship);
        alert('Application successful!');
        setApplicationStatus('applied');
        handleCloseModal();
      } else {
        const error = await response.json();
        alert(`Failed to apply: ${error.message}`);
      }
    } catch (error) {
      console.error('Error applying for internship:', error);
      alert('An error occurred while applying. Please try again.');
    }
  };

  const handleCertificateApply = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/student/applyForCertificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': Cookies.get('token'),
          'x-session-id': Cookies.get('sessionId')
        },
        body: JSON.stringify({ internshipId: internship._id }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Certificate application successful!');
      } else {
        const error = await response.json();
        alert(`Failed to apply for certificate: ${error.message}`);
      }
    } catch (error) {
      console.error('Error applying for certificate:', error);
      alert('An error occurred while applying for the certificate. Please try again.');
    }
  };

  useEffect(() => {
    // Fetch the student's application status for this internship
    const fetchStudentDetails = async () => {
      if (!internship._id) return;
      try {
        const studentResponse = await fetch('http://localhost:5000/api/students/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': Cookies.get('token'),
            'x-session-id': Cookies.get('sessionId')
          },
        });

        if (!studentResponse.ok) {
          const errorData = await studentResponse.json();
          throw new Error(errorData.message || 'Failed to fetch student ID');
        }

        const student = await studentResponse.json();
        setStudent(student);
        const application = student.internshipApplications.find(app => app.internshipId === internship._id);

        if (application) {
          setApplicationStatus(application.status);
        }
      } catch (error) {
        console.error('Error fetching application status:', error);
      }
    };

    const fetchApplicationdetails = async () => {
      if (!internship._id) return;
      try {
        const applicationResponse = await fetch(`http://localhost:5000/api/student/applyForCertificatestatus/${internship._id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': Cookies.get('token'),
            'x-session-id': Cookies.get('sessionId')
          },
        });

        if (!applicationResponse.ok) {
          const errorData = await applicationResponse.json();
          setAppliedForCertificateStatus('not applied')
          // throw new Error(errorData.message || 'Failed to fetch student ID');
        }

        const student = await applicationResponse.json();
        if (student.certificateIssued === "no") {
          setAppliedForCertificateStatus('applied');
        }
        else if(student.certificateIssued === "yes"){
          setAppliedForCertificateStatus('download');
        }
      } catch (error) {
        console.error('Error fetching application status:', error);
      }
    };
    
    fetchStudentDetails();
    fetchApplicationdetails();
  }, [internship._id, ]);
  
  return (
    <div className='w-screen h-screen flex flex-col items-center justify-center p-5 overflow-y-auto overscroll-x-none'>
      <h1 className='flex font-bold text-3xl pb-5'>{internship.title}</h1>
      <div className='flex flex-col w-3/5 h-full border-gray-400 items-center p-7 rounded-lg shadow-lg shadow-gray-400'>
        <div className='flex flex-col w-full h-full border-b-2 border-gray-300'>
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
          <div className='flex flex-row justify-between'>
            <p className='flex pb-5 font-normal text-lg text-slate-700'>{internship.currentApplicants.length} applications</p>
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
          <h2 className='flex justify-start font-medium text-lg text-slate-800 pt-5 pb-5'> About the internship</h2>
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
        {applicationStatus && applicationStatus !== 'complete' ? (
          <div className='text-slate-500 font-medium p-2 capitalize'>
            Application Status: {applicationStatus}
          </div>
        ):null}
        {applicationStatus === 'complete' && appliedForCertificateStatus === 'not applied' ? (
        <button className='btn bg-[#00a5ec] p-2 w-fit h-fit hover:bg-[#008bdc] text-white rounded-lg' type='button' onClick={handleCertificateApply}>
          Apply for Certificate
        </button>
        ):null}
        {applicationStatus === 'complete' && appliedForCertificateStatus === 'applied' ? (
        <div className='text-slate-500 font-medium p-2 capitalize'>
          {console.log(applicationStatus)}
            Application Status for Certificate: {appliedForCertificateStatus}
          </div>
        ):null}
        {applicationStatus === 'complete' && appliedForCertificateStatus === 'download' ? (
        <button className='btn bg-[#00a5ec] p-2 w-fit h-fit hover:bg-[#008bdc] text-white rounded-lg' type='submit' onClick={handleDownloadCertificate}>
        Download Certificate
        </button>
        ):null}
        {!applicationStatus && (
          <button className='btn bg-[#00a5ec] p-2 w-fit h-fit hover:bg-[#008bdc] text-white rounded-lg' type='submit' onClick={handleApplyClick}>
          Apply Now
          </button>
        )}
      </div>
      <Modal
        show={showModal}
        handleClose={handleCloseModal}
        handleUpload={handleUpload}
        handleApply={handleApply}
      />
    </div>
  );
};

export default InternshipDetail;
