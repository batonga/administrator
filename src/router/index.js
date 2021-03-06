import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/Home'
import Main from '@/views/main/Main'
import User from '@/views/user/User'
import Roles from '@/views/rights/Roles'
import Rights from '@/views/rights/Rights'
import Category from '@/views/categories/Category'
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
        },
        {
          path: "/users",
          name: 'Users',
          component: User
        },
        {
          path: "/roles",
          name: 'Roles',
          component: Roles
        },
        {
          path: "/rights",
          name: 'Rights',
          component: Rights
        },
        {
          path: "/categories",
          name: 'Category',
          component: Category
        }
      ]
    }
  ]
})
