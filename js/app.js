/* 墨西哥旅行工作台 · 页面逻辑。数据在 data/ 里，改内容一般不用动这个文件。 */
const ICON={
 transport:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="13" rx="3"/><path d="M4 10h16M8 20l-1 1M16 20l1 1M7.5 13h.01M16.5 13h.01"/></svg>',
 route:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7"/></svg>',
 food:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 2-2 6 0 8v10"/></svg>',
 hotel:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20V6M3 14h18v6M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="2"/></svg>'
};
const PINSVG='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z" fill="#EA4335"/><circle cx="12" cy="9" r="2.6" fill="#fff"/></svg>';

const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmtN=n=>Number(n).toLocaleString("en-US");
let filter="all";
const all=()=>P;
const gmapUrl=p=>{const g=p.g||{}; let u="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(g.q||p.es||p.cn); if(g.pid) u+="&query_place_id="+encodeURIComponent(g.pid); return u;};

/* ---------- illustrated placeholder pictures ---------- */
const TONES={island:["var(--sea)","#FDF6E9"],nearby:["var(--ochre)","#FFF4E2"],cdmx:["var(--rose)","#FFF1EF"],other:["var(--teal-soft)","#FFFFFF"]};
function art(p){
  const [c1]=TONES[p.region]||TONES.other;
  const sky=`<rect width="320" height="200" fill="${c1}"/><rect width="320" height="200" fill="url(#g${p.id})"/>`;
  const defs=`<defs><linearGradient id="g${p.id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>`;
  const M={
   beach:`<circle cx="250" cy="55" r="22" fill="#FFD27A"/><path d="M0 130 Q40 118 80 130 T160 130 T240 130 T320 130 V200 H0Z" fill="#3FA9B5" opacity=".75"/><path d="M0 150 Q40 140 80 150 T160 150 T240 150 T320 150 V200 H0Z" fill="#2B8C98" opacity=".8"/><path d="M0 175 H320 V200 H0Z" fill="#F4DDB1"/><path d="M70 175 q4-40 22-62 M92 113 q-18-6-30 4 M92 113 q16-10 30-2 M92 113 q-6 14-14 18" stroke="#5B7A3A" stroke-width="5" fill="none" stroke-linecap="round"/>`,
   ruin:`<circle cx="250" cy="50" r="20" fill="#FFD27A"/><path d="M90 170 h140 l-12-22 h-116z M102 148 h116 l-12-22 h-92z M114 126 h92 l-12-22 h-68z M126 104 h68 l-10-20 h-48z" fill="#C9A27A"/><rect x="146" y="64" width="28" height="20" fill="#B38A62"/><path d="M0 170 H320 V200 H0Z" fill="#9DBF7A"/>`,
   town:`<path d="M0 160 H320 V200 H0Z" fill="#E7C89E"/><rect x="40" y="110" width="50" height="50" fill="#F2A65A"/><rect x="95" y="100" width="40" height="60" fill="#5FB3A6"/><rect x="230" y="105" width="50" height="55" fill="#E86A5E"/><path d="M150 160 V80 l10-30 l10 30 V160z M180 160 V80 l10-30 l10 30 V160z" fill="#E59AA0"/><rect x="150" y="110" width="60" height="50" fill="#E59AA0"/><path d="M172 160 v-22 a8 8 0 0 1 16 0 v22z" fill="#8A4B50"/>`,
   lake:`<path d="M0 120 L60 70 L110 110 L170 50 L240 115 L320 80 V200 H0Z" fill="#7FA36A"/><path d="M0 140 H320 V200 H0Z" fill="#4FB0C0"/><path d="M30 160 h40 M120 172 h60 M220 158 h50" stroke="#fff" stroke-width="3" opacity=".7" stroke-linecap="round"/>`,
   park:`<path d="M0 150 H320 V200 H0Z" fill="#4FB0C0"/><circle cx="70" cy="110" r="34" fill="#5E9E54"/><circle cx="120" cy="96" r="30" fill="#6FB062"/><circle cx="250" cy="105" r="36" fill="#5E9E54"/><path d="M150 150 q30-50 60 0" stroke="#E86A5E" stroke-width="6" fill="none"/><circle cx="270" cy="45" r="18" fill="#FFD27A"/>`,
   museum:`<path d="M60 80 L160 40 L260 80Z" fill="#C9A27A"/><rect x="70" y="80" width="180" height="10" fill="#B38A62"/>${[85,125,165,205].map(x=>`<rect x="${x}" y="92" width="16" height="62" fill="#E8D4B8"/>`).join("")}<rect x="60" y="154" width="200" height="12" fill="#B38A62"/><path d="M0 166 H320 V200 H0Z" fill="#9DBF7A"/>`,
   house:`<rect x="70" y="80" width="180" height="90" fill="#2F6FD0"/><rect x="95" y="105" width="30" height="40" fill="#F2C14E"/><rect x="195" y="105" width="30" height="40" fill="#F2C14E"/><rect x="145" y="120" width="30" height="50" fill="#C0392B"/><path d="M0 170 H320 V200 H0Z" fill="#7FA36A"/><circle cx="40" cy="150" r="22" fill="#5E9E54"/>`,
   library:`${[0,1,2,3].map(i=>`<rect x="${40+i*62}" y="40" width="48" height="130" fill="#E8D4B8"/>${[0,1,2,3,4].map(j=>`<rect x="${44+i*62}" y="${48+j*24}" width="40" height="14" fill="${["#E86A5E","#5FB3A6","#F2A65A","#7A8FD0"][(i+j)%4]}"/>`).join("")}`).join("")}<path d="M60 120 q100-40 200 0" stroke="#fff" stroke-width="5" fill="none" opacity=".9"/>`
  };
  return `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${defs}${sky}${M[p.motif]||M.town}</svg>`;
}
/* 照片放在 images/<id>.jpg；没有照片的地点在 places.js 写 noPhoto:true，直接显示插画。 */
function picHTML(p){ if(p.noPhoto) return ART[p.id]; return `<img src="images/${esc(p.id)}.jpg" alt="${esc(p.es||p.cn)}" loading="lazy" onerror="this.replaceWith(document.createRange().createContextualFragment(ART[this.dataset.id]))" data-id="${esc(p.id)}">`; }
const ART={}; P.forEach(p=>ART[p.id]=art(p));

/* ---------- route ---------- */
let routeEnd="stay";
const legHTML=k=>{const l=LEGS[k];return `<li class="stop leg"><div class="when">${l.km}</div><div class="what"><h4>${l.title}</h4><div class="modes"><div class="mode"><b>${l.m1||"自驾"}</b><span class="t">${l.drive}</span><div>${linkify(l.driveNote,"",true)}</div></div><div class="mode"><b>${l.m2||"大巴"}</b><span class="t">${l.bus}</span><div>${linkify(l.busNote,"",true)}</div></div></div></div></li>`;};
const stopHTML=(w,t,b)=>`<li class="stop"><div class="when">${w}</div><div class="what"><h4>${t}</h4>${b?`<p>${linkify(b,"")}</p>`:""}</div></li>`;
function routeHTML(key){
  const R=ROUTES[key]; if(!R) return "";
  const end=R.options.some(o=>o[0]===routeEnd)?routeEnd:R.options[0][0];
  let h=`<div class="toggle" role="group" aria-label="天数">${R.options.map(([k,t])=>`<button data-end="${k}" aria-pressed="${end===k}">${t}</button>`).join("")}</div><ol class="tl">`;
  for(const s of R.stops){ if(s.only&&s.only!==end) continue; h+=stopHTML(s.when||"",s.title,(s.body||"")+(end==="stay"&&s.bodyStay?s.bodyStay:"")); }
  h+="</ol>"+(R.foot?`<p class="note">${R.foot}</p>`:"");
  return h;
}

/* ---------- cards ---------- */
function hasTab(p,k){const v=(GUIDE[p.id]||{})[k]; return Array.isArray(v)?v.length>0:!!v;}
function gmapHTML(p){
  const g=p.g||{};
  const rating=g.r?`<span class="star">${g.r} ★</span><em>(${fmtN(g.n)} 条)</em>`:"";
  return `<a class="gmap" href="${esc(gmapUrl(p))}" target="_blank" rel="noopener" title="在 Google 地图打开${g.q?"："+esc(g.q):""}">${PINSVG}<b>Google 地图</b>${rating}</a>`;
}
function card(p){
  const g=p.g||{};
  return `<article class="card" id="card-${esc(p.id)}">
   <div class="pic">${picHTML(p)}${g.r?`<span class="rate">★ ${g.r}</span>`:""}</div>
   <div class="body">
    <div class="meta"><span class="kind">${esc(p.kind||"地点")}</span><span>${esc(p.area||"")}</span></div>
    <h3><a class="name" href="#p-${esc(p.id)}">${esc(p.es||p.cn)}</a><small>${esc(p.cn)}</small></h3>
    <p class="desc">${esc(p.desc||"")}</p>
    <div class="src">${gmapHTML(p)}${p.site?`<a class="off" href="${esc(p.site)}" target="_blank" rel="noopener">官网</a>`:""}${g.r&&p.gnote?`<span>评分为「${esc(p.gnote)}」</span>`:""}</div>
    <div class="acts">${TABS.map(([k,t])=>`<button class="act${hasTab(p,k)?" has":" soon"}" data-open="${esc(p.id)}" data-tab="${k}"${hasTab(p,k)?"":` aria-label="${t}（整理中）"`}>${ICON[k]}${t}${hasTab(p,k)?"":`<i>整理中</i>`}</button>`).join("")}</div>
   </div></article>`;
}
function render(){
  const items=all();
  const tabs=[["all","全部"],["island","海岛游"],["nearby","周边 2 天游"],["cdmx","1 天墨城 CDMX"]];
  $("#pills").innerHTML=tabs.map(([k,t])=>`<button class="pill" data-f="${k}" aria-pressed="${filter===k}">${t}</button>`).join("");
  const done=items.filter(p=>TABS.every(([k])=>hasTab(p,k))).length;
  $("#stat").innerHTML=`已写好 <b>${done}</b> / ${items.length} 个地点`;
  let html="";
  /* 写好的地区排前面；海岛游写完后可以把顺序调回去 */
  for(const rk of ["island","nearby","cdmx","other"]){
    if(filter!=="all"&&filter!==rk) continue;
    const list=items.filter(p=>(p.region||"other")===rk); if(!list.length) continue;
    html+=`<section><div class="section-t"><h2>${REG[rk].name}</h2><span>${REG[rk].sub} · ${list.length} 个</span></div><div class="grid" style="margin-top:12px">${list.map(card).join("")}</div></section>`;
  }
  $("#list").innerHTML=html;
  if($("#mapbox").open) drawMaps();
}

/* ---------- place page ---------- */
let cur=null,curTab="transport";
const TAB_SHORT={transport:"交通",route:"行程",food:"美食",hotel:"酒店"};
function loopMap(fwd){
  const b={w:-102.85,e:-98.1,s:19.15,n:21.3},W=560,kx=Math.cos(20.25*Math.PI/180),k=W/((b.e-b.w)*kx),H=Math.round((b.n-b.s)*k);
  const xy=(lo,la)=>[((lo-b.w)*kx*k).toFixed(1),((b.n-la)*k).toFixed(1)];
  const C=xy(-99.203,19.443),G=xy(-101.256,21.019),S=xy(-100.744,20.914),Q=xy(-100.39,20.59);
  const mid=(a,c,dx,dy)=>[(+a[0]+ +c[0])/2+dx,(+a[1]+ +c[1])/2+dy];
  const m1=mid(C,G,-40,30),m3=mid(S,C,40,-20);
  const lbl=(p,t,anchor,dy)=>`<text x="${p[0]}" y="${+p[1]+dy}" text-anchor="${anchor}" class="lm-t">${t}</text>`;
  return `<figure class="loopmap"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="墨城、瓜纳华托、圣米格尔环线示意图">
   <defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--teal)"/></marker></defs>
   ${fwd?`<path d="M${C} Q${m3} ${S}" class="lm-r" marker-end="url(#ah)"/><path d="M${S} L${G}" class="lm-r" marker-end="url(#ah)"/><path d="M${G} Q${m1} ${C}" class="lm-r lm-d" marker-end="url(#ah)"/>`
   :`<path d="M${C} Q${m1} ${G}" class="lm-r" marker-end="url(#ah)"/><path d="M${G} L${S}" class="lm-r" marker-end="url(#ah)"/><path d="M${S} Q${m3} ${C}" class="lm-r lm-d" marker-end="url(#ah)"/>`}
   <circle cx="${Q[0]}" cy="${Q[1]}" r="4" class="lm-q"/>${lbl([+Q[0]+10,Q[1]],"Querétaro（途经）","start",4).replace('lm-t','lm-t lm-s lm-via')}
   ${[[C,"墨城 Ciudad de México","middle",26],[G,"瓜纳华托 Guanajuato","end",5],[S,"圣米格尔 San Miguel de Allende","start",30]].map(([p,t,a,dy])=>`<circle cx="${p[0]}" cy="${p[1]}" r="8" class="lm-p"/>`+lbl([p===S?+p[0]-30:p===G?+p[0]-14:p[0],p[1]],t,a,dy)).join("")}
   <text x="${m1[0]-6}" y="${m1[1]+18}" text-anchor="end" class="lm-t lm-s lm-seg">${fwd?"③":"①"} 约 340 公里 · 4–4.5 小时</text>
   <text x="${+S[0]+14}" y="${+S[1]-6}" text-anchor="start" class="lm-t lm-s lm-seg">② 约 90 公里 · 1.5 小时</text>
   <text x="${m3[0]+10}" y="${m3[1]+30}" text-anchor="start" class="lm-t lm-s lm-seg">${fwd?"①":"③"} 约 270 公里 · 3.5–4 小时</text>
  </svg><figcaption>示意图，线条不代表实际道路；自驾时间按 Google 地图和旅游网站整理。</figcaption></figure>`;
}
/* 通用路线示意图：数据在 data/guides.js 的 MAPS[key]，攻略里写 "map:<key>" */
function routeMap(key){
  const M=MAPS[key],P=M.pts,lo=P.map(p=>p.lon),la=P.map(p=>p.lat),pad=M.pad||[0.3,0.3,0.08,0.08];
  const b={w:Math.min(...lo)-pad[0],e:Math.max(...lo)+pad[1],s:Math.min(...la)-pad[2],n:Math.max(...la)+pad[3]};
  const W=560,kx=Math.cos((b.s+b.n)/2*Math.PI/180),k=W/((b.e-b.w)*kx),H=Math.round((b.n-b.s)*k),f=n=>n.toFixed(1),xy={};
  P.forEach(p=>xy[p.id]=[(p.lon-b.w)*kx*k,(b.n-p.lat)*k]);
  const segs=M.segs.map(s=>{const a=xy[s.from],c=xy[s.to],[dx,dy]=s.bend||[0,0],m=[(a[0]+c[0])/2+dx,(a[1]+c[1])/2+dy];
    const d=(dx||dy)?`M${f(a[0])} ${f(a[1])} Q${f(m[0])} ${f(m[1])} ${f(c[0])} ${f(c[1])}`:`M${f(a[0])} ${f(a[1])} L${f(c[0])} ${f(c[1])}`;
    return `<path d="${d}" class="lm-r${s.dash?" lm-d":""}" marker-end="url(#ah-${key})"/>`+(s.label?`<text x="${f(m[0]+(s.lx||0))}" y="${f(m[1]+(s.ly||0))}" text-anchor="${s.anchor||"middle"}" class="lm-t lm-s lm-seg">${esc(s.label)}</text>`:"");}).join("");
  /* island:true 的点画成深蓝色的小岛（沙滩 + 椰子树），地名也用深蓝色 */
  const isle=(x,y)=>`<g class="lm-isl" transform="translate(${f(x)} ${f(y)})"><path d="M-12 5Q0-3 12 5Z"/><path class="lm-palm" d="M0 4L1-9M1-9q-6-1-9 3M1-9q6-1 9 3M1-9q-3-4-7-5M1-9q3-4 7-4"/></g>`;
  const pts=P.map(p=>{const [x,y]=xy[p.id];return (p.island?isle(x,y):`<circle cx="${f(x)}" cy="${f(y)}" r="${p.r||(p.via?4:8)}" class="${p.via?"lm-q":"lm-p"}"/>`)+`<text x="${f(x+(p.dx||0))}" y="${f(y+(p.dy||0))}" text-anchor="${p.anchor||"middle"}" class="lm-t${p.via?" lm-s lm-via":""}${p.island?" lm-isl-t":""}">${esc(p.name)}</text>`;}).join("");
  return `<figure class="loopmap"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(M.aria||"路线示意图")}">
   <defs><marker id="ah-${key}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--teal)"/></marker></defs>
   ${segs}${pts}</svg><figcaption>示意图，线条不代表实际道路；自驾时间按 Google 地图整理。</figcaption></figure>`;
}
function placeRow(x,selfId){
  const u="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(x.q||x.name)+(x.pid?"&query_place_id="+encodeURIComponent(x.pid):"");
  const rate=x.r?`<span class="star">${x.r} ★</span><em>(${fmtN(x.n)} 条)</em>`:"";
  return `<div class="gitem"><div class="gtop"><a class="gmap" href="${esc(u)}" target="_blank" rel="noopener">${PINSVG}<b>${esc(x.name)}</b></a>${rate?`<span class="gr">Google ${rate}</span>`:""}${x.price?`<span class="gp">${esc(x.price)}</span>`:""}</div>${x.note?`<div class="gnote">${linkify(x.note,selfId)}</div>`:""}</div>`;
}
function tabBody(p,k){
  let v=(GUIDE[p.id]||{})[k];
  if(typeof v==="string") v=[v];
  if(Array.isArray(v)&&v.length){
    let out="",ul=[];const flush=()=>{if(ul.length){out+=`<ul>${ul.join("")}</ul>`;ul=[];}};
    for(const x of v){
      if(typeof x==="string"&&x.startsWith("leg:")){flush();out+=`<ol class="tl">${legHTML(x.slice(4))}</ol>`;}
      else if(typeof x==="string"&&x.startsWith("route:")){flush();out+=routeHTML(x.slice(6));}
      else if(x==="map:loop"){flush();out+=loopMap(false);}
      else if(x==="map:loopfwd"){flush();out+=loopMap(true);}
      else if(typeof x==="string"&&x.startsWith("map:")&&typeof MAPS!=="undefined"&&MAPS[x.slice(4)]){flush();out+=routeMap(x.slice(4));}
      else if(typeof x==="string"){ul.push(`<li>${linkify(x,p.id)}</li>`);}
      else if(x.h){flush();out+=`<h4 class="gh">${esc(x.h)}</h4>`;}
      else if(x.warn){flush();out+=`<p class="warn">${linkify(x.warn,p.id)}</p>`;}
      else if(x.name){flush();out+=placeRow(x,p.id);}
      else if(x.src){flush();out+=`<details class="srcs"><summary>资料来源</summary><p>${linkify(x.src,p.id)}</p></details>`;}
    }
    flush(); return `<div class="blk">${out}</div>`;
  }
  const label=TABS.find(t=>t[0]===k)[1];
  const hint=k==="transport"&&p.area?`<p style="margin:8px 0 0">目前已知：${esc(p.area)}。</p>`:"";
  return `<div class="todo"><b>「${label}」还在整理中。</b>可以先看看上面的简介，或者看看其他已经写好的地点。${hint}</div>`;
}
/* 交叉链接：别名在 data/places.js 的 ALIAS 里。 */
const ALIAS_RE=Object.keys(ALIAS).map(id=>{
  const alts=ALIAS[id].map(raw=>{const pre=(raw.match(/^\(\?<![^)]*\)/)||[""])[0],post=(raw.match(/\(\?![^)]*\)$/)||[""])[0];
    const lit=raw.slice(pre.length,raw.length-post.length);return{len:lit.length,re:pre+esc(lit).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+post};});
  alts.sort((x,y)=>y.len-x.len);
  return{id,re:alts.map(x=>"(?:"+x.re+")").join("|")};});
