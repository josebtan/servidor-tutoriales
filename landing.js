(function(){
  var C = window.UNITY || {};
  document.documentElement.classList.add('js');

  // IP y botones de copiar
  var ip = C.ip || '';
  document.querySelectorAll('[data-ip]').forEach(function(el){ el.textContent = ip || 'IP próximamente'; });
  document.querySelectorAll('[data-bedrock]').forEach(function(el){
    if (ip && C.bedrockPort) el.textContent = 'Bedrock: ' + ip + ' · puerto ' + C.bedrockPort; else el.hidden = true;
  });
  var live = document.getElementById('live');
  document.querySelectorAll('[data-copy]').forEach(function(btn){
    if (!ip) { btn.setAttribute('aria-disabled', 'true'); return; }
    btn.addEventListener('click', function(){
      var done = function(){ var t = btn.textContent; btn.textContent = '¡IP copiada!'; live.textContent = 'IP copiada al portapapeles'; setTimeout(function(){ btn.textContent = t; }, 1800); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ip).then(done, function(){ prompt('Copia la IP:', ip); });
      else prompt('Copia la IP:', ip);
    });
  });

  // Enlaces externos configurables (se ocultan si están vacíos)
  document.querySelectorAll('[data-link]').forEach(function(a){
    var url = C[a.getAttribute('data-link')];
    if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; } else a.hidden = true;
  });

  // Menú móvil
  var b = document.querySelector('.burger'), n = document.getElementById('menu');
  b.addEventListener('click', function(){ var o = n.classList.toggle('open'); b.setAttribute('aria-expanded', o); });
  n.addEventListener('click', function(e){ if (e.target.tagName === 'A') { n.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); } });

  // Aparición al hacer scroll
  var els = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .12 });
    els.forEach(function(el){ io.observe(el); });
  } else els.forEach(function(el){ el.classList.add('in'); });
})();
(function(){
  var rm = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var prog = document.getElementById('prog'), hd = document.querySelector('header'), sc = document.getElementById('scene');
  var st = document.querySelector('.stars'), mo = document.querySelector('.moon');
  function onS(){
    var y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (h > 0 ? y / h * 100 : 0) + '%';
    hd.classList.toggle('sm', y > 40);
    if (!rm && y < 900) { st.style.transform = 'translateY(' + y * .15 + 'px)'; mo.style.transform = 'translateY(' + y * .35 + 'px)'; sc.style.transform = 'translateY(' + y * -.06 + 'px)'; }
  }
  addEventListener('scroll', onS, { passive: true }); onS();
  // Texto rotativo con efecto de escritura
  var el = document.getElementById('rot'), w = ['survival global', 'minijuegos y arcades', 'mazmorras con jefes', 'oleadas infinitas', 'regalos de TikTok LIVE', 'cosméticos únicos'], i = 0, c = 0, del = false;
  if (rm) { el.textContent = w[0]; } else (function t(){
    var s = w[i]; c += del ? -1 : 1; el.textContent = s.slice(0, c);
    var d = del ? 35 : 75;
    if (!del && c === s.length) { del = true; d = 1500; } else if (del && c === 0) { del = false; i = (i + 1) % w.length; d = 300; }
    setTimeout(t, d);
  })();
  // Inclinación 3D y brillo en tarjetas
  if (!rm && matchMedia('(hover:hover)').matches) document.querySelectorAll('.card').forEach(function(k){
    k.addEventListener('pointermove', function(e){
      var r = k.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      k.style.setProperty('--mx', x * 100 + '%'); k.style.setProperty('--my', y * 100 + '%');
      k.style.transform = 'perspective(800px) rotateX(' + (.5 - y) * 7 + 'deg) rotateY(' + (x - .5) * 9 + 'deg) translateY(-4px)';
    });
    k.addEventListener('pointerleave', function(){ k.style.transform = ''; });
  });
})();
