(() => {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Production-parity layer. This is intentionally injected last so the live
  // multi-file build matches the approved single-file preview.
  const parityCSS = document.createElement('style');
  parityCSS.id = 'production-parity-fix-20260910';
  parityCSS.textContent = `
    .project-slide .project-case-button{
      background:#3dd5f3!important;color:#000!important;border-color:#3dd5f3!important;
      box-shadow:0 10px 24px rgba(61,213,243,.18)!important;font-weight:750!important;
    }
    .project-slide .project-link{
      background:#c1121f!important;color:#fff!important;border-color:#c1121f!important;
      box-shadow:0 10px 24px rgba(193,18,31,.14)!important;font-weight:750!important;
    }
    .project-slide .project-case-button:hover,.project-slide .project-link:hover{transform:translateY(-2px)!important;filter:brightness(1.06)}
    .project-proof-visual,.evidence-visual{overflow:hidden!important}
    .project-proof-image,.proof-shot img{width:100%!important;height:100%!important;object-fit:contain!important;background:#fff!important;display:block!important}

    /* Flow Continuation gets a complete viewport before Tools can enter. */
    .flow-continuation-vertical{
      min-height:100svh!important;height:100svh!important;padding:92px 20px 40px!important;
      display:grid!important;align-items:center!important;overflow:hidden!important;background:var(--bot-cream)!important;
    }
    .flow-continuation-inner{
      width:min(1320px,calc(100vw - 56px))!important;height:calc(100svh - 132px)!important;min-height:0!important;
      margin:0 auto!important;padding:0!important;display:grid!important;
      grid-template-columns:minmax(0,1.12fr) minmax(520px,.88fr)!important;grid-template-rows:1fr!important;
      gap:42px!important;align-items:center!important;align-content:center!important;
    }
    .flow-continuation-copy{text-align:left!important;min-width:0!important}
    .flow-continuation-copy .eyebrow{text-align:left!important;margin:0 0 22px!important}
    .flow-continuation-copy h2{
      margin:0!important;max-width:none!important;white-space:nowrap!important;text-align:left!important;
      font-size:clamp(44px,4.15vw,66px)!important;line-height:.96!important;letter-spacing:-.065em!important;
    }
    .flow-continuation-inner .signal-chain{
      width:100%!important;max-width:620px!important;margin:0 auto!important;min-width:0!important;
      grid-template-columns:minmax(76px,1fr) minmax(34px,62px) minmax(76px,1fr) minmax(34px,62px) minmax(76px,1fr) minmax(34px,62px) minmax(76px,1fr)!important;
    }
    .flow-continuation-inner .chain-node{min-width:0!important;min-height:106px!important;font-size:11px!important;padding:8px!important}
    .flow-continuation-inner .chain-link{min-width:0!important;width:100%!important}

    /* About has one authoritative desktop layout: label top-centred, copy below. */
    .about{
      min-height:88svh!important;padding:92px 20px 78px!important;background:var(--bot-cream)!important;color:var(--bot-black)!important;
    }
    .about-shell{
      width:var(--container)!important;margin:0 auto!important;display:grid!important;grid-template-columns:1fr!important;
      gap:0!important;border-top:1px solid rgba(43,45,66,.14)!important;padding-top:34px!important;
    }
    .about-shell>.eyebrow{
      width:100%!important;margin:0 0 46px!important;text-align:center!important;color:rgba(43,45,66,.52)!important;
    }
    .about-shell>div{width:min(1000px,100%)!important;margin:0 auto!important}
    .about-shell h2{
      margin:0 0 28px!important;max-width:1000px!important;font-size:clamp(48px,5vw,82px)!important;
      line-height:1!important;letter-spacing:-.06em!important;color:var(--bot-black)!important;
    }
    .about-shell p{max-width:820px!important;color:rgba(43,45,66,.68)!important;font-size:16px!important;line-height:1.68!important}

    html[data-theme="dark"] .flow-continuation-vertical,
    html[data-theme="dark"] .about{background:#000!important;color:#fdf0d5!important}
    html[data-theme="dark"] .about-shell{border-top-color:rgba(102,155,188,.20)!important}
    html[data-theme="dark"] .about-shell>.eyebrow{color:rgba(253,240,213,.52)!important}
    html[data-theme="dark"] .about-shell h2{color:#fdf0d5!important}
    html[data-theme="dark"] .about-shell p{color:rgba(253,240,213,.70)!important}

    @media(max-width:1000px){
      .flow-continuation-vertical{height:auto!important;min-height:auto!important;padding:92px 20px 86px!important;overflow:visible!important}
      .flow-continuation-inner{width:100%!important;height:auto!important;grid-template-columns:1fr!important;gap:42px!important}
      .flow-continuation-copy{text-align:center!important}.flow-continuation-copy .eyebrow{text-align:center!important}
      .flow-continuation-copy h2{white-space:normal!important;text-align:center!important}
      .flow-continuation-inner .signal-chain{grid-template-columns:1fr!important;gap:8px!important;max-width:520px!important}
      .flow-continuation-inner .chain-link{width:2px!important;height:24px!important;justify-self:center!important}
      .about{min-height:auto!important;padding:82px 20px 90px!important}
      .about-shell>.eyebrow{text-align:center!important;margin-bottom:34px!important}
    }
  `;
  document.head.appendChild(parityCSS);

  const toggle = document.querySelector('[data-theme-toggle]');
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

  // Work links land on the first project rather than the Operating Belief hold.
  const beliefShell = document.querySelector('[data-belief-work-shell]');
  document.querySelectorAll('[data-jump-work]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (!beliefShell || window.innerWidth <= 1000) return;
      event.preventDefault();
      const shellTop = beliefShell.getBoundingClientRect().top + window.scrollY;
      const maxScroll = Math.max(0, beliefShell.offsetHeight - window.innerHeight);
      window.scrollTo({ top: shellTop + maxScroll * 0.27, behavior: reduced ? 'auto' : 'smooth' });
    });
  });

  // Flow continuation: one deliberate pass from Signal to Action.
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
      flowNodes.forEach(n => { n.classList.remove('flow-active'); n.classList.add('flow-passed'); });
      flowNodes.at(-1)?.classList.add('flow-active');
      flowLinks.forEach(l => l.classList.add('flow-active'));
    }, flowNodes.length * 720));
  }
  if (flowSection && flowNodes.length) {
    let hasRun = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > .42 && !hasRun) {
          hasRun = true; runFlow();
        } else if (!entry.isIntersecting && entry.boundingClientRect.top > window.innerHeight) {
          hasRun = false; resetFlow();
        }
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
    modalKicker.textContent = data.kicker; modalTitle.textContent = data.title; modalSummary.textContent = data.summary;
    modalDetails.innerHTML = data.details.map(([k,v]) => `<div class="case-detail"><b>${k}</b><span>${v}</span></div>`).join('');
    modalLinks.innerHTML = data.links.length
      ? data.links.map(([label,url,kind]) => `<a href="${url}" target="_blank" rel="noopener" class="${kind||''}">${label} ↗</a>`).join('')
      : '<span class="case-modal-kicker">Private material · available on request</span>';
    modal.classList.add('is-open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
  }
  document.querySelectorAll('[data-project-case]').forEach(btn => btn.addEventListener('click', () => openModal(btn.dataset.projectCase)));
  document.querySelectorAll('[data-case-close]').forEach(btn => btn.addEventListener('click', closeModal));
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Evidence: eager-load the sanitized assets, strip all whitespace from base64,
  // and never leave the browser sitting on an empty lazy image inside a pinned card.
  const evidenceNames = ['detect','research','systemize','activate','learn'];
  evidenceNames.forEach(async (name) => {
    const images = [...document.querySelectorAll(`[data-evidence="${name}"]`)];
    if (!images.length) return;
    images.forEach(img => { img.loading = 'eager'; img.decoding = 'async'; });
    try {
      const res = await fetch(new URL(`evidence/${name}.b64.txt?v=20260910b`, document.baseURI), { cache:'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const b64 = (await res.text()).replace(/\s+/g, '');
      if (!b64) throw new Error('empty evidence payload');
      const src = `data:image/webp;base64,${b64}`;
      await new Promise((resolve, reject) => {
        const probe = new Image();
        probe.onload = resolve; probe.onerror = reject; probe.src = src;
      });
      images.forEach(img => { img.src = src; img.removeAttribute('data-load-error'); });
    } catch (err) {
      console.warn(`Evidence image failed: ${name}`, err);
      images.forEach(img => {
        img.removeAttribute('src');
        img.setAttribute('data-load-error','true');
        img.alt = `${img.alt || 'Evidence'} — image temporarily unavailable`;
      });
    }
  });
})();