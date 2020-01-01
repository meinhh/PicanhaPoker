import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

import VueCodemirror from 'vue-codemirror'
Vue.use(VueCodemirror);
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/darcula.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/mode/javascript/javascript.js'

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
