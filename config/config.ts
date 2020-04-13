// ref: https://umijs.org/config/
import { defineConfig } from 'umi';
import theme from './theme';
import routes from './route';

export default defineConfig({
  history: {
    type: 'hash',
  },
  hash: true,
  alias: {},
  define: {
    'process.env.APIHOST': 'http://localhost:7001',
    'process.env.APIAUTHNAME': 'Coca_Local_Authorization',
    'process.env.APIPREFIX': '/backend',
    'process.env.TITLE': 'Coca管理平台',
    'process.env.ENV': 'dev',
    'process.env.VERSION': '1.0.0',
  },
  theme,
  antd: {
    dark: false,
  },
  favicon: 'favicon.ico',
  dva: false,
  dynamicImport: {
    loading: '@/component/Loading/index.tsx',
  },
  title: 'Coca管理平台',
  routes,
});
