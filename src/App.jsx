import { useEffect, useRef, useState } from 'react'

const C = window.UNITY || {}
const IP = C.ip || ''

const MODES = [
  { ico: '🌳', t: 'Survival Global', c: '#23a559', d: 'Construye, explora y protege tu hogar. Elige un trabajo, sube habilidades y recupera tus cosas si mueres.', tags: ['Protecciones', 'Trabajos', 'Tumbas', 'Tienda'] },
  { ico: '🎮', t: 'Minijuegos', c: '#f0b232', d: 'Partidas rápidas desde el lobby: Arcades, PvP y Shooters, como Quake.', tags: ['Arcades', 'PvP', 'Shooters'] },
  { ico: '⚔️', t: 'Mazmorras y Arena', c: '#f23f43', d: 'Mazmorras por niveles con guardias y jefes, y una arena de oleadas infinitas cada vez más duras.', tags: ['Jefes', 'Oleadas'] },
  { ico: '📺', t: 'TikTok LIVE', c: '#2dd4bf', d: 'Los regalos de los espectadores se convierten en mobs y efectos dentro del juego durante el directo.', tags: ['Jakemy', 'josetan'] },
  { ico: '✨', t: 'Cosméticos', c: '#b983ff', d: 'Gadgets, mascotas, efectos y objetos con modelos 3D personalizados.', tags: ['Gadgets', 'Modelos custom'] },
]
const FEATS = ['Java y Bedrock', 'Terrenos protegidos', 'Trabajos y habilidades', 'Tumbas', 'Chat conectado a Discord', 'Chat de voz']
const GUIDES = [
  { href: 'proteccion.html', t: 'Protecciones', d: 'Claims, explosiones, permisos y subdivisiones. Nivel básico y avanzado.' },
  { href: 'habilidades.html', t: 'Habilidades y trabajos', d: 'XP, estadísticas, poderes de maná, trabajos y cómo ganar dinero.' },
  { href: 'tutoriales.html', t: 'Todos los tutoriales', d: 'Índice completo de guías del servidor.' },
]
const SOON = [
  ['🛒', 'Tienda', 'Cosméticos, llaves y rangos.'],
  ['👤', 'Panel de jugador', 'Cuenta, estadísticas y tops.'],
]

function useCopy() {
  const [ok, set] = useState(false)
  return [ok, () => {
    if (!IP) return
    const done = () => { set(true); setTimeout(() => set(false), 1800) }
    navigator.clipboard?.writeText(IP).then(done, () => prompt('Copia la IP:', IP)) ?? prompt('Copia la IP:', IP)
  }]
}

const WAVE = 'M0 60C75 12 225 108 300 60C375 12 525 108 600 60C675 12 825 108 900 60C975 12 1125 108 1200 60V120H0Z'

function Fluid() {
  const box = useRef(null)
  useEffect(() => {
    const el = box.current
    if (!el || matchMedia('(prefers-reduced-motion:reduce)').matches) return
    el.classList.add('rand')
    const r = (a, b) => a + Math.random() * (b - a)
    const timers = []
    const go = (i, first) => {
      const W = el.clientWidth, H = el.clientHeight, w = i.offsetWidth, h = i.offsetHeight
      const d = first ? 0 : r(6, 13)
      i.style.transitionDuration = d + 's'
      i.style.transform = `translate(${r(-.3 * w, W - .7 * w).toFixed(0)}px,${r(-.4 * h, H - .6 * h).toFixed(0)}px) rotate(${r(-60, 60).toFixed(0)}deg) scale(${r(.8, 1.35).toFixed(2)})`
      timers.push(setTimeout(() => go(i, false), first ? 50 : d * 750))
    }
    el.querySelectorAll('i').forEach(i => go(i, true))
    return () => timers.forEach(clearTimeout)
  }, [])
  return <>
    <div className="fluid" ref={box} aria-hidden="true"><i /><i /><i /><i /><i /></div>
    <div className="waves" aria-hidden="true">{[0, 1, 2].map(k => <svg key={k} className="wave" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d={WAVE} /></svg>)}</div>
  </>
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: .08 })
    els.forEach(e => io.observe(e))
    return () => io.disconnect()
  }, [])
}

