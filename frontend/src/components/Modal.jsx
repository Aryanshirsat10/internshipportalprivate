import React from 'react'

const Modal = ({ show, handleClose, handleUpload,handleApply  }) => {
  return (
    <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 ${show ? 'flex' : 'hidden'} items-center justify-center`}>
      <div className="bg-white p-5 rounded-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Upload Your Resume</h2>
        <input type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} className="mb-4" />
        <div className="flex justify-end">
          <button onClick={handleClose} className="bg-red-500 text-white px-4 py-2 rounded mr-2">Cancel</button>
          <button onClick={handleApply} className="bg-blue-500 text-white px-4 py-2 rounded">Apply Now</button>
        </div>
      </div>
    </div>
  )
}

export default Modal