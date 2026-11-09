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
  const tabs=[["all","全部"],["island","海岛游 5–7 天"],["nearby","墨城周边 2–3 天"],["cdmx","墨城内 1 日游"]];
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
  drawMaps();
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
    cur=null; $("#placeView").hidden=true; $("#home").hidden=false; drawMaps();
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
/* 国界轮廓来自 Natural Earth 1:50m（公有领域），简化到约 0.06° 精度；MX 含主要海岛（科苏梅尔等） */
const MX=[[[-117.13,32.53],[-114.72,32.72],[-114.84,32.51],[-111.04,31.32],[-108.21,31.33],[-108.21,31.78],[-106.45,31.77],[-106.15,31.45],[-104.92,30.58],[-104.62,29.85],[-104.4,29.57],[-103.26,29],[-102.89,29.22],[-102.73,29.64],[-102.34,29.86],[-101.38,29.74],[-100.75,29.18],[-100.3,28.33],[-99.51,27.55],[-99.46,27.06],[-99.11,26.45],[-97.38,25.87],[-97.15,25.96],[-97.22,25.59],[-97.51,25.01],[-97.74,23.76],[-97.75,22.94],[-97.84,22.51],[-97.76,22.11],[-97.31,21.56],[-97.41,21.27],[-97.38,21.57],[-97.75,22.03],[-97.64,21.6],[-97.12,20.61],[-96.46,19.87],[-96.29,19.34],[-95.78,18.81],[-95.92,18.82],[-95.63,18.69],[-95.7,18.77],[-95.18,18.7],[-94.8,18.51],[-94.55,18.17],[-94.19,18.2],[-93.55,18.43],[-92.88,18.47],[-92.44,18.68],[-91.97,18.72],[-91.88,18.64],[-91.91,18.53],[-91.53,18.46],[-91.28,18.62],[-91.34,18.9],[-91.44,18.89],[-90.74,19.35],[-90.69,19.73],[-90.49,19.95],[-90.48,20.56],[-90.35,21.01],[-89.82,21.27],[-88.88,21.41],[-88.47,21.57],[-88.01,21.6],[-87.25,21.45],[-87.19,21.55],[-87.37,21.57],[-87.03,21.59],[-86.82,21.42],[-86.77,21.15],[-86.93,20.79],[-87.42,20.23],[-87.44,19.86],[-87.69,19.64],[-87.65,19.55],[-87.42,19.58],[-87.66,19.35],[-87.66,19.26],[-87.5,19.29],[-87.85,18.27],[-88.06,18.52],[-88.07,18.83],[-88.3,18.47],[-88.52,18.45],[-88.81,17.97],[-89.13,17.97],[-89.16,17.81],[-90.99,17.82],[-90.99,17.25],[-91.41,17.26],[-90.42,16.39],[-90.45,16.07],[-91.74,16.07],[-92.2,15.28],[-92.07,15.07],[-92.24,14.55],[-93.92,16.05],[-94.37,16.28],[-94.43,16.23],[-94,16.02],[-94.66,16.2],[-94.62,16.35],[-94.75,16.29],[-94.9,16.42],[-95.02,16.28],[-94.8,16.21],[-95.13,16.18],[-95.46,15.97],[-96.51,15.65],[-97.18,15.91],[-97.75,15.97],[-98.14,16.21],[-98.52,16.3],[-98.76,16.53],[-99.69,16.72],[-100.85,17.2],[-101.6,17.65],[-101.92,17.96],[-102.7,18.06],[-103.44,18.33],[-103.91,18.83],[-104.94,19.31],[-105.48,19.98],[-105.67,20.39],[-105.26,20.58],[-105.33,20.75],[-105.51,20.81],[-105.24,21.12],[-105.21,21.49],[-105.43,21.62],[-105.65,21.99],[-105.65,22.33],[-105.79,22.63],[-106.4,23.2],[-106.94,23.88],[-107.76,24.47],[-107.53,24.36],[-107.51,24.49],[-107.95,24.61],[-108.28,25.08],[-108.05,25.07],[-108.7,25.38],[-108.79,25.54],[-109.03,25.48],[-109.07,25.55],[-108.89,25.73],[-109.08,25.62],[-109.3,25.63],[-109.43,26.03],[-109.2,26.31],[-109.12,26.25],[-109.28,26.53],[-109.48,26.71],[-109.75,26.7],[-109.94,27.08],[-110.28,27.16],[-110.48,27.32],[-110.62,27.65],[-110.53,27.86],[-111.12,27.97],[-111.47,28.38],[-111.68,28.47],[-112.16,29.02],[-112.22,29.27],[-112.38,29.35],[-112.41,29.54],[-112.74,29.99],[-113.11,30.79],[-113.05,31.18],[-113.62,31.35],[-113.76,31.56],[-113.95,31.63],[-114,31.53],[-114.15,31.51],[-114.93,31.9],[-114.79,31.65],[-114.88,31.16],[-114.63,30.51],[-114.63,30.16],[-114.37,29.83],[-113.76,29.37],[-113.5,28.93],[-113.38,28.95],[-113.32,28.81],[-113.21,28.8],[-113.09,28.51],[-112.87,28.42],[-112.73,27.83],[-112.33,27.52],[-112.19,27.19],[-112,27.08],[-111.86,26.68],[-111.7,26.58],[-111.8,26.88],[-111.57,26.71],[-111.29,25.79],[-111.03,25.53],[-110.69,24.87],[-110.73,24.59],[-110.66,24.34],[-110.37,24.1],[-110.26,24.34],[-109.42,23.48],[-109.5,23.16],[-110.01,22.89],[-110.36,23.6],[-111.68,24.56],[-111.8,24.54],[-112.07,24.84],[-112.07,25.57],[-112.38,26.21],[-113.02,26.58],[-113.16,26.95],[-113.27,26.79],[-113.6,26.72],[-113.84,26.97],[-114.45,27.22],[-114.54,27.43],[-114.99,27.74],[-115.04,27.84],[-114.57,27.78],[-114.3,27.87],[-114.3,27.78],[-114.07,27.68],[-114.16,27.92],[-114.27,27.93],[-114.05,28.43],[-114.94,29.35],[-115.67,29.76],[-115.81,29.96],[-115.82,30.3],[-116,30.41],[-116.06,30.8],[-116.3,30.97],[-116.33,31.2],[-116.66,31.56],[-116.72,31.73],[-116.62,31.85],[-116.85,32],[-117.06,32.34]],[[-86.94,20.3],[-87.02,20.38],[-86.98,20.49],[-86.83,20.56],[-86.76,20.55],[-86.81,20.47]],[[-113.16,29.05],[-113.58,29.41],[-113.59,29.57],[-113.51,29.56],[-113.37,29.34],[-113.2,29.3],[-113.18,29.13]],[[-115.17,28.07],[-115.35,28.1],[-115.27,28.34],[-115.15,28.17]],[[-112.2,29.01],[-112.28,28.77],[-112.51,28.85],[-112.47,29.17],[-112.29,29.24],[-112.25,29.13]],[[-112.06,24.55],[-112.3,24.79],[-112.13,25.22],[-112.2,24.84],[-112.07,24.58]]];
const NEIGHBOR=[[[-92.24,14.55],[-92.07,15.07],[-92.2,15.28],[-91.74,16.07],[-90.45,16.07],[-90.42,16.39],[-91.41,17.26],[-90.99,17.25],[-90.99,17.82],[-89.16,17.81],[-89.24,15.89],[-88.6,15.76],[-88.59,15.95],[-88.23,15.73],[-89.14,15.07],[-89.17,14.61],[-89.57,14.39],[-89.55,14.24],[-90.05,13.9],[-90.1,13.74],[-90.61,13.93],[-91.38,13.99],[-91.82,14.23]],[[-89.16,17.81],[-89.13,17.97],[-88.81,17.97],[-88.52,18.45],[-88.3,18.47],[-88.35,18.36],[-88.13,18.35],[-88.09,18.23],[-88.27,17.61],[-88.2,17.52],[-88.31,16.63],[-88.4,16.49],[-88.7,16.25],[-88.89,15.89],[-89.23,15.89],[-89.17,17.57]]];
const NS="http://www.w3.org/2000/svg";
function mk(svg,b,W){const kx=Math.cos((b.s+b.n)/2*Math.PI/180),k=W/((b.e-b.w)*kx),H=Math.round((b.n-b.s)*k);svg.setAttribute("viewBox",`0 0 ${W} ${H}`);return{W,H,k,xy:(lo,la)=>[(lo-b.w)*kx*k,(b.n-la)*k],b};}
function el(t,a,p){const n=document.createElementNS(NS,t);for(const k in a)n.setAttribute(k,a[k]);p&&p.appendChild(n);return n;}
const poly=(m,pts)=>pts.map((p,i)=>(i?"L":"M")+m.xy(p[0],p[1]).map(v=>v.toFixed(1)).join(",")).join("")+"Z";
function baseMap(svg,m){svg.innerHTML="";const d=a=>a.map(p=>poly(m,p)).join("");el("path",{d:d(NEIGHBOR),fill:"var(--card)",opacity:.5},svg);el("path",{d:d(MX),fill:"var(--card)",stroke:"var(--line)","stroke-width":1.5,"stroke-linejoin":"round"},svg);}
/* 首页地图总览：可以缩放的墨西哥全国图。
   每个点有 minZ（放大到几倍才显示名字）：缩小时只看到墨西哥城、坎昆，放大后出现更多地点；名字互相挡住的先不显示，再放大就出来了。
   圆点和字在屏幕上大小固定：u = 1 个屏幕像素等于多少地图单位，半径、字号都乘 u */
