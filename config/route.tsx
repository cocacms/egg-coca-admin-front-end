export default [
  {
    path: '/',
    component: '@/layouts/index',
    routes: [
      {
        exact: true,
        path: '/login',
        component: 'login',
        title: '登录',
      },
      {
        exact: true,
        component: '@/layouts/admin',
        admin: true,
        routes: [
          {
            exact: true,
            path: '/password',
            component: 'password',
            title: '修改密码',
          },
        ],
      },
    ],
  },
];
