export default [
  {
    key: '/admin',
    icon: 'home',
    name: '首页',
  },
  {
    key: 'user&role',
    icon: 'team',
    name: '角色与权限',
    authorities: ['user', 'role'],
    sub: [
      {
        key: '/admin/user',
        icon: 'team',
        name: '后台账号',
        authorities: ['user', 'role'],
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
