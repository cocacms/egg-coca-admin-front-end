import axios from '@/util/axios';

const api = '/backend';

export interface CurdApi {
  index(params?: any): Promise<any>;
  show(id: number, params?: any): Promise<any>;
  create(data: any, params?: any): Promise<any>;
  update(id: number, data: any, params?: any): Promise<any>;
  destroy(id: number): Promise<any>;
}

export default (model: string): CurdApi => {
  class Curd implements CurdApi {
    async index(params?: any) {
      return await axios.get(`${api}/${model}`, { params });
    }

    async show(id: number, params?: any) {
      return await axios.get(`${api}/${model}/${id}`, { params });
    }
    async create(data: any, params?: any) {
      return await axios.post(`${api}/${model}`, data, { params });
    }
    async update(id: number, data: any, params?: any) {
      return await axios.put(`${api}/${model}/${id}`, data, { params });
    }
    async destroy(id: number) {
      return await axios.delete(`${api}/${model}/${id}`);
    }
  }

  return new Curd();
};
