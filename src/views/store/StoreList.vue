<template>
  <div class="book-list-wrapper">
    <detail-title :title="title"
                  :showShelf="true"
                  @back="back"
                  ref="title"></detail-title>
    <scroll class="book-list-scroll-wrapper"
            :top="42"
            @onScroll="onScroll"
            ref="scroll">
      <featured :data="value" :titleText="titleText ? titleText : getCategoryText(key)" :btnText="''" v-for="(value, key, index) in list"
                :key="index"></featured>
    </scroll>
  </div>
</template>

<script>
  import DetailTitle from '../../components/detail/DetaiTitle'
  import Scroll from '../../components/common/Scroll'
  import Featured from '../../components/home/Featured'
  import { realPx } from '../../utils/utils'
  import { list } from '../../api/store'
  import { categoryList, categoryText } from '../../utils/store'

  export default {
    components: {
      DetailTitle,
      Scroll,
      Featured
    },
    computed: {
      title() {
        if (this.list) {
          return this.total && this.$t(`home.allBook`).replace(`$1`, this.totalNumber)
        } else {
          return null
        }
      },
      totalNumber() {
        let num = 0
        Object.keys(this.list).forEach(key => {
          num += this.list[key].length
        })
        return num
      }
    },
    data() {
      return {
        list: null,
        total: null
      }
    },
    methods: {
      getCategoryText(key) {
        return `${categoryText(categoryList[key], this)}(${this.list[key].length})`
      },
      back() {
        this.$router.go(-1)
      },
      onScroll(offsetY) {
        if (offsetY > realPx(42)) {
          this.$refs.title.showShadow()
        } else {
          this.$refs.title.hideShadow()
        }
      },
      getList() {
        // 调用list接口获取数据
        list().then(response => {
          this.list = response.data.data
          this.total = response.data.total
          // 先获取分类名称
          const category = this.$route.query.category
          // 获取搜索的关键字
          const keyword = this.$route.query.keyword
          if (category) {
            // 对list中的所有分类名进行遍历，查找是否有和传入的分类名相同的，如果有将其分类名保存
            const key = Object.keys(this.list).filter(item => item === category)[0]
            // 从list中的拿出改分类下的数据
            const data = this.list[key]
            this.list = {}
            // 对拿到的数据进行展示
            this.list[key] = data
          } else if (keyword) {
            //console.log(this.list)
            // 先获取列表中的所有分类名，然后对所有分类名进行遍历
            Object.keys(this.list).filter(key => {
              // 对每一个分类名进行遍历，查找该分类名下的所有图书中的书名中是否包含关键字，如果包含进行保留，将得到的新数组替换原来的数组
              this.list[key] = this.list[key].filter(book => book.fileName.indexOf(keyword) >= 0)
              return this.list[key].length > 0
            })
            //console.log(this.list)
          }
        })
      }
    },
    created() {
      this.getList()
      this.titleText = this.$route.query.categoryText
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .book-list-wrapper {
    width: 100%;
    height: 100%;
    background: white;
  }
</style>
