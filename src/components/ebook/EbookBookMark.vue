<template>
  <div class="ebook-bookmark" ref="bookmark">
    <div class="ebook-bookmark-text-wrapper">
      <div class="ebook-bookmark-down-wrapper" ref="iconDown">
        <span class="icon-down"></span>
      </div>
      <div class="ebook-bookmark-text">{{text}}</div>
    </div>
    <div class="ebook-bookmark-icon-wrapper" :style="isFixed ? fixedStyle : {}">
      <bookmark :color="color" :width="15" :height="35"></bookmark>
    </div>
  </div>
</template>

<script>
  import {ebookMixin} from '../../utils/mixin'
  import Bookmark from '../common/BookMark'
  import {realPx} from '../../utils/utils'
  import {getBookmark,saveBookmark} from '../../utils/localStorage'

  const BLUE = '#346CBC'
  const WHITE ='#fff'
  export default {
    mixins:[ebookMixin],
    components:{
      Bookmark
    },
    computed:{
      height(){
        return realPx(35)
      },
      // 临界值
      threshold(){
        return realPx(55)
      },
      fixedStyle(){
        return{
          position:'fixed',
          top: 0,
          right:`${(window.innerWidth - this.$refs.bookmark.clientWidth) / 2}px`
        }
      }
    },
    watch:{
      offsetY(v){
        if (!this.bookAvailable || this.menuVisible || this.settingVisible >= 0){
          return
        }
        if (v >= this.height && v < this.threshold){
          this.beforeThreshold(v)
        }else if (v >= this.threshold) {
          this.afterThreshold(v)
        }else if (v > 0 && v < this.height){
          this.beforeHeight()
        }else if (v === 0){
          this.restore()
        }
      },
      isBookmark(isBookmark){
        if (isBookmark){
          this.color = BLUE
          this.isFixed = true
        } else {
          this.color = WHITE
          this.isFixed = false
        }
      }
    },
    data(){
      return{
        text: '',
        color:WHITE,
        isFixed: false// 是否固定
      }
    },
    methods:{
      addBookmark(){
        // 建一个bookmark数组来存放所有的书签
        this.bookmark = getBookmark(this.fileName)
        if (!this.bookmark){
          this.bookmark = []
        }
        const currentLocation = this.currentBook.rendition.currentLocation()
        // console.log(currentLocation)
        // start:cfi: "epubcfi(/6/22[A335279_1_En_7_Chapter]!/4/2/2[b978-3-319-25718-1_7]/2/1:0)"
        // end:cfi: "epubcfi(/6/22[A335279_1_En_7_Chapter]!/4/8[Abs1]/4[Par1]/1:62)"
        // 通过正则表达来获得cfi中的内容
        // 获取！之前的内容
        const cfibase = currentLocation.start.cfi.replace(/!.*/,'')
        // 获取！之后的内容也就是开始的cfi
        const cfistart = currentLocation.start.cfi.replace(/.*!/,'').replace(/\)$/,'')
        // 获取结束的cfi
        const cfiend = currentLocation.end.cfi.replace(/.*!/,'').replace(/\)$/,'')
        // console.log(cfibase,cfistart,cfiend)
        // 将获得的cfi进行拼接
        const cfirange = `${cfibase}!,${cfistart},${cfiend})`
        // console.log(cfirange)
        // 使用currentBook中的getRange方法将cfirange传入，得到range对象，range对象中有所需的文本内容
        this.currentBook.getRange(cfirange).then(range => {
          // 使用range中的toString方法就看得到文本内容
          // console.log(range.toString())
          // 对文本中的内容去除空格
          const text = range.toString().replace(/\s\s/g,'')
          // console.log(text)
          // 将cfi和文本内容放到数组中
          this.bookmark.push({
            cfi:currentLocation.start.cfi,
            text:text
          })
          // 将bookmark数组存到localStorage中
          saveBookmark(this.fileName,this.bookmark)
        })
      },
      removeBookmark(){
        const currentLocation = this.currentBook.rendition.currentLocation()
        const cfi = currentLocation.start.cfi
        // 从localStorage中取出bookmark
        this.bookmark = getBookmark(this.fileName)
        if (this.bookmark){
          this.bookmark = this.bookmark.filter(item => item.cfi !== cfi)
          // 将更新后的bookmark存入到localStorage中
          saveBookmark(this.fileName,this.bookmark)
          // 更改vuex中的bookmark值
          this.setIsBookmark(false)
        }
      },
      restore(){
        // 状态4：归位
        setTimeout(() => {
          this.$refs.bookmark.style.top = `${-this.height}px`
          this.$refs.iconDown.style.transform = 'rotate(0deg)'
        },200)
        if (this.isFixed){
          this.setIsBookmark(true)
          // 添加书签
          this.addBookmark()
        }else {
          this.setIsBookmark(false)
          // 删除书签
          this.removeBookmark()
        }
      },
      beforeHeight(){
        // 状态1：为超过书签的高度
        if (this.isBookmark){
          this.text = this.$t(`book.pulldownDeleteMark`)
          this.color = BLUE
          this.isFixed = true
        }else {
          this.text = this.$t(`book.pulldownAddMark`)
          this.color = WHITE
          this.isFixed = false
        }
      },
      beforeThreshold(v){
        // 状态2还未到临界状态
        this.$refs.bookmark.style.top = `${-v}px`
        if (this.isBookmark){
          this.text = this.$t(`book.pulldownDeleteMark`)
          this.color = BLUE
        }else {
          this.text = this.$t(`book.pulldownAddMark`)
          this.color = WHITE
        }
        // 将箭头进行还原
        const iconDown = this.$refs.iconDown
        if (iconDown.style.transform === 'rotate(180deg)'){
          iconDown.style.transform = 'rotate(0deg)'
        }
      },
      afterThreshold(v){
        // 状态3达到临界值后
        this.$refs.bookmark.style.top = `${-v}px`
        if (this.isBookmark){
          this.text = this.$t(`book.releaseDeleteMark`)
          this.color = WHITE
          this.isFixed = false
        }else {
          this.text = this.$t(`book.releaseAddMark`)
          this.color = BLUE
          this.isFixed = true
        }
        // 将箭头进行旋转
        const iconDown = this.$refs.iconDown
        if (iconDown.style.transform === '' || iconDown.style.transform === 'rotate(0deg)'){
          iconDown.style.transform = 'rotate(180deg)'
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .ebook-bookmark{
    position: absolute;
    top: px2rem(-35);
    left: 0;
    width: 100%;
    z-index: 200;
    height: px2rem(35);
    .ebook-bookmark-text-wrapper{
      position: absolute;
      bottom: 0;
      right: px2rem(45);
      display: flex;
      .ebook-bookmark-down-wrapper{
        font-size: px2rem(14);
        color: white;
        transition: all .2s linear;
        @include center;
      }
      .ebook-bookmark-text{
        font-size: px2rem(14);
        color: white;
      }
    }
    .ebook-bookmark-icon-wrapper{
      position: absolute;
      right: 0;
      bottom: 0;
      margin-right: px2rem(15);
    }
  }
</style>