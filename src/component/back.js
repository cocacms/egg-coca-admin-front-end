import withRouter from 'umi/withRouter';
import styled from 'styled-components';
import { Icon } from 'antd';
import router from 'umi/router';

const Back = styled(Icon)`
  cursor: pointer;
`;

export default withRouter(({ location, show = true }) => {
  if (location.query.back === '0') show = false;
  if (location.query.back === '1') show = true;
  if (show)
    return <Back type="arrow-left" onClick={() => router.goBack()} style={{ marginRight: 10 }} />;
  return null;
});
