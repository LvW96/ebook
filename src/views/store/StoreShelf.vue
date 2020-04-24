<template>
  <div class="store-shelf">
    <shelf-title :title="$t(`shelf.title`)"></shelf-title>
    <scroll :top="0" class="store-shelf-scroll-wrapper" @onScroll="onScroll" :bottom="scrollBottom" ref="scroll">
      <shelf-search></shelf-search>
      <shelf-list :data="shelfList"></shelf-list>
    </scroll>
    <shelf-footer></shelf-footer>
  </div>
</template>

<script>
  import ShelfTitle from '../../components/shelf/ShelfTitle'
  import {storeShelfMixin} from '../../utils/mixin'
  import Scroll from '../../components/common/Scroll'
  import ShelfSearch from '../../components/shelf/ShelfSearch'
  import ShelfList from '../../components/shelf/ShelfList'
  import ShelfFooter from '../../components/shelf/ShelfFooter'

  export default {
    mixins:[storeShelfMixin],
    components:{
      Scroll,
      ShelfTitle,
      ShelfSearch,
      ShelfList,
      ShelfFooter
    },
    methods:{
      // 将滚动条滚动的偏移量写入vuex中，在ShelfTitle组件中对偏移量进行监听
      onScroll(offsetY){
        this.setOffsetY(offsetY)
      }
    },
    watch:{
      // 对isEditMode进行监听，当是编辑模式时scroll组件需要离底部有48像素
      isEditMode(isEditMode){
        this.scrollBottom = isEditMode ? 48 : 0
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
        })
      }
    },
    data(){
      return{
        scrollBottom:0
      }
    },
    mounted(){
      this.getShelfList()
      this.setShelfCategory([])// 当前处于书架列表，所以shelfCategory是为空的
      this.setCurrentType(1)// 当前处于书架列表
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .store-shelf{
    position: relative;
    z-index: 100;
    width: 100%;
    height: 100%;
    background: white;
    .store-shelf-scroll-wrapper{
      position: absolute;
      left: 0;
      top:0;
      z-index: 101;
    }
  }
</style>