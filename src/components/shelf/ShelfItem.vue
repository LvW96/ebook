<template>
  <div class="shelf-item shelf-item-shadow" @click="onItemClick">
    <!--使用动态组件来加载书架列表中的3种状态，使用动态组件的is属性来判断，将数据传给shelfItemBook-->
    <component class="shelf-item-comp" :is="item" :data="data"
      :class="{'is-edit': isEditMode && data.type === 2}"
    ></component>
    <!--当点击编辑后会出现选择图标,显示条件是当点击编辑按钮并且type为1显示-->
    <!--动态的绑定样式判断是否选中-->
    <div class="icon-selected" v-show="isEditMode && data.type === 1"
      :class="{'is-selected':data.selected}"
    ></div>
  </div>
</template>

<script>
  import {storeShelfMixin} from '../../utils/mixin'
  import ShelfItemBook from './ShelfItemBook'
  import ShelfItemAdd from './ShelfItemAdd'
  import ShelfItemCategory from './ShelfItemCategory'
  import {gotoStoreHome} from '../../utils/store'

  export default {
    mixins:[storeShelfMixin],
    // 接收从shelfList中传来的数据
    props:{
      data:Object
    },
    computed:{
      item(){
        return this.data.type === 1 ? this.book : (this.data.type === 2 ? this.category : this.add)
      }
    },
    data(){
      return{
        book:ShelfItemBook,
        category:ShelfItemCategory,
        add:ShelfItemAdd
      }
    },
    methods:{
      // 点击书架图书封面事件
      onItemClick(){
        if (this.isEditMode){
          this.data.selected = !this.data.selected
          // 如果图书是选中状态，将图书放到shelfSelected里
          if (this.data.selected){
            // 对放到shelfSelected中的图书进行去重
            this.shelfSelected.pushWithoutDuplicate(this.data)
          }else {
            // 将选中的图书从ShelfSelected中移除
            this.setShelfSelected(this.shelfSelected.filter(item => item.id !== this.data.id))
          }
        }else {
          if (this.data.type === 1){
            // 当type为1时跳转到电子书的详情页
            this.showBookDetail(this.data)
          }else if (this.data.type === 2){
            this.$router.push({
              path:'/store/category',
              query:{
                title:this.data.title
              }
            })
          }else {
            // 到书城首页
            gotoStoreHome(this)
          }
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .shelf-item{
    width: 100%;
    height: 100%;
    position: relative;
    &.shelf-item-shadow{
      box-shadow: px2rem(2) px2rem(2) px2rem(6) px2rem(2) rgba(200,200,200,.3);
    }
    .shelf-item-comp{
      opacity: 1;
      &.is-edit{
        opacity: .5;
      }
    }
    .icon-selected{
      position: absolute;
      bottom: px2rem(2);
      right: px2rem(2);
      font-size: px2rem(18);
      color: rgba(0,0,0,.4);
      &.is-selected{
        color: $color-blue;
      }
    }
  }
</style>