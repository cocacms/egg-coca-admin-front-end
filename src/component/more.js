import { Divider, Dropdown, Icon, Menu } from 'antd';
import styled from 'styled-components';

const A = styled.span`
  color: ${props => (props.color ? props.color : 'rgba(0, 0, 0, 0.65)')};
  &:hover {
    color: ${props => (props.color ? props.color : 'rgba(0, 0, 0, 0.65)')};
  }
  cursor: pointer;
`;
export default ({ action }) => {
  let actions = [];

  if (action.length > 2) {
    const it = action[0];
    actions.push(
      <A color={it.color} key={it.key} onClick={it.onClick}>
        {it.title}
      </A>,
    );

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
    actions = action.map(it => (
      <A color={it.color} key={it.key} onClick={it.onClick}>
        {it.title}
      </A>
    ));
  }

  actions.length > 1 && actions.splice(1, 0, <Divider key="_divider_" type="vertical" />);
  return actions;
};
