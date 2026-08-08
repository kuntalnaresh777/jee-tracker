const KEY="jeeTrackerV1";
const chapters=[
["Physics","Units & Measurements"],["Physics","Kinematics"],["Physics","Laws of Motion"],["Physics","Work, Energy & Power"],["Physics","System of Particles & Rotational Motion"],["Physics","Gravitation"],["Physics","Properties of Solids & Liquids"],["Physics","Thermodynamics"],["Physics","Kinetic Theory"],["Physics","Oscillations"],["Physics","Waves"],["Physics","Electrostatics"],["Physics","Current Electricity"],["Physics","Magnetic Effects of Current & Magnetism"],["Physics","Electromagnetic Induction"],["Physics","Alternating Current"],["Physics","Electromagnetic Waves"],["Physics","Optics"],["Physics","Dual Nature of Matter & Radiation"],["Physics","Atoms & Nuclei"],["Physics","Electronic Devices"],["Physics","Experimental Skills"],
["Chemistry","Some Basic Concepts of Chemistry"],["Chemistry","Atomic Structure"],["Chemistry","Chemical Bonding"],["Chemistry","Chemical Thermodynamics"],["Chemistry","Equilibrium"],["Chemistry","Redox Reactions"],["Chemistry","Solutions"],["Chemistry","Electrochemistry"],["Chemistry","Chemical Kinetics"],["Chemistry","Periodic Classification & Periodicity"],["Chemistry","p-Block Elements"],["Chemistry","d- and f-Block Elements"],["Chemistry","Coordination Compounds"],["Chemistry","Purification & Characterisation of Organic Compounds"],["Chemistry","Some Basic Principles of Organic Chemistry (GOC)"],["Chemistry","Hydrocarbons"],["Chemistry","Organic Compounds Containing Halogens"],["Chemistry","Organic Compounds Containing Oxygen"],["Chemistry","Organic Compounds Containing Nitrogen"],["Chemistry","Biomolecules"],["Chemistry","Principles Related to Practical Chemistry"],
["Maths","Sets, Relations & Functions"],["Maths","Complex Numbers & Quadratic Equations"],["Maths","Matrices & Determinants"],["Maths","Permutations & Combinations"],["Maths","Binomial Theorem"],["Maths","Sequence & Series"],["Maths","Trigonometry"],["Maths","Straight Lines"],["Maths","Circle"],["Maths","Conic Sections"],["Maths","Limits, Continuity & Differentiability"],["Maths","Integral Calculus"],["Maths","Differential Equations"],["Maths","Coordinate Geometry"],["Maths","Statistics & Probability"],["Maths","Vector Algebra"],["Maths","Three Dimensional Geometry"]
];
const fresh=()=>({profile:{name:"",attempt:"JEE 2027",goal:""},chapters:chapters.map(([subject,name],i)=>({id:i+1,subject,name,status:"Not Started",priority:"Normal"})),daily:[],pyqs:[],tests:[],backlogs:[],mistakes:[],targets:{hours:8,pyqs:30,qs:80},theme:"dark"});
let data=JSON.parse(localStorage.getItem(KEY)||"null")||fresh();
if(data.chapters.length<chapters.length){const names=new Set(data.chapters.map(x=>x.name)); chapters.forEach(([s,n])=>{if(!names.has(n))data.chapters.push({id:Date.now()+Math.random(),subject:s,name:n,status:"Not Started",priority:"Normal"})})}
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const save=()=>{localStorage.setItem(KEY,JSON.stringify(data));$("#saveStatus").textContent="Saved • "+new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});renderAll()};
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const todayISO=()=>new Date().toISOString().slice(0,10);
function pct(n,d){return d?Math.round(n/d*100):0}
function statusClass(s){return s==="Mastered"||s==="Revised"||s==="Done"?"green":s==="In Progress"?"yellow":""}
function nav(page){$$(".page").forEach(x=>x.classList.remove("active"));$("#page-"+page).classList.add("active");$$(".nav-btn").forEach(x=>x.classList.toggle("active",x.dataset.page===page));$("#pageTitle").textContent=page[0].toUpperCase()+page.slice(1);history.replaceState(null,"","#"+page);renderAll()}
$$(".nav-btn").forEach(b=>b.onclick=()=>nav(b.dataset.page)); $$("[data-go]").forEach(b=>b.onclick=()=>nav(b.dataset.go));
$("#today").textContent=new Date().toLocaleDateString("en-IN",{weekday:"short",day:"2-digit",month:"short",year:"numeric"});
$("#themeBtn").onclick=()=>{data.theme=data.theme==="light"?"dark":"light";applyTheme();save()};
function applyTheme(){document.body.classList.toggle("light",data.theme==="light");$("#themeBtn").textContent=data.theme==="light"?"🌙":"☀️"} applyTheme();

