import { observable, flow, action } from 'mobx';
import { login, info, resetPassword } from '@/service/user';
import router from 'umi/router';
import CurdModel from './curd';
import curdServiceBuilder from '@/service/curd';

class Model extends CurdModel {
  socket = null;
  @observable info = {};
  @observable myActions = [];

  constructor() {
    super(curdServiceBuilder('user'));
  }

  login = flow(function*(mail, password, remember) {
    const { data } = yield login(mail, password, remember);
    if (data.token) {
      if (remember) {
        localStorage[process.env.APIAUTHNAME] = data.token;
      } else {
        sessionStorage[process.env.APIAUTHNAME] = data.token;
      }
      yield this.loadInfo();
    }
  });

  @action.bound
  logout() {
    this.info = {};
    localStorage.removeItem(process.env.APIAUTHNAME);
    sessionStorage.removeItem(process.env.APIAUTHNAME);
    router.replace('/login');
  }

  resetPassword = flow(function*(password, newpassword) {
    yield resetPassword(password, newpassword);
  });

  loadInfo = flow(function*(force = false) {
    if (this.info.id && !force) {
      return;
    }
    const { data } = yield info();
    this.info = data;
    return data;
  });
}

export default new Model();
