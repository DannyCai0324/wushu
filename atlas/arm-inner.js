/* 經穴定位圖 · arm-inner（上肢屈側／陰面）
 * 手太陰肺經 LU3–11、手少陰心經 HT1–9、手厥陰心包經 PC2–9，共 26 穴。
 *
 * 視角：**自身視角** —— 舉起自己的右手、掌心朝自己、手指朝上。
 *   因此手在上、肩在下，橈側（拇指側）在畫面右、尺側（小指側）在畫面左。
 *   （這與「他人正面觀」剛好差 180° 旋轉，上下與左右都相反。）
 *
 * 座標一律由骨度分寸線性內插求得，不得目測或平均分配。
 * 每段的 px/寸 本來就不同 —— 骨度分寸是各段各自折量，不是全身同一把尺。
 *
 * 無外部相依、不使用任何瀏覽器儲存 API。
 */
(function (root) {
  "use strict";

  var MER = {
    LU: { name: "手太陰肺經", c: "#7fd4c1" },
    HT: { name: "手少陰心經", c: "#e3695f" },
    PC: { name: "手厥陰心包經", c: "#c98adf" }
  };

  var LOC = {
    LU3: "腋前紋頭下3寸，肱二頭肌橈側緣",
    LU4: "腋前紋頭下4寸，肱二頭肌橈側緣",
    LU5: "肘橫紋中，肱二頭肌腱橈側凹陷處",
    LU6: "尺澤與太淵連線上，腕橫紋上7寸",
    LU7: "橈骨莖突上方，腕橫紋上1.5寸",
    LU8: "腕橫紋上1寸，橈骨莖突與橈動脈之間",
    LU9: "腕掌側橫紋橈側端，橈動脈搏動處",
    LU10: "第1掌骨中點橈側，赤白肉際處",
    LU11: "拇指橈側指甲角旁開0.1寸",
    HT1: "腋窩中央，腋動脈搏動處",
    HT2: "肘橫紋上3寸，肱二頭肌內側溝中",
    HT3: "肘橫紋內側端與肱骨內上髁連線中點",
    HT4: "腕橫紋上1.5寸，尺側腕屈肌腱橈側緣",
    HT5: "腕橫紋上1寸，尺側腕屈肌腱橈側緣",
    HT6: "腕橫紋上0.5寸，尺側腕屈肌腱橈側緣",
    HT7: "腕掌側橫紋尺側端，尺側腕屈肌腱橈側凹陷處",
    HT8: "第4、5掌骨之間，握拳時小指尖所指處",
    HT9: "小指橈側指甲角旁開0.1寸",
    PC2: "腋前紋頭下2寸，肱二頭肌長短頭之間",
    PC3: "肘橫紋中，肱二頭肌腱尺側緣凹陷處",
    PC4: "腕橫紋上5寸，掌長肌腱與橈側腕屈肌腱之間",
    PC5: "腕橫紋上3寸，掌長肌腱與橈側腕屈肌腱之間",
    PC6: "腕橫紋上2寸，掌長肌腱與橈側腕屈肌腱之間",
    PC7: "腕掌側橫紋中央，掌長肌腱與橈側腕屈肌腱之間",
    PC8: "第2、3掌骨之間偏第3掌骨，握拳中指尖所指處",
    PC9: "中指末節尖端中央"
  };
  var NAME = {
    LU3: "天府", LU4: "俠白", LU5: "尺澤", LU6: "孔最", LU7: "列缺", LU8: "經渠",
    LU9: "太淵", LU10: "魚際", LU11: "少商",
    HT1: "極泉", HT2: "青靈", HT3: "少海", HT4: "靈道", HT5: "通里", HT6: "陰郄",
    HT7: "神門", HT8: "少府", HT9: "少衝",
    PC2: "天泉", PC3: "曲澤", PC4: "郄門", PC5: "間使", PC6: "內關",
    PC7: "大陵", PC8: "勞宮", PC9: "中衝"
  };

  var P = {
    id: "arm-inner",
    label: "上肢屈側（陰面）",
    viewBox: [0, 0, 620, 900],
    caption: "右上肢．自身視角（掌心朝自己、手指朝上）　│　左右對稱，圖示單側",
    // 縱軸錨點：手在上、肩在下。腕橫紋 0 寸、肘橫紋 12 寸、腋前紋頭 21 寸
    axis: [
      { cun: 0, y: 300, label: "腕橫紋" },
      { cun: 12, y: 640, label: "肘橫紋" },
      { cun: 21, y: 830, label: "腋前紋頭" }
    ],
    ticks: { from: 0, to: 20, step: 2 },
    // 肢體外緣：y → [左緣(尺側), 右緣(橈側)]
    edges: [
      { y: 300, l: 240, r: 320 },
      { y: 640, l: 218, r: 342 },
      { y: 830, l: 204, r: 356 }
    ],
    // 橫向：以肢體寬度百分比定位。自身視角下橈側在右，故 radial = 0.78
    lanes: { ulnar: 0.22, mid: 0.50, radial: 0.78 },
    cols: { L: { x: 170, anchor: "end" }, R: { x: 390, anchor: "start" } },
    order: ["LU", "PC", "HT"],
    pts: [
      // ── LU 手太陰肺經（橈側／畫面右）──
      { code: "LU3", cun: 18, lane: "radial", col: "R" },
      { code: "LU4", cun: 17, lane: "radial", col: "R" },
      { code: "LU5", cun: 12, lane: "radial", col: "R" },
      { code: "LU6", cun: 7, lane: "radial", col: "R" },
      { code: "LU7", cun: 1.5, lane: "radial", col: "R" },
      { code: "LU8", cun: 1, lane: "radial", col: "R" },
      { code: "LU9", cun: 0, lane: "radial", col: "R" },
      // 手部無寸數可解析，依解剖標誌手動定位（manual）
      { code: "LU10", x: 332, y: 272, col: "R", manual: true }, // 第1掌骨中點橈側．赤白肉際
      { code: "LU11", x: 377, y: 240, col: "R", manual: true }, // 拇指橈側甲角
      // ── PC 手厥陰心包經（前臂正中）──
      { code: "PC2", cun: 19, lane: "mid", col: "L" },
      { code: "PC3", cun: 12, lane: "mid", col: "L", dx: -10 }, // 肘橫紋，肱二頭肌腱尺側
      { code: "PC4", cun: 5, lane: "mid", col: "L" },
      { code: "PC5", cun: 3, lane: "mid", col: "L" },
      { code: "PC6", cun: 2, lane: "mid", col: "L" },
      { code: "PC7", cun: 0, lane: "mid", col: "L" },
      { code: "PC8", x: 300, y: 250, col: "L", manual: true }, // 第2、3掌骨之間
      { code: "PC9", x: 290, y: 62, col: "L", manual: true },  // 中指末節尖端
      // ── HT 手少陰心經（尺側／畫面左）──
      { code: "HT1", x: 224, y: 838, col: "L", manual: true }, // 腋窩中央，在腋前紋頭之下
      { code: "HT2", cun: 15, lane: "ulnar", col: "L" },
      { code: "HT3", cun: 12, lane: "ulnar", col: "L" },
      { code: "HT4", cun: 1.5, lane: "ulnar", col: "L" },
      { code: "HT5", cun: 1, lane: "ulnar", col: "L" },
      { code: "HT6", cun: 0.5, lane: "ulnar", col: "L" },
      { code: "HT7", cun: 0, lane: "ulnar", col: "L" },
      { code: "HT8", x: 252, y: 248, col: "L", manual: true }, // 第4、5掌骨之間
      { code: "HT9", x: 251, y: 104, col: "L", manual: true }  // 小指橈側甲角
    ],
    // 手部標誌
    mcp: { y: 194, l: 228, r: 332, label: "掌指關節" },
    // 四指：[外緣x, 內緣x, 指尖y]，由尺側到橈側（小指、無名指、中指、食指）
    fingers: [[232, 253, 100], [256, 278, 76], [281, 303, 62], [306, 327, 84]],
    palmPath:
      "M 240 304 C 231 266 226 232 228 202 C 229 187 238 180 251 180 " +
      "L 310 180 C 324 180 333 188 332 202 C 330 232 328 266 320 304 Z",
    // 拇指（橈側／畫面右），基部與手掌重疊，長度收在穴名欄之前
    thumbPath: "M 316 298 C 336 288 354 268 366 244 C 374 228 386 232 380 248 C 370 274 350 294 330 306 Z",
    // 掌骨（第1–5），供「第X、Y掌骨之間」這類定位對照
    metacarpals: [
      [250, 296, 240, 205], [262, 296, 264, 200], [277, 296, 289, 198],
      [292, 296, 313, 202], [309, 291, 330, 262]
    ],
    // 赤白肉際：掌背交界，井滎輸原一整組的定位基準
    chibai: [
      "M 236 296 C 228 262 224 230 226 200",           // 尺側緣
      "M 324 296 C 332 262 334 230 332 200",           // 橈側緣（含大魚際外緣）
      "M 331 232 C 344 240 356 244 370 240"            // 拇指橈側緣
    ]
  };

  /* ---------- 幾何 ---------- */
  function cunToY(cun) {
    var a = P.axis, i;
    for (i = 0; i < a.length - 1; i++) {
      if (cun >= Math.min(a[i].cun, a[i + 1].cun) && cun <= Math.max(a[i].cun, a[i + 1].cun)) {
        return a[i].y + (cun - a[i].cun) / (a[i + 1].cun - a[i].cun) * (a[i + 1].y - a[i].y);
      }
    }
    var s = cun < a[0].cun ? 0 : a.length - 2;
    return a[s].y + (cun - a[s].cun) / (a[s + 1].cun - a[s].cun) * (a[s + 1].y - a[s].y);
  }
  function yToCun(y) { // 驗收用：由 y 反推寸值
    var a = P.axis, i;
    for (i = 0; i < a.length - 1; i++) {
      if (y >= Math.min(a[i].y, a[i + 1].y) && y <= Math.max(a[i].y, a[i + 1].y)) {
        return a[i].cun + (y - a[i].y) / (a[i + 1].y - a[i].y) * (a[i + 1].cun - a[i].cun);
      }
    }
    return NaN;
  }
  function edgeAt(y) {
    var e = P.edges, i;
    for (i = 0; i < e.length - 1; i++) {
      if (y >= e[i].y && y <= e[i + 1].y) {
        var t = (y - e[i].y) / (e[i + 1].y - e[i].y);
        return [e[i].l + t * (e[i + 1].l - e[i].l), e[i].r + t * (e[i + 1].r - e[i].r)];
      }
    }
    var s = y < e[0].y ? 0 : e.length - 2;
    var t2 = (y - e[s].y) / (e[s + 1].y - e[s].y);
    return [e[s].l + t2 * (e[s + 1].l - e[s].l), e[s].r + t2 * (e[s + 1].r - e[s].r)];
  }
  function resolve(p) {
    if (p.manual) return { x: p.x, y: p.y };
    var y = cunToY(p.cun), ed = edgeAt(y);
    return { x: ed[0] + P.lanes[p.lane] * (ed[1] - ed[0]) + (p.dx || 0), y: y };
  }
  function spread(items, gap, lo, hi) {
    items.sort(function (a, b) { return a.y - b.y; });
    var prev = -1e9, i;
    for (i = 0; i < items.length; i++) { items[i].ly = Math.max(items[i].y, prev + gap); prev = items[i].ly; }
    if (items.length && items[items.length - 1].ly > hi) {
      prev = 1e9;
      for (i = items.length - 1; i >= 0; i--) { items[i].ly = Math.min(items[i].ly, prev - gap); prev = items[i].ly; }
      prev = -1e9;
      for (i = 0; i < items.length; i++) { items[i].ly = Math.max(items[i].ly, prev + gap, lo); prev = items[i].ly; }
    }
    return items;
  }

  /* ---------- SVG ---------- */
  var NS = "http://www.w3.org/2000/svg";
  function el(n, a) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); return e; }
  function txt(x, y, s, a) { var t = el("text", a || {}); t.setAttribute("x", x); t.setAttribute("y", y); t.textContent = s; return t; }

  var SKIN = "rgba(255,255,255,.04)", EDGE = "#5b5070", DASH = "#6d5f7e", MARK = "#8d7f9e";

  function build(state) {
    state = state || { mer: "ALL", sel: null };
    var svg = el("svg", {
      xmlns: NS, viewBox: P.viewBox.join(" "), width: P.viewBox[2], height: P.viewBox[3],
      "font-family": "'微軟正黑體','Microsoft JhengHei','PingFang TC','Noto Sans TC',sans-serif",
      role: "img", "aria-label": "上肢屈側經穴定位圖"
    });
    svg.appendChild(el("rect", { x: 0, y: 0, width: P.viewBox[2], height: P.viewBox[3], fill: "#1d1730" }));

    // 前臂與上臂（平滑曲線，非折線）
    svg.appendChild(el("path", {
      d: "M 320 300 C 334 360 344 500 342 640 C 341 712 350 786 356 830 " +
         "L 204 830 C 210 786 219 712 218 640 C 216 500 226 360 240 300 Z",
      fill: SKIN, stroke: EDGE, "stroke-width": 1.6, "stroke-linejoin": "round"
    }));

    // 四指（先畫，指根之後被手掌蓋住，看不到接縫）
    P.fingers.forEach(function (f) {
      svg.appendChild(el("rect", {
        x: f[0], y: f[2], width: f[1] - f[0], height: 206 - f[2],
        rx: (f[1] - f[0]) / 2, fill: SKIN, stroke: EDGE, "stroke-width": 1.4
      }));
    });
    // 拇指（橈側／畫面右），基部與手掌重疊
    svg.appendChild(el("path", {
      d: P.thumbPath, fill: SKIN, stroke: EDGE, "stroke-width": 1.5, "stroke-linejoin": "round"
    }));
    // 手掌（蓋住指根與拇指基部）
    svg.appendChild(el("path", {
      d: P.palmPath, fill: "#242038", stroke: EDGE, "stroke-width": 1.6, "stroke-linejoin": "round"
    }));
    // 掌骨（A：骨架，供「第X、Y掌骨之間」對照）
    P.metacarpals.forEach(function (m) {
      svg.appendChild(el("line", {
        x1: m[0], y1: m[1], x2: m[2], y2: m[3],
        stroke: EDGE, "stroke-width": 1, "stroke-opacity": .75, "stroke-dasharray": "5 4"
      }));
    });
    // 赤白肉際（B：井滎輸原的定位基準）
    P.chibai.forEach(function (d) {
      svg.appendChild(el("path", { d: d, fill: "none", stroke: "#c9a227", "stroke-opacity": .55, "stroke-width": 1.2, "stroke-dasharray": "2 4" }));
    });

    // 手部標誌圖例（放在最右側空白處，避開穴名欄）
    svg.appendChild(el("line", { x1: 476, y1: 244, x2: 492, y2: 244, stroke: "#c9a227", "stroke-opacity": .55, "stroke-width": 1.2, "stroke-dasharray": "2 4" }));
    svg.appendChild(txt(498, 248, "赤白肉際", { fill: "#c9a227", "fill-opacity": .85, "font-size": 11 }));
    svg.appendChild(el("line", { x1: 476, y1: 268, x2: 492, y2: 268, stroke: EDGE, "stroke-opacity": .75, "stroke-width": 1, "stroke-dasharray": "5 4" }));
    svg.appendChild(txt(498, 272, "掌骨 1–5", { fill: MARK, "font-size": 11 }));

    // 掌指關節
    svg.appendChild(el("line", {
      x1: P.mcp.l - 30, y1: P.mcp.y, x2: P.mcp.r + 30, y2: P.mcp.y,
      stroke: DASH, "stroke-width": 1.2, "stroke-dasharray": "3 3"
    }));
    svg.appendChild(txt(Math.max(P.mcp.l - 30, 176), P.mcp.y - 8, P.mcp.label, { fill: MARK, "font-size": 11 }));

    // 寸刻度（最左側）
    var g = el("g", {});
    g.appendChild(txt(46, 288, "寸", { fill: MARK, "font-size": 11, "text-anchor": "end" }));
    var c;
    for (c = P.ticks.from; c <= P.ticks.to; c += P.ticks.step) addTick(g, c);
    addTick(g, 21);
    g.appendChild(el("line", { x1: 38, y1: cunToY(0), x2: 38, y2: cunToY(21), stroke: EDGE, "stroke-width": 1 }));
    svg.appendChild(g);
    function addTick(gg, cun) {
      var ty = cunToY(cun);
      gg.appendChild(el("line", { x1: 30, y1: ty, x2: 46, y2: ty, stroke: EDGE, "stroke-width": 1 }));
      gg.appendChild(txt(26, ty + 3.5, String(cun), { fill: MARK, "font-size": 10, "text-anchor": "end" }));
    }

    // 標誌線（虛線橫貫＋名稱）—— 全圖最重要的一層
    P.axis.forEach(function (m) {
      var y = m.y, ed = edgeAt(y);
      svg.appendChild(el("line", {
        x1: ed[0] - 40, y1: y, x2: ed[1] + 40, y2: y,
        stroke: DASH, "stroke-width": 1.2, "stroke-dasharray": "3 3"
      }));
      svg.appendChild(txt(Math.max(ed[0] - 40, 176), y - 8, m.label, { fill: MARK, "font-size": 11 }));
    });

    // 座標
    var R = {};
    P.pts.forEach(function (p) { R[p.code] = resolve(p); });

    // 經脈連線
    P.order.forEach(function (m) {
      var seq = P.pts.filter(function (p) { return mer(p.code) === m; })
        .sort(function (a, b) { return num(a.code) - num(b.code); });
      var d = "", k;
      for (k = 0; k < seq.length; k++) d += (k ? " L " : "M ") + R[seq[k].code].x.toFixed(1) + " " + R[seq[k].code].y.toFixed(1);
      svg.appendChild(el("path", {
        d: d, fill: "none", stroke: MER[m].c, "stroke-width": 1.6,
        "stroke-opacity": (state.mer !== "ALL" && state.mer !== m) ? .12 : .55
      }));
    });

    // 標籤避讓
    var byCol = {};
    P.pts.forEach(function (p) {
      (byCol[p.col] = byCol[p.col] || []).push({ code: p.code, x: R[p.code].x, y: R[p.code].y });
    });
    Object.keys(byCol).forEach(function (k) { spread(byCol[k], 19, 46, 878); });

    // 穴位點＋穴名＋引線
    Object.keys(byCol).forEach(function (colKey) {
      var col = P.cols[colKey];
      byCol[colKey].forEach(function (it) {
        var m = mer(it.code), dim = (state.mer !== "ALL" && state.mer !== m);
        var gg = el("g", {
          "class": "acu-pt" + (state.sel === it.code ? " sel" : ""),
          "data-code": it.code, tabindex: "0", role: "button",
          "aria-label": NAME[it.code] + " " + it.code,
          opacity: dim ? .18 : 1, style: "cursor:pointer"
        });
        var lx = col.anchor === "end" ? col.x + 6 : col.x - 6;
        gg.appendChild(el("path", {
          d: "M " + it.x.toFixed(1) + " " + it.y.toFixed(1) + " L " + lx + " " + it.ly.toFixed(1),
          stroke: MER[m].c, "stroke-width": .9, "stroke-opacity": .45, fill: "none"
        }));
        gg.appendChild(txt(col.x, it.ly + 4, NAME[it.code], { fill: "#e6ddc8", "font-size": 13, "text-anchor": col.anchor }));
        var off = NAME[it.code].length * 13 + 6;
        gg.appendChild(txt(col.anchor === "end" ? col.x - off : col.x + off, it.ly + 4, it.code,
          { fill: "#a396b5", "font-size": 10, "text-anchor": col.anchor }));
        gg.appendChild(el("circle", { cx: it.x, cy: it.y, r: 4.6, fill: MER[m].c, stroke: "#140f1e", "stroke-width": 1.4 }));
        gg.appendChild(el("circle", { cx: it.x, cy: it.y, r: 22, fill: "transparent" })); // 44px 觸控區
        svg.appendChild(gg);
      });
    });

    svg.appendChild(txt(30, 872, P.caption, { fill: MARK, "font-size": 11 }));
    return svg;
  }

  function mer(code) { return code.replace(/[0-9]+$/, ""); }
  function num(code) { return parseInt(code.replace(/\D/g, ""), 10); }

  /* ---------- 對外 ---------- */
  root.ARM_INNER = {
    panel: P, MER: MER, NAME: NAME, LOC: LOC,
    build: build, cunToY: cunToY, yToCun: yToCun, resolve: resolve,
    // container：放圖的元素；onSelect(code, info)：點擊穴位時回呼，由 index.html 決定怎麼顯示
    render: function (container, state, onSelect) {
      container.innerHTML = "";
      var svg = build(state);
      if (onSelect) {
        svg.addEventListener("click", handler);
        svg.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handler(e); }
        });
      }
      container.appendChild(svg);
      return svg;
      function handler(e) {
        var g = e.target.closest ? e.target.closest(".acu-pt") : null;
        if (!g) return;
        var code = g.getAttribute("data-code");
        onSelect(code, { name: NAME[code], code: code, meridian: MER[mer(code)].name, loc: LOC[code] });
      }
    }
  };
})(typeof window !== "undefined" ? window : this);
