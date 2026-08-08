const KEY="jeeTrackerProV3";
const chapters=[
["Physics","Units & Measurements"],["Physics","Kinematics"],["Physics","Laws of Motion"],["Physics","Work, Energy & Power"],["Physics","System of Particles & Rotational Motion"],["Physics","Gravitation"],["Physics","Properties of Solids & Liquids"],["Physics","Thermodynamics"],["Physics","Kinetic Theory"],["Physics","Oscillations"],["Physics","Waves"],["Physics","Electrostatics"],["Physics","Current Electricity"],["Physics","Magnetic Effects of Current & Magnetism"],["Physics","Electromagnetic Induction"],["Physics","Alternating Current"],["Physics","Electromagnetic Waves"],["Physics","Optics"],["Physics","Dual Nature of Matter & Radiation"],["Physics","Atoms & Nuclei"],["Physics","Electronic Devices"],
["Chemistry","Some Basic Concepts of Chemistry"],["Chemistry","Atomic Structure"],["Chemistry","Chemical Bonding"],["Chemistry","Chemical Thermodynamics"],["Chemistry","Equilibrium"],["Chemistry","Redox Reactions"],["Chemistry","Solutions"],["Chemistry","Electrochemistry"],["Chemistry","Chemical Kinetics"],["Chemistry","Periodic Classification & Periodicity"],["Chemistry","p-Block Elements"],["Chemistry","d- and f-Block Elements"],["Chemistry","Coordination Compounds"],["Chemistry","Purification & Characterisation of Organic Compounds"],["Chemistry","Some Basic Principles of Organic Chemistry (GOC)"],["Chemistry","Hydrocarbons"],["Chemistry","Organic Compounds Containing Halogens"],["Chemistry","Organic Compounds Containing Oxygen"],["Chemistry","Organic Compounds Containing Nitrogen"],["Chemistry","Biomolecules"],["Chemistry","Practical Chemistry"],
["Maths","Sets, Relations & Functions"],["Maths","Complex Numbers & Quadratic Equations"],["Maths","Matrices & Determinants"],["Maths","Permutations & Combinations"],["Maths","Binomial Theorem"],["Maths","Sequence & Series"],["Maths","Trigonometry"],["Maths","Straight Lines"],["Maths","Circle"],["Maths","Conic Sections"],["Maths","Limits, Continuity & Differentiability"],["Maths","Integral Calculus"],["Maths","Differential Equations"],["Maths","Coordinate Geometry"],["Maths","Statistics & Probability"],["Maths","Vector Algebra"],["Maths","Three Dimensional Geometry"]
];
const fresh=()=>({
 profile:{name:"",exam:"JEE Main + Advanced",attempt:"JEE 2027",goal:""},
 dates:{board:"",main:"",advanced:""}, onboarded:false,
 chapters:chapters.map(([subject,name],i)=>({id:i+1,subject,name,status:"Not Started",priority:"Normal"})),
 tasks:[], daily:[], pyqs:[], tests:[], revisions:[], mistakes:[], boardTasks:[],
 boardSubjects:[["Physics",0],["Chemistry",0],["Mathematics",0],["English",0],["Computer Science",0]],
 targets:{hours:8,pyqs:30,qs:80},subjectChecks:{},theme:"dark"
});
let data=JSON.parse(localStorage.getItem(KEY)||"null")||fresh();
data.profile=data.profile||fresh().profile; data.dates=data.dates||fresh().dates;
data.tasks=data.tasks||[]; data.subjectChecks=data.subjectChecks||{}; data.revisions=data.revisions||[]; data.boardTasks=data.boardTasks||[]; data.boardSubjects=data.boardSubjects||fresh().boardSubjects; data.mistakes=data.mistakes||[]; data.daily=data.daily||[]; data.pyqs=data.pyqs||[]; data.tests=data.tests||[];
if(data.onboarded===undefined)data.onboarded=!!data.profile.name;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const todayISO=()=>new Date().toISOString().slice(0,10);
const fmt=d=>d?new Date(d+"T00:00:00").toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"—";
const pct=(n,d)=>d?Math.round(n/d*100):0;
const uid=()=>Date.now()+Math.random().toString(16).slice(2);
const toast=m=>{let t=$("#toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)};
function save(){localStorage.setItem(KEY,JSON.stringify(data));$("#saveStatus").textContent="Saved • "+new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});renderAll()}
function nav(page){$$(".page").forEach(x=>x.classList.remove("active"));$("#page-"+page).classList.add("active");$$(".nav-btn").forEach(x=>x.classList.toggle("active",x.dataset.page===page));$("#pageTitle").textContent=page==="dashboard"?"Dashboard":page==="board"?"CBSE Boards":page.replace(/^\w/,c=>c.toUpperCase());history.replaceState(null,"","#"+page);renderAll()}
$$(".nav-btn").forEach(b=>b.onclick=()=>nav(b.dataset.page)); $$("[data-go]").forEach(b=>b.onclick=()=>nav(b.dataset.go));
$("#today").textContent=new Date().toLocaleDateString("en-IN",{weekday:"short",day:"2-digit",month:"short",year:"numeric"});
$("#themeBtn").onclick=()=>{data.theme=data.theme==="light"?"dark":"light";applyTheme();save()};
function applyTheme(){document.body.classList.toggle("light",data.theme==="light");$("#themeBtn").textContent=data.theme==="light"?"☾":"☼"} applyTheme();

