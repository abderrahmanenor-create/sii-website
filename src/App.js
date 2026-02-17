import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────
   PALETTE — béton + acier + bronze
   Extraite fidèlement du logo SII
───────────────────────────────────────── */
const C = {
  // Fonds béton
  concrete:  "#1A1A1E",   // béton très sombre
  concrete2: "#222228",   // béton secondaire
  concrete3: "#2E2E36",   // béton moyen
  slab:      "#3A3A44",   // dalle

  // Acier
  steel:     "#64788C",   // acier bleu
  steel2:    "#8496A8",   // acier clair
  ironLight: "#B4BEC8",   // acier pâle

  // Texte
  white:     "#FFFFFF",
  offwhite:  "#E8E6E2",
  dim:       "rgba(232,230,226,0.55)",
  ghost:     "rgba(232,230,226,0.22)",

  // Accent chaud — extrait du logo
  bronze:    "#B8966A",
  bronzeL:   "#D4B48A",
  bronzeD:   "#8C6E48",

  // Règles
  rule:      "rgba(100,120,140,0.18)",
  ruleB:     "rgba(184,150,106,0.25)",
};

/* ─────────────────────────────────────────
   CSS GLOBAL
───────────────────────────────────────── */
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:ital,wght@0,300;0,400;0,500;1,300&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; font-size: 16px; }
  body {
    background: ${C.concrete};
    color: ${C.offwhite};
    font-family: 'Barlow', system-ui, sans-serif;
    font-weight: 300;
    line-height: 1.7;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: ${C.concrete2}; }
  ::-webkit-scrollbar-thumb { background: ${C.bronze}; }

  /* Fonts */
  .f-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: .04em; }
  .f-mono    { font-family: 'DM Mono', monospace; }
  .f-body    { font-family: 'Barlow', sans-serif; }

  /* Animations */
  @keyframes gearSpin    { to { transform: rotate(360deg); } }
  @keyframes fadeUp      { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn      { from { opacity:0; } to { opacity:1; } }
  @keyframes scanline    { 0%,100%{ opacity:.04 } 50%{ opacity:.08 } }
  @keyframes blink       { 0%,100%{ opacity:1 } 50%{ opacity:.15 } }
  @keyframes progressW   { from { width:0; } }
  @keyframes cableDash   { to { stroke-dashoffset: -40; } }
  @keyframes spark       { 0%,88%,100%{ opacity:0 } 90%,96%{ opacity:1 } 93%{ opacity:.3 } }
  @keyframes nacelleUp   { 0%,100%{ transform:translateY(0) } 45%{ transform:translateY(-52px) } 50%,54%{ transform:translateY(-52px); opacity:0 } 55%{ transform:translateY(0); opacity:0 } 60%{ opacity:1 } }
  @keyframes craneSwing  { 0%,100%{ transform:rotate(-1.5deg) } 50%{ transform:rotate(1.5deg) } }
  @keyframes noiseShift  { 0%{ transform:translate(0,0) } 25%{ transform:translate(-1%,-1%) } 50%{ transform:translate(1%,0) } 75%{ transform:translate(0,1%) } 100%{ transform:translate(0,0) } }

  .gear-spin { animation: gearSpin 14s linear infinite; transform-origin: 50% 50%; }

  /* Reveal */
  .reveal {
    opacity: 0; transform: translateY(28px);
    transition: opacity .95s cubic-bezier(.16,1,.3,1),
                transform .95s cubic-bezier(.16,1,.3,1);
  }
  .reveal.show { opacity:1; transform:translateY(0); }
  .d1{ transition-delay:.12s } .d2{ transition-delay:.24s }
  .d3{ transition-delay:.36s } .d4{ transition-delay:.48s }

  /* Noise texture overlay */
  .noise::after {
    content:''; position:absolute; inset:-50%;
    width:200%; height:200%;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    opacity: .028;
    pointer-events: none;
    animation: noiseShift 8s steps(4) infinite;
    z-index: 0;
  }

  /* Lignes de scan */
  .scanlines::before {
    content:''; position:absolute; inset:0; pointer-events:none; z-index:1;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.04) 2px, rgba(0,0,0,.04) 4px);
    animation: scanline 4s ease-in-out infinite;
  }

  /* Nav links */
  .nav-a {
    font-family:'DM Mono'; font-size:.64rem; letter-spacing:.2em;
    text-transform:uppercase; color:${C.dim}; text-decoration:none;
    position:relative; transition:color .3s;
    padding-bottom: 2px;
  }
  .nav-a::after {
    content:''; position:absolute; bottom:0; left:0;
    width:0; height:1px; background:${C.bronze};
    transition:width .4s cubic-bezier(.16,1,.3,1);
  }
  .nav-a:hover { color:${C.offwhite}; }
  .nav-a:hover::after { width:100%; }

  /* Accordion items */
  .acc-li {
    padding:.6rem 0; border-bottom:1px solid rgba(100,120,140,.1);
    font-size:.88rem; color:${C.dim};
    display:flex; align-items:flex-start; gap:10px; line-height:1.55;
    transition:color .3s; list-style:none;
  }
  .acc-li:hover { color:${C.offwhite}; }
  .acc-li::before {
    content:''; display:block; flex-shrink:0;
    width:4px; height:4px; border-radius:50%;
    background:${C.bronze}; margin-top:.55rem;
  }
  .acc-li:last-child { border-bottom:none; }

  /* Phase hover */
  .mphase { position:relative; overflow:hidden; transition:background .4s; }
  .mphase:hover { background:${C.concrete3} !important; }
  .mphase-line {
    position:absolute; top:0; left:0; width:3px; height:0;
    background:${C.bronze};
    transition: height .6s cubic-bezier(.16,1,.3,1);
  }
  .mphase:hover .mphase-line { height:100%; }

  /* Spec card */
  .spec-card { position:relative; overflow:hidden; transition:background .3s; }
  .spec-card:hover { background:${C.concrete3} !important; }
  .spec-underline {
    position:absolute; bottom:0; left:0; width:0; height:2px;
    background:${C.bronze};
    transition: width .5s cubic-bezier(.16,1,.3,1);
  }
  .spec-card:hover .spec-underline { width:100%; }

  /* Project row */
  .proj-row { transition: padding-left .5s cubic-bezier(.16,1,.3,1); cursor:default; }
  .proj-row:hover { padding-left: 1.4rem; }

  /* Pillar */
  .pillar-card {
    padding:1.8rem 1.6rem;
    border-top: 2px solid transparent;
    background: ${C.concrete2};
    transition: border-color .3s, background .3s;
  }
  .pillar-card:hover { border-color:${C.bronze}; background:${C.concrete3}; }

  /* CTA btn */
  .btn-primary {
    display:inline-block; padding:1rem 2.4rem;
    background:${C.bronze}; color:${C.concrete};
    font-family:'DM Mono'; font-size:.7rem; letter-spacing:.22em;
    text-transform:uppercase; text-decoration:none; font-weight:500;
    transition:background .3s, transform .2s;
    border:none; cursor:pointer;
  }
  .btn-primary:hover { background:${C.bronzeL}; transform:translateY(-1px); }

  .btn-outline {
    display:inline-flex; align-items:center; gap:10px;
    padding:.72rem 1.6rem;
    border:1px solid ${C.ruleB};
    color:${C.bronze}; font-family:'DM Mono'; font-size:.68rem;
    letter-spacing:.2em; text-transform:uppercase; text-decoration:none;
    transition:background .3s, border-color .3s, gap .4s;
    background:transparent;
  }
  .btn-outline:hover { background:rgba(184,150,106,.08); border-color:${C.bronze}; gap:18px; }

  /* Media placeholder */
  .media-slot {
    width:100%;
    background: repeating-linear-gradient(
      45deg,
      ${C.concrete2}, ${C.concrete2} 8px,
      ${C.concrete3} 8px, ${C.concrete3} 16px
    );
    border:1px solid ${C.rule};
    display:flex; flex-direction:column;
    align-items:center; justify-content:center; gap:8px;
  }

  @media(max-width:960px){
    .hero-inner,.about-grid,.srv-intro,.contact-grid{ grid-template-columns:1fr !important; }
    .about-sticky{ position:static !important; }
    .miss-phases{ grid-template-columns:1fr !important; }
    .specs-grid{ grid-template-columns:1fr 1fr !important; }
    .acc-inner{ grid-template-columns:1fr !important; }
    .pillars-grid{ grid-template-columns:1fr 1fr !important; }
    .proj-row{ grid-template-columns:auto 1fr !important; }
  }
  @media(max-width:600px){
    .nav-links-desk{ display:none !important; }
    .specs-grid{ grid-template-columns:1fr !important; }
    .pillars-grid{ grid-template-columns:1fr !important; }
    footer{ flex-direction:column; text-align:center; }
  }
