import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import { storyTypes } from '../stores/hnews'
import NewsView from '../views/NewsView.vue'

const storyTypeRoutes: RouteRecordRaw[] = storyTypes.map((type) => {
  return {
    path: `/${type}/:page?`,
    name: `${type}`,
    component: () => import('../views/NewsView.vue'),
    props: (route) => {
      return {
        type: type,
        page: route.params.page ? Math.max(1, parseInt(route.params.page as string, 10)) : 1,
      }
    },
  }
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      alias: '/top/1',
      component: NewsView,
      props: () => {
        return {
          type: 'top',
          page: 1,
        }
      },
      // component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/item/:id',
      name: `item-id`,
      component: () => import('../views/DetailView.vue'),
      props: (route) => {
        return {
          id: parseInt(route.params.id as string, 10),
        }
      },
    },
    ...storyTypeRoutes,
  ],
})

export default router
