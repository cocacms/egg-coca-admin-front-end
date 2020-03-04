import React from 'react';
import styled from 'styled-components';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { history, withRouter } from 'umi';

import { IRouteComponentProps } from '@/index';

interface IBackProps extends IRouteComponentProps {
  show?: boolean;
}

const BackButton = styled(ArrowLeftOutlined)`
  cursor: pointer;
`;

const Back: React.FunctionComponent<IBackProps> = ({ location, show = true }) => {
  if (location.query.back === '0') show = false;
  if (location.query.back === '1') show = true;
  if (show) return <BackButton onClick={() => history.goBack()} style={{ marginRight: 10 }} />;
  return null;
};

export default withRouter(Back);
