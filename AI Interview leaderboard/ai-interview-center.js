/* ===== AI Interview Center — data + behavior ===== */
const PHOTOS = [
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=900&h=560&fit=crop&crop=faces&auto=format&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=900&h=560&fit=crop&crop=faces&auto=format&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&h=560&fit=crop&crop=faces&auto=format&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&h=560&fit=crop&crop=faces&auto=format&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=900&h=560&fit=crop&crop=faces&auto=format&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&h=560&fit=crop&crop=faces&auto=format&q=80'
];
const COLS = ['violet','green','orange','blue','magenta','red','yellow2','red2','yellow'];
const BASE = [
  ['Priya Venkatesh','Principal Designer',4.6],['Charles Berg','Product Designer',4.4],['Melissa Tang','Systems Designer',4.3],
  ['Aiden Park','Product Designer',4.2],['Zara Ahmed','Design Lead',4.1],['Sophie Williams','UX Designer',4.0],
  ['Marcus Chen','Design Manager',3.9],['Olivia Brooks','Interaction Designer',3.8],['Raj Kumar','Senior UX Designer',3.7],
  ['Diego Martinez','UX Designer',3.6],['Hana Okafor','Visual Designer',3.5],['Ryan Day','UX Designer',3.4],
  ['Lena Novak','Mobile Designer',3.3],['Sven Conti','UX Designer',3.2],['Jin Andersson','Systems Designer',3.1],
  ['Nadia Schmidt','UX Designer',3.0],['Tomas Rivera','UX Researcher',2.9],['Grace Obi','Product Designer',2.7],
  ['Kenji Mori','UX Designer',2.5],['Ana Costa','Junior Designer',2.3]
];
const ENG = ['C1 · Advanced','B2 · Upper-intermediate','B1 · Intermediate'];
const clamp = (v,a,b)=>Math.min(b,Math.max(a,v));
const C = BASE.map((b,i)=>{
  const [name,role,score] = b;
  const coding = +clamp(score + [0.2,-0.3,0.35,0.55,-0.45,0.1][i%6], 1, 4.9).toFixed(1);
  const comm   = +clamp(score + [-0.45,0.4,-0.15,-0.1,0.5,0.25][i%6], 1, 4.8).toFixed(1);
  const ps     = +clamp(score + [0.1,0.25,-0.2,0.4,-0.1,-0.35][i%6], 1, 4.85).toFixed(1);
  const total = 13, passed = coding>=4 ? 13 : clamp(Math.round(coding*2.7), 3, 12);
  const proctor = !(i%5===3 || score<2.7);
  const flags = proctor ? (i%4) : 15+i;
  return {
    i, rank:i+1, name, role, score, coding, comm, ps,
    first: name.split(' ')[0],
    init: name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase(),
    col: COLS[i%9], photo: PHOTOS[i%6],
    dsa: Math.min(5, Math.round(coding)), syntaxOk: coding>=3.2,
    passed, total, proctor, flags, sev: proctor?'LOW':'HIGH',
    eng: ENG[i%3], caseNA: i%4===0, cohort: i%3===0,
    caseScore: +clamp(score+0.2,1,4.75).toFixed(1),
    stars: clamp(Math.round(score),1,5),
    pct: Math.max(2, Math.round((i+1)/20*100)),
    dur: (12+(i*7)%16)+':'+String(10+(i*13)%50).padStart(2,'0'),
    status: null
  };
});

