/**
 * title:
 *  修改密码
 */

import React, { Component } from 'react';
import { Form, Icon, Input, Button, message, Divider } from 'antd';
import { inject, observer } from 'mobx-react';
import { FormComponentProps } from 'antd/es/form';

import { UserModel } from '@/model/user';
import { Box } from '@/component/Pager/form';

interface IProps {
  form: FormComponentProps['form'];
  user: UserModel;
}

interface IState {}

const FormItem = Form.Item;

class Login extends Component<IProps, IState> {
  handleSubmit = (e: any) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        await this.props.user.resetPassword(values.password, values.newpassword);
        message.success('密码修改成功！');
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    return (
      <Box>
        <h1>修改密码</h1>
        <Divider />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Form style={{ width: 380 }} onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入旧密码' }],
              })(
                <Input
                  type="password"
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="旧密码"
                />,
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('newpassword', {
                rules: [
                  { required: true, message: '请输入新密码' },
                  { type: 'string', min: 8, message: '密码最少为8位' },
                ],
              })(
                <Input
                  type="password"
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="新密码"
                />,
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('renewpassword', {
                rules: [
                  { required: true, message: '请再次输入新密码' },
                  {
                    validator(rule, value, callback) {
                      return value === getFieldValue('newpassword');
                    },
                    message: '两次密码输入不一致',
                  },
                ],
              })(
                <Input
                  type="password"
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="新密码二次确认"
                />,
              )}
            </FormItem>

            <FormItem>
              <Button type="primary" htmlType="submit" className="login-form-button">
                修改密码
              </Button>
            </FormItem>
          </Form>
        </div>
      </Box>
    );
  }
}

export default inject('user')(observer(Form.create<IProps>()(Login)));
