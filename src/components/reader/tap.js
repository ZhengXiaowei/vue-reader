/* eslint-disable */
// * 阅读器点击处理

import ReaderOptions from "./readerOptions";

/**
 * 根据手指的触点判断阅读器的行为
 * @param {object} target 手指点击坐标
 */

const options = ReaderOptions.readerTap;

export default class ReaderTouch {
  constructor(target) {
    // * 获取左边的边界值
    this.leftX = options.width * options.tapArea;
    // * 获取右边的边界值
    this.rightX = options.width - this.leftX;
    // * 获取上边的边界值
    this.topY = options.height * options.tapArea;
    // * 获取下边的边界值
    this.bottomY = options.height - this.topY;
    // * 获取手指的点击坐标
    this.x = target.touch.x;
    this.y = target.touch.y;
    this.next = target.next;
    this.prev = target.prev;
    this.menu = target.menu;
    this.instance = null;
  }

  static tap(target) {
    if (!this.instance) this.instance = new ReaderTouch(target).init();
    else return this.instance;
  }

  init() {
    if (
      this.x > this.leftX &&
      this.x < this.rightX &&
      this.y > this.topY &&
      this.y < this.bottomY
    ) {
      // * 菜单中心位置
      this.menu();
    }
    if (this.x < this.leftX || (this.x < this.rightX && this.y < this.topY)) {
      // * 左侧以及坐上部分
      this.prev();
    }

    if (
      this.x > this.rightX ||
      (this.x > this.leftX && this.y > this.bottomY)
    ) {
      // * 右侧以及右下角位置
      this.next();
    }
  }
}