function renderDashboard(){
 const total=data.chapters.length, done=data.chapters.filter(c=>["Done","Revised","Mastered"].includes(c.status)).length;
 const overall=pct(done,total); $("#overallPct").textContent=overall+"%";
 const hours=data.daily.reduce((a,x)=>a+Number(x.hours||0),0), pyq=data.pyqs.reduce((a,x)=>a+Number(x.total||0),0), tests=data.tests.length, back=data.backlogs.filter(x=>x.status!=="Done").length;
 $("#statCards").innerHTML=[["📚","Chapters",`${done}/${total}`],["⏱","Study Hours",hours.toFixed(1)],["📝","PYQs Logged",pyq],["🚧","Open Backlogs",back]].map(x=>`<div class="stat"><div class="label">${x[0]} ${x[1]}</div><div class="value">${x[2]}</div></div>`).join("");
 $("#subjectProgress").innerHTML=["Physics","Chemistry","Maths"].map(s=>{let a=data.chapters.filter(c=>c.subject===s),d=a.filter(c=>["Done","Revised","Mastered"].includes(c.status)).length;return `<div class="progress-row"><div class="row-top"><b>${s}</b><span>${d}/${a.length} • ${pct(d,a.length)}%</span></div><div class="bar"><i style="width:${pct(d,a.length)}%"></i></div></div>`}).join("");
 const td=data.daily.filter(x=>x.date===todayISO()), th=td.reduce((a,x)=>a+Number(x.hours),0);
 $("#todayPlan").innerHTML=`<div class="kpi-grid"><div class="kpi"><b>${th.toFixed(1)}h</b><span>studied today</span></div><div class="kpi"><b>${data.targets.hours}h</b><span>daily target</span></div></div><div class="muted">${th>=data.targets.hours?"🎉 Daily hours target reached!":"Keep going — "+Math.max(0,data.targets.hours-th).toFixed(1)+"h left today."}</div>`;
 const rt=data.tests.slice(-4).reverse();$("#recentTests").innerHTML=rt.length?rt.map(t=>`<div class="list-row"><div><b>${esc(t.name)}</b><div class="muted">${esc(t.date)} • ${t.marks}/${t.max} • ${t.accuracy}% accuracy</div></div><span class="badge">${t.type}</span></div>`).join(""):`<div class="empty">No mock tests yet.</div>`;
 const rb=data.backlogs.filter(x=>x.status!=="Done").slice(0,5);$("#backlogSnap").innerHTML=rb.length?rb.map(x=>`<div class="list-row"><div><b>${esc(x.title)}</b><div class="muted">${esc(x.subject)} • ${esc(x.priority)}</div></div><span class="badge ${x.priority==="High"?"red":"yellow"}">${x.status}</span></div>`).join(""):`<div class="empty">No open backlog 🎉</div>`;
}
function renderSyllabus(){
 const q=$("#syllabusSearch").value.toLowerCase(),sf=$("#subjectFilter").value,st=$("#statusFilter").value;
 let arr=data.chapters.filter(c=>(!q||c.name.toLowerCase().includes(q))&&(sf==="All"||c.subject===sf)&&(st==="All"||c.status===st));
 $("#syllabusList").innerHTML=arr.map(c=>`<div class="list-row"><div><b>${esc(c.name)}</b><div class="muted">${c.subject} • <span class="badge ${statusClass(c.status)}">${c.status}</span></div></div><div class="actions"><select class="chapter-status" data-id="${c.id}">${["Not Started","In Progress","Done","Revised","Mastered"].map(s=>`<option ${s===c.status?"selected":""}>${s}</option>`).join("")}</select><button class="small-btn chapter-revise" data-id="${c.id}">+ Revision</button></div></div>`).join("")||`<div class="empty">No chapters match.</div>`;
 $$(".chapter-status").forEach(e=>e.onchange=()=>{let c=data.chapters.find(x=>String(x.id)===e.dataset.id);c.status=e.value;save()});
 $$(".chapter-revise").forEach(e=>e.onclick=()=>{let c=data.chapters.find(x=>String(x.id)===e.dataset.id);data.chapters.find(x=>x.id===c.id).status="Revised";data.revisions=data.revisions||[];data.revisions.push({chapter:c.name,date:todayISO()});save()});
}
function renderDaily(){
 const h=data.daily.reduce((a,x)=>a+Number(x.hours),0), days=new Set(data.daily.map(x=>x.date)).size;
 $("#studySummary").innerHTML=`<div class="kpi-grid"><div class="kpi"><b>${h.toFixed(1)}</b><span>total hours</span></div><div class="kpi"><b>${days}</b><span>active days</span></div><div class="kpi"><b>${data.daily.length}</b><span>sessions</span></div><div class="kpi"><b>${data.targets.hours}h</b><span>daily target</span></div></div>`;
 $("#dailyList").innerHTML=data.daily.slice().reverse().map((x,i)=>`<div class="list-row"><div><b>${esc(x.topic||"Study session")}</b><div class="muted">${x.date} • ${x.subject} • ${x.hours}h</div>${x.notes?`<div class="muted">${esc(x.notes)}</div>`:""}</div><button class="small-btn del-daily" data-id="${x.id}">Delete</button></div>`).join("")||`<div class="empty">Log your first session.</div>`;
 $$(".del-daily").forEach(b=>b.onclick=()=>{data.daily=data.daily.filter(x=>String(x.id)!==b.dataset.id);save()});
}
function renderPyq(){
 const total=data.pyqs.reduce((a,x)=>a+Number(x.total),0),correct=data.pyqs.reduce((a,x)=>a+Number(x.correct),0),wrong=data.pyqs.reduce((a,x)=>a+Number(x.wrong),0);
 $("#pyqStats").innerHTML=`<div class="kpi-grid"><div class="kpi"><b>${total}</b><span>attempted</span></div><div class="kpi"><b>${correct}</b><span>correct</span></div><div class="kpi"><b>${wrong}</b><span>wrong</span></div><div class="kpi"><b>${pct(correct,total)}%</b><span>accuracy</span></div></div>`;
 $("#pyqList").innerHTML=data.pyqs.slice().reverse().map(x=>`<div class="list-row"><div><b>${esc(x.chapter)}</b><div class="muted">${x.subject} • ${x.year||"Year —"} • ${x.total} attempted • ${x.correct} correct</div></div><button class="small-btn del-pyq" data-id="${x.id}">Delete</button></div>`).join("")||`<div class="empty">No PYQ records yet.</div>`;
 $$(".del-pyq").forEach(b=>b.onclick=()=>{data.pyqs=data.pyqs.filter(x=>String(x.id)!==b.dataset.id);save()});
}
function renderTests(){
 const n=data.tests.length,avg=n?Math.round(data.tests.reduce((a,x)=>a+Number(x.marks)/Number(x.max)*100,0)/n):0;
 $("#testStats").innerHTML=`<div class="kpi-grid"><div class="kpi"><b>${n}</b><span>tests</span></div><div class="kpi"><b>${avg}%</b><span>avg score</span></div><div class="kpi"><b>${data.tests.length?Math.max(...data.tests.map(x=>Number(x.marks))):0}</b><span>best marks</span></div><div class="kpi"><b>${data.tests.length?Math.round(data.tests.reduce((a,x)=>a+Number(x.accuracy),0)/n):0}%</b><span>avg accuracy</span></div></div>`;
 $("#testList").innerHTML=data.tests.slice().reverse().map(x=>`<div class="list-row"><div><b>${esc(x.name)}</b><div class="muted">${x.date} • ${x.type} • ${x.marks}/${x.max} • ${x.accuracy}% accuracy${x.percentile?` • ${x.percentile} percentile`:""}</div></div><button class="small-btn del-test" data-id="${x.id}">Delete</button></div>`).join("")||`<div class="empty">Add your first mock test.</div>`;
 $$(".del-test").forEach(b=>b.onclick=()=>{data.tests=data.tests.filter(x=>String(x.id)!==b.dataset.id);save()});
}
function renderBacklog(){
 $("#backlogList").innerHTML=data.backlogs.slice().reverse().map(x=>`<div class="list-row"><div><b>${esc(x.title)}</b><div class="muted">${x.subject} • <span class="badge ${x.priority==="High"?"red":x.priority==="Medium"?"yellow":"green"}">${x.priority}</span></div></div><div class="actions"><select class="back-status" data-id="${x.id}">${["Open","In Progress","Done"].map(s=>`<option ${s===x.status?"selected":""}>${s}</option>`).join("")}</select><button class="small-btn del-back" data-id="${x.id}">×</button></div></div>`).join("")||`<div class="empty">Backlog is empty 🎉</div>`;
 $$(".back-status").forEach(e=>e.onchange=()=>{data.backlogs.find(x=>String(x.id)===e.dataset.id).status=e.value;save()});$$(".del-back").forEach(b=>b.onclick=()=>{data.backlogs=data.backlogs.filter(x=>String(x.id)!==b.dataset.id);save()});
}
function renderMistakes(){
 $("#mistakeList").innerHTML=data.mistakes.slice().reverse().map(x=>`<div class="list-row"><div><b>${esc(x.topic)}</b><div class="muted">${x.subject} • ${x.date} • ${esc(x.lesson||"")}</div><div>${esc(x.note)}</div></div><button class="small-btn del-mist" data-id="${x.id}">Delete</button></div>`).join("")||`<div class="empty">No mistakes logged. That's a good sign — but keep the notebook updated!</div>`;
 $$(".del-mist").forEach(b=>b.onclick=()=>{data.mistakes=data.mistakes.filter(x=>String(x.id)!==b.dataset.id);save()});
}
function renderRevision(){
 const revs=data.revisions||[]; $("#revisionList").innerHTML=data.chapters.filter(c=>["Done","Revised","Mastered"].includes(c.status)).map(c=>`<div class="list-row"><div><b>${esc(c.name)}</b><div class="muted">${c.subject} • status: ${c.status}</div></div><button class="small-btn rev-now" data-id="${c.id}">Mark revised today</button></div>`).join("")||`<div class="empty">Complete chapters first; they'll appear here.</div>`;
 $$(".rev-now").forEach(b=>b.onclick=()=>{let c=data.chapters.find(x=>String(x.id)===b.dataset.id);data.revisions=data.revisions||[];data.revisions.push({chapter:c.name,date:todayISO()});save();alert("Revision logged for "+c.name)});
}
function renderTargets(){
 $("#targetHours").value=data.targets.hours;$("#targetPyqs").value=data.targets.pyqs;$("#targetQs").value=data.targets.qs;
 const today=data.daily.filter(x=>x.date===todayISO()).reduce((a,x)=>a+Number(x.hours),0), pyq=data.pyqs.filter(x=>x.date===todayISO()).reduce((a,x)=>a+Number(x.total),0), qs=data.pyqs.filter(x=>x.date===todayISO()).reduce((a,x)=>a+Number(x.correct)+Number(x.wrong),0);
 $("#targetProgress").innerHTML=[["Study hours",today,data.targets.hours],["PYQs",pyq,data.targets.pyqs],["Questions",qs,data.targets.qs]].map(x=>`<div class="progress-row"><div class="row-top"><b>${x[0]}</b><span>${x[1]} / ${x[2]}</span></div><div class="bar"><i style="width:${Math.min(100,pct(x[1],x[2]))}%"></i></div></div>`).join("");
}
function renderSettings(){ $("#userName").value=data.profile.name;$("#attempt").value=data.profile.attempt;$("#goal").value=data.profile.goal}
function renderAll(){renderDashboard();renderSyllabus();renderDaily();renderPyq();renderTests();renderBacklog();renderMistakes();renderRevision();renderTargets();renderSettings()}

