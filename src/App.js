import { useState, useEffect, useRef } from "react";
import logo from "./logo-sii.png";

/* ─────────────────────────────────────────
   PALETTE — strictement du logo SII
   #28283C = bleu marine exact
───────────────────────────────────────── */
const C = {
  // Bleus marine (du logo)
  navy:      "#28283C",
  navyD:     "#1E1E2E",
  navyDD:    "#14141E",
  navyL:     "#3C3C50",
  navyLL:    "#50506A",

  // Acier (secondaires du logo)
  steel:     "#64788C",
  steelL:    "#8496A8",
  mist:      "#B4B4C8",

  // Textes
  white:     "#FFFFFF",
  offwhite:  "#E8E8F0",
  dim:       "rgba(232,232,240,0.55)",
  ghost:     "rgba(232,232,240,0.22)",

  // Accent chaud (bronze du logo)
  bronze:    "#B8966A",
  bronzeL:   "#D4B48A",

  // Règles
  rule:      "rgba(100,120,140,0.2)",
  ruleNav:   "rgba(184,150,106,0.3)",
};

/* ─────────────────────────────────────────
   CSS GLOBAL
───────────────────────────────────────── */
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:ital,wght@0,300;0,400;0,500;1,300&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    background: ${C.navyDD};
    color: ${C.offwhite};
    font-family: 'Barlow', system-ui, sans-serif;
    font-weight: 300;
    line-height: 1.7;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: ${C.navyD}; }
  ::-webkit-scrollbar-thumb { background: ${C.bronze}; }

  .f-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: .04em; }
  .f-mono    { font-family: 'DM Mono', monospace; }

  /* ── Animations ── */
  @keyframes gearSpin   { to { transform: rotate(360deg); } }
  @keyframes fadeUp     { from { opacity:0; transform:translateY(36px); } to { opacity:1; transform:translateY(0); } }
  @keyframes blink      { 0%,100%{opacity:1} 50%{opacity:.15} }
  @keyframes cableDash  { to { stroke-dashoffset: -48; } }
  @keyframes cableGlow  { 0%,100%{opacity:.4} 50%{opacity:.9} }
  @keyframes spark      { 0%,86%,100%{opacity:0} 88%,96%{opacity:1} 92%{opacity:.3} }
  @keyframes nacelleUp  { 0%,100%{transform:translateY(0)} 40%{transform:translateY(-55px)} 50%,54%{transform:translateY(-55px);opacity:0} 56%{transform:translateY(0);opacity:0} 62%{opacity:1} }
  @keyframes craneSwing { 0%,100%{transform:rotate(-1.8deg)} 50%{transform:rotate(1.8deg)} }
  @keyframes gridDrift  { to { background-position: 60px 60px; } }
  @keyframes slideLeft  { from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:translateX(0)} }
  @keyframes pulseRing  { 0%{transform:scale(.95);opacity:.6} 50%{transform:scale(1.05);opacity:1} 100%{transform:scale(.95);opacity:.6} }

  .gear-spin { animation: gearSpin 16s linear infinite; transform-origin: 50% 50%; }

  /* Reveal au scroll */
  .reveal {
    opacity: 0; transform: translateY(30px);
    transition: opacity 1s cubic-bezier(.16,1,.3,1),
                transform 1s cubic-bezier(.16,1,.3,1);
  }
  .reveal.show { opacity:1; transform:translateY(0); }
  .d1{transition-delay:.1s} .d2{transition-delay:.22s}
  .d3{transition-delay:.34s} .d4{transition-delay:.46s}

  /* Reveal depuis la gauche */
  .reveal-left {
    opacity:0; transform:translateX(-28px);
    transition: opacity 1s cubic-bezier(.16,1,.3,1),
                transform 1s cubic-bezier(.16,1,.3,1);
  }
  .reveal-left.show { opacity:1; transform:translateX(0); }

  /* Nav links */
  .nav-a {
    font-family:'DM Mono'; font-size:.64rem; letter-spacing:.2em;
    text-transform:uppercase; color:${C.dim}; text-decoration:none;
    position:relative; transition:color .3s; padding-bottom:3px;
  }
  .nav-a::after {
    content:''; position:absolute; bottom:0; left:0;
    width:0; height:1px; background:${C.bronze};
    transition:width .4s cubic-bezier(.16,1,.3,1);
  }
  .nav-a:hover { color:${C.white}; }
  .nav-a:hover::after { width:100%; }

  /* Pillar card */
  .pillar-card {
    padding:1.8rem 1.6rem;
    border-top: 2px solid transparent;
    background: ${C.navyL}22;
    border: 1px solid ${C.rule};
    transition: border-color .3s, background .3s;
  }
  .pillar-card:hover { border-color:${C.bronze}; background:${C.navyL}44; }

  /* Spec card */
  .spec-card { position:relative; overflow:hidden; transition:background .3s; }
  .spec-card:hover { background:${C.navyL}55 !important; }
  .spec-bar { position:absolute; bottom:0; left:0; width:0; height:2px; background:${C.bronze}; transition:width .5s cubic-bezier(.16,1,.3,1); }
  .spec-card:hover .spec-bar { width:100%; }

  /* Phase card */
  .mphase { position:relative; overflow:hidden; transition:background .4s; }
  .mphase:hover { background:${C.navyL}44 !important; }
  .mphase-line { position:absolute; top:0; left:0; width:3px; height:0; background:${C.bronze}; transition:height .6s cubic-bezier(.16,1,.3,1); }
  .mphase:hover .mphase-line { height:100%; }

  /* Accordion list */
  .acc-li {
    padding:.6rem 0; border-bottom:1px solid ${C.rule};
    font-size:.88rem; color:${C.dim};
    display:flex; align-items:flex-start; gap:10px; line-height:1.55;
    transition:color .3s; list-style:none;
  }
  .acc-li:hover { color:${C.white}; }
  .acc-li::before { content:''; display:block; flex-shrink:0; width:4px; height:4px; border-radius:50%; background:${C.bronze}; margin-top:.55rem; }
  .acc-li:last-child { border-bottom:none; }

  /* Project row */
  .proj-row { transition:padding-left .5s cubic-bezier(.16,1,.3,1),background .3s; cursor:default; }
  .proj-row:hover { padding-left:1.4rem !important; background:${C.navyL}18 !important; }

  /* Buttons */
  .btn-primary {
    display:inline-block; padding:1rem 2.4rem;
    background:${C.bronze}; color:${C.navyDD};
    font-family:'DM Mono'; font-size:.7rem; letter-spacing:.22em;
    text-transform:uppercase; text-decoration:none; font-weight:500;
    transition:background .3s, transform .2s; border:none; cursor:pointer;
  }
  .btn-primary:hover { background:${C.bronzeL}; transform:translateY(-2px); }

  .btn-outline {
    display:inline-flex; align-items:center; gap:10px;
    padding:.72rem 1.6rem; border:1px solid ${C.ruleNav};
    color:${C.bronze}; font-family:'DM Mono'; font-size:.68rem;
    letter-spacing:.2em; text-transform:uppercase; text-decoration:none;
    transition:background .3s, gap .4s; background:transparent;
  }
  .btn-outline:hover { background:${C.bronze}15; gap:18px; }

  /* Media slot */
  .media-slot {
    width:100%;
    background: repeating-linear-gradient(
      45deg, ${C.navyL}30, ${C.navyL}30 8px, ${C.navyL}50 8px, ${C.navyL}50 16px
    );
    border:1px dashed ${C.rule};
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px;
  }

  @media(max-width:960px){
    .hero-grid,.about-grid,.srv-intro,.contact-grid{ grid-template-columns:1fr !important; }
    .about-sticky{ position:static !important; }
    .miss-phases{ grid-template-columns:1fr !important; }
    .specs-grid{ grid-template-columns:1fr 1fr !important; }
    .acc-inner{ grid-template-columns:1fr !important; }
    .pillars-grid{ grid-template-columns:1fr 1fr !important; }
    .proj-cols{ grid-template-columns:auto 1fr !important; }
    .hero-kpis{ grid-template-columns:repeat(2,1fr) !important; }
  }
  @media(max-width:600px){
    .nav-links-desk{ display:none !important; }
    .specs-grid,.pillars-grid{ grid-template-columns:1fr !important; }
    footer{ flex-direction:column; text-align:center; }
  }
