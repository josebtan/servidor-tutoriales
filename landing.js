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
