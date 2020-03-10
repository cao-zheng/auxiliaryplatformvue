import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import store from './store/store.js';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

Vue.use(ElementUI);

Vue.config.productionTip = false
axios.defaults.baseURL = "http://localhost:8081"

/* eslint-disable no-new */
var a = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
