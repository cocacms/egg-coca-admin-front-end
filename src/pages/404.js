import { Result, Button } from 'antd';
import router from 'umi/router';

export default () => {
  return (
    <Result
      status="404"
      subTitle="Sorry, the page you visited is building OR does not exist."
      title="404"
      extra={
        <Button
          type="primary"
          onClick={() => {
            router.replace('/admin');
          }}
        >
          返回首页
        </Button>
      }
    />
  );
};
