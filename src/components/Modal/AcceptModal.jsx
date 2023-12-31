import React from 'react';
import Modal from '../Modal';
import './AcceptModal.scss';

const AcceptModal = props => {
	const { title, message, onAccept, onReject, className } = props;
	return (
		<Modal className={className} onClose={onReject}>
			<h3>{title}</h3>
			<button className='transparent close-button'>
				<i className='bi bi-x'></i>
			</button>
			<span>{message}</span>
			<div className='options'>
				<button className='delete' onClick={onAccept}>
					Aceptar
				</button>
				<button className='primary' onClick={onReject}>
					Cancelar
				</button>
			</div>
		</Modal>
	);
};

export default AcceptModal;
