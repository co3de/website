// Canvas wireframe animations for co3de.com
// Three models: icosahedron (Home), lattice (Services), sphere (Contact)

(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Shared projection: rotate by ry/rx, perspective divide
  function project(pts, w, h, t, scale) {
    var ry = t * 0.8;
    var rx = 0.42 + Math.sin(t * 0.45) * 0.14;
    var cosY = Math.cos(ry), sinY = Math.sin(ry);
    var cosX = Math.cos(rx), sinX = Math.sin(rx);
    return pts.map(function (q) {
      var x1 = q[0] * cosY + q[2] * sinY;
      var z1 = -q[0] * sinY + q[2] * cosY;
      var y1 = q[1] * cosX - z1 * sinX;
      var z2 = q[1] * sinX + z1 * cosX;
      var f = 3.2 / (3.2 - z2);
      return [w / 2 + x1 * f * scale, h / 2 + y1 * f * scale, z2];
    });
  }

  // Shared canvas setup
  function setupCanvas(canvas) {
    var dpr = window.devicePixelRatio || 1;
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    if (!w || !h) return null;
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    return { ctx: ctx, w: w, h: h };
  }

  // ---- ICOSAHEDRON (Home) ----
  function buildIcosahedron() {
    var pts = [];
    var edges = [];
    var p = (1 + Math.sqrt(5)) / 2;
    var raw = [[-1,p,0],[1,p,0],[-1,-p,0],[1,-p,0],[0,-1,p],[0,1,p],[0,-1,-p],[0,1,-p],[p,0,-1],[p,0,1],[-p,0,-1],[-p,0,1]];
    raw.forEach(function (v) {
      var l = Math.hypot(v[0], v[1], v[2]);
      pts.push([v[0]/l, v[1]/l, v[2]/l]);
    });
    for (var i = 0; i < pts.length; i++) {
      for (var j = i + 1; j < pts.length; j++) {
        var d = Math.hypot(pts[i][0]-pts[j][0], pts[i][1]-pts[j][1], pts[i][2]-pts[j][2]);
        if (d < 1.2) edges.push([i, j]);
      }
    }
    return { pts: pts, edges: edges };
  }

  function drawIcosahedron(canvas, t) {
    var s = setupCanvas(canvas);
    if (!s) return;
    var model = canvas._model || (canvas._model = buildIcosahedron());
    var scale = Math.min(s.w, s.h) * 0.34;
    var proj = project(model.pts, s.w, s.h, t, scale);
    s.ctx.lineWidth = 1;
    for (var e = 0; e < model.edges.length; e++) {
      var a = proj[model.edges[e][0]];
      var b = proj[model.edges[e][1]];
      var depth = (a[2] + b[2]) / 2;
      var alpha = 0.16 + 0.5 * ((depth + 1.1) / 2.2);
      s.ctx.strokeStyle = 'rgba(26,24,22,' + alpha.toFixed(3) + ')';
      s.ctx.beginPath();
      s.ctx.moveTo(a[0], a[1]);
      s.ctx.lineTo(b[0], b[1]);
      s.ctx.stroke();
    }
    for (var i = 0; i < proj.length; i++) {
      var q = proj[i];
      var a2 = 0.3 + 0.6 * ((q[2] + 1.1) / 2.2);
      s.ctx.fillStyle = 'rgba(26,24,22,' + a2.toFixed(3) + ')';
      s.ctx.beginPath();
      s.ctx.arc(q[0], q[1], 3.2, 0, Math.PI * 2);
      s.ctx.fill();
    }
  }

  // ---- LATTICE (Services) ----
  function buildLattice() {
    var pts = [];
    var edges = [];
    var sp = 0.62;
    var idx = function (x, y, z) { return (x + 1) * 9 + (y + 1) * 3 + (z + 1); };
    for (var x = -1; x <= 1; x++) for (var y = -1; y <= 1; y++) for (var z = -1; z <= 1; z++) pts.push([x * sp, y * sp, z * sp]);
    for (var x2 = -1; x2 <= 1; x2++) for (var y2 = -1; y2 <= 1; y2++) for (var z2 = -1; z2 <= 1; z2++) {
      if (x2 < 1) edges.push([idx(x2, y2, z2), idx(x2 + 1, y2, z2)]);
      if (y2 < 1) edges.push([idx(x2, y2, z2), idx(x2, y2 + 1, z2)]);
      if (z2 < 1) edges.push([idx(x2, y2, z2), idx(x2, y2, z2 + 1)]);
    }
    return { pts: pts, edges: edges };
  }

  function drawLattice(canvas, t) {
    var s = setupCanvas(canvas);
    if (!s) return;
    var model = canvas._model || (canvas._model = buildLattice());
    var scale = Math.min(s.w, s.h) * 0.34;
    var proj = project(model.pts, s.w, s.h, t, scale);
    s.ctx.lineWidth = 1;
    for (var e = 0; e < model.edges.length; e++) {
      var a = proj[model.edges[e][0]];
      var b = proj[model.edges[e][1]];
      var depth = (a[2] + b[2]) / 2;
      var alpha = 0.14 + 0.45 * ((depth + 1.1) / 2.2);
      s.ctx.strokeStyle = 'rgba(26,24,22,' + alpha.toFixed(3) + ')';
      s.ctx.beginPath();
      s.ctx.moveTo(a[0], a[1]);
      s.ctx.lineTo(b[0], b[1]);
      s.ctx.stroke();
    }
    for (var i = 0; i < proj.length; i++) {
      var q = proj[i];
      var a2 = 0.3 + 0.55 * ((q[2] + 1.1) / 2.2);
      s.ctx.fillStyle = 'rgba(26,24,22,' + a2.toFixed(3) + ')';
      s.ctx.beginPath();
      s.ctx.arc(q[0], q[1], 2.2, 0, Math.PI * 2);
      s.ctx.fill();
    }
  }

  // ---- SPHERE (Contact) ----
  function buildSphere() {
    var pts = [];
    var edges = [];
    var N = 36;
    var addRing = function (ring) {
      var base = pts.length;
      ring.forEach(function (q) { pts.push(q); });
      for (var i = 0; i < ring.length; i++) edges.push([base + i, base + (i + 1) % ring.length]);
    };
    [-60, -30, 0, 30, 60].forEach(function (deg) {
      var a = (deg * Math.PI) / 180;
      var r = Math.cos(a);
      var y = Math.sin(a);
      var ring = [];
      for (var i = 0; i < N; i++) {
        var th = (i / N) * Math.PI * 2;
        ring.push([r * Math.cos(th), y, r * Math.sin(th)]);
      }
      addRing(ring);
    });
    for (var k = 0; k < 6; k++) {
      var phi = (k / 6) * Math.PI;
      var ring = [];
      for (var i = 0; i < N; i++) {
        var th = (i / N) * Math.PI * 2;
        var x = Math.cos(th), y = Math.sin(th);
        ring.push([x * Math.cos(phi), y, x * Math.sin(phi)]);
      }
      addRing(ring);
    }
    return { pts: pts, edges: edges };
  }

  function drawSphere(canvas, t) {
    var s = setupCanvas(canvas);
    if (!s) return;
    var model = canvas._model || (canvas._model = buildSphere());
    var scale = Math.min(s.w, s.h) * 0.4;
    var proj = project(model.pts, s.w, s.h, t, scale);
    s.ctx.lineWidth = 0.8;
    for (var e = 0; e < model.edges.length; e++) {
      var a = proj[model.edges[e][0]];
      var b = proj[model.edges[e][1]];
      var depth = (a[2] + b[2]) / 2;
      var alpha = 0.12 + 0.45 * ((depth + 1.1) / 2.2);
      s.ctx.strokeStyle = 'rgba(150,95,50,' + alpha.toFixed(3) + ')';
      s.ctx.beginPath();
      s.ctx.moveTo(a[0], a[1]);
      s.ctx.lineTo(b[0], b[1]);
      s.ctx.stroke();
    }
  }

  // ---- INIT FUNCTIONS ----
  function startAnimation(canvas, drawFn, timeDiv) {
    if (!canvas) return;
    if (reducedMotion) {
      drawFn(canvas, 0);
      return;
    }
    var raf;
    var tick = function (now) {
      drawFn(canvas, now / timeDiv);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return function () { cancelAnimationFrame(raf); };
  }

  window.initIcosahedron = function (canvas) { return startAnimation(canvas, drawIcosahedron, 2000); };
  window.initLattice = function (canvas) { return startAnimation(canvas, drawLattice, 3000); };
  window.initSphere = function (canvas) { return startAnimation(canvas, drawSphere, 2500); };
})();
