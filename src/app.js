import Auth from '@/component/authorized';
import { Button, message, notification, Spin, Icon } from 'antd';
import user from '@/model/user';
import { permission } from '@/service/user';
import router from 'umi/router';
Spin.setDefaultIndicator(<Icon type="loading" style={{ fontSize: 24 }} spin />);

const renderAsync = async () => {
  const { data } = await permission();
  window.permission = data;
  let Authorization =
    localStorage[process.env.APIAUTHNAME] || sessionStorage[process.env.APIAUTHNAME];
  if (!Authorization) {
    throw new Error('no login');
  } else {
    return await user.loadInfo();
  }
};

export function render(oldRender) {
  renderAsync()
    .then(userInfo => {
      let need_jump = false;

      if (['/login', '/'].includes(window.g_history.location.pathname)) {
        need_jump = true;
      }

      if (need_jump) router.replace(`/admin`);
    })
    .catch(() => {
      router.replace('/login');
    })
    .finally(oldRender);
}

const addAuthToRoutes = routes => {
  for (let index = 0; index < routes.length; index++) {
    const it = routes[index];
    if (it.authority instanceof Array) {
      if (it.Routes) {
        it.Routes.push(Auth);
      } else {
        it.Routes = [Auth];
      }
    }

    if (it.routes instanceof Array && it.routes.length > 0) {
      addAuthToRoutes(it.routes);
    }
  }
};

export function patchRoutes(routes) {
  addAuthToRoutes(routes);
}

if ('serviceWorker' in navigator) {
  window.addEventListener('sw.offline', () => {
    message.warning('当前处于离线状态');
  });

  // Pop up a prompt on the page asking the user if they want to use the latest version
  window.addEventListener('sw.updated', event => {
    const e = event;
    const reloadSW = async () => {
      // Check if there is sw whose state is waiting in ServiceWorkerRegistration
      // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration
      const worker = e.detail && e.detail.waiting;
      if (!worker) {
        return true;
      }
      // Send skip-waiting event to waiting SW with MessageChannel
      await new Promise((resolve, reject) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = msgEvent => {
          if (msgEvent.data.error) {
            reject(msgEvent.data.error);
          } else {
            resolve(msgEvent.data);
          }
        };
        worker.postMessage({ type: 'skip-waiting' }, [channel.port2]);
      });
      // Refresh current page to use the updated HTML and other assets after SW has skiped waiting
      window.location.reload(true);
      return true;
    };
    const key = `open${Date.now()}`;
    const btn = (
      <Button
        type="primary"
        onClick={() => {
          notification.close(key);
          reloadSW();
        }}
      >
        刷新
      </Button>
    );
    notification.open({
      message: '有新内容',
      description: '请点击“刷新”按钮或者手动刷新页面',
      btn,
      key,
      onClose: async () => {},
    });
  });
}
