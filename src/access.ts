const check = (userInfo: any, userPermission: string[], permission: string) => {
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
  const { userInfo = {}, permission = [] } = initialState;
  let userAllPermission: string[] = [];
  if (userInfo && userInfo.roles) {
    userAllPermission = userInfo.roles.reduce((pre: string[], role: any) => {
      for (const permission of role.permission) {
        pre.push(permission);
      }
      return pre;
    }, []);
  }

  userAllPermission = Array.from(new Set(userAllPermission));

  const returns: any = {};
  for (const permissionKey of Object.keys(permission)) {
    returns[permissionKey] = check(userInfo, userAllPermission, permissionKey);
  }

  return returns;
}
