import React from 'react';

import { Divider, Popconfirm, Button } from 'antd';
// import styled from 'styled-components';

// const A = styled.span`
//   color: ${props => (props.color ? props.color : 'rgba(0, 0, 0, 0.65)')};
//   &:hover {
//     color: ${props => (props.color ? props.color : 'rgba(0, 0, 0, 0.65)')};
//   }
//   cursor: pointer;
// `;

const getActionItem = (item: ICocaAction): React.ReactElement => {
  if (!item) return item;

  if (item.confirm) {
    return (
      <Popconfirm
        key={item.key}
        placement="topRight"
        title={item.confirm}
        okText="是"
        cancelText="否"
        onConfirm={item.onClick}
      >
        <Button type="link" loading={item.loading} danger={item.danger}>
          {item.title}
        </Button>
      </Popconfirm>
    );
  }

  return (
    <Button
      danger={item.danger}
      type="link"
      loading={item.loading}
      key={item.key}
      onClick={item.onClick}
    >
      {item.title}
    </Button>
  );
};

interface IActionProps {
  action: ICocaAction[];
}

const Action: React.FC<IActionProps> = ({ action }) => {
  let actions: React.ReactElement[] = [];
  actions = action.map((it: ICocaAction) => getActionItem(it));
  actions = actions.filter(i => !!i);
  if (actions.length === 0) return <>-</>;
  actions = actions.reduce((result: React.ReactElement[], item: React.ReactElement, index) => {
    result.push(item);
    if (index < actions.length - 1) {
      result.push(<Divider key={`_divider_${index}`} type="vertical" />);
    }
    return result;
  }, []);

  return <>{actions}</>;
};

export default Action;
