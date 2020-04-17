import React from 'react';
import styled from 'styled-components';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { history, useLocation } from 'umi';

interface IBackProps {
  show?: boolean;
}

const BackButton = styled(ArrowLeftOutlined)`
  cursor: pointer;
`;

const Back: React.FunctionComponent<IBackProps> = ({ show = true }) => {
  const location: any = useLocation();
  if (location.query.back === '0') show = false;
  if (location.query.back === '1') show = true;
  if (show) return <BackButton onClick={() => history.goBack()} style={{ marginRight: 10 }} />;
  return null;
};

export default Back;
