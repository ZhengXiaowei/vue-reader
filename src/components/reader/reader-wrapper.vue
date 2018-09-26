<template>
  <div class="reader-wrapper"
       ref="wrapper"
       :style="{
         fontSize: fz,
         background: night ? nightStyle.background : bgStyleList[bgIndex].background,
         color: night ? nightStyle.color : bgStyleList[bgIndex].color
        }">
    <!-- 阅读器部分 -->
    <div :class="[
      'wrapper-content',
      direction === 'horizontal' ? 'horizontal' : 'vertical']"
         ref="readerWrapper">
      <div class="scroll-content"
           ref="content">
        <div class="content"
             ref="chapter">
          <slot></slot>
        </div>
      </div>
    </div>
    <!-- 头部菜单和底部菜单 -->
    <transition name="down">
      <div class="wrapper-header"
           v-show="open">
        <slot name="header">
          <reader-header></reader-header>
        </slot>
      </div>
    </transition>
    <transition name="up">
      <div class="wrapper-menu"
           v-show="open">
        <slot name="menu">
          <reader-menu @direction="changeDir"
                       @font="changeFont"
                       @bg="changeBgStyle"></reader-menu>
        </slot>
      </div>
    </transition>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import ReaderHeader from "./reader-header";
import ReaderMenu from "./reader-menu";
import ReaderOptions from "./readerOptions.js";
import ReaderTouch from "./tap.js";

import { mapGetters } from "vuex";

// * 滚动方向
const DIRECTION_V = "vertical";
const DIRECTION_H = "horizontal";

// * 滚动阈值
const THRESHOLD_NEXT = -50;
const THRESHOLD_PREV = 50;