export default function App() {
  const [ok, copy] = useCopy()
  useReveal()
  useEffect(() => { document.title = 'UnityCraft · Servidor de Minecraft' }, [])
  const label = ok ? '¡Copiada!' : IP ? 'Copiar IP' : 'IP próximamente'

  return (<>
    <header className="hero">
      <Fluid />
      <div className="wrap">
        <div className="topbar">
          <div className="brand"><span className="avatar" aria-hidden="true">U</span><div><b>UnityCraft</b><small>Servidor de Minecraft</small></div></div>
          <div className="nav">
            <a className="dc ghost" href="tutoriales.html">Tutoriales</a>
            {C.discord && <a className="dc" href={C.discord} target="_blank" rel="noopener">Discord</a>}
          </div>
        </div>
        <div className="hero-body">
          <div className="hero-text">
            <h1>Survival global, minijuegos y mazmorras en un solo servidor</h1>
            <p>Entra con Java o Bedrock, elige tu modalidad y empieza a jugar. Aprende lo básico con nuestras guías paso a paso.</p>
            <ul className="facts">{FEATS.slice(0, 3).map(f => <li key={f}>{f}</li>)}</ul>
          </div>
          <div className="ipcard">
            <h2>IP del servidor</h2>
            <div className="ip"><code>{IP || 'IP próximamente'}</code><button className="btn" onClick={copy} disabled={!IP}>{label}</button></div>
            <p className="note" style={{ color: 'var(--muted)' }}>Java · Bedrock{IP && C.bedrockPort ? ` (puerto ${C.bedrockPort})` : ''}</p>
          </div>
        </div>
      </div>
    </header>

    <div className="wrap"><main className="grid">
      <div>
        <section className="reveal" id="modalidades">
          <h2>1. Modalidades</h2>
          <p className="sub">Elige cómo quieres jugar.</p>
          <div className="cards">{MODES.map(m => (
            <div className="opt" key={m.t} style={{ '--c': m.c }}>
              <h3>{m.ico} {m.t}</h3><p>{m.d}</p>
              <div className="chips">{m.tags.map(t => <span key={t}>{t}</span>)}</div>
            </div>))}
          </div>
        </section>
        <section className="reveal" id="tutoriales">
          <h2>2. Tutoriales</h2>
          <p className="sub">Guías para empezar bien.</p>
          <div className="cards">{GUIDES.map(g => (
            <a className="opt" key={g.href} href={g.href}><h3>📖 {g.t}</h3><p>{g.d}</p><b className="go">Leer →</b></a>))}
          </div>
        </section>
        <section className="reveal">
          <h2>3. Próximamente</h2>
          <p className="sub">Vista previa de diseño: aún no está conectada al servidor.</p>
          <div className="cards">{SOON.map(([i, t, d]) => <div className="opt off" key={t}><h3>{i} {t}</h3><p>{d}</p></div>)}</div>
        </section>
      </div>

      <aside id="unirse"><div className="invoice reveal">
        <h2>Únete en 3 pasos</h2>
        <ol className="steps"><li>Abre Minecraft (Java o Bedrock).</li><li>Añade el servidor con la IP.</li><li>Crea tu cuenta la primera vez y entra al portal que quieras.</li></ol>
        <button className="send btn full" onClick={copy} disabled={!IP}>{label}</button>
        <h2>Streamers</h2>
        <div><div className="row"><span>Jakemy</span><span>TikTok LIVE</span></div><div className="row"><span>josetan</span><span>TikTok LIVE</span></div></div>
        {(C.discord || C.tiktokJakemy || C.tiktokJosetan) && <>
          <h2>Comunidad</h2>
          <div className="guides">
            {C.discord && <a href={C.discord} target="_blank" rel="noopener">💬 Discord</a>}
            {C.tiktokJakemy && <a href={C.tiktokJakemy} target="_blank" rel="noopener">📺 TikTok Jakemy</a>}
            {C.tiktokJosetan && <a href={C.tiktokJosetan} target="_blank" rel="noopener">📺 TikTok josetan</a>}
          </div></>}
      </div></aside>
    </main></div>

    <footer><div className="wrap">
      <nav><a href="#modalidades">Modalidades</a><a href="tutoriales.html">Tutoriales</a><a href="proteccion.html">Protecciones</a><a href="habilidades.html">Habilidades</a></nav>
      <p>© {new Date().getFullYear()} UnityCraft.</p>
      <p>Proyecto de fans. No afiliado a Mojang ni a Microsoft.</p>
    </div></footer>
    <button className="bar" onClick={copy} disabled={!IP}><span>{IP ? 'IP del servidor' : 'IP próximamente'}</span><span>{ok ? '¡Copiada!' : IP || ''}</span></button>
  </>)
}
