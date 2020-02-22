import React from 'react';
import { Menu, Icon } from 'antd';
import withRouter from 'umi/withRouter';
import router from 'umi/router';
import { check } from '@/component/Authorized';
import { IRouteComponentProps } from '@/index';
import coca from '@/coca';
import { MenuItemProps } from 'antd/es/menu/MenuItem';

interface ICocaMenuProps extends IRouteComponentProps<any> {
  userInfo: ICocaUserInfo;
}

const { SubMenu } = Menu;

interface IMenuItem extends MenuItemProps {
  path?: string;
}

const MenuItem: React.FC<IMenuItem> = props => <Menu.Item {...props}>{props.children}</Menu.Item>;

const getMenuItem = (it: ICocaMenu, userInfo: ICocaUserInfo) => {
  let is: boolean | number | string[] = true;
  if (it.authorities) {
    is = check(userInfo, it.authorities);
  }

  if (is !== true) {
    return null;
  }

  let icon = null;
  if (it.icon && typeof it.icon === 'string') {
    icon = <Icon type={it.icon} />;
  } else if (it.icon) {
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

const CocaMenu: React.FC<ICocaMenuProps> = ({ location, userInfo }) => {
  const getMenu = () => {
    if (Array.isArray(coca.menu)) {
      return coca.menu;
    }

    if (typeof coca.menu === 'function') {
      return coca.menu(userInfo);
    }
    return [];
  };
  return (
    <Menu
      theme="light"
      mode="inline"
      defaultOpenKeys={getMenu()
        .filter(i => i.sub && Array.isArray(i.sub) && i.sub.length > 0)
        .map(i => i.key)}
      defaultSelectedKeys={[location.pathname]}
      selectedKeys={[location.pathname]}
      onClick={({ item }) => {
        if (item.props.path) router.push(item.props.path);
      }}
    >
      {getMenu().map(it => {
        if (it.sub && Array.isArray(it.sub) && it.sub.length > 0) {
          const childs = it.sub.map(iit => getMenuItem(iit, userInfo)).filter(iit => iit !== null);
          if (childs.length > 0) {
            let icon = null;
            if (it.icon && typeof it.icon === 'string') {
              icon = <Icon type={it.icon} />;
            } else if (it.icon) {
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
        return getMenuItem(it, userInfo);
      })}
    </Menu>
  );
};

export default withRouter(CocaMenu);
