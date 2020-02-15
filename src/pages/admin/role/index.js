/**
 * title: 管理角色
 * authority:
 *  - role
 */

import pager from '@/component/pager';

@pager
class Instance {
  static model = 'role';
  config = {
    name: '角色',
    columns: [
      {
        title: '角色名',
        dataIndex: 'name',
      },
      {
        title: '权限',
        dataIndex: 'permission',
        render: text => {
          const permission = window.permission || {};
          return (text || []).map(i => permission[i]).join('、') || '-';
        },
      },
    ],
    pagination: false,
  };
}

export default Instance;
