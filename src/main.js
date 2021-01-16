import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router';
import GenericData from './mixins/genericData';

Vue.config.productionTip = false
Vue.mixin(GenericData);

new Vue({
  vuetify,
  render: h => h(App),
  router,
}).$mount('#app')
