import { Menu, Icon } from 'antd';
import withRouter from 'umi/withRouter';
import router from 'umi/router';
import { check } from '@/component/authorized';
import { menu } from '@/coca';

const { SubMenu } = Menu;
const getMenuItem = (it, userInfo) => {
  let is = true;
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
    <Menu.Item key={key} path={it.key}>
      {icon}
      <span>{it.name}</span>
    </Menu.Item>
  );
};

export default withRouter(({ location, userInfo }) => {
  const getMenu = () => {
    if (Array.isArray(menu)) {
      return menu;
    }

    if (typeof menu === 'function') {
      return menu(userInfo);
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
});
