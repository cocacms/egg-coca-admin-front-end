import axios from 'axios';
import { message } from 'antd';
import user from '@/model/user';

const request = axios.create({
  baseURL: process.env.APIHOST,
  timeout: 5000,
  validateStatus: () => true,
});

request.interceptors.request.use(
  function(config) {
    let Authorization =
      localStorage[process.env.APIAUTHNAME] || sessionStorage[process.env.APIAUTHNAME];
    if (Authorization) {
      config.headers.Authorization = `Basic ${Authorization}`;
    }

    return config;
  },
  function(error) {
    return Promise.reject(error);
  },
);

request.interceptors.response.use(
  function(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }

    let msg = `未知请求错误 错误代码：${response.status}`;

    if (response.data.message) {
      msg = response.data.message;
    }

    if (response.status === 422 && response.data.errors) {
      msg = response.data.errors.errors[0].message;
    }

    if (response.status === 401) {
      user.logout();
    }

    message.error(msg);

    return Promise.reject(msg);
  },
  function(error) {
    const messageMap = {
      'Network Error': '无法访问服务器'
    }
    message.error(messageMap[error.message] || error.message);
    return Promise.reject(error);
  },
);

export default request;
