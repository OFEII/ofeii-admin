import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/global.css'
import './assets/fonts/iconfont.css'

import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

import axios from 'axios'
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
// axios请求拦截器添加token 保证拥有获取数据的权限
axios.interceptors.request.use(config=>{
  console.log(config)
  // 为请求头对象添加token验证的authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios


Vue.use(axios);
Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// #528AFC blue
// #6396FF light blue
// #67DDBA green
// #777C90 gary
// #F9CD02 yellow