`;

/* ─────────────────────────────────────────
   LOGO — engrenage seul, tournant
   Fond transparent, couleurs du logo SII
───────────────────────────────────────── */
function GearLogo({ size = 48, color = C.bronze, speed = 14 }) {
  const cx = size / 2, cy = size / 2;
  const R = size * 0.38;  // rayon anneau externe
  const r = size * 0.22;  // rayon anneau interne
  const rc = size * 0.09; // rayon centre

  // 8 dents
  const teeth = Array.from({ length: 8 }, (_, i) => {
    const a = (i * 45 * Math.PI) / 180;
    const aH = ((i * 45 + 22.5) * Math.PI) / 180;
    const x1 = cx + Math.cos(a) * R;
    const y1 = cy + Math.sin(a) * R;
    const x2 = cx + Math.cos(aH) * (R * 1.28);
    const y2 = cy + Math.sin(aH) * (R * 1.28);
    return { x1, y1, x2, y2 };
  });

  // Points du polygone de l'engrenage
  const pts = [];
  for (let i = 0; i < 8; i++) {
    const a0 = (i * 45 - 10) * Math.PI / 180;
    const a1 = (i * 45 + 10) * Math.PI / 180;
    const a2 = (i * 45 + 12.5) * Math.PI / 180;
    const a3 = (i * 45 + 32.5) * Math.PI / 180;
    const a4 = (i * 45 + 35) * Math.PI / 180;
    pts.push(`${cx + Math.cos(a0) * R},${cy + Math.sin(a0) * R}`);
    pts.push(`${cx + Math.cos(a1) * R},${cy + Math.sin(a1) * R}`);
    pts.push(`${cx + Math.cos(a2) * (R * 1.26)},${cy + Math.sin(a2) * (R * 1.26)}`);
    pts.push(`${cx + Math.cos(a3) * (R * 1.26)},${cy + Math.sin(a3) * (R * 1.26)}`);
    pts.push(`${cx + Math.cos(a4) * R},${cy + Math.sin(a4) * R}`);
  }

  return (
    <svg
      width={size} height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      style={{ display: "block", flexShrink: 0 }}
    >
      <g
        className="gear-spin"
        style={{
          transformOrigin: `${cx}px ${cy}px`,
          animationDuration: `${speed}s`,
        }}
      >
        {/* Corps de l'engrenage */}
        <polygon points={pts.join(" ")} fill={color} opacity="0.95" />
        {/* Anneau intérieur (trou) */}
        <circle cx={cx} cy={cy} r={r} fill={C.concrete} />
        {/* Rayons */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <line key={i}
              x1={cx + Math.cos(rad) * (rc * 1.4)}
              y1={cy + Math.sin(rad) * (rc * 1.4)}
              x2={cx + Math.cos(rad) * (r * 0.82)}
              y2={cy + Math.sin(rad) * (r * 0.82)}
              stroke={color} strokeWidth={size * 0.028} opacity="0.5"
            />
          );
        })}
        {/* Centre */}
        <circle cx={cx} cy={cy} r={rc} fill={color} opacity="0.8" />
        <circle cx={cx} cy={cy} r={rc * 0.45} fill={C.concrete} />
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────
   GRUE + CÂBLES industriels (hero bg)
───────────────────────────────────────── */
function IndustrialBg() {
  return (
    <svg
      viewBox="0 0 900 500"
      style={{
        position:"absolute", inset:0, width:"100%", height:"100%",
        pointerEvents:"none", opacity:.18,
      }}
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Tour */}
      <rect x="420" y="80" width="18" height="410" fill={C.steel} rx="2"/>
      {/* Croix tour */}
      {[120,200,280,360].map(y=>(
        <g key={y}>
          <line x1="420" y1={y} x2="438" y2={y+40} stroke={C.steel} strokeWidth="1.5" opacity=".5"/>
          <line x1="438" y1={y} x2="420" y2={y+40} stroke={C.steel} strokeWidth="1.5" opacity=".5"/>
        </g>
      ))}
      {/* Bras (animé) */}
      <g style={{transformOrigin:"429px 88px", animation:"craneSwing 7s ease-in-out infinite"}}>
        <rect x="200" y="80" width="400" height="12" fill={C.steel} rx="2"/>
        {/* Haubans */}
        <line x1="429" y1="92" x2="260" y2="92" stroke={C.steel} strokeWidth="2" opacity=".6"/>
        <line x1="260" y1="92" x2="240" y2="115" stroke={C.steel} strokeWidth="2" opacity=".6"/>
        <line x1="600" y1="92" x2="560" y2="60" stroke={C.steel} strokeWidth="1.5" opacity=".5"/>
        <line x1="429" y1="88" x2="560" y2="60" stroke={C.steel} strokeWidth="1.5" opacity=".5"/>
        {/* Contrepoids */}
        <rect x="568" y="84" width="32" height="20" fill={C.steel} rx="2" opacity=".7"/>
        {/* Câble + nacelle */}
        <g style={{animation:"nacelleUp 9s ease-in-out infinite"}}>
          <line x1="560" y1="92" x2="560" y2="200" stroke={C.steel} strokeWidth="1.5" strokeDasharray="5,4"/>
          {/* Nacelle */}
          <rect x="544" y="200" width="32" height="18" fill={C.steel} rx="3" opacity=".8"/>
          <rect x="550" y="195" width="6" height="7" fill={C.steel} rx="1" opacity=".6"/>
          <rect x="560" y="195" width="6" height="7" fill={C.steel} rx="1" opacity=".6"/>
          {/* Ouvrier */}
          <circle cx="560" cy="207" r="4" fill={C.steel} opacity=".6"/>
          <line x1="560" y1="211" x2="560" y2="217" stroke={C.steel} strokeWidth="1.5" opacity=".5"/>
        </g>
      </g>

      {/* Câbles électriques */}
      {[340, 360, 380].map((y, i) => (
        <path key={i}
          d={`M0 ${y} Q225 ${y-18} 450 ${y} Q675 ${y+18} 900 ${y}`}
          fill="none" stroke={C.steel}
          strokeWidth={i===1?"2":"1"}
          strokeDasharray="18,9"
          opacity={i===1?".6":".3"}
          style={{animation:`cableDash ${2.5+i*.6}s linear infinite`}}
        />
      ))}

      {/* Pylônes */}
      {[80, 750].map(x=>(
        <g key={x}>
          <line x1={x+10} y1="280" x2={x+10} y2="490" stroke={C.steel} strokeWidth="3" opacity=".5"/>
          <line x1={x} y1="280" x2={x+20} y2="280" stroke={C.steel} strokeWidth="3" opacity=".5"/>
          <line x1={x} y1="310" x2={x+20} y2="310" stroke={C.steel} strokeWidth="2" opacity=".4"/>
          <line x1={x+10} y1="280" x2={x-10} y2="360" stroke={C.steel} strokeWidth="1.5" opacity=".3"/>
          <line x1={x+10} y1="280" x2={x+30} y2="360" stroke={C.steel} strokeWidth="1.5" opacity=".3"/>
        </g>
      ))}

      {/* Éclairs */}
      <g style={{animation:"spark 6s ease-in-out infinite"}}>
        <polyline points="90,355 97,370 88,373 98,392" fill="none" stroke="rgba(255,220,60,.9)" strokeWidth="2.5" strokeLinejoin="round"/>
      </g>
      <g style={{animation:"spark 6s ease-in-out 3s infinite"}}>
        <polyline points="760,350 767,365 758,368 768,387" fill="none" stroke="rgba(255,220,60,.9)" strokeWidth="2.5" strokeLinejoin="round"/>
      </g>

      {/* Sol */}
      <rect x="0" y="488" width="900" height="12" fill={C.steel} opacity=".2"/>
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
  return (
    <div style={{position:"fixed",top:0,left:0,zIndex:9999,height:"2px",width:`${w}%`,background:`linear-gradient(90deg,${C.bronze},${C.bronzeL})`,transition:"width .08s linear",pointerEvents:"none"}} />
  );
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
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

/* ─────────────────────────────────────────
   EYEBROW
───────────────────────────────────────── */
function Eyebrow({ text, light = false }) {
  return (
    <div className="reveal f-mono" style={{
      fontSize:".62rem", letterSpacing:".3em", textTransform:"uppercase",
      color: C.bronze, marginBottom:"1.2rem",
      display:"flex", alignItems:"center", gap:12,
    }}>
      <span style={{display:"inline-block",width:20,height:1,background:C.bronze,flexShrink:0}} />
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
      position:"fixed", top:0, left:0, right:0, zIndex:900,
      height:72, padding:"0 5vw",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      background: scrolled ? "rgba(26,26,30,.96)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.rule}` : "none",
      transition:"background .5s, backdrop-filter .5s, border-color .5s",
    }}>
      {/* Logo engrenage + nom */}
      <a href="#accueil" style={{display:"flex",alignItems:"center",gap:14,textDecoration:"none"}}>
        <GearLogo size={40} color={C.bronze} speed={14} />
        <div>
          <div className="f-mono" style={{fontSize:".76rem",letterSpacing:".28em",textTransform:"uppercase",color:C.offwhite,lineHeight:1}}>SII</div>
          <div className="f-mono" style={{fontSize:".56rem",letterSpacing:".08em",color:C.dim,marginTop:2}}>Société d'Ingénierie et d'Innovation</div>
        </div>
      </a>

      <ul className="nav-links-desk" style={{display:"flex",gap:"2.2rem",listStyle:"none",alignItems:"center"}}>
        {[["À Propos","#apropos"],["Services","#services"],["Missions","#missions"],["Références","#projets"]].map(([l,h])=>(
          <li key={h}><a href={h} className="nav-a">{l}</a></li>
        ))}
        <li>
          <a href="#contact" className="btn-primary" style={{padding:".5rem 1.4rem",fontSize:".64rem"}}>
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
}

