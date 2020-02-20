/**
 * title: 编辑管理账号
 * authority:
 *  - user
 */
import React from 'react';
import { Editor } from '@/component/pager';
import RoleSelect from '@/component/role-select';

export default class extends React.Component {
  forms = [
    {
      key: 'account',
      type: 'string',
      label: '账号',
      required: true,
      props: data => {
        if (data.id) {
          return {
            disabled: true,
          };
        }
        return {};
      },
    },

    {
      key: 'password',
      type: 'string',
      label: '密码',
      initialValue: '',
      props: {
        placeholder: '创建时必填，修改时填则修改密码不填则不修改密码',
      },
    },
    {
      key: 'roles',
      dataType: 'array',
      component: <RoleSelect />,
      label: '分配角色',
      initialValue: (isUpdate, text) => {
        return !isUpdate ? [] : (text || []).map(i => i.id);
      },
    },
    {
      key: 'type',
      type: 'radio',
      label: '类型',
      options: [
        { label: '超级管理员', value: 'super' },
        { label: '管理员', value: 'admin' },
        { label: '普通员工', value: 'normal' },
      ],
      required: true,
    },
  ];

  render() {
    return (
      <Editor
        model="user"
        name="管理员账号"
        links={['Roles']}
        forms={this.forms}
        query={{
          include: [
            {
              association: 'roles',
              attributes: ['id', 'name'],
            },
          ],
        }}
      />
    );
  }
}