const TRANSCRIPTS = [
  [ {t:'0:12',w:'AI',x:'How do you reason about <kw>consistency</kw> versus availability?'},
    {t:'0:31',w:'CANDIDATE · KEY MOMENT',k:1,x:'The <kw>bottleneck</kw> is usually the network hop — I would add <kw>observability</kw> before scaling the <kw>service</kw>.'},
    {t:'1:04',w:'AI',x:'Tell me about a <kw>system</kw> you <kw>scale</kw>d and the <kw>bottleneck</kw> you hit.'} ],
  [ {t:'0:09',w:'AI',x:'Walk me through your approach to the <kw>Two Sum</kw> problem.'},
    {t:'0:28',w:'CANDIDATE · KEY MOMENT',k:1,x:'A <kw>hash map</kw> gives O(n) — I traded memory for a single pass and covered the <kw>edge cases</kw> first.'},
    {t:'1:12',w:'AI',x:'How would you <kw>test</kw> this before shipping to production?'} ],
  [ {t:'0:15',w:'AI',x:'How do you prioritise when <kw>requirements</kw> conflict mid-sprint?'},
    {t:'0:42',w:'CANDIDATE · KEY MOMENT',k:1,x:'I quantify the <kw>impact</kw> first — the loudest stakeholder is not always the highest <kw>severity</kw>.'},
    {t:'1:20',w:'AI',x:'Describe a <kw>trade-off</kw> you regretted and what you changed.'} ]
];
function criteriaFor(c){
  const rows = [
    ['Problem solving','30%', c.ps],
    ['Coding proficiency','25%', c.coding],
    ['Communication','20%', c.comm],
    ['Design craft','15%', c.caseNA ? null : c.caseScore],
    ['Collaboration','10%', clamp(c.comm + (c.i%3)*0.15 - 0.1, 1, 4.75)]
  ];
  const scored = rows.filter(r=>r[2]!=null);
  const fit = scored.reduce((s,r)=>s + r[2]*parseInt(r[1]), 0) / scored.reduce((s,r)=>s+parseInt(r[1]),0);
  return { rows, fit };
}
function assessFor(c){
  if (c.score>=4) return `${c.first} showed strong analytical and problem-solving skills — the Two Sum solution was correct, efficient, and passed all ${c.total} tests, and precision/recall was computed accurately.`;
  if (c.score>=3.2) return `${c.first} communicated clearly and structured the case study well; the coding round was solid but slowed on edge cases, passing ${c.passed} of ${c.total} tests.`;
  return `${c.first} struggled to translate the approach into working code — ${c.passed} of ${c.total} tests passed, and the reasoning lacked depth under follow-up questions.`;
}
function plusFor(c){
  const p=[];
  if (c.coding>=3.75) p.push('Code Correctness');
  if (c.ps>=3.5) p.push('Problem Solving');
  if (c.comm>=3.75) p.push('Communication');
  if (c.score>=4) p.push('Quantitative Reasoning');
  return p.length?p:['Consistent effort across sections'];
}
function watchFor(c){
  const w=[];
  if (!c.proctor) w.push('Integrity flags');
  if (c.caseNA) w.push('Skipped case study');
  if (c.comm<3.25) w.push('Unclear verbal explanations');
  if (c.passed<c.total) w.push(`${c.total-c.passed} failing tests`);
  return w.length?w:['None noted'];
}

/* ===== state ===== */
const V2 = !!window.V2;
let curatedOn = V2;
const baseIds = ()=> curatedOn ? C.slice(0,10).map(c=>c.i) : C.map(c=>c.i);
let visible = baseIds();
let selected = new Set();
let current = 0;
let sortMode = 'overall';
const $ = id=>document.getElementById(id);

