/* ═══════════════════════════════════════════════════════════════════
   FMBytex — 3D hero (browser window) + service picker.
   Ported verbatim from the approved fmbytex-3d-website showcase
   (white + purple theme, Archivo, big 3D browser window that spins,
   turns on scroll, drifts down a little with the page, drag to rotate).
   three.js loads from CDN with an 8s timeout; if it fails, a 2D canvas
   draws the same idea; if that fails too, a CSS browser window shows.
   The page never depends on the 3D to show its text, buttons or links.
   No shadow casting and no near-black colours anywhere in the scene.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var lang = (document.documentElement.lang || "en").slice(0, 2);
  if (lang !== "fr") lang = "en";

  /* ============ service picker ============ */
  var SERVICES = {
    web: {
      en: { title: "Websites — design & development",
            lead: "Your website has about three seconds to earn a visitor's trust. We build bilingual sites that make those seconds count — fast, sharp, and built to turn visits into enquiries.",
            items: ["Custom design — no templates", "Bilingual EN/FR, SEO-ready structure", "Most sites launch in 2–4 weeks"],
            k1: "Timeline", v1: "2–4 weeks", k2: "Quote", v2: "Fixed, in 24h" },
      fr: { title: "Sites web — design et développement",
            lead: "Votre site a environ trois secondes pour gagner la confiance d'un visiteur. Nous créons des sites bilingues qui comptent chaque seconde — rapides, soignés, pensés pour transformer les visites en demandes.",
            items: ["Design sur mesure — aucun gabarit", "Bilingue FR/EN, structure prête pour le SEO", "La plupart des sites sont en ligne en 2 à 4 semaines"],
            k1: "Délai", v1: "2 à 4 semaines", k2: "Devis", v2: "Fixe, en 24 h" }
    },
    brand: {
      en: { title: "Branding & identity",
            lead: "A brand is what people remember after the tab closes. We build identity systems — logo, type, colour, voice — that stay consistent everywhere your business shows up.",
            items: ["Logo & full identity system", "Brand guidelines you can actually use", "Social & print templates included"],
            k1: "Deliverable", v1: "Full identity kit", k2: "Quote", v2: "Fixed, in 24h" },
      fr: { title: "Image de marque et identité",
            lead: "Une marque, c'est ce dont on se souvient une fois l'onglet fermé. Nous créons des systèmes d'identité — logo, typographie, couleurs, ton — cohérents partout où votre entreprise apparaît.",
            items: ["Logo et système d'identité complet", "Guide de marque vraiment utilisable", "Modèles réseaux sociaux et imprimés inclus"],
            k1: "Livrable", v1: "Kit d'identité complet", k2: "Devis", v2: "Fixe, en 24 h" }
    },
    ads: {
      en: { title: "Digital advertising",
            lead: "Ads that pay for themselves start with a page that converts. We plan and run campaigns across Google and Meta, measured against enquiries and sales — not vanity clicks.",
            items: ["Google & Meta campaign setup", "Landing pages built to convert", "Reporting in plain language"],
            k1: "Channels", v1: "Google · Meta", k2: "Focus", v2: "Leads & sales" },
      fr: { title: "Publicité numérique",
            lead: "Une publicité rentable commence par une page qui convertit. Nous planifions et gérons des campagnes Google et Meta, mesurées en demandes et en ventes — pas en clics de vanité.",
            items: ["Campagnes Google et Meta", "Pages d'atterrissage qui convertissent", "Rapports en langage clair"],
            k1: "Canaux", v1: "Google · Meta", k2: "Objectif", v2: "Demandes et ventes" }
    },
    seo: {
      en: { title: "SEO & digital growth",
            lead: "If Google can't find you, neither can your customers. We handle technical SEO, local search, and content in English and French, so Montréal finds you first.",
            items: ["Technical & local SEO audit", "Bilingual keyword strategy", "Ongoing care plans after launch"],
            k1: "Languages", v1: "EN · FR", k2: "Start", v2: "Full audit" },
      fr: { title: "SEO et croissance numérique",
            lead: "Si Google ne vous trouve pas, vos clients non plus. Nous gérons le SEO technique, la recherche locale et le contenu en français et en anglais, pour que Montréal vous trouve en premier.",
            items: ["Audit SEO technique et local", "Stratégie de mots-clés bilingue", "Plans d'entretien après le lancement"],
            k1: "Langues", v1: "FR · EN", k2: "Départ", v2: "Audit complet" }
    }
  };
  var currentService = "web";
  function renderPreview(key) {
    currentService = key;
    var d = SERVICES[key][lang];
    var t = document.getElementById("pv-title");
    if (!t) return;
    t.textContent = d.title;
    document.getElementById("pv-lead").textContent = d.lead;
    var ul = document.getElementById("pv-list");
    ul.innerHTML = "";
    d.items.forEach(function (txt) {
      var li = document.createElement("li");
      li.textContent = txt;
      ul.appendChild(li);
    });
    document.getElementById("pv-k1").textContent = d.k1;
    document.getElementById("pv-v1").textContent = d.v1;
    document.getElementById("pv-k2").textContent = d.k2;
    document.getElementById("pv-v2").textContent = d.v2;
    document.querySelectorAll(".svc").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-service") === key ? "true" : "false");
    });
  }
  document.querySelectorAll(".svc").forEach(function (b) {
    b.addEventListener("click", function () { renderPreview(b.getAttribute("data-service")); });
  });
  renderPreview("web");

  /* ============ 3D scene ============ */
  var canvas = document.getElementById("fm3d");
  var glContainer = canvas ? canvas.parentElement : null;
  var glFallback = document.getElementById("fm3dFallback");
  var errBox = document.getElementById("fm-gl-error");
  function showError(msg) {
    if (!errBox) return;
    errBox.style.display = "block";
    errBox.textContent = msg;
  }

  function loadThree() {
    return new Promise(function (resolve) {
      if (window.THREE) { resolve(true); return; }
      var done = false;
      var s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.158.0/three.min.js";
      s.onload = function () { if (!done) { done = true; resolve(true); } };
      s.onerror = function () { if (!done) { done = true; resolve(false); } };
      document.head.appendChild(s);
      setTimeout(function () { if (!done) { done = true; resolve(!!window.THREE); } }, 8000);
    });
  }

  function initScene() {
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(4.1, 2.1, 5.7);
    camera.lookAt(0, 0.1, 0);

    /* environment map from a tiny hand-made room of coloured panels,
       so the metal and glass have something real to reflect */
    var envScene = new THREE.Scene();
    function panel(hex, gain, w, h, x, y, z, ry) {
      var c = new THREE.Color(hex).multiplyScalar(gain);
      var m = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide })
      );
      m.position.set(x, y, z);
      m.rotation.y = ry || 0;
      envScene.add(m);
    }
    panel(0xffffff, 8, 8, 5, 0, 6, 0, 0);            // bright ceiling light
    envScene.children[envScene.children.length - 1].rotation.x = Math.PI / 2;
    panel(0x6865D8, 2.6, 6, 4, -8, 1, -2, Math.PI / 2); // violet wall
    panel(0xDCD9F5, 2.2, 6, 4, 8, 1, 2, -Math.PI / 2);  // soft lilac fill wall
    panel(0xf3efff, 2.4, 10, 6, 0, 1, -9, 0);           // bright back wall
    var pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(envScene, 0.06).texture;

    /* lights: key, fill, rim — no shadow casting anywhere */
    var key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(4, 6, 5);
    scene.add(key);
    var fill = new THREE.DirectionalLight(0xA9A6E8, 0.9);
    fill.position.set(-6, 2, 3);
    scene.add(fill);
    var rim = new THREE.DirectionalLight(0x7A77E0, 1.4);
    rim.position.set(-3, 3, -6);
    scene.add(rim);
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));

    var group = new THREE.Group();
    group.scale.setScalar(1.35);
    scene.add(group);

    /* The hero piece: a 3D website — a browser window with a
       purple header bar, window dots, an address pill, headline
       lines and a glowing call-to-action button on its screen */
    var win = new THREE.Group();
    group.add(win);

    var frameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.15, roughness: 0.32 });
    var frame = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.55, 0.14), frameMat);
    win.add(frame);

    /* purple edge trim so the window silhouette reads on white */
    var trimMat = new THREE.MeshStandardMaterial({ color: 0x6865D8, metalness: 0.35, roughness: 0.3 });
    var trimT = new THREE.Mesh(new THREE.BoxGeometry(2.36, 0.05, 0.16), trimMat);
    trimT.position.set(0, 0.80, 0);
    win.add(trimT);
    var trimB = new THREE.Mesh(new THREE.BoxGeometry(2.36, 0.05, 0.16), trimMat);
    trimB.position.set(0, -0.80, 0);
    win.add(trimB);
    var trimL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.55, 0.16), trimMat);
    trimL.position.set(-1.175, 0, 0);
    win.add(trimL);
    var trimR = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.55, 0.16), trimMat);
    trimR.position.set(1.175, 0, 0);
    win.add(trimR);

    /* header bar */
    var header = new THREE.Mesh(
      new THREE.BoxGeometry(2.3, 0.34, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x6865D8, metalness: 0.3, roughness: 0.35 })
    );
    header.position.set(0, 0.605, 0.085);
    win.add(header);

    /* three window dots */
    [-0.95, -0.72, -0.49].forEach(function (x) {
      var dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.055, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
      );
      dot.position.set(x, 0.605, 0.12);
      win.add(dot);
    });

    /* address pill */
    var pill = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.13, 0.03),
      new THREE.MeshStandardMaterial({ color: 0xDCD9F5, roughness: 0.5 })
    );
    pill.position.set(0.42, 0.605, 0.115);
    win.add(pill);

    /* screen content: headline lines + text lines */
    var lineMat = new THREE.MeshStandardMaterial({ color: 0xA9A6E8, roughness: 0.5 });
    var headMat = new THREE.MeshStandardMaterial({ color: 0x1C1D2E, roughness: 0.45 });
    function screenLine(w, x, y, mat) {
      var m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.09, 0.03), mat);
      m.position.set(x, y, 0.09);
      win.add(m);
    }
    screenLine(0.95, -0.55, 0.22, headMat);
    screenLine(0.62, -0.715, 0.05, headMat);
    screenLine(1.25, -0.40, -0.18, lineMat);
    screenLine(1.05, -0.50, -0.36, lineMat);

    /* glowing call-to-action button on the screen */
    var cta = new THREE.Mesh(
      new THREE.BoxGeometry(0.62, 0.17, 0.05),
      new THREE.MeshStandardMaterial({
        color: 0x7A77E0, emissive: 0x6865D8, emissiveIntensity: 0.85,
        metalness: 0.2, roughness: 0.35
      })
    );
    cta.position.set(-0.72, -0.60, 0.10);
    win.add(cta);

    /* small image block on the right of the screen */
    var imgBlock = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.55, 0.04),
      new THREE.MeshStandardMaterial({ color: 0xDCD9F5, metalness: 0.1, roughness: 0.3 })
    );
    imgBlock.position.set(0.72, -0.28, 0.09);
    win.add(imgBlock);

    /* floating UI cards beside the window — a chat bubble and a
       cursor arrow, the little pieces of a live website */
    var cards = [];
    var cardMat = new THREE.MeshPhysicalMaterial({
      color: 0xE6E4F8, metalness: 0, roughness: 0.12,
      transmission: 0.6, thickness: 0.3, transparent: true, opacity: 0.95, depthWrite: false
    });
    var chat = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.38, 0.08), cardMat);
    chat.position.set(1.65, 0.75, 0.35);
    chat.renderOrder = 2;
    chat.userData.phase = 0.4;
    group.add(chat); cards.push(chat);
    var chatDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 14, 14),
      new THREE.MeshStandardMaterial({ color: 0x7A77E0, emissive: 0x6865D8, emissiveIntensity: 1.2, roughness: 0.4 })
    );
    chatDot.position.set(0, 0, 0.07);
    chat.add(chatDot);

    var cursorShape = new THREE.Shape();
    cursorShape.moveTo(0, 0.22); cursorShape.lineTo(0.16, -0.10); cursorShape.lineTo(0.03, -0.10);
    cursorShape.lineTo(0.10, -0.24); cursorShape.lineTo(0.03, -0.27); cursorShape.lineTo(-0.04, -0.13);
    cursorShape.lineTo(-0.16, -0.10); cursorShape.lineTo(0, 0.22);
    var cursorGeo = new THREE.ExtrudeGeometry(cursorShape, { depth: 0.05, bevelEnabled: false });
    var cursor = new THREE.Mesh(cursorGeo, new THREE.MeshStandardMaterial({ color: 0x6865D8, metalness: 0.3, roughness: 0.35 }));
    cursor.position.set(1.45, -0.95, 0.45);
    cursor.rotation.z = -0.25;
    cursor.userData.phase = 2.1;
    group.add(cursor); cards.push(cursor);

    /* orbit rings */
    var ringMat = new THREE.MeshBasicMaterial({ color: 0x6865D8, transparent: true, opacity: 0.85, side: THREE.DoubleSide });
    var ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.62, 0.012, 10, 128), ringMat);
    ring1.rotation.set(1.15, 0.2, 0.3);
    group.add(ring1);
    var ringMat2 = new THREE.MeshBasicMaterial({ color: 0xA9A6E8, transparent: true, opacity: 0.55, side: THREE.DoubleSide });
    var ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.95, 0.008, 10, 128), ringMat2);
    ring2.rotation.set(1.35, -0.4, -0.2);
    group.add(ring2);

    /* satellites riding ring 1 */
    var satMat = new THREE.MeshStandardMaterial({ color: 0x7A77E0, emissive: 0x6865D8, emissiveIntensity: 1.3, roughness: 0.4 });
    var sats = [];
    [0, 2.1, 4.2].forEach(function (a) {
      var m = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), satMat);
      m.userData.angle = a;
      group.add(m); sats.push(m);
    });

    /* floating glass shards */
    var glass = new THREE.MeshPhysicalMaterial({
      color: 0xA9A6E8, metalness: 0, roughness: 0.08,
      transmission: 0.7, thickness: 0.4, transparent: true, opacity: 0.85, depthWrite: false
    });
    var shards = [];
    [[-1.9, 0.9, -0.7, 0.5], [2.0, -0.7, -0.5, 0.42], [1.7, 1.15, 0.4, 0.34], [-2.05, -1.0, 0.3, 0.3]].forEach(function (p, i) {
      var sh = new THREE.Mesh(new THREE.OctahedronGeometry(p[3], 0), glass);
      sh.position.set(p[0], p[1], p[2]);
      sh.renderOrder = 2;
      sh.userData.phase = i * 1.7;
      group.add(sh); shards.push(sh);
    });

    /* dust particles — soft round sprite */
    var dotCanvas = document.createElement("canvas");
    dotCanvas.width = dotCanvas.height = 64;
    var dctx = dotCanvas.getContext("2d");
    var grad = dctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.4, "rgba(255,255,255,.55)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    dctx.fillStyle = grad; dctx.fillRect(0, 0, 64, 64);
    var dotTex = new THREE.CanvasTexture(dotCanvas);
    var pCount = 200;
    var pGeo = new THREE.BufferGeometry();
    var pos = new Float32Array(pCount * 3);
    for (var i = 0; i < pCount; i++) {
      var r = 2.4 + Math.random() * 3.4;
      var th = Math.random() * Math.PI * 2;
      var ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.cos(ph) * 0.7;
      pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    var dust = new THREE.Points(pGeo, new THREE.PointsMaterial({
      size: 0.06, map: dotTex, transparent: true, opacity: 0.5,
      color: 0x6865D8, depthWrite: false
    }));
    scene.add(dust);

    /* interaction: drag to spin, scroll turns the group */
    var targetRY = 0.5, targetRX = 0.12, velY = 0, dragging = false, lastX = 0, lastY = 0;
    canvas.addEventListener("pointerdown", function (e) {
      dragging = true; lastX = e.clientX; lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = e.clientX - lastX, dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      targetRY += dx * 0.008;
      targetRX = Math.max(-0.7, Math.min(0.7, targetRX + dy * 0.005));
      velY = dx * 0.002;
    });
    function endDrag() { dragging = false; }
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);

    var scrollSpin = 0;
    var scrollProgress = 0;
    var heroBox = canvas.parentElement;
    function onScroll() {
      var h = document.documentElement;
      var max = Math.max(1, h.scrollHeight - h.clientHeight);
      scrollProgress = Math.min(1, Math.max(0, h.scrollTop / max));
      scrollSpin = scrollProgress * Math.PI * 2.2;
      /* the whole 3D stage drifts down a little with the page */
      var drift = Math.min(window.scrollY * 0.12, 90);
      heroBox.style.transform = "translateY(" + drift + "px)";
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    function resize() {
      var box = canvas.parentElement.getBoundingClientRect();
      renderer.setSize(box.width, box.height, false);
      camera.aspect = box.width / box.height;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", resize);
    resize();

    var startT = performance.now();
    function tick() {
      requestAnimationFrame(tick);
      var t = (performance.now() - startT) / 1000;
      try {
        if (!dragging) {
          targetRY += reduced ? 0.0006 : 0.0022 + velY;
          velY *= 0.94;
        }
        group.rotation.y += ((targetRY + scrollSpin) - group.rotation.y) * 0.06;
        group.rotation.x += (targetRX - group.rotation.x) * 0.06;
        var floatY = reduced ? 0 : Math.sin(t * 0.8) * 0.06;
        group.position.y = floatY - scrollProgress * 1.1;
        ring1.rotation.z = t * 0.12;
        ring2.rotation.z = -t * 0.08;
        sats.forEach(function (m) {
          var a = m.userData.angle + t * 0.55;
          var local = new THREE.Vector3(Math.cos(a) * 1.62, Math.sin(a) * 1.62, 0);
          local.applyEuler(ring1.rotation);
          m.position.copy(local);
        });
        shards.forEach(function (sh) {
          sh.rotation.y = t * 0.35 + sh.userData.phase;
          sh.rotation.x = t * 0.22 + sh.userData.phase;
          if (!reduced) sh.position.y += Math.sin(t * 0.9 + sh.userData.phase) * 0.0009;
        });
        cards.forEach(function (c) {
          c.rotation.y = Math.sin(t * 0.6 + c.userData.phase) * 0.25;
          if (!reduced) c.position.y += Math.sin(t * 1.1 + c.userData.phase) * 0.0011;
        });
        dust.rotation.y = t * 0.02;
        renderer.render(scene, camera);
      } catch (err) { /* keep the loop alive */ }
    }
    tick();
    return true;
  }

  /* ═══════════════════════════════════════════════════════════════════
     2D FALLBACK — a flat purple browser window + orbit rings, same
     drift-with-scroll behaviour as the 3D stage.
     ═══════════════════════════════════════════════════════════════════ */
  function startFallback2D() {
    var ctx = canvas.getContext("2d");
    if (!ctx) return false;
    var heroBox = canvas.parentElement;
    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var box = heroBox.getBoundingClientRect();
      canvas.width = box.width * dpr;
      canvas.height = box.height * dpr;
      canvas.style.width = box.width + "px";
      canvas.style.height = box.height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);
    var start = performance.now();
    var running = true;
    function frame(now) {
      if (!running) return;
      requestAnimationFrame(frame);
      if (document.hidden) return;
      var t = (now - start) / 1000;
      var box = heroBox.getBoundingClientRect();
      var w = box.width, h = box.height;
      var drift = Math.min(window.scrollY * 0.12, 90);
      heroBox.style.transform = "translateY(" + drift + "px)";
      ctx.clearRect(0, 0, w, h);
      var cx = w / 2, cy = h / 2 - 6;
      var bw = Math.min(w * 0.62, 420), bh = bw * 0.62;
      /* orbit rings */
      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = "rgba(104,101,216,0.5)";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.ellipse(0, 0, bw * 0.85, bw * 0.34, -0.25 + Math.sin(t * 0.12) * 0.06, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = "rgba(169,166,232,0.55)";
      ctx.beginPath(); ctx.ellipse(0, 0, bw * 0.72, bw * 0.28, 0.35, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
      /* window body */
      ctx.save();
      ctx.shadowColor = "rgba(104,101,216,0.25)";
      ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
      ctx.fillStyle = "#ffffff";
      roundRect(ctx, cx - bw / 2, cy - bh / 2, bw, bh, 14); ctx.fill();
      ctx.restore();
      ctx.strokeStyle = "#6865D8"; ctx.lineWidth = 2;
      roundRect(ctx, cx - bw / 2, cy - bh / 2, bw, bh, 14); ctx.stroke();
      /* header bar */
      ctx.fillStyle = "#6865D8";
      roundRectTop(ctx, cx - bw / 2, cy - bh / 2, bw, 34, 14); ctx.fill();
      ctx.fillStyle = "#ffffff";
      [-0.42, -0.36, -0.30].forEach(function (f) {
        ctx.beginPath(); ctx.arc(cx + bw * f, cy - bh / 2 + 17, 4, 0, Math.PI * 2); ctx.fill();
      });
      ctx.fillStyle = "#DCD9F5";
      roundRect(ctx, cx + bw * 0.06, cy - bh / 2 + 10, bw * 0.32, 14, 7); ctx.fill();
      /* headline + text lines */
      ctx.fillStyle = "#1C1D2E";
      roundRect(ctx, cx - bw * 0.42, cy - bh * 0.12, bw * 0.36, 10, 5); ctx.fill();
      roundRect(ctx, cx - bw * 0.42, cy + bh * 0.06, bw * 0.24, 8, 4); ctx.fill();
      ctx.fillStyle = "#A9A6E8";
      roundRect(ctx, cx - bw * 0.42, cy + bh * 0.24, bw * 0.44, 7, 3.5); ctx.fill();
      /* CTA button */
      ctx.fillStyle = "#7A77E0";
      roundRect(ctx, cx - bw * 0.42, cy + bh * 0.42, bw * 0.22, 16, 8); ctx.fill();
      /* image block */
      ctx.fillStyle = "#DCD9F5";
      roundRect(ctx, cx + bw * 0.12, cy - bh * 0.02, bw * 0.28, bh * 0.42, 8); ctx.fill();
    }
    function roundRect(c, x, y, w, h, r) {
      c.beginPath();
      c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
      c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
    }
    function roundRectTop(c, x, y, w, h, r) {
      c.beginPath();
      c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.arcTo(x + w, y, x + w, y + r, r);
      c.lineTo(x + w, y + h); c.lineTo(x, y + h); c.lineTo(x, y + r); c.arcTo(x, y, x + r, y, r);
      c.closePath();
    }
    if (reduced) { frame(start); running = false; return true; }
    requestAnimationFrame(frame);
    return true;
  }

  /* ── Boot: three.js first, 2D fallback, then CSS glow alone ───────── */
  function boot() {
    if (!canvas) return;
    loadThree().then(function (ok) {
      var started = false;
      if (ok) {
        try { started = initScene(); } catch (e) { started = false; }
      }
      if (!started) {
        try { started = startFallback2D(); } catch (e) { started = false; }
      }
      if (!started) {
        canvas.style.display = "none";
        if (glFallback) glFallback.style.display = "grid";
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
