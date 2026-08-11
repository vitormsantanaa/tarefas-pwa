import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/css/global.css';

const app = createApp(App);
app.use(router);
app.mount('#app');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('app-cache-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/assets/index.css',
        '/assets/index.js',
      ]);
    }),
  );
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== 'app-cache-v1')
          .map((name) => caches.delete(name)),
      );
    }),
  );
});
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Se encontrou no cache, retorna do cache
      // Caso contrário, busca na rede
      return response || fetch(event.request);
    }),
  );
});