`;

/* ─────────────────────────────────────────
   ENGRENAGE SEUL — logo tournant
   Fond 100% transparent
───────────────────────────────────────── */
function GearLogo({ size = 48, color = C.bronze, speed = 16 }) {
  const cx = size / 2, cy = size / 2;
  const Ro = size * 0.42;  // rayon externe dents
  const Ri = size * 0.28;  // rayon interne corps
  const Rh = size * 0.11;  // rayon trou central

  // Construire le path de l'engrenage (8 dents)
  const N = 8;
  const pts = [];
  for (let i = 0; i < N; i++) {
    const base = (i / N) * Math.PI * 2;
    const w = (0.4 / N) * Math.PI * 2; // largeur dent
    // Base dent intérieure
    pts.push([cx + Math.cos(base - w) * Ri, cy + Math.sin(base - w) * Ri]);
    pts.push([cx + Math.cos(base - w * 0.6) * Ro, cy + Math.sin(base - w * 0.6) * Ro]);
    pts.push([cx + Math.cos(base + w * 0.6) * Ro, cy + Math.sin(base + w * 0.6) * Ro]);
    pts.push([cx + Math.cos(base + w) * Ri, cy + Math.sin(base + w) * Ri]);
  }
  const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ") + " Z";

  // Rayons internes (6)
  const spokes = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2;
    return {
      x1: cx + Math.cos(a) * (Rh * 1.5),
      y1: cy + Math.sin(a) * (Rh * 1.5),
      x2: cx + Math.cos(a) * (Ri * 0.78),
      y2: cy + Math.sin(a) * (Ri * 0.78),
    };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" style={{ display:"block", flexShrink:0 }}>
      <g className="gear-spin" style={{ transformOrigin:`${cx}px ${cy}px`, animationDuration:`${speed}s` }}>
        {/* Corps engrenage */}
        <path d={pathD} fill={color} opacity=".92" />
        {/* Anneau intérieur creux */}
        <circle cx={cx} cy={cy} r={Ri * 0.88} fill="transparent" stroke={color} strokeWidth={size * 0.025} opacity=".35" />
        {/* Rayons */}
        {spokes.map((s, i) => (
          <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
            stroke={color} strokeWidth={size * 0.03} opacity=".5" strokeLinecap="round" />
        ))}
        {/* Trou central */}
        <circle cx={cx} cy={cy} r={Rh} fill="transparent" stroke={color} strokeWidth={size * 0.03} opacity=".7" />
        <circle cx={cx} cy={cy} r={Rh * 0.45} fill={color} opacity=".6" />
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────
   CÂBLES ÉLECTRIQUES animés (SVG scroll)
───────────────────────────────────────── */
function ElectricCables({ flip = false, accent = false }) {
  const col = accent ? C.bronze : C.steel;
  const y1 = flip ? 58 : 18;
  const y2 = flip ? 28 : 48;
  const y3 = flip ? 8  : 58;
  return (
    <svg viewBox="0 0 1400 70" preserveAspectRatio="none"
      style={{ position:"absolute", [flip?"top":"bottom"]:0, left:0, width:"100%", height:70, pointerEvents:"none", zIndex:10 }}>
      {/* Câble 1 — fin, lent */}
      <path d={`M0 ${y1} Q350 ${y1-14} 700 ${y1} Q1050 ${y1+14} 1400 ${y1}`}
        fill="none" stroke={col} strokeWidth="1"
        strokeDasharray="24,12" opacity=".3"
        style={{ animation:`cableDash 4s linear infinite` }} />
      {/* Câble 2 — moyen, accent */}
      <path d={`M0 ${y2} Q350 ${y2+16} 700 ${y2} Q1050 ${y2-16} 1400 ${y2}`}
        fill="none" stroke={accent ? C.bronze : C.steelL} strokeWidth="1.8"
        strokeDasharray="16,10" opacity={accent ? ".7" : ".45"}
        style={{ animation:`cableDash 2.8s linear infinite, cableGlow 3s ease-in-out infinite` }} />
      {/* Câble 3 — épais, lent */}
      <path d={`M0 ${y3} Q350 ${y3-10} 700 ${y3} Q1050 ${y3+10} 1400 ${y3}`}
        fill="none" stroke={col} strokeWidth="2.5"
        strokeDasharray="30,15" opacity=".18"
        style={{ animation:`cableDash 5s linear infinite` }} />
      {/* Étincelles */}
      <g style={{ animation:`spark 7s ease-in-out infinite` }}>
        <polyline points={`120,${y2-4} 127,${y2+8} 120,${y2+11} 129,${y2+26}`}
          fill="none" stroke="rgba(255,220,60,.95)" strokeWidth="2" strokeLinejoin="round" />
      </g>
      <g style={{ animation:`spark 7s ease-in-out 3.5s infinite` }}>
        <polyline points={`1280,${y2-4} 1287,${y2+8} 1280,${y2+11} 1289,${y2+26}`}
          fill="none" stroke="rgba(255,220,60,.95)" strokeWidth="2" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────
   GRUE SVG animée (hero background)
───────────────────────────────────────── */
function CraneScene() {
  return (
    <svg viewBox="0 0 1000 580" preserveAspectRatio="xMidYMid slice"
      style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", opacity:.13 }}>

      {/* Tour principale */}
      <rect x="480" y="60" width="20" height="500" fill={C.steelL} rx="2"/>
      {[100,180,260,340,420].map(y=>(
        <g key={y}>
          <line x1="480" y1={y} x2="500" y2={y+45} stroke={C.steelL} strokeWidth="1.5" opacity=".5"/>
          <line x1="500" y1={y} x2="480" y2={y+45} stroke={C.steelL} strokeWidth="1.5" opacity=".5"/>
        </g>
      ))}

      {/* Bras (animé swing) */}
      <g style={{ transformOrigin:"490px 68px", animation:"craneSwing 8s ease-in-out infinite" }}>
        <rect x="230" y="60" width="520" height="14" fill={C.steelL} rx="2"/>
        {/* Haubans */}
        <line x1="490" y1="74" x2="310" y2="74" stroke={C.steelL} strokeWidth="2.5" opacity=".6"/>
        <line x1="310" y1="74" x2="285" y2="105" stroke={C.steelL} strokeWidth="2" opacity=".5"/>
        <line x1="490" y1="65" x2="680" y2="35" stroke={C.steelL} strokeWidth="2" opacity=".5"/>
        <line x1="490" y1="65" x2="750" y2="65" stroke={C.steelL} strokeWidth="2" opacity=".4"/>
        {/* Contrepoids */}
        <rect x="724" y="64" width="42" height="22" fill={C.steelL} rx="2" opacity=".7"/>

        {/* Câble + nacelle (monte/descend) */}
        <g style={{ animation:"nacelleUp 10s ease-in-out infinite" }}>
          <line x1="680" y1="74" x2="680" y2="230" stroke={C.steelL} strokeWidth="2" strokeDasharray="5,5"/>
          {/* Nacelle */}
          <rect x="660" y="230" width="40" height="20" fill={C.steelL} rx="3" opacity=".85"/>
          <rect x="667" y="224" width="7" height="8" fill={C.steelL} rx="1" opacity=".7"/>
          <rect x="678" y="224" width="7" height="8" fill={C.steelL} rx="1" opacity=".7"/>
          {/* Ouvrier */}
          <circle cx="680" cy="240" r="5" fill={C.steelL} opacity=".7"/>
          <line x1="680" y1="245" x2="680" y2="254" stroke={C.steelL} strokeWidth="2" opacity=".6"/>
          <line x1="680" y1="248" x2="673" y2="254" stroke={C.steelL} strokeWidth="1.5" opacity=".5"/>
          <line x1="680" y1="248" x2="687" y2="254" stroke={C.steelL} strokeWidth="1.5" opacity=".5"/>
        </g>
      </g>

      {/* Pylônes électriques */}
      {[60, 880].map(x => (
        <g key={x}>
          <line x1={x+12} y1="280" x2={x+12} y2="560" stroke={C.steelL} strokeWidth="4" opacity=".5"/>
          <line x1={x}    y1="280" x2={x+24} y2="280" stroke={C.steelL} strokeWidth="4" opacity=".5"/>
          <line x1={x+4}  y1="310" x2={x+20} y2="310" stroke={C.steelL} strokeWidth="3" opacity=".4"/>
          <line x1={x+8}  y1="340" x2={x+16} y2="340" stroke={C.steelL} strokeWidth="2" opacity=".35"/>
          <line x1={x+12} y1="280" x2={x-14} y2="400" stroke={C.steelL} strokeWidth="2" opacity=".35"/>
          <line x1={x+12} y1="280" x2={x+38} y2="400" stroke={C.steelL} strokeWidth="2" opacity=".35"/>
        </g>
      ))}

      {/* Câbles entre pylônes */}
      {[295, 315, 335].map((y, i) => (
        <path key={i}
          d={`M72 ${y} Q500 ${y+20} 892 ${y}`}
          fill="none" stroke={C.steelL}
          strokeWidth={i===1?"2.5":"1.5"}
          strokeDasharray="20,10"
          opacity={i===1?".55":".3"}
          style={{ animation:`cableDash ${3+i*.8}s linear infinite` }}
        />
      ))}

      {/* Étincelles pylônes */}
      <g style={{ animation:"spark 8s ease-in-out infinite" }}>
        <polyline points="72,308 80,322 70,326 82,344" fill="none" stroke="rgba(255,220,60,.9)" strokeWidth="3" strokeLinejoin="round"/>
      </g>
      <g style={{ animation:"spark 8s ease-in-out 4s infinite" }}>
        <polyline points="892,308 900,322 890,326 902,344" fill="none" stroke="rgba(255,220,60,.9)" strokeWidth="3" strokeLinejoin="round"/>
      </g>

      {/* Sol */}
      <rect x="0" y="558" width="1000" height="22" fill={C.steelL} opacity=".15" rx="2"/>
    </svg>
  );
}

/* ─────────────────────────────────────────
   PROGRESS BAR
───────────────────────────────────────── */
function ProgressBar() {
  const [w, setW] = useState(0);
  useEffect(() => {
    const fn = () => {
      const t = document.body.scrollHeight - window.innerHeight;
      if (t > 0) setW((window.scrollY / t) * 100);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return <div style={{ position:"fixed",top:0,left:0,zIndex:9999,height:"2px",width:`${w}%`,background:`linear-gradient(90deg,${C.bronze},${C.bronzeL})`,transition:"width .08s linear",pointerEvents:"none" }} />;
}

/* ─────────────────────────────────────────
   HOOK REVEAL
───────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add("show"); }),
      { threshold: 0.07, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal, .reveal-left").forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

/* ─────────────────────────────────────────
   EYEBROW
───────────────────────────────────────── */
function Eyebrow({ text }) {
  return (
    <div className="reveal f-mono" style={{
      fontSize:".62rem", letterSpacing:".3em", textTransform:"uppercase",
      color:C.bronze, marginBottom:"1.2rem",
      display:"flex", alignItems:"center", gap:12,
    }}>
      <span style={{ display:"inline-block", width:20, height:1, background:C.bronze, flexShrink:0 }} />
      {text}
    </div>
  );
}

/* ─────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:900, height:72, padding:"0 5vw",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      background: scrolled ? `rgba(20,20,30,.97)` : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.rule}` : "none",
      transition:"background .5s, border-color .5s",
    }}>
      {/* Logo engrenage + texte */}
      <a href="#accueil" style={{ display:"flex", alignItems:"center", gap:14, textDecoration:"none" }}>
        <GearLogo size={40} color={C.bronze} speed={16} />
        <div>
          <div className="f-mono" style={{ fontSize:".76rem", letterSpacing:".28em", textTransform:"uppercase", color:C.white, lineHeight:1 }}>SII</div>
          <div className="f-mono" style={{ fontSize:".55rem", letterSpacing:".07em", color:C.dim, marginTop:2 }}>Société d'Ingénierie et d'Innovation</div>
        </div>
      </a>

      <ul className="nav-links-desk" style={{ display:"flex", gap:"2.2rem", listStyle:"none", alignItems:"center" }}>
        {[["À Propos","#apropos"],["Services","#services"],["Missions","#missions"],["Références","#projets"]].map(([l,h])=>(
          <li key={h}><a href={h} className="nav-a">{l}</a></li>
        ))}
        <li>
          <a href="#contact" className="btn-primary" style={{ padding:".5rem 1.4rem", fontSize:".64rem" }}>Contact</a>
        </li>
      </ul>
    </nav>
  );
}

