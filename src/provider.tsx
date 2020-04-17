import React from 'react';
import { Provider } from 'mobx-react';
import { configure } from 'mobx';

import user from '@/model/user';

configure({ enforceActions: 'observed' });

const models: { [index: string]: any } = {
  user,
};

const ProviderLayout: React.FC = ({ children }) => <Provider {...models}>{children}</Provider>;
export default ProviderLayout;
