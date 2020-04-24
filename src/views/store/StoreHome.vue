
<template>
  <div class="store-home">
    <search-bar></search-bar>
    <flap-card :data="random"></flap-card>
    <scroll :top="scrollTop" @onScroll="onScroll" ref="scroll">
      <div class="banner-wrapper">
        <div class="banner-img" :style="{backgroundImage:`url('${banner}')`}"></div>
      </div>
      <guess-you-like :data="guessYouLike"></guess-you-like>
      <!--<recommend :data="recommend" class="recommend"></recommend>-->
      <featured :data="featured" :titleText="$t(`home.featured`)" :btnText="$t(`home.seeAll`)" class="featured"></featured>
      <div class="category-list-wrapper" v-for="(item, index) in categoryList" :key="index">
        <category-book :data="item"></category-book>
      </div>
      <category class="categories" :data="categories"></category>
    </scroll>
  </div>
</template>

<script>
  import SearchBar from '../../components/home/SearchBar'
  import Scroll from '../../components/common/Scroll'
  import FlapCard from '../../components/home/FlapCard'
  import {home} from '../../api/store'
  import {storeHomeMixin} from '../../utils/mixin'
  import GuessYouLike from '../../components/home/GuessYouLike'
  //import Recommend from '../../components/home/Recommend'
  import Featured from '../../components/home/Featured'
  import CategoryBook from '../../components/home/CategoryBook'
  import Category from '../../components/home/Category'

  export default {
    mixins:[storeHomeMixin],
    components:{
      SearchBar,
      Scroll,
      FlapCard,
      Category,
      CategoryBook,
      Featured,
      //Recommend,
      GuessYouLike,
    },
    data(){
      return{
        scrollTop:94,
        random:null,//存放电子书
        banner: '',// 存放图片
        guessYouLike: null,
        //recommend: null,
        featured: null,
        categoryList: null,
        categories: null
      }
    },
    methods:{
      onScroll(offsetY){
        //console.log(offsetY)
        this.setOffsetY(offsetY)
        // 当offsetY值大于0时要将scrollTop值改为52，此高度是搜索框的高度
        if (offsetY > 0){
          this.scrollTop = 52
        } else {
          this.scrollTop = 94
        }
        // 调用refresh方法对更改后的高度重新计算
        this.$refs.scroll.refresh()
      }
    },
    mounted(){
      // 调用home方法通过异步的方式来接收返回值，axios请求完成后都是通过异步方式返回
      home().then(response => {
        //console.log(response)
        if (response && response.status === 200) {
          const data = response.data
          //console.log(data)
          const randomIndex = Math.floor(Math.random() * data.random.length)
          // 将获取到的电子书放到random中
          this.random = data.random[randomIndex]
          // console.log(this.random)
          this.banner = data.banner
          this.guessYouLike = data.guessYouLike
          //this.recommend = data.recommend
          this.featured = data.featured
          this.categoryList = data.categoryList
          this.categories = data.categories
        }
      })
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .store-home {
    width: 100%;
    height: 100%;
    .banner-wrapper {
      width: 100%;
      padding: px2rem(10);
      box-sizing: border-box;
      .banner-img {
        width: 100%;
        height: px2rem(150);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
    .recommend {
      margin-top: px2rem(20);
    }
    .featured {
      margin-top: px2rem(20);
    }
    .category-list-wrapper {
      margin-top: px2rem(20);
    }
    .categories {
      margin-top: px2rem(20);
    }
  }
</style>

