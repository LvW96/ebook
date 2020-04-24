import {mapGetters,mapActions} from 'vuex'
import {themeList, addCss, removeAllCss} from '../utils/book'
import {getBookmark, saveLocation} from './localStorage'
import {shelf} from '../api/store'
import {appendAddToShelf,computeId,removeAddFromShelf} from '../utils/store'
import {getBookShelf, saveBookShelf} from '../utils/localStorage'

export const storeShelfMixin={
  computed:{
    ...mapGetters([
      'isEditMode',
      'shelfList',
      'shelfSelected',
      'shelfTitleVisible',
      'offsetY',
      'shelfCategory',
      'currentType'
    ])
  },
  methods:{
    ...mapActions([
      'setIsEditMode',
      'setShelfList',
      'setShelfSelected',
      'setShelfTitleVisible',
      'setOffsetY',
      'setShelfCategory',
      'setCurrentType'
    ]),
    // 跳转到电子书的详情页
    showBookDetail(book){
      this.$router.push({
        path:'/store/detail',
        query:{
          fileName:book.fileName,
          category:book.categoryText
        }
      })
    },
    // 获取书架中分类中的数据
    getCategoryList(title){
      // 1.先获取整个书架的数据
      this.getShelfList().then(() => {
        // 2.对获得的书架数据进行过滤，过滤type=2和书架中的title和传入的title相等的情况
        const categoryList = this.shelfList.filter(book =>
          book.type === 2 && book.title === title
        )[0]
        // 3.过滤后的数据就是分类中的数据，将数据写入shelfCategory中
        this.setShelfCategory(categoryList)
      })
    },
    // 调用书架接口
    getShelfList(){
      let shelfList = getBookShelf()
      if (!shelfList){
        // 调取书架接口获取数据
        shelf().then(response => {
          //console.log(response)
          if (response.data && response.status === 200 && response.data.bookList) {
            shelfList = appendAddToShelf(response.data.bookList)
            saveBookShelf(shelfList)
            // 将获得的图书放到shelfList中
            return this.setShelfList(shelfList)
          }
        })
      }else {
        return this.setShelfList(shelfList)
      }
    },
    moveOutOfGroup(f){
      this.setShelfList(
        // 1.对shelfList中的图书进行过滤，保留下来没有被选中的图书
        this.shelfList.map(book => {
          if (book.type === 2 && book.itemList){
            book.itemList = book.itemList.filter(subBook => !subBook.selected)
          }
          return book
        })).then(() => {
        // 2.将选中的图书移除分组并显示在书架最后
        let list = removeAddFromShelf(this.shelfList)
        list = [].concat(list,...this.shelfSelected)
        list = appendAddToShelf(list)
        list = computeId(list)
        this.setShelfList(list).then(() => {
          this.simpleToast(this.$t(`shelf.moveBookOutSuccess`))
          // 将数据进行保存
          //this.onComplete()
          if (f) f()
        })
      })
    }
  }
}

export const storeHomeMixin = {
  computed: {
    ...mapGetters([
      'offsetY',
      'hotSearchOffsetY',
      'flapCardVisible',
    ])
  },
  methods: {
    ...mapActions([
      'setOffsetY',
      'setHotSearchOffsetY',
      'setFlapCardVisible',
    ]),
    // 跳转到电子书的详情页
    showBookDetail(book){
      this.$router.push({
        path:'/store/detail',
        query:{
          fileName:book.fileName,
          category:book.categoryText
        }
      })
    }
  }
}

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
      'cover',
      'metadata',
      'navigation',
      'offsetY',
      'isBookmark',
      'pageList',
      'paginate',
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
      'setCover',
      'setMetaData',
      'setNavigation',
      'setOffsetY',
      'setIsBookmark',
      'setPageList',
      'setPaginate',
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
      //console.log(currentLocation)
      if (currentLocation && currentLocation.start){
        // 获取每章节开始的cfi
        const startCfi = currentLocation.start.cfi
        // 获取当前章节的百分比
        const progress = this.currentBook.locations.percentageFromCfi(startCfi)
        // console.log(progress)
        this.setProgress(Math.floor(progress * 100))
        this.setSection(currentLocation.start.index)
        // 将startCfi写入localStorage中进行缓存
        saveLocation(this.fileName,startCfi)
        // 解决翻页后书签存在的问题
        const bookmark = getBookmark(this.fileName)
        // console.log(bookmark)
        if (bookmark){
          if (bookmark.some(item => item.cfi === startCfi)){
            this.setIsBookmark(true)
          } else {
            this.setIsBookmark(false)
          }
        } else {
          this.setIsBookmark(false)
        }
        if (this.pageList){
          const totalPage = this.pageList.length
          const currentPage = currentLocation.start.location
          if (currentPage && currentPage > 0){
           this.setPaginate(currentPage + '/' + totalPage)
          } else {
            this.setPaginate('')
          }
        } else {
          this.setPaginate('')
        }
      }
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
      },
    hideTitleAndMenu(){
      this.setMenuVisible(false)
      // 隐藏字号设置面板
      this.setSettingVisible(-1)
      // 隐藏字体设置面板
      this.setFontFamilyVisible(false)
    }
  }
}