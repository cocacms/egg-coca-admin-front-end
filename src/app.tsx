import React from 'react';
import router from 'umi/router';
import { Button, message, notification, Spin, Icon } from 'antd';

import Auth from '@/component/Authorized';
import user from '@/model/user';
import { permission, setting } from '@/service/config';

Spin.setDefaultIndicator(<Icon type="loading" style={{ fontSize: 24 }} spin />);

const renderAsync = async () => {
  const { data: permissionData } = await permission();
  const { data: settingData } = await setting();
  window.permission = permissionData;
  window.setting = settingData;
  let Authorization =
    localStorage[process.env.APIAUTHNAME || 'process.env.APIAUTHNAME'] ||
    sessionStorage[process.env.APIAUTHNAME || 'process.env.APIAUTHNAME'];
  if (!Authorization) {
    throw new Error('no login');
  } else {
    return await user.loadInfo();
  }
};

export function render(oldRender: any) {
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

const addAuthToRoutes = (routes: any[]) => {
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

export function patchRoutes(routes: any[]) {
  addAuthToRoutes(routes);
}

/**
 * 以下代码参考自 ant-design-pro
 */

// if pwa is true

// Notify user if offline now
window.addEventListener('sw.offline', () => {
  message.warning('网络已断开，请检查网络。');
});

// Pop up a prompt on the page asking the user if they want to use the latest version
window.addEventListener('sw.updated', (event: Event) => {
  const e = event as CustomEvent;
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

if ('serviceWorker' in navigator) {
  // unregister service worker
  const { serviceWorker } = navigator;
  if (serviceWorker.getRegistrations) {
    serviceWorker.getRegistrations().then(sws => {
      sws.forEach(sw => {
        sw.unregister();
      });
    });
  }
  serviceWorker.getRegistration().then(sw => {
    if (sw) sw.unregister();
  });

  // remove all caches
  if (window.caches && window.caches.keys) {
    caches.keys().then(keys => {
      keys.forEach(key => {
        caches.delete(key);
      });
    });
  }
}
