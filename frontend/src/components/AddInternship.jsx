import React, { useState } from 'react'
import Cookies from "js-cookie";
const AddInternship = ({showModal, handleCloseModal }) => {
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        description: '',
        skillsRequired: [],
        startDate: '',
        endDate: '',
        applicationDeadline: '',
        eligibilityCriteria: '',
        maxApplicants: ''
      });
    
      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };
    
      const handleSkillsChange = (e) => {
        setFormData({
          ...formData,
          skillsRequired: e.target.value.split(',').map(skill => skill.trim()),
        });
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/addInternship`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              "x-auth-token": Cookies.get("token"),
              "x-session-id": Cookies.get("sessionId"),
            },
            body: JSON.stringify(formData),
          });
    
          if (response.ok) {
            const data = await response.json();
            console.log(data);
            handleCloseModal();
          } else {
            console.error('Failed to add internship');
          }
        } catch (error) {
          console.error('There was an error adding the internship!', error);
        }
      };
  return (
    <div className={`fixed z-10 inset-0 overflow-y-auto modal ${showModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }}>
      <div className="flex items-center justify-center min-h-screen px-4 w-full">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start flex">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex flex-col w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex w-full">Add Internship</h3>
                <div className="mt-2">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Company</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Skills Required</label>
                      <input
                        type="text"
                        name="skillsRequired"
                        value={formData.skillsRequired.join(', ')}
                        onChange={handleSkillsChange}
                        required
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Application Deadline</label>
                      <input
                        type="date"
                        name="applicationDeadline"
                        value={formData.applicationDeadline}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Eligibility Criteria</label>
                      <textarea
                        name="eligibilityCriteria"
                        value={formData.eligibilityCriteria}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Max Applicants</label>
                      <input
                        type="number"
                        name="maxApplicants"
                        value={formData.maxApplicants}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
                      />
                    </div>
                    <div className="mt-5 sm:mt-6 flex w-full">
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-rose-600 text-base font-medium text-white hover:bg-rose-700 sm:text-sm"
                      >
                        Add Internship
                      </button>
                        <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={handleCloseModal}
                        >
                        Cancel
                        </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddInternship