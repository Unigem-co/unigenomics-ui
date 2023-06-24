import React from 'react'
import './TextArea.scss';

const TextArea = (props) => {
  const {
    value,
    placeholder,
    onChange,
    disabled,
  } = props;
  return (
    <textarea 
        className="textarea-input"
        value={value}
        disabled={disabled} 
        onChange={onChange} 
        placeholder={placeholder}
    />
  )
}

export default TextArea;