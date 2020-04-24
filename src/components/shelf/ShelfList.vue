<template>
  <div class="shelf-list" :style="{top: shelfListTop}">
  <transition-group name="list" tag="div" id="shelf-list">
   <div class="shelf-list-item-wrapper" v-for="item in data":key="item.id">
      <!--将数据传给shelfItem-->
     <shelf-item :data="item" :style="{height: innerHeight}"></shelf-item>
     <!--标题的显示-->
     <div class="shelf-list-title-wrapper">
       <span class="shelf-list-title title-small">{{item.title}}</span>
     </div>
   </div>
  </transition-group>
  </div>
</template>

<script>
  import {storeShelfMixin} from '../../utils/mixin'
  import ShelfItem from './ShelfItem'
  import {realPx,px2rem} from '../../utils/utils'

  export default {
    mixins:[storeShelfMixin],
    props:{
      top:{
        type:Number,
        default:94
      },
      data:Array
    },
    components:{
      ShelfItem
    },
    computed:{
      shelfListTop(){
        return px2rem(this.top) + 'rem'
      },
      // 求出每本电子书的高度,规定电子书的大小为250*350
      innerHeight(){
        // height=width/250 *350 ;width=window.innerWidth - 120(空白处的宽度，一个空白宽度是30，一共4个)
        return ((window.innerWidth - realPx(120)) / 3) / 250 * 350 + 'px'
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .shelf-list{
    position: absolute;
    z-index: 100;
    left: 0;
    top: px2rem(52);
    width: 100%;
    #shelf-list{
      display: flex;
      padding: 0 px2rem(15);
      box-sizing: border-box;
      width: 100%;
      flex-flow: row wrap;/*水平排列且可以换行*/
    .shelf-list-item-wrapper{
      flex: 0 0 33.33%;
      width: 33.33%;
      padding: px2rem(15);
      box-sizing: border-box;
      &.list-leave-active{
        display: none;
      }
      &.list-move{
        transition: transform .5s;
      }
      .shelf-list-title-wrapper{
        margin-top: px2rem(10);
      }
    }
    }
  }
</style>