/* ─────────────────────────────────────────
   HERO — plein écran, fond chantier
───────────────────────────────────────── */
function Hero() {
  return (
    <section id="accueil" className="noise scanlines" style={{
      minHeight:"100vh", position:"relative", overflow:"hidden",
      display:"flex", alignItems:"center",
      background:`linear-gradient(135deg, ${C.concrete} 0%, ${C.concrete2} 50%, #1E2028 100%)`,
    }}>
      {/* Illustration industrielle SVG */}
      <IndustrialBg />

      {/* Overlay dégradé */}
      <div style={{position:"absolute",inset:0,background:`linear-gradient(to right, rgba(26,26,30,.92) 55%, rgba(26,26,30,.4) 100%)`,zIndex:1}} />

      {/* Placeholder image chantier */}
      <div style={{
        position:"absolute", right:0, top:0, bottom:0, width:"45%",
        background:`linear-gradient(to left, transparent, ${C.concrete})`,
        zIndex:2, display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        <div style={{width:"80%",aspectRatio:"4/3",background:`repeating-linear-gradient(45deg,${C.concrete2},${C.concrete2} 8px,${C.concrete3} 8px,${C.concrete3} 16px)`,border:`1px solid ${C.rule}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8}}>
          <span style={{fontSize:"2rem",opacity:.2}}>📷</span>
          <span className="f-mono" style={{fontSize:".58rem",letterSpacing:".2em",textTransform:"uppercase",color:C.ghost}}>Photo chantier SII</span>
          <span className="f-mono" style={{fontSize:".52rem",color:"rgba(232,230,226,.15)"}}>Remplacer par URL Cloudinary</span>
        </div>
      </div>

      {/* Ligne verticale décorative */}
      <div style={{position:"absolute",left:"55%",top:"8%",bottom:"8%",width:1,background:`linear-gradient(to bottom,transparent,${C.bronze}40,transparent)`,zIndex:3}} />

      {/* Contenu hero */}
      <div style={{position:"relative",zIndex:4,padding:"120px 5vw 80px",maxWidth:740}}>

        {/* Badge */}
        <div className="f-mono reveal" style={{
          display:"inline-flex",alignItems:"center",gap:8,
          padding:".4rem 1rem",marginBottom:"2.5rem",
          border:`1px solid ${C.ruleB}`,
          fontSize:".62rem",letterSpacing:".2em",textTransform:"uppercase",color:C.bronze,
          animation:"fadeUp .8s cubic-bezier(.16,1,.3,1) .3s both",
        }}>
          <span style={{width:5,height:5,borderRadius:"50%",background:C.bronze,animation:"blink 2.5s ease infinite"}} />
          EIA · Électricité · Instrumentation · Automatisme
        </div>

        {/* Titre massif */}
        <h1 className="f-display" style={{
          fontSize:"clamp(4.5rem,9vw,10rem)",
          lineHeight:.92, color:C.white,
          animation:"fadeUp 1s cubic-bezier(.16,1,.3,1) .5s both",
          marginBottom:0,
        }}>
          L'INGÉNIERIE<br/>
          <span style={{color:C.bronze}}>INDUSTRIELLE</span><br/>
          AU SERVICE<br/>
          <span style={{fontStyle:"normal",color:C.steel2}}>DU TERRAIN</span>
        </h1>

        {/* Charte */}
        <div style={{
          marginTop:"2.5rem",
          borderLeft:`3px solid ${C.bronze}`,
          paddingLeft:"1.4rem",
          animation:"fadeUp .8s cubic-bezier(.16,1,.3,1) .8s both",
        }}>
          <p className="f-mono" style={{fontSize:".72rem",letterSpacing:".18em",color:C.bronze,textTransform:"uppercase",marginBottom:".5rem"}}>
            Notre charte
          </p>
          <p style={{fontSize:"1.1rem",color:C.dim,fontStyle:"italic",fontWeight:300}}>
            Construisons l'avenir, projet par projet.
          </p>
        </div>

        {/* Description */}
        <p style={{
          marginTop:"2rem",fontSize:".98rem",lineHeight:1.85,
          color:C.dim,maxWidth:520,
          animation:"fadeUp .8s cubic-bezier(.16,1,.3,1) .95s both",
        }}>
          SII accompagne les industriels marocains dans leurs projets complexes — de l'étude à la mise en service — avec la rigueur et la précision que chaque installation mérite.
        </p>

        {/* CTAs */}
        <div style={{display:"flex",gap:"1rem",flexWrap:"wrap",marginTop:"2.8rem",animation:"fadeUp .8s cubic-bezier(.16,1,.3,1) 1.1s both"}}>
          <a href="#contact" className="btn-primary">Discuter de votre projet</a>
          <a href="#services" className="btn-outline">Nos services →</a>
        </div>

        {/* KPIs ligne */}
        <div style={{
          display:"grid",gridTemplateColumns:"repeat(4,1fr)",
          gap:0,marginTop:"4rem",
          borderTop:`1px solid ${C.rule}`,
          animation:"fadeUp .8s cubic-bezier(.16,1,.3,1) 1.25s both",
        }}>
          {[["20+","Ans d'exp."],["550+","MMAD projets"],["5","Références"],["2024","Fondation"]].map(([v,l],i)=>(
            <div key={i} style={{padding:"1.4rem 1rem",borderRight:i<3?`1px solid ${C.rule}`:"none"}}>
              <div className="f-display" style={{fontSize:"2.8rem",lineHeight:1,color:C.bronze}}>{v}</div>
              <div className="f-mono" style={{fontSize:".58rem",letterSpacing:".16em",textTransform:"uppercase",color:C.dim,marginTop:".3rem",lineHeight:1.4}}>{l}</div>
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
    {icon:"⚙",name:"Maîtrise Technique EIA",body:"Électricité industrielle, instrumentation et automatisme — couverture complète."},
    {icon:"◈",name:"Méthodes Éprouvées",body:"Processus et outils alignés sur les standards internationaux de l'industrie."},
    {icon:"◎",name:"Ancrage Local",body:"Connaissance approfondie du tissu industriel marocain et de ses acteurs."},
    {icon:"◇",name:"Engagement Direct",body:"Interlocuteurs techniques impliqués à chaque étape, sans intermédiaires."},
  ];

  return (
    <section id="apropos" style={{background:C.concrete2,position:"relative"}}>
      {/* Engrenages déco fond */}
      <div style={{position:"absolute",right:"-3rem",top:"5rem",opacity:.05,pointerEvents:"none"}}>
        <GearLogo size={320} color={C.steel} speed={40} />
      </div>

      <div style={{padding:"8rem 5vw",maxWidth:1500,margin:"0 auto",position:"relative",zIndex:1}}>
        <div className="about-grid" style={{display:"grid",gridTemplateColumns:"4fr 6fr",gap:"7rem",alignItems:"start"}}>

          <div className="about-sticky" style={{position:"sticky",top:100}}>
            <Eyebrow text="À Propos de SII" />
            <h2 className="f-display reveal" style={{fontSize:"clamp(3rem,5vw,6rem)",lineHeight:.92,color:C.white,marginTop:"1.5rem"}}>
              UNE ÉQUIPE<br/>
              <span style={{color:C.bronze}}>CHEVRONNÉE</span><br/>
              UNE STRUCTURE<br/>
              <span style={{color:C.steel2}}>DÉDIÉE</span>
            </h2>
            <div style={{marginTop:"3rem",opacity:.18}}>
              <GearLogo size={100} color={C.bronze} speed={18} />
            </div>
          </div>

          <div>
            <div className="reveal" style={{marginBottom:"2.5rem"}}>
              <div className="media-slot" style={{aspectRatio:"16/7",padding:"3rem"}}>
                <span style={{fontSize:"1.5rem",opacity:.2}}>📷</span>
                <span className="f-mono" style={{fontSize:".58rem",letterSpacing:".2em",textTransform:"uppercase",color:C.ghost}}>Photo de l'équipe SII</span>
              </div>
            </div>

            <p className="reveal" style={{fontSize:"1rem",lineHeight:1.9,color:C.dim,marginBottom:"1.8rem"}}>
              <strong style={{color:C.offwhite,fontWeight:500}}>SII — Société d'Ingénierie et d'Innovation</strong> — est une entreprise marocaine créée en 2024, spécialisée dans l'électricité industrielle, l'instrumentation et l'automatisme. Si la structure est récente, l'expertise qui la fonde est profondément ancrée dans le terrain.
            </p>
            <p className="reveal" style={{fontSize:"1rem",lineHeight:1.9,color:C.dim,marginBottom:"1.8rem"}}>
              Ses fondateurs cumulent plus de vingt ans d'expérience opérationnelle sur des projets industriels d'envergure au Maroc — bâtie dans des environnements exigeants, auprès de grands donneurs d'ordres.
            </p>

            <div className="reveal" style={{borderLeft:`3px solid ${C.bronze}`,paddingLeft:"1.4rem",margin:"2.5rem 0",background:`rgba(184,150,106,.04)`,padding:"1.5rem 2rem 1.5rem 1.8rem"}}>
              <p style={{fontSize:".95rem",lineHeight:1.8,color:C.dim,margin:0}}>
                <strong style={{color:C.offwhite,fontWeight:400}}>Pourquoi SII ?</strong> Une structure dédiée, c'est un engagement total dans les projets de nos clients. Pas de dilution dans un grand groupe : une équipe technique directement impliquée, de la première étude jusqu'à la mise en service.
              </p>
            </div>

            <div className="reveal pillars-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:C.rule,marginTop:"2rem"}}>
              {pillars.map((p,i)=>(
                <div key={i} className="pillar-card">
                  <div style={{fontSize:"1.4rem",marginBottom:".7rem"}}>{p.icon}</div>
                  <div className="f-display" style={{fontSize:"1.4rem",color:C.offwhite,marginBottom:".3rem"}}>{p.name}</div>
                  <div style={{fontSize:".85rem",color:C.dim,lineHeight:1.65}}>{p.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   SERVICES
───────────────────────────────────────── */
const SERVICES = [
  {num:"01",title:"Engineering & Solutions Contractuelles",desc:"Études sur mesure, du concept à l'exécution",body:"SII réalise des études pluridisciplinaires intégrées, en forfait ou en régie. Chaque prestation est construite autour des contraintes techniques et budgétaires spécifiques du client.",items:["CCTV & vidéosurveillance industrielle et urbaine","Électricité industrielle — HTB, HTA, BT","Automatisme & Instrumentation — DCS/PLC","Fire Fighting & Fire Alarm","Études pluridisciplinaires intégrées","Solutions contractuelles — forfait & dépense contrôlée","Travaux neufs et construction industrielle"]},
  {num:"02",title:"Supervision & Gestion de Projets",desc:"Coordonner, suivre, livrer dans les règles",body:"Nos équipes assurent la coordination des corps de métier, le contrôle des délais et des budgets, avec un reporting clair et régulier. Sur des projets multi-sites, notre management garantit une vision globale.",items:["Supervision de travaux — OPC, DET","Management HSE","Management de programmes complexes","Coordination multi-lots","Contrôle des coûts et planning","Reporting et tableaux de bord client"]},
  {num:"03",title:"Ingénierie & Ressources Techniques",desc:"Les bons profils, au bon moment",body:"SII met à disposition des clients des ressources techniques qualifiées, capables d'intervenir en assistance technique intégrée ou en autonomie dans l'équipe projet.",items:["Ingénieurs d'études et de chantier EIA","Techniciens spécialisés","Dessinateurs CAO / DAO","Directeurs et responsables de construction","Préparateurs méthodes et planification","Profils junior à senior"]},
  {num:"04",title:"Conseil & Assistance Technique",desc:"Un regard technique indépendant",body:"Notre pôle conseil accompagne les directions techniques dans leurs arbitrages stratégiques — choix de solutions, sélection de prestataires, optimisation d'un DCE.",items:["Conseil technique en dépense contrôlée","Assistance technique intégrée","Experts métier EIA","PMO mis à disposition","Études de faisabilité technico-économiques","Diagnostics et audits d'installations"]},
];

function Services() {
  const [open, setOpen] = useState(0);
  return (
    <section id="services" style={{background:C.concrete,position:"relative",overflow:"hidden"}}>
      {/* Engrenage déco */}
      <div style={{position:"absolute",left:"-4rem",bottom:"-4rem",opacity:.04,pointerEvents:"none"}}>
        <GearLogo size={380} color={C.bronze} speed={50} />
      </div>

      <div style={{padding:"8rem 5vw",maxWidth:1500,margin:"0 auto",position:"relative",zIndex:1}}>
        <div className="srv-intro" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4rem",alignItems:"end",marginBottom:"4rem"}}>
          <div>
            <Eyebrow text="Nos Domaines d'Intervention" />
            <h2 className="f-display reveal" style={{fontSize:"clamp(3rem,5vw,6rem)",lineHeight:.92,color:C.white,marginTop:"1.5rem"}}>
              SAVOIR-FAIRE<br/>
              <span style={{color:C.bronze}}>COMPLET</span><br/>
              <span style={{color:C.steel2}}>DE L'ÉTUDE</span><br/>
              AU CHANTIER
            </h2>
          </div>
          <p className="reveal" style={{fontSize:".97rem",lineHeight:1.85,color:C.dim}}>
            SII intervient sur <strong style={{color:C.offwhite,fontWeight:400}}>l'ensemble de la chaîne de projet industriel</strong> — des études préliminaires jusqu'à la supervision des travaux et la mise en service. Chaque mission est dimensionnée selon les besoins réels du client.
          </p>
        </div>

        <div className="reveal" style={{borderTop:`1px solid ${C.rule}`}}>
          {SERVICES.map((s,i)=>(
            <AccItem key={i} {...s} isOpen={open===i} onToggle={()=>setOpen(open===i?-1:i)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AccItem({num,title,desc,body,items,isOpen,onToggle}) {
  return (
    <div style={{borderBottom:`1px solid ${C.rule}`}}>
      <div onClick={onToggle} style={{display:"grid",gridTemplateColumns:"3rem 1fr 2.2rem",alignItems:"center",gap:"2rem",padding:"1.8rem 0",cursor:"pointer"}}>
        <span className="f-mono" style={{fontSize:".6rem",letterSpacing:".2em",color:C.ghost}}>{num}</span>
        <span className="f-display" style={{fontSize:"clamp(1.4rem,2vw,2.2rem)",color:isOpen?C.bronze:C.offwhite,transition:"color .3s"}}>{title}</span>
        <div style={{
          width:32,height:32,
          border:`1px solid ${isOpen?C.bronze:C.rule}`,
          display:"flex",alignItems:"center",justifyContent:"center",
          transform:isOpen?"rotate(45deg)":"none",
          background:isOpen?C.bronze:"transparent",
          transition:"all .5s cubic-bezier(.16,1,.3,1)",
          flexShrink:0,
        }}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke={isOpen?C.concrete:C.offwhite} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
      <div style={{maxHeight:isOpen?900:0,overflow:"hidden",transition:"max-height .65s cubic-bezier(.16,1,.3,1)"}}>
        <div className="acc-inner" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3rem",padding:"0 0 2.5rem 5rem"}}>
          <div>
            <strong style={{display:"block",fontSize:"1.05rem",fontWeight:400,color:C.offwhite,marginBottom:".8rem"}}>{desc}</strong>
            <p style={{fontSize:".9rem",lineHeight:1.85,color:C.dim}}>{body}</p>
            <div style={{marginTop:"1.8rem"}}>
              <div className="media-slot" style={{aspectRatio:"16/8",padding:"2rem"}}>
                <span style={{fontSize:"1.2rem",opacity:.2}}>📷</span>
                <span className="f-mono" style={{fontSize:".56rem",letterSpacing:".18em",textTransform:"uppercase",color:C.ghost}}>Photo — {title}</span>
              </div>
            </div>
          </div>
          <ul style={{listStyle:"none",marginTop:".3rem"}}>
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
    {label:"Phase 01 — Amont",title:"Planification & Études",items:["Élaboration de plans directeurs","Diagnostics techniques (DIAG)","Études de faisabilité technico-économiques","Études de conception et avant-projets","Optimisation des dossiers d'appel d'offres","Contrôle et visa des études d'exécution"]},
    {label:"Phase 02 — Réalisation",title:"Exécution & Mise en Service",items:["Pilotage et supervision des travaux (OPC, DET)","Coordination et gestion des interfaces multi-lots","Réception FAT (usine) et SAT (site)","Commissioning et mise en service","Assistance au démarrage et à l'exploitation","Projets de mise en conformité & revamping"]},
  ];
  const specs = [
    {n:"01",title:"Électricité HTB · HTA · BT",body:"Postes de transformation, tableaux TGBT, boucles HTA et distribution BT industrielle."},
    {n:"02",title:"Automatisme & Instrumentation",body:"Systèmes DCS/PLC, boucles de régulation, instrumentation de process industriel."},
    {n:"03",title:"Protection Incendie",body:"Détection, extinction automatique — sprinklers, CO₂, FM-200 — conformité APSAD / NFPA."},
    {n:"04",title:"CCTV & Sécurité",body:"Vidéoprotection industrielle et urbaine, intégrée aux centres de supervision."},
  ];

  return (
    <section id="missions" style={{background:C.concrete2,position:"relative"}}>
      <div style={{padding:"8rem 5vw",maxWidth:1500,margin:"0 auto"}}>
        <Eyebrow text="Nos Missions" />
        <h2 className="f-display reveal" style={{fontSize:"clamp(3rem,5vw,6rem)",lineHeight:.92,marginTop:"1.5rem",color:C.white}}>
          CHAQUE PHASE<br/>
          <span style={{color:C.bronze}}>DU CYCLE</span><br/>
          <span style={{color:C.steel2}}>DE VIE PROJET</span>
        </h2>

        <div className="reveal miss-phases" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:C.rule,marginTop:"4rem"}}>
          {phases.map((p,i)=>(
            <div key={i} className="mphase" style={{background:C.concrete,padding:"3rem 2.5rem"}}>
              <div className="mphase-line" />
              <div className="f-mono" style={{fontSize:".62rem",letterSpacing:".26em",textTransform:"uppercase",color:C.bronze,marginBottom:"1rem"}}>{p.label}</div>
              <h3 className="f-display" style={{fontSize:"1.9rem",color:C.offwhite,marginBottom:"1.5rem"}}>{p.title}</h3>
              <ul style={{listStyle:"none"}}>
                {p.items.map((item,j)=>(
                  <li key={j} style={{padding:".62rem 0",borderBottom:`1px solid ${C.rule}`,fontSize:".88rem",color:C.dim,display:"flex",alignItems:"center",gap:12}}>
                    <span style={{width:14,height:1,background:`${C.bronze}50`,flexShrink:0,display:"block"}} />{item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="reveal specs-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:C.rule,marginTop:1}}>
          {specs.map((s,i)=>(
            <div key={i} className="spec-card" style={{background:C.concrete,padding:"2.4rem 2rem"}}>
              <div className="f-display" style={{fontSize:"3.5rem",lineHeight:1,color:C.bronze,opacity:.15}}>{s.n}</div>
              <div className="f-display" style={{fontSize:"1.3rem",color:C.offwhite,margin:".8rem 0 .5rem"}}>{s.title}</div>
              <div style={{fontSize:".84rem",lineHeight:1.7,color:C.dim}}>{s.body}</div>
              <div className="spec-underline" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   PROJETS
───────────────────────────────────────── */
const PROJS = [
  {n:"01",client:"OCP Group",name:"Hall de Stockage Automatisé",desc:"Supervision et coordination complète d'un projet d'automatisation des systèmes de stockage industriel. Planning opérationnel, coordination des entreprises, suivi de mise en service.",tag:"Automatisation · Supervision",budget:"56",dur:"18"},
  {n:"02",client:"OCP Group",name:"Programme Détection & Protection Incendie",desc:"Étude et installation d'un programme de grande envergure couvrant les installations de détection et protection incendie du Groupe OCP sur plusieurs sites industriels en parallèle.",tag:"Fire Safety · Conformité NFPA",budget:"240",dur:"24"},
  {n:"03",client:"OCP Group",name:"Réhabilitation des Installations Incendie",desc:"Réhabilitation complète des systèmes de protection incendie. Remplacement et modernisation des équipements, intégration aux systèmes de supervision centralisée.",tag:"Réhabilitation · Installation",budget:"212",dur:"24"},
  {n:"04",client:"Client Industriel",name:"Poste Électrique MT/BT",desc:"Gestion multi-métiers d'un projet de mise en conformité et d'optimisation de la distribution énergétique industrielle. Études, fourniture, installation, coordination réglementaire.",tag:"Électricité Industrielle · MT/BT",budget:"34",dur:"14"},
  {n:"05",client:"Ville de Fès",name:"Vidéoprotection Urbaine — Fès",desc:"Conception et déploiement d'un système complet de vidéoprotection urbaine. Caméras intelligentes, centres de supervision, liaisons de transmission sécurisées.",tag:"CCTV · Sécurisation Urbaine",budget:"8",dur:"12"},
];

function Projects() {
  return (
    <section id="projets" style={{background:C.concrete,position:"relative"}}>
      <div style={{padding:"8rem 5vw",maxWidth:1500,margin:"0 auto"}}>
        <Eyebrow text="Références" />
        <h2 className="f-display reveal" style={{fontSize:"clamp(3rem,5vw,6rem)",lineHeight:.92,marginTop:"1.5rem",color:C.white}}>
          PROJETS RÉALISÉS<br/>
          <span style={{color:C.bronze}}>PAR NOTRE</span><br/>
          <span style={{color:C.steel2}}>ÉQUIPE</span>
        </h2>
        <p className="reveal" style={{marginTop:"1rem",fontSize:".86rem",color:C.dim,maxWidth:560,lineHeight:1.8}}>
          Ces références ont été réalisées par les membres fondateurs de SII dans le cadre de leurs missions antérieures. Elles illustrent le niveau d'expérience de l'équipe.
        </p>

        <div style={{marginTop:"4rem",borderTop:`1px solid ${C.rule}`}}>
          {PROJS.map((p,i)=><ProjRow key={i} {...p} idx={i} />)}
        </div>
      </div>
    </section>
  );
}

function ProjRow({n,client,name,desc,tag,budget,dur,idx}) {
  const [hov,setHov]=useState(false);
  return (
    <div className={`reveal proj-row d${Math.min(idx,4)}`}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        display:"grid",gridTemplateColumns:"3rem 1fr 200px",
        gap:"2.5rem",alignItems:"start",
        padding:`2.5rem ${hov?"1.4rem":"0"}`,
        borderBottom:`1px solid ${C.rule}`,
        background:hov?`rgba(184,150,106,.03)`:"transparent",
        transition:"padding-left .5s cubic-bezier(.16,1,.3,1), background .3s",
      }}>
      <span className="f-mono" style={{fontSize:".6rem",letterSpacing:".2em",color:C.ghost,paddingTop:".3rem"}}>{n}</span>
      <div>
        <div className="f-mono" style={{fontSize:".6rem",letterSpacing:".2em",textTransform:"uppercase",color:C.bronze,marginBottom:".5rem"}}>{client}</div>
        <h3 className="f-display" style={{fontSize:"clamp(1.4rem,2vw,2.2rem)",color:C.offwhite,lineHeight:1.05,marginBottom:".7rem"}}>{name}</h3>
        <p style={{fontSize:".87rem",color:C.dim,lineHeight:1.75,maxWidth:520}}>{desc}</p>
        <div style={{marginTop:"1rem",maxWidth:360}}>
          <div className="media-slot" style={{aspectRatio:"16/6",padding:"1.5rem"}}>
            <span style={{fontSize:"1rem",opacity:.2}}>📷</span>
            <span className="f-mono" style={{fontSize:".54rem",letterSpacing:".18em",textTransform:"uppercase",color:C.ghost}}>Photo du projet</span>
          </div>
        </div>
        <span className="f-mono" style={{display:"inline-block",marginTop:".8rem",padding:".28rem .8rem",border:`1px solid ${C.rule}`,fontSize:".58rem",letterSpacing:".14em",textTransform:"uppercase",color:C.dim}}>{tag}</span>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"1.5rem",alignItems:"flex-end",paddingTop:".4rem"}}>
        <div style={{textAlign:"right"}}>
          <div className="f-display" style={{fontSize:"2.4rem",lineHeight:1,color:hov?C.bronze:C.offwhite,transition:"color .3s"}}>{budget} <span style={{fontSize:"1rem",color:C.bronze}}>MMAD</span></div>
          <div className="f-mono" style={{fontSize:".56rem",letterSpacing:".15em",textTransform:"uppercase",color:C.dim,marginTop:".2rem"}}>Valeur</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div className="f-display" style={{fontSize:"2.4rem",lineHeight:1,color:C.offwhite}}>{dur} <span style={{fontSize:"1rem",color:C.steel2}}>mois</span></div>
          <div className="f-mono" style={{fontSize:".56rem",letterSpacing:".15em",textTransform:"uppercase",color:C.dim,marginTop:".2rem"}}>Durée</div>
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
    <section id="contact" style={{background:C.concrete2,position:"relative"}}>
      <div style={{padding:"8rem 5vw",maxWidth:1500,margin:"0 auto"}}>
        <div className="contact-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6rem",alignItems:"start"}}>
          <div>
            <Eyebrow text="Travaillons ensemble" />
            <h2 className="f-display reveal" style={{fontSize:"clamp(3rem,5vw,6rem)",lineHeight:.92,marginTop:"1.5rem",color:C.white}}>
              VOTRE PROJET<br/>
              <span style={{color:C.bronze}}>MÉRITE</span><br/>
              UNE ÉQUIPE<br/>
              <span style={{color:C.steel2}}>À SA MESURE</span>
            </h2>
            <p className="reveal" style={{marginTop:"2.5rem",fontSize:".97rem",lineHeight:1.85,color:C.dim}}>
              Que vous soyez en phase d'étude, en cours d'appel d'offres ou en recherche d'un partenaire technique pour la réalisation, l'équipe SII est disponible pour analyser votre besoin et vous proposer une réponse adaptée.
            </p>

            {/* Engrenage déco */}
            <div style={{marginTop:"3rem",opacity:.15}}>
              <GearLogo size={90} color={C.bronze} speed={20} />
            </div>
          </div>

          <div className="reveal">
            <div style={{background:C.concrete,padding:"3rem",borderTop:`3px solid ${C.bronze}`,borderLeft:`1px solid ${C.rule}`,borderRight:`1px solid ${C.rule}`,borderBottom:`1px solid ${C.rule}`}}>
              <h3 className="f-display" style={{fontSize:"2rem",color:C.offwhite,marginBottom:"2.5rem"}}>NOUS CONTACTER</h3>
              {[
                {lbl:"Email professionnel",val:<a href="mailto:contact@si-i.ma" style={{color:C.bronze,textDecoration:"none",transition:"color .3s"}}>contact@si-i.ma</a>},
                {lbl:"Site web",val:<a href="http://www.si-i.ma" style={{color:C.bronze,textDecoration:"none"}}>www.si-i.ma</a>},
                {lbl:"Domaines",val:<span style={{fontSize:".88rem",lineHeight:1.65,color:C.dim}}>Électricité · Automatisme · Instrumentation<br/>Fire Safety · CCTV</span>},
                {lbl:"Marchés",val:"Maroc — Afrique"},
              ].map((l,i,arr)=>(
                <div key={i} style={{display:"flex",flexDirection:"column",gap:".3rem",padding:"1.2rem 0",borderBottom:i<arr.length-1?`1px solid ${C.rule}`:"none"}}>
                  <span className="f-mono" style={{fontSize:".56rem",letterSpacing:".24em",textTransform:"uppercase",color:C.ghost}}>{l.lbl}</span>
                  <span style={{fontSize:".95rem",color:C.offwhite}}>{l.val}</span>
                </div>
              ))}
              <a href="mailto:contact@si-i.ma" className="btn-primary" style={{marginTop:"2.5rem",display:"inline-block"}}>
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
    <footer style={{
      background:C.concrete,
      borderTop:`1px solid ${C.rule}`,
      padding:"2rem 5vw",
      display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem",
    }}>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <GearLogo size={32} color={C.bronze} speed={20} />
        <div>
          <div className="f-mono" style={{fontSize:".7rem",letterSpacing:".26em",textTransform:"uppercase",color:C.dim}}>SII</div>
          <div className="f-mono" style={{fontSize:".54rem",color:C.ghost}}>Société d'Ingénierie et d'Innovation</div>
        </div>
      </div>
      <span style={{fontStyle:"italic",fontSize:".88rem",color:C.ghost,fontFamily:"'Barlow'"}}>Construisons l'avenir, projet par projet.</span>
      <span className="f-mono" style={{fontSize:".58rem",letterSpacing:".12em",color:`${C.ghost}`}}>© 2026 SII — Tous droits réservés</span>
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
