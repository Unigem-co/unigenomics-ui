import { request } from '../utils/fetch';

export const getSNPs = async () => {
  const response = await request('referenceSnp', { method: 'GET' });
  return response;
};

export const createSNP = async (snpData) => {
  const response = await request('referenceSnp', {
    method: 'POST',
    body: snpData,
  });
  return response;
};

export const updateSNP = async (id, snpData) => {
  const response = await request('referenceSnp', {
    method: 'PUT',
    body: { ...snpData, id },
  });
  return response;
};

export const deleteSNP = async (id) => {
  const response = await request('referenceSnp', {
    method: 'DELETE',
    body: { id },
  });
  return response;
}; 