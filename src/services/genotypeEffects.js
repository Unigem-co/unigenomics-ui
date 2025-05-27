import { request } from '../utils/fetch';

export const getGenotypeEffects = async () => {
  const response = await request('genotypeEffect', { method: 'GET' });
  return response;
};

export const createGenotypeEffect = async (effectData) => {
  const response = await request('genotypeEffect', {
    method: 'POST',
    body: effectData,
  });
  return response;
};

export const updateGenotypeEffect = async (id, effectData) => {
  const response = await request('genotypeEffect', {
    method: 'PUT',
    body: { ...effectData, id },
  });
  return response;
};

export const deleteGenotypeEffect = async (id) => {
  const response = await request('genotypeEffect', {
    method: 'DELETE',
    body: { id },
  });
  return response;
}; 