<template>
  <!--推荐卡片的显示条件是flapCardVisible为true-->
  <div class="flap-card-wrapper" v-show="flapCardVisible">
    <div class="flap-card-bg" :class="{'animation':runFlapCardAnimation}" v-show="runFlapCardAnimation">
      <!--翻转的卡片,有5张卡片，对flapCardList进行遍历-->
      <div class="flap-card" v-for="(item,index) in flapCardList" :key="index" :style="{zIndex:item.zIndex}">
        <!--翻转卡片中的圆，包括左半圆和右半圆-->
        <div class="flap-card-circle">
          <!--给左半圆和右半圆动态绑定样式-->
          <div class="flap-card-semi-circle flap-card-semi-circle-left"
               :style="semiCircleStyle(item,'left')" ref="left"></div>
          <div class="flap-card-semi-circle flap-card-semi-circle-right"
               :style="semiCircleStyle(item,'right')" ref="right"></div>
        </div>
      </div>
      <!--实现烟花效果-->
      <div class="point-wrapper">
        <!--给小球动态绑定class来实现对小球的控制，控制显示与不显示-->
        <div class="point" v-for="item in pointList" :key="item" :class="{'animation':runPointAnimation}"></div>
      </div>
    </div>
    <!--图书推荐卡片-->
    <div class="book-card" :class="{'animation': runBookCardAnimation}" v-show="runBookCardAnimation">
      <div class="book-card-wrapper">
        <div class="img-wrapper">
          <img class="img" :src="data ? data.cover : ''">
        </div>
        <div class="content-wrapper">
          <div class="content-title">{{data ? data.title : ''}}</div>
          <div class="content-author sub-title-medium">{{data ? data.author : ''}}</div>
          <div class="content-category">{{categoryText()}}</div>
        </div>
        <div class="read-btn" @click.stop="showBookDetail(data)">{{$t(`home.readNow`)}}</div>
      </div>
    </div>
    <!--添加一个close方法用来关闭推荐页面-->
    <div class="close-btn-wrapper" @click="close">
      <span class="icon-close"></span>
    </div>
  </div>
</template>

