/* viz.js — rendering functions for Measured Aesthetic v2
   Requires: components/data.js loaded first
   Exports to window: buildRadial, buildGallery, buildBrightnessViz, buildDirectionViz, openHoverPanel
*/

const SVG_NS = 'http://www.w3.org/2000/svg';
const CX = 350, CY = 350;
const INNER_R = 90, MAX_BAR = 168, MIN_BAR = 24;
const BAR_DEG = 2.9, GAP_DEG = 0.7, BAR_W = 5.5;
const MIN_B = 0.240, MAX_B = 0.752;
const SEG_COLS = { t:'#c87878', g:'#7890c8', d:'#c89460', c:'#68b890', s:'#98c068' };
const DOM_COLS = { centre_axis:'#68b890', golden_ratio:'#7890c8', rule_of_thirds:'#c87878', diagonal:'#c89460' };

function barLen(b) { return MIN_BAR + ((b-MIN_B)/(MAX_B-MIN_B))*(MAX_BAR-MIN_BAR); }
function brightGrey(b) { const v=Math.round(28+b*200); return `rgb(${v},${v},${v})`; }
function clamp01(v) { return Math.max(0,Math.min(1,v)); }

/* ── RADIAL ── */
function makeGreyBar(img, i) {
  const angle = -90 + i*(BAR_DEG+GAP_DEG);
  const len = barLen(img.b);
  const g = document.createElementNS(SVG_NS,'g');
  g.setAttribute('transform',`rotate(${angle},${CX},${CY})`);
  g.style.opacity = '0';
  g.style.transition = 'opacity 0.12s ease';
  const r = document.createElementNS(SVG_NS,'rect');
  r.setAttribute('x', CX-BAR_W/2); r.setAttribute('y', CY-INNER_R-len);
  r.setAttribute('width', BAR_W); r.setAttribute('height', len);
  r.setAttribute('fill', brightGrey(img.b)); r.setAttribute('rx','1.5');
  g.appendChild(r);
  return g;
}

function makeColoredBar(img, i) {
  const angle = -90 + i*(BAR_DEG+GAP_DEG);
  const g = document.createElementNS(SVG_NS,'g');
  g.setAttribute('transform',`rotate(${angle},${CX},${CY})`);
  g.setAttribute('class','c-bar'); g.setAttribute('data-idx', i);
  const segs = [{v:img.t,col:SEG_COLS.t},{v:img.g,col:SEG_COLS.g},
                {v:img.d,col:SEG_COLS.d},{v:img.c,col:SEG_COLS.c},{v:img.s,col:SEG_COLS.s}];
  const total = segs.reduce((s,x)=>s+x.v,0);
  const maxT = 310, totalLen = Math.min((total/maxT)*MAX_BAR, MAX_BAR);
  let cum = 0;
  segs.forEach(({v,col}) => {
    const sLen = (v/total)*totalLen;
    const r = document.createElementNS(SVG_NS,'rect');
    r.setAttribute('x',CX-BAR_W/2); r.setAttribute('y',CY-INNER_R-cum-sLen);
    r.setAttribute('width',BAR_W); r.setAttribute('height',sLen);
    r.setAttribute('fill',col); r.setAttribute('rx','0.5');
    g.appendChild(r); cum += sLen;
  });
  const hit = document.createElementNS(SVG_NS,'rect');
  hit.setAttribute('x',CX-BAR_W-3); hit.setAttribute('y',CY-INNER_R-totalLen-4);
  hit.setAttribute('width',BAR_W*2+6); hit.setAttribute('height',totalLen+6);
  hit.setAttribute('fill','rgba(0,0,0,0)'); hit.setAttribute('pointer-events','all');
  g.appendChild(hit);
  return g;
}

function buildRadial(greyG, colorG) {
  IMAGE_DATA.forEach((img,i) => {
    greyG.appendChild(makeGreyBar(img,i));
    colorG.appendChild(makeColoredBar(img,i));
  });
}

