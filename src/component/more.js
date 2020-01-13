import { Divider, Dropdown, Icon, Menu, Popconfirm } from 'antd';
import styled from 'styled-components';

const A = styled.span`
  color: ${props => (props.color ? props.color : 'rgba(0, 0, 0, 0.65)')};
  &:hover {
    color: ${props => (props.color ? props.color : 'rgba(0, 0, 0, 0.65)')};
  }
  cursor: pointer;
`;

const getActionItem = item => {
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
        <A color={item.color}>{item.title}</A>
      </Popconfirm>
    );
  }
  return (
    <A color={item.color} key={item.key} onClick={item.onClick}>
      {item.title}
    </A>
  );
};

export default ({ action, hide = true }) => {
  let actions = [];

  if (action.length > 2 && hide) {
    const it = action[0];
    actions.push(getActionItem(it));

    const menu = [];
    for (let index = 1; index < action.length; index++) {
      const it = action[index];
      menu.push(
        <Menu.Item key={it.key} onClick={it.onClick}>
          <A color={it.color}>{it.title}</A>
        </Menu.Item>,
      );
    }

    actions.push(
      <Dropdown key="_menu_" overlay={<Menu>{menu}</Menu>}>
        <A>
          更多
          <Icon type="down" />
        </A>
      </Dropdown>,
    );
  } else {
    actions = action.map(it => getActionItem(it));
  }

  actions = actions.filter(i => !!i);
  if (actions.length === 0) return '-';
  actions = actions.reduce((result, item, index) => {
    result.push(item);
    if (index < actions.length - 1) {
      result.push(<Divider key={`_divider_${index}`} type="vertical" />);
    }
    return result;
  }, []);
  return actions;
};
