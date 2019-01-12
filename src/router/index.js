import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/Home'
import Main from '@/views/main/Main'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      redirect: '/main',
      name: 'Home',
      component: Home,
      children:[
        {
            path:"/main",
            name: 'Main',
            component:Main
        }
      ]
    }
  ]
})