export default {
  name: "x-reader-wrapper",
  props: {
    probeType: {
      type: Number,
      default: 2
    },
    click: {
      type: Boolean,
      default: true
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: DIRECTION_V
    },
    startY: {
      type: Number,
      default: 0
    },
    bounce: {
      default: true
    },
    font: {
      type: [Number, String],
      default: 14
    }
  },
  components: {
    ReaderHeader,
    ReaderMenu
  },
  data() {
    return {
      pageCount: 1,
      curPage: 1,
      distance: 0,
      bgStyleList: ReaderOptions.bgColorStyles,
      nightStyle: ReaderOptions.nightStyle,
      open: false,
      clickBehavior: false,
      preventQuickClick: false
    };
  },
  watch: {
    direction(dir) {
      // * 监听方向变化 销毁实例 并重新初始化
      this._reset();
      this.destroy();
      this.init();
      this.initDir(dir);
    },
    font() {
      // * 字体变化后需要重新计算宽度
      this.$nextTick(() => {
        if (this.direction === "horizontal") {
          this.initDir(this.direction);
          setTimeout(() => {
            this.refresh();
            this._lockPage(false);
          }, 20);
        } else this.refresh();
      });
    },
    curPage(page) {
      // * 页数变化后返回
      this.$emit("update:page", page);
    }
  },
  computed: {
    fz() {
      return typeof this.font === String ? this.font : `${this.font}px`;
    },
    ...mapGetters("reader", ["bgIndex", "night"])
  },
  mounted() {
    setTimeout(() => {
      // * 根据滚动位置 初始化bs
      this.init();
      this.initDir(this.direction);
    }, 20);
  },
  destroyed() {
    this.$refs.wrapper && this.$refs.wrapper.destroy();
  },
  methods: {
    init() {
      if (!this.$refs.wrapper) {
        return;
      }

      let options = {
        probeType: this.probeType,
        click: this.click,
        scrollY: this.direction === DIRECTION_V,
        scrollX: this.direction === DIRECTION_H,
        startY: this.startY,
        bounce: this.bounce,
        momentum: this.direction === DIRECTION_V
      };

      this.reader = new BScroll(this.$refs.wrapper, options);

      // * 监听手指离开屏幕的事件 并返回最后的x，y坐标和移动方向
      if (this.direction === DIRECTION_H) {
        // * 通过位移distX判断方向
        this.reader.on("touchEnd", pos => {
          // * 内部滑动事件
          this._touch({
            pos,
            dir: this.reader.distX === 0 ? 0 : this.reader.distX < 0 ? 1 : -1
          });
          // * 外抛 用于做拓展事件
          this.$emit("touch", pos);
        });
      }

      if (this.listenScroll) {
        // * 监听滚动 并返回滚动坐标以及滚动反向
        this.reader.on("scroll", pos => {
          this.$emit("scroll", pos);
        });
      }
    },
    refresh() {
      this.reader && this.reader.refresh();
    },
    scrollTo() {
      this.reader && this.reader.scrollTo.apply(this.reader, arguments);
    },
    destroy() {
      this.reader.destroy();
    },
    initDir(dir) {
      // * 初始化滚动方向
      let refs = this.$refs;
      if (dir === "horizontal") {
        // * 横向需要一个总内容宽度
        this.$nextTick(() => {
          refs.content.style.width = refs.chapter.scrollWidth + "px";
          this._countPage(refs.chapter.scrollWidth);
        });
      } else {
        // * 竖向清除内容宽度 默认为设备宽度
        refs.content.style.width = "";
      }
      // * 重置滚动位置
      this.scrollTo(0, 0);
    },
    changeDir(dir) {
      this.$emit("update:direction", dir);
    },
    changeFont(font) {
      this.$emit("update:font", font);
    },
    changeBgStyle() {
      this.$emit("bgUpdate");
    },
    _tapReader(e) {
      // * 根据手指触点判断阅读器行为
      ReaderTouch.tap({
        touch: e,
        next: () => {
          if (this.direction === DIRECTION_H) this._nextPage();
        },
        prev: () => {
          if (this.direction === DIRECTION_H) this._prevPage();
        },
        menu: () => {
          this._openMenu();
        }
      });
    },
    _touch({ pos, dir }) {
      // * 只对横向滚动 边界判断
      if (this.direction === DIRECTION_V) return;
      // * 阅读器点击行为
      if (dir === 0) {
        // * point为手指的触点坐标
        let { pointX, pointY } = this.reader;
        this._tapReader({ x: pointX, y: pointY });
        return;
      }
      this.distance = pos.x;
      let arr = this.disArr;
      let pageDir = arr[this.curPage - 1];
      let diff = this.distance - pageDir;
      // * 从右向左滑
      if (dir === 1) {
        if (diff < THRESHOLD_NEXT) this._nextPage();
        else this._lockPage();
      }
      // * 从左向右滑
      if (dir === -1) {
        if (diff > THRESHOLD_PREV) this._prevPage();
        else this._lockPage();
      }
    },
    _nextPage() {
      // * 翻页逻辑 -- 下一页
      if (this.curPage === this.pageCount) {
        // * 最后一页再往后翻 就获取下一章内容
        this.$emit("next");
      } else {
        this.curPage++;
        this._lockPage();
      }
      // * 菜单不显示
      this.open = false;
    },
    _prevPage() {
      // * 翻页逻辑 -- 上一页
      if (this.curPage === 1) {
        // * 第一页再往前翻 就获取上一章内容
        this.$emit("prev");
      } else {
        this.curPage--;
        this._lockPage();
      }
      // * 菜单不显示
      this.open = false;
    },
    _lockPage(isAni = true) {
      // * 锁定停留的页面
      let pageDir = this.disArr[this.curPage - 1];
      this.reader.scrollTo(pageDir, 0, isAni ? 300 : 0);
      this.distance = pageDir;
    },
    _openMenu() {
      this.open = !this.open;
      this.$emit("openMenu");
    },
    _countPage(total) {
      // * 计算总页码数
      this.width = Math.min(
        window.innerWidth,
        window.screen.width,
        document.body.offsetWidth
      );
      // * 设置可视距离宽度
      this.$refs.chapter.style.width = this.width + "px";
      // * 页码结果向上取整
      this.pageCount = Math.ceil(total / this.width);
      this.disArr = this._perSwiperDis(this.pageCount);
      this.$emit("update:total", this.pageCount);
    },
    _perSwiperDis(totalPage) {
      // * 计算每页的滚动距离
      let sum = 0;
      let arr = [];
      arr.push(sum);
      for (let i = 1; i < totalPage; i++) {
        sum += -this.width;
        arr.push(sum);
      }
      return arr;
    },
    _reset() {
      // * 重置所有
      this.curPage = 1;
      this.distance = 0;
    }
  }
};
</script>

<style lang="stylus" scoped>
.reader-wrapper {
  position relative
  height 100%

  .wrapper-content {
    display inline-block
    position relative
    z-index 1
    text-align left

    .content {
      box-sizing border-box
      backface-visibility hidden
      padding 0.4rem 0 1rem
      height 100%
    }
  }

  .horizontal {
    height 100%

    .content {
      column-width 7.5rem
      column-gap 0rem
      position relative
    }
  }

  .vertical {
    .content {
      width 100%
    }
  }

  .scroll-content {
    height 100%
  }
}

.wrapper-header {
  position absolute
  top 0
  left 0
  width 100%
  z-index 999
}

.wrapper-menu {
  position absolute
  bottom 0
  left 0
  width 100%
  z-index 999
}

.down-enter, .down-leave-to {
  opacity 0
  transform translateY(-100%)
}

.up-enter, .up-leave-to {
  opacity 0
  transform translateY(100%)
}

.down-enter-active, .down-leave-active, .up-enter-active, .up-leave-active {
  transition all 0.3s
}
</style>
