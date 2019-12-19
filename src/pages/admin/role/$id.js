/**
 * title: 编辑角色
 * authority:
 *  - role
 */
import React from 'react';
import { Form, Input, Checkbox, Button, Divider, message, Icon, Skeleton } from 'antd';
import { Box, formItemLayout, tailFormItemLayout } from '@/component/form';
import { inject, observer } from 'mobx-react';
import router from 'umi/router';
import styled from 'styled-components';

const Back = styled(Icon)`
  cursor: pointer;
`;

@Form.create()
@inject('user', 'role')
@observer
class Config extends React.Component {
  id;

  componentDidMount() {
    this.props.role.clearCurrent();
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
          await this.props.role.update(this.id, values);
        } else {
          await this.props.role.create(values);
        }
        await this.props.user.loadInfo(true);
        message.success('操作成功！');
        router.goBack();
      }
    });
  };

  load = async () => {
    await this.props.role.show(this.id);
  };

  render() {
    const { current } = this.props.role;
    const { getFieldDecorator } = this.props.form;
    const isUpdate = this.props.match.params.id !== '0';
    const permission = window.permission || {};

    return (
      <Box>
        <h1>
          <Back type="arrow-left" onClick={() => router.goBack()} /> {!isUpdate ? '添加' : '编辑'}
          角色
        </h1>
        <Divider />
        {isUpdate && !current.id ? (
          <Skeleton active />
        ) : (
          <Form {...formItemLayout}>
            <Form.Item label="名称">
              {getFieldDecorator('name', {
                initialValue: isUpdate ? current.name : '',
                rules: [
                  {
                    type: 'string',
                    required: true,
                    message: '请输入名称',
                  },
                ],
              })(<Input />)}
            </Form.Item>

            <Form.Item label="权限包">
              {getFieldDecorator('permission', {
                initialValue: isUpdate ? current.permission : [],
              })(
                <Checkbox.Group
                  options={Object.keys(permission).map(it => ({
                    label: permission[it],
                    value: it,
                  }))}
                />,
              )}
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
