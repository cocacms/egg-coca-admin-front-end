/**
 * title: 编辑角色
 * authority:
 *  - role
 */

import React from 'react';
import { Editor } from '@/component/Pager';
import { useModel } from 'umi';

export default () => {
  const { initialState, refresh } = useModel('@@initialState');

  const hook = {
    after: refresh,
  };

  return (
    <Editor
      model="role"
      name="角色"
      hook={hook}
      forms={[
        {
          name: 'name',
          type: 'string',
          label: '名称',
          required: true,
        },
        {
          name: 'permission',
          type: 'checkbox',
          label: '权限包',
          options: Object.keys(initialState?.permission || []).map(it => ({
            label: initialState?.permission[it],
            value: it,
          })),
        },
      ]}
    />
  );
};
