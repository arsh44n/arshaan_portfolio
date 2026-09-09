(() => {
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
entries.forEach((entry) => {
if (entry.isIntersecting) {
entry.target.classList.add('visible');
revealObserver.unobserve(entry.target);
}
});
}, { threshold: 0.12 });
revealEls.forEach((el) => revealObserver.observe(el));
const wordEls = [...document.querySelectorAll('[data-word-reveal]')];
wordEls.forEach((el) => {
if (el.dataset.splitDone) return;
const text = el.textContent.trim().replace(/\s+/g, ' ');
el.dataset.originalText = text;
const words = text.split(' ');
el.textContent = '';
el.classList.add('word-reveal');
words.forEach((word, index) => {
const span = document.createElement('span');
span.className = 'word';
span.textContent = word;
span.style.transitionDelay = `${index * 36}ms`;
el.appendChild(span);
if (index < words.length - 1) el.appendChild(document.createTextNode(' '));
});
el.dataset.splitDone = 'true';
});
const wordObserver = new IntersectionObserver((entries) => {
entries.forEach((entry) => {
if (entry.isIntersecting) {
entry.target.classList.add('is-visible');
wordObserver.unobserve(entry.target);
}
});
}, { threshold: 0.18 });
wordEls.forEach((el) => wordObserver.observe(el));
const beliefSection = document.querySelector('[data-belief-section]');
const beliefCopy = document.querySelector('[data-scroll-word-reveal]');
let beliefWords = [];
if (beliefCopy) {
let globalIndex = 0;
beliefCopy.querySelectorAll('[data-belief-line]').forEach((line) => {
const words = line.textContent.trim().split(/\s+/);
line.textContent = '';
words.forEach((word, index) => {
const span = document.createElement('span');
span.className = 'belief-word';
if (word.toLowerCase().replace(/[^a-z]/g, '') === 'concentrate') span.classList.add('accent-word');
span.textContent = word;
span.dataset.wordIndex = String(globalIndex++);
line.appendChild(span);
beliefWords.push(span);
if (index < words.length - 1) line.appendChild(document.createTextNode(' '));
});
});
}
function updateBeliefWords() {
if (!beliefSection || !beliefWords.length) return;
if (reducedMotion || window.innerWidth <= 680) {
beliefWords.forEach((word) => word.classList.add('is-on'));
return;
}
const shell = document.querySelector('[data-belief-work-shell]');
if (!shell) return;
const rect = shell.getBoundingClientRect();
const maxScroll = shell.offsetHeight - window.innerHeight;
const travelled = Math.min(Math.max(-rect.top, 0), maxScroll);
const raw = maxScroll > 0 ? travelled / maxScroll : 0;
const progress = Math.max(0, Math.min(1, raw / 0.13));
const visibleCount = Math.floor(progress * (beliefWords.length + 1));
beliefWords.forEach((word, index) => word.classList.toggle('is-on', index < visibleCount));
}
const typedEl = document.querySelector('[data-typed]');
if (typedEl && !reducedMotion) {
const words = (typedEl.dataset.typed || typedEl.textContent).split(',').map((w) => w.trim()).filter(Boolean);
let wordIndex = 0;
let charIndex = 0;
let deleting = false;
const type = () => {
const current = words[wordIndex];
typedEl.textContent = current.slice(0, charIndex);
if (!deleting) {
if (charIndex < current.length) {
charIndex += 1;
setTimeout(type, 90);
} else {
deleting = true;
setTimeout(type, 1200);
}
} else {
if (charIndex > 0) {
charIndex -= 1;
setTimeout(type, 55);
} else {
deleting = false;
wordIndex = (wordIndex + 1) % words.length;
setTimeout(type, 160);
}
}
};
typedEl.textContent = '';
type();
}
const heroStage = document.querySelector('.hero-stage');
const cards = [...document.querySelectorAll('.floating-card')];
if (heroStage && !reducedMotion) {
heroStage.addEventListener('pointermove', (event) => {
const rect = heroStage.getBoundingClientRect();
const px = (event.clientX - rect.left) / rect.width - 0.5;
const py = (event.clientY - rect.top) / rect.height - 0.5;
cards.forEach((card, index) => {
const depth = [10, 16, 12][index] || 10;
card.style.transform = `translate(${px * depth}px, ${py * depth}px)`;
});
});
heroStage.addEventListener('pointerleave', () => cards.forEach((card) => card.style.transform = 'translate(0,0)'));
}
const flowShell = document.querySelector('.flow-shell');
const flowCards = [...document.querySelectorAll('[data-flow-card]')];
const labels = [...document.querySelectorAll('[data-stage-label]')];
const signalDot = document.querySelector('[data-signal-dot]');
const trackProgress = document.querySelector('[data-track-progress]');
const counter = document.querySelector('[data-flow-counter]');
function setActiveFlow(index, progress) {
const safeIndex = Math.max(0, Math.min(flowCards.length - 1, index));
flowCards.forEach((card, idx) => card.classList.toggle('active', idx === safeIndex));
labels.forEach((label, idx) => {
label.classList.toggle('active', idx === safeIndex);
label.classList.toggle('passed', idx < safeIndex);
});
if (counter) counter.textContent = `Stage ${String(safeIndex + 1).padStart(2, '0')} / 05`;
if (signalDot && trackProgress && window.innerWidth > 1000 && labels.length) {
const clamped = Math.max(0, Math.min(1, progress));
const track = signalDot.parentElement;
const trackRect = track.getBoundingClientRect();
const centers = labels.map((label) => {
const r = label.getBoundingClientRect();
return (r.left + r.width / 2) - trackRect.left;
});
const scaled = clamped * (centers.length - 1);
const leftIndex = Math.min(centers.length - 1, Math.floor(scaled));
const rightIndex = Math.min(centers.length - 1, leftIndex + 1);
const local = scaled - leftIndex;
const x = centers[leftIndex] + (centers[rightIndex] - centers[leftIndex]) * local;
const start = centers[0];
const end = centers[centers.length - 1];
signalDot.style.left = `${x}px`;
trackProgress.style.left = `${start}px`;
trackProgress.style.width = `${Math.max(0, x - start)}px`;
const line = track.querySelector('.stage-track-line');
if (line) {
line.style.left = `${start}px`;
line.style.right = `${Math.max(0, trackRect.width - end)}px`;
}
}
}
function updateFlow() {
if (!flowShell) return;
if (window.innerWidth <= 1000) {
flowCards.forEach((card) => card.classList.add('active'));
return;
}
const rect = flowShell.getBoundingClientRect();
const maxScroll = flowShell.offsetHeight - window.innerHeight;
const travelled = Math.min(Math.max(-rect.top, 0), maxScroll);
const rawProgress = maxScroll > 0 ? travelled / maxScroll : 0;
const progress = Math.max(0, Math.min(1, (rawProgress - 0.07) / 0.89));
const index = progress >= 1
? flowCards.length - 1
: Math.min(flowCards.length - 1, Math.floor(progress * (flowCards.length - 1)));
setActiveFlow(index, progress);
}
function updateHorizontalShell(shell) {
if (window.innerWidth <= 1000) return;
const sticky = shell.querySelector('.h-scroll-sticky');
const windowEl = shell.querySelector('.h-scroll-window');
const track = shell.querySelector('[data-h-track]');
if (!sticky || !windowEl || !track) return;
const rect = shell.getBoundingClientRect();
const maxScroll = shell.offsetHeight - window.innerHeight;
const travelled = Math.min(Math.max(-rect.top, 0), maxScroll);
const rawProgress = maxScroll > 0 ? travelled / maxScroll : 0;
const progress = Math.max(0, Math.min(1, (rawProgress - 0.08) / 0.84));
const overflow = Math.max(track.scrollWidth - windowEl.clientWidth, 0);
track.style.transform = `translate3d(${-overflow * progress}px,0,0)`;
if (shell.classList.contains('work-scroll')) {
const visibleNow = rect.bottom > 0 && rect.top < window.innerHeight;
const techieCard = shell.querySelector('[data-techie-card]');
const continuation = shell.querySelector('[data-flow-continuation]');
const windowRect = windowEl.getBoundingClientRect();
const techieRect = techieCard ? techieCard.getBoundingClientRect() : null;
const continuationRect = continuation ? continuation.getBoundingClientRect() : null;
const techieCleared = techieRect ? techieRect.right <= windowRect.left + 2 : false;
const continuationArrived = continuationRect ? continuationRect.left <= windowRect.left + 6 : false;
const lightMode = visibleNow && techieCleared && continuationArrived;
shell.classList.toggle('flow-light-active', lightMode);
if (nav) nav.classList.toggle('flow-light-nav', lightMode);
}
}
const horizontalShells = [...document.querySelectorAll('[data-horizontal-shell]')];
const nav = document.querySelector('.floating-nav');
const lowerZone = document.querySelector('.lower-zone');
const finalShell = document.querySelector('[data-final-scroll]');
const finalPanel = document.querySelector('[data-final-panel]');
function updateFinalScroll() {
if (!finalShell || !finalPanel || window.innerWidth <= 1000) return;
const rect = finalShell.getBoundingClientRect();
const maxScroll = finalShell.offsetHeight - window.innerHeight;
const stickyTravel = Math.min(Math.max(-rect.top, 0), Math.max(maxScroll, 1));
const stickyProgress = maxScroll > 0 ? stickyTravel / maxScroll : 0;
const entryProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / window.innerHeight));
const progress = rect.top > 0
? entryProgress * 0.56
: Math.min(1, 0.56 + stickyProgress * 0.44);
finalPanel.style.transform = `translate3d(${(1 - progress) * 102}%,0,0)`;
if (nav) {
const visible = rect.bottom > 0 && rect.top < window.innerHeight;
if (visible && progress > 0.46) nav.classList.add('nav-dark');
else if (visible) nav.classList.remove('nav-dark');
}
}
function updateNavTheme() {
if (!nav || !lowerZone) return;
const rect = lowerZone.getBoundingClientRect();
const inLower = rect.top <= 120 && rect.bottom > 120;
nav.classList.toggle('nav-lower', inLower && !nav.classList.contains('nav-dark'));
}
const beliefWorkShell = document.querySelector('[data-belief-work-shell]');
const beliefWorkTrack = document.querySelector('[data-belief-work-track]');
const workTitleOverlay = document.querySelector('[data-work-title-overlay]');
function updateBeliefWork() {
if (!beliefWorkShell || !beliefWorkTrack) return;
if (window.innerWidth <= 1000) {
beliefWorkTrack.style.transform = 'none';
if (workTitleOverlay) workTitleOverlay.classList.add('is-visible');
return;
}
const rect = beliefWorkShell.getBoundingClientRect();
const maxScroll = beliefWorkShell.offsetHeight - window.innerHeight;
const travelled = Math.min(Math.max(-rect.top, 0), maxScroll);
const raw = maxScroll > 0 ? travelled / maxScroll : 0;
const movement = Math.max(0, Math.min(1, (raw - 0.13) / 0.82));
const overflow = Math.max(beliefWorkTrack.scrollWidth - window.innerWidth, 0);
beliefWorkTrack.style.transform = `translate3d(${-overflow * movement}px,0,0)`;
if (workTitleOverlay) {
const visible = movement > 0.16 && movement < 0.985;
workTitleOverlay.classList.toggle('is-visible', visible);
}
if (nav) {
const shellVisible = rect.bottom > 0 && rect.top < window.innerHeight;
nav.classList.toggle('nav-dark', shellVisible && movement > 0.15);
}
}
let ticking = false;
const onScroll = () => {
if (!ticking) {
requestAnimationFrame(() => {
updateFlow();
updateBeliefWords();
updateBeliefWork();
horizontalShells.forEach(updateHorizontalShell);
updateFinalScroll();
updateNavTheme();
ticking = false;
});
ticking = true;
}
};
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', () => {
updateFlow();
updateBeliefWords();
updateBeliefWork();
horizontalShells.forEach(updateHorizontalShell);
updateFinalScroll();
updateNavTheme();
}, { passive: true });
document.querySelectorAll('a[href="#top"]').forEach((link) => {
link.addEventListener('click', (event) => {
event.preventDefault();
window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
});
});
const talkGtm = document.querySelector('.nav-cta[href="#contact"]');
if (talkGtm && finalShell) {
talkGtm.addEventListener('click', (event) => {
event.preventDefault();
const targetY = finalShell.getBoundingClientRect().top + window.scrollY + window.innerHeight * 0.34;
window.scrollTo({ top: targetY, behavior: reducedMotion ? 'auto' : 'smooth' });
});
}
updateFlow();
updateBeliefWords();
updateBeliefWork();
horizontalShells.forEach(updateHorizontalShell);
updateFinalScroll();
updateNavTheme();
})();