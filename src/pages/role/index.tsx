import React from 'react';
import Pager from '@/component/Pager';
import { useModel } from 'umi';

export default () => {
  const { initialState } = useModel('@@initialState');
  return (
    <Pager
      name="角色"
      model="role"
      table={{
        columns: [
          {
            title: '角色名',
            dataIndex: 'name',
          },
          {
            title: '权限',
            dataIndex: 'permission',
            render: (text: string[]) => {
              return (text || []).map((i: string) => initialState?.permission[i]).join('、') || '-';
            },
          },
        ],
      }}
    />
  );
};