/* ── HOVER PANEL ── */
function openHoverPanel(panel, img) {
  if (!panel || !img) return;
  const domLabel = img.dom.replace(/_/g,' ');
  const domCol   = DOM_COLS[img.dom] || '#888';

  const outputs = outputSet(img);
  panel.innerHTML = `
    <div class="hp-id">image_${img.i}</div>
    <div class="hp-images">
      <div class="hp-img-wrap">
        <img src="${outputs.original}" alt="" class="hp-img" onerror="this.style.display='none'">
        <div class="hp-img-fallback">
          <span class="hp-img-num">${img.i}</span>
          <span class="hp-img-type">film</span>
        </div>
      </div>
      <div class="hp-img-wrap">
        <img src="${outputs.gridOverlay}" alt="" class="hp-img" onerror="this.style.display='none'">
        <div class="hp-img-fallback">
          <span class="hp-img-num">${img.i}</span>
          <span class="hp-img-type">grid overlay</span>
        </div>
      </div>
    </div>
    <div class="hp-dom" style="color:${domCol}">${domLabel}</div>
    <div class="hp-rule"></div>
    <div class="hp-rows">
      ${hpRow('brightness', pct(img.b))}
      ${hpRow('symmetry', `${img.s.toFixed(1)} / 100`)}
      ${hpRow('light entry', img.l)}
      ${hpRow('CoG', `(${img.x.toFixed(3)}, ${img.y.toFixed(3)})`)}
      <div class="hp-rule-sm"></div>
      ${hpRow('thirds', img.t.toFixed(1))}
      ${hpRow('golden', img.g.toFixed(1))}
      ${hpRow('diagonal', img.d.toFixed(1))}
      ${hpRow('centre', img.c.toFixed(1))}
    </div>
    <p class="hp-click-hint">click bar to open →</p>`;
  panel.classList.add('open');
}
function hpRow(k,v) { return `<div class="hp-row"><span class="hp-key">${k}</span><span class="hp-val">${v}</span></div>`; }
function pct(v) { return `${Math.round(v*100)}%`; }

function closeHoverPanel(panel) { if (panel) panel.classList.remove('open'); }

/* ── GALLERY ── */
const FILTERS = ['all','centre_axis','golden_ratio','rule_of_thirds','diagonal'];

function buildGallery(wrap) {
  // Filter bar
  const fb = document.createElement('div'); fb.className='gal-filters';
  FILTERS.forEach(f => {
    const b = document.createElement('button');
    b.className = 'gal-filter' + (f==='all'?' active':'');
    b.textContent = f==='all' ? 'all 100' : f.replace(/_/g,' ');
    b.dataset.filter = f;
    b.addEventListener('click', () => {
      document.querySelectorAll('.gal-filter').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      filterGallery(f);
    });
    fb.appendChild(b);
  });
  wrap.appendChild(fb);

  // Grid
  const grid = document.createElement('div'); grid.className='gal-grid'; grid.id='gal-grid';
  IMAGE_DATA.forEach((img,i) => {
    const card = document.createElement('div');
    card.className='gal-card'; card.dataset.dom=img.dom; card.dataset.idx=i;
    const col = DOM_COLS[img.dom]||'#888';
    card.innerHTML = `
      <div class="gal-img-wrap" style="background:#f0f0f0">
        <img src="${filmSrc(img)}" alt="" class="gal-img" loading="lazy" onerror="this.style.display='none'">
        <span class="gal-num">${img.i}</span>
      </div>
      <div class="gal-meta">
        <span class="gal-dot" style="background:${col}"></span>
        <span class="gal-dom">${img.dom.replace(/_/g,' ')}</span>
        <span class="gal-b">${pct(img.b)}</span>
      </div>`;
    card.addEventListener('click', () => openGalleryModal(img));
    grid.appendChild(card);
  });
  wrap.appendChild(grid);

  // Modal
  const modal = document.createElement('div'); modal.id='gal-modal'; modal.className='gal-modal';
  modal.innerHTML = `<div class="gal-modal-inner" id="gal-modal-inner"></div>`;
  modal.addEventListener('click', e => { if(e.target===modal) modal.classList.remove('open'); });
  document.body.appendChild(modal);
}

function filterGallery(f) {
  document.querySelectorAll('.gal-card').forEach(c => {
    c.style.display = (f==='all'||c.dataset.dom===f) ? '' : 'none';
  });
}

