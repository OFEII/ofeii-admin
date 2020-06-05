import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'


Vue.use(VueRouter)
const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect:'/welcome',
    children:[
      {path:'/welcome',component: Welcome},
      {path:'/users',component: Users},

    ]
  },

]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫 to访问的路径 from代表从哪个路径跳转而来 next是一个函数 表示放行
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  tokenStr ? next() : next('/login')
})

export default router
