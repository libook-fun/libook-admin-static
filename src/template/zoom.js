window.desginWidth = 750;
window.refresh = 1;
!(function(e, t, n) {
  function r() {
    let e = s.getBoundingClientRect().width;
    e > 640 && (e = 640);
    const t = (100 * e) / desginWidth;
    (s.style.fontSize = `${t}px`), (a.rem = t);
    const n = parseFloat(window.getComputedStyle(document.documentElement)['font-size']);
    if (n !== t && n > 0 && Math.abs(n - t) > 1) {
      const r = (t * t) / n;
      s.style.fontSize = `${r}px`;
    }
  }
  function i() {
    clearTimeout(o), (o = setTimeout(r, 100));
  }
  let o;
  var a = {};
  var s = e.document.documentElement;
  n &&
    e.addEventListener(
      'resize',
      () => {
        i();
      },
      !1
    ),
  n &&
      e.addEventListener(
        'pageshow',
        (e) => {
          e.persisted && i();
        },
        !1
      ),
  r(),
  (a.refreshRem = r),
  (a.rem2px = function(e) {
    let t = parseFloat(e) * this.rem;
    return 'string' === typeof e && e.match(/rem$/) && (t += 'px'), t;
  }),
  (a.px2rem = function(e) {
    let t = parseFloat(e) / this.rem;
    return 'string' === typeof e && e.match(/px$/) && (t += 'rem'), t;
  }),
  (e.remCalc = a);
})(window, window.desginWidth, window.refresh);
