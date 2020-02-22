/**
 * title:
 *  后台管理系统
 */
import React from 'react';
import 'moment/locale/zh-cn';

import Provider from '@/provider';
import moment from 'moment';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { ConfigProvider } from 'antd';

moment.locale('zh-cn');

const BasicLayout: React.FC = ({ children }) => (
  <Provider>
    <ConfigProvider locale={zh_CN}>{children}</ConfigProvider>
  </Provider>
);

export default BasicLayout;
