import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import BotEditor from '@/views/BotEditor.vue';
import MyProfile from '@/views/MyProfile.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/editor',
    name: 'editor',
    component: BotEditor,
  },
  {
      path: '/me',
      name: 'my_page',
      component: MyProfile
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