function daysLeft(date){if(!date)return null;const end=new Date(date+"T23:59:59"),now=new Date();return Math.max(0,Math.ceil((end-now)/86400000))}
function countdownCard(label,date,cls){const n=daysLeft(date);return `<div class="count-card ${cls||""}"><div><b>${label}</b><small>${date?fmt(date):"Date not set"}</small></div><strong>${n===null?"—":n}</strong><span>days left</span></div>`}
function renderCountdowns(){const s=`${countdownCard("CBSE Boards",data.dates.board,"board")}${countdownCard("JEE Main",data.dates.main,"main")}${countdownCard("JEE Advanced",data.dates.advanced,"advanced")}`;$("#examCountdowns").innerHTML=s;$("#boardCountdownLarge").innerHTML=s}

function taskSeed(){
 if(!data.tasks.some(t=>t.date===todayISO())) {
  [["Class","Attend / complete today's class"],["Notes","Make clean class notes"],["HW","Finish homework / DPP"],["PYQ","Solve today's PYQs"],["Revision","Revise yesterday's work"]].forEach(([kind,title])=>data.tasks.push({id:uid(),date:todayISO(),kind,title,subject:"",done:false,time:""}));
 }
}
function taskIcon(k){return {Class:"🎓",Notes:"📒",HW:"📝",PYQ:"◇",Revision:"↻","Mock Test":"★",Other:"•"}[k]||"•"}
function renderTasks(target="#taskList",filter="all",date=todayISO()){
 const arr=data.tasks.filter(t=>t.date===date&&(filter==="all"||(filter==="done"?t.done:!t.done)));
 if(!arr.length){$(target).innerHTML=`<div class="empty">No tasks here. Add one to keep the day moving.</div>`;return}
 $(target).innerHTML=arr.map(t=>`<div class="task-row ${t.done?"done":""}"><label class="check"><input type="checkbox" data-task="${t.id}" ${t.done?"checked":""}><span></span></label><div class="task-icon">${taskIcon(t.kind)}</div><div class="task-main"><b>${esc(t.title)}</b><small>${esc(t.subject||t.kind)} ${t.time?"• "+esc(t.time):""}</small></div><select class="compact" data-task-kind="${t.id}"><option ${t.kind==="Class"?"selected":""}>Class</option><option ${t.kind==="Notes"?"selected":""}>Notes</option><option ${t.kind==="HW"?"selected":""}>HW</option><option ${t.kind==="PYQ"?"selected":""}>PYQ</option><option ${t.kind==="Revision"?"selected":""}>Revision</option><option ${t.kind==="Mock Test"?"selected":""}>Mock Test</option><option ${t.kind==="Other"?"selected":""}>Other</option></select><button class="delete" data-del-task="${t.id}">×</button></div>`).join("");
}
document.addEventListener("change",e=>{
 if(e.target.dataset.subcheck){toggleSubjectCheck(decodeURIComponent(e.target.dataset.subcheck),decodeURIComponent(e.target.dataset.itemcheck),e.target.checked);return}

 if(e.target.dataset.task){let t=data.tasks.find(x=>x.id==e.target.dataset.task);if(t){t.done=e.target.checked;save();}}
 if(e.target.dataset.taskKind){let t=data.tasks.find(x=>x.id==e.target.dataset.taskKind);if(t){t.kind=e.target.value;save();}}
 if(e.target.dataset.status){let c=data.chapters.find(x=>x.id==e.target.dataset.status);if(c){c.status=e.target.value;save();}}
 if(e.target.dataset.priority){let c=data.chapters.find(x=>x.id==e.target.dataset.priority);if(c){c.priority=e.target.value;save();}}
 if(e.target.dataset.revDone){let r=data.revisions.find(x=>x.id==e.target.dataset.revDone);if(r){r.done=e.target.checked;save();}}
 if(e.target.dataset.boardDone){let r=data.boardTasks.find(x=>x.id==e.target.dataset.boardDone);if(r){r.done=e.target.checked;save();}}
});
document.addEventListener("click",e=>{
 const d=e.target.closest("[data-del-task]");if(d){data.tasks=data.tasks.filter(t=>t.id!=d.dataset.delTask);save();return}
 const q=e.target.closest("[data-kind]");if(q){quickAdd(q.dataset.kind);return}
});


