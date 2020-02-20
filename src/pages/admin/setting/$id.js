/**
 * title: 编辑系统配置
 * authority:
 *  - setting
 */
import React from 'react';
import { Editor } from '@/component/pager';

export default class extends React.Component {
  render() {
    return <Editor model="setting" name="系统配置" forms={window.setting || []} />;
  }
}
