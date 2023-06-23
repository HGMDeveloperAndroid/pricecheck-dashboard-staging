import React from 'react';

const FontSelect = (props) => {
  const { handleChange, value } = props;
  const options = [
    { label:"Arial", id: "Arial, sans-serif"},
    { label:"Verdana", id: "Verdana, sans-serif"},
    { label:"Helvetica", id: "Helvetica, sans-serif"},
    { label:"Tahoma", id: "Tahoma, sans-serif"},
    { label:"Trebuchet MS ", id: "Trebuchet MS, sans-serif"},
    { label:"Times New Roman", id: "Times New Roman, serif"},
    { label:"Georgia ", id: "Georgia, sans-serif"},
    { label:"Garamond", id: "Garamond, serif"},
    { label:"Courier New", id: "Courier New, monospace"},
    { label:"Brush Script MT", id: "Brush Script MT, cursive"},
  ];
  return (
    <select value={value} onChange={handleChange}>
      <option value="" disabled>Selecciona una tipografia</option>
      {options.map((option) => (
        <option value={option.id} key={`value-${option.id}`} style={{ fontFamily:  option.id }}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export default FontSelect;