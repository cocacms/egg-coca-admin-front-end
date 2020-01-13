import React from 'react';
import { Menu, Dropdown, Icon, Avatar } from 'antd';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import router from 'umi/router';
import { right_dropdown } from '@/coca';

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
  span {
    margin-right: 8px;
  }
  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
`;

@inject('user')
@observer
class UserDropdown extends React.Component {
  logout = () => {
    this.props.user.logout();
  };

  resetPassword = () => {
    router.push('/admin/resetPassword');
  };

  user_menu = (
    <Menu>
      <Menu.Item onClick={this.resetPassword}>
        <Icon type="user" />
        修改密码
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={this.logout}>
        <Icon type="logout" />
        退出登录
      </Menu.Item>
    </Menu>
  );

  render() {
    return (
      <Container>
        {right_dropdown}
        <Dropdown overlay={this.user_menu} placement="bottomRight">
          <Item>
            <Avatar size="small" icon="user" />
            {this.props.user.info.account}
          </Item>
        </Dropdown>
      </Container>
    );
  }
}
export default UserDropdown;