function modal(title,body,onSave){
 $("#modalTitle").textContent=title;$("#modalBody").innerHTML=body;$("#modal").classList.add("open");
 $("#modalSave").onclick=()=>{if(onSave()){$("#modal").classList.remove("open");save()}}
}
$("#closeModal").onclick=()=>$("#modal").classList.remove("open");$("#modal").onclick=e=>{if(e.target.id==="modal")$("#modal").classList.remove("open")};
$("#addChapterBtn").onclick=()=>modal("Add Chapter",`<div class="form-grid"><label>Subject<select id="mSub"><option>Physics</option><option>Chemistry</option><option>Maths</option></select></label><label>Chapter<input id="mName" required></label></div><div class="modal-actions"><button class="secondary" id="modalCancel">Cancel</button><button class="primary" id="modalSave">Add</button></div>`,()=>{if(!$("#mName").value.trim())return false;data.chapters.push({id:Date.now(),subject:$("#mSub").value,name:$("#mName").value.trim(),status:"Not Started",priority:"Normal"});return true});
$("#addPyqBtn").onclick=()=>modal("Add PYQ Record",`<div class="form-grid"><label>Subject<select id="mSub"><option>Physics</option><option>Chemistry</option><option>Maths</option></select></label><label>Chapter<input id="mChapter" required></label><label>Year<input id="mYear" type="number" min="2000" max="2100"></label><label>Total attempted<input id="mTotal" type="number" min="0" value="10"></label><label>Correct<input id="mCorrect" type="number" min="0" value="0"></label><label>Wrong<input id="mWrong" type="number" min="0" value="0"></label></div><div class="modal-actions"><button class="primary" id="modalSave">Save</button></div>`,()=>{data.pyqs.push({id:Date.now(),date:todayISO(),subject:$("#mSub").value,chapter:$("#mChapter").value,year:$("#mYear").value,total:+$("#mTotal").value,correct:+$("#mCorrect").value,wrong:+$("#mWrong").value});return true});
$("#addTestBtn").onclick=()=>modal("Add Mock Test",`<div class="form-grid"><label>Test name<input id="mName" required></label><label>Type<select id="mType"><option>JEE Main</option><option>JEE Advanced</option><option>Part Test</option><option>Other</option></select></label><label>Date<input id="mDate" type="date" value="${todayISO()}"></label><label>Marks<input id="mMarks" type="number" required></label><label>Max marks<input id="mMax" type="number" value="300"></label><label>Accuracy %<input id="mAcc" type="number" min="0" max="100"></label><label>Percentile (optional)<input id="mPer" type="number" step=".01"></label></div><div class="modal-actions"><button class="primary" id="modalSave">Save</button></div>`,()=>{data.tests.push({id:Date.now(),name:$("#mName").value,date:$("#mDate").value,type:$("#mType").value,marks:+$("#mMarks").value,max:+$("#mMax").value,accuracy:+$("#mAcc").value,percentile:$("#mPer").value});return true});
$("#addBacklogBtn").onclick=()=>modal("Add Backlog",`<div class="form-grid"><label>Task/chapter<input id="mTitle" required></label><label>Subject<select id="mSub"><option>Physics</option><option>Chemistry</option><option>Maths</option><option>Other</option></select></label><label>Priority<select id="mPri"><option>High</option><option>Medium</option><option>Low</option></select></label></div><div class="modal-actions"><button class="primary" id="modalSave">Add</button></div>`,()=>{data.backlogs.push({id:Date.now(),title:$("#mTitle").value,subject:$("#mSub").value,priority:$("#mPri").value,status:"Open"});return true});
$("#addMistakeBtn").onclick=()=>modal("Add Mistake",`<div class="form-grid"><label>Subject<select id="mSub"><option>Physics</option><option>Chemistry</option><option>Maths</option></select></label><label>Topic<input id="mTopic" required></label><label>Lesson / chapter<input id="mLesson"></label><label class="wide">What went wrong?<textarea id="mNote" rows="4"></textarea></label></div><div class="modal-actions"><button class="primary" id="modalSave">Save</button></div>`,()=>{data.mistakes.push({id:Date.now(),date:todayISO(),subject:$("#mSub").value,topic:$("#mTopic").value,lesson:$("#mLesson").value,note:$("#mNote").value});return true});
$("#dailyForm").onsubmit=e=>{e.preventDefault();data.daily.push({id:Date.now(),date:$("#dDate").value,subject:$("#dSubject").value,hours:+$("#dHours").value,topic:$("#dTopic").value,notes:$("#dNotes").value});e.target.reset();$("#dDate").value=todayISO();save()};
$("#clearDaily").onclick=()=>{if(confirm("Clear all study history?")){data.daily=[];save()}};
$("#targetForm").onsubmit=e=>{e.preventDefault();data.targets={hours:+$("#targetHours").value,pyqs:+$("#targetPyqs").value,qs:+$("#targetQs").value};save()};
$("#settingsForm").onsubmit=e=>{e.preventDefault();data.profile={name:$("#userName").value,attempt:$("#attempt").value,goal:$("#goal").value};save()};
$("#syllabusSearch").oninput=renderSyllabus;$("#subjectFilter").onchange=renderSyllabus;$("#statusFilter").onchange=renderSyllabus;
$("#exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="jee-tracker-backup.json";a.click();URL.revokeObjectURL(a.href)};
$("#importBtn").onclick=()=>$("#importFile").click();$("#importFile").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{data=JSON.parse(r.result);save();alert("Backup imported successfully.")}catch{alert("Invalid backup file.")}};r.readAsText(f)};
$("#resetBtn").onclick=()=>{if(confirm("This will erase all tracker data from this browser. Continue?")){data=fresh();save()}};
$("#dDate").value=todayISO();
renderAll();
if(location.hash) {const p=location.hash.slice(1); if($("#page-"+p)) nav(p)}
