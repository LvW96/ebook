<template>
  <transition name="slide-up">
    <!--进度条面板的显示条件是menuVisible为true和settingVisible等于2，因为在book.js中规定settingVisible等于2显示进度条面板-->
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 2">
      <div class="setting-progress">
        <div class="read-time-wrapper">
          <span class="read-time-text">{{getReadTimeText()}}</span>
          <span class="icon-forward"></span>
        </div>
        <div class="progress-wrapper">
          <div class="progress-icon-wrapper" @click="prevSection()">
            <!--进度条左边的按钮，添加一个点击事件，当点击时切换到上一章-->
            <span class="icon-back"></span>
          </div>
          <!--类型是range的滑动控件，绑定值为progress，max是指progress最大值为100，min指progress最小值为0，
          step指定按照0.01的幅度进行增长。滑动一个，增长0.01。
          @change事件，修改完成后触发的事件，即你点到那个进度后触发的，$event.target.value可以获取到最新的progress值。
          @input是修改过程时触发的事件，即拖动滑块会触发(比如拖动滑块的时候，百分比进行变化)。-->
          <input class="progress" type="range"
                 max="100"
                 min="0"
                 step="1"
                 @change="onProgressChange($event.target.value)"
                 @input="onProgressInput($event.target.value)"
                 :value="progress"
                 :disabled="!bookAvailable"
                 ref="progress">
          <div class="progress-icon-wrapper"@click="nextSection()">
            <!--进度条右边的按钮，添加一个点击事件，当点击时切换到下一章-->
            <span class="icon-forward"></span>
          </div>
        </div>
        <div class="text-wrapper">
          <span class="progress-section-text">{{getSectionName}}</span>
          <span>({{bookAvailable ? progress + '%' : '加载中...'}})</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import {ebookMixin} from '../../utils/mixin'
  import {getReadTime} from '../../utils/localStorage'

  export default {
    mixins: [ebookMixin],
    computed:{
      getSectionName(){
        /*if (this.section){
          // 根据章节数获得当前章节的信息
          const sectionInfo = this.currentBook.section(this.section)
          if (sectionInfo && sectionInfo.href && this.currentBook && this.currentBook.navigation){
            // 获得当前章节的名称
            return this.currentBook.navigation.get(sectionInfo.href).label
            // console.log(this.currentBook.navigation.get(sectionInfo.href))
          }
        }*/
        return this.section ? this.navigation[this.section].label : ''
      }
    },
    methods: {
      // 当进度条拖动松手后调用的方法
      onProgressChange(progress) {
        // 调用setProgress方法来更改进度，传入progress
        this.setProgress(progress).then(() => {
          // 此方法是用来展示当前进度所在的页面
          this.displayProgress()
          this.updateProgressBg()
        })
      },
      // 拖动进度条过程调用的方法
      onProgressInput(progress) {
        this.setProgress(progress).then(() => {
          // this.displayProgress()
          this.updateProgressBg()
        })
      },
      prevSection(){
        // 实现上一章节时只有当章节大于0并且图书解析完成然后调用setSection方法，将新的section传入更改章节
        if (this.section > 0 && this.bookAvailable){
          this.setSection(this.section - 1).then(() => {
           this.displaySection()
          })
        }
      },
      nextSection(){
        // console.log(this.currentBook.spine)
        if(this.section < this.currentBook.spine.length - 1 && this.bookAvailable){
          this.setSection(this.section + 1).then(() => {
            this.displaySection()
          })
        }
      },
      displaySection(){
        // 通过currentBook下的section方法将新的section传入得到一个section对象，将section对象存入到sectionInfo中
        const sectionInfo = this.currentBook.section(this.section)
        // console.log(sectionInfo)
        // 在section对象中有一个href属性，当sectionInfo存在并且sectionInfo下的href存在时进行展示
        if (sectionInfo && sectionInfo.href){
          // 展示章节内容时通过currentBook中的rendition对象中的display方法进行展示
          this.display(sectionInfo.href)
          /*this.currentBook.rendition.display(sectionInfo.href).then(() => {
            this.refreshLocation()
          })*/
        }},
      displayProgress(){
        // 获取cfi
        const cfi = this.currentBook.locations.cfiFromPercentage(this.progress / 100)
        // 渲染cfi
        this.display(cfi)
        /*this.currentBook.rendition.display(cfi).then(() => {
          // 在拖动进度条后调用refreshLocation方法将当前所在的页面的startCfi写进localStorage中
          this.refreshLocation()
        })*/
      },
      // 是用来对进度条阅读颜色的改变
      updateProgressBg(){
        // this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
        this.$refs.progress.style.cssText += `background-size: ${this.progress}% 100% !important;`
      },
      // 获取阅读时间方法
      getReadTimeText(){
        // 通过调用国际化中的book对象中的haveRead，然后将中间的$1替换为真实的时间，通过getReadTimeByMinute
        return this.$t(`book.haveRead`).replace(`$1`,this.getReadTimeByMinute())
      },
      // 将阅读时间转换为分钟
      getReadTimeByMinute(){
        // 从localStorage中获取阅读时间
        const readTime = getReadTime(this.fileName)
        if(!readTime){
          return 0
        }else {
          return Math.ceil(readTime/60)
        }
      }
    },
    // 解决初始状态时进度条颜色不对
    updated(){
      this.updateProgressBg()
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .setting-wrapper {
    position: absolute;
    bottom: px2rem(48);
    left: 0;
    z-index: 160;
    width: 100%;
    height: px2rem(90);
    background: white;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
    .setting-progress {
      position: relative;
      width: 100%;
      height: 100%;
      .read-time-wrapper{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: px2rem(40);
        @include center;
        font-size: px2rem(12);
      }
      .progress-wrapper {
        width: 100%;
        height: 100%;
        @include center;
        padding: 0 px2rem(15);
        box-sizing: border-box;
        .progress-icon-wrapper{
          font-size: px2rem(20);
        }
        .progress {
          width: 100%;
          -webkit-appearance: none;
          height: px2rem(2);
          margin: 0 px2rem(10);
          &:focus {
            outline: none;
          }
          &::-webkit-slider-thumb {/*是type为range的input标签内的一种伪类样式,用于设置range的滑块的具体样式*/
            -webkit-appearance: none;  /*清除默认样式*/
            height: px2rem(20);
            width: px2rem(20);
            border-radius: 50%;  /*加个圆角边*/
            background: white;
            box-shadow: 0 4px 4px 0 rgba(0, 0, 0, .15);
            border: px2rem(1) solid #ddd;
          }
        }
      }
      .text-wrapper {
        position: absolute;
        left: 0;
        bottom: px2rem(10);
        width: 100%;
        color: #333;
        font-size: px2rem(12);
        /*text-align: center;*/
        @include center;
        .progress-section-text{
          @include ellipsis;
        }
      }
    }
  }
</style>



