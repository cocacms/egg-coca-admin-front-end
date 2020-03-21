import moment from 'moment';
import { useRequest, useFormTable } from '@umijs/hooks';
import axios from '@/util/axios';
import { FormInstance } from 'antd/lib/form';

const formatResult = (response: any) => {
  const { data } = response;
  return data || {};
};

export const useDetail = (model: string, id: string, query?: any) => {
  const load = useRequest(
    () => axios.get(`${process.env.APIPREFIX}/${model}/${id}`, { params: { ...query } }),
    {
      initialData: {},
      formatResult,
    },
  );
  return load;
};

export const useAction = (model: string, id: string, links?: any[]) => {
  const isUpdate = id !== '0';

  const create = useRequest(
    data =>
      axios.post(`${process.env.APIPREFIX}/${model}`, data, {
        params: {
          links,
        },
      }),
    {
      formatResult,
      manual: true,
    },
  );

  const update = useRequest(
    data =>
      axios.put(`${process.env.APIPREFIX}/${model}/${id}`, data, {
        params: {
          links,
        },
      }),
    {
      formatResult,
      manual: true,
    },
  );

  return isUpdate ? update : create;
};

export const useDelete = (model: string) => {
  return useRequest((id: string) => axios.delete(`${process.env.APIPREFIX}/${model}/${id}`), {
    manual: true,
    fetchKey: id => id,
  });
};

const handleParams = ({ current, pageSize, sorter: s, filters: f }: any, formData: Object) => {
  const params: any = { page: current, pageSize };
  if (s?.field && s?.order) {
    params.order = JSON.stringify([s?.field, s?.order === 'descend' ? 'desc' : 'asc']);
  }
  if (formData) {
    const where: any = {};
    Object.entries(formData).forEach(([filed, value]) => {
      where[filed] = value;
    });
    params.where = where;
  }

  return params;
};

const handleWhere = (filters: ICocaFilter[] = [], where: any = {}) => {
  for (const key in where) {
    if (where.hasOwnProperty(key) && where[key]) {
      const value = where[key];
      const filter = filters.find((i: ICocaFilter) => i.key === key);
      if (filter) {
        if (filter.type === 'like') {
          where[key] = {
            $like: `%${value}%`,
          };
        }

        if (filter.type === 'date') {
          where[key] = {
            $between: [
              moment(value[0]).format('YYYY-MM-DD 00:00:00'),
              moment(value[1]).format('YYYY-MM-DD 23:59:59'),
            ],
          };
        }
      }
    }
  }
  return where;
};

const pageFormatResult = (response: any) => {
  const { data } = response;
  return {
    total: data.count,
    list: data.rows,
  };
};

export const useTableList = (
  model: string,
  filters: ICocaFilter[],
  form: FormInstance,
  query?: any[],
) => {
  return useFormTable(
    (pginatedParams: any, formData: Object) => {
      const params = handleParams(pginatedParams, formData);
      params.where = JSON.stringify(handleWhere(filters, params.where));
      return axios.get(`${process.env.APIPREFIX}/${model}`, {
        params: {
          ...params,
          ...query,
        },
      });
    },
    {
      cacheKey: `table_list_${model}`,
      form,
      defaultPageSize: 20,
      formatResult: pageFormatResult,
      loadingDelay: 300,
    },
  );
};
