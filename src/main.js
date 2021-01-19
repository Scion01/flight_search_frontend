import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router';
import ErrorHandler from './mixins/error-handler';
import store from './store/store';

Vue.config.productionTip = false
Vue.mixin(ErrorHandler);

new Vue({
  store,
  vuetify,
  render: h => h(App),
  router,
}).$mount('#app')