/* ===== renderers ===== */
const statusChip = c => c.status ? `<span class="status-chip ${c.status}">${{adv:'Advanced',hold:'On hold',hm:'Sent to HM',rej:'Rejected'}[c.status]}</span>` : '';
const actBtns = c => V2 ? `<div class="row-acts">${c.status?'':`<button class="ract" data-ract="adv" data-id="${c.i}">Advance Stage<span class="material-icons-round">expand_more</span></button><button class="ract hm" data-ract="hm" data-id="${c.i}"><span class="material-icons-round">send</span>Share with HM</button>`}</div>` : '';
function order(){
  const arr = visible.map(i=>C[i]);
  arr.sort((a,b)=> sortMode==='coding' ? b.coding-a.coding : b.score-a.score);
  return arr;
}
const BUCKETS = [
  {t:'Matches your hiring pattern', d:'Past hires at this level: 4.3+ score, no proctoring flags', act:'Advance to HM Screen', st:'hm', f:c=>c.score>=4.25&&c.proctor},
  {t:'Platform and scale experience', d:'Led a platform migration, 9+ years product', act:'Advance to HM Screen', st:'hm', f:c=>c.ps>=4},
  {t:'School and location cohort', d:'Target schools, in a hub you hire from', act:'Advance to Recruiter Screen', st:'adv', f:c=>c.cohort},
  {t:'Adjacent industry, strong signal', d:'Marketplace background, 3.5–4.2 score', act:'Advance to Recruiter Screen', st:'adv', f:c=>c.score>=3.5&&c.score<=4.2},
  {t:'Proctoring flags', d:'Suspicious activity flagged during the interview \u2014 review before deciding', act:'Review flags', st:'hold', f:c=>!c.proctor},
  {t:'Below your bar', d:'Under 3.0, or flagged with a weak score', act:'Reject', st:'rej', danger:true, f:c=>c.score<3||(!c.proctor&&c.score<3.5)}
];
let activeBucket = null;
if (V2){
  BUCKETS[0] = {t:'Top 10 candidates matching your requirements', d:'Curated by AI interview score against this position\'s hiring criteria', f:c=>c.rank<=10};
  activeBucket = 0;
}
function renderBuckets(){
  $('buckets').innerHTML = BUCKETS.map((b,j)=>{
    const m = C.filter(b.f);
    const avg = m.length ? (m.reduce((s,c)=>s+c.score,0)/m.length).toFixed(1) : '—';
    return `<div class="bkt ${activeBucket===j?'sel':''}" data-bview="${j}">
      <div class="num-row"><span class="num">${m.length}</span><span class="avg">Avg score ${avg}</span></div>
      <div class="t">${b.t}</div><div class="d">${b.d}</div></div>`;
  }).join('');
}
function renderLB(){
  renderBuckets();
  const arr = order();
  $('lbRows').innerHTML = arr.map((c,j)=>`
    <div class="lrow" data-i="${c.i}">
      <div class="cb ${selected.has(c.i)?'checked':''}" data-cb="${c.i}"></div>
      <div class="rk ${j<3?'top':''}">${j+1}</div>
      <div class="avatar ${c.col}" style="width:36px;height:36px;font-size:13px;">${c.init}</div>
      <div class="who"><div class="nm">${c.name}</div><div class="rl">${c.role}</div></div>
      ${statusChip(c)}${actBtns(c)}
      <div class="sc ${c.score<3?'low':''}">${c.score.toFixed(1)}</div>
      <span class="material-icons-round chev">chevron_right</span>
    </div>`).join('');
}
function renderDL(){
  const arr = order();
  $('dlSub').textContent = `${arr.length} candidate${arr.length===1?'':'s'} · ranked`;
  $('dlRows').innerHTML = arr.map((c,j)=>`
    <div class="drow ${c.i===current?'sel':''}" data-i="${c.i}">
      <div class="rk ${j<3?'top':''}">${j+1}</div>
      <div class="avatar ${c.col}">${c.init}</div>
      <div class="who" style="min-width:0;"><div class="nm">${c.name}</div><div class="rl">${c.role}</div></div>
      <div class="sc">${c.score.toFixed(1)}</div>
    </div>`).join('');
}
function renderDetail(){
  const c = C[current];
  const arr = order();
  const pos = arr.findIndex(x=>x.i===current)+1;
  const tr = TRANSCRIPTS[c.i%3];
  const stars = Array.from({length:5},(_,k)=>`<span class="material-icons-round ${k<c.stars?'':'off'}">${k<c.stars?'star':'star_border'}</span>`).join('');
  const cr = criteriaFor(c);
  const fitCls = cr.fit>=3.75?'strong':cr.fit>=3?'mod':'low';
  const fitLbl = cr.fit>=3.75?'Strong fit':cr.fit>=3?'Moderate fit':'Low fit';
  $('dtPanel').innerHTML = `
    <div class="dt-top">
      <div class="pager">
        <button class="pg-btn" id="pgPrev" title="Previous"><span class="material-icons-round">chevron_left</span></button>
        <span class="pg-txt">${pos} / ${arr.length}</span>
        <button class="pg-btn" id="pgNext" title="Next"><span class="material-icons-round">chevron_right</span></button>
      </div>
      <button class="link-btn"><span class="material-icons-round">description</span>View full feedback</button>
    </div>
    <div class="dt-id">
      <div class="avatar ${c.col}">${c.init}</div>
      <div>
        <div class="dt-nm">${c.name}</div>
        <div class="dt-rl">${c.role} · 360 Interview</div>
        <div class="dt-stars">${stars}<span class="pct">Top ${c.pct}%</span>${statusChip(c)}</div>
      </div>
      <div class="big-score"><div class="v">${c.score.toFixed(1)}</div><div class="l">AI SCORE</div></div>
    </div>
    <div class="sig-chips">
      <span class="sig flags ${c.flags?'':'none'}"><span class="material-icons-round">${c.flags?'warning_amber':'verified_user'}</span>${c.flags?`${c.flags} flags · ${c.sev}`:'No flags'}</span>
      <span class="sig eng">${c.eng}</span>
      <span class="sig tests ${c.passed<c.total?'part':''}"><span class="material-icons-round">task_alt</span>${c.passed}/${c.total} tests</span>
    </div>
    <div class="reel">
      <img src="${c.photo.replace('w=900&h=560&fit=crop&crop=faces','w=1000&h=420&fit=crop&crop=faces')}" alt="${c.name} highlight reel" />
      <span class="tag">HIGHLIGHT REEL</span>
      <div class="vplay"><span class="material-icons-round" style="font-size:30px;">play_arrow</span></div>
      <span class="vdur">${c.dur}</span>
    </div>
    <div class="km-bar"><div class="fill"></div><span class="kdot" style="left:22%"></span><span class="kdot" style="left:64%"></span></div>
    <div class="km-lbl">Key moments</div>
    <div class="sec-lbl">AI assessment</div>
    <div class="assess">${assessFor(c)}</div>
    <div class="hc">
      <div class="hc-head"><span class="t">Hiring criteria fit</span><span class="fit ${fitCls}">${fitLbl} · ${cr.fit.toFixed(1)}</span></div>
      <div class="hc-rows">${cr.rows.map(r=>{
        const v = r[2];
        const cls = v==null?'':v>=3.75?'g':v>=3?'o':'r';
        return `<div class="hc-row"><span class="n">${r[0]} <small>· ${r[1]}</small></span><span class="hc-bar"><i class="${cls}" style="width:${v==null?0:v*20}%"></i></span><span class="v">${v==null?'—':v.toFixed(1)}</span></div>`;
      }).join('')}</div>
    </div>
    <div class="skill-chips">
      <span class="skc">Coding <b>${c.coding.toFixed(1)}</b></span>
      <span class="skc">Case study <b class="${c.caseNA?'na':''}">${c.caseNA?'—':c.caseScore.toFixed(1)}</b></span>
      <span class="skc">Communication <b>${c.comm.toFixed(1)}</b></span>
    </div>
    <div class="pw-grid">
      <div class="pw plus"><div class="h">Plus points</div><ul>${plusFor(c).map(x=>`<li>${x}</li>`).join('')}</ul></div>
      <div class="pw watch"><div class="h">Watch-outs</div><ul>${watchFor(c).map(x=>`<li>${x}</li>`).join('')}</ul></div>
    </div>
    <div class="sec-lbl">Transcript · keywords highlighted</div>
    ${tr.map(e=>`<div class="tr-item ${e.k?'key':''}"><span class="ts">${e.t}</span><div><div class="who-l">${e.w}</div><div class="txt">${e.x.replaceAll('<kw>','<span class="kw">').replaceAll('</kw>','</span>')}</div></div></div>`).join('')}
    <div class="dt-actions">
      <button class="act-btn" data-act="adv">Advance Stage<span class="material-icons-round">expand_more</span></button>
      <button class="act-btn" data-act="hold">Hold</button>
      <button class="act-btn primary" data-act="hm"><span class="material-icons-round">send</span>Send to HM</button>
    </div>`;
  $('pgPrev').onclick = ()=>step(-1);
  $('pgNext').onclick = ()=>step(1);
  renderAsk(c);
  const ask = q => {
    const a = answerFor(c, q);
    $('askAnswerTxt').innerHTML = `<span class="q">${q}</span><br>${a}`;
    $('askAnswer').classList.add('on');
  };
  $('askSend').onclick = ()=>{ const q=$('askInput').value.trim(); if(q){ ask(q); $('askInput').value=''; } };
  $('askInput').addEventListener('keydown', e=>{ if(e.key==='Enter'){ const q=e.target.value.trim(); if(q){ ask(q); e.target.value=''; } } });
  document.querySelectorAll('[data-ask]').forEach(b=>{ b.onclick = ()=>ask(b.textContent); });
  document.querySelectorAll('.dt-actions .act-btn').forEach(b=>{
    b.onclick = (e)=>{ e.stopPropagation(); if(b.dataset.act==='adv') openStageMenu(b,[current],false); else setStatus([current], b.dataset.act); };
  });
}
function step(d){
  const arr = order();
  const pos = arr.findIndex(x=>x.i===current);
  const next = arr[(pos+d+arr.length)%arr.length];
  current = next.i;
  renderDL(); renderDetail();
}

