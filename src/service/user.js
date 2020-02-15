import axios from '@/util/axios';

const api = '/backend';

export const login = async (account, password, remember) => {
  return await axios.post(`${api}/login`, { account, password, remember });
};

export const resetPassword = async (password, newpassword) => {
  return await axios.post(`${api}/reset`, { password, newpassword });
};

export const info = async () => {
  return await axios.get(`${api}/info`);
};

export const permission = async () => {
  return await axios.get(`${api}/permission`);
};
export const setting = async () => {
  return await axios.get(`${api}/setting-dataset`);
};
