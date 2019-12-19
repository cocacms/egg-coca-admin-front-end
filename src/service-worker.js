/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-underscore-dangle */
/* globals workbox */
// workbox.setConfig({ debug: true });

workbox.core.setCacheNameDetails({
  prefix: 'coca-admin-front-end',
  suffix: 'v1',
});

// Control all opened tabs ASAP
workbox.clientsClaim();

/**
 * 缓存web静态文件
 */
workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

/**
 * 首页
 */
workbox.routing.registerNavigationRoute('/index.html');

/**
 * 不缓存API接口
 */
workbox.routing.registerRoute(/\/backend\//, workbox.strategies.networkOnly());

/**
 * 缓存wiris编辑器
 *  如使用数学编辑器，请取消以下代码的注释
 */

 /*
workbox.routing.registerRoute(
  /^http(s?):\/\/www\.wiris\.net\/demo\/plugins\/app\/showimage/,
  workbox.strategies.networkOnly(),
);

workbox.routing.registerRoute(
  /^http(s?):\/\/www\.wiris\.net\/demo\/editor\/mathml2internal/,
  workbox.strategies.networkOnly(),
);

workbox.routing.registerRoute(
  /^http(s?):\/\/(\S+)\.wiris\.net/,
  workbox.strategies.staleWhileRevalidate(),
);
*/

/**
 * Response to client after skipping waiting with MessageChannel
 */
addEventListener('message', event => {
  const replyPort = event.ports[0];
  const message = event.data;
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error }),
      ),
    );
  }
});