const CHECK_ITEMS=["Class Attend","Notes","HW / DPP","PYQ","Revision","Test"];
const CHECK_SUBJECTS=["Physics","Chemistry","Maths","English","Computer Science"];
function ensureChecks(){
 const d=todayISO();
 if(!data.subjectChecks[d]) data.subjectChecks[d]={};
 CHECK_SUBJECTS.forEach(s=>{if(!data.subjectChecks[d][s])data.subjectChecks[d][s]={};CHECK_ITEMS.forEach(k=>{if(typeof data.subjectChecks[d][s][k]!=="boolean")data.subjectChecks[d][s][k]=false})});
}
function checkKey(s,k){return `${s}||${k}`}
function toggleSubjectCheck(subject,item,checked){
 ensureChecks(); data.subjectChecks[todayISO()][subject][item]=checked; save(); renderSubjectChecklist(); renderDashboardChecklist();
}
function renderSubjectChecklist(){
 ensureChecks();
 const d=data.subjectChecks[todayISO()];
 const done=Object.values(d).reduce((n,o)=>n+CHECK_ITEMS.filter(k=>o[k]).length,0), total=CHECK_SUBJECTS.length*CHECK_ITEMS.length;
 const sum=$("#subjectTaskSummary"); if(sum)sum.textContent=`${done}/${total} completed`;
 const dt=$("#checklistDate"); if(dt)dt.textContent=new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"short",year:"numeric"});
 const makeRow=(s,mini=false)=>{
   const o=d[s]; const count=CHECK_ITEMS.filter(k=>o[k]).length;
   return `<div class="${mini?"dash-subject-card":"subject-check-row"} ${count===CHECK_ITEMS.length?"is-complete":""}">
     ${mini?`<div class="dash-subject-head"><b>${s}</b><small>${count}/${CHECK_ITEMS.length}</small></div><div class="dash-mini-checks">`:`<div class="subject-name">${s}</div>`}
     ${CHECK_ITEMS.map(k=>`<div class="check-cell"><label title="${k}"><input type="checkbox" data-subcheck="${encodeURIComponent(s)}" data-itemcheck="${encodeURIComponent(k)}" ${o[k]?"checked":""}><span>${k}</span></label></div>`).join("")}
     ${mini?"</div>":""}</div>`;
 };
 const full=$("#subjectChecklist");
 if(full)full.innerHTML=`<div class="subject-check-grid"><div class="subject-check-row header"><div>Subject</div>${CHECK_ITEMS.map(k=>`<div>${k}</div>`).join("")}</div>${CHECK_SUBJECTS.map(s=>makeRow(s)).join("")}</div>`;
 const dash=$("#subjectChecklistDash");
 if(dash)dash.innerHTML=`<div class="dash-checklist">${CHECK_SUBJECTS.map(s=>makeRow(s,true)).join("")}</div>`;
}
function renderDashboardChecklist(){renderSubjectChecklist();}
function renderDashboard(){
  renderSubjectChecklist();
 const total=data.chapters.length, done=data.chapters.filter(c=>["Done","Revised","Mastered"].includes(c.status)).length, overall=pct(done,total);
 $("#overallPct").textContent=overall+"%";$("#overallRing").style.setProperty("--p",overall+"%");
 $("#welcomeTitle").innerHTML=data.profile.name?`Welcome, ${esc(data.profile.name)} 👋<br><span>Let's crack ${esc(data.profile.attempt||"JEE")}.</span>`:`Build consistency. <span>Crack JEE.</span>`;
 $("#goalLine").textContent=data.profile.goal?`Target: ${esc(data.profile.goal)} • ${esc(data.profile.exam)}`:"Your dashboard for JEE Main, Advanced and CBSE Boards.";
 renderCountdowns();
 const today=data.tasks.filter(t=>t.date===todayISO()), doneTasks=today.filter(t=>t.done).length;
 const hours=data.daily.filter(x=>x.date===todayISO()).reduce((a,x)=>a+Number(x.hours),0);
 const pyq=data.pyqs.reduce((a,x)=>a+Number(x.solved||0),0);
 $("#statCards").innerHTML=`<div class="stat"><span>Today's hours</span><b>${hours.toFixed(1)}h</b><small>Target ${data.targets.hours}h</small></div><div class="stat"><span>Today's checklist</span><b>${doneTasks}/${today.length}</b><small>${pct(doneTasks,today.length)}% complete</small></div><div class="stat"><span>PYQs solved</span><b>${pyq}</b><small>Keep the streak alive</small></div><div class="stat"><span>Tests logged</span><b>${data.tests.length}</b><small>Analyze every test</small></div>`;
 renderTasks("#dashTasks");
 $("#subjectProgress").innerHTML=["Physics","Chemistry","Maths"].map(s=>{let a=data.chapters.filter(c=>c.subject===s),d=a.filter(c=>["Done","Revised","Mastered"].includes(c.status)).length;return `<div class="progress-line"><div><b>${s}</b><span>${d}/${a.length}</span></div><div class="bar"><i style="width:${pct(d,a.length)}%"></i></div></div>`}).join("");
 const rev=data.revisions.filter(r=>!r.done).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,4);
 $("#dashRevision").innerHTML=rev.length?rev.map(r=>`<div class="list-row"><span class="dot"></span><div><b>${esc(r.chapter)}</b><small>${fmt(r.date)} • ${esc(r.subject)}</small></div><span class="tag">${daysLeft(r.date)===0?"Today":daysLeft(r.date)+"d"}</span></div>`).join(""):`<div class="empty">Revision queue is clear 🎉</div>`;
 const back=data.chapters.filter(c=>c.status==="Not Started"||c.priority==="High").slice(0,5);
 $("#dashBacklog").innerHTML=back.length?back.map(c=>`<div class="list-row"><span class="priority-dot ${c.priority==="High"?"hot":""}"></span><div><b>${esc(c.name)}</b><small>${c.subject}</small></div><span class="tag">${c.priority}</span></div>`).join(""):`<div class="empty">No urgent backlog.</div>`;
 renderWeekChart();
}
function renderWeekChart(){let days=[];for(let i=6;i>=0;i--){let d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-i);let iso=d.toISOString().slice(0,10),h=data.daily.filter(x=>x.date===iso).reduce((a,x)=>a+Number(x.hours),0);days.push({d:d.toLocaleDateString("en-IN",{weekday:"short"}),h})}let max=Math.max(1,...days.map(x=>x.h));$("#weekChart").innerHTML=days.map(x=>`<div class="week-col"><span>${x.h.toFixed(1)}</span><div class="week-bar"><i style="height:${Math.max(5,x.h/max*100)}%"></i></div><small>${x.d}</small></div>`).join("")}

