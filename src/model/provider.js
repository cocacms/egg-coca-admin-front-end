import { Provider } from 'mobx-react';
import { configure } from 'mobx';
import curdServiceBuilder from '@/service/curd';
import CurdModel from './curd';
import user from './user';

import { model } from '@/coca';

const modelBuilder = name => {
  class Model extends CurdModel {
    constructor() {
      super(curdServiceBuilder(name));
    }
  }
  return new Model();
};

configure({ enforceActions: 'observed' });
const models = {
  user,
};

(model || []).forEach(name => {
  models[name] = modelBuilder(name);
});

function ProviderLayout({ children }) {
  return <Provider {...models}>{children}</Provider>;
}

export default ProviderLayout;
