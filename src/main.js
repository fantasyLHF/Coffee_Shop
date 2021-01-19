import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import 'lib-flexible/flexible'
import './assets/css/minireset.css'
import { Lazyload } from 'vant';
import {
  Button,
  Field,
  CellGroup,
  NavBar,
  Popup,
  Search,
  Swipe,
  SwipeItem,
} from "vant";

Vue.use(Button)
  .use(Field)
  .use(CellGroup)
  .use(NavBar)
  .use(Popup)
  .use(Search)
  .use(Swipe)
  .use(SwipeItem)
Vue.config.productionTip = false
Vue.use(Lazyload);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
