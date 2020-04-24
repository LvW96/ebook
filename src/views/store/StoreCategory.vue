<template>
  <div class="store-shelf">
    <shelf-title :title="shelfCategory.title"></shelf-title>
    <scroll :top="0" class="store-shelf-scroll-wrapper" @onScroll="onScroll" :bottom="scrollBottom" ref="scroll"
      v-if="shelfCategory.itemList && shelfCategory.itemList.length > 0"
    >
      <shelf-list :top="42" :data="shelfCategory.itemList"></shelf-list>
    </scroll>
    <div class="store-shelf-empty-view" v-else>{{$t(`shelf.groupNone`)}}</div>
    <shelf-footer></shelf-footer>
  </div>
</template>

<script>
  import ShelfTitle from '../../components/shelf/ShelfTitle'
  import {storeShelfMixin} from '../../utils/mixin'
  import Scroll from '../../components/common/Scroll'
  import ShelfList from '../../components/shelf/ShelfList'
  import ShelfFooter from '../../components/shelf/ShelfFooter'

  export default {
    mixins:[storeShelfMixin],
    /*computed:{
      ifShowList(){
        return this.shelfCategory.itemList && this.shelfCategory.itemList.length > 0
      }
    },*/
    components:{
      Scroll,
      ShelfTitle,
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
        //this.$refs.scroll.refresh()
        this.$nextTick(() => {
          // 刷新滚动条，使得设置生效
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
      // 获取书架列表中分类中的数据
      this.getCategoryList(this.$route.query.title)
      // 标记currentType为2，对于不同的currentType，ShelfTitle将呈现不同状态
      this.setCurrentType(2)
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
    .store-shelf-empty-view{
      position: absolute;
      left: 0;
      top:0;
      width: 100%;
      height: 100%;
      font-size: px2rem(14);
      color: #333;
      @include center;
    }
  }
</style>