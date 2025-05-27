import { request } from '../utils/fetch';

export const getUsers = async () => {
  const response = await request('users/user', { method: 'GET' });
  return response;
};

export const createUser = async (userData) => {
  const response = await request('users/user', {
    method: 'POST',
    body: userData,
  });
  return response;
};

export const updateUser = async (id, userData) => {
  const response = await request('users/user', {
    method: 'PUT',
    body: { ...userData, id },
  });
  return response;
};

export const deleteUser = async (id) => {
  const response = await request('users/user', {
    method: 'DELETE',
    body: { id },
  });
  return response;
}; 