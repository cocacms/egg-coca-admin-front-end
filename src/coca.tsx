import React from 'react';
import { HomeOutlined, SettingOutlined, TeamOutlined, IdcardOutlined } from '@ant-design/icons';

const coca: ICoca = {
  dropdown: [],
  model: ['role', 'setting'],
  menu: [
    {
      key: '/admin',
      icon: <HomeOutlined />,
      name: '首页',
    },

    {
      key: '/admin/setting/1?back=0',
      icon: <SettingOutlined />,
      name: '系统配置',
      access: 'setting',
    },

    {
      key: 'user_role',
      icon: <TeamOutlined />,
      name: '账户与权限',
      sub: [
        {
          key: '/admin/user',
          icon: <TeamOutlined />,
          name: '后台账号',
          access: 'user',
        },

        {
          key: '/admin/role',
          icon: <IdcardOutlined />,
          name: '角色权限',
          access: 'role',
        },
      ],
    },
  ],
};

export default coca;
