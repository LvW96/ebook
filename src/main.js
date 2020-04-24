import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/*引入字体图标*/
import './assets/styles/icon.css'
/*引入web字体*/
// import './assets/fonts/daysOne.css'
/*引入global.scss*/
import './assets/styles/global.scss'
import i18n from './lang'
//import './mock'
import './utils/boost'
import './utils/create-api'

Vue.config.productionTip = false
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
