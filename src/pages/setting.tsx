/**
 * title: 编辑系统配置
 * authority:
 *  - setting
 */
import React from 'react';
import { Editor } from '@/component/Pager';
import { useModel } from 'umi';

export default () => {
  const { initialState } = useModel('@@initialState');
  return <Editor model="setting" name="系统配置" forms={initialState?.setting || []} />;
};
