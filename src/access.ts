import { permission } from './service/config';

const check = (userInfo: any, userPermission: string[], permission: string) => () => {
  if (!userInfo || !userInfo.id) {
    return false;
  }

  if (userInfo.type === 'super') {
    return true;
  }

  if (permission === undefined) {
    return false;
  }

  if (userPermission.includes(permission)) {
    return true;
  }

  return false;
};

export default function(initialState: any = {}) {
  const { userInfo } = initialState;
  let UserAllPermission: string[] = [];
  if (userInfo && userInfo.roles) {
    UserAllPermission = userInfo.roles.reduce((pre: string[], role: any) => {
      for (const permission of role.permission) {
        pre.push(permission);
      }
      return pre;
    }, []);
  }

  UserAllPermission = Array.from(new Set(UserAllPermission));

  const returns: any = {};
  for (const permission of UserAllPermission) {
    returns[permission] = check(userInfo, UserAllPermission, permission);
  }

  returns.__check__ = check(userInfo, UserAllPermission, '');
  return returns;
}
