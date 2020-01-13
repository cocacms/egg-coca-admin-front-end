/**
 * title: 编辑管理账号
 * authority:
 *  - user
 */

import { editor } from '@/component/pager';
import RoleSelect from '@/component/role-select';

@editor
class Instance {
  static model = 'user';
  config = {
    name: '管理员账号',
    query_inject: {
      include: [
        {
          association: 'roles',
          attributes: ['id', 'name'],
        },
      ],
    },
    links: ['Roles'],
    form: [
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
        key: 'superadmin',
        type: 'switch',
        label: '超管',
        required: true,
      },
    ],
  };
}

export default Instance;
