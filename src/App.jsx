import { useEffect, useState } from 'react'

const C = window.UNITY || {}
const IP = C.ip || ''

const CHANNELS = [
  { cat: 'INFORMACIÓN', items: [
    { id: 'inicio', icon: '#', name: 'bienvenida', topic: 'Todo lo que necesitas para entrar a UnityCraft' },
    { id: 'modalidades', icon: '#', name: 'modalidades', topic: 'Elige cómo quieres jugar' },
    { id: 'tutoriales', icon: '📚', name: 'tutoriales', topic: 'Guías para empezar bien' } ] },
  { cat: 'JUGADOR', items: [
    { id: 'tienda', icon: '🛒', name: 'tienda', topic: 'Vista previa de la tienda' },
    { id: 'perfil', icon: '👤', name: 'perfil', topic: 'Vista previa del panel de jugador' } ] },
]
const ALL = CHANNELS.flatMap(c => c.items)

const MODES = [
  { ico: '🌳', t: 'Survival Global', c: '#23a559', d: 'Construye, explora y protege tu hogar. Elige un trabajo, sube habilidades y recupera tus cosas si mueres.', tags: ['Protecciones', 'Trabajos', 'Tumbas', 'Tienda'] },
  { ico: '🎮', t: 'Minijuegos', c: '#f0b232', d: 'Partidas rápidas desde el lobby: Arcades, PvP y Shooters, como Quake.', tags: ['Arcades', 'PvP', 'Shooters'] },
  { ico: '⚔️', t: 'Mazmorras y Arena', c: '#f23f43', d: 'Mazmorras por niveles con guardias y jefes, y una arena de oleadas infinitas cada vez más duras.', tags: ['Jefes', 'Oleadas'] },
  { ico: '📺', t: 'TikTok LIVE', c: '#2dd4bf', d: 'Los regalos de los espectadores se convierten en mobs y efectos dentro del juego durante el directo.', tags: ['Jakemy', 'josetan'] },
  { ico: '✨', t: 'Cosméticos', c: '#b983ff', d: 'Gadgets, mascotas, efectos y objetos con modelos 3D personalizados.', tags: ['Gadgets', 'Modelos custom'] },
]
const FEATS = ['🔀 Java y Bedrock', '🛡️ Terrenos protegidos', '⛏️ Trabajos y habilidades', '🪦 Tumbas', '💬 Chat conectado a Discord', '🎙️ Chat de voz']
const GUIDES = [
  { href: 'proteccion.html', t: 'Protecciones', d: 'Claims, explosiones, permisos y subdivisiones. Nivel básico y avanzado.' },
  { href: 'habilidades.html', t: 'Habilidades y trabajos', d: 'XP, estadísticas, poderes de maná, trabajos y cómo ganar dinero.' },
  { href: 'tutoriales.html', t: 'Todos los tutoriales', d: 'Índice completo de guías del servidor.' },
]

function useCopy() {
  const [ok, set] = useState(false)
  return [ok, () => {
    if (!IP) return
    const done = () => { set(true); setTimeout(() => set(false), 1800) }
    navigator.clipboard?.writeText(IP).then(done, () => prompt('Copia la IP:', IP)) ?? prompt('Copia la IP:', IP)
  }]
}

function Msg({ name = 'UnityCraft', bot = true, time, children }) {
  return (
    <div className="msg">
      <div className="av">{name[0]}</div>
      <div className="body">
        <div className="who"><b>{name}</b>{bot && <span className="tag">BOT</span>}<time>{time}</time></div>
        {children}
      </div>
    </div>
  )
}
const Embed = ({ c = '#5865f2', title, children }) => (
  <div className="embed" style={{ '--c': c }}>{title && <h3>{title}</h3>}{children}</div>
)

function Home({ ok, copy }) {
  return (<>
    <div className="banner"><span className="sun" /><h1>UNITYCRAFT</h1><p>Survival global, minijuegos, mazmorras y arena de oleadas. Java y Bedrock.</p></div>
    <Msg time="Hoy"><p>¡Bienvenido! Aquí tienes cómo entrar al servidor 👇</p>
      <Embed c="#f0b232" title="IP del servidor">
        <div className="ip"><code>{IP || 'IP próximamente'}</code>
          <button className="btn go" onClick={copy} disabled={!IP}>{ok ? '¡Copiada!' : 'Copiar IP'}</button></div>
        <p className="mut">☕ Java · 🪨 Bedrock{IP && C.bedrockPort ? ` (puerto ${C.bedrockPort})` : ''}</p>
      </Embed>
      <Embed c="#23a559" title="Únete en 3 pasos"><ol><li>Abre Minecraft (Java o Bedrock).</li><li>Añade el servidor con la IP.</li><li>Crea tu cuenta la primera vez y entra al portal que quieras.</li></ol></Embed>
      <Embed title="Por qué UnityCraft"><div className="chips">{FEATS.map(f => <span key={f}>{f}</span>)}</div></Embed>
    </Msg>
  </>)
}

