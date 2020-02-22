const coca: ICoca = {
  dropdown: [],
  model: ['role', 'setting'],
  menu: [
    {
      key: '/admin',
      icon: 'home',
      name: '首页',
    },

    {
      key: '/admin/setting/1?back=0',
      icon: 'setting',
      name: '系统配置',
      authorities: ['setting'],
    },

    {
      key: 'user_role',
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
  ],
};

export default coca;
