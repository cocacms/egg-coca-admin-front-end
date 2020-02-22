import React from 'react';
import withRouter from 'umi/withRouter';
import styled from 'styled-components';
import { Icon } from 'antd';
import router from 'umi/router';

import { IRouteComponentProps } from '@/index';

interface IBackProps extends IRouteComponentProps {
  show?: boolean;
}

const BackButton = styled(Icon)`
  cursor: pointer;
`;

const Back: React.FunctionComponent<IBackProps> = ({ location, show = true }) => {
  if (location.query.back === '0') show = false;
  if (location.query.back === '1') show = true;
  if (show)
    return (
      <BackButton type="arrow-left" onClick={() => router.goBack()} style={{ marginRight: 10 }} />
    );
  return null;
};

export default withRouter(Back);