<script>
  import {storeHomeMixin} from '../../utils/mixin'
  import {flapCardList, categoryText} from '../../utils/store'

  export default {
    mixins: [storeHomeMixin],
    props: {
      data: Object
    },
    data() {
      return {
        flapCardList: flapCardList,
        front: 0,
        back: 1,
        intervalTime: 20,
        runFlapCardAnimation: false,
        pointList: null,// 烟花中的小球
        runPointAnimation: false,//控制小球动画的显示
        runBookCardAnimation: false,// 控制推荐图书卡片显示
      }
    },
    watch: {
      flapCardVisible(v) {
        if (v) {
          this.runAnimation()
        }
      }
    },
    methods: {
      semiCircleStyle(item, dir) {
        return {
          backgroundColor: `rgb(${item.r},${item.g},${item.b})`,
          backgroundSize: item.backgroundSize,
          backgroundImage: dir === 'left' ? item.imgLeft : item.imgRight
        }
      },
      // 关闭推荐页面，将flapCardVisible改为false
      close() {
        this.setFlapCardVisible(false)
        this.stopAnimation()
      },
      // 使卡片转动,在卡片转动时是卡片中的圆进行转动，最上方的圆是正面圆，下方的圆称为背面圆，在转动的时候是正面圆的右半圆
      // 在转动和背面圆的左半圆进行转动，当转到90度时背面圆覆盖正面圆
      rotate(index, type) {
        // 通过index来获取flapCardList中的每一个元素
        const item = this.flapCardList[index]
        // 获取左半圆和右半圆的dom,在获取dom时先判断是正面还是背面，若是正面获取右半圆，若是背面获取左半圆
        let dom
        if (type === 'front') {
          dom = this.$refs.right[index];
        } else {
          dom = this.$refs.left[index];
        }
        // 转动是通过改变transform的值，调用rotateY方法传入rotateDegree
        dom.style.transform = `rotateY(${item.rotateDegree}deg)`;
        // 转动的过程中还需要改变颜色
        dom.style.backgroundColor = `rgb(${item.r},${item._g},${item.b})`;
      },
      flapCardRotate() {
        // 获取正面元素
        const frontFlapCard = this.flapCardList[this.front]
        // 获取背面元素
        const backFlapCard = this.flapCardList[this.back]
        // 正面元素转动时角度增加10
        frontFlapCard.rotateDegree += 10
        // 背景色不断加深
        frontFlapCard._g -= 5
        backFlapCard.rotateDegree -= 10
        if (backFlapCard.rotateDegree < 90) {
          backFlapCard._g += 5
        }
        // 当正面圆和背面圆的转动角度都到达90后背面圆要覆盖正面圆，更改zIndex的值
        if (frontFlapCard.rotateDegree === 90 && backFlapCard.rotateDegree === 90) {
          backFlapCard.zIndex += 2
        }
        this.rotate(this.front, 'front')
        this.rotate(this.back, 'back')
        // 当正面圆的转动角度到180度和背面圆的转动角度到0时进行下一个圆
        if (frontFlapCard.rotateDegree === 180 && backFlapCard.rotateDegree === 0) {
          this.next()
        }
      },
      next() {
        // 获取正面元素
        const frontFlapCard = this.flapCardList[this.front]
        // 获取背面元素
        const backFlapCard = this.flapCardList[this.back]
        // 将正面卡片和背面卡片的转动角度和颜色都还原
        frontFlapCard.rotateDegree = 0
        backFlapCard.rotateDegree = 0
        frontFlapCard._g = frontFlapCard.g
        backFlapCard._g = backFlapCard.g
        // 调用rotate方法还原
        this.rotate(this.front, 'front')
        this.rotate(this.back, 'back')
        // 将front和back指针指向下一组
        this.front++
        this.back++
        // 获取flapCardList的长度防止溢出，如果front和back大于flapCardList的长度，就要将其归位
        const len = this.flapCardList.length
        if (this.front >= len) {
          this.front = 0
        }
        if (this.back >= len) {
          this.back = 0
        }
        // 动态设置zIndex
        // 100 -> 96
        // 99 -> 100
        // 98 -> 99
        // 97 -> 98
        // 96 -> 97
        // (0 - 1 + 5) % 5 = 4
        // (1 - 1 + 5) % 5 = 0
        this.flapCardList.forEach((item, index) => {
          item.zIndex = 100 - ((index - this.front + len) % len)
        })
        this.prepare()
      },
      // 实现将背面圆的左侧半圆和右侧半圆重叠
      prepare() {
        // 获取背面圆
        const backFlapCard = this.flapCardList[this.back]
        // 让背面圆的左半圆转动180度实现和右半圆的重叠
        backFlapCard.rotateDegree = 180
        backFlapCard._g = backFlapCard.g - 5 * 9
        // 调用rotate方法实现转动
        this.rotate(this.back, 'back')
      },
      // 关闭时重置样式
      reset() {
        this.front = 0
        this.back = 1
        this.flapCardList.forEach((item, index) => {
          item.zIndex = 100 - index
          item.rotateDegree = 0
          item._g = item.g
          this.rotate(index, 'front')
          this.rotate(index, 'back')
        })
        this.runBookCardAnimation = false
        this.runFlapCardAnimation = false
        this.runPointAnimation = false
      },
      // 翻转卡片的动画
      startFlapCardAnimation() {
        this.prepare()
        this.task = setInterval(() => {
          this.flapCardRotate()
        }, this.intervalTime)
      },
      // 烟花动画
      startPointAnimation() {
        this.runPointAnimation = true
        setTimeout(() => {
          this.runPointAnimation = false
        }, 750)
      },
      stopAnimation() {
        // this.runFlapCardAnimation = false
        // 关闭定时任务
        if (this.task) {
          clearInterval(this.task)
        }
        if (this.timeout){
          clearTimeout(this.timeout)
        }
        if (this.timeout2){
          clearTimeout(this.timeout2)
        }
        this.reset()
      },
      runAnimation() {
        this.runFlapCardAnimation = true
        this.timeout = setTimeout(() => {
          // 翻转动画
          this.startFlapCardAnimation()
          // 烟花动画
          this.startPointAnimation()
        }, 300)
        this.timeout2 = setTimeout(() => {
          this.stopAnimation()
          this.runBookCardAnimation = true
        }, 2500)
      },
      categoryText() {
        if (this.data) {
          return categoryText(this.data.category, this)
        } else {
          return ''
        }
      }
    },
    // 创建烟花效果中的小球
    created() {
      this.pointList = []
      for (let i = 0; i < 18; i++) {
        this.pointList.push(`point${i}`)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/styles/global";
  @import "../../assets/styles/flapCard";

  .flap-card-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .6);
    @include center;
    .flap-card-bg {
      position: relative;
      width: px2rem(64);
      height: px2rem(64);
      border-radius: px2rem(5);
      background: white;
      transform: scale(0);
      opacity: 0;
      &.animation {
        animation: flap-card-move .3s ease-in both;
      }
      @keyframes flap-card-move {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        50% {
          transform: scale(1.2);
          opacity: 1;
        }
        75% {
          transform: scale(.9);
          opacity: 1;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      .flap-card {
        width: px2rem(48);
        height: px2rem(48);
        @include absoluteCenter;
        .flap-card-circle {
          display: flex;
          width: 100%;
          height: 100%;

          .flap-card-semi-circle {
            flex: 0 0 50%;
            width: 50%;
            height: 100%;
            background-repeat: no-repeat;
            backface-visibility: hidden; /*转动到背面不显示*/
          }
          .flap-card-semi-circle-left {
            border-radius: px2rem(24) 0 0 px2rem(24);
            background-position: center right;
            transform-origin: right; /*转动轴*/
          }
          .flap-card-semi-circle-right {
            border-radius: 0 px2rem(24) px2rem(24) 0;
            background-position: center left;
            transform-origin: left;
          }
        }
      }
      .point-wrapper {
        @include absoluteCenter;
        z-index: 1500;
        .point {
          border-radius: 50%;
          @include absoluteCenter;
          &.animation {
            /*为每一个小球都要添加样式，因此使用flapCard.scss中的move方法，但是要传入index，如何获取index；
              使用scss中的for循环，然后在使用length方法获得moves数组中的长度
            */
            @for $i from 1 to length($moves) {
              /*通过伪类找到元素*/
              &:nth-child(#{$i}) {
                @include move($i);
              }
            }
          }
        }
      }
    }
    .book-card {
      position: relative;
      width: 65%;
      max-width: px2rem(400);
      box-sizing: border-box;
      border-radius: px2rem(15);
      background: white;
      &.animation {
        animation: scale .3s ease-in both;
        @keyframes scale {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      }
      .book-card-wrapper {
        width: 100%;
        height: 100%;
        margin-bottom: px2rem(30);
        @include columnTop;
        .img-wrapper {
          width: 100%;
          margin-top: px2rem(20);
          @include center;
          .img {
            width: px2rem(90);
            height: px2rem(130);
          }
        }
        .content-wrapper {
          padding: 0 px2rem(20);
          margin-top: px2rem(20);
          .content-title {
            color: #333;
            font-weight: bold;
            font-size: px2rem(18);
            line-height: px2rem(20);
            max-height: px2rem(40);
            text-align: center;
            @include ellipsis2(2)
          }
          .content-author {
            margin-top: px2rem(10);
            text-align: center;
          }
          .content-category {
            color: #999;
            font-size: px2rem(14);
            margin-top: px2rem(10);
            text-align: center;
          }
        }
        .read-btn {
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 1100;
          width: 100%;
          border-radius: 0 0 px2rem(15) px2rem(15);
          padding: px2rem(15) 0;
          text-align: center;
          color: white;
          font-size: px2rem(14);
          background: $color-blue;
        }
      }
    }
    .close-btn-wrapper {
      position: absolute;
      left: 0;
      bottom: px2rem(30);
      z-index: 1100;
      width: 100%;
      @include center;
      .icon-close {
        width: px2rem(45);
        height: px2rem(45);
        font-size: px2rem(25);
        border-radius: 50%;
        background: #333;
        color: white;
        @include center
      }
    }
  }
</style>

