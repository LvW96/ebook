import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/ebook/index'
import EbookReader from '../components/ebook/EbookReader'
import index from '../views/store/index'
import StoreHome from '../views/store/StoreHome'
import StoreList from '../views/store/StoreList'
import StoreDetail from '../views/store/StoreDetail'
import StoreShelf from '../views/store/StoreShelf'
import StoreCategory from '../views/store/StoreCategory'
import StoreSpeaking from '../views/store/StoreSpeaking'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/store'
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
  },
  {
    path: '/store',
    component: index,
    redirect: '/store/shelf',
    children: [
      {
        path:'shelf',
        component:StoreShelf
      },
      {
        path:'category',
        component:StoreCategory
      },
      {
        path: 'home',
        component: StoreHome
      },
      {
        path:'list',
        component:StoreList
      },
      {
        path:'detail',
        component:StoreDetail
      },
      {
        path:'speaking',
        component:StoreSpeaking
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
