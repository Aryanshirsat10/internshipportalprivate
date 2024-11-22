import React, { useEffect, useState } from 'react'
import { MdOutlineLocationOn } from 'react-icons/md';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Cookies from "js-cookie";
import StudentModal from '../../components/StudentModal';

const InternshipDetail = () => {
  const location = useLocation();
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
  const [facultyId , setFacultyId] = useState('');
  const { startDate, endDate, applicationDeadline, skillsRequired,title,eligibilityCriteria,description } = internship;
  const [students, setStudents] = useState([]);
  const [studentsworking, setStudentsworking] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const [acceptedStudents, setAcceptedStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [credits, setCredits] = useState(0);
  const [hours, setHours] = useState(0);
  const queryParams = new URLSearchParams(location.search);
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleCreditsChange = (event) => {
    setCredits(event.target.value);
  };

  const handleHoursChange = (event) => {
    setHours(event.target.value);
  };
  const handleUpdate = async(studentId)=>{
    try {
    const response  = await fetch(`${process.env.REACT_APP_API_URL}/internships/${internship._id}/students/${studentId}`,{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': Cookies.get('token'),
        'x-session-id': Cookies.get('sessionId')
      },
      body: JSON.stringify({
        status: status, 
        credits:credits,
        noofhours:hours
      }),
    })
    
    // if (!response.ok) {
    //   const errorData = await response.json();
    //   throw new Error(errorData.message || 'Failed to update application status');
    // }

    const data = await response.json();
    console.log('Updated internship status:', data);

    const response3 = await fetch(`${process.env.REACT_APP_API_URL}/faculty/updateApplicationStatus/${studentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': Cookies.get('token'),
        'x-session-id': Cookies.get('sessionId')
      },
      body: JSON.stringify({
        internshipId: internship._id,
        status: status
      }),
    });

    if (!response3.ok) {
      const errorData = await response3.json();
      throw new Error(errorData.message || 'Failed to update application status');
    }

    const data3 = await response3.json();
    console.log('Updated application status:', data3);

      setStatus('');
      setCredits(0);
      setHours(0);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }
  useEffect(() => {
    fetchfacultyId();
    fetchStudents();
    fetchworkingStudents();
    console.log(studentsworking);
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/internships/getStudents/${internship._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': Cookies.get('token'),
          'x-session-id': Cookies.get('sessionId')
        },
      });
      const data = await response.json();
      // console.log(data);
      if (data && data.length > 0) {
        // Map through each student ID and fetch their details
        const studentDetailsPromises = data.map(studentId => fetchStudentById(studentId));
        const studentsDetails = await Promise.all(studentDetailsPromises);
        setStudents(studentsDetails);
      } else {
        setStudents([]); // No students found, set empty array
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };  


  const fetchworkingStudents = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/internships/getworkingStudents/${internship._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': Cookies.get('token'),
          'x-session-id': Cookies.get('sessionId')
        },
      });
      const data = await response.json();
      console.log(data);
      if (data && data.length > 0) {
        // Map through each student ID and fetch their details
        const studentDetailsPromises = data.map(student => fetchStudentById(student.studentId));
        const studentsDetails = await Promise.all(studentDetailsPromises);
        setStudentsworking(studentsDetails);
      } else {
        setStudentsworking([]); // No students found, set empty array
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };  

  const fetchStudentById = async (studentId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/faculty/getStudent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': Cookies.get('token'),
          'x-session-id': Cookies.get('sessionId')
        },
        body: JSON.stringify({studentId}), // Ensure to send studentId as an object with key 'studentId'
      });
      const data = await response.json();
      return data; // Return student details
    } catch (error) {
      console.error('Error fetching student details:', error);
      throw error; // Optionally handle or propagate the error
    }
  };
  
  const handleStatusUpdate = async () => {
    try {
      const status = isOpen ? 'closed' : 'open'; // Toggle between open and closed
      const response = await fetch(`http:localhost:5000/api/internships/updateStatus/${internship._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': Cookies.get('token'),
          'x-session-id': Cookies.get('sessionId'),
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      console.log('Updated status:', data);
      setIsOpen(!isOpen); // Toggle isOpen state
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleAccept = async (studentId) => {
    try {
      // Update studentsworking field first
      const response1 = await fetch(`${process.env.REACT_APP_API_URL}/internships/updateStudentsWorking/${internship._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': Cookies.get('token'),
          'x-session-id': Cookies.get('sessionId')
        },
        body: JSON.stringify({
          studentsworking: [
            ...studentsworking,
            {
              studentId: studentId,
              status: 'incomplete', // or any initial status you prefer
              credits: 0, // or any initial value you prefer
              noofhours: 0 // or any initial value you prefer
            }
          ]
        })
      });
  
      const data1 = await response1.json();
      console.log('Updated students working:', data1);
  
      // Update currentApplicants field second
      const updatedCurrentApplicants = internship.currentApplicants.filter(id => id !== studentId); // Remove studentId from currentApplicants
  
      const response2 = await fetch(`${process.env.REACT_APP_API_URL}/internships/updateCurrentApplicants/${internship._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': Cookies.get('token'),
          'x-session-id': Cookies.get('sessionId')
        },
        body: JSON.stringify({ currentApplicants: updatedCurrentApplicants }),
      });
  
      const data2 = await response2.json();
      console.log('Updated current applicants:', data2);
      
      const response3 = await fetch(`${process.env.REACT_APP_API_URL}/faculty/updateApplicationStatus/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': Cookies.get('token'),
          'x-session-id': Cookies.get('sessionId')
        },
        body: JSON.stringify({
          internshipId: internship._id,
          status: 'accepted'
        }),
      });
  
      if (!response3.ok) {
        const errorData = await response3.json();
        throw new Error(errorData.message || 'Failed to update application status');
      }
  
      const data3 = await response3.json();
      console.log('Updated application status:', data3);

      // Update state or perform any necessary UI updates
      // setAcceptedStudents([...acceptedStudents, studentId]); // Update accepted students list
      fetchStudents();
      fetchworkingStudents();
  
    } catch (error) {
      console.error('Error accepting student:', error);
    }
  };
  

  const handleReject = async (studentId) => {
    try {
      // Update currentApplicants field second
      const updatedCurrentApplicants = internship.currentApplicants.filter(id => id !== studentId); // Remove studentId from currentApplicants
      const response2 = await fetch(`${process.env.REACT_APP_API_URL}/internships/updateCurrentApplicants/${internship._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': Cookies.get('token'),
          'x-session-id': Cookies.get('sessionId')
        },
        body: JSON.stringify({ currentApplicants: updatedCurrentApplicants }),
      });
  
      const data2 = await response2.json();
      console.log('Updated current applicants:', data2);

      const response3 = await fetch(`${process.env.REACT_APP_API_URL}/faculty/updateApplicationStatus/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': Cookies.get('token'),
          'x-session-id': Cookies.get('sessionId')
        },
        body: JSON.stringify({
          internshipId: internship._id,
          status: 'rejected'
        }),
      });
  
      if (!response3.ok) {
        const errorData = await response3.json();
        throw new Error(errorData.message || 'Failed to update application status');
      }
  
      const data3 = await response3.json();
      console.log('Updated application status:', data3);
      fetchStudents();
      fetchworkingStudents();
    } catch (error) {
      console.error('Error rejecting student:', error);
    }
  };

  const formattedStartDate = new Date(internship.startDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formatDate = (date) => {
    const dateObj = new Date(date);
  
    // Extract day, month, and year components
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('en-US', { month: 'short' });
    const year = dateObj.getFullYear().toString().slice(-2);
  
    // Format the year with the apostrophe
    const formattedYear = `'${year}`;
  
    // Construct the final formatted date string
    return `${day} ${month} ${formattedYear}`;
  };
  const fetchfacultyId = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/faculty/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': Cookies.get('token'),
          'x-session-id': Cookies.get('sessionId')
        },
      });
      const data = await response.json(); // Parse response as JSON
      console.log(data._id); // Log the parsed data to see what it contains
      setFacultyId(data._id); // Assuming faculty ID is available in the response
    } catch (error) {
      console.error('Error fetching faculty ID:', error);
    }
  };

  const openStudentModal = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closeStudentModal = () => {
    setSelectedStudent(null);
    setIsModalOpen(false);
  };
  
  const generateShareableLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const internshipId = uuidv4();
    const queryParams = new URLSearchParams({
      title,
      startDate,
      endDate,
      eligibilityCriteria,
      applicationDeadline,
      skillsRequired: JSON.stringify(skillsRequired),
      internshipId,
      description,
    }).toString();
    return `${baseUrl}?${queryParams}`;
  };
  
  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    // Calculate the difference in years and months
    const yearsDifference = end.getFullYear() - start.getFullYear();
    const monthsDifference = end.getMonth() - start.getMonth();
  
    // Total duration in months
    const totalMonths = yearsDifference * 12 + monthsDifference;
  
    // Return the duration string
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

  const duration = calculateDuration(internship.startDate, internship.endDate);

  const formattedApplyDate = formatDate(internship.applicationDeadline);
  return (
    <div className='w-full h-full flex flex-col items-center justify-center p-5'>
      <h1 className='flex font-bold text-3xl pb-5'>{internship.title}</h1>
      <div className='flex flex-col w-3/5 h-full border-gray-400 items-center p-7 rounded-lg shadow-lg shadow-gray-400'>
      <div className='flex flex-col w-full h-full border-b-2 border-gray-300'>
        <div className='flex flex-col w-full'>
          <h3 className='flex text-xl text-black font-semibold'>{internship.title}</h3>
          <h5 className='flex text-lg text-slate-400 font-medium'>{internship.company}</h5>
        </div>
        <p className='text-md font-normal flex flex-row pt-7'><MdOutlineLocationOn style={{fontSize: 20}}/>{internship.location}</p>
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
        <p className='flex pb-5 font-normal text-lg text-slate-700'>{students.length} application(s)</p>
        <div
        onClick={() => {
          const shareableLink = generateShareableLink();
          navigator.clipboard.writeText(shareableLink)
            .then(() => alert('Link copied to clipboard!'))
            .catch(err => alert('Failed to copy link: ', err));
        }}
        className='mt-4 py-2 px-4 rounded'
      >
        <img src='/assets/share.svg' className='w-7 h-7'/>
      </div>
        </div>
      </div>
      <div className='flex flex-col w-full h-full'>
        <h2 className='flex justify-start font-medium text-lg text-slate-800 pt-5 pb-5'> About the internship</h2>
        <p className='flex font-normal text-md text-slate-800 pb-3'>{internship.description}</p>
        <div className='flex flex-col w-full gap-3'>
          <h2 className='flex justify-start text-lg text-slate-800 font-medium'>Skill&#40;s&#41; required</h2>
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
      {facultyId === internship.postedby && (
        <>
          <div className='flex flex-col w-full gap-3 mt-5'>
            <h2 className='flex justify-start text-lg text-slate-800 font-medium'>Students Applied</h2>
            {students?.length > 0 ? (
              students.map((student,index) => (
                <div key={index} className='flex flex-row justify-between items-center bg-gray-100 p-3 rounded-md'>
                  <div className='flex flex-col' onClick={() => openStudentModal(student)}>
                    <span className='font-semibold'>{student?.name}</span>
                    <span>{student?.email}</span>
                  </div>
                  <div className='flex gap-2'>
                    <button onClick={() => handleAccept(student._id)} className='bg-green-500 text-white py-1 px-3 rounded-md'>Accept</button>
                    <button onClick={() => handleReject(student._id)} className='bg-red-500 text-white py-1 px-3 rounded-md'>Reject</button>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-sm text-slate-600'>No students have applied yet.</p>
            )}
          </div>
          <div className='flex flex-col w-full gap-3 mt-5'>
            <h2 className='flex justify-start text-lg text-slate-800 font-medium'>Students Working</h2>
            {studentsworking.length > 0 ? (
              studentsworking.map((student,index) => (
                <div key={index} className='flex flex-row justify-between items-center bg-gray-100 p-3 rounded-md flex-wrap'>
                  <div className='flex flex-col' onClick={() => openStudentModal(student)}>
                    <span className='font-semibold'>{student?.name}</span>
                    <span>{student?.email}</span>
                  </div>
                  <div className='flex flex-col'>
                    <label className='font-semibold'>Status</label>
                    <select value={status} onChange={handleStatusChange} className='p-2 rounded-md border'>
                      <option value=''>Select status</option>
                      <option value='complete'>Complete</option>
                      <option value='incomplete'>Incomplete</option>
                      <option value='withdraw'>Withdraw</option>
                    </select>
                  </div>

                  <div className='flex flex-col'>
                    <label className='font-semibold'>Credits</label>
                    <input
                      type='number'
                      value={credits}
                      onChange={handleCreditsChange}
                      className='p-2 rounded-md border'
                      placeholder='No. of credits'
                    />
                  </div>

                  <div className='flex flex-col'>
                    <label className='font-semibold'>Hours</label>
                    <input
                      type='number'
                      value={hours}
                      onChange={handleHoursChange}
                      className='p-2 rounded-md border'
                      placeholder='No. of hours'
                    />
                  </div>
                  <div className='flex flex-col items-center'>
                    <button onClick={() => handleUpdate(student._id)} className='bg-green-500 text-white rounded-lg p-2'>Update</button>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-sm text-slate-600'>No students are working yet</p>
            )}
          </div>
        </>
        )}
      </div>
      <StudentModal
      student={selectedStudent}
      isOpen={isModalOpen}
      onClose={closeStudentModal}
    />
    </div>
  )
}

export default InternshipDetail