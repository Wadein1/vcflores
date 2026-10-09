/* VC Flores order builder: live summary, DM message, validation, copy-to-clipboard, draft saving, 3D motion.
   Depends on window.VC from main.js (i18n + storage helpers). */
(() => {
  const VC = window.VC;
  const form = document.getElementById('orderForm');
  if (!VC || !form) return;
  const { t, store } = VC;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const DRAFT_KEY = 'vc-order-draft';

  const el = {
    progress: $('#oProgress'), card: $('#sumCard'), flip: $('#sumFlip'), img: $('#sumImg'),
    list: $('#sumList'), msg: $('#msgOut'), formError: $('#formError'), toast: $('#toast'),
    send: $('#sendBtn'), copy: $('#copyBtn'), reset: $('#resetBtn'),
    bar: $('#oBar'), barStyle: $('#barStyle'), barProgress: $('#barProgress'),
    ribbonWrap: $('#ribbonWrap'), noteWrap: $('#noteWrap'), date: $('#date'), name: $('#name')
  };

  /* ---------- dates ---------- */
  const pad = n => String(n).padStart(2, '0');
  const toISO = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const todayISO = () => toISO(new Date());
  const maxISO = () => { const d = new Date(); d.setFullYear(d.getFullYear() + 1); return toISO(d); };
  // Real calendar date in YYYY-MM-DD form (rejects 2025-02-31, free text from non-date-input browsers, etc.)
  const isRealISO = iso => {
    if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
    const [y, m, d] = iso.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
  };
  const dateError = iso => {
    if (!iso || !isRealISO(iso) || iso > maxISO()) return 'o.errDate';
    return iso < todayISO() ? 'o.errDatePast' : null;
  };
  const refreshDateLimits = () => { el.date.min = todayISO(); el.date.max = maxISO(); };
  refreshDateLimits();
  el.date.addEventListener('focus', refreshDateLimits);
  el.name.maxLength = 60;
  const formatDate = iso => {
    if (!isRealISO(iso)) return '';
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(VC.lang === 'es' ? 'es-MX' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  /* ---------- state ---------- */
  const getState = () => {
    const fd = new FormData(form);
    const styleInput = form.querySelector('input[name="style"]:checked');
    return {
      style: fd.get('style') || '',
      img: styleInput ? styleInput.dataset.img : '',
      roses: fd.get('roses') || '',
      colors: fd.getAll('colors'),
      extras: fd.getAll('extras'),
      ribbonText: (fd.get('ribbonText') || '').trim(),
      noteText: (fd.get('noteText') || '').trim(),
      date: fd.get('date') || '',
      time: fd.get('time') || 'any',
      name: (fd.get('name') || '').trim(),
      phone: (fd.get('phone') || '').trim(),
      notes: (fd.get('notes') || '').trim()
    };
  };

  const STYLE_KEYS = { buchon: 'b1.name', feliz18: 'b2.name', corazon: 'b3.name', novia: 'b4.name', amarillas: 'b5.name', rosablanco: 'b6.name', custom: 'o.custom' };
  const styleLabel = s => t(STYLE_KEYS[s.style] || 'o.custom');
  const rosesLabel = s => (s.roses === 'unsure' ? t('o.unsure') : s.roses);
  const rows = s => {
    const out = [];
    if (s.style) out.push([t('m.style'), styleLabel(s)]);
    if (s.roses) out.push([t('m.roses'), rosesLabel(s)]);
    if (s.colors.length) out.push([t('m.colors'), s.colors.map(c => t('c.' + c)).join(', ')]);
    if (s.extras.length) out.push([t('m.extras'), s.extras.map(x => t('e.' + x)).join(', ')]);
    if (s.extras.includes('ribbon') && s.ribbonText) out.push([t('m.ribbon'), `"${s.ribbonText}"`]);
    if (s.extras.includes('note') && s.noteText) out.push([t('m.note'), `"${s.noteText}"`]);
    if (s.date && isRealISO(s.date)) out.push([t('m.pickup'), `${formatDate(s.date)} (${t('t.' + s.time).toLowerCase()})`]);
    if (s.name) out.push([t('m.name'), s.name]);
    if (s.phone) out.push([t('m.phone'), s.phone]);
    if (s.notes) out.push([t('m.notes'), s.notes]);
    return out;
  };
  const buildMessage = s => [t('m.hi'), ...rows(s).map(([k, v]) => `• ${k}: ${v}`), '', t('m.thanks')].join('\n');
  const doneCount = s => [!!s.style, !!s.roses, s.colors.length > 0, !!(s.date && s.name)].filter(Boolean).length;

  /* ---------- render ---------- */
  let lastImg = null;
  function render() {
    const s = getState();

    $$('.style-opt').forEach(o => o.classList.toggle('is-checked', o.querySelector('input').checked));
    el.ribbonWrap.hidden = !s.extras.includes('ribbon');
    el.noteWrap.hidden = !s.extras.includes('note');

    el.list.replaceChildren(...rows(s).flatMap(([k, v]) => {
      const dt = document.createElement('dt'); dt.textContent = k;
      const dd = document.createElement('dd'); dd.textContent = v;
      return [dt, dd];
    }));
    el.msg.value = buildMessage(s);
    el.card.classList.toggle('has-style', !!s.style);

    const n = doneCount(s);
    el.progress.style.transform = `scaleX(${n / 4})`;
    el.barProgress.textContent = t('o.progress').replace('{n}', n);
    el.barStyle.textContent = s.style ? styleLabel(s) : t('o.style');

    if (s.img && s.img !== lastImg) swapPreview(s.img, lastImg !== null);
    lastImg = s.img || lastImg;
    return s;
  }

  function swapPreview(src, animate) {
    if (!(animate && VC.motion)) { el.img.src = src; return; }
    gsap.timeline()
      .to(el.flip, { rotationY: 90, scale: 0.92, duration: 0.25, ease: 'power2.in' })
      .add(() => { el.img.src = src; })
      .fromTo(el.flip, { rotationY: -90 }, { rotationY: 0, scale: 1, duration: 0.6, ease: 'back.out(1.6)' });
  }

  /* ---------- validation ---------- */
  const errorTargets = {
    style: { box: $('#err-style'), field: $('#fsStyle') },
    date: { box: $('#err-date'), input: el.date },
    name: { box: $('#err-name'), input: el.name },
    // No inline box for these; #formError carries the message and the input is marked invalid.
    ribbon: { box: null, input: $('#ribbonText') },
    note: { box: null, input: $('#noteText') }
  };
  const activeErrors = {};
  function setError(key, msgKey) {
    const tg = errorTargets[key];
    activeErrors[key] = msgKey;
    if (tg.box) {
      tg.box.hidden = !msgKey;
      tg.box.querySelector('span').textContent = msgKey ? t(msgKey) : '';
    }
    if (tg.input) tg.input.setAttribute('aria-invalid', msgKey ? 'true' : 'false');
    if (tg.field) tg.field.classList.toggle('is-invalid', !!msgKey);
  }
  const ribbonMissing = s => s.extras.includes('ribbon') && !s.ribbonText;
  const noteMissing = s => s.extras.includes('note') && !s.noteText;
  function validate() {
    refreshDateLimits();
    const s = getState();
    setError('style', s.style ? null : 'o.errStyle');
    setError('date', dateError(s.date));
    setError('name', s.name ? null : 'o.errName');
    setError('ribbon', ribbonMissing(s) ? 'o.errSummary' : null);
    setError('note', noteMissing(s) ? 'o.errSummary' : null);
    const firstBad = !s.style ? $('#fsStyle')
      : activeErrors.ribbon ? errorTargets.ribbon.input
      : activeErrors.note ? errorTargets.note.input
      : activeErrors.date ? el.date
      : !s.name ? el.name : null;
    el.formError.hidden = !firstBad;
    return firstBad;
  }
  const clearIfFixed = () => {
    const s = getState();
    if (activeErrors.style && s.style) setError('style', null);
    if (activeErrors.date && !dateError(s.date)) setError('date', null);
    if (activeErrors.name && s.name) setError('name', null);
    if (activeErrors.ribbon && !ribbonMissing(s)) setError('ribbon', null);
    if (activeErrors.note && !noteMissing(s)) setError('note', null);
    if (!Object.values(activeErrors).some(Boolean)) el.formError.hidden = true;
  };

  /* ---------- copy ---------- */
  let toastTimer = 0;
  const showToast = key => {
    el.toast.textContent = t(key);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.toast.textContent = ''; }, 6000);
  };
  function legacyCopy(text) {
    el.msg.focus();
    el.msg.select();
    el.msg.setSelectionRange(0, text.length); // iOS ignores select() alone
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    el.msg.setSelectionRange(0, 0);
    return ok;
  }
  function copyMessage() {
    const text = el.msg.value;
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(() => true, () => legacyCopy(text));
    }
    return Promise.resolve(legacyCopy(text));
  }
  function focusInvalid(target) {
    if (VC.scrollTo) VC.scrollTo(target, -110);
    else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 110 });
    const focusable = target.matches('input, textarea, select') ? target : target.querySelector('input');
    setTimeout(() => focusable && focusable.focus({ preventScroll: true }), VC.motion ? 500 : 0);
    if (VC.motion) gsap.fromTo(target, { x: -8 }, { x: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
  }

  function openInstagram(href) {
    // Not using the 'noopener' feature string: it makes window.open return null, hiding a blocked popup.
    const w = window.open(href, '_blank');
    if (w) { try { w.opener = null; } catch { /* cross-origin */ } }
    else window.location.href = href; // popup blocked (e.g. gesture expired after an async copy)
  }
  el.send.addEventListener('click', async e => {
    e.preventDefault();
    const bad = validate();
    if (bad) { focusInvalid(bad); return; }
    const href = el.send.href;
    // Copy BEFORE leaving the page. The synchronous copy runs inside the user gesture (needed on iOS)
    // and lets us open Instagram in the same gesture; the async Clipboard API is only a fallback.
    let ok = legacyCopy(el.msg.value);
    if (!ok && navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(el.msg.value); ok = true; } catch { ok = false; }
    }
    showToast(ok ? 'o.copied' : 'o.copyFail');
    if (!ok) { el.msg.focus(); el.msg.select(); } // pre-selected for a manual copy when they come back
    openInstagram(href);
  });
  el.copy.addEventListener('click', () => {
    const bad = validate();
    if (bad) { focusInvalid(bad); return; }
    copyMessage().then(ok => {
      showToast(ok ? 'o.copied' : 'o.copyFail');
      if (!ok) { el.msg.focus(); el.msg.select(); }
    });
  });

  /* ---------- draft (per-device convenience; phone is never stored) ---------- */
  function saveDraft() {
    const s = getState();
    delete s.phone; delete s.img;
    try { store.set(DRAFT_KEY, JSON.stringify(s)); } catch { /* storage blocked (private mode) */ }
  }
  function loadDraft() {
    let s = null;
    try { s = JSON.parse(store.get(DRAFT_KEY) || 'null'); } catch { s = null; }
    if (!s || typeof s !== 'object' || Array.isArray(s)) {
      if (s !== null) try { store.del(DRAFT_KEY); } catch { /* ignore */ }
      return;
    }
    try {
      const check = (name, val) => { const i = form.querySelector(`input[name="${name}"][value="${CSS.escape(String(val))}"]`); if (i) i.checked = true; };
      if (s.style) check('style', s.style);
      if (s.roses) check('roses', s.roses);
      (Array.isArray(s.colors) ? s.colors : []).forEach(v => check('colors', v));
      (Array.isArray(s.extras) ? s.extras : []).forEach(v => check('extras', v));
      ['ribbonText', 'noteText', 'date', 'time', 'name', 'notes'].forEach(k => { if (typeof s[k] === 'string' && s[k] && form.elements[k]) form.elements[k].value = s[k]; });
      if (s.date && dateError(s.date)) form.elements.date.value = '';
    } catch {
      // Corrupt draft: discard it and start clean
      form.reset();
      try { store.del(DRAFT_KEY); } catch { /* ignore */ }
    }
  }

  el.reset.addEventListener('click', () => {
    form.reset();
    try { store.del(DRAFT_KEY); } catch { /* ignore */ }
    Object.keys(errorTargets).forEach(k => setError(k, null));
    el.formError.hidden = true;
    el.toast.textContent = '';
    lastImg = null;
    render();
    if (VC.scrollTo) VC.scrollTo($('#builder'), -80);
    else window.scrollTo({ top: $('#builder').offsetTop - 80 });
  });

  /* ---------- events ---------- */
  form.addEventListener('submit', e => e.preventDefault());
  form.addEventListener('input', () => { render(); clearIfFixed(); saveDraft(); });
  form.addEventListener('change', e => {
    render(); clearIfFixed(); saveDraft();
    const label = e.target.closest('.chip, .style-opt');
    if (label && VC.motion) gsap.fromTo(label, { scale: 0.92 }, { scale: 1, duration: 0.6, ease: 'back.out(3)', clearProps: 'scale' });
  });
  VC.onLang(() => {
    render();
    Object.keys(activeErrors).forEach(k => activeErrors[k] && setError(k, activeErrors[k]));
  });

  // Hide the mobile review bar while the summary itself is on screen
  new IntersectionObserver(([e]) => el.bar.classList.toggle('is-hidden', e.isIntersecting), { threshold: 0.15 })
    .observe($('#summary'));

  loadDraft();
  render();

  /* ================= Motion ================= */
  if (!VC.motion) return;

  // Fan of bouquets: deal in from depth, then close up on scroll
  const fanCards = $$('.fan__card');
  const fanAngles = [-24, -12, 0, 12, 24];
  fanCards.forEach((c, i) => gsap.set(c, { rotationZ: fanAngles[i], z: -Math.abs(i - 2) * 40, opacity: 1 }));
  gsap.from(fanCards, {
    rotationZ: 0, rotationX: 60, z: -500, opacity: 0, duration: 1.4, ease: 'expo.out', stagger: 0.09, delay: 0.3
  });
  const fanInner = $('#fanInner');
  if (VC.finePointer) {
    VC.pointerTilt(fanInner, $('.o-hero'), { rx: 16, ry: 24 });
  } else {
    gsap.fromTo(fanInner, { rotationY: -16, rotationX: 8 }, { rotationY: 16, rotationX: -4, duration: 4.5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  }
  gsap.fromTo(fanCards, { rotationZ: i => fanAngles[i] }, {
    rotationZ: i => fanAngles[i] * 0.15, y: i => -Math.abs(i - 2) * 30, ease: 'none', immediateRender: false,
    scrollTrigger: { trigger: '.o-hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });

  // Style tiles flip in with depth
  // Desktop: tiles swing in with depth. Phones: a short rise + fade reads cleaner on a narrow grid.
  const tileFrom = VC.finePointer
    ? { rotationY: -70, z: -200, opacity: 0, transformOrigin: '0% 50%', duration: 1.1, stagger: 0.07 }
    : { y: 36, scale: 0.96, opacity: 0, duration: 0.8, stagger: 0.06 };
  gsap.from('.style-opt', {
    ...tileFrom, ease: 'expo.out',
    scrollTrigger: { trigger: '#styleGrid', start: 'top 92%' },
    onComplete: () => { if (VC.finePointer) $$('.style-opt').forEach(opt => VC.pointerTilt(opt, opt, { rx: 14, ry: 14 })); }
  });

  // Desktop: summary preview tilts toward the pointer
  if (VC.finePointer) {
    VC.pointerTilt(el.flip, $('.sum-preview'), { rx: 20, ry: 30 });
  } else {
    // Touch: the preview bouquet sways gently so the 3D card still reads on phones
    // (y + rotationZ only, so it never fights the rotationY flip when the style changes)
    gsap.fromTo(el.flip, { y: 4, rotationZ: -3 }, { y: -8, rotationZ: 3, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  }

  // Summary card rises in
  gsap.from('#sumCard', {
    y: 60, rotationX: -14, transformPerspective: 1000, opacity: 0, duration: 1.2, ease: 'expo.out',
    scrollTrigger: { trigger: '#summary', start: 'top 90%' }
  });
})();
