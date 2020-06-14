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

// 导入富文本编辑器样式
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 将富文本编辑器为全局的组件
Vue.use(VueQuillEditor, /* { default global options } */)

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

// 时间全局过滤器
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth()+1+'').padStart(2, '0')
  const d= (dt.getDate()+'').padStart(2, '0')
  const hh = (dt.getHours()+'').padStart(2, '0')
  const mm = (dt.getMinutes()+'').padStart(2, '0')
  const ss = (dt.getSeconds()+'').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})


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