function openGalleryModal(img) {
  const col = DOM_COLS[img.dom]||'#888';
  const modal = document.getElementById('gal-modal');
  const inner = document.getElementById('gal-modal-inner');
  if (!modal||!inner) return;
  const outputs = outputSet(img);
  const slides = [
    { key: '01', label: 'original', src: outputs.original },
    { key: '02', label: 'dot grid', src: outputs.dotGrid },
    { key: '03', label: 'composition diagram', src: outputs.compDiagram },
    { key: '04', label: 'grid overlay', src: outputs.gridOverlay },
    { key: '05', label: 'colour grid', src: outputs.colourGrid }
  ];
  const isTextSlide = (idx) => false;
  inner.innerHTML = `
    <button class="gal-modal-close" onclick="document.getElementById('gal-modal').classList.remove('open')">close ×</button>
    <div class="gal-modal-id">image_${img.i}</div>
    <div class="gal-modal-viewer">
      <button class="gal-nav" id="gal-prev">← prev</button>
      <div class="gal-modal-stage">
        <div class="gal-modal-imgwrap">
          <img src="" alt="" class="gal-modal-img" id="gal-modal-img" onerror="this.style.display='none';document.getElementById('gal-modal-fallback').style.display='flex'">
          <iframe id="gal-modal-text" class="gal-modal-text" title="data card"></iframe>
          <div class="gal-modal-fallback" id="gal-modal-fallback"><span>${img.i}</span><span>output unavailable</span></div>
        </div>
        <p class="gal-modal-caption" id="gal-modal-caption"></p>
      </div>
      <button class="gal-nav" id="gal-next">next →</button>
    </div>
  `;
  let current = 0;
  const imgEl = inner.querySelector('#gal-modal-img');
  const txtEl = inner.querySelector('#gal-modal-text');
  const capEl = inner.querySelector('#gal-modal-caption');
  const fallbackEl = inner.querySelector('#gal-modal-fallback');
  const render = () => {
    const slide = slides[current];
    capEl.textContent = `${slide.key} · ${slide.label}`;
    fallbackEl.style.display = 'none';
    if (isTextSlide(current)) {
      imgEl.style.display = 'none';
      txtEl.style.display = 'block';
      txtEl.src = slide.src;
    } else {
      txtEl.style.display = 'none';
      txtEl.src = 'about:blank';
      imgEl.style.display = 'block';
      imgEl.src = slide.src;
    }
  };
  inner.querySelector('#gal-prev').addEventListener('click', () => {
    current = (current - 1 + slides.length) % slides.length;
    render();
  });
  inner.querySelector('#gal-next').addEventListener('click', () => {
    current = (current + 1) % slides.length;
    render();
  });
  render();
  modal.classList.add('open');
}
function modalRow(k,v) { return `<div class="gal-mrow"><span class="gal-mk">${k}</span><span class="gal-mv">${v}</span></div>`; }

