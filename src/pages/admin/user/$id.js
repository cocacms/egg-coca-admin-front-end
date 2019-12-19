/**
 * title: 编辑管理账号
 * authority:
 *  - role
 *  - user
 */
import React from 'react';
import { Form, Input, Checkbox, Button, Divider, message, Icon, Skeleton, Switch } from 'antd';
import { Box, formItemLayout, tailFormItemLayout } from '@/component/form';
import { inject, observer } from 'mobx-react';
import router from 'umi/router';
import styled from 'styled-components';
import { include } from './index';

const Back = styled(Icon)`
  cursor: pointer;
`;

@Form.create()
@inject('user', 'role')
@observer
class Config extends React.Component {
  id;

  componentDidMount() {
    this.props.user.clearCurrent();
    this.id = this.props.match.params.id;
    if (this.id !== '0') {
      this.load();
    }
  }

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        if (this.id !== '0') {
          await this.props.user.update(this.id, values, { links: ['Roles'] });
        } else {
          await this.props.user.create(values, { links: ['Roles'] });
        }
        message.success('操作成功！');
        router.goBack();
      }
    });
  };

  load = async () => {
    await this.props.role.all();
    await this.props.user.show(this.id, { include });
  };

  render() {
    const { current = {} } = this.props.user;
    const { list_all = [] } = this.props.role;
    const { getFieldDecorator } = this.props.form;
    const isUpdate = this.props.match.params.id !== '0';

    return (
      <Box>
        <h1>
          <Back type="arrow-left" onClick={() => router.goBack()} /> {!isUpdate ? '添加' : '编辑'}
          管理员账号
        </h1>
        <Divider />
        {isUpdate && !current.id ? (
          <Skeleton active />
        ) : (
          <Form {...formItemLayout}>
            <Form.Item label="账号">
              {getFieldDecorator('account', {
                initialValue: isUpdate ? current.account : '',
                rules: [
                  {
                    type: 'string',
                    required: true,
                    message: '请输入账号',
                  },
                ],
              })(<Input disabled={isUpdate} />)}
            </Form.Item>

            <Form.Item
              label="密码"
              help={
                <div>
                  添加时，必填；
                  <br />
                  编辑时，非必填（填则修改密码，不填则不会修改密码）
                </div>
              }
            >
              {getFieldDecorator('password', {
                initialValue: '',
                rules: [
                  {
                    type: 'string',
                    required: !isUpdate,
                    message: '请输入密码',
                  },
                ],
              })(<Input />)}
            </Form.Item>

            <Form.Item label="分配角色">
              {getFieldDecorator('roles', {
                initialValue: isUpdate ? current.roles.map(i => String(i.id)) : [],
              })(
                <Checkbox.Group
                  options={list_all.map(it => ({ label: it.name, value: String(it.id) }))}
                />,
              )}
            </Form.Item>

            <Form.Item label="超管">
              {getFieldDecorator('superadmin', {
                initialValue: isUpdate ? current.superadmin : false,
                valuePropName: 'checked',
                rules: [
                  {
                    type: 'boolean',
                    required: true,
                    message: '请选择是否为超管',
                  },
                ],
              })(<Switch />)}
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
              <Button onClick={this.handleSubmit} type="primary">
                提交
              </Button>
            </Form.Item>
          </Form>
        )}
      </Box>
    );
  }
}
export default Config;
