import React from "react";

const Checkbox = ({ value, id, name, label, checked, onChange }) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        name={name}
        className="form-checkbox h-4 w-4 text-orange-500"
        checked={checked}
        value={value}
        onChange={onChange}
      />
      <label htmlFor={id} className="ml-2">
        {label}
      </label>
    </div>
  );
};
export default Checkbox;