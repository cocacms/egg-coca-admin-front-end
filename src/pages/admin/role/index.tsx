/**
 * title: 管理角色
 * authority:
 *  - role
 */

import React from 'react';
import Pager from '@/component/pager';

export default class extends React.Component {
  columns = [
    {
      title: '角色名',
      dataIndex: 'name',
    },
    {
      title: '权限',
      dataIndex: 'permission',
      render: (text: string[]) => {
        const permission = window.permission || {};
        return (text || []).map((i: string) => permission[i]).join('、') || '-';
      },
    },
  ];

  render() {
    return <Pager name="角色" model="role" columns={this.columns} />;
  }
}
