import React from 'react';
import './Modal.scss';

const Modal = (props) => {
  const {
    onClose,
    children
  } = props;

  return (
    <div className="modal-container" onClick={onClose}>
        <div className="modal">
            {children}
        </div>
    </div>
  )
};


export default Modal