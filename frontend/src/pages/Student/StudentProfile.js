import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
const StudentProfile = () => {
    const defaultProfile = {
        firstName: '',
        lastName: '',
        gender: '',
        phone: '',
        yearOfStudy: '',
        cgpa: '',
        email: '',
        description: '',
        birthday: '',
        skills: [],
        education: []
      };
    
    const [profile, setProfile] = useState(defaultProfile);

  const [resume, setResume] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSkillChange = (index, e) => {
    const { value } = e.target;
    
    // Create a shallow copy of the skills array
    const updatedSkills = [...profile.skills];
  
    // Update the skill name at the specified index
    updatedSkills[index] = value;
  
    // Update the profile state with the modified skills array
    setProfile({ ...profile, skills: updatedSkills });
  }

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEducation = [...profile.education];
    updatedEducation[index][name] = value;
    setProfile({ ...profile, education: updatedEducation });
  };
  const handleAddSkill = () => {
    // Ensure the last skill is not empty before adding a new one
    if (profile.skills.length === 0 || profile.skills[profile.skills.length - 1].trim() !== '') {
      const newSkill = '';
      setProfile({ ...profile, skills: [...profile.skills, newSkill] });
    }
  };

  const handleResumeUpload = (e) => {
    setResume(e.target.files[0]);
  };
  useEffect(() => {
    const fetchInitialdetails = async()=>{
        try {
            const response = await fetch('http://localhost:5000/api/students/me', {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'x-auth-token': Cookies.get('token'),
                  'x-session-id': Cookies.get('sessionId'),
                },
              });
              const data = await response.json();
              // Merge fetched data with default profile values
            //   console.log(data);
              const nameParts = data.name ? data.name.split(' ') : [''];
              const firstName = nameParts[0] || '';
              const lastName = nameParts.slice(1).join(' ') || '';
      
              // Merge fetched data with default profile values
              const mergedProfile = { ...defaultProfile, ...data, firstName, lastName };
            //   console.log(mergedProfile.skills)
        setProfile(mergedProfile);
        } catch (error) {
            console.log(error);
        }
    }
    fetchInitialdetails();
  }, [])
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if there are any empty skills
  const emptySkills = profile.skills.some(skill => skill.trim() === '');

  if (emptySkills) {
    alert('Please fill out all skills before saving.');
    return; // Exit early if there are empty skills
  }

    try {
      const response = await fetch('http://localhost:5000/api/student/updateDetails', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': Cookies.get('token'),
          'x-session-id': Cookies.get('sessionId'),
        },
        body: JSON.stringify(profile), // Send entire profile object as body
      });

      const data = await response.json();
      console.log(data); // Log response from server

      // Optionally update local state with updated profile if needed
      setProfile(data.student);

      // Example: show a success message to the user
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      // Handle error scenario
      alert('Failed to update profile. Please try again later.');
    }
  };
  return (
    <div className='min-[990px]:flex w-screen overflow-x-hidden'>
    {/* <div className='flex flex-col bg-red-50 p-5 w-[15%] h-svh'>
        <Sidebar/>
    </div> */}
    <div className='bg-gray-100 flex flex-grow'>
        <div className="font-sans leading-normal tracking-normal p-5 flex-grow">
            <div className="container my-5 mx-auto">
                <div className="md:flex no-wrap md:-mx-2">
                    {/* Left Side */}
                    <div className="w-full md:w-3/12 md:mx-2">
                        {/* Profile Card */}
                        <div className="bg-white p-3 border-t-4 border-rose-400">
                            <div className="image overflow-hidden">
                                <img className="h-auto w-full mx-auto"
                                    src="https://via.placeholder.com/150"
                                    alt="Profile Pic" />
                            </div>
                            <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">{profile.name}</h1>
                            <h3 className="text-gray-600 font-lg text-semibold leading-6">Computer Science Student</h3>
                            <textarea
                              name="description"
                              value={profile.description}
                              onChange={handleInputChange}
                              rows="3"
                              className="px-4 py-2 border rounded w-full resize-none mt-3"
                            />
                            {/* <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                                <li className="flex items-center py-3">
                                    <span>Status</span>
                                    <span className="ml-auto"><span className="bg-rose-500 py-1 px-2 rounded text-white text-sm">Active</span></span>
                                </li>
                            </ul> */}
                        </div>
                    </div>
                    {/* Right Side */}
                    <div className="w-full md:w-9/12 mx-2 h-full">
                        <form onSubmit={handleSubmit}>
                            {/* About Section */}
                            <div className="bg-white p-3 shadow-sm rounded-sm">
                                <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                                    <span className="text-rose-500">
                                        <svg className="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 19.071a2 2 0 012.829 0l1.414 1.415a2 2 0 002.828 0l1.415-1.414a2 2 0 012.828 0l1.414 1.414a2 2 0 002.829 0l1.414-1.414a2 2 0 000-2.829l-1.414-1.414a2 2 0 010-2.829l1.414-1.415a2 2 0 000-2.828L17.657 5.12a2 2 0 010-2.828L16.243 1.88a2 2 0 00-2.828 0L12 3.295a2 2 0 01-2.829 0L7.757 1.88a2 2 0 00-2.828 0L3.515 3.295a2 2 0 000 2.828L4.93 7.538a2 2 0 010 2.828L3.515 11.78a2 2 0 000 2.828l1.414 1.414a2 2 0 010 2.829L3.515 19.071a2 2 0 000 2.828l1.414 1.414a2 2 0 010 2.829z" />
                                        </svg>
                                    </span>
                                    <span className="tracking-wide">About</span>
                                </div>
                                <div className="text-gray-700">
                                    <div className="grid md:grid-cols-2 text-sm">
                                        <div className="grid grid-cols-2">
                                            <div className="px-4 py-2 font-semibold">First Name</div>
                                            <input type="text" name="firstName" value={profile.firstName} onChange={handleInputChange} className="px-4 py-2 border rounded" disabled/>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <div className="px-4 py-2 font-semibold">Last Name</div>
                                            <input type="text" name="lastName" value={profile.lastName} onChange={handleInputChange} className="px-4 py-2 border rounded" disabled/>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <div className="px-4 py-2 font-semibold">Gender</div>
                                            <input type="text" name="gender" value={profile.gender} onChange={handleInputChange} className="px-4 py-2 border rounded" />
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <div className="px-4 py-2 font-semibold">Contact No.</div>
                                            <input type="text" name="phone" value={profile.phone} onChange={handleInputChange} className="px-4 py-2 border rounded" />
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <div className="px-4 py-2 font-semibold">Current Year of Study</div>
                                            <input type="text" name="yearOfStudy" value={profile.yearOfStudy} onChange={handleInputChange} className="px-4 py-2 border rounded" />
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <div className="px-4 py-2 font-semibold">CGPA</div>
                                            <input type="text" name="cgpa" value={profile.cgpa} onChange={handleInputChange} className="px-4 py-2 border rounded" />
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <div className="px-4 py-2 font-semibold">Email</div>
                                            <input type="text" name="email" value={profile.email} onChange={handleInputChange} className="px-4 py-2 border rounded" disabled />
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <div className="px-4 py-2 font-semibold">Department</div>
                                            <input type="text" name="email" value={profile.department} onChange={handleInputChange} className="px-4 py-2 border rounded" />
                                        </div>
                                        {/* <div className="grid grid-cols-2">
                                            <div className="px-4 py-2 font-semibold">Birthday</div>
                                            <input type="text" name="birthday" value={profile.birthday} onChange={handleInputChange} className="px-4 py-2 border rounded" />
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                            <div className="my-4"></div>
                            {/* Skills Section */}
                            <div className="bg-white p-3 shadow-sm rounded-sm">
                                <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                                    <span className="text-rose-500">
                                        <svg className="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3-3 3 3m0 6l-3 3-3-3" />
                                        </svg>
                                    </span>
                                    <span className="tracking-wide">Skills</span>
                                    <button type="button" onClick={handleAddSkill} className="ml-auto bg-rose-500 text-white px-3 py-1 rounded">Add Skill</button>
                                </div>
                                <ul className="list-inside space-y-2">
                                    {profile.skills.map((skill, index) => (
                                        <li key={index}>
                                            <div className="flex">
                                                <input type="text" name="skill" value={skill} onChange={(e) => handleSkillChange(index, e)} className="px-4 py-2 border rounded mr-2 w-1/2" />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="my-4"></div>
                            {/* Education Section */}
                            <div className="bg-white p-3 shadow-sm rounded-sm">
                                <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                                    <span className="text-rose-500">
                                        <svg className="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 7v-7m-9-7v11a2 2 0 002 2h14a2 2 0 002-2V7" />
                                        </svg>
                                    </span>
                                    <span className="tracking-wide">Education</span>
                                </div>
                                <ul className="list-inside space-y-2">
                                    {profile.education.map((edu, index) => (
                                        <li key={index}>
                                            <div className="flex">
                                                <input type="text" name="degree" value={edu.degree} onChange={(e) => handleEducationChange(index, e)} className="px-4 py-2 border rounded mr-2 w-1/3" />
                                                <input type="text" name="institution" value={edu.institution} onChange={(e) => handleEducationChange(index, e)} className="px-4 py-2 border rounded mx-2 w-1/3" />
                                                <input type="text" name="period" value={edu.period} onChange={(e) => handleEducationChange(index, e)} className="px-4 py-2 border rounded ml-2 w-1/3" />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="my-4"></div>
                            {/* Resume Upload Section */}
                            <div className="bg-white p-3 shadow-sm rounded-sm">
                                <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                                    <span className="text-rose-500">
                                        <svg className="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5zm0 7v-7m-9-7v11a2 2 0 002 2h14a2 2 0 002-2V7" />
                                        </svg>
                                    </span>
                                    <span className="tracking-wide">Resume</span>
                                </div>
                                <input type="file" onChange={handleResumeUpload} className="px-4 py-2 border rounded" />
                            </div>
                            <div className="my-4"></div>
                            {/* Save Button */}
                            <div className="bg-white p-3 shadow-sm rounded-sm">
                                <button type="submit" className="bg-rose-500 text-white px-4 py-2 rounded">Save</button>
                            </div>
                        </form> 
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

  )
}

export default StudentProfile