import axios from '@/util/axios';

const api = '/backend';

export const permission = async (): Promise<any> => {
  return await axios.get(`${api}/permission`);
};

export const setting = async (): Promise<any> => {
  return await axios.get(`${api}/setting-dataset`);
};