const MINZ={sma:2,gto:2,puebla:2,tulum:2,chichen:2,bacalar:2,valle:2.5,playa:3,cozumel:3,coldlake:3,valquirico:3,teo:4,cholula:4,mujeres:4,xpark:5,grancenote:5,dosojos:5,antro:12,zocalo:12,frida:12,vasco:12};
const mapAsp=()=>{const r=$("#mapMX").getBoundingClientRect();return r.width?r.height/r.width:mapV.m.H/mapV.m.W;};
const MAXZ=150, esShort=p=>(p.es||p.cn).split("·")[0].trim();
let mapV=null;
function mapPoints(){
  const ph=matchMedia("(max-width:620px)").matches;
  const pts=[{id:"cdmx",label:ph?"墨西哥城":"墨西哥城 Ciudad de México",lon:-99.133,lat:19.433,minZ:1,maxZ:8,big:true}];
  for(const p of all()) if(p.lat!=null) pts.push({id:p.id,label:ph?p.cn:p.cn+" "+esShort(p),lon:p.lon,lat:p.lat,minZ:p.id==="cancun"?1:(MINZ[p.id]||3),big:p.id==="cancun",place:true});
  return pts.sort((x,y)=>x.minZ-y.minZ);
}
function drawMaps(){
  const svg=$("#mapMX"),m=mk(svg,{w:-117.6,e:-86.2,s:14.2,n:33},720); baseMap(svg,m);
  svg.querySelectorAll("path").forEach(p=>p.setAttribute("vector-effect","non-scaling-stroke"));
  el("g",{id:"mapPts"},svg);
  mapV=mapV?{...mapV,m}:{m,z:1,cx:m.W/2,cy:m.H/2};
  bindMap(svg); mapView();
}
function mapView(){
  const svg=$("#mapMX"),{m}=mapV,w=svg.getBoundingClientRect().width||m.W;
  mapV.z=Math.min(MAXZ,Math.max(1,mapV.z));
  const vw=m.W/mapV.z,vh=vw*mapAsp(),u=vw/w;
  mapV.cx=Math.min(m.W-vw/2,Math.max(vw/2,mapV.cx)); mapV.cy=vh>=m.H?m.H/2:Math.min(m.H-vh/2,Math.max(vh/2,mapV.cy));
  const x0=mapV.cx-vw/2,y0=mapV.cy-vh/2;
  svg.setAttribute("viewBox",`${x0} ${y0} ${vw} ${vh}`); svg.classList.toggle("zoomed",mapV.z>1.01);
  const g=$("#mapPts"); g.innerHTML="";
  const dots=el("g",{},g),labs=el("g",{},g),boxes=[];
  const hit=b=>boxes.some(c=>b.x<c.x+c.w&&b.x+b.w>c.x&&b.y<c.y+c.h&&b.y+b.h>c.y);
  // 先画所有圆点并记下位置，再按顺序放地名：地名不能压住任何圆点，也不能和已放好的地名重叠
  const shown=[];
  for(const p of mapPoints()){
    if(p.maxZ&&mapV.z>p.maxZ) continue; // 放大到能看清市内景点时，「墨西哥城」这个总标注就不要了
    const [x,y]=m.xy(p.lon,p.lat),on=mapV.z>=p.minZ;
    const d=el("g",{class:"pin"+(on?"":" off"),tabindex:0,role:"button","aria-label":p.label},dots);
    el("circle",{cx:x,cy:y,r:(on?(p.big?8:6):3.5)*u,fill:"var(--red)",stroke:"var(--card)","stroke-width":(on?2:1)*u},d);
    const go=()=>{ if(p.place) openPlace(p.id); else mapFit("city"); };
    d.addEventListener("click",e=>{if(mapV.dragged){e.preventDefault();return;}go();});
    d.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();go();}});
    if(on){boxes.push({x:x-7*u,y:y-7*u,w:14*u,h:14*u});shown.push({p,x,y,go});}
  }
  for(const {p,x,y,go} of shown){
    const t=el("text",{class:p.big?"big":"",style:`font-size:${13*u}px;stroke-width:${3*u}px`},labs);t.textContent=p.label;
    t.addEventListener("click",go);
    let placed=false;
    for(const [dx,dy,an] of [[10,4.5,"start"],[-10,4.5,"end"],[0,-11,"middle"],[0,19,"middle"]]){
      t.setAttribute("x",x+dx*u); t.setAttribute("y",y+dy*u); t.setAttribute("text-anchor",an);
      const b=t.getBBox(),pad=2*u,box={x:b.x-pad,y:b.y-pad,w:b.width+2*pad,h:b.height+2*pad};
      if(box.x<x0||box.x+box.w>x0+vw||box.y<y0||box.y+box.h>y0+vh||(!p.big&&hit(box))) continue; // 墨西哥城、坎昆一定要显示
      boxes.push(box); placed=true; break;
    }
    if(!placed) t.remove();
  }
}
function mapZoom(f,clientX,clientY){
  const r=$("#mapMX").getBoundingClientRect(),{m}=mapV,a=mapAsp(),vw=m.W/mapV.z,vh=vw*a;
  const px=clientX==null?.5:(clientX-r.left)/r.width,py=clientY==null?.5:(clientY-r.top)/r.height;
  const mx=mapV.cx-vw/2+px*vw,my=mapV.cy-vh/2+py*vh,z=Math.min(MAXZ,Math.max(1,mapV.z*f)),nw=m.W/z,nh=nw*a;
  mapV.z=z; mapV.cx=mx-px*nw+nw/2; mapV.cy=my-py*nh+nh/2; mapView();
}
function mapZoomTo(x,y,z){mapV.z=z;mapV.cx=x;mapV.cy=y;mapView();}
/* 图下面的快捷按钮：把这一组地点刚好框进图里（四周留白） */
const MAP_JUMP={near:p=>p.region==="nearby"||p.region==="cdmx",city:p=>p.city,yuc:p=>p.region==="island"};
function mapFit(key){
  const {m}=mapV; if(!MAP_JUMP[key]){mapZoomTo(m.W/2,m.H/2,1);return;}
  const xy=all().filter(p=>p.lat!=null&&MAP_JUMP[key](p)).map(p=>m.xy(p.lon,p.lat)),xs=xy.map(q=>q[0]),ys=xy.map(q=>q[1]);
  const x1=Math.min(...xs),x2=Math.max(...xs),y1=Math.min(...ys),y2=Math.max(...ys);
  mapZoomTo((x1+x2)/2,(y1+y2)/2,Math.min(MAXZ,m.W/((x2-x1)*1.8||1),m.W*mapAsp()/((y2-y1)*1.6||1)));
}
/* 操作：+ / − 按钮和图下的快捷按钮；双击放大；电脑上拖动平移、按住 Ctrl 滚轮缩放（触控板双指捏合也算）；
   手机上双指缩放和移动，放大以后单指也能拖。拖动过就不算点击 */
