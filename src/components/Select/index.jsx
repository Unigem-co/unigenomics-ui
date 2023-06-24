import React from 'react';
import './Select.scss';

const Select = (props) => {
  const {
    value,
    options,
    onSelect
} = props;
  console.log({value});
  return (
    <div className="select">
        <select 
            className="default-select" 
            onChange={onSelect} 
            value={value}
        >
            {options?.map(o => <option value={o?.id}>{o?.text}</option>)}
        </select>
    </div>
  )
}

export default Select