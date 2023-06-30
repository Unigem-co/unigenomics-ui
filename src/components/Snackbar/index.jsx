import React, { useEffect, useState } from 'react';
import './Snackbar.scss';

const Snackbar = props => {
	const { className, message, show } = props;

	return (
		<div className={`snackbar ${className} ${show ? 'show' : 'hide'}`}>
			<span>{message}</span>
		</div>
	);
};

export default Snackbar;
