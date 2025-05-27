import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { translate } from '../../utils/translations';

function SNPForm({ open, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = React.useState({
    rs_name: '',
    references: '',
    ...initialData
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? translate('edit_snp') : translate('create_snp')}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label={translate('rs_name')}
            name="rs_name"
            value={formData.rs_name}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label={translate('references')}
            name="references"
            value={formData.references}
            onChange={handleChange}
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{translate('cancel')}</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? translate('update') : translate('create')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default SNPForm; 