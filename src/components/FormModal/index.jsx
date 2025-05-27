import React from 'react';
import { Modal, Paper } from '@mui/material';
import Form from '../Form';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  maxWidth: '90vw',
  minWidth: 400,
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  overflow: 'auto'
};

const FormModal = ({
  open,
  onClose,
  data,
  schema,
  dependencies = {},
  onSave,
  disabled = false,
  stackFields = false
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="form-modal"
      aria-describedby="form-modal-description"
    >
      <Paper sx={modalStyle}>
        <Form
          data={data}
          schema={schema}
          dependencies={dependencies}
          onSave={onSave}
          onCancel={onClose}
          disabled={disabled}
          stackFields={stackFields}
        />
      </Paper>
    </Modal>
  );
};

export default FormModal; 