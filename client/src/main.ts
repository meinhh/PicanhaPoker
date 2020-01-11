import Vue from 'vue';

import buildDependencyContainer from './app.container';
buildDependencyContainer();

import App from './App.vue';
import router from './router';
Vue.config.productionTip = false;

import storeInitializer from './store';
const store = storeInitializer();

import codemirror from './plugins/codemirror';
Vue.use(codemirror);

import vuetify from './plugins/vuetify';
import './plugins/vuetify-dialog';

import './plugins/vue-shortkey';

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
