import { Menu, Icon } from 'antd';
import withRouter from 'umi/withRouter';
import router from 'umi/router';
import { check } from '@/component/authorized';
import menu from '@/menu';

const { SubMenu } = Menu;
const getMenuItem = (it, userInfo) => {
  let is = true;
  if (it.authorities) {
    is = check(userInfo, it.authorities);
  }

  if (is !== true) {
    return null;
  }

  return (
    <Menu.Item key={it.key}>
      <Icon type={it.icon} />
      <span>{it.name}</span>
    </Menu.Item>
  );
};

export default withRouter(({ location, userInfo }) => {
  return (
    <Menu
      theme="light"
      mode="inline"
      defaultOpenKeys={menu
        .filter(i => i.sub && Array.isArray(i.sub) && i.sub.length > 0)
        .map(i => i.key)}
      defaultSelectedKeys={[location.pathname]}
      selectedKeys={[location.pathname]}
      onClick={({ key }) => {
        router.push(key);
      }}
    >
      {menu.map(it => {
        if (it.sub && Array.isArray(it.sub) && it.sub.length > 0) {
          const childs = it.sub.map(iit => getMenuItem(iit, userInfo)).filter(iit => iit !== null);
          if (childs.length > 0)
            return (
              <SubMenu
                title={
                  <span>
                    <Icon type={it.icon} />
                    <span>{it.name}</span>
                  </span>
                }
                key={it.key}
              >
                {childs}
              </SubMenu>
            );
          else return null;
        }
        return getMenuItem(it, userInfo);
      })}
    </Menu>
  );
});
