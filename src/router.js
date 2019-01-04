import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/About.vue')
    },
    {
      path: '/games',
      name: 'games',
      component: () => import('@/views/Games')
    },
    {
      path: '/games/:id',
      name: 'game',
      component: () => import('@/views/Game')
    }
  ]
})