function renderPlanner(){
  renderSubjectChecklist();const arr=data.tasks.filter(t=>t.date===todayISO()),done=arr.filter(t=>t.done).length;$("#taskSummary").textContent=`${done}/${arr.length} complete`;renderTasks("#taskList",$("#taskFilter").value);$("#dayTimeline").innerHTML=arr.length?arr.map(t=>`<div class="timeline-row"><span class="timeline-dot ${t.done?"done":""}"></span><div><b>${taskIcon(t.kind)} ${esc(t.title)}</b><small>${t.time||"Flexible"} • ${t.done?"Completed":"Pending"}</small></div></div>`).join(""):`<div class="empty">Add tasks to create your timeline.</div>`}
$("#taskFilter").onchange=renderPlanner;
function quickAdd(kind){openModal("Add "+kind,`<form id="quickForm" class="form-grid"><label>Task title<input id="qt" required value="${kind} — "></label><label>Subject<select id="qs"><option>Physics</option><option>Chemistry</option><option>Maths</option><option>Boards</option><option>Other</option></select></label><label>Time<input id="qtime" type="time"></label><button class="primary wide">Add to Today</button></form>`);$("#quickForm").onsubmit=e=>{e.preventDefault();data.tasks.push({id:uid(),date:todayISO(),kind,title:$("#qt").value,subject:$("#qs").value,time:$("#qtime").value,done:false});closeModal();save();toast("Task added")}}
$("#addTaskBtn").onclick=()=>quickAdd("Other");$("#quickTasks").onclick=e=>{let b=e.target.closest("[data-kind]");if(b)quickAdd(b.dataset.kind)};

function renderSyllabus(){let q=$("#syllabusSearch").value.toLowerCase(),sf=$("#subjectFilter").value,st=$("#statusFilter").value;let a=data.chapters.filter(c=>(!q||c.name.toLowerCase().includes(q))&&(sf==="All"||c.subject===sf)&&(st==="All"||c.status===st));$("#syllabusList").innerHTML=a.map(c=>`<div class="chapter-row"><div class="subject-pill ${c.subject.toLowerCase()}">${c.subject}</div><div class="chapter-name"><b>${esc(c.name)}</b><small>${c.priority==="High"?"High priority":"Normal priority"}</small></div><select data-status="${c.id}" class="compact"><option ${c.status==="Not Started"?"selected":""}>Not Started</option><option ${c.status==="In Progress"?"selected":""}>In Progress</option><option ${c.status==="Done"?"selected":""}>Done</option><option ${c.status==="Revised"?"selected":""}>Revised</option><option ${c.status==="Mastered"?"selected":""}>Mastered</option></select><select data-priority="${c.id}" class="compact"><option ${c.priority==="Normal"?"selected":""}>Normal</option><option ${c.priority==="High"?"selected":""}>High</option></select></div>`).join("")||`<div class="empty">No chapters found.</div>`}
["#syllabusSearch","#subjectFilter","#statusFilter"].forEach(s=>$(s).oninput=renderSyllabus);
$("#addChapterBtn").onclick=()=>openModal("Add Chapter",`<form id="chapterForm" class="form-grid"><label>Subject<select id="cs"><option>Physics</option><option>Chemistry</option><option>Maths</option></select></label><label>Chapter<input id="cn" required></label><label>Priority<select id="cp"><option>Normal</option><option>High</option></select></label><button class="primary wide">Add Chapter</button></form>`);

function renderDaily(){const total=data.daily.reduce((a,x)=>a+Number(x.hours),0),week=data.daily.filter(x=>{let d=new Date(x.date+"T00:00:00"),n=new Date();return (n-d)/86400000<7}).reduce((a,x)=>a+Number(x.hours),0);$("#studySummary").innerHTML=`<div class="big-number">${week.toFixed(1)}h</div><p class="muted">last 7 days • target ${data.targets.hours*7}h</p><div class="bar"><i style="width:${Math.min(100,week/(data.targets.hours*7)*100)}%"></i></div><div class="metric-grid"><span>Total <b>${total.toFixed(1)}h</b></span><span>Sessions <b>${data.daily.length}</b></span></div>`;$("#dailyList").innerHTML=data.daily.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(x=>`<div class="list-row"><div><b>${fmt(x.date)} • ${esc(x.subject)}</b><small>${esc(x.topic||"Study")} ${x.notes?"• "+esc(x.notes):""}</small></div><strong>${Number(x.hours).toFixed(1)}h</strong></div>`).join("")||`<div class="empty">No study sessions yet.</div>`}
$("#dDate").value=todayISO();$("#dailyForm").onsubmit=e=>{e.preventDefault();data.daily.push({id:uid(),date:$("#dDate").value,subject:$("#dSubject").value,hours:Number($("#dHours").value),topic:$("#dTopic").value,notes:$("#dNotes").value});e.target.reset();$("#dDate").value=todayISO();save();toast("Study session saved")};
$("#clearDaily").onclick=()=>{if(confirm("Clear all study history?")){data.daily=[];save()}};

