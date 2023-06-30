import React, { useState } from 'react';
import './Password.scss';
import Input from '../Input';

const Password = props => {
	const [showPassword, setshowPassword] = useState(false);
	const { value, onChange, disabled } = props;
	return (
		<div className='input-password'>
			<Input
				disabled={disabled}
				type={showPassword ? null : 'password'}
				value={value}
				onChange={onChange}
			/>
			{!disabled && (
				<button className='transparent' onClick={() => setshowPassword(!showPassword)}>
					{showPassword ? <i className='bi bi-eye' /> : <i className='bi bi-eye-slash' />}
				</button>
			)}
		</div>
	);
};

export default Password;
