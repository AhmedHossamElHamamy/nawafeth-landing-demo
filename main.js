/*!
 * نوافذ | Nawafidh — Bilingual Landing Template  v2.0.0
 * JavaScript خالص بدون مكتبات. يعمل من file:// ومن أي استضافة ثابتة.
 * Vanilla JS, no dependencies. Modules: theme, header & menu, active nav, reveal, counters, pricing toggle,
 * testimonials slider, countdown, forms (validation, Formspree/any endpoint, WhatsApp), language switch, back-to-top.
 */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.remove('no-js');
  var isAR = (root.getAttribute('lang') || 'ar').indexOf('ar') === 0;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var KEY = 'nawafidh-theme';
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };
  var T = isAR ? {
    required: 'هذا الحقل مطلوب.', email: 'يرجى إدخال بريد إلكتروني صحيح.', phone: 'يرجى إدخال رقم جوال صحيح.',
    min: 'يرجى كتابة %s أحرف على الأقل.', consent: 'يرجى الموافقة للمتابعة.', ok: 'شكرًا لك! تم استلام رسالتك وسنرد عليك قريبًا.',
    sub: 'تم الاشتراك بنجاح. شكرًا لك!', fail: 'تعذّر الإرسال حاليًا. حاول مرة أخرى.', sending: 'جارٍ الإرسال…', date: 'اختر تاريخًا من اليوم فصاعدًا.',
    booked: 'تم استلام طلب الحجز وسنتواصل معك لتأكيد الموعد.'
  } : {
    required: 'This field is required.', email: 'Please enter a valid email address.', phone: 'Please enter a valid mobile number.',
    min: 'Please enter at least %s characters.', consent: 'Please accept to continue.', ok: 'Thank you! We received your message and will reply soon.',
    sub: 'You are subscribed. Thank you!', fail: 'We could not send it right now. Please try again.', sending: 'Sending…', date: 'Choose today or a later date.',
    booked: 'Your booking request was received — we will call you to confirm.'
  };
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* 1. الوضع الليلي — theme (initial value is applied by the inline script in <head>) */
  function setTheme(t, save) {
    root.setAttribute('data-theme', t);
    $$('[data-theme-toggle]').forEach(function (b) { b.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false'); });
    var m = $('meta[name="theme-color"]'); if (m) m.setAttribute('content', t === 'dark' ? '#0b1020' : '#ffffff');
    if (save) store.set(KEY, t);
  }
  setTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light', false);
  $$('[data-theme-toggle]').forEach(function (b) { b.addEventListener('click', function () { setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true); }); });
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onMq = function (e) { if (!store.get(KEY)) setTheme(e.matches ? 'dark' : 'light', false); };
    if (mq.addEventListener) mq.addEventListener('change', onMq);
  }

  /* 2. الترويسة والقائمة — header, mobile menu, active link, back to top */
  var header = $('.site-header'), toggle = $('.menu-toggle'), nav = $('#main-nav'), toTop = $('.to-top');
  function closeMenu() { if (toggle && nav) { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); } }
  if (toggle && nav) {
    toggle.addEventListener('click', function () { var o = toggle.getAttribute('aria-expanded') === 'true'; toggle.setAttribute('aria-expanded', o ? 'false' : 'true'); nav.classList.toggle('is-open', !o); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }
  var ticking = false;
  function onScroll() {
    var y = window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (toTop) toTop.classList.toggle('is-visible', y > 700);
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
  var links = $$('#main-nav a[href^="#"]');
  if ('IntersectionObserver' in window && links.length) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting && map[e.target.id]) {
          links.forEach(function (l) { l.classList.remove('is-active'); l.removeAttribute('aria-current'); });
          map[e.target.id].classList.add('is-active'); map[e.target.id].setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* 3. الظهور التدريجي — reveal on scroll */
  var rv = $$('.reveal');
  if (reduce || !('IntersectionObserver' in window)) { rv.forEach(function (el) { el.classList.add('is-visible'); }); }
  else {
    var ro = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-visible'); ro.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (el) { ro.observe(el); });
  }

  /* 4. العدادات — animated counters [data-count] */
  function fmt(n, d) { return Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }); }
  var counters = $$('[data-count]');
  function run(el) {
    var end = parseFloat(el.getAttribute('data-count')), d = (el.getAttribute('data-count').split('.')[1] || '').length, t0 = null;
    if (reduce) { el.textContent = fmt(end, d); return; }
    function step(t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - k, 3); el.textContent = fmt(end * e, d); if (k < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { run(e.target); co.unobserve(e.target); } }); }, { threshold: .4 });
    counters.forEach(function (c) { co.observe(c); });
  } else counters.forEach(run);

  /* 5. تبديل الأسعار — monthly / yearly pricing */
  $$('[data-billing]').forEach(function (sw) {
    sw.addEventListener('click', function () {
      var yearly = sw.getAttribute('aria-checked') !== 'true';
      sw.setAttribute('aria-checked', yearly ? 'true' : 'false');
      var scope = sw.closest('section') || document;
      $$('[data-monthly]', scope).forEach(function (p) { p.textContent = yearly ? p.getAttribute('data-yearly') : p.getAttribute('data-monthly'); });
      $$('[data-period]', scope).forEach(function (p) { p.textContent = yearly ? p.getAttribute('data-period-yearly') : p.getAttribute('data-period'); });
    });
  });

  /* 6. سلايدر الآراء — testimonials slider (scroll-snap + buttons + dots) */
  $$('[data-slider]').forEach(function (sl) {
    var track = $('.slides', sl), items = $$('.quote', track), dots = $('.dots', sl);
    function per() { return window.innerWidth <= 620 ? 1 : (window.innerWidth <= 960 ? 2 : 3); }
    function pages() { return Math.max(1, Math.ceil(items.length / per())); }
    function page() { var w = track.scrollWidth - track.clientWidth; return w <= 0 ? 0 : Math.round(Math.abs(track.scrollLeft) / w * (pages() - 1)); }
    function go(i) {
      i = (i + pages()) % pages();
      var target = items[Math.min(items.length - 1, i * per())];
      var dir = getComputedStyle(track).direction === 'rtl' ? -1 : 1;
      track.scrollTo({ left: dir * Math.abs(target.offsetLeft - items[0].offsetLeft), behavior: reduce ? 'auto' : 'smooth' });
    }
    function drawDots() {
      if (!dots) return; dots.innerHTML = '';
      for (var i = 0; i < pages(); i++) {
        var b = document.createElement('button'); b.type = 'button';
        b.setAttribute('aria-label', (isAR ? 'المجموعة ' : 'Group ') + (i + 1));
        b.addEventListener('click', (function (k) { return function () { go(k); }; })(i));
        dots.appendChild(b);
      }
      sync();
    }
    function sync() { if (dots) $$('button', dots).forEach(function (b, i) { b.setAttribute('aria-current', i === page() ? 'true' : 'false'); }); }
    var prev = $('[data-prev]', sl), next = $('[data-next]', sl);
    if (prev) prev.addEventListener('click', function () { go(page() - 1); });
    if (next) next.addEventListener('click', function () { go(page() + 1); });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(sync); }, { passive: true });
    window.addEventListener('resize', drawDots);
    drawDots();
  });

  /* 7. العد التنازلي — countdown [data-countdown="2026-12-31T20:00:00"] */
  $$('[data-countdown]').forEach(function (box) {
    var target = new Date(box.getAttribute('data-countdown')).getTime();
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function tick() {
      var s = Math.max(0, Math.floor((target - Date.now()) / 1000));
      var v = { d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
      Object.keys(v).forEach(function (k) { var el = $('[data-unit="' + k + '"]', box); if (el) el.textContent = pad(v[k]); });
    }
    tick(); setInterval(tick, 1000);
  });

  /* 8. النماذج — forms: [data-validate]; data-endpoint="https://formspree.io/f/xxxx" to send, data-redirect="thank-you.html" */
  var today = new Date(); today.setHours(0, 0, 0, 0);
  function check(f) {
    var el = $('input,select,textarea', f); if (!el) return true;
    var v = (el.type === 'checkbox') ? el.checked : el.value.trim(), msg = '';
    if (el.required && !v) msg = el.type === 'checkbox' ? T.consent : T.required;
    else if (v && el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = T.email;
    else if (v && el.type === 'tel' && !/^[+0-9\s-]{8,16}$/.test(v)) msg = T.phone;
    else if (v && el.minLength > 0 && v.length < el.minLength) msg = T.min.replace('%s', el.minLength);
    else if (v && el.type === 'date' && new Date(v) < today) msg = T.date;
    f.classList.toggle('invalid', !!msg);
    var err = $('.error', f); if (err) err.textContent = msg;
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  }
  $$('form[data-validate]').forEach(function (form) {
    var fields = $$('.field, .check-field', form), status = $('.form-status', form);
    fields.forEach(function (f) {
      var el = $('input,select,textarea', f); if (!el) return;
      el.addEventListener('blur', function () { if (el.value || f.classList.contains('invalid')) check(f); });
      el.addEventListener('input', function () { if (f.classList.contains('invalid')) check(f); });
      el.addEventListener('change', function () { if (f.classList.contains('invalid')) check(f); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = fields.map(check).every(Boolean);
      if (!ok) { var first = $('.invalid input, .invalid select, .invalid textarea', form); if (first) first.focus(); return; }
      var hp = $('.hp input', form); if (hp && hp.value) return; // bot
      var endpoint = form.getAttribute('data-endpoint'), redirect = form.getAttribute('data-redirect');
      var done = function () {
        if (redirect) { window.location.href = redirect; return; }
        if (status) { status.className = 'form-status ok'; status.textContent = T[form.getAttribute('data-success') || 'ok'] || T.ok; }
        form.reset();
      };
      if (!endpoint) { done(); return; }
      var btn = $('[type="submit"]', form), label = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = T.sending; }
      fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); done(); })
        .catch(function () { if (status) { status.className = 'form-status fail'; status.textContent = T.fail; } })
        .then(function () { if (btn) { btn.disabled = false; btn.textContent = label; } });
    });
    // إرسال عبر واتساب — send the form content to WhatsApp (data-whatsapp="9665XXXXXXXX")
    var wa = $('[data-whatsapp]', form);
    if (wa) wa.addEventListener('click', function () {
      var ok = fields.map(check).every(Boolean); if (!ok) return;
      var lines = $$('input:not([type=checkbox]):not([type=hidden]),select,textarea', form).filter(function (i) { return i.value && !i.closest('.hp'); })
        .map(function (i) { var l = $('label[for="' + i.id + '"]', form); return (l ? l.textContent.trim() + ': ' : '') + i.value.trim(); });
      window.open('https://wa.me/' + wa.getAttribute('data-whatsapp') + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    });
  });

  /* 9. تبديل اللغة يحافظ على القسم الحالي — language switch keeps the current section hash */
  $$('[data-lang-switch]').forEach(function (a) { a.addEventListener('click', function () { if (location.hash) a.setAttribute('href', a.getAttribute('href').split('#')[0] + location.hash); }); });

  /* 10. السنة الحالية — current year */
  $$('[data-year]').forEach(function (y) { y.textContent = new Date().getFullYear(); });
})();