/* ===== views ===== */
function openDetail(i){
  current = i;
  $('lbView').hidden = true; $('dtView').hidden = false;
  renderDL(); renderDetail();
  syncAsk();
  window.scrollTo({top:0});
}
function closeDetail(){
  $('dtView').hidden = true; $('lbView').hidden = false;
  renderLB();
  syncAsk();
}
$('dtBack').onclick = closeDetail;

/* ===== selection ===== */
function updateBar(){
  const n = selected.size;
  $('selCnt').textContent = `${n} selected`;
  $('selBar').classList.toggle('on', n>0);
  $('fltFab').classList.toggle('raised', n>0);
  const all = visible.length && visible.every(i=>selected.has(i));
  if ($('cbAll')) $('cbAll').classList.toggle('checked', all);
}
function setStatus(ids, st){
  ids.forEach(i=>C[i].status=st);
  const names = ids.length===1 ? C[ids[0]].first : `${ids.length} candidates`;
  toast({adv:`${names} advanced to next stage`, hold:`${names} put on hold`, hm:`${names} shared with the hiring manager`, rej:`${names} rejected`}[st]);
  if (!$('lbView').hidden) renderLB(); else { renderDL(); renderDetail(); }
}
document.addEventListener('click', e=>{
  const cb = e.target.closest('[data-cb]');
  if (cb){
    e.stopPropagation();
    const i = +cb.dataset.cb;
    selected.has(i) ? selected.delete(i) : selected.add(i);
    cb.classList.toggle('checked', selected.has(i));
    updateBar();
    return;
  }
  const ra = e.target.closest('[data-ract]');
  if (ra){ e.stopPropagation(); if(ra.dataset.ract==='adv') openStageMenu(ra,[+ra.dataset.id],false); else setStatus([+ra.dataset.id], ra.dataset.ract); return; }
  const bv = e.target.closest('[data-bview]');
  if (bv){
    const j = +bv.dataset.bview;
    if (activeBucket===j){
      activeBucket = null; visible = baseIds();
      $('aiBanner').classList.remove('on');
    } else {
      activeBucket = j;
      const b = BUCKETS[j];
      visible = C.filter(b.f).map(c=>c.i);
      $('aiBanner').classList.add('on');
      $('aiBannerTxt').textContent = `${b.t} — ${visible.length} of 20 candidates match`;
    }
    selected = new Set([...selected].filter(i=>visible.includes(i)));
    renderLB(); updateBar();
    return;
  }
  const card = e.target.closest('.lrow');
  if (card && !$('lbView').hidden){ openDetail(+card.dataset.i); return; }
  const drow = e.target.closest('.drow');
  if (drow){ current = +drow.dataset.i; renderDL(); renderDetail(); }
});
if ($('cbAll')) $('cbAll').onclick = ()=>{
  const all = visible.every(i=>selected.has(i));
  visible.forEach(i=> all ? selected.delete(i) : selected.add(i));
  renderLB(); updateBar();
};
$('selClear').onclick = ()=>{ selected.clear(); renderLB(); updateBar(); };
document.querySelectorAll('.sel-bar [data-bulk]').forEach(b=>{
  b.onclick = (e)=>{ e.stopPropagation(); if(!selected.size) return; if(b.dataset.bulk==='adv'){ openStageMenu(b,[...selected],true); } else { setStatus([...selected], b.dataset.bulk); selected.clear(); updateBar(); } };
});

