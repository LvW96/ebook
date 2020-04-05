<template>
  <div>
    <!--添加过渡动画-->
    <transition name="slide-up">
      <!--整个菜单栏的显示条件是通过menuVisible进行传值-->
      <div class="menu-wrapper" v-show="menuVisible" :class="{'hide-box-shadow': !menuVisible || settingVisible >=0}">
        <div class="icon-wrapper">
          <span class="icon-menu" @click="showSetting(3)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-progress" @click="showSetting(2)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-bright" @click="showSetting(1)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-A" @click="showSetting(0)"></span>
        </div>
      </div>
    </transition>
    <!--引入字号设置面板-->
  <ebook-setting-font></ebook-setting-font>
  <!--引入字体设置面板-->
  <ebook-setting-font-popup></ebook-setting-font-popup>
  <!--引入主题设置面板-->
  <ebook-setting-theme></ebook-setting-theme>
  <ebook-setting-progress></ebook-setting-progress>
  </div>
</template>

<script>
  import {ebookMixin} from '../../utils/mixin'
  // 引入字号面板组件
  import EbookSettingFont from '../../components/ebook/EbookSettingFont'
  // 引入字体设置面板组件
  import EbookSettingFontPopup from '../../components/ebook/EbookSettingFontPopup'
  // 引入主题设置面板组件
  import EbookSettingTheme from '../../components/ebook/EbookSettingTheme'
  // 引入进度条设置面板
  import EbookSettingProgress from '../../components/ebook/EbookSettingProgress'

  export default {
    methods: {
      showSetting(key) {
        this.setSettingVisible(key)
      }
    },
    mixins: [ebookMixin],
    components:{
    // 注册字号设置面板
      EbookSettingFont,
      // 注册字体设置面板
      EbookSettingFontPopup,
      // 注册主题设置面板
      EbookSettingTheme,
      // 注册进度条面板
      EbookSettingProgress
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .menu-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 102;
    width: 100%;
    height: px2rem(48);
    display: flex;
    background: white;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
    &.hide-box-shadow {
      box-shadow: none;
    }
    .icon-wrapper {
      flex: 1;
      @include center;
      .icon-menu {
        font-size: px2rem(24);
      }
      .icon-progress {
        font-size: px2rem(24);
      }
      .icon-bright {
        font-size: px2rem(24);
      }
      .icon-A {
        font-size: px2rem(24);
      }
    }
  }
</style>