/* ── VIZ PREVIEW (single relevant output + scoring) ── */
function openVizPreview(img, outputKey, context) {
  const outputs = outputSet(img);
  const src = outputs[outputKey];
  const col = DOM_COLS[img.dom] || '#888';
  const modal = document.getElementById('gal-modal');
  const inner = document.getElementById('gal-modal-inner');
  if (!modal || !inner) return;
  const labelMap = { dotGrid:'dot grid', gridOverlay:'grid overlay', colourGrid:'colour grid', original:'original', compDiagram:'comp diagram' };

  let rowData;
  if (context === 'light') {
    rowData = [
      ['brightness',   pct(img.b)],
      ['light entry',  img.l]
    ];
  } else if (context === 'cog') {
    rowData = [
      ['CoG',      '(' + img.x.toFixed(3) + ', ' + img.y.toFixed(3) + ')'],
      ['symmetry', img.s.toFixed(1) + ' / 100'],
      ['dominant', img.dom.replace(/_/g,' ')]
    ];
  } else if (context === 'grid') {
    rowData = [
      ['dominant', img.dom.replace(/_/g,' ')],
      ['thirds',   img.t.toFixed(1)],
      ['golden',   img.g.toFixed(1)],
      ['diagonal', img.d.toFixed(1)],
      ['centre',   img.c.toFixed(1)]
    ];
  } else if (context === 'saturation') {
    const idx = IMAGE_DATA.indexOf(img);
    const satRaw = (typeof SAT_POSITIONS !== 'undefined' && idx >= 0) ? SAT_POSITIONS[idx][0] : null;
    rowData = [
      ['dominant',   img.dom.replace(/_/g,' ')],
      ['brightness', pct(img.b)],
      ...(satRaw !== null ? [['saturation', Math.round(satRaw) + '%']] : []),
      ['light entry', img.l]
    ];
  } else {
    rowData = [
      ['brightness', pct(img.b)],
      ['symmetry',   img.s.toFixed(1) + ' / 100'],
      ['light entry', img.l],
      ['CoG',        '(' + img.x.toFixed(3) + ', ' + img.y.toFixed(3) + ')'],
      ['dominant',   img.dom.replace(/_/g,' ')],
      ['thirds',     img.t.toFixed(1)],
      ['golden',     img.g.toFixed(1)],
      ['diagonal',   img.d.toFixed(1)],
      ['centre',     img.c.toFixed(1)]
    ];
  }
  const rows = rowData.map(([k,v]) => modalRow(k,v)).join('');
  inner.innerHTML = `
    <button class="gal-modal-close" onclick="document.getElementById('gal-modal').classList.remove('open')">close ×</button>
    <div class="gal-modal-id" style="margin-bottom:20px">image_${img.i}</div>
    <div class="gal-modal-imgwrap" style="margin-bottom:10px">
      <img src="${src}" alt="" class="gal-modal-img" onerror="this.style.display='none'">
    </div>
    <p class="gal-modal-caption" style="margin-bottom:20px">${labelMap[outputKey] || outputKey}</p>
    <div class="gal-modal-data">${rows}</div>`;
  modal.classList.add('open');
}

/* ── BRIGHTNESS VIZ (sorted horizontal bars + hover) ── */
let _brightnessTooltip = null;

function buildBrightnessViz(wrap) {
  const sorted = [...IMAGE_DATA].sort((a,b)=>a.b-b.b);
  const SVG_W = Math.min(window.innerWidth-160, 900), SVG_H = 180;
  const svg = document.createElementNS(SVG_NS,'svg');
  svg.setAttribute('viewBox',`0 0 ${SVG_W} ${SVG_H}`);
  svg.setAttribute('width','100%'); svg.setAttribute('height',SVG_H);
  svg.style.overflow='visible'; svg.style.cursor='default';
  const bw = SVG_W/100 - 1.2;

  // Tooltip div
  const tip = document.createElement('div');
  tip.style.cssText='position:fixed;background:#0d0d0d;color:#fff;font-family:Courier New,monospace;font-size:10px;letter-spacing:.06em;line-height:1.6;padding:10px 14px;pointer-events:none;opacity:0;transition:opacity .15s;z-index:400;border:none;white-space:nowrap';
  document.body.appendChild(tip);
  _brightnessTooltip = tip;

  sorted.forEach((img,i) => {
    const barH = 28 + (img.b/MAX_B)*130;
    const x = i*(bw+1.2);
    const v = Math.round(28+img.b*200);
    const col = DOM_COLS[img.dom]||'#888';

    // Hit target (slightly wider, full height for easier hover)
    const hit = document.createElementNS(SVG_NS,'rect');
    hit.setAttribute('x',x-1); hit.setAttribute('y',0);
    hit.setAttribute('width',bw+2); hit.setAttribute('height',SVG_H);
    hit.setAttribute('fill','rgba(0,0,0,0)');
    hit.setAttribute('pointer-events','all');
    svg.appendChild(hit);

    // Bar
    const rect = document.createElementNS(SVG_NS,'rect');
    rect.setAttribute('x',x); rect.setAttribute('y',SVG_H-barH);
    rect.setAttribute('width',bw); rect.setAttribute('height',barH);
    rect.setAttribute('fill',`rgb(${v},${v},${v})`); rect.setAttribute('rx','1');
    rect.style.transition='opacity .1s';
    svg.appendChild(rect);

    // Hover events on hit target
    hit.addEventListener('mouseenter', e => {
      // Dim all bars, highlight this one
      svg.querySelectorAll('rect[rx]').forEach((r,ri) => {
        r.style.opacity = ri===i ? '1' : '0.2';
      });
      // Show coloured highlight on hovered bar
      rect.setAttribute('fill', col);
      // Tooltip
      tip.innerHTML = `image_${img.i}&nbsp;&nbsp;<span style="color:${col}">${img.dom.replace(/_/g,' ')}</span><br>brightness ${Math.round(img.b*100)}%&nbsp;&nbsp;symmetry ${img.s.toFixed(0)}/100<br>light entry: ${img.l}`;
      tip.style.opacity='1';
      moveTip(e);
    });
    hit.addEventListener('mousemove', moveTip);
    hit.addEventListener('mouseleave', () => {
      svg.querySelectorAll('rect[rx]').forEach(r => {
        r.style.opacity='1';
        // restore grey fill based on position in sorted array
      });
      // Restore all fills
      svg.querySelectorAll('rect[rx]').forEach((r,ri) => {
        const imgR = sorted[ri];
        const vR = Math.round(28+imgR.b*200);
        r.setAttribute('fill',`rgb(${vR},${vR},${vR})`);
        r.style.opacity='1';
      });
      tip.style.opacity='0';
    });
  });

  wrap.appendChild(svg);
}

