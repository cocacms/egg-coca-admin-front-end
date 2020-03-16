import React from 'react';
import { HomeOutlined } from '@ant-design/icons';

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
        routes: [
          {
            exact: true,
            path: '/',
            component: 'index',
            title: '首页',
          },

          {
            exact: true,
            path: '/password',
            component: 'password',
            title: '修改密码',
          },

          {
            exact: true,
            path: '/setting',
            component: 'setting',
            title: '系统配置',
            access: 'setting',
          },

          {
            exact: true,
            path: '/user',
            component: 'user/index',
            title: '系统管理员列表',
            access: 'user',
          },
          {
            exact: true,
            path: '/user/:id',
            component: 'user/edit',
            title: '编辑系统管理员',
            access: 'user',
          },

          {
            exact: true,
            path: '/role',
            component: 'role/index',
            title: '角色权限列表',
            access: 'role',
          },
          {
            exact: true,
            path: '/role/:id',
            component: 'role/edit',
            title: '编辑角色权限',
            access: 'role',
          },

          { component: '404' },
        ],
      },
    ],
  },
];
