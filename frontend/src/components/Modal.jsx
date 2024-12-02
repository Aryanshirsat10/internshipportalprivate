import React, { useState } from 'react';

const Modal = ({ show, handleClose, handleApply }) => {
  const [driveLink, setDriveLink] = useState('');

  const handleLinkChange = (event) => {
    setDriveLink(event.target.value);
  };

  const handleApplyWithLink = () => {
    if (driveLink.trim() === '') {
      alert('Please provide a valid drive link');
      return;
    }
    handleApply(driveLink);
  };

  return (
    <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 ${show ? 'flex' : 'hidden'} items-center justify-center`}>
      <div className="bg-white p-5 rounded-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Upload Your Resume Link</h2>
        <input
          type="url"
          value={driveLink}
          onChange={handleLinkChange}
          placeholder="Paste your drive link here"
          className="mb-4 p-2 w-full border rounded"
        />
        <div className="flex justify-end">
          <button onClick={handleClose} className="bg-red-500 text-white px-4 py-2 rounded mr-2">Cancel</button>
          <button onClick={handleApplyWithLink} className="bg-blue-500 text-white px-4 py-2 rounded">Apply Now</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
