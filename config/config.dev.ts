// ref: https://umijs.org/config/
import { defineConfig } from 'umi';

export default defineConfig({
  publicPath: '/',
  base: '/',
  define: {
    'process.env.APIHOST': 'https://dev.xxx.cn',
    'process.env.APIAUTHNAME': 'Coca_Dev_Authorization',
  },
});
