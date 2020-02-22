import React from 'react';
import { Result, Button } from 'antd';
import router from 'umi/router';
import { MobXProviderContext, Observer } from 'mobx-react';

import user, { UserModel } from '@/model/user';

export const check = (
  userinfo: ICocaUserInfo,
  authorities: string[],
): boolean | number | string[] => {
  if (userinfo.type === 'super') {
    return true;
  }

  if (!userinfo.id) {
    return 401;
  }

  let UserAllPermission = userinfo?.roles.reduce((pre: string[], role) => {
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

class AuthorityComponent extends React.Component<{
  user: UserModel;
  route: any;
}> {
  static contextType = MobXProviderContext;

  render403(lack: boolean | number | string[]) {
    let str = '对不起，您没有访问该页面的权限。';
    const permission = window.permission || {};

    if (Array.isArray(lack)) {
      str = `对不起，您缺少 [ ${lack
        .map((it: string) => permission[it] || it)
        .join('，')} ] 权限。`;
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
    const { route, children } = this.props;
    const authorities = route.authority;
    const { user } = this.context;

    return (
      <Observer
        render={() => {
          const checkResult: boolean | number | string[] = check(user.info, authorities);

          if (checkResult === 401) {
            return this.render401();
          }

          if (checkResult === 403 || Array.isArray(checkResult)) {
            return this.render403(checkResult);
          }

          return <>{children}</>;
        }}
      />
    );
  }
}

const Can: React.FC<{
  authority: string[];
}> = ({ authority, children }) => {
  const context = React.useContext(MobXProviderContext);
  return (
    <Observer
      render={() => {
        const checkResult: boolean | number | string[] = check(context.user.info, authority);
        if (checkResult === true) return <>{children}</>;
        return <></>;
      }}
    />
  );
};

const can = (authority = [], cb: () => void) => {
  const checkResult: boolean | number | string[] = check(user.info || {}, authority);
  if (checkResult === true && typeof cb === 'function') cb();
};

export { Can, can };
export default AuthorityComponent;
