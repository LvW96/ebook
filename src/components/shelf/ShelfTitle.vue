<template>
  <transition name="fade">
  <!--给标题添加显示条件,并动态绑定class判断阴影是否显示-->
  <div class="shelf-title" v-show="shelfTitleVisible" :class="{'hide-shadow':isHideShadow}">
    <!--标题中间的文本内容-->
    <div class="shelf-title-text-wrapper">
      <span class="shelf-title-text">{{title}}</span>
      <!--文本的显示条件是当isEditMode为true时显示，否则不显示-->
      <span class="shelf-title-sub-text" v-show="isEditMode">{{selectedText}}</span>
    </div>
    <!--清除缓存图标-->
    <div class="shelf-title-btn-wrapper shelf-title-left" v-if="showClear">
      <span class="shelf-title-btn-text" @click="clearCache">{{$t(`shelf.clearCache`)}}</span>
    </div>
    <!--编辑图标-->
    <div class="shelf-title-btn-wrapper shelf-title-right" v-if="showEdit">
      <!--增加点击事件，当点击编辑图标时可以切换,对isEditMode进行判断，当为true时显示取消图标，为false时显示编辑-->
      <span class="shelf-title-btn-text" @click="onEditClick">{{isEditMode ? $t(`shelf.cancel`) : $t(`shelf.edit`)}}</span>
    </div>
    <div class="shelf-title-btn-wrapper shelf-title-left" v-if="showBack">
      <span class="icon-back" @click="back"></span>
    </div>
    <!--修改分组按钮-->
    <div class="shelf-title-btn-wrapper"
         :class="{'shelf-title-left': changeGroupLeft, 'shelf-title-right': changeGroupRight}" @click="changeGroup"
         v-if="showChangeGroup">
      <span class="shelf-title-btn-text">{{$t(`shelf.editGroup`)}}</span>
    </div>
  </div>
  </transition>
</template>

