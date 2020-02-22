// ref: https://umijs.org/config/
import { IConfig } from 'umi-types';

const config: IConfig = {
  publicPath: '/',
  base: '/',
  define: {
    'process.env.APIHOST': 'https://dev.xxx.cn',
    'process.env.APIAUTHNAME': 'Coca_Dev_Authorization',
  },
};

export default config;
