<template>
  <transition name="fade">
    <!--蒙板-->
    <div class="slide-content-wrapper" v-show="menuVisible && settingVisible === 3">
      <!--整个蒙板分为左侧和右侧-->
      <!--蒙板左侧是目录-->
      <transition name="slide-right">
        <div class="content" v-if="settingVisible === 3">
          <!--整个目录又分为上部分和下部分，上部分是目录和书籍信息，下部分是动态切换组件的tab按钮-->
          <div class="content-page-wrapper" v-if="bookAvailable">
            <div class="content-page" >
              <!--对currentTab进行判断，当currentTab为1时加载content插件，当currentTab为2时加载bookmark插件-->
              <component :is="currentTab === 1 ? content : bookmark"></component>
            </div>
            <!--为目录和书签动态绑定class并添加点击事件-->
            <div class="content-page-tab">
              <div class="content-page-tab-item" :class="{'selected':currentTab === 1}" @click="selectTab(1)">{{$t(`book.navigation`)}}</div>
              <div class="content-page-tab-item" :class="{'selected':currentTab ===2}" @click="selectTab(2)">{{$t(`book.bookmark`)}}</div>
            </div>
          </div>
          <!--目录加载动画面板-->
          <div class="content-empty" v-else>
            <ebook-loading></ebook-loading>
          </div>
        </div>
      </transition>
      <!--右侧是背景-->
      <div class="content-bg" @click="hide()"></div>
    </div>
  </transition>
</template>

<script>
  import {ebookMixin} from '../../utils/mixin'
  // 引入目录组件
  import EbookSlideContents from './EbookSlideContents'
  // 引入EbookLoading组件
  import EbookLoading from './EbookLoading'
  import EbookSlideBookmark from './EbookSlideBookmark'

  export default {
    components:{
      EbookLoading
    },
    mixins: [ebookMixin],
    methods: {
      hide() {
        this.setMenuVisible(false)
      },
      selectTab(tab){
        this.currentTab = tab
      },
    },
    data(){
      return {
        currentTab:1,
        content:EbookSlideContents,
        bookmark:EbookSlideBookmark
      }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .slide-content-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 300;
    display: flex;
    .content {
      flex: 0 0 85%;
      width: 85%;
      height: 100%;
      .content-page-wrapper {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        .content-page {
          flex: 1;
          width: 100%;
          overflow: hidden;
        }
        .content-page-tab {
          display: flex;
          flex: 0 0 px2rem(48);
          width: 100%;
          height: px2rem(48);
          .content-page-tab-item{
            flex: 1;
            font-size: px2rem(12);
            @include center;
          }
        }
      }
      .content-empty{
        width: 100%;
        height: 100%;
        @include center;
      }
    }
    .content-bg {
      flex: 0 0 15%;
      width: 15%;
      height: 100%;
    }
  }
</style>