import { request } from '../utils/fetch';

export const getInterpretations = async () => {
  const response = await request('interpretation', { method: 'GET' });
  return response;
};

export const createInterpretation = async (interpretationData) => {
  const response = await request('interpretation', {
    method: 'POST',
    body: interpretationData,
  });
  return response;
};

export const updateInterpretation = async (id, interpretationData) => {
  const response = await request('interpretation', {
    method: 'PUT',
    body: { ...interpretationData, id },
  });
  return response;
};

export const deleteInterpretation = async (id) => {
  const response = await request('interpretation', {
    method: 'DELETE',
    body: { id },
  });
  return response;
}; 