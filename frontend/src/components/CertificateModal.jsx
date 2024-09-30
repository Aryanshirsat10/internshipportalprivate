import React, { useState } from 'react';

const CertificateModal = ({ isOpen, onClose, onSubmit }) => {
  const [icKjsceInternshipCell, setIcKjsceInternshipCell] = useState('');

  const handleSubmit = () => {
    onSubmit(icKjsceInternshipCell);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'>
      <div className='bg-white p-5 rounded-lg shadow-lg w-1/3'>
        <h2 className='text-xl font-bold mb-4'>Enter IC KJSCE Internship Cell Name</h2>
        <input
          type='text'
          className='w-full p-2 border rounded mb-4'
          placeholder='IC KJSCE Internship Cell'
          value={icKjsceInternshipCell}
          onChange={(e) => setIcKjsceInternshipCell(e.target.value)}
        />
        <div className='flex justify-end gap-4'>
          <button
            onClick={onClose}
            className='px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500'
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            Issue Certificate
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
