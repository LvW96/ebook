
<template>
  <div class="shelf-footer" v-show="isEditMode">
    <!--使用循环显示底部栏的内容，并添加点击事件，能切换tab-->
    <div class="shelf-footer-tab-wrapper" v-for="item in tabs" :key="item.index" @click="onTabClick(item)">
      <div class="shelf-footer-tab" :class="{'is-selected':isSelected}">
        <!--<div class="icon-private tab-icon" v-if="item.index === 1 && !isPrivate"></div>
        <div class="icon-private-see tab-icon" v-if="item.index === 1 && isPrivate"></div>-->
        <div class="icon-download tab-icon" v-if="item.index === 1 && !isDownload"></div>
        <div class="icon-download-remove tab-icon" v-if="item.index === 1 && isDownload"></div>
        <div class="icon-move tab-icon" v-if="item.index === 2"></div>
        <div class="icon-shelf tab-icon" v-if="item.index === 3"></div>
        <div class="tab-text" :class="{'remove-text':item.index === 3}">{{label(item)}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {storeShelfMixin} from '../../utils/mixin'
  import {removeLocalStorage, saveBookShelf} from '../../utils/localStorage'
  import {download} from '../../api/store'
  import {removeLocalForage} from '../../utils/localForage'

  export default {
    mixins: [storeShelfMixin],
    computed: {
      tabs() {
        return [
          /*{
            label: this.$t(`shelf.private`),
            label2: this.$t(`shelf.noPrivate`),
            index: 1
          },*/
          {
            label: this.$t(`shelf.download`),
            label2: this.$t(`shelf.delete`),
            index: 1
          },
          {
            label: this.$t(`shelf.move`),
            index: 2
          },
          {
            label: this.$t(`shelf.remove`),
            index: 3
          }
        ]
      },
      isSelected() {
        return this.shelfSelected && this.shelfSelected.length > 0
      },
      // 判断当前图书是否是私密阅读状态
      /*isPrivate() {
        if (!this.isSelected) {
          return false
        } else {
          return this.shelfSelected.every(item => item.private)
        }
      },*/
      // 判断当前是否是下载状态
      isDownload() {
        if (!this.isSelected) {
          return false
        } else {
          return this.shelfSelected.every(item => item.cache)
        }
      }
    },
    data() {
      return {
        popupMenu: null
      }
    },
    methods: {
      async downloadSelectedBook(){
        for (let i = 0; i < this.shelfSelected.length; i++) {
          await this.downloadBook(this.shelfSelected[i])
            .then(book => {
              book.cache = true
            })
        }
      },
      // 具体实现下载
      downloadBook(book){
        let text = ''
        // 弹出框
        const toast = this.toast({
          text:text
        })
        toast.continueShow()
        return new Promise((resolve, reject) => {
          download(book, book => {
            //console.log(res)
            //console.log('下载完毕')
            toast.remove()
            resolve(book)
          }, reject, progressEvent => {
            // console.log(progressEvent)
            // 实现下载进度
            const progress = Math.floor(progressEvent.loaded / progressEvent.total * 100) + '%'
            text = this.$t(`shelf.progressDownload`).replace(`$1`,`${book.fileName}.epub(${progress})`)
            // console.log(text)
            // 调用toast中的updateText方法更新text值
            toast.updateText(text)
          })
        })
      },
      // 删除缓存
      removeSelectedBook(){
        Promise.all(this.shelfSelected.map(book => this.removeBook(book))).then(books => {
          books.map(book => {
            book.cache = false
          })
          saveBookShelf(this.shelfList)
          this.simpleToast(this.$t(`shelf.removeDownloadSuccess`))
        })
      },
      removeBook(book){
        return new Promise((resolve,reject) => {
          removeLocalStorage(`${book.categoryText}/${book.fileName}-info`)
          removeLocalForage(`${book.fileName}`)
          resolve(book)
        })
      },
      onComplete() {
        this.hidePopup()
        this.setIsEditMode(false)
        // 将书架数据保存到localStorage中
        saveBookShelf(this.shelfList)
      },
      // 隐藏弹出框
      hidePopup(){
        this.popupMenu.hide()
      },
      /*setPrivate(){
        let isPrivate
        if (this.isPrivate) {
          isPrivate = false
        } else {
          isPrivate = true
        }
        this.shelfSelected.forEach(book => {
          book.private = isPrivate
        })
        this.onComplete()
        if (isPrivate) {
          this.simpleToast(this.$t('shelf.setPrivateSuccess'))
        } else {
          this.simpleToast(this.$t('shelf.closePrivateSuccess'))
        }
      },*/
      // 实现电子书的下载
      async setDownload(){
        this.onComplete()
        if (this.isDownload) {
          // 实现缓存的删除
          this.removeSelectedBook()
        } else {
          // 实现电子书下载
          await this.downloadSelectedBook()
          saveBookShelf(this.shelfList)
          this.simpleToast(this.$t(`shelf.setDownloadSuccess`))
        }
      },
      // 实现图书移除书架
      removeSelected(){
        this.shelfSelected.forEach(selected => {
          this.setShelfList(this.shelfList.filter(book => book !== selected))
        })
        this.setShelfSelected([])
        this.onComplete()
      },
      // 显示私密阅读弹出框
      /*showPrivate() {
        this.popupMenu = this.popup({
          // 判断当前是否是私密阅读状态，根据状态显示不同标题
          title: this.isPrivate ? this.$t(`shelf.closePrivateTitle`) : this.$t(`shelf.setPrivateTitle`),
          btn: [
            {
              text: this.isPrivate ? this.$t(`shelf.close`) : this.$t(`shelf.open`),
              click: () => {
                this.setPrivate()
              }
            },
            {
              text: this.$t(`shelf.cancel`),
              click: () => {
                this.hidePopup()
              }
            }
          ]
        }).show()
      },*/
      // 显示下载弹出框
      showDownload(){
        this.popupMenu = this.popup({
          title: this.isDownload ? this.$t(`shelf.removeDownloadTitle`) : this.$t(`shelf.setDownloadTitle`),
          btn: [
            {
              text: this.isDownload ? this.$t(`shelf.delete`) : this.$t(`shelf.open`),
              click: () => {
                this.setDownload()
              }
            },
            {
              text: this.$t(`shelf.cancel`),
              click: () => {
                this.hidePopup()
              }
            }
          ]
        }).show()
      },
      // 显示移除书架弹出框
      showRemove() {
        let title
        if (this.shelfSelected.length === 1) {
          title = this.$t(`shelf.removeBookTitle`).replace(`$1`, `《${this.shelfSelected[0].title}》`)
        } else {
          title = this.$t(`shelf.removeBookTitle`).replace(`$1`, this.$t(`shelf.selectedBooks`))
        }
        this.popupMenu = this.popup({
          title: title,
          btn: [
            {
              text: this.$t(`shelf.removeBook`),
              type: 'danger',
              click: () => {
                this.removeSelected()
              }
            },
            {
              text: this.$t(`shelf.cancel`),
              click: () => {
                this.hidePopup()
              }
            }
          ]
        }).show()
      },
      onTabClick(item) {
        if (!this.isSelected) {
          return
        }
        switch (item.index) {
          /*case 1:
            this.showPrivate()
            break*/
          case 1:
            this.showDownload()
            break
          case 2:
            this.dialog().show()
            break
          case 3:
            this.showRemove()
            break
          default:
            break
        }
      },
      label(item) {
        switch (item.index) {
          /*case 1:
            return this.isPrivate ? item.label2 : item.label*/
          case 1:
            return this.isDownload ? item.label2 : item.label
          default:
            return item.label
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .shelf-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 120;
    display: flex;
    width: 100%;
    height: px2rem(48);
    .shelf-footer-tab-wrapper {
      flex: 1;
      width: 25%;
      height: 100%;
      .shelf-footer-tab {
        width: 100%;
        height: 100%;
        opacity: .5;
        @include columnCenter;
        &.is-selected {
          opacity: 1;
        }
        .tab-icon {
          font-size: px2rem(28);
          color: #666;
        }
        .tab-text {
          font-size: px2rem(12);
          margin-top: px2rem(5);
          color: #666;
          &.remove-text{
            color: $color-pink;
          }
        }
        .icon-shelf{
          color: $color-pink;
        }
      }
    }
  }
</style>



<!--
<template>
  <div class="shelf-footer" v-show="isEditMode">
    <div class="shelf-footer-tab-wrapper" v-for="item in tabs" :key="item.index" @click="onTabClick(item)">
      <div class="shelf-footer-tab" :class="{'is-selected': isSelected}">
        &lt;!&ndash;<div class="icon-private tab-icon" v-if="item.index === 1 && !isPrivate"></div>
        <div class="icon-private-see tab-icon" v-if="item.index === 1 && isPrivate"></div>&ndash;&gt;
        <div class="icon-download tab-icon" v-if="item.index === 1 && !isDownload"></div>
        <div class="icon-download-remove tab-icon" v-if="item.index === 1 && isDownload"></div>
        <div class="icon-move tab-icon" v-if="item.index === 2"></div>
        <div class="icon-shelf tab-icon" v-if="item.index === 3"></div>
        <div class="tab-text" :class="{'remove-text': item.index === 3}">{{label(item)}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { storeShelfMixin } from '../../utils/mixin'
  import { saveBookShelf, removeLocalStorage } from '../../utils/localStorage'
  import { download } from '../../api/store'
  import { removeLocalForage } from '../../utils/localForage'

  export default {
    mixins: [storeShelfMixin],
    computed: {
      isSelected() {
        return this.shelfSelected && this.shelfSelected.length > 0
      },
      tabs() {
        return [
          /*{
            label: this.$t('shelf.private'),
            label2: this.$t('shelf.noPrivate'),
            index: 1
          },*/
          {
            label: this.$t('shelf.download'),
            label2: this.$t('shelf.delete'),
            index: 1
          },
          {
            label: this.$t('shelf.move'),
            index: 2
          },
          {
            label: this.$t('shelf.remove'),
            index: 3
          }
        ]
      },
      /*isPrivate() {
        if (!this.isSelected) {
          return false
        } else {
          return this.shelfSelected.every(item => item.private)
        }
      },*/
      isDownload() {
        if (!this.isSelected) {
          return false
        } else {
          return this.shelfSelected.every(item => item.cache)
        }
      }
    },
    data() {
      return {
        popupMenu: null
      }
    },
    methods: {
      async downloadSelectedBook() {
        for (let i = 0; i < this.shelfSelected.length; i++) {
          await this.downloadBook(this.shelfSelected[i])
            .then(book => {
              book.cache = true
            })
        }
      },
      downloadBook(book) {
        let text = ''
        const toast = this.toast({
          text
        })
        toast.continueShow()
        return new Promise((resolve, reject) => {
          download(book, book => {
            toast.remove()
            resolve(book)
          }, reject, progressEvent => {
            const progress = Math.floor(progressEvent.loaded / progressEvent.total * 100) + '%'
            text = this.$t('shelf.progressDownload').replace('$1', `${book.fileName}.epub(${progress})`)
            toast.updateText(text)
          })
        })
      },
      removeSelectedBook() {
        Promise.all(this.shelfSelected.map(book => this.removeBook(book)))
          .then(books => {
            books.map(book => {
              book.cache = false
            })
            saveBookShelf(this.shelfList)
            this.simpleToast(this.$t('shelf.removeDownloadSuccess'))
          })
      },
      removeBook(book) {
        return new Promise((resolve, reject) => {
          removeLocalStorage(`${book.categoryText}/${book.fileName}-info`)
          removeLocalForage(`${book.fileName}`)
          resolve(book)
        })
      },
      hidePopup() {
        this.popupMenu.hide()
      },
      onComplete() {
        this.hidePopup()
        this.setIsEditMode(false)
        saveBookShelf(this.shelfList)
      },
      /*setPrivate() {
        let isPrivate
        if (this.isPrivate) {
          isPrivate = false
        } else {
          isPrivate = true
        }
        this.shelfSelected.forEach(book => {
          book.private = isPrivate
        })
        this.onComplete()
        if (isPrivate) {
          this.simpleToast(this.$t('shelf.setPrivateSuccess'))
        } else {
          this.simpleToast(this.$t('shelf.closePrivateSuccess'))
        }
      },*/
      async setDownload() {
        this.onComplete()
        if (this.isDownload) {
          this.removeSelectedBook()
        } else {
          await this.downloadSelectedBook()
          saveBookShelf(this.shelfList)
          this.simpleToast(this.$t('shelf.setDownloadSuccess'))
        }
      },
      removeSelected() {
        this.shelfSelected.forEach(selected => {
          this.setShelfList(this.shelfList.filter(book => book !== selected))
        })
        this.setShelfSelected([])
        this.onComplete()
      },
      /*showPrivate() {
        this.popupMenu = this.popup({
          title: this.isPrivate ? this.$t('shelf.closePrivateTitle') : this.$t('shelf.setPrivateTitle'),
          btn: [
            {
              text: this.isPrivate ? this.$t('shelf.close') : this.$t('shelf.open'),
              click: () => {
                this.setPrivate()
              }
            },
            {
              text: this.$t('shelf.cancel'),
              click: () => {
                this.hidePopup()
              }
            }
          ]
        }).show()
      },*/
      showDownload() {
        this.popupMenu = this.popup({
          title: this.isDownload ? this.$t('shelf.removeDownloadTitle') : this.$t('shelf.setDownloadTitle'),
          btn: [
            {
              text: this.isDownload ? this.$t('shelf.delete') : this.$t('shelf.open'),
              click: () => {
                this.setDownload()
              }
            },
            {
              text: this.$t('shelf.cancel'),
              click: () => {
                this.hidePopup()
              }
            }
          ]
        }).show()
      },
      showRemove() {
        let title
        if (this.shelfSelected.length === 1) {
          title = this.$t('shelf.removeBookTitle').replace('$1', `《${this.shelfSelected[0].title}》`)
        } else {
          title = this.$t('shelf.removeBookTitle').replace('$1', this.$t('shelf.selectedBooks'))
        }
        this.popupMenu = this.popup({
          title: title,
          btn: [
            {
              text: this.$t('shelf.removeBook'),
              type: 'danger',
              click: () => {
                this.removeSelected()
              }
            },
            {
              text: this.$t('shelf.cancel'),
              click: () => {
                this.hidePopup()
              }
            }
          ]
        }).show()
      },
      onTabClick(item) {
        if (!this.isSelected) {
          return
        }
        switch (item.index) {
          /*case 1:
            this.showPrivate()
            break*/
          case 1:
            this.showDownload()
            break
          case 2:
            this.dialog().show()
            break
          case 3:
            this.showRemove()
            break
          default:
            break
        }
      },
      label(item) {
        switch (item.index) {
          /*case 1:
            return this.isPrivate ? item.label2 : item.label*/
          case 1:
            return this.isDownload ? item.label2 : item.label
          default:
            return item.label
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .shelf-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 120;
    display: flex;
    width: 100%;
    height: px2rem(48);
    background: white;
    box-shadow: 0 px2rem(-2) px2rem(4) 0 rgba(0, 0, 0, .1);
    .shelf-footer-tab-wrapper {
      flex: 1;
      width: 25%;
      height: 100%;
      .shelf-footer-tab {
        width: 100%;
        height: 100%;
        opacity: .5;
        @include columnCenter;
        &.is-selected {
          opacity: 1;
        }
        .tab-icon {
          font-size: px2rem(20);
          color: #666;
        }
        .tab-text {
          margin-top: px2rem(5);
          font-size: px2rem(12);
          color: #666;
          &.remove-text {
            color: $color-pink;
          }
        }
        .icon-shelf {
          color: $color-pink;
        }
      }
    }
  }
</style>
-->
