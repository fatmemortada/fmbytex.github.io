/* ═══════════════════════════════════════════
   FMBytex — GA4 privacy-first loader (Québec Law 25)
   Analytics loads ONLY after explicit consent.
   Zero requests reach Google before the visitor accepts.
   ═══════════════════════════════════════════ */
(function () {
  'use strict';

  var GA_ID = 'G-Q0HFNFHMXY';
  var STREAM = GA_ID.replace('G-', ''); // _ga_<stream> cookie suffix
  var KEY = 'fmbytex-ga-consent';      // localStorage: 'granted' | 'denied'
  var isFr = (document.documentElement.getAttribute('lang') || 'en').slice(0, 2) === 'fr';

  var COPY = {
    en: {
      title: 'Cookies & analytics',
      body: 'FMBytex uses Google Analytics to understand how visitors use this site (pages visited, device and browser type, general location) so we can improve it. Analytics load only after you accept — nothing is tracked before that. You can change your choice at any time from the footer.',
      accept: 'Accept analytics',
      refuse: 'Refuse'
    },
    fr: {
      title: 'Témoins et analytique',
      body: 'FMBytex utilise Google Analytics pour comprendre comment les visiteurs utilisent ce site (pages visitées, type d’appareil et de navigateur, emplacement général) afin de l’améliorer. L’analytique ne se charge qu’après votre acceptation — aucun suivi avant. Vous pouvez modifier votre choix à tout moment depuis le pied de page.',
      accept: 'Accepter',
      refuse: 'Refuser'
    }
  };
  var t = COPY[isFr ? 'fr' : 'en'];

  function readConsent() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function storeConsent(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { /* private mode — banner re-asks next visit */ }
  }
  function clearGaCookies() {
    try {
      var host = location.hostname;
      var names = ['_ga', '_ga_' + STREAM];
      for (var i = 0; i < names.length; i++) {
        document.cookie = names[i] + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
        document.cookie = names[i] + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + host;
      }
    } catch (e) { /* cookies disabled */ }
  }

  // ── GA4 loader (runs once, only after consent) ──
  var gaLoaded = false;
  function loadGA() {
    if (gaLoaded) return;
    gaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    // send_page_view:false + one explicit event = no duplicate page_views
    gtag('config', GA_ID, { send_page_view: false });
    gtag('event', 'page_view', { page_location: window.location.href, page_title: document.title });
  }

  // ── Consent banner (design-matched, keyboard accessible) ──
  function showBanner() {
    var existing = document.getElementById('ga-consent');
    if (existing) { existing.remove(); }

    var p = document.createElement('div');
    p.className = 'ga-consent';
    p.id = 'ga-consent';
    p.setAttribute('role', 'dialog');
    p.setAttribute('aria-modal', 'false');
    p.setAttribute('aria-labelledby', 'ga-consent-title');

    var card = document.createElement('div');
    card.className = 'ga-consent-card';
    card.innerHTML =
      '<p class="ga-consent-title" id="ga-consent-title">' + t.title + '</p>' +
      '<p class="ga-consent-text">' + t.body + '</p>' +
      '<div class="ga-consent-actions">' +
      '<button type="button" class="ga-consent-accept">' + t.accept + '</button>' +
      '<button type="button" class="ga-consent-refuse">' + t.refuse + '</button>' +
      '</div>';
    p.appendChild(card);
    document.body.appendChild(p);

    var accept = card.querySelector('.ga-consent-accept');
    var refuse = card.querySelector('.ga-consent-refuse');
    accept.addEventListener('click', function () {
      storeConsent('granted');
      p.remove();
      loadGA();
    });
    refuse.addEventListener('click', function () {
      storeConsent('denied');
      clearGaCookies();
      p.remove();
    });
    // Esc = refuse-free dismissal without a decision (banner re-appears next visit)
    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape' && document.getElementById('ga-consent')) {
        p.remove();
        document.removeEventListener('keydown', onKey);
      }
    });
    // Move focus so the request is announced by screen readers
    var f = p.querySelector('.ga-consent-card');
    if (f) { f.setAttribute('tabindex', '-1'); f.focus({ preventScroll: true }); }
  }

  // ── Revocable consent: footer "Privacy · Analytics" reopens the banner ──
  function wireFooterLink() {
    var link = document.getElementById('ga-settings-link');
    if (!link) return;
    link.addEventListener('click', function (e) {
      e.preventDefault();
      showBanner();
    });
  }

  // ── Init: honour stored choice, otherwise ask first ──
  var consent = readConsent();
  if (consent === 'granted') {
    loadGA();               // prior consent — track this page view
  } else if (consent === 'denied') {
    clearGaCookies();       // safety: no GA cookies while denied
  } else {
    showBanner();           // no decision yet — ask BEFORE any tracking
  }
  wireFooterLink();
})();