/* ─────────────────────────────────────────
   HERO — plein écran marine
───────────────────────────────────────── */
function Hero() {
  return (
    <section id="accueil" style={{
      minHeight:"100vh", position:"relative", overflow:"hidden",
      display:"flex", alignItems:"center",
      background:`linear-gradient(135deg, ${C.navyDD} 0%, ${C.navy} 60%, ${C.navyL} 100%)`,
    }}>
      {/* Grille fond */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:`repeating-linear-gradient(0deg,${C.rule} 0 1px,transparent 1px 60px),repeating-linear-gradient(90deg,${C.rule} 0 1px,transparent 1px 60px)`,
        backgroundSize:"60px 60px", animation:"gridDrift 30s linear infinite" }} />

      {/* Illustration industrielle SVG */}
      <CraneScene />

      {/* Dégradé gauche pour lisibilité texte */}
      <div style={{ position:"absolute", inset:0, background:`linear-gradient(to right, ${C.navyDD}F0 40%, ${C.navyDD}80 70%, transparent 100%)`, zIndex:2 }} />

      {/* Ligne verticale déco */}
      <div style={{ position:"absolute", left:"48%", top:"8%", bottom:"8%", width:1, background:`linear-gradient(to bottom, transparent, ${C.bronze}50, transparent)`, zIndex:3 }} />

      {/* Câbles haut et bas */}
      <ElectricCables flip accent />
      <ElectricCables />

      {/* Contenu */}
      <div style={{ position:"relative", zIndex:4, padding:"120px 5vw 80px", maxWidth:800 }}>

        {/* Badge */}
        <div className="f-mono" style={{
          display:"inline-flex", alignItems:"center", gap:8,
          padding:".4rem 1rem", marginBottom:"2.5rem",
          border:`1px solid ${C.ruleNav}`,
          fontSize:".62rem", letterSpacing:".2em", textTransform:"uppercase", color:C.bronze,
          animation:"fadeUp .8s cubic-bezier(.16,1,.3,1) .3s both",
        }}>
          <span style={{ width:5, height:5, borderRadius:"50%", background:C.bronze, animation:"blink 2.5s ease infinite" }} />
          EIA · Électricité · Instrumentation · Automatisme
        </div>

        {/* Logo image au-dessus du titre */}
        <div style={{ marginBottom:"2rem", animation:"fadeUp .9s cubic-bezier(.16,1,.3,1) .45s both" }}>
          <img src={logo} alt="SII"
            style={{ height:56, width:"auto",
              filter:"brightness(0) invert(1)",
              opacity:.9 }}
          />
        </div>

        {/* Titre massif */}
        <h1 className="f-display" style={{
          fontSize:"clamp(4rem,8.5vw,9.5rem)",
          lineHeight:.9, color:C.white, marginBottom:0,
          animation:"fadeUp 1s cubic-bezier(.16,1,.3,1) .6s both",
        }}>
          L'INGÉNIERIE<br/>
          <span style={{ color:C.bronze }}>INDUSTRIELLE</span><br/>
          <span style={{ color:C.mist }}>AU SERVICE</span><br/>
          DU TERRAIN
        </h1>

        {/* Charte */}
        <div style={{
          marginTop:"2.5rem",
          borderLeft:`3px solid ${C.bronze}`,
          paddingLeft:"1.4rem",
          animation:"fadeUp .8s cubic-bezier(.16,1,.3,1) .85s both",
        }}>
          <p style={{ fontSize:"1.05rem", color:C.dim, fontStyle:"italic", fontWeight:300 }}>
            Construisons l'avenir, projet par projet.
          </p>
        </div>

        {/* Description */}
        <p style={{
          marginTop:"1.8rem", fontSize:".98rem", lineHeight:1.85,
          color:C.dim, maxWidth:500,
          animation:"fadeUp .8s cubic-bezier(.16,1,.3,1) 1s both",
        }}>
          SII accompagne les industriels marocains dans leurs projets complexes — de l'étude à la mise en service — avec la rigueur et la précision que chaque installation mérite.
        </p>

        {/* CTAs */}
        <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap", marginTop:"2.5rem", animation:"fadeUp .8s cubic-bezier(.16,1,.3,1) 1.15s both" }}>
          <a href="#contact" className="btn-primary">Discuter de votre projet</a>
          <a href="#services" className="btn-outline">Nos services →</a>
        </div>

        {/* KPIs */}
        <div className="hero-kpis" style={{
          display:"grid", gridTemplateColumns:"repeat(4,1fr)",
          gap:0, marginTop:"4rem",
          borderTop:`1px solid ${C.rule}`,
          animation:"fadeUp .8s cubic-bezier(.16,1,.3,1) 1.3s both",
        }}>
          {[["20+","Ans d'exp."],["550+","MMAD"],["5","Références"],["2024","Fondation"]].map(([v,l],i)=>(
            <div key={i} style={{ padding:"1.4rem 1rem", borderRight:i<3?`1px solid ${C.rule}`:"none" }}>
              <div className="f-display" style={{ fontSize:"2.8rem", lineHeight:1, color:C.bronze }}>{v}</div>
              <div className="f-mono" style={{ fontSize:".58rem", letterSpacing:".16em", textTransform:"uppercase", color:C.dim, marginTop:".3rem", lineHeight:1.4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   À PROPOS
───────────────────────────────────────── */
function About() {
  const pillars = [
    { icon:"⚙", name:"Maîtrise EIA", body:"Électricité, instrumentation et automatisme — couverture complète des disciplines industrielles." },
    { icon:"◈", name:"Méthodes Éprouvées", body:"Processus alignés sur les standards internationaux de gestion de projets industriels." },
    { icon:"◎", name:"Ancrage Local", body:"Connaissance approfondie du tissu industriel marocain et de ses acteurs clés." },
    { icon:"◇", name:"Engagement Direct", body:"Interlocuteurs techniques impliqués à chaque étape, sans intermédiaires inutiles." },
  ];
  return (
    <section id="apropos" style={{ background:`linear-gradient(180deg, ${C.navyDD} 0%, ${C.navy} 100%)`, position:"relative" }}>
      {/* Engrenage déco fond */}
      <div style={{ position:"absolute", right:"-5rem", top:"4rem", opacity:.04, pointerEvents:"none" }}>
        <GearLogo size={420} color={C.steelL} speed={60} />
      </div>
      <ElectricCables flip />

      <div style={{ padding:"9rem 5vw", maxWidth:1500, margin:"0 auto", position:"relative", zIndex:1 }}>
        <div className="about-grid" style={{ display:"grid", gridTemplateColumns:"4fr 6fr", gap:"7rem", alignItems:"start" }}>

          <div className="about-sticky" style={{ position:"sticky", top:100 }}>
            <Eyebrow text="À Propos de SII" />
            <h2 className="f-display reveal" style={{ fontSize:"clamp(3rem,4.5vw,5.5rem)", lineHeight:.92, color:C.white, marginTop:"1.5rem" }}>
              UNE ÉQUIPE<br/>
              <span style={{ color:C.bronze }}>CHEVRONNÉE</span><br/>
              UNE STRUCTURE<br/>
              <span style={{ color:C.mist }}>DÉDIÉE</span>
            </h2>
            <div style={{ marginTop:"3rem", opacity:.2 }}>
              <GearLogo size={100} color={C.bronze} speed={18} />
            </div>
          </div>

          <div>
            <div className="reveal" style={{ marginBottom:"2.5rem" }}>
              <div className="media-slot" style={{ aspectRatio:"16/7", padding:"3rem" }}>
                <span style={{ fontSize:"1.5rem", opacity:.2 }}>📷</span>
                <span className="f-mono" style={{ fontSize:".58rem", letterSpacing:".2em", textTransform:"uppercase", color:C.ghost }}>Photo de l'équipe SII</span>
              </div>
            </div>
            <p className="reveal" style={{ fontSize:"1rem", lineHeight:1.9, color:C.dim, marginBottom:"1.8rem" }}>
              <strong style={{ color:C.white, fontWeight:500 }}>SII — Société d'Ingénierie et d'Innovation</strong> — est une entreprise marocaine créée en 2024, spécialisée dans l'électricité industrielle, l'instrumentation et l'automatisme. Si la structure est récente, l'expertise qui la fonde est profondément ancrée dans le terrain.
            </p>
            <p className="reveal" style={{ fontSize:"1rem", lineHeight:1.9, color:C.dim, marginBottom:"1.8rem" }}>
              Ses fondateurs cumulent plus de vingt ans d'expérience opérationnelle sur des projets industriels d'envergure au Maroc — bâtie dans des environnements exigeants, auprès de grands donneurs d'ordres.
            </p>
            <div className="reveal" style={{ borderLeft:`3px solid ${C.bronze}`, paddingLeft:"1.4rem", background:`${C.bronze}08`, padding:"1.5rem 2rem 1.5rem 1.8rem", margin:"2rem 0" }}>
              <p style={{ fontSize:".95rem", lineHeight:1.8, color:C.dim, margin:0 }}>
                <strong style={{ color:C.white, fontWeight:400 }}>Pourquoi SII ?</strong> Une équipe technique directement impliquée, de la première étude jusqu'à la mise en service — sans dilution dans une grande structure.
              </p>
            </div>
            <div className="reveal pillars-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginTop:"2rem" }}>
              {pillars.map((p,i)=>(
                <div key={i} className="pillar-card">
                  <div style={{ fontSize:"1.4rem", marginBottom:".7rem" }}>{p.icon}</div>
                  <div className="f-display" style={{ fontSize:"1.4rem", color:C.white, marginBottom:".4rem" }}>{p.name}</div>
                  <div style={{ fontSize:".84rem", color:C.dim, lineHeight:1.65 }}>{p.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ElectricCables accent />
    </section>
  );
}

/* ─────────────────────────────────────────
   SERVICES
───────────────────────────────────────── */
const SERVICES = [
  { num:"01", title:"Engineering & Solutions Contractuelles", desc:"Études sur mesure, du concept à l'exécution", body:"SII réalise des études pluridisciplinaires intégrées, en forfait ou en régie. Chaque prestation est construite autour des contraintes techniques et budgétaires spécifiques du client.", items:["CCTV & vidéosurveillance industrielle et urbaine","Électricité industrielle — HTB, HTA, BT","Automatisme & Instrumentation — DCS/PLC","Fire Fighting & Fire Alarm","Études pluridisciplinaires intégrées","Solutions contractuelles — forfait & dépense contrôlée","Travaux neufs et construction industrielle"] },
  { num:"02", title:"Supervision & Gestion de Projets", desc:"Coordonner, suivre, livrer dans les règles", body:"Nos équipes assurent la coordination des corps de métier, le contrôle des délais et des budgets, avec un reporting clair et régulier auprès du maître d'ouvrage.", items:["Supervision de travaux — OPC, DET","Management HSE","Management de programmes complexes","Coordination multi-lots","Contrôle des coûts et planning","Reporting et tableaux de bord client"] },
  { num:"03", title:"Ingénierie & Ressources Techniques", desc:"Les bons profils, au bon moment", body:"SII met à disposition des clients des ressources techniques qualifiées, capables d'intervenir en assistance technique intégrée ou en autonomie dans l'équipe projet.", items:["Ingénieurs d'études et de chantier EIA","Techniciens spécialisés","Dessinateurs CAO / DAO","Directeurs et responsables de construction","Préparateurs méthodes","Profils junior à senior"] },
  { num:"04", title:"Conseil & Assistance Technique", desc:"Un regard technique indépendant", body:"Notre pôle conseil accompagne les directions techniques dans leurs arbitrages — choix de solutions, sélection de prestataires, optimisation d'un DCE.", items:["Conseil technique en dépense contrôlée","Assistance technique intégrée","Experts métier EIA","PMO mis à disposition","Études de faisabilité","Diagnostics et audits techniques"] },
];

function Services() {
  const [open, setOpen] = useState(0);
  return (
    <section id="services" style={{ background:`linear-gradient(180deg, ${C.navy} 0%, ${C.navyD} 100%)`, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", right:"-3rem", bottom:"-3rem", opacity:.04, pointerEvents:"none" }}>
        <GearLogo size={350} color={C.bronze} speed={55} />
      </div>
      <ElectricCables flip />
      <div style={{ padding:"9rem 5vw", maxWidth:1500, margin:"0 auto", position:"relative", zIndex:1 }}>
        <div className="srv-intro" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4rem", alignItems:"end", marginBottom:"4rem" }}>
          <div>
            <Eyebrow text="Nos Domaines d'Intervention" />
            <h2 className="f-display reveal" style={{ fontSize:"clamp(3rem,4.5vw,5.5rem)", lineHeight:.92, color:C.white, marginTop:"1.5rem" }}>
              SAVOIR-FAIRE<br/>
              <span style={{ color:C.bronze }}>COMPLET</span><br/>
              <span style={{ color:C.mist }}>DE L'ÉTUDE</span><br/>
              AU CHANTIER
            </h2>
          </div>
          <p className="reveal" style={{ fontSize:".97rem", lineHeight:1.85, color:C.dim }}>
            SII intervient sur <strong style={{ color:C.white, fontWeight:400 }}>l'ensemble de la chaîne de projet industriel</strong> — des études préliminaires jusqu'à la supervision des travaux et la mise en service.
          </p>
        </div>
        <div className="reveal" style={{ borderTop:`1px solid ${C.rule}` }}>
          {SERVICES.map((s,i)=>(
            <AccItem key={i} {...s} isOpen={open===i} onToggle={()=>setOpen(open===i?-1:i)} />
          ))}
        </div>
      </div>
      <ElectricCables accent />
    </section>
  );
}

function AccItem({ num, title, desc, body, items, isOpen, onToggle }) {
  return (
    <div style={{ borderBottom:`1px solid ${C.rule}` }}>
      <div onClick={onToggle} style={{ display:"grid", gridTemplateColumns:"3rem 1fr 2.2rem", alignItems:"center", gap:"2rem", padding:"1.8rem 0", cursor:"pointer" }}>
        <span className="f-mono" style={{ fontSize:".6rem", letterSpacing:".2em", color:C.ghost }}>{num}</span>
        <span className="f-display" style={{ fontSize:"clamp(1.4rem,2vw,2.2rem)", color:isOpen?C.bronze:C.offwhite, transition:"color .3s" }}>{title}</span>
        <div style={{ width:32, height:32, border:`1px solid ${isOpen?C.bronze:C.rule}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transform:isOpen?"rotate(45deg)":"none", background:isOpen?C.bronze:"transparent", transition:"all .5s cubic-bezier(.16,1,.3,1)" }}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke={isOpen?C.navyDD:C.white} strokeWidth="1.5" strokeLinecap="round"/></svg>
        </div>
      </div>
      <div style={{ maxHeight:isOpen?900:0, overflow:"hidden", transition:"max-height .65s cubic-bezier(.16,1,.3,1)" }}>
        <div className="acc-inner" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"3rem", padding:"0 0 2.5rem 5rem" }}>
          <div>
            <strong style={{ display:"block", fontSize:"1.05rem", fontWeight:400, color:C.offwhite, marginBottom:".8rem" }}>{desc}</strong>
            <p style={{ fontSize:".9rem", lineHeight:1.85, color:C.dim }}>{body}</p>
            <div style={{ marginTop:"1.8rem" }}>
              <div className="media-slot" style={{ aspectRatio:"16/8", padding:"2rem" }}>
                <span style={{ fontSize:"1.2rem", opacity:.2 }}>📷</span>
                <span className="f-mono" style={{ fontSize:".56rem", letterSpacing:".18em", textTransform:"uppercase", color:C.ghost }}>Photo — {title}</span>
              </div>
            </div>
          </div>
          <ul style={{ listStyle:"none", marginTop:".3rem" }}>
            {items.map((item,j)=><li key={j} className="acc-li">{item}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MISSIONS
───────────────────────────────────────── */
function Missions() {
  const phases = [
    { label:"Phase 01 — Amont", title:"Planification & Études", items:["Élaboration de plans directeurs","Diagnostics techniques (DIAG)","Études de faisabilité technico-économiques","Études de conception et avant-projets","Optimisation des dossiers d'appel d'offres","Contrôle et visa des études d'exécution"] },
    { label:"Phase 02 — Réalisation", title:"Exécution & Mise en Service", items:["Pilotage et supervision des travaux (OPC, DET)","Coordination et gestion des interfaces multi-lots","Réception FAT (usine) et SAT (site)","Commissioning et mise en service","Assistance au démarrage et à l'exploitation","Projets de mise en conformité & revamping"] },
  ];
  const specs = [
    { n:"01", title:"Électricité HTB · HTA · BT", body:"Postes de transformation, tableaux TGBT, boucles HTA et distribution BT industrielle." },
    { n:"02", title:"Automatisme & Instrumentation", body:"Systèmes DCS/PLC, boucles de régulation, instrumentation de process industriel." },
    { n:"03", title:"Protection Incendie", body:"Détection, extinction automatique — sprinklers, CO₂, FM-200 — conformité APSAD / NFPA." },
    { n:"04", title:"CCTV & Sécurité", body:"Vidéoprotection industrielle et urbaine, intégrée aux centres de supervision." },
  ];
  return (
    <section id="missions" style={{ background:`linear-gradient(180deg, ${C.navyD} 0%, ${C.navy} 100%)`, position:"relative" }}>
      <ElectricCables flip />
      <div style={{ padding:"9rem 5vw", maxWidth:1500, margin:"0 auto", position:"relative", zIndex:1 }}>
        <Eyebrow text="Nos Missions" />
        <h2 className="f-display reveal" style={{ fontSize:"clamp(3rem,4.5vw,5.5rem)", lineHeight:.92, marginTop:"1.5rem", color:C.white }}>
          PRÉSENTS À<br/>
          <span style={{ color:C.bronze }}>CHAQUE PHASE</span><br/>
          <span style={{ color:C.mist }}>DU PROJET</span>
        </h2>
        <div className="reveal miss-phases" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:1, background:C.rule, marginTop:"4rem" }}>
          {phases.map((p,i)=>(
            <div key={i} className="mphase" style={{ background:C.navyD, padding:"3rem 2.5rem" }}>
              <div className="mphase-line" />
              <div className="f-mono" style={{ fontSize:".62rem", letterSpacing:".26em", textTransform:"uppercase", color:C.bronze, marginBottom:"1rem" }}>{p.label}</div>
              <h3 className="f-display" style={{ fontSize:"2rem", color:C.white, marginBottom:"1.5rem" }}>{p.title}</h3>
              <ul style={{ listStyle:"none" }}>
                {p.items.map((item,j)=>(
                  <li key={j} style={{ padding:".62rem 0", borderBottom:`1px solid ${C.rule}`, fontSize:".88rem", color:C.dim, display:"flex", alignItems:"center", gap:12 }}>
                    <span style={{ width:14, height:1, background:`${C.bronze}50`, flexShrink:0, display:"block" }} />{item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="reveal specs-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, background:C.rule, marginTop:1 }}>
          {specs.map((s,i)=>(
            <div key={i} className="spec-card" style={{ background:C.navyD, padding:"2.4rem 2rem" }}>
              <div className="f-display" style={{ fontSize:"3.5rem", lineHeight:1, color:C.bronze, opacity:.15 }}>{s.n}</div>
              <div className="f-display" style={{ fontSize:"1.3rem", color:C.white, margin:".8rem 0 .5rem" }}>{s.title}</div>
              <div style={{ fontSize:".84rem", lineHeight:1.7, color:C.dim }}>{s.body}</div>
              <div className="spec-bar" />
            </div>
          ))}
        </div>
      </div>
      <ElectricCables accent />
    </section>
  );
}

/* ─────────────────────────────────────────
   PROJETS
───────────────────────────────────────── */
const PROJS = [
  { n:"01", client:"OCP Group", name:"Hall de Stockage Automatisé", desc:"Supervision et coordination complète d'un projet d'automatisation des systèmes de stockage industriel. Planning opérationnel, coordination des entreprises, suivi de mise en service.", tag:"Automatisation · Supervision", budget:"56", dur:"18" },
  { n:"02", client:"OCP Group", name:"Programme Détection & Protection Incendie", desc:"Étude et installation d'un programme de grande envergure couvrant les installations de détection et protection incendie du Groupe OCP sur plusieurs sites industriels en parallèle.", tag:"Fire Safety · Conformité NFPA", budget:"240", dur:"24" },
  { n:"03", client:"OCP Group", name:"Réhabilitation des Installations Incendie", desc:"Réhabilitation complète des systèmes de protection incendie. Remplacement et modernisation des équipements, intégration aux systèmes de supervision centralisée.", tag:"Réhabilitation · Installation", budget:"212", dur:"24" },
  { n:"04", client:"Client Industriel", name:"Poste Électrique MT/BT", desc:"Gestion multi-métiers d'un projet de mise en conformité de la distribution énergétique industrielle. Études, fourniture, installation, coordination réglementaire.", tag:"Électricité Industrielle · MT/BT", budget:"34", dur:"14" },
  { n:"05", client:"Ville de Fès", name:"Vidéoprotection Urbaine — Fès", desc:"Conception et déploiement d'un système complet de vidéoprotection urbaine. Caméras intelligentes, centres de supervision, liaisons sécurisées.", tag:"CCTV · Sécurisation Urbaine", budget:"8", dur:"12" },
];

function Projects() {
  return (
    <section id="projets" style={{ background:`linear-gradient(180deg, ${C.navy} 0%, ${C.navyDD} 100%)`, position:"relative" }}>
      <ElectricCables flip />
      <div style={{ padding:"9rem 5vw", maxWidth:1500, margin:"0 auto", position:"relative", zIndex:1 }}>
        <Eyebrow text="Références" />
        <h2 className="f-display reveal" style={{ fontSize:"clamp(3rem,4.5vw,5.5rem)", lineHeight:.92, marginTop:"1.5rem", color:C.white }}>
          PROJETS RÉALISÉS<br/>
          <span style={{ color:C.bronze }}>PAR NOTRE</span><br/>
          <span style={{ color:C.mist }}>ÉQUIPE</span>
        </h2>
        <p className="reveal" style={{ marginTop:"1rem", fontSize:".86rem", color:C.dim, maxWidth:560, lineHeight:1.8 }}>
          Ces références ont été réalisées par les membres fondateurs de SII dans le cadre de leurs missions antérieures.
        </p>
        <div style={{ marginTop:"4rem", borderTop:`1px solid ${C.rule}` }}>
          {PROJS.map((p,i)=><ProjRow key={i} {...p} idx={i} />)}
        </div>
      </div>
      <ElectricCables accent />
    </section>
  );
}

function ProjRow({ n, client, name, desc, tag, budget, dur, idx }) {
  const [hov, setHov] = useState(false);
  return (
    <div className={`reveal proj-row d${Math.min(idx,4)}`}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ display:"grid", gridTemplateColumns:"3rem 1fr 200px", gap:"2.5rem", alignItems:"start", padding:`2.5rem 0`, borderBottom:`1px solid ${C.rule}` }}>
      <span className="f-mono" style={{ fontSize:".6rem", letterSpacing:".2em", color:C.ghost, paddingTop:".3rem" }}>{n}</span>
      <div>
        <div className="f-mono" style={{ fontSize:".6rem", letterSpacing:".2em", textTransform:"uppercase", color:C.bronze, marginBottom:".5rem" }}>{client}</div>
        <h3 className="f-display" style={{ fontSize:"clamp(1.4rem,2vw,2.2rem)", color:hov?C.bronze:C.white, lineHeight:1.05, marginBottom:".7rem", transition:"color .3s" }}>{name}</h3>
        <p style={{ fontSize:".87rem", color:C.dim, lineHeight:1.75, maxWidth:520 }}>{desc}</p>
        <div style={{ marginTop:"1rem", maxWidth:360 }}>
          <div className="media-slot" style={{ aspectRatio:"16/6", padding:"1.5rem" }}>
            <span style={{ fontSize:"1rem", opacity:.2 }}>📷</span>
            <span className="f-mono" style={{ fontSize:".54rem", letterSpacing:".18em", textTransform:"uppercase", color:C.ghost }}>Photo du projet</span>
          </div>
        </div>
        <span className="f-mono" style={{ display:"inline-block", marginTop:".8rem", padding:".28rem .8rem", border:`1px solid ${C.rule}`, fontSize:".58rem", letterSpacing:".14em", textTransform:"uppercase", color:C.dim }}>{tag}</span>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:"1.5rem", alignItems:"flex-end", paddingTop:".4rem" }}>
        <div style={{ textAlign:"right" }}>
          <div className="f-display" style={{ fontSize:"2.4rem", lineHeight:1, color:hov?C.bronze:C.white, transition:"color .3s" }}>{budget} <span style={{ fontSize:"1rem", color:C.bronze }}>MMAD</span></div>
          <div className="f-mono" style={{ fontSize:".56rem", letterSpacing:".15em", textTransform:"uppercase", color:C.dim, marginTop:".2rem" }}>Valeur</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div className="f-display" style={{ fontSize:"2.4rem", lineHeight:1, color:C.steelL }}>{dur} <span style={{ fontSize:"1rem", color:C.steelL }}>mois</span></div>
          <div className="f-mono" style={{ fontSize:".56rem", letterSpacing:".15em", textTransform:"uppercase", color:C.dim, marginTop:".2rem" }}>Durée</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   CONTACT
───────────────────────────────────────── */
function Contact() {
  return (
    <section id="contact" style={{ background:`linear-gradient(180deg, ${C.navyDD} 0%, ${C.navy} 100%)`, position:"relative" }}>
      <ElectricCables flip />
      <div style={{ padding:"9rem 5vw", maxWidth:1500, margin:"0 auto", position:"relative", zIndex:1 }}>
        <div className="contact-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6rem", alignItems:"start" }}>
          <div>
            <Eyebrow text="Travaillons ensemble" />
            <h2 className="f-display reveal" style={{ fontSize:"clamp(3rem,4.5vw,5.5rem)", lineHeight:.92, marginTop:"1.5rem", color:C.white }}>
              VOTRE PROJET<br/>
              <span style={{ color:C.bronze }}>MÉRITE</span><br/>
              UNE ÉQUIPE<br/>
              <span style={{ color:C.mist }}>À SA MESURE</span>
            </h2>
            <p className="reveal" style={{ marginTop:"2.5rem", fontSize:".97rem", lineHeight:1.85, color:C.dim }}>
              Que vous soyez en phase d'étude, en cours d'appel d'offres ou en recherche d'un partenaire technique, l'équipe SII est disponible pour analyser votre besoin et vous proposer une réponse adaptée.
            </p>
            <div style={{ marginTop:"3rem", opacity:.18 }}>
              <GearLogo size={80} color={C.bronze} speed={20} />
            </div>
          </div>
          <div className="reveal">
            <div style={{ background:`${C.navyL}22`, padding:"3rem", borderTop:`3px solid ${C.bronze}`, border:`1px solid ${C.rule}`, borderTopColor:C.bronze }}>
              <h3 className="f-display" style={{ fontSize:"2rem", color:C.white, marginBottom:"2.5rem" }}>NOUS CONTACTER</h3>
              {[
                { lbl:"Email professionnel", val:<a href="mailto:contact@si-i.ma" style={{ color:C.bronze, textDecoration:"none" }}>contact@si-i.ma</a> },
                { lbl:"Site web", val:<a href="http://www.si-i.ma" style={{ color:C.bronze, textDecoration:"none" }}>www.si-i.ma</a> },
                { lbl:"Domaines", val:<span style={{ fontSize:".88rem", lineHeight:1.65, color:C.dim }}>Électricité · Automatisme · Instrumentation<br/>Fire Safety · CCTV</span> },
                { lbl:"Marchés", val:"Maroc — Afrique" },
              ].map((l,i,arr)=>(
                <div key={i} style={{ display:"flex", flexDirection:"column", gap:".3rem", padding:"1.2rem 0", borderBottom:i<arr.length-1?`1px solid ${C.rule}`:"none" }}>
                  <span className="f-mono" style={{ fontSize:".56rem", letterSpacing:".24em", textTransform:"uppercase", color:C.ghost }}>{l.lbl}</span>
                  <span style={{ fontSize:".95rem", color:C.offwhite }}>{l.val}</span>
                </div>
              ))}
              <a href="mailto:contact@si-i.ma" className="btn-primary" style={{ marginTop:"2.5rem" }}>
                Envoyer un message →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   FOOTER
───────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background:C.navyDD, borderTop:`1px solid ${C.rule}`, padding:"2rem 5vw", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"1rem" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        <GearLogo size={32} color={C.bronze} speed={20} />
        <div>
          <div className="f-mono" style={{ fontSize:".7rem", letterSpacing:".26em", textTransform:"uppercase", color:C.dim }}>SII</div>
          <div className="f-mono" style={{ fontSize:".54rem", color:C.ghost }}>Société d'Ingénierie et d'Innovation</div>
        </div>
      </div>
      <span style={{ fontStyle:"italic", fontSize:".88rem", color:C.ghost }}>Construisons l'avenir, projet par projet.</span>
      <span className="f-mono" style={{ fontSize:".58rem", letterSpacing:".12em", color:C.ghost }}>© 2026 SII — Tous droits réservés</span>
    </footer>
  );
}

/* ─────────────────────────────────────────
   APP
───────────────────────────────────────── */
export default function App() {
  useReveal();
  return (
    <>
      <style>{G}</style>
      <ProgressBar />
      <Nav />
      <Hero />
      <About />
      <Services />
      <Missions />
      <Projects />
      <Contact />
      <Footer />
    </>
  );
}
