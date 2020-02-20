/**
 * title: 编辑角色
 * authority:
 *  - role
 */

import React from 'react';
import { Editor } from '@/component/pager';

const permission = window.permission || {};

export default class extends React.Component {
  forms = [
    {
      key: 'name',
      type: 'string',
      label: '名称',
      required: true,
    },
    {
      key: 'permission',
      type: 'checkbox',
      label: '权限包',
      options: Object.keys(permission).map(it => ({
        label: permission[it],
        value: it,
      })),
    },
  ];
  render() {
    return <Editor model="role" name="角色" forms={this.forms} />;
  }
}
