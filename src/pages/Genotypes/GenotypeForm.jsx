import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { getSNPs } from '../../services/snps';

const GenotypeForm = ({ open, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    snp_id: '',
    genotype: '',
    description: '',
  });
  const [snps, setSnps] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
    fetchSNPs();
  }, [initialData]);

  const fetchSNPs = async () => {
    try {
      const data = await getSNPs();
      setSnps(data);
    } catch (error) {
      console.error('Error fetching SNPs:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? 'Editar Genotipo' : 'Crear Genotipo'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>SNP</InputLabel>
            <Select
              name="snp_id"
              value={formData.snp_id}
              onChange={handleChange}
              required
            >
              {snps.map((snp) => (
                <MenuItem key={snp.id} value={snp.id}>
                  {snp.rs_id} - {snp.gene}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="genotype"
            label="Genotipo"
            type="text"
            fullWidth
            value={formData.genotype}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="description"
            label="Descripción"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default GenotypeForm; 