<template>
  <div class="ebook-slide-contents">
    <!--整个搜索框分为一个搜索图标，一个输入框，一个取消按钮-->
    <div class="slide-contents-search-wrapper">
      <div class="slide-contents-search-input-wrapper">
        <div class="slide-contents-search-icon">
          <span class="icon-search"></span>
        </div>
        <input class="slide-contents-search-input" type="text"
        v-model="searchText"
        :placeholder="$t(`book.searchHint`)"
        @click="showSearchPage()"
        @keyup.enter.exact="search()"
        />
      </div>
      <div class="slide-contents-search-cancel" v-if="searchVisible" @click="hideSearchPage()">{{$t(`book.cancel`)}}</div>
    </div>
    <!--目录的中间部分是图书的基本信息，左侧是图书的封面；中间分为上下部分，上部分是标题，下部分是作者；右侧分为上下部分，上部分是进度，下部分是阅读时间-->
    <div class="slide-contents-book-wrapper" v-show="!searchVisible">
      <div class="slide-contents-book-img-wrapper">
        <img :src="cover" class="slide-contents-book-img">
      </div>
      <div class="slide-contents-book-info-wrapper">
        <div class="slide-contents-book-title">
          <span class="slide-contents-book-title-text">{{metadata.title}}</span>
        </div>
        <div class="slide-contents-book-author">
          <span class="slide-contents-book-author-text">{{metadata.creator}}</span>
        </div>
      </div>
      <div class="slide-contents-book-progress-wrapper">
        <div class="slide-contents-book-progress">
          <span class="progress">{{progress + '%'}}</span>
          <span class="progress-text">{{$t(`book.haveRead2`)}}</span>
        </div>
        <div class="slide-contents-book-time">{{getReadTimeText()}}</div>
      </div>
    </div>
    <!--目录显示的滚动条-->
    <Scroll class="slide-contents-list" :top="156" :bottom="48" ref="scroll" v-show="!searchVisible">
      <div class="slide-contents-item" v-for="(item,index) in navigation" :key="index">
        <!--目录的标题和页数-->
        <span class="slide-contents-item-label" :style="contentItemStyle(item)"
        :class="{'selected': section === index}"
        @click="displayNavigation(item.href)">{{item.label}}</span>
        <span class="slide-contents-item-page">{{item.page}}</span>
      </div>
    </Scroll>
    <!--搜索结果列表-->
    <Scroll class="slide-search-list" :top="66" :bottom="48" v-show="searchVisible">
      <div class="slide-search-item" v-for="(item,index) in searchList" :key="index" v-html="item.excerpt" @click="displayNavigation(item.cfi,true)"></div>
    </Scroll>
  </div>
</template>

