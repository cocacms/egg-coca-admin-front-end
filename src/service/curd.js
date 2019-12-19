import axios from '@/util/axios';

const api = '/backend';

export default model => {
  return {
    index: async params => {
      return await axios.get(`${api}/${model}`, { params });
    },
    show: async (id, params) => {
      return await axios.get(`${api}/${model}/${id}`, { params });
    },
    create: async (data, params) => {
      return await axios.post(`${api}/${model}`, data, { params });
    },
    update: async (id, data, params) => {
      return await axios.put(`${api}/${model}/${id}`, data, { params });
    },
    destroy: async id => {
      return await axios.delete(`${api}/${model}/${id}`);
    },
  };
};
