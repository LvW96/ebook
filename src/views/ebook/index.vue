<template>
  <div class="ebook">
    <ebook-title></ebook-title>
  <!--引用ebook-reader-->
    <ebook-reader></ebook-reader>
    <ebook-menu></ebook-menu>
  </div>
</template>

<script>
  // 通过import导入组件
  import EbookReader from '../../components/ebook/EbookReader'
  import EbookTitle from '../../components/ebook/EbookTitle'
  import EbookMenu from '../../components/ebook/EbookMenu'
  import {ebookMixin} from '../../utils/mixin'
  import {getReadTime,saveReadTime} from '../../utils/localStorage'

  export default {
    mixins:[ebookMixin],
    // 在components中对组件进行注册
    components: {
      EbookReader,
      EbookTitle,
      EbookMenu
    },
    methods:{
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
</style>