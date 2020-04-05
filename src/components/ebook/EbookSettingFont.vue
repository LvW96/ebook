<template>
  <transition name="slide-up">
  <!--字号设置面板的显示是当menuVisible为true和settingVisible等于0-->
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 0">
      <!--字号大小设置-->
      <div class="setting-font-size">
        <div class="preview" :style="{fontSize: fontSizeList[0].fontSize + 'px'}">A</div>
        <div class="select">
          <div class="select-wrapper" v-for="(item, index) in fontSizeList" :key="index" @click="setFontSize(item.fontSize)">
            <div class="line"></div>
            <div class="point-wrapper">
              <div class="point" v-show="defaultFontSize === item.fontSize">
                <div class="small-point"></div>
              </div>
            </div>
            <div class="line"></div>
          </div>
        </div>
        <div class="preview" :style="{fontSize: fontSizeList[fontSizeList.length - 1].fontSize + 'px'}">A</div>
      </div>
      <!--字体设置-->
      <div class="setting-font-family" @click="showFontFamilyPopup"><!--增加点击事件当点击时弹出字体设置面板-->
        <div class="setting-font-family-text-wrapper">
          <span class="setting-font-family-text">{{defaultFontFamily}}</span>
        </div>
        <div class="setting-font-family-icon-wrapper">
          <span class="icon-forward"></span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import {ebookMixin} from '../../utils/mixin'
  // 引入字号FONT_SIZE_LIST
  import {FONT_SIZE_LIST} from '../../utils/book'
  import {saveFontSize} from '../../utils/localStorage'

  export default {
    mixins:[ebookMixin],
    data(){
      return{
        fontSizeList:FONT_SIZE_LIST
      }
    },
    methods:{
    // 更改字号大小
      setFontSize(fontSize){
        this.setDefaultFontSize(fontSize)
        // 保存字号设置
        saveFontSize(this.fileName,fontSize)
        this.currentBook.rendition.themes.fontSize(fontSize)
      },
      // 显示字体设置面板
      showFontFamilyPopup(){
        // 调用setFontFamilyVisible方法将fontFamilyVisible值改为true字体面板就会显示
        this.setFontFamilyVisible(true)
      },
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .setting-wrapper {
    position: absolute;
    bottom: px2rem(48);
    left: 0;
    z-index: 101;
    display: flex;
    flex-direction: column;/* 元素的排列方向 */
    width: 100%;
    height: px2rem(90);
    background: white;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
    .setting-font-size {
      flex: 2;
      display: flex;
      height: 100%;
      .preview {
        flex: 0 0 px2rem(40);
        @include center;
      }
      .select {
        display: flex;
        flex: 1;
        .select-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          &:first-child {
            .line {
              &:first-child {
                border-top: none;
              }
            }
          }
          &:last-child {
            .line {
              &:last-child {
                border-top: none;
              }
            }
          }
          .line {
            flex: 1;
            height: 0;
            border-top: px2rem(1) solid #ccc;
          }
          .point-wrapper {
            position: relative;
            flex: 0 0 0;
            width: 0;
            height: px2rem(7);
            border-left: px2rem(1) solid #ccc;
            .point {
              position: absolute;
              top: px2rem(-8);
              left: px2rem(-10);
              width: px2rem(20);
              height: px2rem(20);
              border-radius: 50%;
              background: white;
              border: px2rem(1) solid #ccc;
              box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, .15);
              @include center;
              .small-point {
                width: px2rem(5);
                height: px2rem(5);
                background: black;
                border-radius: 50%;
              }
            }
          }
        }
      }
    }
    .setting-font-family {
      flex: 1;
      font-size: px2rem(14);
      @include center;
      .setting-font-family-text-wrapper {
        @include center;
      }
      .setting-font-family-icon-wrapper {
        @include center;
      }
    }
  }
</style>