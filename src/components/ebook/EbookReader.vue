<template>
  <div class="ebook-reader">
    <!--{{$route.params.fileName}}-->
    <div id="read"></div>
    <!--创建蒙板，为蒙板绑定点击事件、鼠标移动事件和鼠标离开事件-->
    <!--绑定鼠标事件，onMouseEnter鼠标刚进入，onMouseMove鼠标移动，onMouseEnd鼠标离开-->
    <div class="ebook-reader-mask" @click="onMaskClick" @touchmove="move" @touchend="moveEnd"
      @mousedown.left="onMouseEnter" @mousemove="onMouseMove" @mouseup.left="onMouseEnd"
    ></div>
  </div>
</template>

<script>
  // 引入epubjs
  import Epub from 'epubjs'
  // import {mapGetters} from 'vuex'
  import {ebookMixin} from '../../utils/mixin'
  import {getFontFamily, saveFontFamily, saveFontSize, getFontSize, getTheme, saveTheme, getLocation} from '../../utils/localStorage'
  import {flatten} from '../../utils/book'
  import {getLocalForage} from '../../utils/localForage'

  global.ePub = Epub
  export default {
  mixins:[ebookMixin],
  methods: {
    // 1--鼠标进入
    // 2--鼠标进入后的移动
    // 3--鼠标从移动状态松手
    // 4--鼠标的还原
    onMouseEnter(e){
      this.mouseState = 1
      this.mouseStartTime = e.timeStamp
      e.preventDefault()
      e.stopPropagation()
    },
    onMouseMove(e){
      if (this.mouseState === 1){
        this.mouseState = 2
      } else if (this.mouseState === 2){
        let offsetY = 0
        if (this.firstOffsetY){
          offsetY = e.clientY - this.firstOffsetY
          // 将得到的偏移量写入vuex中
          this.setOffsetY(offsetY)
        }else {
          this.firstOffsetY = e.clientY
        }
      }
      e.preventDefault()
      e.stopPropagation()
    },
    onMouseEnd(e){
      if (this.mouseState === 2){
        this.setOffsetY(0)
        this.firstOffsetY = null
        this.mouseState = 3
      }else {
        this.mouseState = 4
      }
      const time = e.timeStamp - this.mouseStartTime
      if (time < 100){
        this.mouseState = 4
      }
      e.preventDefault()
      e.stopPropagation()
    },
    // 通过move方法来获得鼠标从进入阅读器到离开时的Y轴的偏移量，从而实现对阅读器的下拉操作
    move(e){
      let offsetY = 0
      if (this.firstOffsetY){
        offsetY = e.changedTouches[0].clientY - this.firstOffsetY
        // 将得到的偏移量写入vuex中
        this.setOffsetY(offsetY)
      }else {
        this.firstOffsetY = e.changedTouches[0].clientY
      }
      e.preventDefault()
      e.stopPropagation()
    },
    // 当鼠标离开后要将偏移量重新设置为0，恢复为原样
    moveEnd(e){
      this.setOffsetY(0)
      this.firstOffsetY = null
    },
    // 蒙版的点击事件
    onMaskClick(e){
      // console.log(e)
      if (this.mouseState && (this.mouseState ===2 || this.mouseState ===3)){
        return
      }
      // 取出事件中的offsetX的值，offsetX表示x轴点击的偏移量
      const offsetX = e.offsetX
      const width = window.innerWidth
      // 对offsetX值设置范围，实现上一页、下一页和菜单栏显示的功能
      if (offsetX > 0 && offsetX < width * 0.3){
        this.prevPage()
      } else if (offsetX > 0 && offsetX > width * 0.7) {
        this.nextPage()
      }else {
        this.toggleTitleAndMenu()
      }
    },
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
    initGesture(){
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
    },
    parseBook(){
      // 通过book对象下的loaded中的cover来获取电子书的封面，此时得到的封面是jpg格式，不是url
      this.book.loaded.cover.then(cover => {
        // console.log(cover)
        // 获得封面的url
        this.book.archive.createUrl(cover).then(url => {
          // console.log(url)
          this.setCover(url)
        })
      })
      // 通过book对象下的loaded中的metadata获得metadata对象，在metadata对象中有标题和作者信息
      this.book.loaded.metadata.then(metadata => {
        this.setMetaData(metadata)
      })
      // 通过book对象中的loaded中的navigation获取目录信息
      this.book.loaded.navigation.then(nav => {
         // console.log(nav)
        // console.log(flatten(nav.toc))
        /*
          Navigation.toc表示电子书的目录结构，toc中的每一个元素对应一个目录,但获得的目录结构是树形结构，
          需要将树形结构转为一维数组，利用flatten函数实现降维
        */
        const navItem = flatten(nav.toc)
        // 应用迭代算法，判断上层目录是否为null，如果上层目录为null，则迭代终止，如果不为null，则一直追溯，在追溯的过程中记录层级的变化，每判断一次，层级加1
        function find(item,level = 0) {
          if (!item.parent){
            return level
          } else {
            return find(navItem.filter(parentItem => parentItem.id === item.parent)[0],++level)
          }
        }
        // 对获得的一维目录结构中的每一个元素进行遍历，调用find方法查找目录所在的层级
        navItem.forEach(item => {
          item.level = find(item)
        })
        // 将获取到的navItem写入vuex
        this.setNavigation(navItem)
        //console.log(navItem)
      })
    },
    initEpub(url) {
      // nginx服务器的路径
      //const url = process.env.VUE_APP_RES_URL + '/epub/'+ this.fileName + '.epub'
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
      // this.initGesture()
      // 阅读器的dom是通过iframe来实现的，要想将字体文件添加到iframe中需要使用动态添加样式的方式来实现阅读器字体的改变
      this.rendition.hooks.content.register(contents => {
        Promise.all([
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
        ]).then(() => {})
      })
      // 解析电子书的内容
      this.parseBook()
      // 使进度条从不可以状态变为可以状态
      this.book.ready.then(() => {
        return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
      }).then(locations => {
        // 分页
        // console.log(locations)
        /*this.navigation.forEach(nav => {
          nav.pageList = []
        })
        locations.forEach(item => {
          // console.log(locations,this.navigation)
          const loc = item.match(/\[(.*)\]!/)[1]
          // console.log(loc)
          this.navigation.forEach(nav => {
            if (nav.href){
              const href = nav.href.match(/^(.*)\.html$/)
              if (href) {
                if (href[1] === loc) {
                  nav.pageList.push(item)
                }
              }
            }
          })
          let currentPage = 1
          this.navigation.forEach((nav,index) => {
            if (index === 0){
              nav.page = 1
            } else {
              nav.page = currentPage
            }
            currentPage += nav.pageList.length + 1
          })
        })
        this.setPageList(locations)*/
        // console.log(this.navigation)
        // 标记电子书为解析完毕状态
        this.setBookAvailable(true)
        this.refreshLocation()
      })
    }
  },
  mounted() {
    const books =(this.$route.params.fileName || '').split('|')
    const fileName = books[1]
    getLocalForage(fileName,(err,blob) => {
      if (!err && blob){
        console.log('找到离线缓存的电子书')
        this.setFileName(books.join('/')).then(() => {
          this.initEpub(blob)
        })
      } else {
        console.log('在线获取电子书')
        this.setFileName((this.$route.params.fileName || '').split('|').join('/')).then(() => {
          const url = process.env.VUE_APP_EPUB_URL + '/'+ this.fileName + '.epub'
          this.initEpub(url)
        })
      }
    })
    /*const toc = [
      {
        id: '1',
        subitems: [
          {
            id: '2',
            subitems: [
              {
                id: '3',
                subitems: []
              }
            ]
          },
          {
            id: '4',
            subitems: []
          }
        ]
      },
      {
        id: '5',
        subitems: []
      }
    ]*/
    /*function aaa(array) {
      //return [].concat(...array.map(item => [item, ...item.subitems]))
      return [].concat(...toc.map(item => [item, ...[].concat(...item.subitems.map(sub => [sub, ...sub.subitems]
          ))
        ]
      ))
      return [].concat(...array.map(item => [item,...aaa(item.subitems)]))
   }*/
    //console.log(aaa(toc))


    // 动态获取电子书的路径
    //const fileName = (this.$route.params.fileName || '').split('|').join('/')
    /*this.$store.dispatch('setFileName',fileName).then(() => {
      this.initEpub()
    })*/

  }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .ebook-reader{
    width: 100%;
    height: 100%;
    overflow: hidden;
    .ebook-reader-mask{
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      position: absolute;
      z-index: 150;
      background: transparent;
    }
  }
</style>