/* ===== stage dropdown ===== */
const STAGES = [['fact_check','Recruiter Screen'],['supervisor_account','Hiring Manager Screen'],['groups','Onsite Interview'],['local_offer','Offer']];
const smCss = document.createElement('style');
smCss.textContent = '.stage-menu{position:fixed;z-index:120;width:236px;background:#fff;border-radius:12px;box-shadow:0 8px 24px rgba(26,33,46,0.16),0 2px 8px rgba(26,33,46,0.08);padding:6px;display:none}.stage-menu .sm-h{font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#69717f;padding:8px 12px 4px}.stage-menu .sm-i{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;font-size:14px;font-weight:500;color:#343c4c;cursor:pointer}.stage-menu .sm-i:hover{background:#f6f7f8}.stage-menu .sm-i .material-icons-round{font-size:18px;color:#69717f}';
document.head.appendChild(smCss);
const stageMenu = document.createElement('div');
stageMenu.className = 'stage-menu';
stageMenu.innerHTML = '<div class="sm-h">Advance to stage</div>' + STAGES.map(s=>`<div class="sm-i" data-stage="${s[1]}"><span class="material-icons-round">${s[0]}</span>${s[1]}</div>`).join('');
document.body.appendChild(stageMenu);
let stageIds = [], stageBulk = false;
function openStageMenu(anchor, ids, bulk){
  stageIds = ids; stageBulk = bulk;
  const r = anchor.getBoundingClientRect();
  stageMenu.style.display = 'block';
  const mw = stageMenu.offsetWidth, mh = stageMenu.offsetHeight;
  let left = Math.max(12, Math.min(r.left, innerWidth - mw - 12));
  let top = r.bottom + 6;
  if (top + mh > innerHeight - 12) top = r.top - mh - 6;
  stageMenu.style.left = left + 'px';
  stageMenu.style.top = top + 'px';
}
function hideStageMenu(){ stageMenu.style.display = 'none'; }
stageMenu.addEventListener('click', e=>{
  e.stopPropagation();
  const it = e.target.closest('[data-stage]');
  if (!it) return;
  const names = stageIds.length===1 ? C[stageIds[0]].first : `${stageIds.length} candidates`;
  setStatus(stageIds, 'adv');
  toast(`${names} advanced to ${it.dataset.stage}`);
  if (stageBulk){ selected.clear(); updateBar(); }
  hideStageMenu();
});
document.addEventListener('click', e=>{ if(e.target.closest('[data-ract],[data-bulk],.act-btn,.stage-menu')) return; hideStageMenu(); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape') hideStageMenu(); });

/* ===== sort ===== */
const setSort = m => { sortMode = m; };

/* ===== AI filter ===== */
const FILTERS = {
  dsa: { label:'Scored 3+ on DSA and wrote syntactically correct code', f:c=>c.dsa>=3 && c.syntaxOk },
  codersWeakComm: { label:'Strong coders who are weak communicators', f:c=>c.coding>=3.75 && c.comm<3.5 },
  commWeakCode: { label:'Great communication but weak code', f:c=>c.comm>=3.75 && c.coding<3.5 },
  top3: { label:'Top 3 candidates', f:c=>c.rank<=3 },
  allTests: { label:'Passed all tests', f:c=>c.passed===c.total },
  ps: { label:'Strong problem solving', f:c=>c.ps>=3.75 }
};
function applyFilter(key, freeText){
  const def = FILTERS[key] || FILTERS.dsa;
  activeBucket = null;
  visible = C.filter(def.f).map(c=>c.i);
  $('aiBanner').classList.add('on');
  $('aiBannerTxt').textContent = `${freeText || def.label} — ${visible.length} of 20 candidates match`;
  selected = new Set([...selected].filter(i=>visible.includes(i)));
  collapseFab();
  if (!$('lbView').hidden) renderLB();
  else { if(!visible.includes(current) && visible.length) current = visible[0]; renderDL(); renderDetail(); }
  updateBar();
}
$('aiClear').onclick = ()=>{
  visible = baseIds();
  activeBucket = null;
  $('aiBanner').classList.remove('on');
  if (!$('lbView').hidden) renderLB(); else { renderDL(); renderDetail(); }
  updateBar();
};
function collapseFab(){ $('fltFab').classList.remove('open'); const i=$('aiInput'); if(i && document.activeElement===i) i.blur(); }
$('aiFromBar').onclick = ()=>{ $('fltFab').classList.add('open'); setTimeout(()=>$('aiInput').focus(),200); };
document.addEventListener('keydown', e=>{ if(e.key==='Escape') collapseFab(); });
document.addEventListener('click', e=>{ if(!$('fltFab').contains(e.target) && !e.target.closest('#aiFromBar')) collapseFab(); });
document.querySelectorAll('.sug-chip').forEach(ch=>{ ch.onclick = ()=>applyFilter(ch.dataset.q); });
function sendQuery(){
  const q = $('aiInput').value.trim();
  if (!q) return;
  const l = q.toLowerCase();
  let key = 'dsa';
  if (l.includes('communicat') && l.includes('weak code')) key='commWeakCode';
  else if (l.includes('weak communicat')) key='codersWeakComm';
  else if (l.includes('top 3')) key='top3';
  else if (l.includes('test')) key='allTests';
  else if (l.includes('problem')) key='ps';
  applyFilter(key, q);
  $('aiInput').value='';
}
$('aiSend').onclick = sendQuery;
$('aiInput').addEventListener('keydown', e=>{ if(e.key==='Enter') sendQuery(); });

/* ===== floating Ask AI ===== */
let askOpen = false;
function renderAsk(c){
  $('askWrap').innerHTML = `<div class="ai-ask-in">
    <div class="ai-ask-head"><span class="material-icons-round">auto_awesome</span>Ask AI about ${c.first}<button class="icon-btn x" id="askCollapse" title="Collapse"><span class="material-icons-round">close</span></button></div>
    <div class="ai-ask-row">
      <input id="askInput" type="text" placeholder="'how were the edge cases handled?', 'any integrity concerns?'..." />
      <button class="ai-send" id="askSend" title="Ask"><span class="material-icons-round">send</span></button>
    </div>
    <div class="ai-ask-chips">
      <button class="sug-chip" data-ask="edge">How were edge cases handled?</button>
      <button class="sug-chip" data-ask="integrity">Any integrity concerns?</button>
      <button class="sug-chip" data-ask="summary">Summarize in 2 lines</button>
      <button class="sug-chip" data-ask="compare">How does ${c.first} compare to the top 3?</button>
    </div>
    <div class="ai-answer" id="askAnswer"><span class="material-icons-round">auto_awesome</span><div id="askAnswerTxt"></div></div>
  </div>`;
  $('askFab').innerHTML = `<span class="material-icons-round">auto_awesome</span>Ask AI about ${c.first}`;
  const ask = q => {
    const a = answerFor(c, q);
    $('askAnswerTxt').innerHTML = `<span class="q">${q}</span><br>${a}`;
    $('askAnswer').classList.add('on');
  };
  $('askSend').onclick = ()=>{ const q=$('askInput').value.trim(); if(q){ ask(q); $('askInput').value=''; } };
  $('askInput').addEventListener('keydown', e=>{ if(e.key==='Enter'){ const q=e.target.value.trim(); if(q){ ask(q); e.target.value=''; } } });
  $('askWrap').querySelectorAll('[data-ask]').forEach(b=>{ b.onclick = ()=>ask(b.textContent); });
  $('askCollapse').onclick = ()=>setAsk(false);
  syncAsk();
}
function setAsk(open){ askOpen = open; syncAsk(); if(open) setTimeout(()=>$('askInput').focus(),100); }
function syncAsk(){
  const detail = !$('dtView').hidden;
  $('askWrap').classList.toggle('on', detail && askOpen);
  $('askFab').classList.toggle('on', detail && !askOpen);
  $('fltFab').classList.toggle('off', detail);
}
$('askFab').onclick = ()=>setAsk(true);

function answerFor(c, q){
  const l = q.toLowerCase();
  if (l.includes('edge')) return c.coding>=3.75 ? `${c.first} identified null, empty-array and duplicate-value cases before coding, and covered them explicitly — all ${c.total} tests passed on the first run.` : `${c.first} handled the happy path first and only addressed edge cases after prompting — ${c.total-c.passed} of ${c.total} tests failed on boundary inputs.`;
  if (l.includes('integrity') || l.includes('concern') || l.includes('flag')) return c.proctor ? (c.flags?`${c.flags} low-severity flags (brief gaze shifts); no tab switches or secondary devices detected. Safe to proceed.`:'No integrity flags — clean proctoring throughout the session.') : `${c.flags} flags at HIGH severity, including repeated off-screen gaze and a tab switch during the coding round. Recommend a supervised follow-up before advancing.`;
  if (l.includes('summar')) return `${assessFor(c)} Overall ${c.score.toFixed(1)}/5 — ranked #${order().findIndex(x=>x.i===c.i)+1} of ${order().length}.`;
  if (l.includes('compare') || l.includes('top 3')) { const t = order().slice(0,3); const gap = (t[0].score-c.score).toFixed(1); return t.some(x=>x.i===c.i) ? `${c.first} is already in the top 3 — strongest on ${c.coding>=c.comm?'coding':'communication'} (${Math.max(c.coding,c.comm).toFixed(1)}).` : `${c.first} trails the leader by ${gap} points — comparable on ${c.coding>=c.comm?'coding':'communication'}, but the top 3 average fewer failed tests and cleaner proctoring.`; }
  return `${c.first} scored ${c.score.toFixed(1)} overall — coding ${c.coding.toFixed(1)}, communication ${c.comm.toFixed(1)}, problem solving ${c.ps.toFixed(1)}; ${c.passed}/${c.total} tests passed${c.proctor?', clean proctoring':''}.`;
}

/* ===== toast ===== */
let toastTimer;
function toast(msg){
  $('toastTxt').textContent = msg;
  $('toast').classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>$('toast').classList.remove('on'), 2600);
}

/* ===== centers dropdown ===== */
const cBtn = $('centersBtn'), cMenu = $('centersMenu');
cBtn.addEventListener('click', e=>{
  e.stopPropagation();
  const open = cMenu.classList.toggle('open');
  cBtn.classList.toggle('open', open);
  cBtn.setAttribute('aria-expanded', open);
});
document.addEventListener('click', e=>{ if(!cMenu.contains(e.target) && e.target!==cBtn){ cMenu.classList.remove('open'); cBtn.classList.remove('open'); } });

/* ===== init ===== */
const ct = $('curToggle');
if (ct) ct.onclick = ()=>{
  curatedOn = !curatedOn;
  activeBucket = null;
  visible = baseIds();
  $('aiBanner').classList.remove('on');
  ct.textContent = curatedOn ? 'View all 20' : 'Show top 10 only';
  selected = new Set([...selected].filter(i=>visible.includes(i)));
  renderLB(); updateBar();
};
renderLB(); updateBar();
