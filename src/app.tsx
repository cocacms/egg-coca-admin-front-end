import React from 'react';
import { history } from 'umi';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Auth from '@/wrappers/auth';
import user from '@/model/user';
import { permission, setting } from '@/service/config';

Spin.setDefaultIndicator(<LoadingOutlined />);

const getUserInfo = async () => {
  let Authorization =
    localStorage[process.env.APIAUTHNAME || 'process.env.APIAUTHNAME'] ||
    sessionStorage[process.env.APIAUTHNAME || 'process.env.APIAUTHNAME'];
  if (!Authorization) {
    throw new Error('no login');
  } else {
    return await user.loadInfo(true);
  }
};

export async function getInitialState() {
  const { data: permissionData } = await permission();
  const { data: settingData } = await setting();
  let userInfo: ICocaUserInfo;
  try {
    userInfo = await getUserInfo();
  } catch (error) {
    userInfo = {};
    history.replace('/login');
  }

  return {
    permission: permissionData,
    setting: settingData,
    userInfo,
  };
}

const patchRoute = (routes: any) => {
  for (const route of routes) {
    if (route.access) {
      if (!route.wrappers) route.wrappers = [];
      route.wrappers.push(Auth);
    }

    if (route.routes) {
      patchRoute(route.routes);
    }
  }
};

export function patchRoutes({ routes }: { routes: any }) {
  patchRoute(routes);
}
