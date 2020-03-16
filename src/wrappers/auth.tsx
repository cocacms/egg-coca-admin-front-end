import React from 'react';
import { Result, Button } from 'antd';
import { useAccess, history } from 'umi';

const Auth: React.FC<{ route: any }> = props => {
  const { children, route } = props;
  const access = useAccess();
  if (!access[route.access]) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="对不起，您没有权限访问此页面。"
        extra={
          <Button
            type="primary"
            onClick={() => {
              history.replace('/');
            }}
          >
            返回首页
          </Button>
        }
      />
    );
  }

  return <>{children}</>;
};

export default Auth;
