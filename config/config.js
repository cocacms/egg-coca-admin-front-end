// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  history: 'hash',
  hash: true,
  alias: {
    '@': require('path').resolve(__dirname, 'src'),
  },
  define: {
    'process.env.APIHOST': 'http://localhost:7001',
    'process.env.APIAUTHNAME': 'Coca_Local_Authorization',
    'process.env.TITLE': '管理平台',
    'process.env.ENV': 'dev',
    'process.env.VERSION': '1.0.0',
  },
  theme: {},
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: false,
        dynamicImport: {
          webpackChunkName: true,
          loadingComponent: './component/loading.js',
        },
        title: {
          defaultTitle: '管理平台',
          format: '{current}{separator}{parent}',
        },
        dll: false,
        routes: {
          exclude: [/components\//],
        },
        pwa: {
          workboxPluginMode: 'InjectManifest',
          workboxOptions: {
            importWorkboxFrom: 'local',
          },
        },
      },
    ],
  ],
};
