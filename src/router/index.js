import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChildComponent1 from '@/views/ChildComponent1.vue'
import ChildComponent2 from '@/views/ChildComponent2.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/main',
    name: 'MainComponet',
    component: () => import('../views/MainView.vue'),
    children:[
      {
        path: 'child1', 
        component: ChildComponent1 
      }, 
      { 
        path: 'child2', 
        component: ChildComponent2
      }
    ]
  },
  {
    path: '/register',
    name: 'Registration',
    component: () => import('../views/RegistrationView.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/list',
    name: 'list',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/ListView.vue')
  },
  {
    path: '/map',
    name: 'map',
    // route level code-splitting
    // this generates a separate chunk (map.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/MapView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
