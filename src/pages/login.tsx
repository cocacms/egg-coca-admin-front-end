import React, { Component } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { inject, observer } from 'mobx-react';
import { history, useModel } from 'umi';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const Container = styled.div`
  height: 100vh;
  width: 100%;
  background-image: url(${require('@/assets/bg.jpg')});
  background-repeat: no-repeat;
  background-size: cover;
  .box {
    position: absolute;
    top: 40%;
    left: 50%;
    margin: -160px 0 0 -160px;
    width: 350px;
    min-height: 320px;
    padding: 36px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    -webkit-box-shadow: 0 0 100px rgba(0, 0, 0, 0.08);
    box-shadow: 0 0 100px rgba(0, 0, 0, 0.08);
    .title {
      text-align: center;
      height: 45px;
      line-height: 45px;
    }

    .logo {
      height: 37px;
      margin-right: 5px;
    }
  }

  .copy {
    width: 100%;
    padding: 0px 20px;
    text-align: center;
    position: absolute;
    bottom: 20px;
    left: 0;
    color: #fff;
  }
`;

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
    await history.push('/');
  };

  return (
    <Container>
      <div className="box">
        <h1 className="title">{process.env.TITLE}</h1>
        <LoginForm onFinish={handleSubmit} initialValues={{ remember: true }}>
          <FormItem name="account">
            <Input
              prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="账号"
            />
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
      </div>
      <div className="copy">
        {process.env.TITLE} ©2019 Created by Amoy FreeSailing Technology Co., Ltd.
      </div>
    </Container>
  );
};
export default inject('user')(observer(Login));
