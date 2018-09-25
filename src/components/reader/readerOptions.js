/* eslint-disable */
const readerOptions = {
  // * 默认字体大小
  defaultFontSize: 19,
  // * 最大字体大小
  maxFontSize: 36,
  // * 最小字体大小
  minFontSize: 12,
  // * 背景集合
  bgColorStyles: [
    {
      menuColor: "#f5dce4",
      background: "#f5dce4",
      color: "#7B3149"
    },
    {
      menuColor: "#DFF5DC",
      background: "#DFF5DC",
      color: "#1F4D2B"
    },
    {
      menuColor: "#38658C",
      background: "#38658C",
      color: "#fff"
    },
    {
      menuColor: "#e6e6e6",
      background: "#e6e6e6",
      color: "#262626"
    },
    {
      menuColor: "#ffdca3",
      background:
        "url(http://yueduyun.oss-cn-hangzhou.aliyuncs.com/h5/reader_bg_parchment_paper.jpg) center / 100% 100% fixed",
      color: "#4c3831"
    }
  ],
  // * 夜间模式背景数据
  nightStyle: {
    color: "#999",
    background: "#222"
  },
  // * 阅读器边界
  readerTap: {
    tapArea: 1 / 4,
    width: Math.min(
      window.innerWidth,
      window.screen.width,
      document.body.offsetWidth
    ),
    height: Math.min(
      window.innerHeight,
      window.screen.height
    )
  }
};

export default readerOptions;
