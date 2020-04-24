import Vue from 'vue'
import VueI18N from 'vue-i18n'
import en from './en'
import cn from './cn'
import {getLocale, saveLocale} from '../utils/localStorage'

// 使用Vue中的use来加载插件
Vue.use(VueI18N)

// 创建messages对象将en和cn存放在对象中
const messages = {
  en,
  cn
}
let locale = getLocale()
if(!locale){
  locale = 'cn'
  saveLocale(locale)
}

const i18n = new VueI18N({
  locale,
  messages
})

export default i18n
