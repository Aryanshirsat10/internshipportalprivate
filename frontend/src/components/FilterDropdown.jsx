import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const FilterDropdown = ({ filterCriteria, options, onChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openCriteriaKey, setOpenCriteriaKey] = useState(null);

  const handleCheckboxChange = (criteriaKey, value) => {
    const updatedValues = filterCriteria[criteriaKey].includes(value)
      ? filterCriteria[criteriaKey].filter((selected) => selected !== value)
      : [...filterCriteria[criteriaKey], value];

    onChange({ ...filterCriteria, [criteriaKey]: updatedValues });
  };

  const toggleCriteriaDropdown = (criteriaKey) => {
    setOpenCriteriaKey(openCriteriaKey === criteriaKey ? null : criteriaKey);
  };

  const handleReset = () => {
    const resetCriteria = Object.keys(filterCriteria).reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {});
    onChange(resetCriteria);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="filter-dropdown relative z-10">
      <button
        className="filter-button px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        Filter
      </button>

      {isDropdownOpen && (
        <div className="dropdown-options absolute top-full right-0 mt-2 bg-white border border-gray-300 p-4 rounded-lg shadow-md z-20">
          {Object.keys(options).map((criteriaKey) => (
            <div key={criteriaKey} className="criteria-dropdown mb-2">
              <button
                className="criteria-button text-left w-full px-2 py-1 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none flex justify-between items-center"
                onClick={() => toggleCriteriaDropdown(criteriaKey)}
              >
                {criteriaKey} <FaChevronDown />
              </button>
              {openCriteriaKey === criteriaKey && (
                <div className="criteria-options mt-1 bg-white border border-gray-200 p-5 rounded shadow-inner">
                  {options[criteriaKey].map((option) => (
                    <label key={option} className="flex items-center gap-2 mb-1">
                      <input
                        type="checkbox"
                        value={option}
                        checked={filterCriteria[criteriaKey].includes(option)}
                        onChange={() => handleCheckboxChange(criteriaKey, option)}
                      />
                      {criteriaKey === 'startDate' ? formatDate(option) : option}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button
            className="reset-button mt-4 px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