function renderPyq(){let solved=data.pyqs.reduce((a,x)=>a+Number(x.solved||0),0),correct=data.pyqs.reduce((a,x)=>a+Number(x.correct||0),0);$("#pyqStats").innerHTML=`<div class="stat"><span>Solved</span><b>${solved}</b></div><div class="stat"><span>Correct</span><b>${correct}</b></div><div class="stat"><span>Accuracy</span><b>${pct(correct,solved)}%</b></div>`;$("#pyqList").innerHTML=data.pyqs.slice().reverse().map(x=>`<div class="list-row"><div><b>${esc(x.chapter)}</b><small>${esc(x.subject)} • ${x.year||"Mixed"} • ${x.level||"JEE Main"}</small></div><span>${x.solved} Q • ${x.correct} ✓</span></div>`).join("")||`<div class="empty">Add your first PYQ record.</div>`}
$("#addPyqBtn").onclick=()=>openModal("Add PYQ Record",`<form id="pyqForm" class="form-grid"><label>Subject<select id="ps"><option>Physics</option><option>Chemistry</option><option>Maths</option></select></label><label>Chapter<input id="pc" required></label><label>Year<input id="py" placeholder="2025"></label><label>Level<select id="pl"><option>JEE Main</option><option>JEE Advanced</option></select></label><label>Solved<input id="pq" type="number" min="1" required></label><label>Correct<input id="pcr" type="number" min="0" required></label><button class="primary wide">Save PYQ</button></form>`);

function renderTests(){let best=data.tests.length?Math.max(...data.tests.map(x=>Number(x.score)||0)):0,avg=data.tests.length?Math.round(data.tests.reduce((a,x)=>a+Number(x.score||0),0)/data.tests.length):0;$("#testStats").innerHTML=`<div class="stat"><span>Tests</span><b>${data.tests.length}</b></div><div class="stat"><span>Best score</span><b>${best}</b></div><div class="stat"><span>Average</span><b>${avg}</b></div>`;$("#testList").innerHTML=data.tests.slice().reverse().map(x=>`<div class="list-row"><div><b>${esc(x.name)}</b><small>${fmt(x.date)} • ${esc(x.exam)}</small></div><span>${x.score}/${x.total} • ${x.accuracy}%</span></div>`).join("")||`<div class="empty">No tests logged.</div>`}
$("#addTestBtn").onclick=()=>openModal("Log Mock Test",`<form id="testForm" class="form-grid"><label>Test name<input id="tn" required placeholder="Full syllabus mock"></label><label>Date<input id="td" type="date" value="${todayISO()}"></label><label>Exam<select id="te"><option>JEE Main</option><option>JEE Advanced</option><option>CBSE Board</option></select></label><label>Score<input id="ts" type="number" required></label><label>Total marks<input id="tt" type="number" value="300" required></label><button class="primary wide">Save Test</button></form>`);

function renderRevision(){let a=data.revisions.slice().sort((x,y)=>x.date.localeCompare(y.date));$("#revisionList").innerHTML=a.map(r=>`<div class="task-row ${r.done?"done":""}"><label class="check"><input type="checkbox" data-rev-done="${r.id}" ${r.done?"checked":""}><span></span></label><div class="task-main"><b>${esc(r.chapter)}</b><small>${esc(r.subject)} • ${fmt(r.date)}</small></div><span class="tag">${r.done?"Done":daysLeft(r.date)===0?"Due today":daysLeft(r.date)+" days"}</span></div>`).join("")||`<div class="empty">No revision scheduled.</div>`}
$("#addRevisionBtn").onclick=()=>openModal("Schedule Revision",`<form id="revForm" class="form-grid"><label>Subject<select id="rs"><option>Physics</option><option>Chemistry</option><option>Maths</option></select></label><label>Chapter<input id="rc" required></label><label>Revision date<input id="rd" type="date" value="${todayISO()}"></label><button class="primary wide">Schedule</button></form>`);

function renderMistakes(){$("#mistakeList").innerHTML=data.mistakes.slice().reverse().map(m=>`<div class="mistake-card"><div class="mistake-head"><b>${esc(m.chapter)}</b><span class="tag">${esc(m.subject)}</span></div><p>${esc(m.problem)}</p><small><b>Why:</b> ${esc(m.reason||"—")} • <b>Fix:</b> ${esc(m.fix||"—")}</small></div>`).join("")||`<div class="empty">Your mistake book is empty. That's okay — log errors here instead of repeating them.</div>`}
$("#addMistakeBtn").onclick=()=>openModal("Add Mistake",`<form id="mistakeForm" class="form-grid"><label>Subject<select id="ms"><option>Physics</option><option>Chemistry</option><option>Maths</option></select></label><label>Chapter<input id="mc" required></label><label class="wide">What went wrong?<textarea id="mp" required></textarea></label><label>Why did it happen?<input id="mr"></label><label>Fix / rule<input id="mf"></label><button class="primary wide">Save Mistake</button></form>`);

function renderBoard(){const a=data.boardTasks,done=a.filter(x=>x.done).length;$("#boardTasks").innerHTML=a.map(t=>`<div class="task-row ${t.done?"done":""}"><label class="check"><input type="checkbox" data-board-done="${t.id}" ${t.done?"checked":""}><span></span></label><div class="task-icon">▤</div><div class="task-main"><b>${esc(t.title)}</b><small>${esc(t.subject||"Boards")}</small></div></div>`).join("")||`<div class="empty">Add board tasks such as NCERT, derivations, sample papers and practical files.</div>`;$("#boardSubjects").innerHTML=data.boardSubjects.map((x,i)=>`<div class="board-sub"><div><b>${esc(x[0])}</b><span>${x[1]}% target progress</span></div><input type="range" min="0" max="100" value="${x[1]}" data-board-sub="${i}"></div>`).join("")}
$("#addBoardBtn").onclick=()=>openModal("Add Board Task",`<form id="boardForm" class="form-grid"><label>Task<input id="bt" required placeholder="Finish chapter notes / sample paper"></label><label>Subject<select id="bs"><option>Physics</option><option>Chemistry</option><option>Mathematics</option><option>English</option><option>Computer Science</option></select></label><button class="primary wide">Add</button></form>`);
document.addEventListener("input",e=>{if(e.target.dataset.boardSub!==undefined){data.boardSubjects[e.target.dataset.boardSub][1]=Number(e.target.value);save()}});

