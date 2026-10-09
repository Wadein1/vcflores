/* VC Flores shared script: i18n, nav + mobile menu, lightbox, petals, and GSAP scroll/3D choreography.
   Every section block is guarded so the same file runs on index.html and order.html. */
(() => {
  const root = document.documentElement;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  const motion = !reduceMotion && hasGsap;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  if (!motion) root.classList.remove('motion');

  /* ---------------- i18n ---------------- */
  const dict = {
    en: {
      skip: 'Skip to content',
      'nav.collection': 'Bouquets', 'nav.details': 'Details', 'nav.order': 'How to order', 'nav.gallery': 'Gallery',
      'nav.menu': 'Menu', 'nav.close': 'Close menu', 'nav.home': 'Home',
      'cta.order': 'Start an order', 'cta.orderShort': 'Order', 'cta.see': 'See bouquets', 'cta.dm': 'Message us',
      'hero.eyebrow': 'Waukesha, WI. Pick up only',
      'hero.title': 'Where there are flowers, <em>there is love.</em>',
      'hero.sub': 'Big, beautiful rose bouquets for quinceañeras, birthdays and the big questions. Made to order in Waukesha.',
      'collection.title': 'Signature bouquets',
      'collection.sub': 'Every one is built by hand to order. Pick a style, then make it yours.',
      b1: 'Packed tight and perfectly round. Mix pinks, purples and whites, or go all one color.',
      b2: '75 red roses with a crown, butterflies and a birthday ribbon.',
      'b3.name': 'Crowned Heart',
      b3: 'Red roses shaped into a heart, wrapped in white and topped with a tiara.',
      b4: 'Ask the question with a heart of red roses and your words on the ribbon.',
      b5: 'Sunflowers, gerberas and yellow roses. Made for Yellow Flower Day, perfect any day.',
      'b6.name': 'Pink & White',
      b6: "Pink and cream roses, baby's breath and a satin bow with a custom message.",
      'zoom.title': 'Every bouquet starts with your idea.',
      'zoom.sub': 'Tell us the colors, the occasion and the name on the ribbon. We take it from there.',
      'details.title': 'The little things make it yours',
      'd1.t': 'Crowns & tiaras', d1: 'For quinceañeras, birthdays and anyone who deserves one.',
      'd2.t': 'Butterflies', d2: 'Gold or white, scattered across the roses.',
      'd3.t': 'Ribbons with a message', d3: 'A name, a date or the big question.',
      'd4.t': 'Handwritten notes', d4: 'Add a card and say what you mean, in your own words.',
      'order.title': 'Ordering is simple',
      'order.note': 'Planning for a big date? Message us early so we can save your spot.',
      's1.t': 'Pick your style', s1: 'Use our order builder to choose a bouquet, colors and extras like a crown or a name ribbon.',
      's2.t': 'Send us a DM', s2: 'We turn your choices into a message. Paste it to @vcfloress on Instagram and send.',
      's3.t': 'Pick it up', s3: 'We confirm the details and pickup time. Pick up only, in Waukesha, WI.',
      'gallery.title': 'Recent work', 'gallery.sub': 'Tap any bouquet to see it up close.',
      'contact.title': "Tell us what you're celebrating.",
      'contact.sub': 'Build your order online, or message us on Instagram. Follow along on TikTok too.',
      'fact.loc': 'Waukesha, WI', 'fact.pickup': 'Pick up only', 'fact.followers': '2,600+ followers on Instagram',

      /* order page */
      'o.title': 'Build your <em>bouquet.</em>',
      'o.sub': "Pick a few options. We'll turn them into a message you can send us on Instagram.",
      'o.style': 'Choose a style', 'o.custom': 'Something custom', 'o.customSub': 'Tell us your idea in the notes',
      'o.size': 'How many roses?', 'o.unsure': 'Not sure yet', 'o.sizeHelp': 'Not sure? We can help you choose by DM.',
      'o.colors': 'Colors', 'o.colorsHelp': 'Pick as many as you like.',
      'c.red': 'Red', 'c.pink': 'Pink', 'c.white': 'White', 'c.purple': 'Purple', 'c.yellow': 'Yellow', 'c.mixed': 'Mixed',
      'o.extras': 'Extras',
      'e.crown': 'Crown or tiara', 'e.butterflies': 'Butterflies', 'e.ribbon': 'Ribbon with a message', 'e.note': 'Handwritten note', 'e.breath': "Baby's breath",
      'o.ribbonLabel': 'Ribbon text', 'o.ribbonHelp': 'Example: Feliz 15 Ana',
      'o.noteLabel': 'Note card message', 'o.noteHelp': 'We write it by hand on a card.',
      'o.pickup': 'Pickup details',
      'o.date': 'Pickup date', 'o.time': 'Preferred time',
      't.any': 'Any time', 't.morning': 'Morning', 't.afternoon': 'Afternoon', 't.evening': 'Evening',
      'o.name': 'Your name', 'o.phone': 'Phone (optional)', 'o.phoneHelp': 'Only if you want a call or text back.',
      'o.notes': 'Anything else? (optional)', 'o.notesHelp': 'Occasion, inspiration, budget. Whatever helps.',
      'o.pickupNote': 'Pick up only, in Waukesha, WI. We confirm the exact time by DM.',
      'o.summary': 'Your order', 'o.empty': 'Choose a style to get started.',
      'o.preview': 'Message preview',
      'o.send': 'Send on Instagram', 'o.copy': 'Copy message', 'o.reset': 'Start over', 'o.review': 'Review',
      'o.how': "Instagram doesn't allow pre-filled messages, so we copy it for you. Just paste it in the chat and send.",
      'o.copied': 'Copied. Paste it in the Instagram chat.',
      'o.copyFail': "Couldn't copy automatically. Select the message and copy it.",
      'o.errStyle': 'Pick a style, or choose Something custom.',
      'o.errDate': 'Choose a pickup date.', 'o.errDatePast': 'Pick a date from today on.',
      'o.errName': 'Add your name so we know who it is for.',
      'o.errSummary': 'A few things are missing. Check the highlighted fields.',
      'o.progress': '{n} of 4 done',
      'm.hi': "Hi VC Flores! I'd like to order:", 'm.style': 'Style', 'm.roses': 'Roses', 'm.colors': 'Colors',
      'm.extras': 'Extras', 'm.ribbon': 'Ribbon', 'm.note': 'Note card', 'm.pickup': 'Pickup', 'm.name': 'Name',
      'm.phone': 'Phone', 'm.notes': 'Notes', 'm.thanks': 'Thank you!',


      'meta.title': 'VC Flores | Rose Bouquets in Waukesha, WI', 'meta.orderTitle': 'Order a Bouquet | VC Flores',
      mq1: 'Buchón bouquets', mq2: 'Rose hearts', mq3: 'Quinceañeras', mq4: 'Birthdays', mq5: 'Yellow flowers', mq6: 'Proposals',
      'b1.name': 'Classic Buchón', 'b2.name': 'Happy 18th', 'b4.name': 'Will You Be My Girlfriend?', 'b5.name': 'Yellow Flowers',
      seal: 'Where there are flowers, there is love ✿ VC Flores ✿',
      'aria.home': 'VC Flores home', 'aria.main': 'Main', 'aria.mobile': 'Mobile menu', 'aria.photo': 'Bouquet photo',
      'aria.close': 'Close', 'aria.prev': 'Previous photo', 'aria.next': 'Next photo',
      alt1: "Round ramo buchón of pink, purple and white roses with butterflies", alt2: "Red rose bouquet with a silver crown, butterflies and a Feliz 18 ribbon", alt3: "Heart-shaped bouquet of red roses wrapped in white with a tiara", alt4: "Heart of red roses with a ribbon asking ¿Quieres ser mi novia?", alt5: "Yellow bouquet of sunflowers, gerberas and yellow roses", alt6: "Pink and cream rose bouquet with baby's breath and a satin bow", alt7: "A table full of yellow bouquets ready for pickup", alt8: "Tiara set on a heart of red roses", alt9: "White and gold butterflies on red roses", alt10: "Satin ribbon with a custom message across red roses", alt11: "Handwritten card tucked into a pink bouquet", alt12: "Pink, purple and white ramo buchón", alt13: "Feliz 18 bouquet with 75 red roses and a crown", alt14: "Yellow Flower Day bouquets lined up for pickup", alt15: "Sunflower and yellow rose bouquet", alt16: "Pink and cream roses with a satin bow", alt17: "Pink rose bouquet with a letter charm and bow", alt18: "Handwritten note in a pink bouquet", alt19: "Red rose heart with a tiara", alt20: "¿Quieres ser mi novia? rose heart",
      langLabel: 'ES', langAria: 'Cambiar a español'
    },
    es: {
      skip: 'Ir al contenido',
      'nav.collection': 'Ramos', 'nav.details': 'Detalles', 'nav.order': 'Cómo pedir', 'nav.gallery': 'Galería',
      'nav.menu': 'Menú', 'nav.close': 'Cerrar menú', 'nav.home': 'Inicio',
      'cta.order': 'Haz tu pedido', 'cta.orderShort': 'Pedir', 'cta.see': 'Ver ramos', 'cta.dm': 'Escríbenos',
      'hero.eyebrow': 'Waukesha, WI. Solo para recoger',
      'hero.title': 'Donde hay flores, <em>hay amor.</em>',
      'hero.sub': 'Ramos de rosas grandes y hermosos para quinceañeras, cumpleaños y las grandes preguntas. Hechos a pedido en Waukesha.',
      'collection.title': 'Nuestros ramos',
      'collection.sub': 'Cada uno se arma a mano bajo pedido. Escoge un estilo y hazlo tuyo.',
      b1: 'Compacto y perfectamente redondo. Mezcla rosas, morados y blancos, o todo de un color.',
      b2: '75 rosas rojas con corona, mariposas y listón de cumpleaños.',
      'b3.name': 'Corazón con corona',
      b3: 'Rosas rojas en forma de corazón, envueltas en blanco y con tiara.',
      b4: 'Haz la pregunta con un corazón de rosas rojas y tus palabras en el listón.',
      b5: 'Girasoles, gerberas y rosas amarillas. Para el Día de las Flores Amarillas o cualquier día.',
      'b6.name': 'Rosa y blanco',
      b6: 'Rosas rosadas y crema, nube y moño de satín con mensaje personalizado.',
      'zoom.title': 'Cada ramo empieza con tu idea.',
      'zoom.sub': 'Dinos los colores, la ocasión y el nombre en el listón. Nosotros hacemos el resto.',
      'details.title': 'Los detalles lo hacen tuyo',
      'd1.t': 'Coronas y tiaras', d1: 'Para quinceañeras, cumpleaños y quien se la merezca.',
      'd2.t': 'Mariposas', d2: 'Doradas o blancas, entre las rosas.',
      'd3.t': 'Listones con mensaje', d3: 'Un nombre, una fecha o la gran pregunta.',
      'd4.t': 'Notas escritas a mano', d4: 'Agrega una tarjeta y dilo con tus propias palabras.',
      'order.title': 'Pedir es fácil',
      'order.note': '¿Tienes una fecha especial? Escríbenos con tiempo para apartar tu lugar.',
      's1.t': 'Escoge tu estilo', s1: 'Usa nuestro formulario para elegir ramo, colores y extras como corona o listón con nombre.',
      's2.t': 'Mándanos DM', s2: 'Convertimos tus opciones en un mensaje. Pégalo a @vcfloress en Instagram y envíalo.',
      's3.t': 'Pasa a recogerlo', s3: 'Confirmamos los detalles y la hora. Solo para recoger, en Waukesha, WI.',
      'gallery.title': 'Trabajos recientes', 'gallery.sub': 'Toca un ramo para verlo de cerca.',
      'contact.title': 'Cuéntanos qué celebras.',
      'contact.sub': 'Arma tu pedido en línea o escríbenos por Instagram. Síguenos también en TikTok.',
      'fact.loc': 'Waukesha, WI', 'fact.pickup': 'Solo para recoger', 'fact.followers': 'Más de 2,600 seguidores en Instagram',

      'o.title': 'Arma tu <em>ramo.</em>',
      'o.sub': 'Escoge unas opciones. Las convertimos en un mensaje para mandarnos por Instagram.',
      'o.style': 'Escoge un estilo', 'o.custom': 'Algo personalizado', 'o.customSub': 'Cuéntanos tu idea en las notas',
      'o.size': '¿Cuántas rosas?', 'o.unsure': 'Aún no sé', 'o.sizeHelp': '¿No sabes? Te ayudamos a escoger por DM.',
      'o.colors': 'Colores', 'o.colorsHelp': 'Escoge los que quieras.',
      'c.red': 'Rojo', 'c.pink': 'Rosa', 'c.white': 'Blanco', 'c.purple': 'Morado', 'c.yellow': 'Amarillo', 'c.mixed': 'Mixto',
      'o.extras': 'Extras',
      'e.crown': 'Corona o tiara', 'e.butterflies': 'Mariposas', 'e.ribbon': 'Listón con mensaje', 'e.note': 'Nota escrita a mano', 'e.breath': 'Nube',
      'o.ribbonLabel': 'Texto del listón', 'o.ribbonHelp': 'Ejemplo: Feliz 15 Ana',
      'o.noteLabel': 'Mensaje de la tarjeta', 'o.noteHelp': 'Lo escribimos a mano en una tarjeta.',
      'o.pickup': 'Datos para recoger',
      'o.date': 'Fecha para recoger', 'o.time': 'Hora preferida',
      't.any': 'Cualquier hora', 't.morning': 'Mañana', 't.afternoon': 'Tarde', 't.evening': 'Noche',
      'o.name': 'Tu nombre', 'o.phone': 'Teléfono (opcional)', 'o.phoneHelp': 'Solo si quieres que te llamemos o escribamos.',
      'o.notes': '¿Algo más? (opcional)', 'o.notesHelp': 'Ocasión, inspiración, presupuesto. Lo que ayude.',
      'o.pickupNote': 'Solo para recoger en Waukesha, WI. Confirmamos la hora exacta por DM.',
      'o.summary': 'Tu pedido', 'o.empty': 'Escoge un estilo para empezar.',
      'o.preview': 'Vista previa del mensaje',
      'o.send': 'Enviar por Instagram', 'o.copy': 'Copiar mensaje', 'o.reset': 'Empezar de nuevo', 'o.review': 'Revisar',
      'o.how': 'Instagram no permite mensajes prellenados, así que lo copiamos por ti. Solo pégalo en el chat y envíalo.',
      'o.copied': 'Copiado. Pégalo en el chat de Instagram.',
      'o.copyFail': 'No se pudo copiar. Selecciona el mensaje y cópialo.',
      'o.errStyle': 'Escoge un estilo o Algo personalizado.',
      'o.errDate': 'Escoge una fecha para recoger.', 'o.errDatePast': 'Escoge una fecha de hoy en adelante.',
      'o.errName': 'Agrega tu nombre para saber de quién es.',
      'o.errSummary': 'Faltan algunos datos. Revisa los campos marcados.',
      'o.progress': '{n} de 4 listos',
      'm.hi': '¡Hola VC Flores! Quiero hacer un pedido:', 'm.style': 'Estilo', 'm.roses': 'Rosas', 'm.colors': 'Colores',
      'm.extras': 'Extras', 'm.ribbon': 'Listón', 'm.note': 'Tarjeta', 'm.pickup': 'Recoger', 'm.name': 'Nombre',
      'm.phone': 'Teléfono', 'm.notes': 'Notas', 'm.thanks': '¡Gracias!',


      'meta.title': 'VC Flores | Ramos de rosas en Waukesha, WI', 'meta.orderTitle': 'Haz tu pedido | VC Flores',
      mq1: 'Ramos buchones', mq2: 'Corazones de rosas', mq3: 'Quinceañeras', mq4: 'Cumpleaños', mq5: 'Flores amarillas', mq6: 'Propuestas',
      'b1.name': 'Ramo Buchón', 'b2.name': 'Feliz 18', 'b4.name': '¿Quieres ser mi novia?', 'b5.name': 'Flores amarillas',
      seal: 'Donde hay flores, hay amor ✿ VC Flores ✿',
      'aria.home': 'Inicio de VC Flores', 'aria.main': 'Principal', 'aria.mobile': 'Menú móvil', 'aria.photo': 'Foto del ramo',
      'aria.close': 'Cerrar', 'aria.prev': 'Foto anterior', 'aria.next': 'Foto siguiente',
      alt1: "Ramo buchón redondo de rosas rosas, moradas y blancas con mariposas", alt2: "Ramo de rosas rojas con corona plateada, mariposas y listón de Feliz 18", alt3: "Ramo de rosas rojas en forma de corazón, envuelto en blanco con tiara", alt4: "Corazón de rosas rojas con un listón que pregunta ¿Quieres ser mi novia?", alt5: "Ramo amarillo de girasoles, gerberas y rosas amarillas", alt6: "Ramo de rosas rosadas y crema con nube y moño de satín", alt7: "Una mesa llena de ramos amarillos listos para recoger", alt8: "Tiara sobre un corazón de rosas rojas", alt9: "Mariposas blancas y doradas sobre rosas rojas", alt10: "Listón de satín con mensaje sobre rosas rojas", alt11: "Tarjeta escrita a mano dentro de un ramo rosa", alt12: "Ramo buchón de rosas rosas, moradas y blancas", alt13: "Ramo Feliz 18 con 75 rosas rojas y corona", alt14: "Ramos del Día de las Flores Amarillas listos para recoger", alt15: "Ramo de girasoles y rosas amarillas", alt16: "Rosas rosadas y crema con moño de satín", alt17: "Ramo de rosas rosadas con letra decorativa y moño", alt18: "Nota escrita a mano en un ramo rosa", alt19: "Corazón de rosas rojas con tiara", alt20: "Corazón de rosas ¿Quieres ser mi novia?",
      langLabel: 'EN', langAria: 'Switch to English'
    }
  };

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage blocked */ } },
    del(k) { try { localStorage.removeItem(k); } catch { /* storage blocked */ } }
  };

  let lang = store.get('vc-lang') || ((navigator.language || 'en').toLowerCase().startsWith('es') ? 'es' : 'en');
  const langListeners = [];
  const t = key => (dict[lang] && dict[lang][key]) ?? dict.en[key] ?? key;

  function applyLang(next) {
    lang = dict[next] ? next : 'en';
    root.lang = lang;
    $$('[data-i18n]').forEach(el => { const v = t(el.dataset.i18n); if (v != null) el.textContent = v; });
    $$('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
    $$('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
    $$('[data-i18n-ph]').forEach(el => el.setAttribute('placeholder', t(el.dataset.i18nPh)));
    $$('[data-i18n-alt]').forEach(el => { el.alt = t(el.dataset.i18nAlt); });
    const label = $('#langLabel');
    if (label) label.textContent = t('langLabel');
    $('#langToggle')?.setAttribute('aria-label', t('langAria'));
    store.set('vc-lang', lang);
    langListeners.forEach(fn => fn(lang));
  }
  applyLang(lang);
  $('#langToggle')?.addEventListener('click', () => {
    applyLang(lang === 'en' ? 'es' : 'en');
    if (motion) ScrollTrigger.refresh();
  });

  // Shared API for order.js
  window.VC = { t, store, motion, finePointer, onLang: fn => langListeners.push(fn), get lang() { return lang; } };

  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  /* ---------------- Nav state ---------------- */
  const nav = $('#nav');
  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;height:40px;width:1px;pointer-events:none';
  document.body.prepend(sentinel);
  if (nav) new IntersectionObserver(([e]) => nav.classList.toggle('is-scrolled', !e.isIntersecting)).observe(sentinel);

  /* ---------------- Mobile menu ---------------- */
  const menuBtn = $('#menuBtn');
  const menu = $('#mobileMenu');
  if (menuBtn && menu) {
    const setMenu = open => {
      menu.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', t(open ? 'nav.close' : 'nav.menu'));
      const menuIcon = menuBtn.querySelector('i');
      if (menuIcon) menuIcon.className = open ? 'ph ph-x' : 'ph ph-list';
      root.classList.toggle('menu-open', open);
      menu.inert = !open;
      if (open) menu.querySelector('a')?.focus({ preventScroll: true });
    };
    menu.inert = true;
    menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
    menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); } });
    matchMedia('(min-width: 1025px)').addEventListener('change', e => { if (e.matches) setMenu(false); });
  }

  /* ---------------- Smooth scroll (desktop only) ----------------
     Lenis smooths wheel/trackpad input so scrubbed animations glide.
     Touch devices keep native momentum scrolling, which already feels right. */
  const lenis = (motion && finePointer && window.Lenis) ? new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true }) : null;
  if (lenis) {
    root.classList.add('has-lenis');
    lenis.on('scroll', () => window.ScrollTrigger && ScrollTrigger.update());
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollToY = y => {
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: motion || !reduceMotion ? 'smooth' : 'auto' });
  };
  const scrollToEl = (target, offset = 0) => scrollToY(target.getBoundingClientRect().top + window.scrollY + offset);
  window.VC.scrollTo = scrollToEl;
  window.VC.scrollToY = scrollToY;
  window.VC.lenis = lenis;

  // Same-page anchor links glide instead of jumping
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = target.id === 'top' ? -window.scrollY - target.getBoundingClientRect().top : 0;
    scrollToEl(target, offset);
    history.replaceState(null, '', id);
  });
  if (menu) {
    new MutationObserver(() => {
      if (!lenis) return;
      menu.classList.contains('is-open') ? lenis.stop() : lenis.start();
    }).observe(menu, { attributes: true, attributeFilter: ['class'] });
  }

  /* ---------------- Lightbox ---------------- */
  const lb = $('#lightbox');
  const ringItems = $$('.ring__item');
  if (lb && ringItems.length) {
    const lbImg = $('#lbImg');
    let lbIndex = 0;
    const showLb = i => {
      lbIndex = (i + ringItems.length) % ringItems.length;
      const img = ringItems[lbIndex].querySelector('img');
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
    };
    ringItems.forEach((btn, i) => btn.addEventListener('click', () => {
      showLb(i);
      if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', '');
      lenis && lenis.stop();
    }));
    // Safe close: works with native <dialog> and the [open]-attribute fallback
    const closeLb = () => {
      if (typeof lb.close === 'function') lb.close(); else lb.removeAttribute('open');
      lenis && lenis.start();
    };
    lb.addEventListener('close', () => lenis && lenis.start());
    $('#lbClose')?.addEventListener('click', closeLb);
    $('#lbPrev')?.addEventListener('click', () => showLb(lbIndex - 1));
    $('#lbNext')?.addEventListener('click', () => showLb(lbIndex + 1));
    lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && lb.hasAttribute('open')) { e.preventDefault(); closeLb(); }
    });
    lb.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') showLb(lbIndex - 1);
      if (e.key === 'ArrowRight') showLb(lbIndex + 1);
    });
    // Swipe between photos on touch screens
    let sx = null;
    lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', e => {
      if (sx == null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) showLb(lbIndex + (dx < 0 ? 1 : -1));
      sx = null;
    });
  }

  /* ---------------- Falling petals (hero canvas) ---------------- */
  const canvas = $('#petals');
  if (canvas && !reduceMotion && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const colors = ['#f4a7bd', '#e98aa7', '#f9d3de', '#d4577b', '#fbe3ea'];
    let w = 0, h = 0, petals = [], running = false, raf = 0, lastW = 0;

    const make = initial => {
      const z = Math.random() * 0.8 + 0.2; // depth: far petals are small, slow and faint
      return {
        x: Math.random() * w, y: initial ? Math.random() * h : -20, z,
        s: 6 + z * 10, vy: 0.35 + z * 0.9, vx: (Math.random() - 0.5) * 0.4,
        rot: Math.random() * Math.PI * 2, vr: (Math.random() - 0.5) * 0.02,
        flip: Math.random() * Math.PI * 2, vf: 0.01 + Math.random() * 0.03,
        sway: Math.random() * Math.PI * 2, color: colors[(Math.random() * colors.length) | 0]
      };
    };
    function resize() {
      // Phones: lower pixel density + fewer petals keeps scrolling at 60fps
      const dpr = Math.min(window.devicePixelRatio || 1, finePointer ? 2 : 1.5);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Address-bar show/hide only changes height: keep the petals, don't respawn.
      if (w !== lastW) petals = Array.from({ length: finePointer ? Math.round(Math.min(34, w / 40)) : 12 }, () => make(true));
      lastW = w;
    }
    let last = performance.now();
    function draw(now) {
      // Frame-rate independent so 120Hz phones don't double the fall speed
      const dt = Math.min(3, (now - last) / 16.67);
      last = now;
      ctx.clearRect(0, 0, w, h);
      for (const p of petals) {
        p.sway += 0.01 * dt;
        p.x += (p.vx + Math.sin(p.sway) * 0.5 * p.z) * dt;
        p.y += p.vy * dt; p.rot += p.vr * dt; p.flip += p.vf * dt;
        if (p.y > h + 30 || p.x < -40 || p.x > w + 40) Object.assign(p, make(false));
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(Math.cos(p.flip), 1); // fake 3D flip
        ctx.globalAlpha = 0.35 + p.z * 0.5;
        ctx.fillStyle = p.color;
        const sz = p.s;
        ctx.beginPath();
        ctx.moveTo(0, -sz);
        ctx.bezierCurveTo(sz * 0.9, -sz * 0.6, sz * 0.7, sz * 0.8, 0, sz);
        ctx.bezierCurveTo(-sz * 0.7, sz * 0.8, -sz * 0.9, -sz * 0.6, 0, -sz);
        ctx.fill();
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    }
    resize();
    // Throttle to one resize per frame; skip when the canvas size hasn't changed
    let resizeRaf = 0;
    window.addEventListener('resize', () => {
      if (resizeRaf) return;
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0;
        if (canvas.clientWidth !== w || canvas.clientHeight !== h) resize();
      });
    });
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(draw); }
      else if (!e.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
    }).observe(canvas);
  }

  if (!motion) return;

  /* ================= GSAP choreography ================= */
  gsap.registerPlugin(ScrollTrigger);
  // Mobile browsers fire resize when the address bar hides; recalculating pins then causes jumps.
  ScrollTrigger.config({ ignoreMobileResize: true });
  // With Lenis the scroll is already smoothed, so scrub can follow 1:1. On touch, a short catch-up feels fluid.
  const SCRUB = lenis ? true : 0.5;

  /* --- Reusable pointer tilt: GPU transforms via quickTo, eased back on leave --- */
  function pointerTilt(target, area, { rx = 10, ry = 12, onMove } = {}) {
    gsap.set(target, { transformPerspective: 1000 });
    const toX = gsap.quickTo(target, 'rotationX', { duration: 0.6, ease: 'power3.out' });
    const toY = gsap.quickTo(target, 'rotationY', { duration: 0.6, ease: 'power3.out' });
    area.addEventListener('pointermove', e => {
      const r = area.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      toX((0.5 - py) * rx);
      toY((px - 0.5) * ry);
      onMove && onMove(px, py);
    });
    area.addEventListener('pointerleave', () => { toX(0); toY(0); });
  }
  window.VC.pointerTilt = pointerTilt;

  /* --- Split headings into words for 3D flip-up reveals --- */
  function splitWords(el) {
    const walk = node => {
      [...node.childNodes].forEach(child => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement('span'); w.className = 'w';
            const wi = document.createElement('span'); wi.className = 'wi'; wi.textContent = part;
            w.appendChild(wi); frag.appendChild(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) walk(child);
      });
    };
    walk(el);
    return el.querySelectorAll('.wi');
  }

  $$('[data-split]').forEach(el => {
    const words = splitWords(el);
    const isTop = el.hasAttribute('data-split-now');
    gsap.set(el, { visibility: 'visible' });
    gsap.from(words, {
      yPercent: 110, rotationX: -80, opacity: 0, transformPerspective: 600, force3D: true,
      duration: 1.1, ease: 'expo.out', stagger: 0.05, delay: isTop ? 0.2 : 0,
      scrollTrigger: isTop ? null : { trigger: el, start: 'top 88%' }
    });
  });

  /* --- Detail tiles: desktop tilts toward the cursor, touch tilts with scroll --- */
  $$('[data-tilt]').forEach(tile => {
    tile.removeAttribute('data-reveal');
    if (finePointer) {
      gsap.from(tile, {
        y: 60, opacity: 0, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: tile, start: 'top 92%' }
      });
      pointerTilt(tile, tile, {
        onMove: (px, py) => { tile.style.setProperty('--gx', `${px * 100}%`); tile.style.setProperty('--gy', `${py * 100}%`); }
      });
    } else {
      gsap.fromTo(tile, { rotationX: 12, transformPerspective: 900, opacity: 0.5, y: 30 }, {
        rotationX: -6, opacity: 1, y: 0, ease: 'none',
        scrollTrigger: { trigger: tile, start: 'top bottom', end: 'center 40%', scrub: SCRUB }
      });
    }
  });

  /* --- Generic reveals --- */
  gsap.set('[data-reveal]', { opacity: 0, y: 40 });
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 92%',
    once: true,
    onEnter: batch => gsap.to(batch, {
      opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.1, clearProps: 'transform',
      delay: batch[0].closest('[data-top]') ? 0.6 : 0
    })
  });

  /* --- Hero 3D stage: entrance, pointer tilt (or idle float on touch), scroll spread --- */
  const stageInner = $('#stageInner');
  if (stageInner) {
    const cards = { left: $('.card3d--left'), right: $('.card3d--right'), front: $('.card3d--front') };
    const base = {
      left: { xPercent: -118, yPercent: -62, z: -60, rotationY: 18, rotationZ: -6 },
      right: { xPercent: 18, yPercent: -38, z: -40, rotationY: -18, rotationZ: 6 },
      front: { xPercent: -50, yPercent: -50, z: 80, rotationY: 0, rotationZ: 0 }
    };
    Object.keys(cards).forEach(k => gsap.set(cards[k], { ...base[k], opacity: 1, force3D: true }));
    gsap.from([cards.left, cards.right, cards.front], {
      z: -600, rotationX: 40, opacity: 0, duration: 1.6, ease: 'expo.out', stagger: 0.14, delay: 0.25
    });

    if (finePointer) {
      pointerTilt(stageInner, $('.hero'), { rx: 14, ry: 22 });
    } else {
      gsap.fromTo(stageInner, { rotationY: -12, rotationX: 5 }, {
        rotationY: 12, rotationX: -5, duration: 5, ease: 'sine.inOut', yoyo: true, repeat: -1
      });
    }

    gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: SCRUB } })
      .fromTo(cards.left, { xPercent: base.left.xPercent, rotationY: base.left.rotationY, z: base.left.z },
        { xPercent: -170, rotationY: 40, z: -220, ease: 'none', immediateRender: false }, 0)
      .fromTo(cards.right, { xPercent: base.right.xPercent, rotationY: base.right.rotationY, z: base.right.z },
        { xPercent: 70, rotationY: -40, z: -200, ease: 'none', immediateRender: false }, 0)
      .fromTo(cards.front, { z: base.front.z, yPercent: base.front.yPercent },
        { z: 260, yPercent: -64, ease: 'none', immediateRender: false }, 0)
      .to('.hero__copy', { y: -80, opacity: 0.2, ease: 'none' }, 0);
  }

  /* --- Marquee: speeds up with scroll velocity and follows direction, eased every frame --- */
  if ($('#marqueeTrack')) {
    const marquee = gsap.to('#marqueeTrack', { xPercent: -50, duration: 32, ease: 'none', repeat: -1 });
    let dir = 1, boost = 0, visible = false;
    ScrollTrigger.create({
      trigger: '.marquee', start: 'top bottom', end: 'bottom top',
      onToggle: self => { visible = self.isActive; visible ? marquee.play() : marquee.pause(); },
      onUpdate: self => { dir = self.direction; boost = Math.min(Math.abs(self.getVelocity()) / 400, 4); }
    });
    gsap.ticker.add(() => {
      if (!visible) return;
      boost *= 0.92;
      const ts = marquee.timeScale();
      marquee.timeScale(ts + (dir * (1 + boost) - ts) * 0.08);
    });
  }

  /* --- Collection: pinned horizontal pan with live coverflow ---
     Card positions are measured once per refresh; each frame only reads the track's x (no layout reads). */
  const track = $('#collectionTrack');
  if (track) {
    const cardsData = $$('.bouquet', track).map(card => ({
      card, img: card.querySelector('img'),
      setRY: gsap.quickSetter(card, 'rotationY', 'deg'),
      setZ: gsap.quickSetter(card, 'z', 'px'),
      setImgX: gsap.quickSetter(card.querySelector('img'), 'xPercent'),
      center: 0
    }));
    cardsData.forEach(d => { gsap.set(d.card, { transformPerspective: 1600, force3D: true }); if (finePointer) gsap.set(d.img, { scale: 1.12 }); });
    const measure = () => cardsData.forEach(d => { d.center = d.card.offsetLeft + d.card.offsetWidth / 2; });
    const coverflow = () => {
      const x = gsap.getProperty(track, 'x');
      const mid = innerWidth / 2;
      for (const d of cardsData) {
        const off = Math.max(-1.4, Math.min(1.4, (d.center + x - mid) / mid));
        d.setRY(off * -28);
        d.setZ(-Math.abs(off) * 180);
        if (finePointer) d.setImgX(off * -8);
      }
    };
    const panDistance = () => Math.max(0, track.scrollWidth - innerWidth);
    gsap.to(track, {
      x: () => -panDistance(),
      ease: 'none',
      onUpdate: coverflow,
      scrollTrigger: {
        trigger: '.collection', start: 'top top', end: () => '+=' + panDistance(),
        pin: true, scrub: SCRUB, invalidateOnRefresh: true, anticipatePin: 1,
        onRefresh: () => { measure(); coverflow(); }
      }
    });
    measure(); coverflow();
  }

  /* --- Zoom parallax --- */
  if ($('.zoom')) {
    const zoomScales = [4, 5, 6, 5, 6, 8, 9];
    const zoomTl = gsap.timeline({
      scrollTrigger: { trigger: '.zoom', start: 'top top', end: '+=220%', pin: true, scrub: SCRUB, anticipatePin: 1 }
    });
    $$('.zoom__el').forEach((el, i) => zoomTl.to(el, { scale: zoomScales[i], ease: 'power1.in', duration: 1, force3D: true }, 0));
    zoomTl
      .to('.zoom__veil', { opacity: 1, duration: 0.25 }, 0.85)
      .fromTo('.zoom__copy', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3 }, 0.95)
      .to({}, { duration: 0.3 });
  }

  /* --- Steps: progress line + active icons --- */
  if ($('#steps')) {
    gsap.to('#stepsFill', {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: '#steps', start: 'top 60%', end: 'bottom 60%', scrub: SCRUB }
    });
    $$('.step').forEach(step => {
      ScrollTrigger.create({ trigger: step, start: 'top 62%', toggleClass: 'is-active' });
      gsap.from(step, {
        opacity: 0, x: finePointer ? 60 : 30, rotationY: -20, transformPerspective: 900, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: step, start: 'top 90%' }
      });
    });
  }

  /* --- 3D ring gallery --- */
  const ring = $('#ring');
  if (ring) {
    const ringStage = $('.ring-stage');
    const setRadius = () => {
      const w = parseFloat(getComputedStyle(ringStage).getPropertyValue('--w')) || 220;
      ring.style.setProperty('--r', `${(w + 36) / (2 * Math.tan(Math.PI / ringItems.length))}px`);
    };
    setRadius();
    ScrollTrigger.addEventListener('refreshInit', setRadius);
    gsap.set(ring, { rotationX: -8, force3D: true });
    gsap.to(ring, {
      rotationY: -360 + 360 / ringItems.length,
      ease: 'none',
      scrollTrigger: { trigger: '.gallery', start: 'top top', end: '+=260%', pin: true, scrub: SCRUB, anticipatePin: 1 }
    });
    gsap.from('.gallery__head', {
      opacity: 0, y: 40, duration: 1, ease: 'expo.out',
      scrollTrigger: { trigger: '.gallery', start: 'top 70%' }
    });
  }

  /* --- Contact seal pops in with a 3D flip --- */
  if ($('.seal')) {
    gsap.from('.seal', {
      rotationY: 180, scale: 0.6, opacity: 0, duration: 1.4, ease: 'expo.out', transformPerspective: 800,
      scrollTrigger: { trigger: '.contact', start: 'top 80%' }
    });
  }

  // Re-measure once fonts and images settle so pins start exactly where they should
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
