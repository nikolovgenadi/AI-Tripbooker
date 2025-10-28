import { createRouter, createWebHistory } from 'vue-router';

const Home = () => import('../pages/Home.vue');
const Packages = () => import('../pages/Packages.vue');
const Experience = () => import('../pages/Experience.vue');
const Book = () => import('../pages/Book.vue');
const Cart = () => import('../pages/Cart.vue');

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/experience/:slug', component: Experience, props: true },
    { path: '/packages', component: Packages },
    { path: '/book/:slug', component: Book, props: true },
    { path: '/cart', component: Cart },
  ],
});
