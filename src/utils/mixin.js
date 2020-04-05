import {mapGetters,mapActions} from 'vuex'
import {themeList, addCss, removeAllCss} from '../utils/book'
import {saveLocation} from './localStorage'

export const ebookMixin ={
  computed:{
    ...mapGetters(['fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'currentBook',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'progress',
      'bookAvailable',
      'section',
    ]),
    themeList(){
      return themeList(this)
    }
  },
  methods:{
    ...mapActions(['setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setCurrentBook',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setProgress',
      'setBookAvailable',
      'setSection',
    ]),
    initGlobalStyle(){
    removeAllCss()
      // 设置全局主题的样式
      switch (this.defaultTheme) {
        case 'Default':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
        case 'Eye':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
          break
        case 'Gold':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
          break
        case 'Night':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
          break
        default:
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
      }
    },
    // 刷新当前的位置
    refreshLocation(){
      const currentLocation = this.currentBook.rendition.currentLocation()
      // console.log(currentLocation)
      // 获取每章节开始的cfi
      const startCfi = currentLocation.start.cfi
      // 获取当前章节的百分比
      const progress = this.currentBook.locations.percentageFromCfi(startCfi)
      // console.log(progress)
      this.setProgress(Math.floor(progress * 100))
      this.setSection(currentLocation.start.index)
      // 将startCfi写入localStorage中进行缓存
      saveLocation(this.fileName,startCfi)
    },
    display(target,cb){
      if (target){
        this.currentBook.rendition.display(target).then(() => {
          this.refreshLocation()
          if (cb) cb()
        })
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshLocation()
          if (cb) cb()
        })
      }
    }
  }
}