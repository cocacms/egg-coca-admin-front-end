/**
 * title:
 *  管理账号管理
 * authority:
 *  - user
 */
import React from 'react';
import Pager from '@/component/pager';

export default class extends React.Component {
  state = {
    show: false,
  };

  columns = [
    {
      title: '账号',
      dataIndex: 'account',
    },
    {
      title: '分配角色',
      dataIndex: 'roles',
      render: text => {
        return text.map(i => i.name).join('、') || '-';
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: text => ({ super: '超级管理员', admin: '管理员', normal: '普通员工' }[text]),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
    },
  ];

  filters = [
    { key: 'account', label: '账号', type: 'text' },
    { key: 'createdAt', label: '创建时间', type: 'date' },
  ];

  query = {
    include: [
      {
        association: 'roles',
        attributes: ['id', 'name'],
      },
    ],
  };

  render() {
    return (
      <Pager
        name="账号管理"
        model="user"
        columns={this.columns}
        filters={this.filters}
        query={this.query}
      ></Pager>
    );
  }
}
