<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {}
  // 引入rem实现自适应布局，比如font-size=20px，当屏幕尺寸进行放大或缩小时font-size也能相应的进行变换
  // 实现步骤
  // 1.添加一个全局事件当在DOM加载完成后回调此方法
  document.addEventListener('DOMContentLoaded', () => {
    // 2. 获取根元素
    const html = document.querySelector('html')
    // 设置fontSize值为屏幕宽度的十分之一
    let fontSize = window.innerWidth / 10
    // 给fontSize设置上限值
    fontSize = fontSize > 50 ? 50 : fontSize
    // 3.设置根元素的font-size
    html.style.fontSize = fontSize + 'px'
  })
</script>

<style lang="scss" scoped>
  #app {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
