import { createRouter, createWebHistory } from 'vue-router';

const Home = () => import('../pages/Home.vue');

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    {
      path: '/experience/:slug',
      component: () => import('../pages/Experience.vue'),
    },
    { path: '/book/:slug', component: () => import('../pages/Book.vue') },
    { path: '/cart', component: () => import('../pages/Cart.vue') },
  ],
});
