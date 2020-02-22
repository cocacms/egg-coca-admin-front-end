import axios from '@/util/axios';

const api = '/backend';

export const login = async (account: string, password: string, remember: boolean): Promise<any> => {
  return await axios.post(`${api}/login`, { account, password, remember });
};

export const resetPassword = async (password: string, newpassword: string): Promise<any> => {
  return await axios.post(`${api}/reset`, { password, newpassword });
};

export const info = async (): Promise<any> => {
  return await axios.get(`${api}/info`);
};
