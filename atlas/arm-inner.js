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
 * 2026-08-07 標註排版修正：牽引線改直角折線＋雙子欄＋專屬導引槽，
 *   保證任兩條牽引線不交叉。**穴位座標與上一版完全一致，未更動任何一個。**
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
  // 軸外定位（超出 0–21 寸刻度範圍者，於標籤下方加註）
  var OFFAXIS = { HT1: "軸外・腋窩中央" };

  var P = {
    id: "arm-inner",
    label: "上肢屈側（陰面）",
    // x 起點為負，只是把畫布往左讓出標籤空間；所有穴位座標不受影響
    viewBox: [-150, 0, 770, 900],
    caption: "右上肢．自身視角（掌心朝自己、手指朝上）　│　左右對稱，圖示單側",
    axis: [
      { cun: 0, y: 300, label: "腕橫紋" },
      { cun: 12, y: 640, label: "肘橫紋" },
      { cun: 21, y: 830, label: "腋前紋頭" }
    ],
    ticks: { from: 0, to: 20, step: 2 },
    edges: [
      { y: 300, l: 240, r: 320 },
      { y: 640, l: 218, r: 342 },
      { y: 830, l: 204, r: 356 }
    ],
    lanes: { ulnar: 0.22, mid: 0.50, radial: 0.78 },
    /* 每側：dir 方向、導引槽起點與步進、刻痕線 x、近欄／遠欄標籤 x
       導引槽 x 依「點的 y 排序」單調外→內，這是牽引線不交叉的關鍵 */
    cols: {
      L: { dir: -1, anchor: "end", gut0: 84, gutStep: 2.4, notchX: 78, near: 60, far: -20 },
      R: { dir: 1, anchor: "start", gut0: 420, gutStep: -2.4, notchX: 426, near: 436, far: 516 }
    },
    ruler: { numX: -128, t1: -124, t2: -108, axisX: -116 },
    order: ["LU", "PC", "HT"],
    /* ⚠ 以下 26 筆與 2026-08-06 版逐字相同，本輪未更動任何座標 */
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
      { code: "HT1", x: 224, y: 838, col: "L", manual: true }, // 腋窩中央，在腋前紋頭之外
      { code: "HT2", cun: 15, lane: "ulnar", col: "L" },
      { code: "HT3", cun: 12, lane: "ulnar", col: "L" },
      { code: "HT4", cun: 1.5, lane: "ulnar", col: "L" },
      { code: "HT5", cun: 1, lane: "ulnar", col: "L" },
      { code: "HT6", cun: 0.5, lane: "ulnar", col: "L" },
      { code: "HT7", cun: 0, lane: "ulnar", col: "L" },
      { code: "HT8", x: 252, y: 248, col: "L", manual: true }, // 第4、5掌骨之間
      { code: "HT9", x: 251, y: 104, col: "L", manual: true }  // 小指橈側甲角
    ],
    mcp: { y: 194, l: 228, r: 332, label: "掌指關節" },
    fingers: [[232, 253, 100], [256, 278, 76], [281, 303, 62], [306, 327, 84]],
    palmPath:
      "M 240 304 C 231 266 226 232 228 202 C 229 187 238 180 251 180 " +
      "L 310 180 C 324 180 333 188 332 202 C 330 232 328 266 320 304 Z",
    thumbPath: "M 316 298 C 336 288 354 268 366 244 C 374 228 386 232 380 248 C 370 274 350 294 330 306 Z",
    metacarpals: [
      [250, 296, 240, 205], [262, 296, 264, 200], [277, 296, 289, 198],
      [292, 296, 313, 202], [309, 291, 330, 262]
    ],
    chibai: [
      "M 236 296 C 228 262 224 230 226 200",
      "M 324 296 C 332 262 334 230 332 200",
      "M 331 232 C 344 240 356 244 370 240"
    ]
  };

  var LABEL_GAP = 19;   // 同一子欄相鄰標籤最小垂直間距
  var MIN_ROW = 12;     // 跨子欄的最小列距（避免兩條線的水平段共線重疊）
  var MAX_SHIFT = 40;   // 位移上限；超過就改換子欄，不再往下推
  var JOG = 9;          // 與外側點同高時的起步小垂直段
  var TIE_EPS = 6;      // y 差距小於這個值視為同一列

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
  function yToCun(y) {
    var a = P.axis, i;
    for (i = 0; i < a.length - 1; i++) {
      if (y >= Math.min(a[i].y, a[i + 1].y) && y <= Math.max(a[i].y, a[i + 1].y)) {
        return a[i].cun + (y - a[i].y) / (a[i + 1].y - a[i].y) * (a[i + 1].cun - a[i].cun);
      }
    }
    var s = y < a[0].y ? 0 : a.length - 2;
    return a[s].cun + (y - a[s].y) / (a[s + 1].y - a[s].y) * (a[s + 1].cun - a[s].cun);
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
  function mer(code) { return code.replace(/[0-9]+$/, ""); }
  function num(code) { return parseInt(code.replace(/\D/g, ""), 10); }

  /* ---------- 標註排版：雙子欄 + 專屬導引槽 ---------- */
  function packColumn(items) {
    [0, 1].forEach(function (s) {
      var prev = -1e9;
      items.filter(function (it) { return it.sub === s; })
        .forEach(function (it) { it.ly = Math.max(it.y, prev + LABEL_GAP); prev = it.ly; });
    });
    /* 跨子欄的最小列距：兩條牽引線的最後水平段若落在同一個 y，
       會在近欄標籤的 x 範圍內共線重疊（例如 0 寸的 PC7 與 HT7）。
       只向下推，維持與點相同的排序，交叉判定的前提不變。*/
    var prev2 = -1e9;
    items.slice().sort(function (a, b) { return a.ly - b.ly; })
      .forEach(function (it) { it.ly = Math.max(it.ly, prev2 + MIN_ROW); prev2 = it.ly; });
  }
  function layoutSide(items, cfg) {
    /* 先把 y 相近（<TIE_EPS）的穴歸成同一「列」，列內讓內側的排前面，
       它就會拿到最外側的導引槽；配合它起步的向上小垂直段，
       外側那條的水平短線不會撞進它的導引槽——這是把交叉數壓到 0 的關鍵。
       只用 y 排序不夠：HT8 與 PC8 差 2px，不算同 y 卻已互相干擾。*/
    items.sort(function (a, b) { return a.y - b.y; });
    var rows = [], cur = [];
    items.forEach(function (it) {
      if (!cur.length || it.y - cur[cur.length - 1].y < TIE_EPS) cur.push(it);
      else { rows.push(cur); cur = [it]; }
    });
    if (cur.length) rows.push(cur);
    rows.forEach(function (r) { r.sort(function (a, b) { return cfg.dir < 0 ? b.x - a.x : a.x - b.x; }); });
    var ordered = [];
    rows.forEach(function (r) { r.forEach(function (it) { ordered.push(it); }); });
    items = ordered;
    items.forEach(function (it, i) { it.sub = i % 2; });   // 相鄰標籤交錯放兩個子欄
    packColumn(items);
    var pass;
    for (pass = 0; pass < 8; pass++) {                      // 位移超過上限就換欄再排
      var bad = items.filter(function (it) { return it.ly - it.y > MAX_SHIFT; });
      if (!bad.length) break;
      bad[0].sub = 1 - bad[0].sub;
      packColumn(items);
    }
    /* 導引槽 x：**依最終標籤 y（ly）排序**由外而內單調配置。
       不能用點的 y —— 標籤推擠後兩者順序會不一致，一不一致就出現交叉。
       ly 單調 ⇒ 任一條的最後水平段永遠只會經過 ly 比它小的槽，
       而那些槽的垂直段最大值就是它們自己的 ly，故不可能落在同一高度。*/
    items.slice().sort(function (a, b) { return a.ly - b.ly; })
      .forEach(function (it, i) { it.gx = cfg.gut0 + i * cfg.gutStep; });
    items.forEach(function (it) {
      it.labelX = it.sub === 0 ? cfg.near : cfg.far;
      it.jogY = null;
    });
    /* 與外側同高的點（例如 0 寸的 PC7 與 HT7）要先走一小段垂直，
       否則它的水平短線會直接穿過對方的穴點。抖動方向不能寫死，
       必須同時滿足兩個條件，讓程式自己挑： */
    function spanOf(o) {
      var s = o.jogY === null ? o.y : o.jogY;
      return [Math.min(s, o.ly), Math.max(s, o.ly)];
    }
    items.forEach(function (it) {
      var tie = items.some(function (o) {
        return o !== it && Math.abs(o.y - it.y) < TIE_EPS &&
          (cfg.dir < 0 ? o.x < it.x - 4 : o.x > it.x + 4);
      });
      if (!tie) return;
      // 內側者：導引槽比我更靠近肢體，我的水平短線會經過它們的垂直段
      var inward = items.filter(function (o) { return o !== it && (o.gx - it.gx) * cfg.dir < 0; });
      // 外側者：導引槽比我更外面，它們的水平短線會經過我的垂直段
      var outward = items.filter(function (o) { return o !== it && (o.gx - it.gx) * cfg.dir > 0; });
      function ok(yy) {
        if (items.some(function (o) { return o !== it && Math.abs(o.y - yy) < TIE_EPS; })) return false;
        if (inward.some(function (o) { var s = spanOf(o); return yy >= s[0] - 0.5 && yy <= s[1] + 0.5; })) return false;
        var lo = Math.min(yy, it.ly), hi = Math.max(yy, it.ly);
        return !outward.some(function (o) {
          var sy = o.jogY === null ? o.y : o.jogY;
          return sy >= lo - 0.5 && sy <= hi + 0.5;
        });
      }
      var cands = [it.y - JOG, it.y + JOG, it.y - 2 * JOG, it.y + 2 * JOG, it.y - 3 * JOG, it.y + 3 * JOG];
      for (var k = 0; k < cands.length; k++) { if (ok(cands[k])) { it.jogY = cands[k]; break; } }
      if (it.jogY === null) it.jogY = it.y - JOG;
    });
    return items;
  }
  function leaderPath(it, cfg) {
    var pts = [[it.x, it.y]];
    var hy = it.y;
    if (it.jogY !== null) { pts.push([it.x, it.jogY]); hy = it.jogY; }
    pts.push([it.gx, hy]);                 // 水平短線 → 導引槽
    pts.push([it.gx, it.ly]);              // 導引槽內垂直
    pts.push([it.labelX + (cfg.dir < 0 ? 6 : -6), it.ly]); // 轉水平接標籤
    return pts;
  }
  function computeLayout() {
    var R = {}, sides = { L: [], R: [] };
    P.pts.forEach(function (p) {
      var r = resolve(p); R[p.code] = r;
      sides[p.col].push({ code: p.code, x: r.x, y: r.y });
    });
    var leaders = [];
    Object.keys(sides).forEach(function (k) {
      layoutSide(sides[k], P.cols[k]).forEach(function (it) {
        leaders.push({ code: it.code, side: k, item: it, pts: leaderPath(it, P.cols[k]) });
      });
    });
    return { coords: R, sides: sides, leaders: leaders };
  }

  /* ---------- SVG ---------- */
  var NS = "http://www.w3.org/2000/svg";
  function el(n, a) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); return e; }
  function txt(x, y, s, a) { var t = el("text", a || {}); t.setAttribute("x", x); t.setAttribute("y", y); t.textContent = s; return t; }

  var SKIN = "rgba(255,255,255,.04)", EDGE = "#5b5070", DASH = "#6d5f7e",
      MARK = "#8d7f9e", BG = "#1d1730";

  // 標誌名一律加底色塊，避免壓在圖形或牽引線上看不清
  function markLabel(svg, x, y, s) {
    var w = s.length * 11 + 8;
    svg.appendChild(el("rect", { x: x - 4, y: y - 12, width: w, height: 16, rx: 3, fill: BG, "fill-opacity": .92 }));
    svg.appendChild(txt(x, y, s, { fill: MARK, "font-size": 11 }));
  }

  function build(state) {
    state = state || { mer: "ALL", sel: null };
    var L = computeLayout();
    var svg = el("svg", {
      xmlns: NS, viewBox: P.viewBox.join(" "), width: P.viewBox[2], height: P.viewBox[3],
      "font-family": "'微軟正黑體','Microsoft JhengHei','PingFang TC','Noto Sans TC',sans-serif",
      role: "img", "aria-label": "上肢屈側經穴定位圖"
    });
    svg.appendChild(el("rect", { x: P.viewBox[0], y: 0, width: P.viewBox[2], height: P.viewBox[3], fill: BG }));

    // 前臂與上臂
    svg.appendChild(el("path", {
      d: "M 320 300 C 334 360 344 500 342 640 C 341 712 350 786 356 830 " +
         "L 204 830 C 210 786 219 712 218 640 C 216 500 226 360 240 300 Z",
      fill: SKIN, stroke: EDGE, "stroke-width": 1.6, "stroke-linejoin": "round"
    }));
    // 四指（先畫，指根被手掌蓋住）
    P.fingers.forEach(function (f) {
      svg.appendChild(el("rect", {
        x: f[0], y: f[2], width: f[1] - f[0], height: 206 - f[2],
        rx: (f[1] - f[0]) / 2, fill: SKIN, stroke: EDGE, "stroke-width": 1.4
      }));
    });
    svg.appendChild(el("path", { d: P.thumbPath, fill: SKIN, stroke: EDGE, "stroke-width": 1.5, "stroke-linejoin": "round" }));
    svg.appendChild(el("path", { d: P.palmPath, fill: "#242038", stroke: EDGE, "stroke-width": 1.6, "stroke-linejoin": "round" }));
    P.metacarpals.forEach(function (m) {
      svg.appendChild(el("line", { x1: m[0], y1: m[1], x2: m[2], y2: m[3], stroke: EDGE, "stroke-width": 1, "stroke-opacity": .75, "stroke-dasharray": "5 4" }));
    });
    P.chibai.forEach(function (d) {
      svg.appendChild(el("path", { d: d, fill: "none", stroke: "#c9a227", "stroke-opacity": .55, "stroke-width": 1.2, "stroke-dasharray": "2 4" }));
    });

    // 圖例（右上空白處）
    svg.appendChild(el("line", { x1: 436, y1: 56, x2: 452, y2: 56, stroke: "#c9a227", "stroke-opacity": .55, "stroke-width": 1.2, "stroke-dasharray": "2 4" }));
    svg.appendChild(txt(458, 60, "赤白肉際", { fill: "#c9a227", "fill-opacity": .85, "font-size": 11 }));
    svg.appendChild(el("line", { x1: 436, y1: 80, x2: 452, y2: 80, stroke: EDGE, "stroke-opacity": .75, "stroke-width": 1, "stroke-dasharray": "5 4" }));
    svg.appendChild(txt(458, 84, "掌骨 1–5", { fill: MARK, "font-size": 11 }));

    // 掌指關節
    svg.appendChild(el("line", { x1: P.mcp.l - 30, y1: P.mcp.y, x2: P.mcp.r + 30, y2: P.mcp.y, stroke: DASH, "stroke-width": 1.2, "stroke-dasharray": "3 3" }));
    markLabel(svg, P.mcp.l - 38, P.mcp.y - 6, P.mcp.label);

    // 寸刻度
    var rl = P.ruler, g = el("g", {});
    g.appendChild(txt(rl.numX, 288, "寸", { fill: MARK, "font-size": 11, "text-anchor": "end" }));
    var c;
    for (c = P.ticks.from; c <= P.ticks.to; c += P.ticks.step) addTick(g, c);
    addTick(g, 21);
    g.appendChild(el("line", { x1: rl.axisX, y1: cunToY(0), x2: rl.axisX, y2: cunToY(21), stroke: EDGE, "stroke-width": 1 }));
    svg.appendChild(g);
    function addTick(gg, cun) {
      var ty = cunToY(cun);
      gg.appendChild(el("line", { x1: rl.t1, y1: ty, x2: rl.t2, y2: ty, stroke: EDGE, "stroke-width": 1 }));
      gg.appendChild(txt(rl.numX, ty + 3.5, String(cun), { fill: MARK, "font-size": 10, "text-anchor": "end" }));
    }

    // 標誌線（虛線橫貫＋名稱）
    P.axis.forEach(function (m) {
      var ed = edgeAt(m.y);
      svg.appendChild(el("line", { x1: ed[0] - 40, y1: m.y, x2: ed[1] + 40, y2: m.y, stroke: DASH, "stroke-width": 1.2, "stroke-dasharray": "3 3" }));
      markLabel(svg, ed[0] - 38, m.y - 6, m.label);
    });

    // 經脈連線
    P.order.forEach(function (m) {
      var seq = P.pts.filter(function (p) { return mer(p.code) === m; })
        .sort(function (a, b) { return num(a.code) - num(b.code); });
      var d = "", k;
      for (k = 0; k < seq.length; k++) d += (k ? " L " : "M ") + L.coords[seq[k].code].x.toFixed(1) + " " + L.coords[seq[k].code].y.toFixed(1);
      svg.appendChild(el("path", {
        d: d, fill: "none", stroke: MER[m].c, "stroke-width": 1.6,
        "stroke-opacity": (state.mer !== "ALL" && state.mer !== m) ? .12 : .5
      }));
    });

    // 導引槽邊緣的刻痕：標記每個穴點的「真實 y」
    Object.keys(L.sides).forEach(function (k) {
      var cfg = P.cols[k];
      L.sides[k].forEach(function (it) {
        svg.appendChild(el("line", {
          x1: cfg.notchX, y1: it.y, x2: cfg.notchX + cfg.dir * 4, y2: it.y,
          stroke: MER[mer(it.code)].c, "stroke-width": 1.6, "stroke-opacity": .85
        }));
      });
    });

    // 穴位點＋穴名＋直角牽引線
    L.leaders.forEach(function (ld) {
      var it = ld.item, cfg = P.cols[ld.side], m = mer(it.code);
      var dim = (state.mer !== "ALL" && state.mer !== m);
      var gg = el("g", {
        "class": "acu-pt" + (state.sel === it.code ? " sel" : ""),
        "data-code": it.code, tabindex: "0", role: "button",
        "aria-label": NAME[it.code] + " " + it.code,
        opacity: dim ? .18 : 1, style: "cursor:pointer"
      });
      gg.appendChild(el("path", {
        d: ld.pts.map(function (q, i) { return (i ? "L " : "M ") + q[0].toFixed(2) + " " + q[1].toFixed(2); }).join(" "),
        fill: "none", stroke: MER[m].c, "stroke-width": 1, "stroke-opacity": .6,
        "stroke-linejoin": "round", "stroke-linecap": "butt"
      }));
      gg.appendChild(txt(it.labelX, it.ly + 4, NAME[it.code], { fill: "#e6ddc8", "font-size": 13, "text-anchor": cfg.anchor }));
      var off = NAME[it.code].length * 13 + 6;
      gg.appendChild(txt(cfg.anchor === "end" ? it.labelX - off : it.labelX + off, it.ly + 4, it.code,
        { fill: "#a396b5", "font-size": 10, "text-anchor": cfg.anchor }));
      if (OFFAXIS[it.code]) {
        gg.appendChild(txt(it.labelX, it.ly + 18, OFFAXIS[it.code],
          { fill: MARK, "font-size": 10, "text-anchor": cfg.anchor }));
      }
      gg.appendChild(el("circle", { cx: it.x, cy: it.y, r: 4.6, fill: MER[m].c, stroke: "#140f1e", "stroke-width": 1.4 }));
      gg.appendChild(el("circle", { cx: it.x, cy: it.y, r: 22, fill: "transparent" })); // 44px 觸控區
      svg.appendChild(gg);
    });

    svg.appendChild(txt(P.viewBox[0] + 12, 872, P.caption, { fill: MARK, "font-size": 11 }));
    return svg;
  }

  /* ---------- 驗收自檢 ---------- */
  function onSeg(p, q, r) {
    return Math.min(p[0], r[0]) - 1e-9 <= q[0] && q[0] <= Math.max(p[0], r[0]) + 1e-9 &&
           Math.min(p[1], r[1]) - 1e-9 <= q[1] && q[1] <= Math.max(p[1], r[1]) + 1e-9;
  }
  function orient(p, q, r) {
    var v = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
    return Math.abs(v) < 1e-9 ? 0 : (v > 0 ? 1 : 2);
  }
  function segCross(p1, q1, p2, q2) {
    var o1 = orient(p1, q1, p2), o2 = orient(p1, q1, q2),
        o3 = orient(p2, q2, p1), o4 = orient(p2, q2, q1);
    if (o1 !== o2 && o3 !== o4) return true;
    if (o1 === 0 && onSeg(p1, p2, q1)) return true;   // 共線重疊也算
    if (o2 === 0 && onSeg(p1, q2, q1)) return true;
    if (o3 === 0 && onSeg(p2, p1, q2)) return true;
    if (o4 === 0 && onSeg(p2, q1, q2)) return true;
    return false;
  }
  function audit() {
    var L = computeLayout();
    // ① 牽引線兩兩交叉檢查
    var segs = [];
    L.leaders.forEach(function (ld, li) {
      for (var i = 0; i < ld.pts.length - 1; i++) segs.push({ li: li, a: ld.pts[i], b: ld.pts[i + 1] });
    });
    var crossings = [], i, j;
    for (i = 0; i < segs.length; i++) {
      for (j = i + 1; j < segs.length; j++) {
        if (segs[i].li === segs[j].li) continue;
        if (segCross(segs[i].a, segs[i].b, segs[j].a, segs[j].b)) {
          crossings.push(L.leaders[segs[i].li].code + " × " + L.leaders[segs[j].li].code);
        }
      }
    }
    // ② 端點是否精確落在穴點圓心
    var endMax = 0;
    L.leaders.forEach(function (ld) {
      var c = L.coords[ld.code], p = ld.pts[0];
      endMax = Math.max(endMax, Math.hypot(p[0] - c.x, p[1] - c.y));
    });
    // ③ 標籤與穴點的垂直落差
    var offMax = 0, offCode = "";
    L.leaders.forEach(function (ld) {
      var d = Math.abs(ld.item.ly - ld.item.y);
      if (d > offMax) { offMax = d; offCode = ld.code; }
    });
    // 換算成寸：用腕→肘段的 px/寸（28.33 px/寸）
    var pxPerCun = (cunToY(12) - cunToY(0)) / 12;
    // ④ 座標清單（供與前一版逐筆比對）
    var coords = {};
    Object.keys(L.coords).forEach(function (k) {
      coords[k] = [+L.coords[k].x.toFixed(4), +L.coords[k].y.toFixed(4)];
    });
    return {
      points: P.pts.length,
      leaderCrossings: crossings.length,
      crossingPairs: crossings,
      endpointMaxDistPx: +endMax.toFixed(6),
      maxLabelOffsetPx: +offMax.toFixed(2),
      maxLabelOffsetCun: +(offMax / pxPerCun).toFixed(3),
      maxLabelOffsetAt: offCode,
      pxPerCunForearm: +pxPerCun.toFixed(4),
      segments: segs.length,
      coords: coords
    };
  }

  /* ---------- 對外 ---------- */
  root.ARM_INNER = {
    panel: P, MER: MER, NAME: NAME, LOC: LOC,
    build: build, cunToY: cunToY, yToCun: yToCun, resolve: resolve,
    computeLayout: computeLayout, audit: audit,
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
