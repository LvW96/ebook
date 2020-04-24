<template>
  <div class="ebook" ref="ebook">
    <ebook-header></ebook-header>
    <ebook-title></ebook-title>
  <!--引用ebook-reader-->
    <ebook-reader></ebook-reader>
    <ebook-menu></ebook-menu>
    <ebook-book-mark></ebook-book-mark>
    <ebook-footer></ebook-footer>
  </div>
</template>

<script>
  // 通过import导入组件
  import EbookReader from '../../components/ebook/EbookReader'
  import EbookTitle from '../../components/ebook/EbookTitle'
  import EbookMenu from '../../components/ebook/EbookMenu'
  import EbookBookMark from '../../components/ebook/EbookBookMark'
  import {ebookMixin} from '../../utils/mixin'
  import EbookHeader from '../../components/ebook/EbookHeader'
  import EbookFooter from '../../components/ebook/EbookFooter'
  import {getReadTime,saveReadTime} from '../../utils/localStorage'

  export default {
    mixins:[ebookMixin],
    // 在components中对组件进行注册
    components: {
      EbookReader,
      EbookTitle,
      EbookMenu,
      EbookBookMark,
      EbookHeader,
      EbookFooter
    },
    watch:{
      // 对偏移量做监听
      offsetY(v){
        if (!this.menuVisible && this.bookAvailable) {
          // 监听到偏移量大于0时调用move方法更改top值实现阅读器的下拉操作
          if (v > 0){
            this.move(v)
          }else if (v === 0){
            this.$refs.ebook.style.top = 0
            this.$refs.ebook.style.transition = 'all .2s linear'
            setTimeout(() => {
              this.$refs.ebook.style.transition = ''
            },200)
          }
        }
      }
    },
    methods:{
      move(v){
        this.$refs.ebook.style.top = v + 'px'
      },
      // 记录阅读时间方法
      startLoopReadTime(){
        // 从localStorage中获取阅读时间并进行判断
        let readTime = getReadTime(this.fileName)
        if (!readTime){
          readTime = 0
        }
        // 启动定时任务，定义this.task指向当前的定时任务
        this.task = setInterval(() => {
          readTime ++
          if (readTime % 30 ===0){
            saveReadTime(this.fileName,readTime)
          }
        },1000)
      }
    },
    mounted(){
      this.startLoopReadTime()
    },
    beforeDestroy(){
      if (this.task){
        // 终止当前的定时任务
        clearInterval(this.task)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .ebook{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>