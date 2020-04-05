import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/ebook/index'
import EbookReader from '../components/ebook/EbookReader'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/ebook'
  },
  {
    path: '/ebook',
    component: Index,
    /*component: () => import('../views/ebook/index.vue'),*/
    children: [
      {
        path: ':fileName',
        component: EbookReader
        /*component:() => import('../components/ebook/EbookReader.vue')*/
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