<script>
  import {storeShelfMixin} from '../../utils/mixin'
  import {clearLocalForage} from '../../utils/localForage'
  import {clearLocalStorage,saveBookShelf} from '../../utils/localStorage'

  export default {
    mixins:[storeShelfMixin],
    props:{
      title:String,
    },
    watch:{
      // 对vuex中的offsetY进行监听
      offsetY(offsetY){
        if (offsetY > 0){
          this.isHideShadow = false
        } else {
          this.isHideShadow = true
        }
      }
    },
    data(){
      return{
        isHideShadow:true,// 是否隐藏阴影
      }
    },
    computed:{
      emptyCategory() {
        return !this.shelfCategory || !this.shelfCategory.itemList || this.shelfCategory.itemList.length === 0
      },
      showEdit() {
        return this.currentType === 1 || !this.emptyCategory
      },
      showClear() {
        return this.currentType === 1
      },
      showBack(){
        return this.currentType === 2 && !this.isEditMode
      },
      showChangeGroup() {
        return this.currentType === 2 && (this.isEditMode || this.emptyCategory)
      },
      changeGroupLeft() {
        return !this.emptyCategory
      },
      changeGroupRight() {
        return this.emptyCategory
      },
      // 显示选中了多少本图书
      selectedText(){
        //return this.$t(`shelf.selectBook`)
        // 先从vuex中获取shelfSelected中的图书数量
        const selectedNumber = this.shelfSelected ? this.shelfSelected.length : 0
        //console.log(selectedNumber)
        // 对获取的数量进行判断如果小于等于0就显示选择图书，其他情况显示选中了多少本书
        if (selectedNumber <= 0){
          return this.$t(`shelf.selectBook`)
        } else if (selectedNumber === 1) {
          return this.$t(`shelf.haveSelectedBook`).replace(`$1`,selectedNumber)
        }else {
          return this.$t(`shelf.haveSelectedBooks`).replace(`$1`,selectedNumber)
        }
      },
      popupCancelBtn() {
        return this.createPopupBtn(this.$t('shelf.cancel'), () => {
          this.hidePopup()
        })
      }
    },
    methods:{
      onComplete() {
        this.hidePopup()
        this.setShelfList(this.shelfList.filter(book => book.id !== this.shelfCategory.id)).then(() => {
          saveBookShelf(this.shelfList)
          this.$router.go(-1)
          this.setIsEditMode(false)
        })
      },
      // 删除分组
      deleteGroup(){
        if (!this.emptyCategory) {
          // 当分类列表中有图书时将分类中的图书全部改为选中状态
          this.setShelfSelected(this.shelfCategory.itemList)
          // 调用moveOutOfGroup方法将图书从分组中移除
          this.moveOutOfGroup(this.onComplete)
        } else {
          this.onComplete()
        }
      },
      changeGroupName(){
        this.hidePopup()
        this.dialog({
          showNewGroup: true,
          groupName: this.shelfCategory.title
        }).show()
      },
      // 显示删除分组弹窗
      showDeleteGroup(){
        this.hidePopup()
        setTimeout(() => {
          this.popupMenu = this.popup({
            title: this.$t(`shelf.deleteGroupTitle`),
            btn: [
              this.createPopupBtn(this.$t(`shelf.confirm`), () => {
                this.deleteGroup()
              }, `danger`),
              this.popupCancelBtn
            ]
          }).show()
        }, 200)
      },
      back(){
        this.$router.go(-1)
        this.setIsEditMode(false)
      },
      onEditClick(){
        if (!this.isEditMode){
          // 如果不是在编辑模式下需要将shelfSelected中的内容清空，并将shelfList中的图书的selected状态改为false
          this.setShelfSelected([])
          this.shelfList.forEach(item => {
            item.selected = false
            if (item.itemList){
              item.itemList.forEach(subItem => {
                subItem.selected = false
              })
            }
          })
        }
        this.setIsEditMode(!this.isEditMode)
      },
      // 清除缓存
      clearCache(){
        clearLocalStorage()
        clearLocalForage()
        this.setShelfList([])
        this.setShelfSelected([])
        this.getShelfList()// 重新从接口中获取数据
        this.simpleToast(this.$t(`shelf.clearCacheSuccess`))
      },
      hidePopup() {
        this.popupMenu.hide()
      },
      // 用来创建修改分组中的弹窗按钮
      createPopupBtn(text, onClick, type = 'normal') {
        return {
          text: text,
          type: type,
          click: onClick
        }
      },
      // 用来显示修改分组弹窗
      changeGroup(){
        this.popupMenu = this.popup({
          btn: [
            this.createPopupBtn(this.$t(`shelf.editGroupName`), () => {
              this.changeGroupName()
            }),
            this.createPopupBtn(this.$t(`shelf.deleteGroup`), () => {
              this.showDeleteGroup()
            }, `danger`),
            this.popupCancelBtn
          ]
        }).show()
      },
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .shelf-title{
    position: relative;
    width: 100%;
    height: px2rem(42);
    background: white;
    z-index: 130;
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0,0,0,.1);
    &.hide-shadow{
      box-shadow: none;
    }
    .shelf-title-text-wrapper{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: px2rem(42);
      @include columnCenter;
      .shelf-title-text{
        font-size: px2rem(16);
        line-height: px2rem(20);
        color: #333;
        font-weight: bold;
      }
      .shelf-title-sub-text{
        font-size: px2rem(10);
        color: #333;
      }
    }
    .shelf-title-btn-wrapper{
      position: absolute;
      top: 0;
      height: 100%;
      @include center;
      box-sizing: border-box;
      .shelf-title-btn-text{
        font-size: px2rem(14);
        color: #666;
      }
      .icon-back{
        font-size: px2rem(20);
        color: #666;
      }
      &.shelf-title-left{
        left: 0;
        padding-left: px2rem(15);
      }
      &.shelf-title-right{
        right: 0;
        padding-right: px2rem(15);
      }
    }
  }
</style>