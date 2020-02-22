/**
 * title:
 *  数据报表
 *
 * authority:
 */
import { inject, observer } from 'mobx-react';
import React from 'react';
import styled from 'styled-components';
import { UserModel } from '@/model/user';

const Container = styled.div`
  background-color: #ffffff;
  padding: 16px;
`;

interface IProps {
  user: UserModel;
}

@inject('user')
@observer
class Page extends React.Component<IProps> {
  state = {};

  componentDidMount() {}

  render() {
    const { info } = this.props.user;
    return <Container>欢迎使用，{info.account}</Container>;
  }
}

export default Page;
