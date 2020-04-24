<template>
  <div class="shelf-search-wrapper" :class="{'search-top':ifInputClicked,'hide-shadow':isHideShadow}">
    <!--为整个搜索框动态绑定class，当点击搜索框时搜索框向上移动-->
    <div class="shelf-search" :class="{'search-top':ifInputClicked}">
      <!--整个搜索框-->
      <div class="search-wrapper">
        <div class="icon-search-wrapper">
          <span class="icon-search icon"></span>
        </div>
        <!--搜索的输入框-->
        <div class="search-input-wrapper">
          <input class="search-input" type="text" :placeholder="$t(`shelf.search`)"
                 @click="onSearchClick"
                 v-model="searchText"
                 @keyup.13.exact="search"
          />
        </div>
        <!--搜索框中的清除图标-->
        <div class="icon-clear-wrapper" v-show="searchText.length > 0" @click="clearSearchText">
          <span class="icon-close-circle-fill"></span>
        </div>
      </div>
      <!--切换语言图标，绑定显示条件，当没有点击输入框是显示切换语言按钮，当点击时显示取消按钮-->
      <div class="icon-locale-wrapper" v-if="!ifInputClicked" @click="switchLocale">
        <!--根据返回的值进行判断，如果是cn显示cn图标否则显示en图标-->
        <span class="icon-cn icon" v-if="lang === 'cn'"></span>
        <span class="icon-en icon" v-else></span>
      </div>
      <!--取消图标-->
      <div class="cancel-btn-wrapper" @click="onCancelClick" v-else>
        <span class="cancel-text">{{$t(`shelf.cancel`)}}</span>
      </div>
    </div>
    <!--搜索框下的tab切换按钮-->
    <!--<transition name="hot-search-move">
      <div class="shelf-search-tab-wrapper" v-if="ifInputClicked">
        <div class="shelf-search-tab-item" v-for="item in tabs" :key="item.id" @click="onTabClick(item.id)">
          <span class="shelf-search-tab-text" :class="{'is-selected': item.id === selectedTab}">{{item.text}}</span>
        </div>
      </div>
    </transition>-->
  </div>
</template>

<script>
  import {storeShelfMixin} from '../../utils/mixin'
  import {setLocalStotage} from '../../utils/localStorage'

  export default {
    mixins: [storeShelfMixin],
    watch:{
      // 对vuex中的offsetY进行监听
      offsetY(offsetY){
        if (offsetY > 0 && this.ifInputClicked){
          this.isHideShadow = false
        } else {
          this.isHideShadow = true
        }
      }
    },
    data() {
      return {
        ifInputClicked: false,// 判断是否点击输入框
        searchText: '',// 输入框的内容
        selectedTab: 1,
        isHideShadow:true,// 是否隐藏阴影
      }
    },
    computed: {
      // 获取当前的语言
      lang() {
        //console.log(this.$i18n.locale)
        return this.$i18n.locale

      },
     /*tabs() {
        return [
          {
            id: 1,
            text: this.$t(`shelf.default`)
          },
          {
            id: 2,
            text: this.$t(`shelf.progress`)
          },
          {
            id: 3,
            text: this.$t(`shelf.purchase`)
          }
        ]
      }*/
    },
    methods: {
      search() {
        this.$router.push({
          path: '/store/list',
          query: {
            keyword: this.searchText
          }
        })
      },

      onSearchClick() {
        // 当点击输入框时将ifInputClicked置为true显示取消按钮
        //this.ifInputClicked = true
        // 当点击搜索框后整个搜索框上移，将标题隐藏
        //this.setShelfTitleVisible(false)
      },
      onCancelClick() {
        // 当点击取消按钮时将ifInputClicked置为false显示切换语言按钮
        this.ifInputClicked = false
        // 当搜索框上移后点击取消按钮后搜索框回到原位，标题显示
        this.setShelfTitleVisible(true)
      },
      // 对语言进行判断
      switchLocale() {
        if (this.lang === 'en') {
          this.$i18n.locale = 'cn'
        } else {
          this.$i18n.locale = 'en'
        }
        // 将语言保存到localStorage中
        setLocalStotage('locale', this.$i18n.locale)
      },
      clearSearchText() {
        this.searchText = ''
      },
      onTabClick(id) {
        this.selectedTab = id
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .shelf-search-wrapper {
    position: relative;
    z-index: 105;
    width: 100%;
    height: px2rem(94);
    font-size: px2rem(16);
    background: white;
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0,0,0,.1);
    &.hide-shadow{
      box-shadow: none;
    }
    &.search-top {
      position: fixed;
      left: 0;
      top: 0;
    }
    .shelf-search {
      position: absolute;
      top: px2rem(42);
      left: 0;
      z-index: 105;
      display: flex;
      width: 100%;
      height: px2rem(52);
     /* transition: top $animationTime $animationType;*/
      /*搜索框上移top值给为0，并添加动画*/
      /*&.search-top {
        top: 0;
      }*/
      .search-wrapper {
        flex: 1;
        display: flex;
        margin: px2rem(8) 0 px2rem(8) px2rem(10);
        border: px2rem(1) solid #ccc;
        border-radius: px2rem(3);
        .icon-search-wrapper {
          flex: 0 0 px2rem(22);
          @include right;
          .icon-search {
            font-size: px2rem(12);
          }
        }
        .search-input-wrapper {
          flex: 1;
          padding: 0 px2rem(10);
          box-sizing: border-box;
          @include center;
          .search-input {
            width: 100%;
            font-size: px2rem(14);
            border: none;
            color: #333;
            &:focus {
              outline: none;
            }
            &::-webkit-input-placeholder {
              font-size: px2rem(14);
              color: #ccc;
            }
          }
        }
        .icon-clear-wrapper {
          flex: 0 0 px2rem(24);
          @include left;
          .icon-close-circle-fill {
            font-size: px2rem(14);
            color: #ccc;
          }
        }
      }
      .icon-locale-wrapper {
        flex: 0 0 px2rem(55);
        @include center;
        .icon-cn, .icon-en {
          font-size: px2rem(22);
          color: #666;
        }
      }
      .cancel-btn-wrapper {
        flex: 0 0 px2rem(55);
        @include center;
        .cancel-text {
          font-size: px2rem(14);
          color: $color-blue;
        }
      }
    }
    /*.shelf-search-tab-wrapper {
      position: absolute;
      top: px2rem(52);
      left: 0;
      z-index: 105;
      display: flex;
      width: 100%;
      height: px2rem(42);
      .shelf-search-tab-item {
        flex: 1;
        @include center;
        .shelf-search-tab-text {
          font-size: px2rem(12);
          color: #999;
          &.is-selected {
            color: $color-blue;
          }
        }
      }
    }*/
  }
</style>