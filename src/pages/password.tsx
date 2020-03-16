/**
 * title:
 *  修改密码
 */

import React, { Component } from 'react';
import { Form, Input, Button, message, Divider } from 'antd';
import { inject, observer } from 'mobx-react';
import { LockOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';

import { UserModel } from '@/model/user';
import { Box } from '@/component/Pager';

interface IProps {
  user: UserModel;
}

interface IState {}

const FormItem = Form.Item;

class Login extends Component<IProps, IState> {
  form: React.RefObject<FormInstance> = React.createRef();

  handleSubmit = async (values: any) => {
    await this.props.user.resetPassword(values.password, values.newpassword);
    message.success('密码修改成功！');
  };

  render() {
    return (
      <Box>
        <h1>修改密码</h1>
        <Divider />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Form style={{ width: 380 }} onFinish={this.handleSubmit}>
            <FormItem name="password" rules={[{ required: true, message: '请输入旧密码' }]}>
              <Input
                type="password"
                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="旧密码"
              />
            </FormItem>

            <FormItem
              name="newpassword"
              rules={[
                { required: true, message: '请输入新密码' },
                { type: 'string', min: 8, message: '密码最少为8位' },
              ]}
            >
              <Input
                type="password"
                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="新密码"
              />
            </FormItem>

            <FormItem
              name="renewpassword"
              rules={[
                { required: true, message: '请再次输入新密码' },
                (form: any) => {
                  return {
                    validator(rule: any, value: any, callback) {
                      if (value == !form.getFieldValue('newpassword')) {
                        callback('两次密码输入不一致');
                      }
                    },
                    message: '两次密码输入不一致',
                  };
                },
              ]}
            >
              <Input
                type="password"
                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="新密码二次确认"
              />
            </FormItem>

            <FormItem>
              <Button type="primary" htmlType="submit">
                修改密码
              </Button>
            </FormItem>
          </Form>
        </div>
      </Box>
    );
  }
}

export default inject('user')(observer(Login));
