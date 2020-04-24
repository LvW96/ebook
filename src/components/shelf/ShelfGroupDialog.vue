<template>
  <ebook-dialog :title="title" ref="dialog">
    <!--对ifNewGroup进行判断，如果为false表示不新建分组使用默认的dialog，如果为true表示新建分组显示另一种样式的dialog-->
    <!--这是默认的dialog-->
    <div class="dialog-list-wrapper" v-if="!ifNewGroup">
      <div class="dialog-list-item"
           :class="{'is-add': item.edit  ? item.edit === 1 : false}"
           v-for="(item, index) in categoryList"
           :key="index"
           @click="onGroupClick(item)"
           v-if="(item.edit === 2 && isInGroup) || item.edit !== 2 || !item.edit">
        <div class="dialog-list-item-text">{{item.title}}</div>
        <div class="dialog-list-icon-wrapper" v-if="isInGroup && shelfCategory.id === item.id">
          <span class="icon-check"></span>
        </div>
      </div>
    </div>
    <!--这是点击新建分组后出现的dialog-->
    <div class="dialog-new-group-wrapper" v-else>
      <div class="dialog-input-title-wrapper">
        <span class="dialog-input-title">{{$t(`shelf.groupName`)}}</span>
      </div>
      <div class="dialog-input-wrapper">
        <div class="dialog-input-inner-wrapper">
          <input type="text" class="dialog-input" v-model="newGroupName" ref="dialogInput">
          <!--这是输入框后的清除按钮，显示条件是当输入的内容大于0才显示-->
          <div class="dialog-input-clear-wrapper" @click="clear" v-show="newGroupName && newGroupName.length > 0">
            <span class="icon-close-circle-fill"></span>
          </div>
        </div>
      </div>
    </div>
    <div slot="btn" class="group-dialog-btn-wrapper">
      <div class="dialog-btn" @click="hide">{{$t(`shelf.cancel`)}}</div>
      <!--给button按钮绑定事件，当点击时表示创建分组-->
      <div class="dialog-btn" @click="createNewGroup" :class="{'is-empty':newGroupName && newGroupName.length === 0}"
           v-if="ifNewGroup">{{$t(`shelf.confirm`)}}
      </div>
    </div>
  </ebook-dialog>
</template>