function renderSettings(){$("#userName").value=data.profile.name;$("#profileExam").value=data.profile.exam;$("#attempt").value=data.profile.attempt;$("#goal").value=data.profile.goal;$("#boardDate").value=data.dates.board;$("#mainDate").value=data.dates.main;$("#advDate").value=data.dates.advanced}
$("#profileForm").onsubmit=e=>{e.preventDefault();data.profile={name:$("#userName").value.trim(),exam:$("#profileExam").value,attempt:$("#attempt").value,goal:$("#goal").value.trim()};data.onboarded=true;save();toast("Profile updated")};
$("#dateForm").onsubmit=e=>{e.preventDefault();data.dates={board:$("#boardDate").value,main:$("#mainDate").value,advanced:$("#advDate").value};save();toast("Exam dates updated")};

function openModal(title,body){$("#modalTitle").textContent=title;$("#modalBody").innerHTML=body;$("#modal").classList.add("open")}
function closeModal(){$("#modal").classList.remove("open")}
$("#closeModal").onclick=closeModal;$("#modal").onclick=e=>{if(e.target.id==="modal")closeModal()};
document.addEventListener("submit",e=>{
 if(e.target.id==="chapterForm"){e.preventDefault();data.chapters.push({id:uid(),subject:$("#cs").value,name:$("#cn").value,status:"Not Started",priority:$("#cp").value});closeModal();save();toast("Chapter added")}
 if(e.target.id==="pyqForm"){e.preventDefault();data.pyqs.push({id:uid(),date:todayISO(),subject:$("#ps").value,chapter:$("#pc").value,year:$("#py").value,level:$("#pl").value,solved:Number($("#pq").value),correct:Number($("#pcr").value)});closeModal();save();toast("PYQ record saved")}
 if(e.target.id==="testForm"){e.preventDefault();let s=Number($("#ts").value),t=Number($("#tt").value);data.tests.push({id:uid(),name:$("#tn").value,date:$("#td").value,exam:$("#te").value,score:s,total:t,accuracy:pct(s,t)});closeModal();save();toast("Mock test logged")}
 if(e.target.id==="revForm"){e.preventDefault();data.revisions.push({id:uid(),subject:$("#rs").value,chapter:$("#rc").value,date:$("#rd").value,done:false});closeModal();save();toast("Revision scheduled")}
 if(e.target.id==="mistakeForm"){e.preventDefault();data.mistakes.push({id:uid(),subject:$("#ms").value,chapter:$("#mc").value,problem:$("#mp").value,reason:$("#mr").value,fix:$("#mf").value});closeModal();save();toast("Mistake added")}
 if(e.target.id==="boardForm"){e.preventDefault();data.boardTasks.push({id:uid(),subject:$("#bs").value,title:$("#bt").value,done:false});closeModal();save();toast("Board task added")}
});

$("#exportBtn").onclick=()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));a.download="jee-tracker-backup.json";a.click();toast("Backup downloaded")};
$("#importBtn").onclick=()=>$("#importFile").click();$("#importFile").onchange=e=>{let f=e.target.files[0];if(!f)return;let r=new FileReader();r.onload=()=>{try{data=JSON.parse(r.result);save();toast("Backup imported")}catch{toast("Invalid backup")}};r.readAsText(f)};

