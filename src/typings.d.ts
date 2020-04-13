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
  id?: number;
  type?: 'super' | 'admin' | 'normal';
  roles?: ICocaRole[];
  account?: string;
  password?: string;
}

interface ICocaMenu {
  key: string;
  name: string;
  icon?: React.ReactElement;
  access?: string;
  sub?: ICocaMenu[];
  editpage?: boolean;
  component?: string;
}

interface ICocaOption {
  label: React.ReactElement | string;
  value: any;
  disabled?: boolean;
  onChange?: (e: any) => void;
}

interface ICocaAction {
  key: string;
  title: string;
  loading?: boolean;
  danger?: boolean;
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
  dataIndex?: string;
  render?: (text: any, record: any, index: number) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
  ellipsis?: boolean;
  sorter?: boolean;
  defaultSortOrder?: 'ascend' | 'descend';
  sortOrder?: 'ascend' | 'descend' | null;
  colSpan?: number;
  width?: string | number;
  className?: string;
  fixed?: boolean | 'left' | 'right';
  help?: string;
}

interface ICocaForm {
  name: string;
  label: string | React.ReactNode;
  required?: boolean;
  rules?: any[];
  extra?: string;

  options?: ICocaOption[] | (() => ICocaOption[]);
  type: string;
  component?: React.ReactElement;
  props?: any | ((data: any) => any);
  onChange?: (v: any) => void;

  [propName: string]: any;
}

interface ICoca {
  model: string[];
  dropdown: React.ReactElement[];
  menu: ICocaMenu[];
}
