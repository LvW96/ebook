<template>
  <div class="shelf-item-category">
    <!--分类中的九宫格-->
    <div class="shelf-item-category-list" v-if="data.itemList.length > 0">
      <!--type为2的情况，数据信息是在data中的itemList里，使用循环进行显示-->
      <div class="shelf-item-category-list-item" v-for="(item,index) in data.itemList" :key="index">
        <img :src="item.cover" class="shelf-item-category-img">
      </div>
    </div>
    <div class="shelf-item-category-bg" v-else>
      <span class="icon-book2"></span>
    </div>
  </div>
</template>

<script>
  export default {
    props:{
      data:Object
    },
    mounted(){
      //console.log(this.data)
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .shelf-item-category{
    width: 100%;
    height: 100%;
    overflow: hidden;
    .shelf-item-category-list{
      display: flex;
      flex-flow: row wrap;
      align-content: flex-start;
      width: 100%;
      height: 100%;
      padding-top: px2rem(5);
      box-sizing: border-box;
      .shelf-item-category-list-item{
        flex: 0 0 33.33%;
        width: 33.33%;
        height: 33.33%;
        box-sizing: border-box;
        /*:nth-child(n) 选择器匹配属于其父元素的第 N 个子元素，不论元素的类型*/
        &:nth-child(3n+1){
          padding: 0 px2rem(2.5) px2rem(5) px2rem(5);
        }
        &:nth-child(3n+2){
          padding: 0 px2rem(2.5) px2rem(5) px2rem(2.5);
        }
        &:nth-child(3n+3){
          padding: 0 px2rem(5) px2rem(5) px2rem(2.5);
        }
        .shelf-item-category-img{
          width: 100%;
          height: 100%;
        }
      }
    }
    .shelf-item-category-bg{
      width: 100%;
      height: 100%;
      @include center;
      background: white;
      font-size: px2rem(30);
      color: #ccc;
    }
  }
</style>