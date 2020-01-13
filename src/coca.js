export const right_dropdown = [];

export const model = ['role'];

const admin_menu = [
  {
    key: '/admin',
    icon: 'home',
    name: '首页',
  },

  {
    key: 'user&role',
    icon: 'team',
    name: '账户与权限',
    authorities: ['user', 'role'],
    sub: [
      {
        key: '/admin/user',
        icon: 'team',
        name: '后台账号',
        authorities: ['user'],
      },

      {
        key: '/admin/role',
        icon: 'idcard',
        name: '角色权限',
        authorities: ['role'],
      },
    ],
  },
];

export const menu = user => {
  return admin_menu;
};
