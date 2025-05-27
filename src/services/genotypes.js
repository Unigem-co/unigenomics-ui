import { request } from '../utils/fetch';

export const getGenotypes = async () => {
  const response = await request('genotype', { method: 'GET' });
  return response;
};

export const createGenotype = async (genotypeData) => {
  const response = await request('genotype', {
    method: 'POST',
    body: genotypeData,
  });
  return response;
};

export const updateGenotype = async (id, genotypeData) => {
  const response = await request('genotype', {
    method: 'PUT',
    body: { ...genotypeData, id },
  });
  return response;
};

export const deleteGenotype = async (id) => {
  const response = await request('genotype', {
    method: 'DELETE',
    body: { id },
  });
  return response;
};

export const getGenotypesByReferenceSnp = () => 
  request('genotypesByReferenceSnp', { method: 'GET' });

export const createGenotypeByReferenceSnp = (data) =>
  request('genotypesByReferenceSnp', { method: 'POST', body: data });

export const updateGenotypeByReferenceSnp = (id, data) =>
  request('genotypesByReferenceSnp', { method: 'PUT', body: { ...data, id } });

export const deleteGenotypeByReferenceSnp = (id) =>
  request('genotypesByReferenceSnp', { method: 'DELETE', body: { id } }); 