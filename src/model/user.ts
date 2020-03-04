import { observable, action } from 'mobx';
import { actionAsync, task } from 'mobx-utils';
import { login, info, resetPassword } from '@/service/user';
import { history } from 'umi';
import CurdModel from './curd';
import curdApuBuilder from '@/service/curd';

export interface UserModel {
  info: ICocaUserInfo;
  login(mail: string, password: string, remember: boolean): Promise<any>;
  resetPassword(password: string, newpassword: string): Promise<any>;
  loadInfo(force: boolean): Promise<any>;
  logout(): void;
}

class Model extends CurdModel implements UserModel {
  @observable info: ICocaUserInfo | any = {};

  constructor() {
    super(curdApuBuilder('user'));
  }

  @actionAsync
  async login(mail: string, password: string, remember: boolean) {
    const { data } = await task(login(mail, password, remember));
    if (data.token) {
      if (remember) {
        localStorage[process.env.APIAUTHNAME || 'process.env.APIAUTHNAME'] = data.token;
      } else {
        sessionStorage[process.env.APIAUTHNAME || 'process.env.APIAUTHNAME'] = data.token;
      }
    }
  }

  @actionAsync
  async resetPassword(password: string, newpassword: string) {
    await task(resetPassword(password, newpassword));
  }

  @actionAsync
  async loadInfo(force: boolean = false) {
    if (this.info.id && !force) {
      return this.info;
    }
    const { data } = await task(info());
    this.info = data;
    return data;
  }

  @action.bound
  logout() {
    this.info = {};
    localStorage.removeItem(process.env.APIAUTHNAME || 'process.env.APIAUTHNAME');
    sessionStorage.removeItem(process.env.APIAUTHNAME || 'process.env.APIAUTHNAME');
    history.replace('/login');
  }
}

export default new Model();
