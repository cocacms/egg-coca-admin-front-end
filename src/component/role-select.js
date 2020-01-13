import React from 'react';
import { Checkbox } from 'antd';
import { inject, observer } from 'mobx-react';

@inject('role')
@observer
class Component extends React.Component {
  componentDidMount() {
    this.props.role.clear('list_all');
    this.load();
  }

  load = async () => {
    await this.props.role.all();
  };

  render() {
    const { list_all = [] } = this.props.role;

    return (
      <Checkbox.Group
        options={list_all.map(i => ({ label: i.name, value: i.id }))}
        onChange={this.props.onChange}
        value={this.props.value}
      />
    );
  }
}
export default Component;
