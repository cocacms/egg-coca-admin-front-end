import React from 'react';

import { Result, Button } from 'antd';
import { history } from 'umi';

const The404: React.FC = () => {
  return (
    <Result
      status="404"
      subTitle="对不起，您访问的页面不存在。"
      title="404"
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
};

export default The404;
