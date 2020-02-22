declare module '*.css';
declare module '*.less';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module 'loadsh';

interface Window {
  permission: { [index: string]: string };
  setting: any[];
  g_history: any;
}

interface ICocaRole {
  name: string;
  permission: string[];
}

interface ICocaUserInfo {
  id: number;
  type: 'super' | 'admin' | 'normal';
  roles: ICocaRole[];
  account: string;
  password: string;
}

interface ICocaMenu {
  key: string;
  name: string;
  icon?: string | React.Component;
  authorities?: string[];
  sub?: ICocaMenu[];
}

interface ICocaOption {
  label: React.ReactNode;
  value: any;
  disabled?: boolean;
  onChange?: (e: any) => void;
}

interface ICocaAction {
  key: string;
  title: string;
  color?: string;
  onClick?: (e?: React.MouseEvent<HTMLElement>) => void;
  confirm?: string;
}

interface ICocaFilter {
  type: string;
  key: string;
  label: string;
  options?: Array<ICocaOption>;
  component?: React.ReactElement;
  props?: any;
}

interface ICocaColumn {
  title?: React.ReactNode | string;
  key?: React.Key;
  dataIndex?: string; // Note: We can not use generic type here, since we need to support nested key, see #9393
  render?: (text: any, record: any, index: number) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
  ellipsis?: boolean;
  sorter?: boolean;
  defaultSortOrder?: 'ascend' | 'descend';
  sortOrder?: 'ascend' | 'descend' | false;
  colSpan?: number;
  width?: string | number;
  className?: string;
  fixed?: boolean | 'left' | 'right';
  help?: string;
}

interface ICocaForm {
  type: string;
  key: string;
  label: string;
  options?: ICocaOption[] | (() => ICocaOption[]);
  initialValue?: any | ((initialValue: boolean, data: any) => any);
  onChange?: (v: any) => void;
  required?: boolean;
  rules?: any[];
  props?: any | ((data: any) => any);
  component?: React.ReactElement;
  dataType?: string;
  help?: string;
}

interface ICoca {
  model: string[];
  dropdown: React.Component[];
  menu: ICocaMenu[] | ((user: ICocaUserInfo) => ICocaMenu[]);
}
