import React from 'react';
import { Result, Button } from 'antd';
import router from 'umi/router';
import { inject, observer } from 'mobx-react';
import userModel from '@/model/user';

export const check = (userinfo, authorities) => {
  if (userinfo.type === 'super') {
    return true;
  }

  if (!userinfo.id) {
    return 401;
  }

  let UserAllPermission = userinfo.roles.reduce((pre, role) => {
    for (const permission of role.permission) {
      pre.push(permission);
    }
    return pre;
  }, []);

  UserAllPermission = Array.from(new Set(UserAllPermission));

  if (authorities === undefined) {
    return true;
  }

  if (Array.isArray(authorities)) {
    let lack = [];
    for (const authority of authorities) {
      if (!UserAllPermission.includes(authority)) {
        lack.push(authority);
      }
    }
    if (lack.length === 0) {
      return true;
    }
    return lack;
  }

  return 403;
};

@inject('user')
@observer
class AuthorityComponent extends React.Component {
  render403(lack) {
    let str = '对不起，您没有访问该页面的权限。';
    const permission = window.permission || {};

    if (Array.isArray(lack)) {
      str = `对不起，您缺少 [ ${lack.map(it => permission[it] || it).join('，')} ] 权限。`;
    }

    return (
      <Result
        status="403"
        subTitle={str}
        title="403"
        extra={
          <Button
            type="primary"
            onClick={() => {
              router.push('/admin');
            }}
          >
            返回首页
          </Button>
        }
      />
    );
  }

  render401() {
    return (
      <Result
        status="403"
        subTitle="对不起，您还未登录。"
        title="401"
        extra={
          <Button
            type="primary"
            onClick={() => {
              router.push('/login');
            }}
          >
            登录
          </Button>
        }
      />
    );
  }

  render() {
    const { route, children, user } = this.props;
    const authorities = route.authority;

    const checkResult = check(user.info, authorities);

    if (checkResult === 401) {
      return this.render401();
    }

    if (checkResult === 403 || Array.isArray(checkResult)) {
      return this.render403(checkResult);
    }

    return children;
  }
}

@inject('user')
@observer
class Can extends React.Component {
  render() {
    const { authority = [], children, user } = this.props;
    const checkResult = check(user.info, authority);
    if (checkResult === true) return children;
    return null;
  }
}

const can = (authority = [], cb) => {
  const checkResult = check(userModel.info || {}, authority);
  if (checkResult === true && typeof cb === 'function') cb();
};

export { Can, can };
export default AuthorityComponent;
