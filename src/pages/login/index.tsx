/**
 * title:
 *  登录
 */

import React, { Component } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { inject, observer } from 'mobx-react';
import { history, useModel } from 'umi';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const LoginForm = styled(Form)`
  width: 100%;

  .login-form-button {
    width: 100%;
  }

  .remeber-forget {
    display: flex;
    justify-content: space-between;
  }

  .sendCode {
    font-size: 10px;
    cursor: pointer;
  }
`;

interface IProps {
  user: any;
}

const FormItem = Form.Item;

const Login: React.FC<IProps> = ({ user }) => {
  const { refresh } = useModel('@@initialState');

  const handleSubmit = async (values: any) => {
    await user.login(values.account, values.password, values.remember);
    await refresh();
    await history.push('/admin');
  };

  return (
    <LoginForm onFinish={handleSubmit} initialValues={{ remember: true }}>
      <FormItem name="account">
        <Input prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="账号" />
      </FormItem>
      <FormItem name="password">
        <Input
          prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
          type="password"
          placeholder="密码"
        />
      </FormItem>

      <div className="remeber-forget">
        <FormItem name="remember" valuePropName="checked">
          <Checkbox>记住登录状态</Checkbox>
        </FormItem>
      </div>
      <div>
        <Button type="primary" htmlType="submit" block className="login-form-button">
          登录
        </Button>
      </div>
    </LoginForm>
  );
};
export default inject('user')(observer(Login));