const Modes = () => (
  <div className="cards">{MODES.map(m => (
    <Embed key={m.t} c={m.c} title={`${m.ico} ${m.t}`}><p>{m.d}</p><div className="chips">{m.tags.map(t => <span key={t}>{t}</span>)}</div></Embed>))}
  </div>
)

const Guides = () => (
  <div className="cards">{GUIDES.map(g => (
    <a key={g.href} className="embed link" style={{ '--c': '#5865f2' }} href={g.href}><h3>📖 {g.t}</h3><p>{g.d}</p><b>Leer →</b></a>))}
  </div>
)

const Preview = ({ title, items }) => (
  <>
    <div className="notice">🚧 Vista previa de diseño: aún no está conectada al servidor.</div>
    <div className="cards">{items.map(([i, t, d]) => <Embed key={t} c="#4e5058" title={`${i} ${t}`}><p className="mut">{d}</p><button className="btn" disabled>Próximamente</button></Embed>)}</div>
  </>
)

export default function App() {
  const get = () => (location.hash.replace('#/', '') || 'inicio')
  const [id, setId] = useState(get())
  const [nav, setNav] = useState(false)
  const [ok, copy] = useCopy()
  useEffect(() => { const f = () => { setId(get()); setNav(false) }; addEventListener('hashchange', f); return () => removeEventListener('hashchange', f) }, [])
  const ch = ALL.find(c => c.id === id) || ALL[0]
  useEffect(() => { document.title = `#${ch.name} · UnityCraft` }, [ch])

  return (
    <div className={`app${nav ? ' open' : ''}`}>
      <aside className="rail" aria-label="Servidores">
        <a className="srv on" href="#/inicio" title="UnityCraft">U</a><i className="sep" />
        {C.discord && <a className="srv" href={C.discord} target="_blank" rel="noopener" title="Discord">💬</a>}
        {C.tiktokJakemy && <a className="srv" href={C.tiktokJakemy} target="_blank" rel="noopener" title="TikTok Jakemy">📺</a>}
      </aside>
      <nav className="side" aria-label="Canales">
        <div className="sh">UnityCraft <span>⌄</span></div>
        <div className="chs">{CHANNELS.map(g => (
          <div key={g.cat}><div className="cat">{g.cat}</div>
            {g.items.map(c => <a key={c.id} href={`#/${c.id}`} className={`ch${c.id === ch.id ? ' on' : ''}`}><span>{c.icon}</span>{c.name}</a>)}</div>))}
        </div>
        <div className="me"><div className="av sm">?<i className="dot" /></div><div><b>Visitante</b><small>{IP ? 'Servidor en línea' : 'IP próximamente'}</small></div>
          <button className="ib" onClick={copy} disabled={!IP} title="Copiar IP" aria-label="Copiar IP">{ok ? '✔' : '📋'}</button></div>
      </nav>
      <div className="scrim" onClick={() => setNav(false)} />
      <main className="main">
        <header className="top">
          <button className="ib burger" onClick={() => setNav(true)} aria-label="Abrir canales">☰</button>
          <span className="hash">{ch.icon}</span><h2>{ch.name}</h2><span className="topic">{ch.topic}</span>
          <button className="btn go sm" onClick={copy} disabled={!IP}>{ok ? '¡Copiada!' : IP ? 'Copiar IP' : 'IP próximamente'}</button>
        </header>
        <div className="feed" key={ch.id}>
          {ch.id === 'inicio' && <Home ok={ok} copy={copy} />}
          {ch.id === 'modalidades' && <Modes />}
          {ch.id === 'tutoriales' && <Guides />}
          {ch.id === 'tienda' && <Preview items={[['🎁', 'Cosméticos', 'Gadgets, mascotas y efectos.'], ['🔑', 'Llaves', 'Cofres y recompensas.'], ['👑', 'Rangos', 'Ventajas para tu cuenta.']]} />}
          {ch.id === 'perfil' && <Preview items={[['🧍', 'Tu cuenta', 'Vincula Java o Bedrock.'], ['📊', 'Estadísticas', 'Nivel, trabajo y economía.'], ['🏆', 'Tops', 'Tu lugar en los rankings.']]} />}
        </div>
      </main>
      <aside className="mem" aria-label="Miembros">
        <div className="cat">STREAMERS — 2</div>
        {['Jakemy', 'josetan'].map(n => <div className="mb" key={n}><div className="av sm">{n[0].toUpperCase()}<i className="dot" /></div>{n}<span className="tag">LIVE</span></div>)}
        <div className="cat">MODALIDADES — {MODES.length}</div>
        {MODES.map(m => <div className="mb" key={m.t}><span>{m.ico}</span>{m.t}</div>)}
      </aside>
    </div>
  )
}
