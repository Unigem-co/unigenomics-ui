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
import { getGenotypes } from '../../services/genotypes';

const GenotypeEffectForm = ({ open, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    genotype_id: '',
    effect_name: '',
    description: '',
  });
  const [genotypes, setGenotypes] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
    fetchGenotypes();
  }, [initialData]);

  const fetchGenotypes = async () => {
    try {
      const data = await getGenotypes();
      setGenotypes(data);
    } catch (error) {
      console.error('Error fetching genotypes:', error);
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
        {initialData ? 'Editar Efecto de Genotipo' : 'Crear Efecto de Genotipo'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Genotipo</InputLabel>
            <Select
              name="genotype_id"
              value={formData.genotype_id}
              onChange={handleChange}
              required
            >
              {genotypes.map((genotype) => (
                <MenuItem key={genotype.id} value={genotype.id}>
                  {genotype.genotype} - {genotype.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="effect_name"
            label="Nombre del Efecto"
            type="text"
            fullWidth
            value={formData.effect_name}
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

export default GenotypeEffectForm; 