<template>
  <div class="reader-menu">
    <div class="reader-menu__box">
      <div class="menu-box__text">字号</div>
      <div class="menu-box__item">
        <div class="item-font__operator item-font__subtract"
             @click.stop="subtract">A-</div>
        <div class="item-font__text">{{fontSize}}</div>
        <div class="item-font__operator item-font__add"
             @click.stop="add">A+</div>
        <div class="item-font__reset"
             @click.stop="resetFont">默认</div>
      </div>
    </div>
    <div class="reader-menu__box">
      <div class="menu-box__text">背景</div>
      <div class="menu-box__item">
        <template v-for="(bgStyle, i) in bgStyleList">
          <div class="item-bg"
               :key="i"
               :style="{background:bgStyle.menuColor}"
               @click.stop="bgChange(i)">
            <img v-show="i===bgIndex"
                 class="item-bg__check"
                 src="./assets/check.png"
                 alt="">
          </div>
        </template>
      </div>
    </div>
    <div class="reader-menu__box">
      <div class="menu-box__item">
        <div class="item-operator">上一章</div>
        <div class="item-operator">目录</div>
        <div class="item-operator"
             @click.stop="changeDir">{{direction==='vertical'?'左右翻页':'上下翻页'}}</div>
        <div class="item-operator"
             @click.stop="toggleNight">{{night?'白天':'夜间'}}</div>
        <div class="item-operator">下一章</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import ReaderOptions from "./readerOptions.js";

export default {
  computed: {
    ...mapState("reader", ["direction"]),
    ...mapGetters("reader", ["fontSize", "night", "bgIndex"])
  },
  data() {
    return {
      min: ReaderOptions.minFontSize,
      max: ReaderOptions.maxFontSize,
      default: ReaderOptions.defaultFontSize,
      bgStyleList: ReaderOptions.bgColorStyles
    };
  },
  methods: {
    subtract() {
      // * 字体减小
      this.font = this.fontSize;
      // * 边界判断
      if (this.font - 1 < this.min) return;
      this.setReaderOptions({ name: "font", value: this.font - 1 });
      this.$emit("font", this.font - 1);
    },
    add() {
      // * 字体加大
      this.font = this.fontSize;
      // * 边界判断
      if (this.font + 1 > this.max) return;
      this.setReaderOptions({ name: "font", value: this.font + 1 });
      this.$emit("font", this.font + 1);
    },
    resetFont() {
      // * 恢复默认字体
      this.setReaderOptions({ name: "font", value: this.default });
      this.$emit("font", this.default);
    },
    bgChange(i) {
      // * 修改背景色
      if (this.bgIndex === i) return;
      this.setReaderOptions({ name: "bg", value: i });
      // * 如果处于夜间模式 则切换回来
      if (this.night) this.toggleNight()
      this.$emit("bg");
    },
    toggleNight() {
      // * 日夜模式切换
      this.setReaderOptions({ name: "night" });
    },
    changeDir() {
      // * 修改阅读方向
      let dir = this.direction === "vertical" ? "horizontal" : "vertical";
      this.setReaderOptions({
        name: "direction",
        value: dir
      });
      this.$emit("direction", dir);
    },
    ...mapActions("reader", ["setReaderOptions"])
  }
};
</script>

<style lang="stylus" scoped>
.reader-menu {
  padding 0.24rem
  background #262626
  box-sizing border-box
  font-size 0.26rem
  color #fff
}

.reader-menu__box {
  display flex
  justify-content flex-start
  align-items center
  margin-top 0.3rem

  .menu-box__text {
    width 1.6rem
    font-size 0.28rem
  }

  .menu-box__item {
    flex 1
    display flex
    justify-content space-between
    align-items center

    .item-font__operator {
      width 1.2rem
      text-align center
      border 1px solid #fff
      border-radius 2px
      padding 2px 0
    }

    .item-bg {
      width 0.6rem
      height 0.6rem
      border-radius 4px
      position relative
    }

    .item-bg__check {
      position absolute
      width 100%
      height 100%
      top 0
      left 0
      border-radius 4px
    }

    .item-operator {
      padding 0.2rem 0
    }
  }
}
</style>
