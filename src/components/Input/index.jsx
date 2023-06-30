import React from 'react'
import './Input.scss';

const Input = (props) => {
  const {
    value,
    placeholder,
    onChange,
    disabled,
    type,
  } = props;
  return (
		<div id='input' aria-disabled={disabled}>
			<input
				value={value}
				disabled={disabled}
				onChange={onChange}
				placeholder={placeholder}
				type={type}
			/>
		</div>
  );
}

export default Input