function moveTip(e) {
  if (!_brightnessTooltip) return;
  _brightnessTooltip.style.left = (e.clientX+14)+'px';
  _brightnessTooltip.style.top  = (e.clientY-36)+'px';
}

/* ── DIRECTION VIZ (compass petal) ── */
function buildDirectionViz(wrap) {
  const CX2=120,CY2=120,mx=56,svg=document.createElementNS(SVG_NS,'svg');
  svg.setAttribute('viewBox','0 0 240 240'); svg.setAttribute('width','240'); svg.setAttribute('height','240');
  const dirs=[{l:'top',v:56,a:-90},{l:'right',v:17,a:0},{l:'bottom',v:14,a:90},{l:'left',v:13,a:180}];
  dirs.forEach(({v,a})=>{
    const r=(v/mx)*88, rad=a*Math.PI/180;
    const x1=CX2+Math.cos(rad)*18, y1=CY2+Math.sin(rad)*18;
    const x2=CX2+Math.cos(rad)*r,  y2=CY2+Math.sin(rad)*r;
    const pw=4+(v/mx)*12;
    const line=document.createElementNS(SVG_NS,'line');
    line.setAttribute('x1',x1);line.setAttribute('y1',y1);
    line.setAttribute('x2',x2);line.setAttribute('y2',y2);
    line.setAttribute('stroke','#0d0d0d');line.setAttribute('stroke-width',pw);
    line.setAttribute('stroke-linecap','round');
    svg.appendChild(line);
  });
  dirs.forEach(({l,v,a})=>{
    const r=96, rad=a*Math.PI/180;
    const tx=CX2+Math.cos(rad)*r, ty=CY2+Math.sin(rad)*r;
    const t=document.createElementNS(SVG_NS,'text');
    t.setAttribute('x',tx);t.setAttribute('y',ty);
    t.setAttribute('text-anchor','middle');t.setAttribute('dominant-baseline','middle');
    t.setAttribute('font-size','9');t.setAttribute('font-family','Courier New,monospace');
    t.setAttribute('fill','#888');t.setAttribute('letter-spacing','0.06em');
    t.textContent=`${l} · ${v}`;
    svg.appendChild(t);
  });
  const circ=document.createElementNS(SVG_NS,'circle');
  circ.setAttribute('cx',CX2);circ.setAttribute('cy',CY2);circ.setAttribute('r','14');
  circ.setAttribute('fill','none');circ.setAttribute('stroke','#c8cad8');circ.setAttribute('stroke-width','1');
  svg.appendChild(circ);
  wrap.appendChild(svg);
}

/* Export to window */
Object.assign(window, {
  buildRadial, makeGreyBar, makeColoredBar,
  openHoverPanel, closeHoverPanel,
  buildGallery, openGalleryModal, filterGallery,
  openVizPreview,
  buildBrightnessViz, buildDirectionViz,
  barLen, brightGrey, clamp01,
  SEG_COLS, DOM_COLS, CX, CY, INNER_R, MAX_BAR, MIN_BAR, BAR_DEG, GAP_DEG, BAR_W, MIN_B, MAX_B
});
