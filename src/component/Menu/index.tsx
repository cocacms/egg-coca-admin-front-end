import React from 'react';
import { Menu } from 'antd';
import { history, withRouter, useAccess } from 'umi';

import { IRouteComponentProps } from '@/index';
import coca from '@/coca';
import { MenuItemProps } from 'antd/es/menu/MenuItem';

interface ICocaMenuProps extends IRouteComponentProps<any> {}

const { SubMenu } = Menu;

interface IMenuItem extends MenuItemProps {
  path?: string;
}

const MenuItem: React.FC<IMenuItem> = (props) => <Menu.Item {...props}>{props.children}</Menu.Item>;

const getMenuItem = (it: ICocaMenu) => {
  const access = useAccess();
  let is: boolean = false;

  if (it.access) {
    is = access[it.access];
  } else {
    is = true;
  }

  if (is !== true) {
    return null;
  }

  let icon = null;
  if (it.icon) {
    icon = it.icon;
  }

  const key = it.key.split('?', 1)[0];
  return (
    <MenuItem key={key} path={it.key}>
      {icon}
      <span>{it.name}</span>
    </MenuItem>
  );
};

const CocaMenu: React.FC<ICocaMenuProps> = ({ location }) => {
  const getMenu = () => {
    if (Array.isArray(coca.menu)) {
      return coca.menu;
    }
    return [];
  };
  return (
    <Menu
      theme="light"
      mode="inline"
      defaultOpenKeys={getMenu()
        .filter((i) => i.sub && Array.isArray(i.sub) && i.sub.length > 0)
        .map((i) => i.key)}
      defaultSelectedKeys={[location.pathname]}
      selectedKeys={[location.pathname]}
      onClick={({ item }) => {
        if (item.props.path) history.push(item.props.path);
      }}
    >
      {getMenu().map((it) => {
        if (it.sub && Array.isArray(it.sub) && it.sub.length > 0) {
          const childs = it.sub.map((iit) => getMenuItem(iit)).filter((iit) => iit !== null);
          if (childs.length > 0) {
            let icon = null;
            if (it.icon) {
              icon = it.icon;
            }
            return (
              <SubMenu
                title={
                  <span>
                    {icon}
                    <span>{it.name}</span>
                  </span>
                }
                key={it.key}
              >
                {childs}
              </SubMenu>
            );
          }
          return null;
        }
        return getMenuItem(it);
      })}
    </Menu>
  );
};

export default withRouter(CocaMenu);