function linkify(text,selfId,noAlias){
  let h=esc(text).replace(/\[\[link:(https:[^|\]]+)\|(.+?)\]\]/g,(m,u,l)=>`<a class="off" href="${u}" target="_blank" rel="noopener">${l} 📍</a>`).replace(/Google ?(\d(?:\.\d)?) ?★ ?[（(]([\d,]+) ?条[)）]/g,(m,r,n)=>`<span class="rate-in">Google ${r} ★（${n} 条）</span>`).replace(/\[\[pid:(.+?)\|(.+?)\|(.+?)\]\]/g,(m,id,q,l)=>`<a class="off" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q.replace(/&amp;/g,"&"))}&query_place_id=${encodeURIComponent(id)}" target="_blank" rel="noopener">${l} 📍</a>`).replace(/\[\[map:(.+?)\|(.+?)\]\]/g,(m,q,l)=>`<a class="off" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q.replace(/&amp;/g,"&"))}" target="_blank" rel="noopener">${l} 📍</a>`);
  const used=new Set([selfId]);
  if(!noAlias) for(const a of ALIAS_RE){ if(used.has(a.id)) continue;
    const re=new RegExp(a.re); const segs=h.split(/(<a [^>]*>.*?<\/a>)/);
    let hit=false;
    for(let i=0;i<segs.length&&!hit;i+=2){ if(re.test(segs[i])){ segs[i]=segs[i].replace(re,m=>`<a class="off" href="#p-${a.id}">${m}</a>`); hit=true; } }
    if(hit){ h=segs.join(""); used.add(a.id); }
  }
  return h;
}
function introHTML(p){
  const it=INTRO[p.id], L=t=>linkify(t,p.id);
  if(!it) return `<section class="panel intro"><h2>简介</h2><p class="lead">${L(p.desc||"")}</p></section>`;
  return `<section class="panel intro"><h2>这是什么地方</h2><p class="lead">${L(it.what)}</p>
    ${(it.sections||[]).map(sec=>`<h2>${esc(sec.h)}</h2><ul>${sec.items.map(x=>`<li>${L(x)}</li>`).join("")}</ul>`).join("")}
    <h2>背景故事</h2><div class="story">${it.story.map(x=>`<p>${L(x)}</p>`).join("")}</div>
    ${it.tips&&it.tips.length?`<h2>去之前知道</h2><ul>${it.tips.map(x=>`<li>${L(x)}</li>`).join("")}</ul>`:""}
    <details class="srcs"><summary>资料来源（${it.src.length} 条）</summary><div class="lst">${it.src.map(([l,u])=>`<a href="${esc(u)}" target="_blank" rel="noopener">${esc(l)}</a>`).join("")}<span>由 Claude 根据官网和维基百科整理翻译</span></div></details></section>`;
}
function drawPlace(){
  const p=cur, g=p.g||{};
  $("#placeView").innerHTML=`
   <button class="back" data-home>← 返回首页</button>
   <div class="hero">${picHTML(p)}<div class="cap"><h1>${esc(p.es||p.cn)}</h1><div>${esc(p.cn)} · ${esc(p.kind||"")} · ${esc(p.area||"")}</div></div></div>
   <div class="panel pmeta">${gmapHTML(p)}${p.site?`<a class="off" href="${esc(p.site)}" target="_blank" rel="noopener">官网</a>`:""}${g.r&&p.gnote?`<span class="small">评分为「${esc(p.gnote)}」</span>`:""}
   </div>
   ${introHTML(p)}
   <section class="panel blk" id="guide">
     <div class="ptabs" role="tablist">${TABS.map(([k,t])=>`<button class="act" role="tab" data-tab2="${k}" aria-selected="${curTab===k}" aria-label="${t}">${ICON[k]}<span class="f">${t}</span><span class="s">${TAB_SHORT[k]}</span></button>`).join("")}</div>
     <div role="tabpanel">${tabBody(p,curTab)}</div>
   </section>
   <section class="panel review"><h2>点评一下<span id="revAvg"></span></h2>
     <div class="stars" role="group" aria-label="打分">${[1,2,3,4,5].map(i=>`<button data-star="${i}" aria-label="${i} 星">★</button>`).join("")}<span id="starTxt"></span></div>
     <textarea id="revText" rows="4" maxlength="1000" placeholder="请留下你对这个攻略的使用感受和建议吧~"></textarea>
     <div class="revbar"><span class="note" id="revMsg"></span><button class="cta" data-rev>提交</button></div>
     <div id="revList"></div></section>`;
  $("#revText").value=revDraft; drawStars();
  // 公开网站（GitHub Pages 等）没有点评存储，整块隐藏；本地预览和 claude.ai 上照常显示
  if(!window.claude&&/^https?:$/.test(location.protocol)&&!/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) $(".review").style.display="none";
  if(!window.claude) $("#revMsg").textContent="网页发布到网上后才能提交点评。";
  else if(!revCanWrite) $("#revMsg").textContent="你目前只有查看权限，暂时不能留言。";
  drawReviews(); fitMapText();
}

