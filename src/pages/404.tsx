import React from 'react';

import { Result, Button } from 'antd';
import { history } from 'umi';

const The404: React.FC = () => {
  return (
    <Result
      status="404"
      subTitle="Sorry, the page you visited is building OR does not exist."
      title="404"
      extra={
        <Button
          type="primary"
          onClick={() => {
            history.replace('/admin');
          }}
        >
          返回首页
        </Button>
      }
    />
  );
};

export default The404;
