import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  extensionApi: 'chrome',
  modules: [],
  manifest: {
    name: 'Web-Guider - Learn & Explore',
    version: '1.0.0',
    description: 'Learn concepts. Master websites.',
    permissions: [
      'storage',
      'tabs',
      'activeTab',
      'scripting',
      'notifications',
    ],
    host_permissions: ['<all_urls>'],
    action: {
      default_title: 'Web-Guider',
      default_popup: 'popup.html',
    },
    icons: {
      16: '/icons/icon-16.png',
      48: '/icons/icon-48.png',
      128: '/icons/icon-128.png',
    },
  },
});