/* ---------- 点评一下：在线版存在 db 的 reviews/<用户 id> 里；本地双击打开时只显示输入框 ---------- */
let revDB=null,revUser=null,myId=null,revDocs={},revDraft="",revStars=0,revBusy=false,revCanWrite=true;
const revMsg=t=>{const m=$("#revMsg"); if(m) m.textContent=t;};
const STAR_TXT=["点星星打分","不推荐","一般","还可以","推荐","非常推荐"];
const starStr=n=>"★".repeat(n)+"☆".repeat(5-n);
function drawStars(){
  document.querySelectorAll("[data-star]").forEach(b=>b.setAttribute("aria-pressed",String(+b.dataset.star<=revStars)));
  const t=$("#starTxt"); if(t) t.textContent=STAR_TXT[revStars];
}
async function revInit(){
  if(!window.claude||!window.claude.use) return;
  const [db,user]=await Promise.all([claude.use("db"),claude.use("user")]);
  if(!db) return;
  revDB=db; revUser=user; myId=user?await user.id():null;
  if(user&&await user.can("data.write")===false) revCanWrite=false;
  db.collection("reviews").onSnapshot(s=>{revDocs={}; s.docs.forEach(d=>{revDocs[d.id]=d.data();}); drawReviews();},()=>{});
}
async function drawReviews(){
  if(!cur||!$("#revList")) return;
  const rows=[];
  for(const uid in revDocs) (revDocs[uid].list||[]).forEach(x=>{ if(x.p===cur.id) rows.push({uid,...x}); });
  rows.sort((a,b)=>b.at-a.at);
  rows.forEach(r=>{ r.s=typeof r.s==="number"&&r.s>=1&&r.s<=5?Math.round(r.s):0; });
  const rated=rows.filter(r=>r.s);
  const avg=$("#revAvg"); if(avg) avg.innerHTML=rated.length?`<span class="rate-in">${(rated.reduce((n,r)=>n+r.s,0)/rated.length).toFixed(1)} ★（${rated.length} 条）</span>`:"";
  const ps=revUser&&rows.length?await revUser.profiles([...new Set(rows.map(r=>r.uid))]):{};
  const box=$("#revList"); if(!box) return;
  box.innerHTML=rows.map(r=>`<div class="rev"><div class="revtop"><b>${esc((ps[r.uid]||{}).name||"一位网友")}</b>${r.s?`<span class="rate-in">${starStr(r.s)}</span>`:""}<span>${new Date(r.at).toLocaleDateString("zh-CN")}</span>${r.uid===myId?`<button class="ghost" data-revdel="${r.at}">删除</button>`:""}</div>${r.t?`<div>${esc(r.t)}</div>`:""}</div>`).join("");
}
async function revSave(list,okMsg){
  revBusy=true;
  try{ await revDB.doc("reviews/"+myId).set({list}); revMsg(okMsg); return true; }
  catch(e){ if(e.code==="invalid_argument"){revCanWrite=false; revMsg("你目前只有查看权限，暂时不能留言。");} else revMsg("没有提交成功，请稍后再试。"); return false; }
  finally{ revBusy=false; }
}
async function revSubmit(){
  const t=revDraft.trim();
  if(!window.claude) return revMsg("网页发布到网上后才能提交点评。");
  if(!revDB||!myId) return revMsg("正在连接，或者需要先登录，请稍后再试。");
  if(!revCanWrite) return revMsg("你目前只有查看权限，暂时不能留言。");
  if(!t&&!revStars) return revMsg("先打个分或写几句再提交吧。");
  if(revBusy) return;
  const list=[...((revDocs[myId]||{}).list||[]),{p:cur.id,t,s:revStars,at:Date.now()}];
  if(await revSave(list,"谢谢你的点评！")){ revDraft=""; revStars=0; drawStars(); const a=$("#revText"); if(a) a.value=""; }
}
async function revDelete(at){
  if(!revDB||!myId||revBusy) return;
  await revSave(((revDocs[myId]||{}).list||[]).filter(x=>x.at!==at),"已删除。");
}
document.addEventListener("input",e=>{ if(e.target.id==="revText") revDraft=e.target.value; });
function openPlace(id,tab){ if(tab) curTab=tab; const h="#p-"+id; if(location.hash===h) route(); else location.hash=h; }
function route(){
  const m=location.hash.match(/^#p-([A-Za-z0-9-]+)$/);
  const p=m&&all().find(x=>x.id===m[1]);
  if(p){
    const changed=cur!==p; cur=p; if(changed&&!pendingTab) curTab="transport"; pendingTab=null;
    drawPlace(); $("#home").hidden=true; $("#placeView").hidden=false;
    if(scrollToGuide){ scrollToGuide=false; requestAnimationFrame(()=>document.getElementById("guide")?.scrollIntoView({block:"start"})); } else window.scrollTo(0,0);
  } else {
    cur=null; $("#placeView").hidden=true; $("#home").hidden=false;
    if(lastCard){ requestAnimationFrame(()=>document.getElementById("card-"+lastCard)?.scrollIntoView({block:"center"})); }
  }
}
let pendingTab=null, scrollToGuide=false, lastCard=null;
window.addEventListener("hashchange",route);

/* ---------- events ---------- */
document.addEventListener("click",e=>{
  const nm=e.target.closest("a.name"); if(nm){lastCard=nm.getAttribute("href").slice(3);}
  const t=e.target.closest("button"); if(!t) return;
  if(t.dataset.f){filter=t.dataset.f;render();return;}
  if(t.dataset.place){lastCard=t.dataset.place;openPlace(t.dataset.place);return;}
  if(t.dataset.open){lastCard=t.dataset.open;pendingTab=t.dataset.tab;curTab=t.dataset.tab;scrollToGuide=true;openPlace(t.dataset.open,t.dataset.tab);return;}
  if(t.dataset.tab2){curTab=t.dataset.tab2;const y=scrollY;drawPlace();scrollTo(0,y);const gd=$("#guide");if(gd.getBoundingClientRect().top<0)gd.scrollIntoView({block:"start"});return;}
  if(t.dataset.end){routeEnd=t.dataset.end;drawPlace();return;}
  if(t.hasAttribute("data-home")){location.hash="";return;}
  if(t.hasAttribute("data-rev")){revSubmit();return;}
  if(t.dataset.star){const n=+t.dataset.star; revStars=revStars===n?0:n; drawStars();return;}
  if(t.dataset.revdel){revDelete(Number(t.dataset.revdel));return;}
});


/* ---------- maps ---------- */
const MX=[[-117.1,32.5],[-114.7,32.7],[-111.1,31.3],[-108.2,31.3],[-108.2,31.8],[-106.5,31.8],[-104.9,30.6],[-104.5,29.6],[-103.1,29],[-102.4,29.8],[-101.4,29.8],[-100.3,28.3],[-99.5,27.5],[-99.1,26.4],[-97.5,25.9],[-97.4,24.5],[-97.8,22.3],[-97.2,20.6],[-96.1,19.2],[-94.8,18.5],[-94.4,18.2],[-92.6,18.6],[-91.6,18.6],[-90.7,19.4],[-90.4,21],[-89.6,21.3],[-87.4,21.55],[-86.8,21.1],[-87.1,20.6],[-87.5,20.2],[-87.6,19.5],[-87.5,19],[-88.3,18.5],[-89.1,17.8],[-90.9,17.8],[-90.98,17.25],[-91.4,17.25],[-90.4,16.1],[-91.7,16.07],[-92.2,15.3],[-92.2,14.5],[-93.4,15.6],[-94.6,16.2],[-95.2,15.9],[-96.5,15.65],[-98.5,16.3],[-99.9,16.85],[-101.6,17.65],[-102.2,17.95],[-103.5,18.3],[-104.3,19.1],[-105.3,20.4],[-105.25,21.5],[-105.8,22.6],[-106.4,23.2],[-107.5,24.5],[-108.5,25.4],[-109.2,26.3],[-109.9,27],[-110.9,27.9],[-111.6,28.9],[-112.2,29.4],[-112.9,30.3],[-113.1,31.2],[-114.6,31.7],[-114.5,30],[-113.6,28.9],[-112.8,27.7],[-111.9,26.4],[-110.7,24.3],[-109.4,23.2],[-110,22.9],[-110.3,23.6],[-111.6,24.5],[-112.2,25.8],[-113.2,26.8],[-114.1,27.6],[-114.3,28.6],[-115.7,29.8],[-116.6,31.6],[-117.1,32.5]];
const NEIGHBOR=[[-88.3,18.5],[-88.1,18],[-88.2,17.5],[-88.3,16],[-89.2,15.9],[-92.2,14.5],[-92.2,15.3],[-91.7,16.07],[-90.4,16.1],[-91.4,17.25],[-90.98,17.25],[-90.9,17.8],[-89.1,17.8]];
const COZ=[[-86.99,20.55],[-86.75,20.6],[-86.73,20.3],[-86.98,20.32]];
const NS="http://www.w3.org/2000/svg";
function mk(svg,b,W){const kx=Math.cos((b.s+b.n)/2*Math.PI/180),k=W/((b.e-b.w)*kx),H=Math.round((b.n-b.s)*k);svg.setAttribute("viewBox",`0 0 ${W} ${H}`);return{W,H,k,xy:(lo,la)=>[(lo-b.w)*kx*k,(b.n-la)*k],b};}
function el(t,a,p){const n=document.createElementNS(NS,t);for(const k in a)n.setAttribute(k,a[k]);p&&p.appendChild(n);return n;}
const poly=(m,pts)=>pts.map((p,i)=>(i?"L":"M")+m.xy(p[0],p[1]).map(v=>v.toFixed(1)).join(",")).join("")+"Z";
function baseMap(svg,m){svg.innerHTML="";el("path",{d:poly(m,MX),fill:"var(--card)",stroke:"var(--line)","stroke-width":1.5},svg);el("path",{d:poly(m,NEIGHBOR),fill:"var(--card)",opacity:.5},svg);el("path",{d:poly(m,COZ),fill:"var(--card)"},svg);}
function pin(svg,m,p,label,o={}){
  const [x,y]=m.xy(p.lon,p.lat), g=el("g",{class:"pin",tabindex:0,role:"button","aria-label":label},svg);
  el("circle",{cx:x,cy:y,r:o.r||7,fill:"var(--red)",stroke:"var(--card)","stroke-width":2.5},g);
  const dx=o.dx??11,t=el("text",{x:x+dx,y:y+(o.dy??4),"text-anchor":dx<0?"end":"start"},g);t.textContent=label;
  const go=()=>openPlace(o.target||p.id);
  g.addEventListener("click",go);g.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();go();}});
}
const esShort=p=>(p.es||p.cn).split("·")[0].trim();
const isPhone=()=>matchMedia("(max-width:620px)").matches;
/* 手机上图会缩小到一半左右，地名放不下：改成带编号的圆点，图下面放编号列表。
   圆点挤在一起时互相推开，再用细线连回真实位置。k = 图缩小的倍数，保证显示出来的数字不小于 12px */
