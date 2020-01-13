/**
 * title:
 *  管理账号管理
 * authority:
 *  - user
 */

import pager from '@/component/pager';

@pager
class Instance {
  static model = 'user';
  config = {
    name: '管理账号',
    injects: ['hotel'],
    query_inject: {
      include: [
        {
          association: 'roles',
          attributes: ['id', 'name'],
        },
      ],
    },
    columns: [
      {
        title: '账号',
        dataIndex: 'account',
      },
      {
        title: '分配角色',
        dataIndex: 'roles',
        render: text => {
          return text.map(i => i.name).join('、') || '-';
        },
      },
      {
        title: '超级管理员',
        dataIndex: 'superadmin',
        render: text => (text ? '是' : '否'),
      },
    ],
    filters: [{ key: 'account', label: '账号', type: 'text' }],
  };
}

export default Instance;
