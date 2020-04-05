<template>
  <div class="ebook-reader">
    <!--{{$route.params.fileName}}-->
    <div id="read"></div>
  </div>
</template>

<script>
  // 引入epubjs
  import Epub from 'epubjs'
  // import {mapGetters} from 'vuex'
  import {ebookMixin} from '../../utils/mixin'
  import {getFontFamily, saveFontFamily, saveFontSize, getFontSize, getTheme, saveTheme, getLocation} from '../../utils/localStorage'

  global.ePub = Epub
  export default {
  mixins:[ebookMixin],
  methods: {
    // 实现上一页
    prevPage(){
      if(this.rendition){
        this.rendition.prev().then(() => {
          this.refreshLocation()
        })
        this.hideTitleAndMenu()
      }
    },
    // 实现下一页
    nextPage(){
      if(this.rendition){
        this.rendition.next().then(() => {
          this.refreshLocation()
        })
        this.hideTitleAndMenu()
      }
    },
    toggleTitleAndMenu(){
      // 通过对menuVisible的取反操作实现标题栏的显示与隐藏
      this.setMenuVisible(!this.menuVisible)
      // 当菜单栏显示的时候隐藏字号设置面板
      if (this.menuVisible){
        this.setSettingVisible(-1)
        // this.setFontFamilyVisible(false)
      }
      this.setFontFamilyVisible(false)
    },
    // 对标题栏和菜单栏进行隐藏
    hideTitleAndMenu(){
      this.setMenuVisible(false)
      // 隐藏字号设置面板
      this.setSettingVisible(-1)
      // 隐藏字体设置面板
      this.setFontFamilyVisible(false)
    },
    initFontSize(){
      // 对字号进行初始化
      let fontSize = getFontSize(this.fileName)
      if(!fontSize){
        saveFontSize(this.fileName,this.defaultFontSize)
      }else {
        this.rendition.themes.fontSize(fontSize)
        this.setDefaultFontSize(fontSize)
      }
    },
    initFotFamily(){
      // 对字体进行初始化操作
      // 通过getFontFamily方法获取当前字体
      let font = getFontFamily(this.fileName)
      if(!font){
        // 获取到字体后判断字体是否存在，不存在则对字体进行保存
        saveFontFamily(this.fileName,this.defaultFontFamily)
      }else {
        // 如果字体已经保存到localStorage中，则通过rendition对象中的themes类中的font方法更改阅读器字体
        this.rendition.themes.font(font)
        this.setDefaultFontFamily(font)
      }
    },
    initTheme(){
      let defaultTheme = getTheme(this.fileName)
      if(!defaultTheme){
        defaultTheme = this.themeList[0].name
        saveTheme(this.fileName,defaultTheme)
      }
      this.setDefaultTheme(defaultTheme)
      // 对主题进行初始化
      // 首先是对themeList列表进行遍历
      this.themeList.forEach(theme => {
        // 对主题的名称和样式进行注册
        this.rendition.themes.register(theme.name,theme.style)
      })
      // 注册完成后需要选择一个默认的样式
      this.rendition.themes.select(defaultTheme)
    },
    initEpub() {
      // nginx服务器的路径
      const url = process.env.VUE_APP_RES_URL + '/epub/'+ this.fileName + '.epub'
      // console.log(url)
      // 渲染电子书的步骤
      // 1.生成book对象
      this.book = new Epub(url)
      // 将解析后的book对象传入到setCurrentBook中
      this.setCurrentBook(this.book)
      // console.log(this.book)
      // 2.通过book对象的renderTo方法生成rendition对象
      this.rendition = this.book.renderTo('read',{
        width:window.innerWidth,
        height:window.innerHeight,
        method:'default'
      })
      // 3.通过rendition对象的display方法渲染电子书
      const location = getLocation(this.fileName)
      // console.log(location)
      this.display(location, () => {
        this.initTheme()
        this.initFontSize()
        this.initFotFamily()
        this.initGlobalStyle()
      })
      /*this.rendition.display().then(() => {
        this.initTheme()
        this.initFontSize()
        this.initFotFamily()
        this.initGlobalStyle()

      })*/
      // 电子书ebook对象实现原理是使用iframe，那如何将事件绑定到iframe中，可以使用this.rendition.on方法来将事件注入到iframe中
      this.rendition.on('touchstart',event => {
        // console.log(event)
        // 只允许一根手指点击，获取点击的开始位置
        this.touchStartX = event.changedTouches[0].clientX
        // 获取刚点击的时间
        this.touchStartTime = event.timeStamp
      })
      this.rendition.on('touchend',event => {
        // console.log(event)
        // 获取偏移量
        const offSetX = event.changedTouches[0].clientX - this.touchStartX
        // 获取时间
        const time = event.timeStamp - this.touchStartTime
        // console.log(offsetX,time)
        // 规定上一页和下一页的显示条件
        if (offSetX > 40 && time < 500)
        {
          this.prevPage()
        } else if (offSetX < -40 && time < 500)
        {
          this.nextPage()
        } else {
          this.toggleTitleAndMenu()
        }
        // event.preventDefault()
        event.stopPropagation()
      })
      // 阅读器的dom是通过iframe来实现的，要想将字体文件添加到iframe中需要使用动态添加样式的方式来实现阅读器字体的改变
      this.rendition.hooks.content.register(contents => {
        Promise.all([
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
        ]).then(() => {})
      })
      // 使进度条从不可以状态变为可以状态
      this.book.ready.then(() => {
        return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
      }).then(locations => {
        // console.log(locations)
        // 标记电子书为解析完毕状态
        this.setBookAvailable(true)
        this.refreshLocation()
      })
    }
  },
  mounted() {
    // 动态获取电子书的路径
    const fileName = (this.$route.params.fileName || '').split('|').join('/')
    /*this.$store.dispatch('setFileName',fileName).then(() => {
      this.initEpub()
    })*/
    this.setFileName(fileName).then(() => {
      this.initEpub()
    })
  }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
</style>