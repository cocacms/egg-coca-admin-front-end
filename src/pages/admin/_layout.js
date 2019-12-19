import { useState } from 'react';
import { Layout, Icon, Tag } from 'antd';
import styled from 'styled-components';
import Link from 'umi/link';
import { inject, observer } from 'mobx-react';

import Menu from '@/component/menu';
import UserDropdown from '@/component/user-dropdown';

const { Header, Sider, Content, Footer } = Layout;

const MainLayout = styled(Layout)`
  min-height: 100vh !important;
`;

const Logo = styled.div`
  color: #1890ff;
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

const TriggerButton = styled(Icon)`
  font-size: 18px;
  line-height: 64px;
  cursor: pointer;
  transition: color 0.3s;
  &:hover {
    color: #1890ff;
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

const AdminLayout = ({ children, user }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <MainLayout>
      <MainSider theme="light" trigger={null} collapsible collapsed={collapsed}>
        <Link to="/admin">
          <Logo collapsed={collapsed}>{process.env.TITLE}</Logo>
        </Link>
        <Menu userInfo={user.info || {}} />
      </MainSider>
      <Layout>
        <MainHeader theme="light">
          <TriggerButton
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={() => {
              setCollapsed(!collapsed);
            }}
          />
          <UserDropdown />
        </MainHeader>

        <MainContent>{children}</MainContent>
        <MainFooter>
          {process.env.TITLE} ©2019 Created by Amoy FreeSailing Technology Co., Ltd.
        </MainFooter>
      </Layout>
      {process.env.ENV === 'dev' && <EnvTag color="red">测试环境 v{process.env.VERSION}</EnvTag>}
      {process.env.ENV === 'prod' && <EnvTag color="green">正式环境 v{process.env.VERSION}</EnvTag>}
    </MainLayout>
  );
};

export default inject('user')(observer(AdminLayout));
