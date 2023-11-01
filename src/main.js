import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
import localePlugin from "./plugins/localePlugin";
import debounce from 'vue-debounce'
import {InitWS} from "./utils/websocket/websocket";
import {VUE_APP_WS} from "./config";
import toast from './plugins/toast'


Vue.use(localePlugin);
Vue.use(debounce, {
	defaultTime: 1000
});

Vue.use(toast, {
	duration: 3000,
	close: true,
	node: 'div',
	gravity: 'bottom',
})

Vue.config.productionTip = false;

InitWS({	url: VUE_APP_WS })

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app');