function numPins(svg,m,items){
  const k=m.W/(svg.getBoundingClientRect().width||m.W),r=11*k,gap=3*k;
  const q=items.map(it=>{const [x,y]=m.xy(it.p.lon,it.p.lat);return{x,y,cx:x,cy:y};});
  for(let n=0;n<300;n++){let moved=false;
    for(let i=0;i<q.length;i++)for(let j=i+1;j<q.length;j++){const a=q[i],b=q[j];let dx=b.cx-a.cx,dy=b.cy-a.cy,d=Math.hypot(dx,dy);
      if(d<2*r+gap){if(d<.01){dx=0;dy=1;d=1;}const s=(2*r+gap-d)/2/d;a.cx-=dx*s;a.cy-=dy*s;b.cx+=dx*s;b.cy+=dy*s;moved=true;}}
    for(const p of q){p.cx=Math.min(m.W-r-gap,Math.max(r+gap,p.cx));p.cy=Math.min(m.H-r-gap,Math.max(r+gap,p.cy));}
    if(!moved) break;}
  for(const p of q) if(Math.hypot(p.cx-p.x,p.cy-p.y)>r*.6){el("line",{x1:p.x,y1:p.y,x2:p.cx,y2:p.cy,stroke:"var(--red)","stroke-width":1.5*k},svg);el("circle",{cx:p.x,cy:p.y,r:2.5*k,fill:"var(--red)"},svg);}
  items.forEach((it,i)=>{const p=q[i],g=el("g",{class:"pin",tabindex:0,role:"button","aria-label":`${i+1} ${it.es} ${it.cn}`},svg);
    el("circle",{cx:p.cx,cy:p.cy,r,fill:"var(--card)",stroke:"var(--red)","stroke-width":2.5*k},g);
    const t=el("text",{x:p.cx,y:p.cy,"text-anchor":"middle","dominant-baseline":"central",class:"num",style:`font-size:${12*k}px`},g);t.textContent=i+1;
    const go=()=>openPlace(it.target||it.p.id);
    g.addEventListener("click",go);g.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();go();}});});
}
function mapList(svg,items){
  const fig=svg.closest("figure");let ol=fig.nextElementSibling;
  if(!items){if(ol&&ol.classList.contains("maplist"))ol.remove();return;}
  if(!ol||!ol.classList.contains("maplist")){ol=document.createElement("ol");ol.className="maplist";fig.after(ol);}
  ol.innerHTML=items.map((it,i)=>`<li><button data-place="${esc(it.target||it.p.id)}"><b>${i+1}</b><span>${esc(it.es)} <small>${esc(it.cn)}</small></span></button></li>`).join("");
}
function drawMaps(){
  const phone=isPhone();
  const c=$("#mapC"),mc=mk(c,{w:-101.7,e:-97.7,s:18.45,n:21.35},640); baseMap(c,mc);
  const home=mc.xy(-99.203,19.443),s=mc.xy(-100.744,20.914),g=mc.xy(-101.254,21.015),ctl=[(g[0]+home[0])/2-40,(g[1]+home[1])/2+30];
  el("path",{d:`M${home}L${s}L${g}Q${ctl} ${home}`,fill:"none",stroke:"var(--teal)","stroke-width":2.5,"stroke-dasharray":"7 6"},c);
  const ic=[];
  for(const p of all()){ if(p.city||p.lat==null||p.region==="island") continue; const b=mc.b; if(p.lon<b.w||p.lon>b.e||p.lat<b.s||p.lat>b.n) continue; ic.push({p,es:esShort(p),cn:p.cn}); }
  const cityN=P.filter(p=>p.city).length;
  ic.push({p:{id:"antro",lat:19.43,lon:-99.16},es:"Ciudad de México",cn:`墨城市内 ${cityN} 处`});
  const iy=all().filter(p=>p.region==="island"&&p.lat!=null).map(p=>({p,es:p.id==="xpark"?"Xcaret":esShort(p),cn:p.cn}));
  const y=$("#mapY"),my=mk(y,{w:-91,e:-86.3,s:18.2,n:21.8},520); baseMap(y,my);
  if(phone){numPins(c,mc,ic);numPins(y,my,iy);mapList(c,ic);mapList(y,iy);return;}
  mapList(c);mapList(y);
  const L={valle:{dx:-11},sma:{dy:-8},gto:{dx:-11,dy:-8},valquirico:{dx:-11,dy:-8},cholula:{dx:-11,dy:14},puebla:{dx:11,dy:6},teo:{dy:-4}};
  for(const it of ic.slice(0,-1)) pin(c,mc,it.p,it.es,L[it.p.id]||{});
  pin(c,mc,ic[ic.length-1].p,`Ciudad de México 市内 ${cityN} 处`,{r:9,dx:-13});
  const LY={grancenote:{dx:-11,dy:-10},dosojos:{dx:11},cozumel:{dx:11,dy:4},cancun:{dx:-11,dy:12},mujeres:{dx:-11,dy:-6},playa:{dx:-11,dy:2},xpark:{dx:-11,dy:14},tulum:{dx:-11},chichen:{},bacalar:{dx:-11}};
  for(const it of iy) pin(y,my,it.p,it.es,LY[it.p.id]||{dx:-11});
}

