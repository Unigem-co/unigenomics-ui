import React from 'react';
import AcceptModal from '../Modal/AcceptModal';

const ConfirmationModal = ({
  open,
  title = 'Confirmar',
  message = '¿Estás seguro?',
  onConfirm,
  onCancel,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  className
}) => {
  if (!open) return null;

  return (
    <AcceptModal
      title={title}
      message={message}
      onAccept={onConfirm}
      onReject={onCancel}
      className={className}
    />
  );
};

export default ConfirmationModal; 