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
  Tabbar,
  TabbarItem,
  Card,
  Icon,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  Stepper, RadioGroup,
  Radio, SwipeCell,
  SubmitBar,
  Checkbox,
  Tab,
  Tabs,
  Tag,
  CheckboxGroup,
  ContactCard,
  AddressEdit,
  Area,
  AddressList
} from "vant";
// 全局配置cookie，组件调用方式：this.$cookies
import cookies from 'vue-cookies'
Vue.prototype.$cookies = cookies;

Vue.use(Button)
  .use(Field)
  .use(CellGroup)
  .use(NavBar)
  .use(Popup)
  .use(Search)
  .use(Swipe)
  .use(SwipeItem)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Card)
  .use(Icon)
  .use(GoodsAction)
  .use(GoodsActionIcon)
  .use(GoodsActionButton)
  .use(Stepper)
  .use(RadioGroup)
  .use(Radio)
  .use(SwipeCell)
  .use(SubmitBar)
  .use(Checkbox)
  .use(Tab)
  .use(Tabs)
  .use(Tag)
  .use(CheckboxGroup)
  .use(ContactCard)
  .use(AddressEdit)
  .use(Area)
  .use(AddressList)

Vue.config.productionTip = false
Vue.use(Lazyload);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