$("#mapbox").addEventListener("toggle",()=>{if($("#mapbox").open)drawMaps();});
let mapPhone=null;window.addEventListener("resize",()=>{if(!$("#mapbox").open)return;const ph=isPhone();if(ph||ph!==mapPhone)drawMaps();mapPhone=ph;});
/* 示意图在手机上会整体缩小：把「缩小了几倍」存进 --k，CSS 据此放大字，保证显示出来不小于 12px；
   字放大后靠边的地名可能超出图框，再把它们往里推一点 */
function fitMapText(){document.querySelectorAll(".loopmap svg").forEach(svg=>{
  const w=svg.getBoundingClientRect().width,vb=svg.viewBox.baseVal; if(!w||!vb||!vb.width) return;
  svg.style.setProperty("--k",(vb.width/w).toFixed(3));
  svg.querySelectorAll("text").forEach(t=>{t.removeAttribute("transform"); if(getComputedStyle(t).display==="none") return;
    const b=t.getBBox(),m=4; let dx=0,dy=0;
    if(b.x<m) dx=m-b.x; else if(b.x+b.width>vb.width-m) dx=vb.width-m-b.x-b.width;
    if(b.y<m) dy=m-b.y; else if(b.y+b.height>vb.height-m) dy=vb.height-m-b.y-b.height;
    if(dx||dy) t.setAttribute("transform",`translate(${dx.toFixed(1)} ${dy.toFixed(1)})`);});
});}
window.addEventListener("resize",fitMapText); window.addEventListener("load",fitMapText);

/* ---------- start ---------- */
render(); route(); revInit();
