import React from 'react';
import './Modal.scss';

const Modal = (props) => {
  const {
    className,
    onClose,
    children
  } = props;

  return (
    <div className={`${className} modal-container`} onClick={onClose}>
        <div className="modal">
            {children}
        </div>
    </div>
  )
};


export default Modal