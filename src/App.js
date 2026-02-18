import { useState, useEffect } from "react";
import logoGear from "./logo-engrenage-rotating.png";

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   PALETTE –bleu ciel clair + marine logo
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const C = {
  // Fonds clairs –bleu ciel industriel
  sky:       "#EEF3F8",   // fond principal
  skyL:      "#F5F8FC",   // fond très clair
  skyM:      "#DDE8F2",   // bleu ciel moyen
  skyD:      "#C8D9EC",   // bleu ciel foncé

  // Marine (du logo #28283C)
  navy:      "#28283C",
  navyL:     "#3C3C50",
  navyLL:    "#50506A",
  steel:     "#64788C",
  steelL:    "#8496A8",
  mist:      "#B4B4C8",

  // Blanc
  white:     "#FFFFFF",

  // Textes
  text:      "#1E1E2E",   // texte principal
  textM:     "#3C3C50",   // texte secondaire
  textL:     "rgba(40,40,60,.55)", // texte léger

  // Accent
  bronze:    "#B8966A",
  bronzeL:   "#D4B48A",

  // Règles
  rule:      "rgba(40,40,60,.1)",
  ruleB:     "rgba(184,150,106,.3)",
};

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   CSS GLOBAL
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:ital,wght@0,300;0,400;0,500;1,300&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    background: ${C.sky};
    color: ${C.text};
    font-family: 'Barlow', system-ui, sans-serif;
    font-weight: 300;
    line-height: 1.7;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: ${C.skyM}; }
  ::-webkit-scrollbar-thumb { background: ${C.bronze}; }

  .f-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: .04em; }
  .f-mono    { font-family: 'DM Mono', monospace; }

  /* ────────────────────
   ”€â”€ Animations â”€â”
──────────────────── */
  @keyframes gearSpin   { to { transform: rotate(360deg); } }
  @keyframes fadeUp     { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
  @keyframes blink      { 0%,100%{opacity:1} 50%{opacity:.15} }
  @keyframes cableDash  { to { stroke-dashoffset: -48; } }
  @keyframes cableGlow  { 0%,100%{opacity:.35} 50%{opacity:.8} }
  @keyframes spark      { 0%,86%,100%{opacity:0} 89%,96%{opacity:1} 92%{opacity:.3} }
  @keyframes nacelleUp  { 0%,100%{transform:translateY(0)} 40%{transform:translateY(-55px)} 50%,54%{transform:translateY(-55px);opacity:0} 56%{transform:translateY(0);opacity:0} 62%{opacity:1} }
  @keyframes craneSwing { 0%,100%{transform:rotate(-1.5deg)} 50%{transform:rotate(1.5deg)} }
  @keyframes gridDrift  { to { background-position: 60px 60px; } }
  @keyframes cloudDrift { from{transform:translateX(0)} to{transform:translateX(60px)} }
  @keyframes floatUp    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

  .gear-spin { animation: gearSpin 16s linear infinite; transform-origin: 50% 50%; }

  /* Reveal au scroll */
  .reveal {
    opacity: 0; transform: translateY(28px);
    transition: opacity 1s cubic-bezier(.16,1,.3,1), transform 1s cubic-bezier(.16,1,.3,1);
  }
  .reveal.show { opacity:1; transform:translateY(0); }
  .d1{transition-delay:.1s} .d2{transition-delay:.22s}
  .d3{transition-delay:.34s} .d4{transition-delay:.46s}

  /* Nav links */
  .nav-a {
    font-family:'DM Mono'; font-size:.64rem; letter-spacing:.2em;
    text-transform:uppercase; color:${C.textL}; text-decoration:none;
    position:relative; transition:color .3s; padding-bottom:3px;
  }
  .nav-a::after {
    content:''; position:absolute; bottom:0; left:0;
    width:0; height:1px; background:${C.bronze};
    transition:width .4s cubic-bezier(.16,1,.3,1);
  }
  .nav-a:hover { color:${C.navy}; }
  .nav-a:hover::after { width:100%; }

  /* Pillar */
  .pillar-card {
    padding:1.8rem 1.6rem; background:${C.white};
    border:1px solid ${C.rule}; border-top:2px solid transparent;
    transition:border-top-color .3s, box-shadow .3s;
  }
  .pillar-card:hover { border-top-color:${C.bronze}; box-shadow:0 4px 24px rgba(40,40,60,.08); }

  /* Spec */
  .spec-card { position:relative; overflow:hidden; transition:box-shadow .3s, background .3s; }
  .spec-card:hover { background:${C.white} !important; box-shadow:0 4px 20px rgba(40,40,60,.07); }
  .spec-bar { position:absolute; bottom:0; left:0; width:0; height:2px; background:${C.navy}; transition:width .5s cubic-bezier(.16,1,.3,1); }
  .spec-card:hover .spec-bar { width:100%; }

  /* Phase */
  .mphase { position:relative; overflow:hidden; transition:background .4s, box-shadow .3s; }
  .mphase:hover { background:${C.white} !important; box-shadow:0 4px 20px rgba(40,40,60,.07); }
  .mphase-line { position:absolute; top:0; left:0; width:3px; height:0; background:${C.navy}; transition:height .6s cubic-bezier(.16,1,.3,1); }
  .mphase:hover .mphase-line { height:100%; }

  /* Accordion */
  .acc-li {
    padding:.6rem 0; border-bottom:1px solid ${C.rule};
    font-size:.88rem; color:${C.textL};
    display:flex; align-items:flex-start; gap:10px; line-height:1.55;
    transition:color .3s; list-style:none;
  }
  .acc-li:hover { color:${C.navy}; }
  .acc-li::before { content:''; display:block; flex-shrink:0; width:4px; height:4px; border-radius:50%; background:${C.bronze}; margin-top:.55rem; }
  .acc-li:last-child { border-bottom:none; }

  /* Project row */
  .proj-row { transition:padding-left .5s cubic-bezier(.16,1,.3,1), background .3s; cursor:default; }
  .proj-row:hover { padding-left:1.4rem !important; background:${C.white} !important; }

  /* Buttons */
  .btn-primary {
    display:inline-block; padding:1rem 2.4rem;
    background:${C.navy}; color:${C.white};
    font-family:'DM Mono'; font-size:.7rem; letter-spacing:.22em;
    text-transform:uppercase; text-decoration:none; font-weight:500;
    transition:background .3s, transform .2s; border:none; cursor:pointer;
  }
  .btn-primary:hover { background:${C.navyL}; transform:translateY(-2px); }

  .btn-outline {
    display:inline-flex; align-items:center; gap:10px;
    padding:.72rem 1.6rem; border:1px solid ${C.navy}40;
    color:${C.navy}; font-family:'DM Mono'; font-size:.68rem;
    letter-spacing:.2em; text-transform:uppercase; text-decoration:none;
    transition:background .3s, gap .4s; background:transparent;
  }
  .btn-outline:hover { background:${C.navy}08; gap:18px; }

  /* Media slot */
  .media-slot {
    width:100%;
    background: repeating-linear-gradient(
      45deg, ${C.skyM}, ${C.skyM} 8px, ${C.skyD} 8px, ${C.skyD} 16px
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
    .hero-kpis{ grid-template-columns:repeat(2,1fr) !important; }
  }
  @media(max-width:600px){
    .nav-links-desk{ display:none !important; }
    .specs-grid,.pillars-grid{ grid-template-columns:1fr !important; }
    footer{ flex-direction:column; text-align:center; }
  }
`;

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   LOGO ANIMÉ –Image PNG qui tourne
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function AnimatedLogo({ size = 50, speed = 12 }) {
  return (
    <div style={{ width:size, height:size, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <img
        src={logoGear}
        alt="SII Logo"
        style={{
          width:size,
          height:size,
          objectFit:"contain",
          animation:`gearSpin ${speed}s linear infinite`,
          transformOrigin:"center center",
        }}
      />
    </div>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   CÂBLES ÉLECTRIQUES (séparateurs sections)
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function ElectricCables({ flip = false, dark = false }) {
  const col = dark ? C.white : C.navy;
  const colA = C.bronze;
  const y1 = flip ? 55 : 18;
  const y2 = flip ? 30 : 42;
  const y3 = flip ? 10 : 60;
  return (
    <svg viewBox="0 0 1400 72" preserveAspectRatio="none"
      style={{ position:"absolute", [flip?"top":"bottom"]:0, left:0, width:"100%", height:72, pointerEvents:"none", zIndex:10 }}>
      <path d={`M0 ${y1} Q350 ${y1-14} 700 ${y1} Q1050 ${y1+14} 1400 ${y1}`}
        fill="none" stroke={col} strokeWidth="1" strokeDasharray="22,12" opacity=".18"
        style={{ animation:"cableDash 4.5s linear infinite" }} />
      <path d={`M0 ${y2} Q350 ${y2+16} 700 ${y2} Q1050 ${y2-16} 1400 ${y2}`}
        fill="none" stroke={colA} strokeWidth="2" strokeDasharray="14,10" opacity=".55"
        style={{ animation:"cableDash 2.8s linear infinite, cableGlow 3s ease-in-out infinite" }} />
      <path d={`M0 ${y3} Q350 ${y3-10} 700 ${y3} Q1050 ${y3+10} 1400 ${y3}`}
        fill="none" stroke={col} strokeWidth="2.5" strokeDasharray="28,16" opacity=".1"
        style={{ animation:"cableDash 5.5s linear infinite" }} />
      <g style={{ animation:"spark 6s ease-in-out infinite" }}>
        <polyline points={`110,${y2-4} 118,${y2+9} 110,${y2+12} 120,${y2+28}`}
          fill="none" stroke="rgba(255,200,30,.95)" strokeWidth="2.2" strokeLinejoin="round" />
      </g>
      <g style={{ animation:"spark 6s ease-in-out 3s infinite" }}>
        <polyline points={`1290,${y2-4} 1298,${y2+9} 1290,${y2+12} 1300,${y2+28}`}
          fill="none" stroke="rgba(255,200,30,.95)" strokeWidth="2.2" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   GRUE + PYLÔNES (hero background)
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function CraneScene() {
  return (
    <svg viewBox="0 0 1100 620" preserveAspectRatio="xMidYMid slice"
      style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", opacity:.12 }}>

      {/* Nuages stylisés */}
      <g style={{ animation:"cloudDrift 25s linear infinite alternate" }}>
        <ellipse cx="200" cy="80" rx="80" ry="28" fill={C.steelL} opacity=".4" />
        <ellipse cx="260" cy="68" rx="55" ry="22" fill={C.steelL} opacity=".3" />
      </g>
      <g style={{ animation:"cloudDrift 35s linear infinite alternate-reverse" }}>
        <ellipse cx="800" cy="60" rx="70" ry="24" fill={C.steelL} opacity=".3" />
        <ellipse cx="750" cy="52" rx="45" ry="18" fill={C.steelL} opacity=".25" />
      </g>

      {/* Tour grue */}
      <rect x="500" y="80" width="20" height="520" fill={C.navy} rx="2" opacity=".6"/>
      {[120,200,280,360,440].map(y=>(
        <g key={y}>
          <line x1="500" y1={y} x2="520" y2={y+44} stroke={C.navy} strokeWidth="1.5" opacity=".4"/>
          <line x1="520" y1={y} x2="500" y2={y+44} stroke={C.navy} strokeWidth="1.5" opacity=".4"/>
        </g>
      ))}

      {/* Bras (swing) */}
      <g style={{ transformOrigin:"510px 88px", animation:"craneSwing 8s ease-in-out infinite" }}>
        <rect x="240" y="80" width="550" height="14" fill={C.navy} rx="2" opacity=".7"/>
        <line x1="510" y1="94" x2="320" y2="94" stroke={C.navy} strokeWidth="2.5" opacity=".5"/>
        <line x1="320" y1="94" x2="295" y2="118" stroke={C.navy} strokeWidth="2" opacity=".4"/>
        <line x1="510" y1="82" x2="720" y2="50" stroke={C.navy} strokeWidth="2" opacity=".45"/>
        <line x1="510" y1="82" x2="788" y2="82" stroke={C.navy} strokeWidth="1.5" opacity=".35"/>
        <rect x="762" y="80" width="40" height="22" fill={C.navy} rx="2" opacity=".6"/>
        {/* Nacelle animée */}
        <g style={{ animation:"nacelleUp 10s ease-in-out infinite" }}>
          <line x1="700" y1="94" x2="700" y2="260" stroke={C.navy} strokeWidth="2" strokeDasharray="5,5" opacity=".6"/>
          <rect x="678" y="260" width="44" height="22" fill={C.navy} rx="3" opacity=".75"/>
          <rect x="686" y="253" width="8" height="10" fill={C.navy} rx="1.5" opacity=".6"/>
          <rect x="698" y="253" width="8" height="10" fill={C.navy} rx="1.5" opacity=".6"/>
          <circle cx="700" cy="272" r="5" fill={C.navy} opacity=".65"/>
          <line x1="700" y1="277" x2="700" y2="287" stroke={C.navy} strokeWidth="2" opacity=".55"/>
          <line x1="700" y1="281" x2="693" y2="287" stroke={C.navy} strokeWidth="1.5" opacity=".45"/>
          <line x1="700" y1="281" x2="707" y2="287" stroke={C.navy} strokeWidth="1.5" opacity=".45"/>
        </g>
      </g>

      {/* Pylônes */}
      {[60, 960].map(x=>(
        <g key={x}>
          <line x1={x+12} y1="300" x2={x+12} y2="600" stroke={C.navy} strokeWidth="4" opacity=".5"/>
          <line x1={x}    y1="300" x2={x+24} y2="300" stroke={C.navy} strokeWidth="4" opacity=".5"/>
          <line x1={x+4}  y1="332" x2={x+20} y2="332" stroke={C.navy} strokeWidth="3" opacity=".4"/>
          <line x1={x+8}  y1="362" x2={x+16} y2="362" stroke={C.navy} strokeWidth="2" opacity=".3"/>
          <line x1={x+12} y1="300" x2={x-16} y2="430" stroke={C.navy} strokeWidth="2" opacity=".3"/>
          <line x1={x+12} y1="300" x2={x+40} y2="430" stroke={C.navy} strokeWidth="2" opacity=".3"/>
        </g>
      ))}

      {/* Câbles entre pylônes */}
      {[315, 338, 360].map((y,i)=>(
        <path key={i}
          d={`M72 ${y} Q550 ${y+22} 972 ${y}`}
          fill="none" stroke={C.navy}
          strokeWidth={i===1?"2.5":"1.5"}
          strokeDasharray="20,10"
          opacity={i===1?".45":".25"}
          style={{ animation:`cableDash ${3+i*.8}s linear infinite` }}
        />
      ))}

      {/* Éclairs */}
      <g style={{ animation:"spark 8s ease-in-out infinite" }}>
        <polyline points="72,330 81,346 70,350 83,370" fill="none" stroke="rgba(255,200,30,.8)" strokeWidth="3" strokeLinejoin="round"/>
      </g>
      <g style={{ animation:"spark 8s ease-in-out 4s infinite" }}>
        <polyline points="972,330 981,346 970,350 983,370" fill="none" stroke="rgba(255,200,30,.8)" strokeWidth="3" strokeLinejoin="round"/>
      </g>

      {/* Sol */}
      <rect x="0" y="598" width="1100" height="22" fill={C.navy} opacity=".12" rx="2"/>
    </svg>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   PROGRESS BAR
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
  return <div style={{ position:"fixed", top:0, left:0, zIndex:9999, height:"2px", width:`${w}%`, background:`linear-gradient(90deg,${C.navy},${C.bronze})`, transition:"width .08s linear", pointerEvents:"none" }} />;
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   HOOK REVEAL
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add("show"); }),
      { threshold: 0.07, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   EYEBROW
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function Eyebrow({ text, light = false }) {
  return (
    <div className="reveal f-mono" style={{
      fontSize:".62rem", letterSpacing:".3em", textTransform:"uppercase",
      color: light ? C.bronzeL : C.bronze,
      marginBottom:"1.2rem", display:"flex", alignItems:"center", gap:12,
    }}>
      <span style={{ display:"inline-block", width:20, height:1, background: light ? C.bronzeL : C.bronze, flexShrink:0 }} />
      {text}
    </div>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   NAV
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:900, height:76, padding:"0 5vw",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      background: scrolled ? "rgba(238,243,248,.96)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.rule}` : "none",
      transition:"background .5s, border-color .5s",
    }}>
      {/* Logo animé + texte */}
      <a href="#accueil" style={{ display:"flex", alignItems:"center", gap:14, textDecoration:"none" }}>
        <AnimatedLogo size={32} color={C.navy} speed={14} />
        <div>
          <div className="f-mono" style={{ fontSize:".76rem", letterSpacing:".28em", textTransform:"uppercase", color:C.navy, lineHeight:1 }}>SII</div>
          <div className="f-mono" style={{ fontSize:".55rem", letterSpacing:".07em", color:C.textL, marginTop:2 }}>Société d'Ingénierie et d'Innovation</div>
        </div>
      </a>

      <ul className="nav-links-desk" style={{ display:"flex", gap:"2.2rem", listStyle:"none", alignItems:"center" }}>
        {[["À Propos","#apropos"],["Services","#services"],["Missions","#missions"],["Références","#projets"],["Équipe","#equipe"],["2026","#chiffres"]].map(([l,h])=>(
          <li key={h}><a href={h} className="nav-a">{l}</a></li>
        ))}
        <li>
          <a href="#contact" className="btn-primary" style={{ padding:".5rem 1.4rem", fontSize:".64rem" }}>Contact</a>
        </li>
      </ul>
    </nav>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   HERO
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function Hero() {
  return (
    <section id="accueil" style={{
      minHeight:"100vh", position:"relative", overflow:"hidden",
      display:"flex", alignItems:"center",
      background:`linear-gradient(135deg, ${C.skyL} 0%, ${C.sky} 40%, ${C.skyM} 100%)`,
    }}>
      {/* Grille subtile */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:`repeating-linear-gradient(0deg,${C.rule} 0 1px,transparent 1px 60px),repeating-linear-gradient(90deg,${C.rule} 0 1px,transparent 1px 60px)`,
        backgroundSize:"60px 60px", opacity:.4, animation:"gridDrift 35s linear infinite" }} />

      {/* Grue SVG */}
      <CraneScene />

      {/* Dégradé pour lisibilité texte */}
      <div style={{ position:"absolute", inset:0,
        background:`linear-gradient(to right, ${C.skyL}F5 38%, ${C.sky}CC 65%, transparent 100%)`,
        zIndex:2 }} />

      {/* Câbles haut et bas */}
      <ElectricCables flip />
      <ElectricCables />

      {/* Contenu */}
      <div style={{ position:"relative", zIndex:4, padding:"120px 5vw 80px", maxWidth:780 }}>

        {/* Badge */}
        <div className="f-mono" style={{
          display:"inline-flex", alignItems:"center", gap:8,
          padding:".4rem 1rem", marginBottom:"2.5rem",
          border:`1px solid ${C.ruleB}`,
          fontSize:".62rem", letterSpacing:".2em", textTransform:"uppercase", color:C.bronze,
          background:C.white,
          animation:"fadeUp .8s cubic-bezier(.16,1,.3,1) .3s both",
          boxShadow:"0 2px 12px rgba(40,40,60,.06)",
        }}>
          <span style={{ width:5, height:5, borderRadius:"50%", background:C.bronze, animation:"blink 2.5s ease infinite" }} />
          EIA · Électricité · Instrumentation · Automatisme
        </div>

        {/* Logo animé –grand format */}
        <div style={{ marginBottom:"2.5rem", animation:"fadeUp .9s cubic-bezier(.16,1,.3,1) .45s both" }}>
          <AnimatedLogo size={56} color={C.navy} speed={12} />
        </div>

        {/* Titre */}
        <h1 className="f-display" style={{
          fontSize:"clamp(4rem,8vw,9.5rem)",
          lineHeight:.9, color:C.navy, marginBottom:0,
          animation:"fadeUp 1s cubic-bezier(.16,1,.3,1) .6s both",
        }}>
          L'INGÉNIERIE<br/>
          <span style={{ color:C.bronze }}>INDUSTRIELLE</span><br/>
          <span style={{ color:C.steel }}>AU SERVICE</span><br/>
          DU TERRAIN
        </h1>

        {/* Charte */}
        <div style={{
          marginTop:"2.5rem",
          borderLeft:`3px solid ${C.bronze}`,
          paddingLeft:"1.4rem",
          animation:"fadeUp .8s cubic-bezier(.16,1,.3,1) .85s both",
        }}>
          <p style={{ fontSize:"1.05rem", color:C.textM, fontStyle:"italic", fontWeight:300 }}>
            Construisons l'avenir, projet par projet.
          </p>
        </div>

        {/* Description */}
        <p style={{
          marginTop:"1.8rem", fontSize:".98rem", lineHeight:1.85,
          color:C.textL, maxWidth:500,
          animation:"fadeUp .8s cubic-bezier(.16,1,.3,1) 1s both",
        }}>
          SII accompagne les industriels marocains dans leurs projets complexes –de l'étude à la mise en service –avec la rigueur et la précision que chaque installation mérite.
        </p>

        {/* CTAs */}
        <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap", marginTop:"2.5rem", animation:"fadeUp .8s cubic-bezier(.16,1,.3,1) 1.15s both" }}>
          <a href="#contact" className="btn-primary">Discuter de votre projet</a>
          <a href="#services" className="btn-outline">Nos services â†’</a>
        </div>

        {/* KPIs */}
        <div className="hero-kpis" style={{
          display:"grid", gridTemplateColumns:"repeat(4,1fr)",
          marginTop:"4rem", borderTop:`1px solid ${C.rule}`,
          background:C.white, boxShadow:"0 2px 24px rgba(40,40,60,.06)",
          animation:"fadeUp .8s cubic-bezier(.16,1,.3,1) 1.3s both",
        }}>
          {[["20+","Ans d'exp."],["550+","MMAD"],["5","Références"],["2024","Fondation"]].map(([v,l],i)=>(
            <div key={i} style={{ padding:"1.4rem 1rem", borderRight:i<3?`1px solid ${C.rule}`:"none" }}>
              <div className="f-display" style={{ fontSize:"2.8rem", lineHeight:1, color:C.navy }}>{v}</div>
              <div className="f-mono" style={{ fontSize:".58rem", letterSpacing:".16em", textTransform:"uppercase", color:C.textL, marginTop:".3rem", lineHeight:1.4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   À PROPOS
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function About() {
  const pillars = [
    { icon:"âš™", name:"Maîtrise EIA", body:"Électricité industrielle, instrumentation et automatisme –couverture complète des disciplines." },
    { icon:"â—ˆ", name:"Méthodes Éprouvées", body:"Processus alignés sur les standards internationaux de gestion de projets industriels." },
    { icon:"â—Ž", name:"Ancrage Local", body:"Connaissance approfondie du tissu industriel marocain et de ses acteurs clés." },
    { icon:"â—‡", name:"Engagement Direct", body:"Interlocuteurs techniques impliqués à chaque étape, sans intermédiaires." },
  ];
  return (
    <section id="apropos" style={{ background:C.white, position:"relative" }}>
      <div style={{ position:"absolute", right:"-4rem", top:"4rem", opacity:.04, pointerEvents:"none" }}>
        <AnimatedLogo size={300} color={C.navy} speed={60} />
      </div>
      <ElectricCables flip />
      <div style={{ padding:"9rem 5vw", maxWidth:1500, margin:"0 auto", position:"relative", zIndex:1 }}>
        <div className="about-grid" style={{ display:"grid", gridTemplateColumns:"4fr 6fr", gap:"7rem", alignItems:"start" }}>
          <div className="about-sticky" style={{ position:"sticky", top:100 }}>
            <Eyebrow text="À Propos de SII" />
            <h2 className="f-display reveal" style={{ fontSize:"clamp(3rem,4.5vw,5.5rem)", lineHeight:.92, color:C.navy, marginTop:"1.5rem" }}>
              UNE ÉQUIPE<br/>
              <span style={{ color:C.bronze }}>CHEVRONNÉE</span><br/>
              UNE STRUCTURE<br/>
              <span style={{ color:C.steel }}>DÉDIÉE</span>
            </h2>
            <div style={{ marginTop:"3rem", opacity:.15 }}>
              <AnimatedLogo size={80} color={C.navy} speed={18} />
            </div>
          </div>
          <div>
            <div className="reveal" style={{ marginBottom:"2.5rem" }}>
              <div className="media-slot" style={{ aspectRatio:"16/7", padding:"3rem" }}>
                <span style={{ fontSize:"1.5rem", opacity:.25 }}>◫</span>
                <span className="f-mono" style={{ fontSize:".58rem", letterSpacing:".2em", textTransform:"uppercase", color:C.textL }}>Photo de l'équipe SII</span>
              </div>
            </div>
            <p className="reveal" style={{ fontSize:"1rem", lineHeight:1.9, color:C.textM, marginBottom:"1.8rem" }}>
              <strong style={{ color:C.navy, fontWeight:500 }}>SII –Société d'Ingénierie et d'Innovation</strong> –est une entreprise marocaine créée en 2024, spécialisée dans l'électricité industrielle, l'instrumentation et l'automatisme. Si la structure est récente, l'expertise qui la fonde est profondément ancrée dans le terrain.
            </p>
            <p className="reveal" style={{ fontSize:"1rem", lineHeight:1.9, color:C.textM, marginBottom:"1.8rem" }}>
              Ses fondateurs cumulent plus de vingt ans d'expérience opérationnelle sur des projets industriels d'envergure au Maroc, bâtie dans des environnements exigeants, auprès de grands donneurs d'ordres.
            </p>
            <div className="reveal" style={{ borderLeft:`3px solid ${C.bronze}`, paddingLeft:"1.4rem", background:`${C.bronze}08`, padding:"1.5rem 2rem 1.5rem 1.8rem", margin:"2rem 0" }}>
              <p style={{ fontSize:".95rem", lineHeight:1.8, color:C.textM, margin:0 }}>
                <strong style={{ color:C.navy, fontWeight:500 }}>Pourquoi SII ?</strong> Une équipe technique directement impliquée, de la première étude jusqu'à la mise en service –sans dilution dans une grande structure.
              </p>
            </div>
            <div className="reveal pillars-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginTop:"2rem" }}>
              {pillars.map((p,i)=>(
                <div key={i} className="pillar-card">
                  <div style={{ fontSize:"1.4rem", marginBottom:".7rem" }}>{p.icon}</div>
                  <div className="f-display" style={{ fontSize:"1.4rem", color:C.navy, marginBottom:".4rem" }}>{p.name}</div>
                  <div style={{ fontSize:".84rem", color:C.textL, lineHeight:1.65 }}>{p.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ElectricCables />
    </section>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   SERVICES
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const SERVICES = [
  { num:"01", title:"Engineering & Solutions Contractuelles", desc:"Études sur mesure, du concept à l'exécution", body:"SII réalise des études pluridisciplinaires intégrées, en forfait ou en régie. Chaque prestation est construite autour des contraintes techniques et budgétaires du client.", items:["CCTV & vidéosurveillance industrielle et urbaine","Électricité industrielle –HTB, HTA, BT","Automatisme & Instrumentation –DCS/PLC","Fire Fighting & Fire Alarm","Études pluridisciplinaires intégrées","Solutions contractuelles –forfait & régie","Travaux neufs et construction industrielle"] },
  { num:"02", title:"Supervision & Gestion de Projets", desc:"Coordonner, suivre, livrer dans les règles", body:"Nos équipes assurent la coordination des corps de métier, le contrôle des délais et des budgets, avec un reporting clair et régulier auprès du maître d'ouvrage.", items:["Supervision de travaux –OPC, DET","Management HSE","Management de programmes complexes","Coordination multi-lots","Contrôle des coûts et planning","Reporting et tableaux de bord client"] },
  { num:"03", title:"Ingénierie & Ressources Techniques", desc:"Les bons profils, au bon moment", body:"SII met à disposition des clients des ressources techniques qualifiées, capables d'intervenir en assistance technique intégrée ou en autonomie dans l'équipe projet.", items:["Ingénieurs d'études et de chantier EIA","Techniciens spécialisés","Dessinateurs CAO / DAO","Directeurs de construction","Préparateurs méthodes","Profils junior à senior"] },
  { num:"04", title:"Conseil & Assistance Technique", desc:"Un regard technique indépendant", body:"Notre pôle conseil accompagne les directions techniques dans leurs arbitrages –choix de solutions, sélection de prestataires, optimisation d'un DCE.", items:["Conseil technique en dépense contrôlée","Assistance technique intégrée","Experts métier EIA","PMO mis à disposition","Études de faisabilité","Diagnostics et audits techniques"] },
  { num:"05", title:"Mécanique & Travaux Industriels", desc:"Piping, montage et travaux en régie", body:"SII intervient sur les chantiers industriels pour les travaux mécaniques â piping, montage dâéquipements, structures â avec des équipes qualifiées disponibles en régie ou forfait.", items:["Travaux de piping industriel","Montage mécanique d'équipements","Travaux en régie","Chaudronnerie et structures métalliques","Maintenance et mise en conformité mécanique"] },
];

function Services() {
  const [open, setOpen] = useState(0);
  return (
    <section id="services" style={{ background:C.sky, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", left:"-3rem", bottom:"-3rem", opacity:.04, pointerEvents:"none" }}>
        <AnimatedLogo size={260} color={C.navy} speed={55} />
      </div>
      <ElectricCables flip />
      <div style={{ padding:"9rem 5vw", maxWidth:1500, margin:"0 auto", position:"relative", zIndex:1 }}>
        <div className="srv-intro" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4rem", alignItems:"end", marginBottom:"4rem" }}>
          <div>
            <Eyebrow text="Nos Domaines d'Intervention" />
            <h2 className="f-display reveal" style={{ fontSize:"clamp(3rem,4.5vw,5.5rem)", lineHeight:.92, color:C.navy, marginTop:"1.5rem" }}>
              SAVOIR-FAIRE<br/>
              <span style={{ color:C.bronze }}>COMPLET</span><br/>
              <span style={{ color:C.steel }}>DE L'ÉTUDE</span><br/>
              AU CHANTIER
            </h2>
          </div>
          <p className="reveal" style={{ fontSize:".97rem", lineHeight:1.85, color:C.textM }}>
            SII intervient sur <strong style={{ color:C.navy }}>l'ensemble de la chaîne de projet industriel</strong> –des études préliminaires jusqu'à la supervision des travaux et la mise en service.
          </p>
        </div>
        <div className="reveal" style={{ borderTop:`1px solid ${C.rule}` }}>
          {SERVICES.map((s,i)=>(
            <AccItem key={i} {...s} isOpen={open===i} onToggle={()=>setOpen(open===i?-1:i)} />
          ))}
        </div>
      </div>
      <ElectricCables />
    </section>
  );
}

function AccItem({ num, title, desc, body, items, isOpen, onToggle }) {
  return (
    <div style={{ borderBottom:`1px solid ${C.rule}` }}>
      <div onClick={onToggle} style={{ display:"grid", gridTemplateColumns:"3rem 1fr 2.2rem", alignItems:"center", gap:"2rem", padding:"1.8rem 0", cursor:"pointer" }}>
        <span className="f-mono" style={{ fontSize:".6rem", letterSpacing:".2em", color:C.textL }}>{num}</span>
        <span className="f-display" style={{ fontSize:"clamp(1.4rem,2vw,2.2rem)", color:isOpen?C.bronze:C.navy, transition:"color .3s" }}>{title}</span>
        <div style={{ width:32, height:32, border:`1px solid ${isOpen?C.bronze:C.rule}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transform:isOpen?"rotate(45deg)":"none", background:isOpen?C.bronze:"transparent", transition:"all .5s cubic-bezier(.16,1,.3,1)" }}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke={isOpen?C.white:C.navy} strokeWidth="1.5" strokeLinecap="round"/></svg>
        </div>
      </div>
      <div style={{ maxHeight:isOpen?900:0, overflow:"hidden", transition:"max-height .65s cubic-bezier(.16,1,.3,1)" }}>
        <div className="acc-inner" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"3rem", padding:"0 0 2.5rem 5rem" }}>
          <div>
            <strong style={{ display:"block", fontSize:"1.05rem", fontWeight:400, color:C.navy, marginBottom:".8rem" }}>{desc}</strong>
            <p style={{ fontSize:".9rem", lineHeight:1.85, color:C.textM }}>{body}</p>
            <div style={{ marginTop:"1.8rem" }}>
              <div className="media-slot" style={{ aspectRatio:"16/8", padding:"2rem" }}>
                <span style={{ fontSize:"1.2rem", opacity:.2 }}>◫</span>
                <span className="f-mono" style={{ fontSize:".56rem", letterSpacing:".18em", textTransform:"uppercase", color:C.textL }}>Photo –{title}</span>
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

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   MISSIONS
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function Missions() {
  const phases = [
    { label:"Phase 01 – Amont", title:"Planification & Études", items:["Élaboration de plans directeurs","Diagnostics techniques (DIAG)","Études de faisabilité technico-économiques","Études de conception et avant-projets","Optimisation des dossiers d'appel d'offres","Contrôle et visa des études d'exécution"] },
    { label:"Phase 02 – Réalisation", title:"Exécution & Mise en Service", items:["Pilotage et supervision des travaux (OPC, DET)","Coordination et gestion des interfaces multi-lots","Réception FAT (usine) et SAT (site)","Commissioning et mise en service","Assistance au démarrage et à l'exploitation","Projets de mise en conformité & revamping"] },
  ];
  const specs = [
    { n:"01", title:"Électricité HTB · HTA · BT", body:"Postes de transformation, tableaux TGBT, boucles HTA et distribution BT industrielle." },
    { n:"02", title:"Automatisme & Instrumentation", body:"Systèmes DCS/PLC, boucles de régulation, instrumentation de process industriel." },
    { n:"03", title:"Protection Incendie", body:"Détection, extinction automatique –sprinklers, COâ‚‚, FM-200 –conformité APSAD / NFPA." },
    { n:"04", title:"CCTV & Sécurité", body:"Vidéoprotection industrielle et urbaine, intégrée aux centres de supervision." },
  ];
  return (
    <section id="missions" style={{ background:C.skyM, position:"relative" }}>
      <ElectricCables flip />
      <div style={{ padding:"9rem 5vw", maxWidth:1500, margin:"0 auto", position:"relative", zIndex:1 }}>
        <Eyebrow text="Nos Missions" />
        <h2 className="f-display reveal" style={{ fontSize:"clamp(3rem,4.5vw,5.5rem)", lineHeight:.92, marginTop:"1.5rem", color:C.navy }}>
          PRÉSENTS À<br/>
          <span style={{ color:C.bronze }}>CHAQUE PHASE</span><br/>
          <span style={{ color:C.steel }}>DU PROJET</span>
        </h2>
        <div className="reveal miss-phases" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:1, background:C.rule, marginTop:"4rem" }}>
          {phases.map((p,i)=>(
            <div key={i} className="mphase" style={{ background:C.white, padding:"3rem 2.5rem" }}>
              <div className="mphase-line" />
              <div className="f-mono" style={{ fontSize:".62rem", letterSpacing:".26em", textTransform:"uppercase", color:C.bronze, marginBottom:"1rem" }}>{p.label}</div>
              <h3 className="f-display" style={{ fontSize:"2rem", color:C.navy, marginBottom:"1.5rem" }}>{p.title}</h3>
              <ul style={{ listStyle:"none" }}>
                {p.items.map((item,j)=>(
                  <li key={j} style={{ padding:".62rem 0", borderBottom:`1px solid ${C.rule}`, fontSize:".88rem", color:C.textM, display:"flex", alignItems:"center", gap:12 }}>
                    <span style={{ width:14, height:1, background:`${C.bronze}60`, flexShrink:0, display:"block" }} />{item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="reveal specs-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, background:C.rule, marginTop:1 }}>
          {specs.map((s,i)=>(
            <div key={i} className="spec-card" style={{ background:C.sky, padding:"2.4rem 2rem" }}>
              <div className="f-display" style={{ fontSize:"3.5rem", lineHeight:1, color:C.navy, opacity:.1 }}>{s.n}</div>
              <div className="f-display" style={{ fontSize:"1.3rem", color:C.navy, margin:".8rem 0 .5rem" }}>{s.title}</div>
              <div style={{ fontSize:".84rem", lineHeight:1.7, color:C.textM }}>{s.body}</div>
              <div className="spec-bar" />
            </div>
          ))}
        </div>
      </div>
      <ElectricCables />
    </section>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   PROJETS
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const PROJS = [
  { n:"01", client:"OCP Group", name:"Hall de Stockage Automatisé", desc:"Supervision et coordination complète d'un projet d'automatisation des systèmes de stockage industriel.", tag:"Automatisation · Supervision", budget:"56", dur:"18" },
  { n:"02", client:"OCP Group", name:"Programme Détection & Protection Incendie", desc:"Étude et installation d'un programme de grande envergure couvrant les installations de détection et protection incendie du Groupe OCP sur plusieurs sites en parallèle.", tag:"Fire Safety · Conformité NFPA", budget:"240", dur:"24" },
  { n:"03", client:"OCP Group", name:"Réhabilitation des Installations Incendie", desc:"Réhabilitation complète des systèmes de protection incendie sur plusieurs sites OCP. Remplacement, modernisation, intégration à la supervision centralisée.", tag:"Réhabilitation · Installation", budget:"212", dur:"24" },
  { n:"04", client:"Client Industriel", name:"Poste Électrique MT/BT", desc:"Gestion multi-métiers d'un projet de mise en conformité de la distribution énergétique industrielle. Études, fourniture, installation, coordination réglementaire.", tag:"Électricité Industrielle · MT/BT", budget:"34", dur:"14" },
  { n:"05", client:"Ville de Fès", name:"Vidéoprotection Urbaine –Fès", desc:"Conception et déploiement d'un système complet de vidéoprotection urbaine. Caméras intelligentes, centres de supervision, liaisons sécurisées.", tag:"CCTV · Sécurisation Urbaine", budget:"8", dur:"12" },
];

function Projects() {
  return (
    <section id="projets" style={{ background:C.white, position:"relative" }}>
      <ElectricCables flip />
      <div style={{ padding:"9rem 5vw", maxWidth:1500, margin:"0 auto", position:"relative", zIndex:1 }}>
        <Eyebrow text="Références" />
        <h2 className="f-display reveal" style={{ fontSize:"clamp(3rem,4.5vw,5.5rem)", lineHeight:.92, marginTop:"1.5rem", color:C.navy }}>
          PROJETS RÉALISÉS<br/>
          <span style={{ color:C.bronze }}>PAR NOTRE</span><br/>
          <span style={{ color:C.steel }}>ÉQUIPE</span>
        </h2>
        <p className="reveal" style={{ marginTop:"1rem", fontSize:".86rem", color:C.textL, maxWidth:560, lineHeight:1.8 }}>
          Ces références ont été réalisées par les membres fondateurs de SII dans le cadre de leurs missions antérieures.
        </p>
        <div style={{ marginTop:"4rem", borderTop:`1px solid ${C.rule}` }}>
          {PROJS.map((p,i)=><ProjRow key={i} {...p} idx={i} />)}
        </div>
      </div>
      <ElectricCables />
    </section>
  );
}

function ProjRow({ n, client, name, desc, tag, budget, dur, idx }) {
  const [hov, setHov] = useState(false);
  return (
    <div className={`reveal proj-row d${Math.min(idx,4)}`}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ display:"grid", gridTemplateColumns:"3rem 1fr 200px", gap:"2.5rem", alignItems:"start", padding:`2.5rem 0`, borderBottom:`1px solid ${C.rule}` }}>
      <span className="f-mono" style={{ fontSize:".6rem", letterSpacing:".2em", color:C.textL, paddingTop:".3rem" }}>{n}</span>
      <div>
        <div className="f-mono" style={{ fontSize:".6rem", letterSpacing:".2em", textTransform:"uppercase", color:C.bronze, marginBottom:".5rem" }}>{client}</div>
        <h3 className="f-display" style={{ fontSize:"clamp(1.4rem,2vw,2.2rem)", color:hov?C.bronze:C.navy, lineHeight:1.05, marginBottom:".7rem", transition:"color .3s" }}>{name}</h3>
        <p style={{ fontSize:".87rem", color:C.textM, lineHeight:1.75, maxWidth:520 }}>{desc}</p>
        <div style={{ marginTop:"1rem", maxWidth:360 }}>
          <div className="media-slot" style={{ aspectRatio:"16/6", padding:"1.5rem" }}>
            <span style={{ fontSize:"1rem", opacity:.2 }}>◫</span>
            <span className="f-mono" style={{ fontSize:".54rem", letterSpacing:".18em", textTransform:"uppercase", color:C.textL }}>Photo du projet</span>
          </div>
        </div>
        <span className="f-mono" style={{ display:"inline-block", marginTop:".8rem", padding:".28rem .8rem", border:`1px solid ${C.rule}`, fontSize:".58rem", letterSpacing:".14em", textTransform:"uppercase", color:C.textL }}>{tag}</span>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:"1.5rem", alignItems:"flex-end", paddingTop:".4rem" }}>
        <div style={{ textAlign:"right" }}>
          <div className="f-display" style={{ fontSize:"2.4rem", lineHeight:1, color:hov?C.bronze:C.navy, transition:"color .3s" }}>{budget} <span style={{ fontSize:"1rem", color:C.bronze }}>MMAD</span></div>
          <div className="f-mono" style={{ fontSize:".56rem", letterSpacing:".15em", textTransform:"uppercase", color:C.textL, marginTop:".2rem" }}>Valeur</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div className="f-display" style={{ fontSize:"2.4rem", lineHeight:1, color:C.steel }}>{dur} <span style={{ fontSize:"1rem", color:C.steel }}>mois</span></div>
          <div className="f-mono" style={{ fontSize:".56rem", letterSpacing:".15em", textTransform:"uppercase", color:C.textL, marginTop:".2rem" }}>Durée</div>
        </div>
      </div>
    </div>
  );
}


/* ─────────────────────────────────────────
   ÉQUIPE
───────────────────────────────────────── */
function Team() {
  const comite = ["Farhat Nawfal", "Elmoussaid Rachid"];
  const supports = [
    { role:"Assistante de direction", name:"Hind Elmahmoudi" },
    { role:"Resp. Achat Logistique", name:"Abdelhakim DAR" },
    { role:"Resp. RH", name:"Faiza Aoual" },
    { role:"Resp. Financier", name:"Omar Eloudghiri" },
  ];
  const bureau = [
    { role:"Resp. Bureau d\'Étude", name:"Mehdi Bairaha" },
    { role:"Resp. EIA", name:"Mehdi Bairaha" },
    { role:"Resp. Mécanique", name:"Imad Alami" },
    { role:"Resp. Génie Civil", name:"Abdelilah Aitmanzar" },
  ];
  const direction = [
    { role:"Resp. Control Projet", name:"Hamza Farhat" },
    { role:"Resp. Construction", name:"Tarik Samik" },
    { role:"Resp. Cellule Préparation", name:"Aziz Idrissi" },
  ];
  const qhse = { role:"Responsable QHSE", name:"Aya Hachfi" };

  const Card = ({ role, name, accent=false }) => (
    <div style={{ background:accent?C.navy:C.white, border:`1px solid ${C.rule}`, padding:"1rem 1.3rem", borderTop:`2px solid ${accent?C.bronze:C.steel}` }}>
      <div className="f-mono" style={{ fontSize:".54rem", letterSpacing:".18em", textTransform:"uppercase", color:accent?C.bronzeL:C.textL, marginBottom:".3rem" }}>{role}</div>
      <div className="f-display" style={{ fontSize:"1.05rem", color:accent?C.white:C.navy }}>{name}</div>
    </div>
  );

  return (
    <section id="equipe" style={{ background:C.skyL, position:"relative" }}>
      <ElectricCables flip />
      <div style={{ padding:"9rem 5vw", maxWidth:1500, margin:"0 auto", position:"relative", zIndex:1 }}>
        <Eyebrow text="Notre Organisation" />
        <h2 className="f-display reveal" style={{ fontSize:"clamp(3rem,4.5vw,5.5rem)", lineHeight:.92, marginTop:"1.5rem", color:C.navy }}>
          UNE ÉQUIPE<br/>
          <span style={{ color:C.bronze }}>D\'EXPERTS</span><br/>
          <span style={{ color:C.steel }}>À VOTRE SERVICE</span>
        </h2>
        <div className="reveal" style={{ marginTop:"4rem" }}>
          <div className="f-mono" style={{ fontSize:".6rem", letterSpacing:".24em", textTransform:"uppercase", color:C.bronze, marginBottom:"1rem" }}>Comité de Direction</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,auto)", gap:1, justifyContent:"start" }}>
            {comite.map((n,i)=>(
              <div key={i} style={{ background:C.navy, padding:"1rem 2rem", borderTop:`2px solid ${C.bronze}` }}>
                <div className="f-display" style={{ fontSize:"1.1rem", color:C.white }}>{n}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="reveal" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 220px", gap:"2rem", marginTop:"3rem" }}>
          <div>
            <div className="f-mono" style={{ fontSize:".58rem", letterSpacing:".2em", textTransform:"uppercase", color:C.textL, marginBottom:"1rem", borderBottom:`1px solid ${C.rule}`, paddingBottom:".5rem" }}>Fonctions Support</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {supports.map((s,i)=><Card key={i} role={s.role} name={s.name} />)}
            </div>
          </div>
          <div>
            <div className="f-mono" style={{ fontSize:".58rem", letterSpacing:".2em", textTransform:"uppercase", color:C.textL, marginBottom:"1rem", borderBottom:`1px solid ${C.rule}`, paddingBottom:".5rem" }}>Bureau d\'Étude</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {bureau.map((s,i)=><Card key={i} role={s.role} name={s.name} />)}
            </div>
          </div>
          <div>
            <div className="f-mono" style={{ fontSize:".58rem", letterSpacing:".2em", textTransform:"uppercase", color:C.textL, marginBottom:"1rem", borderBottom:`1px solid ${C.rule}`, paddingBottom:".5rem" }}>Direction Technique</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {direction.map((s,i)=><Card key={i} role={s.role} name={s.name} />)}
            </div>
          </div>
          <div>
            <div className="f-mono" style={{ fontSize:".58rem", letterSpacing:".2em", textTransform:"uppercase", color:C.textL, marginBottom:"1rem", borderBottom:`1px solid ${C.rule}`, paddingBottom:".5rem" }}>QHSE</div>
            <Card role={qhse.role} name={qhse.name} accent />
          </div>
        </div>
      </div>
      <ElectricCables />
    </section>
  );
}

/* ─────────────────────────────────────────
   CHIFFRES 2026
───────────────────────────────────────── */
const CHIFFRES_2026 = [
  { statut:"Commande", client:"JESA", projet:"TSP Adaptation JFC 1,2 et 4 – Électricité & Instrumentation", duree:"7 mois", montant:"7.000.000" },
  { statut:"Commande", client:"OCP", projet:"Aménagement Zone PUMA – Réhabilitation locaux SAEDM", duree:"2 mois", montant:"210.000" },
  { statut:"Commande", client:"MK Énergie", projet:"Safi Existing Site MP1 MT/BT SUBSTATION – Lot Électricité", duree:"11 mois", montant:"22.343.300" },
  { statut:"Commande", client:"ONDOAN/JESA", projet:"Construction poste MT/BT & CFO/CFA Casernes Jorf", duree:"6 mois", montant:"14.342.200" },
  { statut:"Commande", client:"OFAS", projet:"Usine TSP SAFI 3 – Lot Électricité & Instrumentation", duree:"12 mois", montant:"36.640.000" },
  { statut:"Opportunité", client:"JESA", projet:"Convoyeurs d\'alimentation TSP adaptation – Lot Instrumentation", duree:"4 mois", montant:"9.041.000" },
  { statut:"Opportunité", client:"SGTM", projet:"Platform SPH-PSA – Électricité & Instrumentation 2 postes MT/BT", duree:"18 mois", montant:"21.145.000" },
];

function Chiffres() {
  return (
    <section id="chiffres" style={{ background:C.navy, position:"relative" }}>
      <ElectricCables flip dark />
      <div style={{ padding:"9rem 5vw", maxWidth:1500, margin:"0 auto", position:"relative", zIndex:1 }}>
        <Eyebrow text="Activité en cours" />
        <h2 className="f-display reveal" style={{ fontSize:"clamp(3rem,4.5vw,5.5rem)", lineHeight:.92, marginTop:"1.5rem", color:C.white }}>
          CHIFFRES<br/>
          <span style={{ color:C.bronze }}>2026</span>
        </h2>
        <div className="reveal" style={{ marginTop:"4rem", overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:".84rem" }}>
            <thead>
              <tr style={{ borderBottom:`2px solid ${C.bronze}40` }}>
                {["Statut","Client","Projet","Durée","Montant HT (MAD)"].map((h,i)=>(
                  <th key={i} className="f-mono" style={{ padding:".8rem 1rem", textAlign:i>0?"left":"center", fontSize:".58rem", letterSpacing:".2em", textTransform:"uppercase", color:C.mist, fontWeight:400, whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CHIFFRES_2026.map((r,i)=>(
                <tr key={i} style={{ borderBottom:`1px solid rgba(255,255,255,.06)`, transition:"background .2s" }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.04)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{ padding:"1rem", textAlign:"center" }}>
                    <span style={{ display:"inline-block", padding:".2rem .7rem", fontSize:".58rem", letterSpacing:".14em", textTransform:"uppercase", fontFamily:"\'DM Mono\'", background:r.statut==="Commande"?`${C.bronze}22`:`${C.steelL}15`, color:r.statut==="Commande"?C.bronze:C.steelL, border:`1px solid ${r.statut==="Commande"?C.bronze+"44":C.steelL+"33"}` }}>{r.statut}</span>
                  </td>
                  <td style={{ padding:"1rem", color:C.white, fontWeight:500, whiteSpace:"nowrap" }}>{r.client}</td>
                  <td style={{ padding:"1rem", color:"rgba(255,255,255,.65)", lineHeight:1.55 }}>{r.projet}</td>
                  <td style={{ padding:"1rem", color:C.steelL, whiteSpace:"nowrap", fontFamily:"\'DM Mono\'", fontSize:".78rem" }}>{r.duree}</td>
                  <td style={{ padding:"1rem", textAlign:"right", fontFamily:"\'DM Mono\'", fontSize:".84rem", color:C.bronzeL, whiteSpace:"nowrap" }}>{r.montant}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="reveal" style={{ display:"flex", justifyContent:"flex-end", gap:"2rem", marginTop:"2rem", flexWrap:"wrap" }}>
          {[
            { label:"Total Carnet de commande", value:"80.535.500 MAD" },
            { label:"Total Opportunités", value:"30.186.000 MAD" },
          ].map((t,i)=>(
            <div key={i} style={{ textAlign:"right", padding:"1.5rem 2rem", border:`1px solid ${i===0?C.bronze+"55":C.steel+"44"}`, background:i===0?"rgba(184,150,106,.08)":"rgba(100,120,140,.08)" }}>
              <div className="f-mono" style={{ fontSize:".58rem", letterSpacing:".2em", textTransform:"uppercase", color:C.mist, marginBottom:".5rem" }}>{t.label}</div>
              <div className="f-display" style={{ fontSize:"1.8rem", color:i===0?C.bronze:C.steelL }}>{t.value}</div>
            </div>
          ))}
        </div>
      </div>
      <ElectricCables dark />
    </section>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   CONTACT
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function Contact() {
  return (
    <section id="contact" style={{ background:C.sky, position:"relative" }}>
      <ElectricCables flip />
      <div style={{ padding:"9rem 5vw", maxWidth:1500, margin:"0 auto", position:"relative", zIndex:1 }}>
        <div className="contact-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6rem", alignItems:"start" }}>
          <div>
            <Eyebrow text="Travaillons ensemble" />
            <h2 className="f-display reveal" style={{ fontSize:"clamp(3rem,4.5vw,5.5rem)", lineHeight:.92, marginTop:"1.5rem", color:C.navy }}>
              VOTRE PROJET<br/>
              <span style={{ color:C.bronze }}>MÉRITE</span><br/>
              UNE ÉQUIPE<br/>
              <span style={{ color:C.steel }}>À SA MESURE</span>
            </h2>
            <p className="reveal" style={{ marginTop:"2.5rem", fontSize:".97rem", lineHeight:1.85, color:C.textM }}>
              Que vous soyez en phase d'étude, en cours d'appel d'offres ou en recherche d'un partenaire technique, l'équipe SII est disponible pour analyser votre besoin et vous proposer une réponse adaptée.
            </p>
            <div style={{ marginTop:"3rem", opacity:.12 }}>
              <AnimatedLogo size={64} color={C.navy} speed={20} />
            </div>
          </div>
          <div className="reveal">
            <div style={{ background:C.white, padding:"3rem", borderTop:`3px solid ${C.navy}`, boxShadow:"0 4px 32px rgba(40,40,60,.08)" }}>
              <h3 className="f-display" style={{ fontSize:"2rem", color:C.navy, marginBottom:"2.5rem" }}>NOUS CONTACTER</h3>
              {[
                { lbl:"Email professionnel", val:<a href="mailto:contact@si-i.ma" style={{ color:C.bronze, textDecoration:"none" }}>contact@si-i.ma</a> },
                { lbl:"Site web", val:<a href="http://www.si-i.ma" style={{ color:C.bronze, textDecoration:"none" }}>www.si-i.ma</a> },
                { lbl:"Domaines", val:<span style={{ fontSize:".88rem", lineHeight:1.65, color:C.textM }}>Électricité · Automatisme · Instrumentation<br/>Fire Safety · CCTV</span> },
                { lbl:"Marchés", val:"Maroc –Afrique" },
              ].map((l,i,arr)=>(
                <div key={i} style={{ display:"flex", flexDirection:"column", gap:".3rem", padding:"1.2rem 0", borderBottom:i<arr.length-1?`1px solid ${C.rule}`:"none" }}>
                  <span className="f-mono" style={{ fontSize:".56rem", letterSpacing:".24em", textTransform:"uppercase", color:C.textL }}>{l.lbl}</span>
                  <span style={{ fontSize:".95rem", color:C.text }}>{l.val}</span>
                </div>
              ))}
              <a href="mailto:contact@si-i.ma" className="btn-primary" style={{ marginTop:"2.5rem" }}>
                Envoyer un message â†’
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   FOOTER –marine comme le logo
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function Footer() {
  return (
    <footer style={{
      background: C.navy,
      padding:"2.5rem 5vw",
      display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"1rem",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        {/* Logo animé blanc sur fond marine */}
        <AnimatedLogo size={30} color={C.white} speed={16} />
        <div>
          <div className="f-mono" style={{ fontSize:".7rem", letterSpacing:".26em", textTransform:"uppercase", color:"rgba(255,255,255,.75)" }}>SII</div>
          <div className="f-mono" style={{ fontSize:".54rem", color:"rgba(255,255,255,.4)" }}>Société d'Ingénierie et d'Innovation</div>
        </div>
      </div>
      <span style={{ fontStyle:"italic", fontSize:".88rem", color:"rgba(255,255,255,.38)", fontFamily:"'Barlow'" }}>
        Construisons l'avenir, projet par projet.
      </span>
      <span className="f-mono" style={{ fontSize:".58rem", letterSpacing:".12em", color:"rgba(255,255,255,.25)" }}>
        © 2026 SII –Tous droits réservés
      </span>
    </footer>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   APP
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
      <Team />
      <Chiffres />
      <Contact />
      <Footer />
    </>
  );
}
