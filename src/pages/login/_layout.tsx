import React, { Component } from 'react';

import styled from 'styled-components';

const Container = styled.div`
  height: 100vh;
  width: 100%;
  background-image: url(${require('@/assets/bg.jpg')});
  background-repeat: no-repeat;
  background-size: cover;
  .box {
    position: absolute;
    top: 40%;
    left: 50%;
    margin: -160px 0 0 -160px;
    width: 350px;
    min-height: 320px;
    padding: 36px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    -webkit-box-shadow: 0 0 100px rgba(0, 0, 0, 0.08);
    box-shadow: 0 0 100px rgba(0, 0, 0, 0.08);
    .title {
      text-align: center;
      height: 45px;
      line-height: 45px;
    }

    .logo {
      height: 37px;
      margin-right: 5px;
    }
  }

  .copy {
    width: 100%;
    padding: 0px 20px;
    text-align: center;
    position: absolute;
    bottom: 20px;
    left: 0;
    color: #fff;
  }
`;

class LoginLayout extends Component {
  state = {};
  render() {
    return (
      <Container>
        <div className="box">
          <h1 className="title">{process.env.TITLE}</h1>
          {this.props.children}
        </div>

        <div className="copy">
          {process.env.TITLE} ©2019 Created by Amoy FreeSailing Technology Co., Ltd.
        </div>
      </Container>
    );
  }
}

export default LoginLayout;
