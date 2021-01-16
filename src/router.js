import Vue from 'vue';
import Router from "vue-router";
import HelloWorld from './components/HelloWorld';
import Search from './views/Search';
Vue.use(Router);

const routes = [
  {
    path: '/helloWorld',
    name: 'helloWorld',
    title: 'helloWorld',
    component: HelloWorld,
  },
  {
    path: '/search',
    name: 'search',
    title: 'SearchFlights',
    component: Search,
  }
];
  
  export default new Router({
    mode: 'history',
    routes: routes
  });
