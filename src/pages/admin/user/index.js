/**
 * title:
 *  管理账号管理
 * authority:
 *  - user
 */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Box } from '@/component/form';
import More from '@/component/more';
import Table from '@/component/table';
import { Divider, Row, Col, Button, message, Modal } from 'antd';
import router from 'umi/router';

export const include = [
  {
    association: 'roles',
    attributes: ['id', 'name'],
  },
];
@inject('user')
@observer
class Admin extends React.Component {
  state = {
    query: {},
  };
  columns = [
    {
      width: 100,
      title: 'ID',
      dataIndex: 'id',
      filter: true,
    },
    {
      title: '账号',
      dataIndex: 'account',
      filter: true,
    },
    {
      title: '分配角色',
      dataIndex: 'roles',
      render: text => {
        return text.map(i => i.name).join('、') || '-';
      },
    },
    {
      title: '超级管理员',
      dataIndex: 'superadmin',
      render: text => (text ? '是' : '否'),
    },
    {
      width: 180,
      title: '操作',
      key: 'action',
      render: (text, record) => {
        return (
          <More
            action={[
              {
                key: 'edit',
                title: '编辑',
                onClick: () => {
                  router.push(`/admin/user/${record.id}`);
                },
              },
              {
                key: 'delete',
                title: '删除',
                color: 'red',
                onClick: () => {
                  Modal.confirm({
                    title: '确定要删除？',
                    content: '删除后数据不能恢复哦~请谨慎操作！',
                    onOk: () => {
                      this.destroy(record.id);
                    },
                  });
                },
              },
            ]}
          />
        );
      },
    },
  ];

  load = async data => {
    await this.props.user.index({
      ...data,
      include,
    });
  };

  reload = () => {
    const { location } = this.props;
    router.push({
      pathname: location.pathname,
      query: {
        ...location.query,
        _t: new Date().valueOf(),
      },
    });
  };

  goCreate = () => {
    router.push('/admin/user/0');
  };

  destroy = async id => {
    await this.props.user.destroy(id);
    message.success('删除成功！');
    await this.reload();
  };

  render() {
    return (
      <Box>
        <Row type="flex" justify="space-between">
          <Col>
            <h1>管理账号管理</h1>
          </Col>
          <Col>
            <Button type="primary" onClick={this.goCreate}>
              创建
            </Button>
          </Col>
        </Row>
        <Divider />

        <Table
          load={this.load}
          rowKey="id"
          data={this.props.user.list}
          columns={this.columns}
          filters={[{ key: 'account', label: '账号', type: 'text' }]}
        />
      </Box>
    );
  }
}

export default Admin;
