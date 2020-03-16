import React, { useState } from 'react';
import { Layout, Tag } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Link, useModel } from 'umi';
import { inject, observer } from 'mobx-react';
import Menu from '@/component/Menu';
import HeaderDropdown from '@/component/Dropdown';

import theme from '@/../config/theme';

const { Header, Sider, Content, Footer } = Layout;

const MainLayout = styled(Layout)`
  min-height: 100vh !important;
`;

const Logo = styled.div<{ collapsed: boolean }>`
  color: ${theme['@primary-color']};
  font-size: ${props => (props.collapsed ? '12px' : '20px')};
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  img {
    height: 40px;
    margin-right: 8px;
  }
`;

const MenuUnfoldOutlinedButton = styled(MenuUnfoldOutlined)`
  font-size: 18px;
  line-height: 64px;
  cursor: pointer;
  transition: color 0.3s;
  &:hover {
    color: #${theme['@primary-color']};
  }
`;

const MenuFoldOutlinedButton = styled(MenuFoldOutlined)`
  font-size: 18px;
  line-height: 64px;
  cursor: pointer;
  transition: color 0.3s;
  &:hover {
    color: #${theme['@primary-color']};
  }
`;

const MainSider = styled(Sider)``;
const MainHeader = styled(Header)`
  background: #ffffff !important;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
`;

const MainContent = styled(Content)`
  margin: 24px 16px;
  padding: 24px;
`;

const MainFooter = styled(Footer)`
  text-align: center;
`;

const EnvTag = styled(Tag)`
  position: fixed;
  bottom: 0px;
  right: 0px;
`;

interface IProps {
  user: any;
}

const AdminLayout: React.FC<IProps> = inject('user')(
  observer(props => {
    const { children, user } = props;
    const [collapsed, setCollapsed] = useState(false);

    const { refresh } = useModel('@@initialState');

    const logout = () => {
      user.logout();
      refresh();
    };

    return (
      <MainLayout>
        <MainSider theme="light" trigger={null} collapsible collapsed={collapsed}>
          <Link to="/admin">
            <Logo collapsed={collapsed}>{process.env.TITLE}</Logo>
          </Link>
          <Menu />
        </MainSider>
        <Layout>
          <MainHeader theme="light">
            {collapsed ? (
              <MenuUnfoldOutlinedButton
                onClick={() => {
                  setCollapsed(!collapsed);
                }}
              />
            ) : (
              <MenuFoldOutlinedButton
                onClick={() => {
                  setCollapsed(!collapsed);
                }}
              />
            )}
            <HeaderDropdown account={user.info.account} logout={logout} />
          </MainHeader>

          <MainContent>{children}</MainContent>
          <MainFooter>
            {process.env.TITLE} ©2019 Created by Amoy FreeSailing Technology Co., Ltd.
          </MainFooter>
        </Layout>
        {process.env.ENV === 'dev' && <EnvTag color="red">测试环境 v{process.env.VERSION}</EnvTag>}
        {process.env.ENV === 'prod' && (
          <EnvTag color="green">正式环境 v{process.env.VERSION}</EnvTag>
        )}
      </MainLayout>
    );
  }),
);

export default AdminLayout;
