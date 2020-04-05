<template>
<!--添加过渡动画-->
<transition name="slide-down">
<!--整个标题栏分为左右两个部分,通过menuVisible进行传值进行显示与隐藏-->
  <div class="title-wrapper" v-show="menuVisible">
  <!--左部是一个返回按钮-->
    <div class="left">
    <!--添加一个返回事件-->
      <span class="icon-back" @click="back"></span>
    </div>
    <!--右边包括一个书架图标、购物车图标和更多图标-->
    <div class="right">
      <div class="icon-wrapper">
        <span class="icon-shelf"></span>
      </div>
      <div class="icon-wrapper">
        <span class="icon-cart"></span>
      </div>
      <div class="icon-wrapper">
        <span class="icon-more"></span>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
  import {ebookMixin} from '../../utils/mixin'

  export default {
  mixins:[ebookMixin],
    methods:{
      back(){
        console.log('ok')
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .title-wrapper{
    position: absolute;
    top:0;
    left: 0;
    z-index: 101;
    display: flex;
    width: 100%;
    height: px2rem(48);
    background: white;
    box-shadow: 0 px2rem(8) px2rem(8) rgba(0,0,0,.1);
    .left{
      flex: 0 0 px2rem(60);
      /*background: white;*/
      @include left;
      margin-left: px2rem(15);
      font-size: px2rem(22);
    }
    .right{
    /*让所有弹性盒模型对象的子元素都有相同的长度*/
      flex: 1;
      display: flex;
      /*设置或检索弹性盒子元素在横轴方向上的对齐方式,flex-end表示元素位于容器的结尾*/
      justify-content: flex-end;
      .icon-wrapper{
        flex: 0 0 px2rem(40);
        @include center;
        /*background: red;*/
        .icon-shelf{
          font-size: px2rem(22);
        }
        .icon-cart{
          font-size: px2rem(22);
          }
        .icon-more{
          font-size: px2rem(22);
        }
      }
    }
  }
</style>