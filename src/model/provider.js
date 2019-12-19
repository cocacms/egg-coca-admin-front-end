import { Provider } from 'mobx-react';
import { configure } from 'mobx';
import user from './user';
import role from './role';

configure({ enforceActions: 'observed' });

const models = {
  user,
  role,
};

function ProviderLayout({ children }) {
  return (
    <Provider {...models}>{children}</Provider>
  );
}

export default ProviderLayout;