<script>
  import {ebookMixin} from '../../utils/mixin'
  import {getReadTime} from '../../utils/localStorage'
  import Scroll from '../common/Scroll'
  import {px2rem} from '../../utils/utils'

  export default {
    mixins:[ebookMixin],
    components:{
      Scroll
    },
    data(){
      return {
        searchVisible:false,
        searchList:null,// 表示搜索结果
        searchText:''// 搜索文本
      }
    },
    methods:{
      // 根据输入框输入的内容调用doSearch方法进行全文检索，查找与关键字相关的章节，将得到的结果放到searchList中
      search(){
        if (this.searchText && this.searchText.length > 0){
          this.doSearch(this.searchText).then(list => {
            this.searchList = list
            this.searchList.map(item => {
              item.excerpt =  item.excerpt.replace(this.searchText,`<span class="content-search-text">${this.searchText}</span>`)
              return item
            })
          })
        }
      },
      doSearch(q) {
    return Promise.all(
      // 通过spine中的spineItems得到一个section对象，通过section对象中的load方法，将book对象当做上下文传入，因此section对象就能获得所有的文本信息
      // 在用map进行遍历
      this.currentBook.spine.spineItems.map(section => section.load(this.currentBook.load.bind(this.currentBook))
        .then(section.find.bind(section, q))// 调用section对象中的find方法，传入搜索关键字就能实现全文的检索
        .finally(section.unload.bind(section)))// 调用unload方法释放资源
    ).then(results =>
    //console.log(results) )
    Promise.resolve([].concat.apply([], results)));// 将多维数组转为一维数组
  },
      // 当点击目录的某一章节后可以显示当前章节的内容并将目录面板隐藏
      // highlight是用来做文字的高亮显示
      displayNavigation(target,highlight = false){
        this.display(target,() => {
          this.hideTitleAndMenu()
          if (highlight){
            this.currentBook.rendition.annotations.highlight(target)
          }
        })
      },
      contentItemStyle(item){
        return {
          marginLeft:`${px2rem(item.level * 15)}rem`
        }
      },
      showSearchPage(){
        this.searchVisible = true
      },
      hideSearchPage(){
        this.searchVisible = false
        this.searchList = null
        this.searchText = ''
      },
      getReadTimeText(){
        return this.$t(`book.haveRead`).replace(`$1`,this.getReadTimeByMinute())
      },
      getReadTimeByMinute(){
        const readTime = getReadTime(this.fileName)
        if (!readTime){
          return 0
        } else {
          return Math.ceil(readTime / 60)
        }
      },
    },
    mounted(){
    /*this.doSearch('added').then(list => {
      this.searchList = list
    })*/
      /*this.currentBook.ready.then(() => {
        this.doSearch('added').then(results => {
        })
        /!*this.currentBook.spine.spineItems.map(item => {
          console.log(item)
        })*!/
      })*/
      /*const a = [1,2,4]
      const b = [3,5,6]
      console.log([].concat(a,b))
      const c = [[1,2,3],[4,5,6]]
      console.log([].concat(c))
      console.log([].concat.apply(1,c).unshift())
      console.log([].concat.apply([],c))*/
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .ebook-slide-contents{
    width: 100%;
    font-size: 0;
    .slide-contents-search-wrapper{
      width: 100%;
      display: flex;
      height: px2rem(36);
      box-sizing: border-box;
      margin: px2rem(20) 0 px2rem(10) 0;
      padding: 0 px2rem(15);
      .slide-contents-search-input-wrapper{
        flex: 1;
        @include center;
        .slide-contents-search-icon{
          flex: 0 0 px2rem(28);
          font-size: px2rem(12);
          @include center;
        }
        .slide-contents-search-input{
          flex: 1;
          width: 100%;
          height: px2rem(32);
          font-size: px2rem(14);
          background: transparent;
          border: none;
          &:focus{
            outline: none;
          }
        }
      }
      .slide-contents-search-cancel{
        flex: 0 0 px2rem(50);
        font-size: px2rem(14);
        @include right;
      }
    }
    .slide-contents-book-wrapper{
      display: flex;
      width: 100%;
      height: px2rem(90);
      box-sizing: border-box;
      padding: px2rem(10) px2rem(15) px2rem(20) px2rem(15);
      .slide-contents-book-img-wrapper{
        flex: 0 0 px2rem(45);
        .slide-contents-book-img{
          width: px2rem(45);
          height: px2rem(60);
        }
      }
      .slide-contents-book-info-wrapper{
        flex: 1;
        padding: 0 px2rem(10);
        box-sizing: border-box;
        .slide-contents-book-title{
         /* width: px2rem(153.75);*/
          font-size: px2rem(14);
          line-height: px2rem(16);
          @include left;
          .slide-contents-book-title-text{
            @include ellipsis2(3)
          }
        }
        .slide-contents-book-author{
          font-size: px2rem(12);
          /*width: px2rem(153.75);*/
          margin-top: px2rem(5);
          line-height: px2rem(14);
          @include left;
          .slide-contents-book-author-text{
            @include ellipsis2(1);
          }
        }
      }
      .slide-contents-book-progress-wrapper{
        flex: 0 0 px2rem(70);
        .slide-contents-book-progress{
          .progress{
            font-size: px2rem(14);
          }
          .progress-text{
            font-size: px2rem(12);
          }
        }
        .slide-contents-book-time{
        margin-top: px2rem(5);
          font-size: px2rem(12);
        }
      }
    }
    .slide-contents-list{
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .slide-contents-item{
        display: flex;
        padding: px2rem(20);
        box-sizing: border-box;
        .slide-contents-item-label{
          flex: 1;
          font-size: px2rem(14);
          line-height: px2rem(16);
          @include ellipsis;
        }
        .slide-contents-item-page{
          flex: 0 0 px2rem(30);
          font-size: px2rem(10);
          @include right;
        }
      }
    }
    .slide-search-list{
      width: 100%;
      padding: 0 px2rem(20);
      box-sizing: border-box;
      .slide-search-item{
        font-size: px2rem(14);
        line-height: px2rem(16);
        padding: px2rem(20) 0;
        box-sizing: border-box;
      }
    }
  }
</style>