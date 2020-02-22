import { observable, action } from 'mobx';
import { actionAsync, task } from 'mobx-utils';
import { CurdApi } from '@/service/curd';

export interface CurdList {
  count: number;
  rows: any[];
}

export interface CurdModal {
  api: CurdApi;
  current: any;
  list: CurdList;
  all: any[];

  index(params?: any, pager?: boolean): Promise<any>;
  show(id: number, params?: any): Promise<any>;
  create(data: any, params?: any): Promise<any>;
  update(id: number, data: any, params?: any): Promise<any>;
  destroy(id: number): Promise<any>;
  reset(key: string, value: any): void;
}

class CURD implements CurdModal {
  api: CurdApi;

  @observable current: any = {};
  @observable list: CurdList = {
    rows: [],
    count: 0,
  };
  @observable all: any[] = [];

  [propName: string]: any;

  constructor(api: CurdApi) {
    this.api = api;
  }

  @actionAsync
  async index(params?: any, pager: boolean = true) {
    const { data } = await task(this.api.index({ ...params, pager }));
    if (pager) {
      this.list = data;
    } else {
      this.all = data;
    }
  }

  @actionAsync
  async show(id: number, params?: any) {
    const { data } = await task(this.api.show(id, params));
    this.current = data;
  }

  @actionAsync
  async create(data: any, params?: any) {
    const { data: res } = await task(this.api.create(data, params));
    return res;
  }

  @actionAsync
  async update(id: number, data: any, params?: any) {
    const { data: res } = await task(this.api.update(id, data, params));
    return res;
  }

  @actionAsync
  async destroy(id: number) {
    const { data: res } = await task(this.api.destroy(id));
    return res;
  }

  @action.bound
  reset(key: string, value: any) {
    this[key] = value;
  }
}

export default CURD;
