import React from 'react';
import { Menu, Dropdown, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { history } from 'umi';

import coca from '@/coca';

const Container = styled.div`
  display: flex;
  align-items: center;
`;

export const Item = styled.div`
  padding: 0px 24px;
  height: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  .ant-avatar {
    margin-right: 8px;
  }
  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
`;

class UserDropdown extends React.Component<{
  account: string;
  logout: () => void;
}> {
  reset_password = () => {
    history.push('/password');
  };

  user_menu = (
    <Menu>
      <Menu.Item onClick={this.reset_password}>
        <UserOutlined />
        修改密码
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={this.props.logout}>
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );

  render() {
    return (
      <Container>
        {coca.dropdown}
        <Dropdown overlay={this.user_menu} placement="bottomRight">
          <Item>
            <Avatar size="small" icon={<UserOutlined />} />
            {this.props.account}
          </Item>
        </Dropdown>
      </Container>
    );
  }
}
export default UserDropdown;
