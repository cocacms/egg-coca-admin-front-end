import React from 'react';
import { Provider } from 'mobx-react';
import { configure } from 'mobx';
import curdServiceBuilder from '@/service/curd';
import CurdModel from '@/model/curd';

import user from '@/model/user';
import { CurdModal } from '@/model/curd';

import coca from '@/coca';

configure({ enforceActions: 'observed' });

const modelBuilder = (name: string) => {
  class Model extends CurdModel {
    constructor() {
      super(curdServiceBuilder(name));
    }
  }
  return new Model();
};

const models: { [index: string]: CurdModal } = {
  user,
};

(coca.model || []).forEach((name: string) => {
  models[name] = modelBuilder(name);
});

const ProviderLayout: React.FC = ({ children }) => <Provider {...models}>{children}</Provider>;
export default ProviderLayout;
