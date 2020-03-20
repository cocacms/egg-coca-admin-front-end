import { observable, action } from 'mobx';
import { actionAsync, task } from 'mobx-utils';
import { login, info, reset_password } from '@/service/user';
import { history } from 'umi';
import curdApuBuilder from '@/service/curd';

export interface UserModel {
  info: ICocaUserInfo;
  login(mail: string, password: string, remember: boolean): Promise<any>;
  reset_password(password: string, newpassword: string): Promise<any>;
  loadInfo(force: boolean): Promise<any>;
  logout(): void;
}

class Model implements UserModel {
  @observable info: ICocaUserInfo | any = {};

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
  async reset_password(password: string, newpassword: string) {
    await task(reset_password(password, newpassword));
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