<script>
  import EbookDialog from '../common/Dialog'
  import { storeShelfMixin } from '../../utils/mixin'
  import { removeAddFromShelf, appendAddToShelf, } from '../../utils/store'
  import { saveBookShelf } from '../../utils/localStorage'

  export default {
    name: 'group-dialog',
    mixins: [storeShelfMixin],
    props:{
      showNewGroup:{
        type: Boolean,
        default:false
      },
      groupName:String
    },
    components: {
      EbookDialog
    },
    computed: {
      isInGroup(){
        return this.currentType === 2
      },
      defaultCategory() {
        return [
          {
            title: this.$t(`shelf.newGroup`),
            edit: 1
          },
          {
            title: this.$t(`shelf.groupOut`),
            edit: 2
          }
        ]
      },
      category() {
        return this.shelfList.filter(item => item.type === 2)
      },
      categoryList() {
        return [...this.defaultCategory, ...this.category]
      },
      title() {
        return !this.ifNewGroup ? this.$t(`shelf.moveBook`) : this.$t(`shelf.newGroup`)
      }
    },
    data() {
      return {
        ifNewGroup: false,// 是否创建分组
        newGroupName: ''
      }
    },
    methods: {
      show() {
        this.ifNewGroup = this.showNewGroup
        this.newGroupName = this.groupName
        this.$refs.dialog.show()
      },
      hide() {
        this.$refs.dialog.hide()
        setTimeout(() => {
          this.ifNewGroup = false
        },200)
      },
      // 对点击事件进行判断，如果点击的是新建分组就将ifNewGroup置为true然后显示新建分组对话框
      // 如果点击的是移除分组，则调用moveOutFromGroup方法将分组中的图书移除分组
      // 如果以上条件都不满足则调用moveToGroup方法将图书移入到创建的分组中
      onGroupClick(item) {
        if (item.edit && item.edit === 1) {
          this.ifNewGroup = true
        } else if (item.edit && item.edit === 2) {
          this.moveOutFromGroup(item)
        } else {
          this.moveToGroup(item)
        }
      },
      clear() {
        this.newGroupName = ''
      },
      // 将图书移入创建的分组中
      moveToGroup(group) {
        this.setShelfList(this.shelfList
          .filter(book => {
            // 1.对选中的图书进行过滤
            if (book.itemList){
              book.itemList = book.itemList.filter(subBook => this.shelfSelected.indexOf(subBook) < 0)
            }
            return this.shelfSelected.indexOf(book) < 0
          }))
          .then(() => {
            // 2.将指定的图书加入到分组中
            //console.log(group)
            // 这里的group指的是创建的分组，itemList指的是这个分组下的图书的集合
            if (group && group.itemList) {
              // 实现的是将我们选中的图书和当前这个分组中的图书进行合并
              group.itemList = [...group.itemList, ...this.shelfSelected]
            }
            // 3、对加入的图书的id进行重新排序
            // 使加入的图书按照加入的先后顺序进行排放
            group.itemList.forEach((item, index) => {
              item.id = index + 1
            })
            this.simpleToast(this.$t(`shelf.moveBookInSuccess`).replace(`$1`, group.title))
            // 4、对数据进行保存
            this.onComplete()
          })
      },
      // 将分组中的图书移除分组
      moveOutFromGroup() {
        this.moveOutOfGroup(this.onComplete)
      },
      // 创建新的分组
      createNewGroup() {
        // 先判断输入的分组名是否为空
        if (!this.newGroupName || this.newGroupName.length === 0) {
          return
        }
        if (this.showNewGroup){
          this.shelfCategory.title = this.newGroupName
          this.onComplete()
        }else {
          // 先创建一个分组的对象
          const group = {
            id: this.shelfList[this.shelfList.length - 2].id + 1,
            itemList: [],
            selected: false,
            title: this.newGroupName,
            type: 2
          }
          // 去除书架列表中的最后一个带+号的框
          let list = removeAddFromShelf(this.shelfList)
          // 将创建的新分组放入到书架中
          list.push(group)
          list = appendAddToShelf(list)
          // 把刚才去除的书架中的带+号的框重新添加回来
          this.setShelfList(list).then(() => {
            this.moveToGroup(group)
          })
        }
        },
      onComplete() {
        saveBookShelf(this.shelfList)
        this.hide()
        this.setIsEditMode(false)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .dialog-list-wrapper {
    width: 100%;
    padding: 0 px2rem(20);
    box-sizing: border-box;
    font-size: px2rem(14);
    @include scroll;
    .dialog-list-item {
      display: flex;
      padding: px2rem(15) 0;
      box-sizing: border-box;
      color: #666;
      &.is-add {
        color: $color-blue;
        &:active {
          color: $color-blue-transparent;
        }
      }
      &:active {
        color: rgba(102, 102, 102, .5)
      }
      .dialog-list-item-text {
        flex: 1;
      }
      .dialog-list-icon-wrapper {
        flex: 0 0 px2rem(30);
        color: $color-blue;
        @include right;
      }
    }
  }

  .dialog-new-group-wrapper {
    width: 100%;
    padding: 0 px2rem(20);
    box-sizing: border-box;
    .dialog-input-title-wrapper {
      font-size: px2rem(10);
      margin-top: px2rem(20);
    }
    .dialog-input-wrapper {
      width: 100%;
      padding: 0 0 px2rem(30) 0;
      box-sizing: border-box;
      .dialog-input-inner-wrapper {
        display: flex;
        width: 100%;
        padding: px2rem(10) 0;
        box-sizing: border-box;
        border-bottom: px2rem(1) solid #eee;
        font-size: px2rem(14);
        color: #666;
        .dialog-input {
          flex: 1;
          border: none;
          &:focus {
            outline: none;
          }
        }
        .dialog-input-clear-wrapper {
          flex: 0 0 px2rem(30);
          color: #ccc;
          @include center;
          &:active {
            color: #999;
          }
        }
      }
    }
  }

  .group-dialog-btn-wrapper {
    width: 100%;
    @include center;
  }
  .dialog-btn {
    flex: 1;
    &.is-empty {
      color: rgba(255, 255, 255, .5);
    }
    &:active {
      color: rgba(255, 255, 255, .5)
    }
  }
</style>
