<template>
  <div class="shelf-item-book">
    <!--加载图书的封面-->
    <img :src="data.cover" class="shelf-item-book-cover"/>
  </div>
</template>

<script>
  export default {
    // 接收从ShelfItem传来的数据
    props:{
      data:Object
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .shelf-item-book{
    width: 100%;
    height: 100%;
    .shelf-item-book-cover{
      width: 100%;
      height: 100%;
    }
  }
</style>