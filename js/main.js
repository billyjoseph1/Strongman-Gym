/* STRONGMAN GYM — site behaviour (no libraries needed) */
(function () {
  "use strict";
  var G = window.GYM || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Fill in settings from config.js ---------- */
  function applyConfig() {
    $$("[data-cfg]").forEach(function (el) {
      var key = el.getAttribute("data-cfg");
      var val = key.split(".").reduce(function (o, k) { return o && o[k]; }, G);
      if (val == null) return;
      if (key === "phone") { el.textContent = val; if (el.tagName === "A") el.href = "tel:" + val.replace(/\s/g, ""); }
      else if (key === "email") { el.textContent = val; if (el.tagName === "A") el.href = "mailto:" + val; }
      else if (key.indexOf("social.") === 0) { el.href = val; }
      else el.textContent = val;
    });
    $$("[data-wa]").forEach(function (el) {
      var msg = el.getAttribute("data-wa") || "Hi Strongman Gym, I'd like to know more about membership.";
      el.href = "https://wa.me/" + G.whatsapp + "?text=" + encodeURIComponent(msg);
    });
    var map = $("#map");
    if (map && G.mapQuery) map.src = "https://www.google.com/maps?q=" + encodeURIComponent(G.mapQuery) + "&output=embed";
    $$(".year").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* ---------- Header, menu, active link ---------- */
  function nav() {
    var header = $(".header"), toggle = $(".menu-toggle"), links = $(".nav-links");
    if (toggle && links) {
      toggle.addEventListener("click", function () {
        var open = links.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open);
        document.body.classList.toggle("menu-open", open);
      });
      $$("a", links).forEach(function (a) { a.addEventListener("click", function () {
        links.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); document.body.classList.remove("menu-open");
      }); });
    }
    var page = location.pathname.split("/").pop() || "index.html";
    $$(".nav-links a").forEach(function (a) { if (a.getAttribute("href") === page) { a.classList.add("active"); a.setAttribute("aria-current", "page"); } });

    var toTop = $(".to-top");
    function onScroll() {
      var y = window.scrollY;
      if (header) header.classList.toggle("scrolled", y > 10);
      if (toTop) toTop.classList.toggle("show", y > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
    if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  }

  /* ---------- Reveal on scroll + counters ---------- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count")), suffix = el.getAttribute("data-suffix") || "";
    var start = null, dur = 1600;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1), v = Math.floor(target * (1 - Math.pow(1 - p, 3)));
      el.textContent = v.toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function reveal() {
    var items = $$(".reveal"), counters = $$("[data-count]");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (e) { e.classList.add("in"); });
      counters.forEach(function (e) { e.textContent = e.getAttribute("data-count") + (e.getAttribute("data-suffix") || ""); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        if (en.target.hasAttribute("data-count")) countUp(en.target); else en.target.classList.add("in");
        io.unobserve(en.target);
      });
    }, { threshold: 0.15 });
    items.concat(counters).forEach(function (e) { io.observe(e); });
  }

  /* ---------- Testimonials slider ---------- */
  function slider() {
    var wrap = $(".testimonials"); if (!wrap) return;
    var slides = $$(".testimonial", wrap), dots = $(".dots", wrap), i = 0, timer;
    slides.forEach(function (_, n) {
      var b = document.createElement("button"); b.setAttribute("aria-label", "Show testimonial " + (n + 1));
      b.addEventListener("click", function () { show(n); restart(); }); dots.appendChild(b);
    });
    function show(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle("active", k === i); });
      $$("button", dots).forEach(function (d, k) { d.classList.toggle("active", k === i); });
    }
    function restart() { clearInterval(timer); timer = setInterval(function () { show(i + 1); }, 6500); }
    show(0); restart();
  }

  /* ---------- FAQ accordion ---------- */
  function faq() {
    $$(".faq-q").forEach(function (q) {
      q.addEventListener("click", function () {
        var a = q.nextElementSibling, open = q.getAttribute("aria-expanded") === "true";
        q.setAttribute("aria-expanded", !open);
        a.style.maxHeight = open ? null : a.scrollHeight + "px";
      });
    });
  }

  /* ---------- Pricing monthly / annual ---------- */
  function pricing() {
    var sw = $("#billing"); if (!sw) return;
    function render(annual) {
      sw.setAttribute("aria-checked", annual);
      $$(".plan").forEach(function (p) {
        var m = +p.getAttribute("data-monthly"), amt = $(".amt", p), billed = $(".billed", p), per = $(".per", p);
        if (!m) return;
        if (annual) {
          var yearly = Math.round(m * 12 * 0.8 / 100) * 100;
          amt.textContent = Math.round(yearly / 12).toLocaleString();
          billed.textContent = "Billed KES " + yearly.toLocaleString() + " yearly — save KES " + (m * 12 - yearly).toLocaleString();
        } else {
          amt.textContent = m.toLocaleString(); billed.textContent = "Billed monthly · cancel anytime";
        }
        if (per) per.textContent = "/month";
      });
    }
    sw.addEventListener("click", function () { render(sw.getAttribute("aria-checked") !== "true"); });
    sw.addEventListener("keydown", function (e) { if (e.key === " " || e.key === "Enter") { e.preventDefault(); sw.click(); } });
    render(false);
  }

  /* ---------- Schedule & gallery filters ---------- */
  function filters() {
    $$(".filters").forEach(function (bar) {
      var target = bar.getAttribute("data-target");
      $$(".chip", bar).forEach(function (chip) {
        chip.addEventListener("click", function () {
          $$(".chip", bar).forEach(function (c) { c.classList.remove("active"); c.setAttribute("aria-pressed", "false"); });
          chip.classList.add("active"); chip.setAttribute("aria-pressed", "true");
          var f = chip.getAttribute("data-filter");
          $$(target).forEach(function (el) {
            var match = f === "all" || el.getAttribute("data-type") === f;
            if (el.classList.contains("slot")) el.classList.toggle("dim", !match);
            else el.classList.toggle("hide", !match);
          });
        });
      });
    });
  }

  /* ---------- Lightbox ---------- */
  function lightbox() {
    var lb = $(".lightbox"); if (!lb) return;
    var stage = $(".lb-stage", lb), cap = $(".lb-cap", lb), idx = 0;
    function visible() { return $$(".g-item:not(.hide)"); }
    function open(n) {
      var items = visible(); if (!items.length) return;
      idx = (n + items.length) % items.length;
      var it = items[idx], img = $("img", it), svg = $("svg", it);
      stage.innerHTML = img ? '<img src="' + img.src + '" alt="' + (img.alt || "") + '">' : (svg ? svg.outerHTML : "");
      cap.textContent = ($(".cap", it) || {}).textContent || "";
      lb.classList.add("open"); $(".lb-close", lb).focus();
    }
    function close() { lb.classList.remove("open"); }
    $$(".g-item").forEach(function (it) { it.addEventListener("click", function () { open(visible().indexOf(it)); }); });
    $(".lb-close", lb).addEventListener("click", close);
    $(".lb-prev", lb).addEventListener("click", function () { open(idx - 1); });
    $(".lb-next", lb).addEventListener("click", function () { open(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close(); if (e.key === "ArrowLeft") open(idx - 1); if (e.key === "ArrowRight") open(idx + 1);
    });
  }

  /* ---------- Countdown ---------- */
  function countdown() {
    var els = $$("[data-countdown]"); if (!els.length || !G.nextEvent) return;
    var end = new Date(G.nextEvent.date).getTime();
    $$("[data-event-name]").forEach(function (e) { e.textContent = G.nextEvent.name; });
    function tick() {
      var d = Math.max(0, end - Date.now());
      var parts = { days: Math.floor(d / 864e5), hours: Math.floor(d / 36e5) % 24, mins: Math.floor(d / 6e4) % 60, secs: Math.floor(d / 1e3) % 60 };
      els.forEach(function (el) { Object.keys(parts).forEach(function (k) { var b = $("[data-" + k + "]", el); if (b) b.textContent = String(parts[k]).padStart(2, "0"); }); });
    }
    tick(); setInterval(tick, 1000);
  }

  /* ---------- Opening hours ---------- */
  function hours() {
    var tbl = $("#hours-table"), status = $$("[data-open-status]");
    if (!G.hours) return;
    var now = new Date(), today = now.getDay(), h = G.hours[today];
    if (tbl) {
      var order = [1, 2, 3, 4, 5, 6, 0];
      tbl.innerHTML = order.map(function (d) {
        var x = G.hours[d];
        return '<tr' + (d === today ? ' class="today"' : "") + '><td>' + x.day + '</td><td>' + (x.open ? x.open + " – " + x.close : "Closed") + "</td></tr>";
      }).join("");
    }
    var mins = now.getHours() * 60 + now.getMinutes();
    function toMin(s) { var p = s.split(":"); return +p[0] * 60 + +p[1]; }
    var open = h && h.open && mins >= toMin(h.open) && mins < toMin(h.close);
    status.forEach(function (el) {
      el.classList.toggle("closed", !open);
      el.textContent = open ? "Open now · closes " + h.close : "Closed now" + (h && h.open && mins < toMin(h.open) ? " · opens " + h.open : "");
    });
  }

  /* ---------- Forms ---------- */
  var KE_PHONE = /^(?:\+?254|0)(?:7|1)\d{8}$/;
  function validateField(f) {
    var input = $("input, select, textarea", f); if (!input) return true;
    var v = (input.type === "checkbox") ? input.checked : input.value.trim(), ok = true;
    if (input.required && !v) ok = false;
    else if (v && input.type === "email") ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    else if (v && input.type === "tel") ok = KE_PHONE.test(v.replace(/[\s-]/g, ""));
    else if (v && input.type === "date" && input.hasAttribute("data-future")) {
      var t = new Date(); t.setHours(0, 0, 0, 0); ok = new Date(v + "T00:00:00") >= t;
    }
    f.classList.toggle("invalid", !ok);
    return ok;
  }
  function forms() {
    $$("form[data-validate]").forEach(function (form) {
      var fields = $$(".field", form);
      fields.forEach(function (f) { var i = $("input, select, textarea", f); if (i) i.addEventListener("blur", function () { validateField(f); }); });
      $$("input[data-future]", form).forEach(function (i) { i.min = new Date().toISOString().slice(0, 10); });
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var ok = fields.map(validateField).every(Boolean);
        if (!ok) { var bad = $(".field.invalid input, .field.invalid select, .field.invalid textarea", form); if (bad) bad.focus(); return; }
        var data = {}; new FormData(form).forEach(function (v, k) { data[k] = v; });
        data.submittedAt = new Date().toISOString();
        try {
          var key = "sg_" + (form.id || "form"), list = JSON.parse(localStorage.getItem(key) || "[]");
          list.push(data); localStorage.setItem(key, JSON.stringify(list));
        } catch (err) { /* storage unavailable — ignore */ }
        var msg = $(".form-success", form) || form.nextElementSibling;
        if (msg && msg.classList.contains("form-success")) {
          var name = (data.name || "").split(" ")[0];
          var span = $("[data-name]", msg); if (span) span.textContent = name ? ", " + name : "";
          msg.classList.add("show"); msg.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        form.reset();
      });
    });
    // Pre-select plan / program from the URL, e.g. contact.html?plan=elite
    var params = new URLSearchParams(location.search);
    ["plan", "program"].forEach(function (k) {
      var v = params.get(k), sel = document.getElementById(k);
      if (v && sel) { sel.value = v; var trial = $("#join"); if (trial) trial.scrollIntoView(); }
    });
    $$(".newsletter").forEach(function (nf) {
      nf.addEventListener("submit", function (e) {
        e.preventDefault();
        var inp = $("input", nf), msg = nf.parentNode.querySelector(".msg");
        var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(inp.value.trim());
        if (msg) { msg.style.color = ok ? "" : "var(--accent)"; msg.textContent = ok ? "You're in! Watch your inbox for training tips." : "Please enter a valid email."; }
        if (ok) nf.reset();
      });
    });
  }

  /* ---------- Strength tools ---------- */
  function tools() {
    var rm = $("#rm-form");
    if (rm) rm.addEventListener("submit", function (e) {
      e.preventDefault();
      var w = parseFloat($("#rm-weight").value), r = parseInt($("#rm-reps").value, 10), out = $("#rm-result");
      if (!(w > 0) || !(r >= 1 && r <= 12)) { out.innerHTML = '<span style="color:var(--accent)">Enter a weight and 1–12 reps.</span>'; return; }
      var epley = r === 1 ? w : w * (1 + r / 30), brz = r === 1 ? w : w * 36 / (37 - r), est = (epley + brz) / 2;
      var rows = [100, 95, 90, 85, 80, 75, 70, 65, 60].map(function (p) {
        return "<tr><td>" + p + "%</td><td>" + (Math.round(est * p / 100 / 2.5) * 2.5).toFixed(1) + " kg</td></tr>";
      }).join("");
      out.innerHTML = '<div class="muted">Estimated one-rep max</div><div class="big">' + est.toFixed(1) + ' kg</div>' +
        '<table class="pct-table"><thead><tr><th>% 1RM</th><th>Load</th></tr></thead><tbody>' + rows + "</tbody></table>";
    });

    var pl = $("#plate-form");
    if (pl) pl.addEventListener("submit", function (e) {
      e.preventDefault();
      var target = parseFloat($("#plate-target").value), bar = parseFloat($("#plate-bar").value), out = $("#plate-result");
      if (!(target >= bar)) { out.innerHTML = '<span style="color:var(--accent)">Target must be at least the bar weight (' + bar + ' kg).</span>'; return; }
      var side = (target - bar) / 2, sizes = [25, 20, 15, 10, 5, 2.5, 1.25], used = [];
      sizes.forEach(function (s) { while (side >= s - 1e-9) { used.push(s); side -= s; } });
      var vis = '<div class="plates"><div class="bar"></div>' + used.map(function (s) {
        return '<div class="plate p' + String(s).replace(".", "-") + '">' + s + "</div>";
      }).join("") + '<div class="sleeve"></div></div>';
      var loaded = bar + used.reduce(function (a, b) { return a + b; }, 0) * 2;
      out.innerHTML = '<div class="muted">Per side</div><div class="big">' + (used.length ? used.join(" + ") : "Empty bar") + "</div>" + vis +
        (Math.abs(loaded - target) > 1e-6 ? '<p class="muted" style="margin-top:10px">Closest load: ' + loaded + " kg (" + (target - loaded).toFixed(2) + " kg short)</p>" : "");
    });

    var bmi = $("#bmi-form");
    if (bmi) bmi.addEventListener("submit", function (e) {
      e.preventDefault();
      var kg = parseFloat($("#bmi-weight").value), cm = parseFloat($("#bmi-height").value), out = $("#bmi-result");
      if (!(kg > 0 && cm > 0)) { out.innerHTML = '<span style="color:var(--accent)">Enter your weight and height.</span>'; return; }
      var b = kg / Math.pow(cm / 100, 2), cat = b < 18.5 ? "Underweight" : b < 25 ? "Healthy range" : b < 30 ? "Overweight" : "Obese";
      out.innerHTML = '<div class="muted">Your BMI</div><div class="big">' + b.toFixed(1) + '</div><p style="margin:8px 0 0"><strong>' + cat +
        '</strong></p><p class="muted" style="margin:6px 0 0;font-size:.88rem">Note: BMI does not account for muscle. Strength athletes often read "overweight" while being lean — ask a coach for a body-composition scan.</p>';
    });

    var tdee = $("#tdee-form");
    if (tdee) tdee.addEventListener("submit", function (e) {
      e.preventDefault();
      var sex = $("#tdee-sex").value, age = +$("#tdee-age").value, kg = +$("#tdee-weight").value, cm = +$("#tdee-height").value,
          act = +$("#tdee-activity").value, out = $("#tdee-result");
      if (!(age > 0 && kg > 0 && cm > 0)) { out.innerHTML = '<span style="color:var(--accent)">Fill in all fields.</span>'; return; }
      var bmr = 10 * kg + 6.25 * cm - 5 * age + (sex === "male" ? 5 : -161), t = Math.round(bmr * act);
      out.innerHTML = '<div class="muted">Maintenance calories</div><div class="big">' + t.toLocaleString() + ' kcal</div>' +
        '<table class="pct-table"><tbody><tr><td>Lean bulk (+300)</td><td>' + (t + 300).toLocaleString() + ' kcal</td></tr>' +
        '<tr><td>Cut (−500)</td><td>' + (t - 500).toLocaleString() + ' kcal</td></tr>' +
        '<tr><td>Protein target</td><td>' + Math.round(kg * 1.8) + "–" + Math.round(kg * 2.2) + " g/day</td></tr></tbody></table>";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyConfig(); nav(); reveal(); slider(); faq(); pricing(); filters(); lightbox(); countdown(); hours(); forms(); tools();
  });
})();
