import Vue from 'vue';

import buildDependencyContainer from './app.container';
buildDependencyContainer();

import App from './App.vue';
import router from './router';

import storeInitializer from './store';
const store = storeInitializer();

Vue.config.productionTip = false;

import codemirror from './plugins/codemirror';
Vue.use(codemirror);

import vuetify from './plugins/vuetify';
import './plugins/vuetify-dialog';

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
