/**
 * title: 管理角色
 * authority:
 *  - role
 */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Box } from '@/component/form';
import More from '@/component/more';
import Table from '@/component/table';
import { Divider, Row, Col, Button, message, Modal } from 'antd';
import router from 'umi/router';

@inject('role')
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
      title: '角色名',
      dataIndex: 'name',
    },
    {
      title: '权限',
      dataIndex: 'permission',
      render: text => {
        const permission = window.permission || {};
        return text.map(i => permission[i]).join('、') || '-';
      },
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
                  router.push(`/admin/role/${record.id}`);
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
    await this.props.role.index({
      ...data,
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
    router.push('/admin/role/0');
  };

  destroy = async id => {
    await this.props.role.destroy(id);
    message.success('删除成功！');
    await this.reload();
  };

  render() {
    return (
      <Box>
        <Row type="flex" justify="space-between">
          <Col>
            <h1>角色管理</h1>
          </Col>
          <Col>
            <Button type="primary" onClick={this.goCreate}>
              创建
            </Button>
          </Col>
        </Row>
        <Divider />

        <Table load={this.load} rowKey="id" data={this.props.role.list} columns={this.columns} />
      </Box>
    );
  }
}

export default Admin;
