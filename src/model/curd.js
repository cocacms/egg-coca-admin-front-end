import { observable, flow, action } from 'mobx';

class CURD {
  @observable current = {};
  @observable list = {};
  @observable list_all = [];

  constructor({ index, show, create, update, destroy }) {
    this.service = { index, show, create, update, destroy };
  }

  index = flow(function*(params) {
    const { data } = yield this.service.index(params);
    this.list = data;
  });

  all = flow(function*(params) {
    const { data } = yield this.service.index({ ...params, pager: false });
    this.list_all = data;
    return data;
  });

  show = flow(function*(id, params = {}) {
    const { data } = yield this.service.show(id, params);
    this.current = data;
  });

  create = flow(function*(data, params = {}) {
    const { data: obj } = yield this.service.create(data, params);
    return obj;
  });

  update = flow(function*(id, data, params = {}) {
    const { data: obj } = yield this.service.update(id, data, params);
    return obj;
  });

  destroy = flow(function*(id) {
    yield this.service.destroy(id);
  });

  @action.bound
  clear(key, dedault = []) {
    this[key] = dedault;
  }
}

export default CURD;
