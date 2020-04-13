import React from 'react';
import { history } from 'umi';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Auth from '@/wrappers/auth';
import user from '@/model/user';
import { permission, setting } from '@/service/config';
import coca from '@/coca';

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

const flatMenu2Route = (menus: ICocaMenu[]) => {
  let result: any[] = [];
  for (const menu of menus) {
    if (!menu.sub) {
      let path: any = menu.key.match(/(\S+)(\?)/);
      if (path && path.length >= 2) {
        path = path[1];
      } else {
        path = menu.key;
      }

      let component = path.replace('/', '');
      if (menu.component) component = menu.component;
      if (!component) component = 'index';

      result.push({
        exact: true,
        path,
        component: require(`@/pages/${component}`).default,
        title: `${menu.name}列表`,
        access: menu.access,
      });

      if (menu.editpage !== false) {
        result.push({
          exact: true,
          path: `${path}/:id`,
          component: require(`@/pages/${component}/edit`).default,
          title: `编辑${menu.name}`,
          access: menu.access,
        });
      }
    } else {
      const subs = flatMenu2Route(menu.sub);
      result = [...result, ...subs];
    }
  }
  return result;
};

const patchRoute = (routes: any, menu: any[]) => {
  for (const route of routes) {
    if (route.access) {
      if (!route.wrappers) route.wrappers = [];
      route.wrappers.push(Auth);
    }
    if (route.admin) {
      route.routes = [...route.routes, ...menu, { component: require(`@/pages/404`).default }];
    }
    if (route.routes) {
      patchRoute(route.routes, menu);
    }
  }
};

export function patchRoutes({ routes }: { routes: any }) {
  const menuRoutes = flatMenu2Route(coca.menu);
  patchRoute(routes, menuRoutes);
}