function bindMap(svg){
  if(svg.dataset.bound) return; svg.dataset.bound=1;
  $("#mapbox").addEventListener("click",e=>{const b=e.target.closest("button[data-mz]");if(!b)return;
    if(b.dataset.mz==="in")mapZoom(2);else if(b.dataset.mz==="out")mapZoom(.5);else mapFit(b.dataset.mz);});
  svg.addEventListener("dblclick",e=>{e.preventDefault();mapZoom(2,e.clientX,e.clientY);});
  svg.addEventListener("wheel",e=>{if(!e.ctrlKey&&!e.metaKey)return;e.preventDefault();mapZoom(Math.exp(-e.deltaY/200),e.clientX,e.clientY);},{passive:false});
  const unit=()=>mapV.m.W/mapV.z/svg.getBoundingClientRect().width;
  let drag=null;
  svg.addEventListener("pointerdown",e=>{if(e.pointerType!=="mouse"||e.button!==0)return;drag={x:e.clientX,y:e.clientY};mapV.dragged=false;});
  window.addEventListener("pointermove",e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
    if(!mapV.dragged&&Math.hypot(dx,dy)<4)return;mapV.dragged=true;const u=unit();mapV.cx-=dx*u;mapV.cy-=dy*u;drag={x:e.clientX,y:e.clientY};mapView();});
  window.addEventListener("pointerup",()=>{drag=null;setTimeout(()=>{mapV.dragged=false;},0);});
  let tch=null;
  const mid=ts=>({x:(ts[0].clientX+ts[1].clientX)/2,y:(ts[0].clientY+ts[1].clientY)/2,d:Math.hypot(ts[0].clientX-ts[1].clientX,ts[0].clientY-ts[1].clientY)});
  svg.addEventListener("touchstart",e=>{mapV.dragged=false;tch=e.touches.length>1?mid(e.touches):{x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});
  svg.addEventListener("touchmove",e=>{if(!tch)return;
    if(e.touches.length>1){e.preventDefault();const n=mid(e.touches);if(!tch.d){tch=n;return;}
      const u=unit(),f=n.d/tch.d;mapV.cx-=(n.x-tch.x)*u;mapV.cy-=(n.y-tch.y)*u;mapV.dragged=true;tch=n;mapZoom(f,n.x,n.y);return;}
    if(mapV.z<=1.01)return;e.preventDefault();const t=e.touches[0],u=unit();
    if(!mapV.dragged&&Math.hypot(t.clientX-tch.x,t.clientY-tch.y)<6)return;
    mapV.dragged=true;mapV.cx-=(t.clientX-tch.x)*u;mapV.cy-=(t.clientY-tch.y)*u;tch={x:t.clientX,y:t.clientY};mapView();},{passive:false});
  svg.addEventListener("touchend",e=>{tch=e.touches.length>1?mid(e.touches):e.touches.length?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;});
}
document.fonts&&document.fonts.ready.then(()=>{if(mapV)mapView();}); // 网页字体加载完后字宽会变，重新摆一次地名
let mapW=0;window.addEventListener("resize",()=>{const w=$("#mapMX").getBoundingClientRect().width;if(w&&w!==mapW&&mapV){mapW=w;mapView();}});
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
