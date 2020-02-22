import React from 'react';
import { Checkbox } from 'antd';
import { inject, observer } from 'mobx-react';
import { CurdModal } from '@/model/curd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';

@inject('role')
@observer
class Component extends React.Component<{
  role?: CurdModal;
  onChange?: (checkedValue: Array<CheckboxValueType>) => void;
  value?: Array<CheckboxValueType>;
}> {
  componentDidMount() {
    if (this.props.role) {
      this.props.role.reset('all', []);
    }
    this.load();
  }

  load = async () => {
    if (this.props.role) {
      await this.props.role.index({}, false);
    }
  };

  render() {
    const { role } = this.props;
    const all = role ? role.all : [];

    return (
      <Checkbox.Group
        options={all.map((i: any) => ({ label: i.name, value: i.id }))}
        onChange={this.props.onChange}
        value={this.props.value}
      />
    );
  }
}
export default Component;
