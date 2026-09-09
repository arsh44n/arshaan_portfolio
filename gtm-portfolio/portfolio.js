(() => {
const root = document.documentElement;
const toggle = document.querySelector('[data-theme-toggle]');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const launchStyles = document.createElement('link');
launchStyles.rel = 'stylesheet';
launchStyles.href = 'launch.css';
document.head.appendChild(launchStyles);
function applyTheme(theme) {
const dark = theme === 'dark';
root.dataset.theme = dark ? 'dark' : 'light';
if (toggle) {
toggle.setAttribute('aria-pressed', dark ? 'true' : 'false');
toggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
}
try { localStorage.setItem('ak-theme', dark ? 'dark' : 'light'); } catch (_) {}
}
applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
toggle?.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
const beliefShell = document.querySelector('[data-belief-work-shell]');
document.querySelectorAll('[data-jump-work]').forEach((link) => {
link.addEventListener('click', (event) => {
if (!beliefShell || window.innerWidth <= 1000) return;
event.preventDefault();
const shellTop = beliefShell.getBoundingClientRect().top + window.scrollY;
const maxScroll = Math.max(0, beliefShell.offsetHeight - window.innerHeight);
const target = shellTop + maxScroll * 0.27;
window.scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' });
});
});
const flowSection = document.querySelector('.flow-continuation-vertical');
const flowNodes = [...document.querySelectorAll('[data-flow-step]')];
const flowLinks = [...document.querySelectorAll('[data-flow-link]')];
let flowTimers = [];
function resetFlow() {
flowTimers.forEach(clearTimeout); flowTimers = [];
flowNodes.forEach(n => n.classList.remove('flow-active','flow-passed'));
flowLinks.forEach(l => l.classList.remove('flow-active'));
}
function runFlow() {
resetFlow();
if (reduced) {
flowNodes.forEach(n => n.classList.add('flow-passed'));
flowLinks.forEach(l => l.classList.add('flow-active'));
flowNodes.at(-1)?.classList.add('flow-active');
return;
}
flowNodes.forEach((node, i) => {
flowTimers.push(setTimeout(() => {
flowNodes.forEach((n, idx) => {
n.classList.toggle('flow-active', idx === i);
n.classList.toggle('flow-passed', idx < i);
});
flowLinks.forEach((link, idx) => link.classList.toggle('flow-active', idx < i));
}, i * 720));
});
flowTimers.push(setTimeout(() => {
flowNodes.forEach((n) => { n.classList.remove('flow-active'); n.classList.add('flow-passed'); });
flowNodes.at(-1)?.classList.add('flow-active');
flowLinks.forEach(l => l.classList.add('flow-active'));
}, flowNodes.length * 720));
}
if (flowSection && flowNodes.length) {
const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting && entry.intersectionRatio > .42) runFlow();
else if (!entry.isIntersecting) resetFlow();
});
}, { threshold:[0,.42,.65] });
observer.observe(flowSection);
}
const projectData = {
jobready: {
kicker:'Operating experience', title:'JobReady.co',
summary:'Early-stage outbound operating work across sourcing, signals, enrichment, sequencing, LinkedIn follow-up, and handoff. The case focuses on the motion and its failure points rather than invented campaign outcomes.',
details:[['Role','GTM / outbound operating experience'],['Motion','Signal-led account sourcing → enrichment → outreach → follow-up'],['Focus','Call-center / BPO and revenue-team use cases'],['Proof standard','No fabricated reply or meeting metrics']],
links:[['Company site','https://salesforce.jobready.co/','primary']]
},
leados: {
kicker:'Active V1 build', title:'LeadOS',
summary:'A GTM operating layer that keeps qualification, research, scoring rationale, messaging, human review, and execution state in one system.',
details:[['Status','Active V1 build'],['Interface','Table-first operating layer'],['System','Provider abstraction + GTM state'],['Goal','Make reasoning inspectable before execution']],
links:[['GitHub','https://github.com/arsh44n/LeadOS','primary']]
},
eubrics: {
kicker:'Featured case study', title:'Eubrics · US Insurance',
summary:'End-to-end US-insurance outbound prototype covering qualification, evidence-led research, contact enrichment, sequencing, channel logic, and reporting.',
details:[['ICP','US insurance carriers, brokerages, MGA/MGU, FMO/IMO'],['Qualification','Producer scale + distribution complexity + use-case fit'],['Activation','Email + LinkedIn + calls'],['Output','End-to-end contact lifecycle demo']],
links:[['Watch Loom','https://www.loom.com/share/2e48179fca4c4bb3aa1f258da73fb7bf','primary'],['Lemlist sequence','https://app.lemlist.com/share/sequence/cam_jrw6G3qGyB27bQKWf/seq_TAECFzemKZpqaBZZt'],['Clay companies','https://app.clay.com/shared-table/share_0tkp9hrentcGe92pjSX'],['Clay personas','https://app.clay.com/shared-table/share_0tkp9egwzGGMP8sr5Mw']]
},
techiebutler: {
kicker:'Strategy assignment', title:'TechieButler × Ramp',
summary:'A focused outbound strategy built around Ramp as a target account: buying context, problem framing, engineering-capacity positioning, and a reasoned message instead of generic personalization.',
details:[['Type','Strategy assignment'],['Target','Ramp'],['Thesis','Specific account context before copy'],['Status','Private assignment material']],
links:[]
}
};
const modal = document.querySelector('[data-case-modal]');
const modalTitle = modal?.querySelector('[data-case-title]');
const modalKicker = modal?.querySelector('[data-case-kicker]');
const modalSummary = modal?.querySelector('[data-case-summary]');
const modalDetails = modal?.querySelector('[data-case-details]');
const modalLinks = modal?.querySelector('[data-case-links]');
function closeModal() {
if (!modal) return;
modal.classList.remove('is-open'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow='';
}
function openModal(key) {
const data = projectData[key]; if (!modal || !data) return;
modalKicker.textContent=data.kicker; modalTitle.textContent=data.title; modalSummary.textContent=data.summary;
modalDetails.innerHTML=data.details.map(([k,v])=>`<div class="case-detail"><b>${k}</b><span>${v}</span></div>`).join('');
modalLinks.innerHTML=data.links.length ? data.links.map(([label,url,kind])=>`<a href="${url}" target="_blank" rel="noopener" class="${kind||''}">${label} ↗</a>`).join('') : '<span class="case-modal-kicker">Private material · available on request</span>';
modal.classList.add('is-open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
}
document.querySelectorAll('[data-project-case]').forEach(btn => btn.addEventListener('click', () => openModal(btn.dataset.projectCase)));
document.querySelectorAll('[data-case-close]').forEach(btn => btn.addEventListener('click', closeModal));
window.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
const buttonLabels = {jobready:'View work', leados:'View build', eubrics:'View proof', techiebutler:'View strategy'};
Object.entries(buttonLabels).forEach(([key,label]) => {
const btn = document.querySelector(`[data-project-case="${key}"]`);
if (btn) btn.textContent = label;
});
const evidenceNames = ['detect','research','systemize','activate','learn'];
evidenceNames.forEach(async (name) => {
try {
const b64 = await fetch(`evidence/${name}.b64.txt`).then(r => {
if (!r.ok) throw new Error(r.status);
return r.text();
});
const src = `data:image/webp;base64,${b64.trim()}`;
document.querySelectorAll(`[data-evidence="${name}"]`).forEach(img => { img.src = src; });
} catch (err) {
console.warn(`Evidence image failed: ${name}`, err);
}
});
})();