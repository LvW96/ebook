<template>
  <transition name="popup-slide-up">
    <!--整个字体设置面板分为两个部分，上半部分是标题，下半部分是字体选择列表-->
    <div class="ebook-popup-list" v-show="fontFamilyVisible">
    <!--标题部分-->
      <div class="ebook-popup-title">
        <div class="ebook-popup-title-icon" @click="hide">
          <span class="icon-down2"></span>
        </div>
        <span class="ebook-popup-title-text">{{$t('book.selectFont')}}</span>
      </div>
      <!--字体选择列表-->
      <div class="ebook-popup-list-wrapper">
      <!--建一个fontFamilyList数组用来存放字体，然后通过循环进行显示-->
      <!--添加setFontFamily方法用来更改字体-->
        <div class="ebook-popup-item" v-for="(item,index) in fontFamilyList" :key="index" @click="setFontFamily(item.font)">
        <!--定义isSelected方法判断字体是否被选中，如果选中给字体加上class属性将选中字体变成蓝色-->
          <div class="ebook-popup-item-text" :class="{'selected':isSelected(item)}">{{item.font}}</div>
          <div class="ebook-popup-item-check" v-if="isSelected(item)">
            <span class="icon-check"></span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import {ebookMixin} from '../../utils/mixin'
  // 引入FONT_FAMILY
  import {FONT_FAMILY} from '../../utils/book'
  import {saveFontFamily} from '../../utils/localStorage'

  export default {
    mixins:[ebookMixin],
    methods:{
      // 更改字体设置
      setFontFamily(font){
        // 调用setDefaultFontFamily方法更改字体
        this.setDefaultFontFamily(font)
        // 将字体进行保存，保存到localStorage中
        saveFontFamily(this.fileName,font)
        // 对更改的字体在阅读器上展示
        if(font === 'Default'){
          this.currentBook.rendition.themes.font('Times New Roman')
        }else {
          this.currentBook.rendition.themes.font(font)
        }
      },
      hide(){
        // 调用setFontFamilyVisible方法将fontFamilyVisible改为false实现字体设置面板隐藏
        this.setFontFamilyVisible(false)
      },
      isSelected(item){
        return this.defaultFontFamily === item.font
      },
    },
    data(){
      return{
        fontFamilyList:FONT_FAMILY
      }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .ebook-popup-list{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 300;
    background: white;
    box-shadow: 0 px2rem(-4) px2rem(6) rgba(0,0,0,.1);
    .ebook-popup-title{
      position: relative;
      padding: px2rem(15);
      box-sizing: border-box;
      border-bottom: px2rem(1) solid #b8b9bb;
      text-align: center;
      @include center;
      .ebook-popup-title-icon{
        position: absolute;
        left: px2rem(15);
        top: 0;
        height: 100%;
        font-weight: bold;
        font-size: px2rem(16);
        @include center;
      }
      .ebook-popup-title-text{
        font-size: px2rem(14);
        font-weight: bold;
      }
    }
    .ebook-popup-list-wrapper{
      .ebook-popup-item {
        display: flex;
        padding: px2rem(15);
        .ebook-popup-item-text {
          flex: 1;
          font-size: px2rem(14);
          text-align: left;
          &.selected {
            color: #346cb9;
            font-weight: bold;
          }
        }
        .ebook-popup-item-check {
          flex: 1;
          text-align: right;
          font-size: px2rem(14);
          font-weight: bold;
          color: #346cb9;
        }
      }
    }
  }
</style>