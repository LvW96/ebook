import Vue from 'vue'
import Vuex from 'vuex'
// 引入book.js
import book from './modules/book'
import getters from './getters'
Vue.use(Vuex)

export default new Vuex.Store({
    modules:{
      book
    },
    getters
})
