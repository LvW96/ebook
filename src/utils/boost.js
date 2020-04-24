// 去除数组中的重复元素
Array.prototype.pushWithoutDuplicate = function () {
  for (let i = 0;i < arguments.length;i++){
    const arg = arguments[i]
    // 这里的this代指ShelfItem组件中的this.shelfSelected
    if (this.indexOf(arg) === -1){
      this.push(arg)
    }
  }
}