/**
 * title:
 *  找回密码
 */

import React, { Component } from 'react';
import { Form, Icon, Input, Button, message, Spin } from 'antd';
import { inject, observer } from 'mobx-react';
import router from 'umi/router';
import Link from 'umi/link';
import { FormComponentProps } from 'antd/es/form';
import { UserModel } from '@/model/user';

import './index.less';

interface IProps {
  form: FormComponentProps['form'];
  user: UserModel;
}

interface IState {}

const FormItem = Form.Item;

let timer: number;

interface IProps {
  form: FormComponentProps['form'];
  user: UserModel;
}

interface IState {
  time: number;
  sending: boolean;
}

class Login extends Component<IProps, IState> {
  state = {
    time: 0,
    sending: false,
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        await this.props.user.forgetPassword(values.mail, values.password, values.code);
        message.success('密码修改成功！');
        router.replace('/login');
      }
    });
  };

  code = async () => {
    if (this.state.time > 0) {
      return;
    }
    const { form, user } = this.props;
    await form.validateFields(['mail']);
    const mail = form.getFieldValue('mail');
    this.setState({ sending: true });
    try {
      await user.code(mail);
      message.success('验证码已发送！');
      this.startTimer();
    } finally {
      this.setState({ sending: false });
    }
  };

  startTimer = () => {
    clearInterval(timer);
    this.setState({ time: 60 }, () => {
      timer = setInterval(() => {
        if (this.state.time <= 0) {
          clearInterval(timer);
          return;
        }
        this.setState({ time: this.state.time - 1 });
      }, 1000);
    });
  };

  componentWillUnmount() {
    clearInterval(timer);
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('mail', {
            rules: [
              { required: true, message: '请输入登录邮箱账号' },
              { type: 'email', message: '请输入正确邮箱' },
            ],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="登录邮箱"
            />,
          )}
        </FormItem>

        <FormItem>
          {getFieldDecorator('code', {
            rules: [{ required: true, message: '请输入验证码' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="验证码"
              addonAfter={
                <Spin size="small" spinning={this.state.sending}>
                  <span onClick={this.code} className="sendCode">
                    {this.state.time <= 0 ? '获取验证码' : `${this.state.time}s`}
                  </span>
                </Spin>
              }
            />,
          )}
        </FormItem>

        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="密码"
            />,
          )}
        </FormItem>
        <FormItem>
          <div className="remeber-forget">
            <div />
            <Link to="/login">返回登录</Link>
          </div>
          <div>
            <Button type="primary" htmlType="submit" className="login-form-button">
              修改密码
            </Button>
          </div>
        </FormItem>
      </Form>
    );
  }
}

export default inject('user')(observer(Form.create<IProps>()(Login)));
