import React, { Component } from 'react';

import styles from './_layout.less';
class LoginLayout extends Component {
  state = {};
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.box}>
          <h1 className={styles.title}>{process.env.TITLE}</h1>
          {this.props.children}
        </div>

        <div className={styles.copy}>
          {process.env.TITLE} ©2019 Created by Amoy FreeSailing Technology Co., Ltd.
        </div>
      </div>
    );
  }
}

export default LoginLayout;
