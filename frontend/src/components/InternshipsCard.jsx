import React from "react";
import { MdOutlineLocationOn } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useUser } from '../UserContext';

const InternshipCard = ({internship})=>{
  const navigate = useNavigate();
  const { user } = useUser();
    // console.log("started");
    const formattedStartDate = new Date(internship.startDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const handleOnClick = () => {
      if (user == 'Student') {
        navigate('/Student/internship', { state: { internship } });
      } else if (user == 'Faculty') {
        navigate('/Faculty/internship', { state: { internship } });
      }
    }
    return (
      <div className="bg-white p-4 m-4 rounded-md shadow-lg flex flex-col gap-2 w-80 flex-wrap" onClick={handleOnClick}>
        <h2 className="text-2xl font-semibold">{internship.title}</h2>
        <span className='text-slate-500 font-semibold'>{internship.company}</span>
        <p className='text-md font-normal flex flex-row'><MdOutlineLocationOn style={{fontSize: 20}}/>{internship.location}</p>
        <div className='flex flex-row gap-20'>
          <span className='text-slate-400 font-medium'>Start Date</span>
          <span className='text-slate-400 font-medium'>Duration</span>
        </div>
        <div className='flex flex-row gap-12'>
          <span className='text-slate-400 font-medium'>{formattedStartDate}</span>
          <span className='text-slate-400 font-medium'></span>
        </div>
        {/* <p className="font-semibold">Skills Required:</p>
          <ul>
            {internship.skillsRequired.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        <p>{internship.description}</p> */}
        {/* Add more details or customize as per your data structure */}
      </div>
    );
  }

  export default InternshipCard