import React, { useState, useEffect } from 'react';
import { Checkbox } from 'antd';
import curd from '@/service/curd';
import { useControllableValue } from '@umijs/hooks';

const RoleSelect: React.FC<{}> = props => {
  const [roles, setRoles] = useState([]);
  const [value, onChange] = useControllableValue(props);

  useEffect(() => {
    const rolecurd = curd('role');

    rolecurd
      .index({ pager: false })
      .then(({ data }) => data)
      .then(setRoles);
  }, [setRoles]);
  return (
    <Checkbox.Group
      options={roles.map((i: any) => ({ label: i.name, value: i.id }))}
      onChange={onChange}
      value={value}
    />
  );
};

export default RoleSelect;
