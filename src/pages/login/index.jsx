/**
 * title:
 *  登录
 */

import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { inject, observer } from 'mobx-react';
import router from 'umi/router';
import Link from 'umi/link';

import './index.less';

const FormItem = Form.Item;

@inject('user')
@observer
@Form.create()
class Login extends Component {
  state = {};

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        await this.props.user.login(values.account, values.password, values.remember);
        await router.push('/admin');
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('account', {
            rules: [{ required: true, message: '请输入登录账号' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="账号"
            />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="密码"
            />,
          )}
        </FormItem>
        <FormItem>
          <div className="remeber-forget">
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(<Checkbox>记住登录状态</Checkbox>)}
            <Link to="/login/forget"></Link>
          </div>
          <div>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </div>
        </FormItem>
      </Form>
    );
  }
}

export default Login;
