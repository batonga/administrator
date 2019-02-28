// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '@/styles/index.scss'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from '@/store/store.js'
Vue.config.productionTip = false
Vue.use(ElementUI)
// 使用 router.beforeEach 注册一个全局前置守卫
router.beforeEach((to, from, next) => {
  // 获取用户登录的token
  let token = localStorage.getItem('mykey')
  // 如果用户登录了，不阻碍用户跳转
  if(token){
    next()
  }else{
  // 如果用户没有登录，又不是登录页面，强制跳转到登录页面
    if(to.path !== '/login'){
      next({ path: '/login' })
    }else{
  // 如果用户没有登录，但是是登录页面，不阻碍跳转
      next()
    }
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
