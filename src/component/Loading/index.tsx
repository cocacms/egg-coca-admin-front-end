import React, { Component } from 'react';
import { Spin } from 'antd';

export default class Loading extends Component {
  render() {
    return (
      <Spin
        style={{
          display: 'flex',
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        {this.props.children}
      </Spin>
    );
  }
}
