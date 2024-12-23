import React from "react";
import { MdOutlineLocationOn } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const ApplicationCard = ({applicationData})=>{
  const navigate = useNavigate();
  console.log(applicationData.internship);
  const internshipd = applicationData.internship;
    // console.log("started");
    const formattedStartDate = new Date(internshipd.startDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const handleOnClick = () => {
        navigate('/InternshipCoordinator/applicationDetail', { state: { applicationData } });
    }
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
  
    const duration = calculateDuration(internshipd.startDate, internshipd.endDate);
    return (
      <div className="bg-white p-4 m-4 rounded-md shadow-lg flex flex-col gap-2 w-80 flex-wrap" onClick={handleOnClick}>
        <h2 className="text-2xl font-semibold">{internshipd.title}</h2>
        <span className='text-slate-500 font-semibold'>{internshipd.company}</span>
        <p className='text-md font-normal flex flex-row'><MdOutlineLocationOn style={{fontSize: 20}}/>{internshipd.location}</p>
        <div className="flex flex-row gap-20 items-center">
        <div className='flex flex-col'>
          <span className='text-slate-400 font-medium'>Start Date</span>
          <span className='text-slate-400 font-medium'>{formattedStartDate}</span>
        </div>
        <div className='flex flex-col'>
          <span className='text-slate-400 font-medium'>Duration</span>
          <span className='text-slate-400 font-medium'>{duration}</span>
        </div>
        </div>
        {/* <p className="font-semibold">Skills Required:</p>
          <ul>
            {internshipd.skillsRequired.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        <p>{internshipd.description}</p> */}
        {/* Add more details or customize as per your data structure */}
      </div>
    );
  }

  export default ApplicationCard