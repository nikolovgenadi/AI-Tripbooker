import { createRouter, createWebHistory } from 'vue-router';

const Home = () => import('../pages/Home.vue');
const Packages = () => import('../pages/Packages.vue');
const Experience = () => import('../pages/Experience.vue');
const Book = () => import('../pages/Book.vue');
const Cart = () => import('../pages/Cart.vue');
const Login = () => import('../pages/Login.vue');
const Register = () => import('../pages/Register.vue');

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/experience/:slug', component: Experience, props: true },
    { path: '/packages', component: Packages },
    { path: '/book/:slug', component: Book, props: true },
    { path: '/cart', component: Cart },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
  ],
});