function isoDateLocal(d){
 const x=new Date(d); x.setHours(0,0,0,0);
 return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,"0")}-${String(x.getDate()).padStart(2,"0")}`;
}
function datePlus(iso,days){const d=new Date(iso+"T00:00:00");d.setDate(d.getDate()+days);return isoDateLocal(d)}
function weekStartISO(){const d=new Date();d.setHours(0,0,0,0);const day=d.getDay()||7;d.setDate(d.getDate()-(day-1));return isoDateLocal(d)}
function currentWeek(){const start=weekStartISO();return Array.from({length:7},(_,i)=>datePlus(start,i))}
function within(iso,start,end){return iso>=start&&iso<=end}
function reportHeader(title,subtitle){return `<div class="print-brand"><img src="logo.png" alt="Naresh Kuntal"><div><div class="print-kicker">JEE TRACKER • PREPARATION OS</div><h1 class="print-title">${title}</h1><div class="print-subtitle">${subtitle}</div></div></div>`}
function checkMark(v){return v?"☑":"☐"}

function buildWeeklyReport(){
 ensureChecks();
 const dates=currentWeek(), start=dates[0], end=dates[6], today=todayISO();
 const name=data.profile.name||"Student";
 const totalHours=data.daily.filter(x=>within(x.date,start,end)).reduce((n,x)=>n+Number(x.hours||0),0);
 const targetHours=Number(data.targets.hours||0)*7;
 const weekTasks=data.tasks.filter(t=>within(t.date,start,end));
 const taskDone=weekTasks.filter(t=>t.done).length;
 const weekPyq=data.pyqs.filter(x=>within(x.date||today,start,end));
 const pyqSolved=weekPyq.reduce((n,x)=>n+Number(x.solved||0),0);
 const weekTests=data.tests.filter(x=>within(x.date||today,start,end));
 const weekRev=data.revisions.filter(x=>x.done&&within(x.date||today,start,end));
 const chapterDone=data.chapters.filter(c=>["Done","Revised","Mastered"].includes(c.status)).length;
 const chapterTotal=data.chapters.length;
 const boardTarget=Math.round(data.boardSubjects.reduce((n,x)=>n+Number(x[1]||0),0)/Math.max(1,data.boardSubjects.length));
 const subjectRows=CHECK_SUBJECTS.map(subject=>{
   let done=0,total=0;
   dates.forEach(day=>{const o=data.subjectChecks[day]?.[subject]||{};CHECK_ITEMS.forEach(k=>{total++;if(o[k])done++})});
   return `<tr><td><b>${esc(subject)}</b></td><td>${done}/${total}</td><td>${pct(done,total)}%</td></tr>`;
 }).join("");
 const dayRows=dates.map(day=>{
   const hours=data.daily.filter(x=>x.date===day).reduce((n,x)=>n+Number(x.hours||0),0);
   const tasks=data.tasks.filter(t=>t.date===day); const td=tasks.filter(t=>t.done).length;
   let cd=0,ct=0; const all=data.subjectChecks[day]||{};
   CHECK_SUBJECTS.forEach(sub=>CHECK_ITEMS.forEach(k=>{ct++;if(all[sub]?.[k])cd++}));
   return `<tr class="${day===today?"today-row":""}"><td><b>${new Date(day+"T00:00:00").toLocaleDateString("en-IN",{weekday:"short"})}</b><br><small>${fmt(day)}</small></td><td>${hours.toFixed(1)} h</td><td>${td}/${tasks.length||0}</td><td>${cd}/${ct}</td></tr>`;
 }).join("");
 const tests=weekTests.length?`<table class="print-table compact-print"><tr><th>Test</th><th>Date</th><th>Exam</th><th>Score</th><th>Accuracy</th></tr>${weekTests.map(t=>`<tr><td>${esc(t.name)}</td><td>${fmt(t.date)}</td><td>${esc(t.exam)}</td><td>${t.score}/${t.total}</td><td>${t.accuracy}%</td></tr>`).join("")}</table>`:`<div class="print-note">No mock test was logged this week.</div>`;
 const backlog=data.chapters.filter(c=>c.priority==="High"&&c.status!=="Mastered").slice(0,8);
 const backlogHtml=backlog.length?`<ul class="print-list">${backlog.map(c=>`<li><b>${esc(c.subject)}</b> — ${esc(c.name)} <span>(${esc(c.status)})</span></li>`).join("")}</ul>`:`<div class="print-note">No high-priority backlog 🎉</div>`;
 const weeklyCompletion=pct(taskDone,weekTasks.length);
 const hoursCompletion=pct(totalHours,targetHours);
 $("#printReport").innerHTML=`
 ${reportHeader("Weekly Progress Report",`${esc(name)} • ${esc(data.profile.exam||"JEE Main + Advanced")} • ${esc(data.profile.attempt||"")}<br>Week: ${fmt(start)} — ${fmt(end)}`)}
 <div class="print-stat-grid">
   <div><span>Study Hours</span><b>${totalHours.toFixed(1)} h</b><small>Target ${targetHours.toFixed(1)} h • ${hoursCompletion}%</small></div>
   <div><span>Task Completion</span><b>${weeklyCompletion}%</b><small>${taskDone}/${weekTasks.length} tasks</small></div>
   <div><span>PYQs Solved</span><b>${pyqSolved}</b><small>${weekPyq.length} records</small></div>
   <div><span>Mock Tests</span><b>${weekTests.length}</b><small>${weekRev.length} revisions completed</small></div>
 </div>
 <div class="print-section"><h3>1. Daily Performance</h3><table class="print-table"><tr><th>Day</th><th>Study</th><th>Tasks</th><th>Subject Checklist</th></tr>${dayRows}</table></div>
 <div class="print-section"><h3>2. Subject Checklist — Weekly</h3><table class="print-table"><tr><th>Subject</th><th>Checks Completed</th><th>Completion</th></tr>${subjectRows}</table></div>
 <div class="print-two-col">
   <div class="print-section"><h3>3. Preparation Snapshot</h3><table class="print-table"><tr><th>JEE syllabus</th><td>${chapterDone}/${chapterTotal} completed</td></tr><tr><th>Board target average</th><td>${boardTarget}%</td></tr><tr><th>Revisions completed</th><td>${weekRev.length}</td></tr><tr><th>Mistakes in book</th><td>${data.mistakes.length}</td></tr></table></div>
   <div class="print-section"><h3>4. High-Priority Backlog</h3>${backlogHtml}</div>
 </div>
 <div class="print-section"><h3>5. Mock Tests This Week</h3>${tests}</div>
 <div class="print-footer">All rights reserved © Naresh Kuntal • JEE Tracker • Weekly report generated on ${fmt(today)}</div>`;
}

function buildDailySheet(){
 ensureChecks();
 const today=todayISO(), d=data.subjectChecks[today], tasks=data.tasks.filter(t=>t.date===today);
 const doneTasks=tasks.filter(t=>t.done).length;
 const hours=data.daily.filter(x=>x.date===today).reduce((n,x)=>n+Number(x.hours||0),0);
 const checkRows=CHECK_SUBJECTS.map(s=>`<tr><td><b>${esc(s)}</b></td>${CHECK_ITEMS.map(k=>`<td class="center-box">${checkMark(d[s][k])}</td>`).join("")}</tr>`).join("");
 const taskRows=tasks.length?tasks.map(t=>`<tr><td class="center-box">${t.done?"☑":"☐"}</td><td>${taskIcon(t.kind)}</td><td><b>${esc(t.title)}</b></td><td>${esc(t.subject||t.kind)}</td><td>${esc(t.time||"")}</td></tr>`).join(""):Array.from({length:6},()=>`<tr><td class="center-box">☐</td><td>•</td><td>________________________________</td><td>________________</td><td>________</td></tr>`).join("");
 const slots=["6:00–8:00","8:00–10:00","10:00–12:00","12:00–2:00","2:00–4:00","4:00–6:00","6:00–8:00","8:00–10:00"];
 const slotRows=slots.map(x=>`<tr><td><b>${x}</b></td><td>____________________________________________</td><td class="center-box">☐</td></tr>`).join("");
 $("#dailyPrintReport").innerHTML=`
 ${reportHeader("Daily Task Sheet",`${esc(data.profile.name||"Student")} • ${esc(data.profile.exam||"JEE Main + Advanced")} • ${fmt(today)}`)}
 <div class="print-stat-grid daily-stats"><div><span>Study Logged</span><b>${hours.toFixed(1)} h</b><small>Today</small></div><div><span>Tasks</span><b>${doneTasks}/${tasks.length}</b><small>completed</small></div><div><span>JEE Goal</span><b>${esc(data.profile.goal||"Stay consistent")}</b><small>${esc(data.profile.attempt||"")}</small></div></div>
 <div class="print-section"><h3>1. Subject Checklist — Tick as you finish</h3><table class="print-table checklist-print"><tr><th>Subject</th>${CHECK_ITEMS.map(k=>`<th>${k}</th>`).join("")}</tr>${checkRows}</table></div>
 <div class="print-section"><h3>2. Today's Task List</h3><table class="print-table"><tr><th>Done</th><th></th><th>Task</th><th>Subject</th><th>Time</th></tr>${taskRows}</table></div>
 <div class="print-section"><h3>3. Time Plan</h3><table class="print-table"><tr><th>Time</th><th>Plan / Topic</th><th>Done</th></tr>${slotRows}</table></div>
 <div class="print-two-col">
  <div class="print-section"><h3>4. Top 3 Priorities</h3><div class="write-lines">1. _______________________________________________<br>2. _______________________________________________<br>3. _______________________________________________</div></div>
  <div class="print-section"><h3>5. End-of-Day Review</h3><div class="write-lines">What went well? __________________________________<br>Biggest mistake: _________________________________<br>Tomorrow's focus: ________________________________</div></div>
 </div>
 <div class="print-footer">All rights reserved © Naresh Kuntal • JEE Tracker • Daily task sheet</div>`;
}
function printA4(type){
 $("#printReport").classList.remove("active-print"); $("#dailyPrintReport").classList.remove("active-print");
 if(type==="weekly"){buildWeeklyReport();$("#printReport").classList.add("active-print");}
 else {buildDailySheet();$("#dailyPrintReport").classList.add("active-print");}
 document.body.classList.add("is-printing");
 setTimeout(()=>window.print(),60);
}
window.onafterprint=()=>{document.body.classList.remove("is-printing");$("#printReport").classList.remove("active-print");$("#dailyPrintReport").classList.remove("active-print");};

$("#printWeeklyBtn").onclick=()=>printA4("weekly");
$("#dashWeeklyBtn").onclick=()=>printA4("weekly");
$("#printDailyBtn").onclick=()=>printA4("daily");
$("#dashDailyBtn").onclick=()=>printA4("daily");
$("#plannerDailyBtn").onclick=()=>printA4("daily");

$("#resetBtn").onclick=()=>{if(confirm("Reset ALL tracker data? This cannot be undone.")){localStorage.removeItem(KEY);location.reload()}};

let timer={sec:25*60,running:false,mode:"Focus session",id:null};
function timerPaint(){$("#timerDisplay").textContent=String(Math.floor(timer.sec/60)).padStart(2,"0")+":"+String(timer.sec%60).padStart(2,"0");$("#timerMode").textContent=timer.mode;$("#timerStart").textContent=timer.running?"Pause":"Start"}
$("#timerStart").onclick=()=>{timer.running=!timer.running;if(timer.running)timer.id=setInterval(()=>{timer.sec--;if(timer.sec<=0){clearInterval(timer.id);timer.running=false;toast("Session complete 🎉");timer.mode=timer.mode==="Focus session"?"Break":"Focus session";timer.sec=timer.mode==="Break"?5*60:25*60}timerPaint()},1000);else clearInterval(timer.id);timerPaint()};
$("#timerReset").onclick=()=>{clearInterval(timer.id);timer={sec:25*60,running:false,mode:"Focus session",id:null};timerPaint()};

function showOnboarding(){if(data.onboarded)return;$("#onboarding").classList.add("open");$("#obName").focus()}
$("#onboardingForm").onsubmit=e=>{e.preventDefault();data.profile={name:$("#obName").value.trim(),exam:$("#obExam").value,attempt:$("#obAttempt").value,goal:$("#obGoal").value.trim()};data.dates={board:$("#obBoardDate").value,main:$("#obMainDate").value,advanced:$("#obAdvDate").value};data.onboarded=true;$("#onboarding").classList.remove("open");save();toast("Dashboard created 🎉")};

function renderAll(){renderDashboard();renderPlanner();renderSyllabus();renderDaily();renderPyq();renderTests();renderRevision();renderMistakes();renderBoard();renderSettings();timerPaint();$("#sideName").textContent=data.profile.name||"Your Name";$("#sideExam").textContent=data.profile.exam||"JEE + Boards"}
taskSeed();renderAll();showOnboarding();
const hash=location.hash.replace("#","");if(hash&&$("#page-"+hash))nav(hash);
