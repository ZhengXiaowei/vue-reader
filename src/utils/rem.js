/* eslint-disable */
function refreshRem() {
  document.documentElement.style.fontSize =
    (Math.min(window.innerWidth, screen.width, document.body.offsetWidth) /
      750) *
      100 +
    "px";
}
window.addEventListener(
  "resize",
  function() {
    clearTimeout(tid);
    tid = setTimeout(refreshRem, 300);
  },
  false
);
window.addEventListener(
  "pageshow",
  function(e) {
    if (e.persisted) {
      clearTimeout(tid);
      tid = setTimeout(refreshRem, 300);
    }
  },
  false
);
var tid;
refreshRem();
