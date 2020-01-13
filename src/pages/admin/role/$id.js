/**
 * title: 编辑角色
 * authority:
 *  - role
 */

import { editor } from '@/component/pager';
const permission = window.permission || {};

@editor
class Instance {
  static model = 'role';
  config = {
    name: '角色',
    form: [
      {
        key: 'name',
        type: 'string',
        label: '名称',
        required: true,
      },
      {
        key: 'permission',
        type: 'checkbox',
        label: '权限包',
        options: Object.keys(permission).map(it => ({
          label: permission[it],
          value: it,
        })),
      },
    ],
  };
}

export default Instance;
