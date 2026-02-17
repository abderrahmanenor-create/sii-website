import { useState, useEffect, useRef } from "react";
import logo from "./logo-sii.png";

/* ─────────────────────────────────────────
   TOKENS
───────────────────────────────────────── */
const C = {
  navy:   "#28283C",
  navy2:  "#3C3C50",
  steel:  "#64788C",
  cream:  "#F6F5F1",
  smoke:  "#EDECE8",
  white:  "#FFFFFF",
  bronze: "#B8966A",
  bronzeL:"#D4B48A",
  rule:   "rgba(40,40,60,.1)",
};

/* ─────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────── */
const G = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    background: ${C.cream};
    color: ${C.navy};
    font-family: 'DM Sans', system-ui, sans-serif;
    font-weight: 300;
    line-height: 1.7;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${C.smoke}; }
  ::-webkit-scrollbar-thumb { background: ${C.navy2}; border-radius: 2px; }

  /* ── Animations industrielles ── */

  /* Grue : bras qui pivote */
  @keyframes craneBoom {
    0%,100% { transform: rotate(-2deg); }
    50%      { transform: rotate(2deg); }
  }
  /* Câble de la grue qui descend/monte */
  @keyframes craneHook {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(18px); }
  }
  /* Nacelle qui monte */
  @keyframes nacelleRise {
    0%   { transform: translateY(0px); opacity: 1; }
    45%  { transform: translateY(-60px); opacity: 1; }
    50%  { transform: translateY(-60px); opacity: 0; }
    51%  { transform: translateY(0px); opacity: 0; }
    55%  { opacity: 1; }
    100% { transform: translateY(0px); opacity: 1; }
  }
  /* Éclair électrique */
  @keyframes spark {
    0%,90%,100% { opacity: 0; }
    92%,96%     { opacity: 1; }
    94%         { opacity: 0.3; }
  }
  /* Câble qui pulse */
  @keyframes cablePulse {
    0%,100% { stroke-dashoffset: 200; opacity: .5; }
    50%     { stroke-dashoffset: 0;   opacity: 1; }
  }
  /* Engrenage qui tourne */
  @keyframes gearTurn {
    to { transform: rotate(360deg); }
  }
  @keyframes gearTurnR {
    to { transform: rotate(-360deg); }
  }
  /* Grille qui dérive */
  @keyframes gridDrift {
    to { background-position: 80px 80px; }
  }
  /* Fade up */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  /* Blink */
  @keyframes blink {
    0%,100% { opacity: 1; } 50% { opacity: .2; }
  }

  .gear-cw  { animation: gearTurn  10s linear infinite; transform-origin: 50% 50%; }
  .gear-ccw { animation: gearTurnR 14s linear infinite; transform-origin: 50% 50%; }

  /* Reveal */
  .reveal {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity .9s cubic-bezier(.16,1,.3,1),
                transform .9s cubic-bezier(.16,1,.3,1);
  }
  .reveal.show { opacity: 1; transform: translateY(0); }
  .d1 { transition-delay: .1s; }
  .d2 { transition-delay: .22s; }
  .d3 { transition-delay: .34s; }
  .d4 { transition-delay: .46s; }

  /* Nav hover link */
  .nav-link {
    font-family: 'DM Mono'; font-size: .67rem;
    letter-spacing: .16em; text-transform: uppercase;
    color: rgba(40,40,60,.65); text-decoration: none;
    transition: color .3s; position: relative;
  }
  .nav-link::after {
    content: ''; position: absolute; bottom: -2px; left: 0;
    width: 0; height: 1px; background: ${C.navy};
    transition: width .4s cubic-bezier(.16,1,.3,1);
  }
  .nav-link:hover { color: ${C.navy}; }
  .nav-link:hover::after { width: 100%; }

  /* Accordion list items */
  .acc-li {
    padding: .62rem 0;
    border-bottom: 1px solid rgba(255,255,255,.05);
    font-size: .85rem;
    color: rgba(255,255,255,.42);
    display: flex; align-items: flex-start; gap: 10px;
    line-height: 1.55;
    transition: color .3s;
    list-style: none;
  }
  .acc-li:hover { color: rgba(255,255,255,.82); }
  .acc-li::before {
    content: '';
    display: block; flex-shrink: 0;
    width: 4px; height: 4px; border-radius: 50%;
    background: ${C.bronze}; margin-top: .54rem;
  }
  .acc-li:last-child { border-bottom: none; }

  /* Pillar hover */
  .pillar {
    background: ${C.white};
    padding: 1.7rem 1.5rem;
    border-top: 2px solid transparent;
    transition: border-color .3s, background .3s;
  }
  .pillar:hover { border-color: ${C.navy}; background: ${C.cream}; }

  /* Spec hover bar */
  .spec { background: ${C.white}; padding: 2.2rem 1.8rem; position: relative; overflow: hidden; transition: background .3s; }
  .spec:hover { background: ${C.cream}; }
  .spec-bar { position: absolute; bottom: 0; left: 0; width: 0; height: 2px; background: ${C.navy}; transition: width .5s cubic-bezier(.16,1,.3,1); }
  .spec:hover .spec-bar { width: 100%; }

  /* Project row hover */
  .proj-row { transition: padding-left .5s cubic-bezier(.16,1,.3,1); }
  .proj-row:hover { padding-left: 1.2rem; }

  /* Phase card */
  .mphase { background: ${C.smoke}; padding: 3rem 2.5rem; position: relative; overflow: hidden; }
  .mphase-bar { position: absolute; top: 0; left: 0; width: 3px; height: 0; background: ${C.navy}; transition: height .55s cubic-bezier(.16,1,.3,1); }
  .mphase:hover .mphase-bar { height: 100%; }

  /* Media slot */
  .media-slot {
    width: 100%;
    background: linear-gradient(135deg, rgba(40,40,60,.08), rgba(40,40,60,.03));
    border: 1.5px dashed rgba(40,40,60,.2);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 6px; padding: 2rem 1rem;
  }

  /* CTA button */
  .btn-send {
    display: inline-block; margin-top: 2rem;
    padding: .9rem 2rem;
    background: ${C.navy}; color: ${C.white};
    font-family: 'DM Mono'; font-size: .68rem;
    letter-spacing: .2em; text-transform: uppercase;
    text-decoration: none;
    transition: background .3s;
  }
  .btn-send:hover { background: ${C.navy2}; }

  @media (max-width: 960px) {
    .hero-split, .about-grid, .srv-intro,
    .contact-grid { grid-template-columns: 1fr !important; }
    .about-sticky { position: static !important; }
    .miss-phases  { grid-template-columns: 1fr !important; }
    .specs-grid   { grid-template-columns: 1fr 1fr !important; }
    .acc-inner    { grid-template-columns: 1fr !important; }
    .pillars-grid { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 600px) {
    .nav-links-desk { display: none !important; }
    .specs-grid { grid-template-columns: 1fr !important; }
    .hero-left, .hero-right { padding: 4rem 5vw !important; }
  }
`;

/* ─────────────────────────────────────────
   HOOK — scroll reveal
───────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add("show"); }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

/* ─────────────────────────────────────────
   ANIMATION : GRUE SVG
───────────────────────────────────────── */
function CraneScene() {
  return (
    <svg
      viewBox="0 0 320 280"
      width="320" height="280"
      style={{ position: "absolute", right: "3vw", bottom: 0, opacity: .18, pointerEvents: "none" }}
    >
      {/* Tour verticale */}
      <rect x="148" y="60" width="14" height="210" fill="rgba(255,255,255,.7)" rx="2"/>
      {/* Croix de renfort tour */}
      <line x1="148" y1="100" x2="162" y2="130" stroke="rgba(255,255,255,.4)" strokeWidth="1.5"/>
      <line x1="162" y1="100" x2="148" y2="130" stroke="rgba(255,255,255,.4)" strokeWidth="1.5"/>
      <line x1="148" y1="140" x2="162" y2="170" stroke="rgba(255,255,255,.4)" strokeWidth="1.5"/>
      <line x1="162" y1="140" x2="148" y2="170" stroke="rgba(255,255,255,.4)" strokeWidth="1.5"/>

      {/* Bras de la grue (animé) */}
      <g style={{ transformOrigin: "155px 68px", animation: "craneBoom 6s ease-in-out infinite" }}>
        <rect x="80" y="60" width="160" height="8" fill="rgba(255,255,255,.8)" rx="2"/>
        {/* Câble avant */}
        <line x1="155" y1="68" x2="110" y2="68" stroke="rgba(255,255,255,.5)" strokeWidth="1.5"/>
        <line x1="110" y1="68" x2="95" y2="90" stroke="rgba(255,255,255,.5)" strokeWidth="1.5"/>
        {/* Câble portique */}
        <line x1="240" y1="68" x2="220" y2="40" stroke="rgba(255,255,255,.4)" strokeWidth="1.5"/>
        <line x1="155" y1="68" x2="220" y2="40" stroke="rgba(255,255,255,.4)" strokeWidth="1.5"/>
        {/* Contrepoids */}
        <rect x="225" y="62" width="18" height="14" fill="rgba(255,255,255,.6)" rx="2"/>

        {/* Câble + crochet (animé) */}
        <g style={{ animation: "craneHook 6s ease-in-out infinite" }}>
          <line x1="200" y1="68" x2="200" y2="120" stroke="rgba(255,255,255,.7)" strokeWidth="1.5" strokeDasharray="4,3"/>
          {/* Nacelle / charge */}
          <g style={{ animation: "nacelleRise 8s ease-in-out infinite" }}>
            <rect x="186" y="120" width="28" height="16" fill="rgba(255,255,255,.55)" rx="3"/>
            <rect x="192" y="116" width="4" height="6" fill="rgba(255,255,255,.4)" rx="1"/>
            <rect x="202" y="116" width="4" height="6" fill="rgba(255,255,255,.4)" rx="1"/>
            {/* Petite personne dans nacelle */}
            <circle cx="200" cy="124" r="3" fill="rgba(255,255,255,.4)"/>
            <line x1="200" y1="127" x2="200" y2="133" stroke="rgba(255,255,255,.4)" strokeWidth="1.5"/>
          </g>
        </g>
      </g>

      {/* Sol / base */}
      <rect x="100" y="268" width="110" height="10" fill="rgba(255,255,255,.3)" rx="2"/>
      <rect x="120" y="258" width="70" height="12" fill="rgba(255,255,255,.2)" rx="1"/>

      {/* Câbles électriques en bas */}
      <path d="M0 240 Q80 220 160 240 Q240 260 320 240"
        fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="2"
        strokeDasharray="12,6"
        style={{ animation: "cablePulse 3s ease-in-out infinite", strokeDashoffset: 200 }}
      />
      <path d="M0 255 Q80 235 160 255 Q240 275 320 255"
        fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="1.5"
        strokeDasharray="8,8"
        style={{ animation: "cablePulse 3s ease-in-out 1s infinite", strokeDashoffset: 200 }}
      />

      {/* Éclairs électriques */}
      <g style={{ animation: "spark 5s ease-in-out infinite" }}>
        <polyline points="50,220 55,230 48,232 56,248" fill="none" stroke="rgba(255,220,50,.9)" strokeWidth="2" strokeLinejoin="round"/>
      </g>
      <g style={{ animation: "spark 5s ease-in-out 2.5s infinite" }}>
        <polyline points="270,215 275,226 268,228 276,244" fill="none" stroke="rgba(255,220,50,.9)" strokeWidth="2" strokeLinejoin="round"/>
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────
   ANIMATION : ENGRENAGES décoratifs
───────────────────────────────────────── */
function GearDeco({ x, y, r, speed = 10, reverse = false, opacity = .12 }) {
  const teeth = 8;
  const pts = Array.from({ length: teeth * 2 }, (_, i) => {
    const angle = (i * Math.PI) / teeth;
    const radius = i % 2 === 0 ? r + 4 : r - 2;
    return `${x + Math.cos(angle) * radius},${y + Math.sin(angle) * radius}`;
  }).join(" ");

  return (
    <g
      className={reverse ? "gear-ccw" : "gear-cw"}
      style={{ transformOrigin: `${x}px ${y}px`, opacity, animationDuration: `${speed}s` }}
    >
      <polygon points={pts} fill="none" stroke={C.navy} strokeWidth="1.5" />
      <circle cx={x} cy={y} r={r * .55} fill="none" stroke={C.navy} strokeWidth="1.5" />
      <circle cx={x} cy={y} r={r * .2} fill={C.navy} />
    </g>
  );
}

/* ─────────────────────────────────────────
   ANIMATION : CÂBLES section header
───────────────────────────────────────── */
function ElectricCables({ light = false }) {
  const col = light ? "rgba(255,255,255,.15)" : `rgba(40,40,60,.08)`;
  const colAnim = light ? "rgba(184,150,106,.4)" : `rgba(40,40,60,.18)`;
  return (
    <svg viewBox="0 0 1200 60" preserveAspectRatio="none"
      style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 60, pointerEvents: "none" }}
    >
      {[0, 1, 2].map(i => (
        <path key={i}
          d={`M0 ${20 + i * 12} Q300 ${10 + i * 8} 600 ${20 + i * 12} Q900 ${30 + i * 8} 1200 ${20 + i * 12}`}
          fill="none" stroke={i === 1 ? colAnim : col}
          strokeWidth={i === 1 ? "2" : "1"}
          strokeDasharray="20,10"
          style={{
            animation: `cablePulse ${3 + i}s ease-in-out ${i * .7}s infinite`,
            strokeDashoffset: 200,
          }}
        />
      ))}
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
  return <div style={{ position:"fixed",top:0,left:0,zIndex:9999,height:2,width:`${w}%`,background:`linear-gradient(90deg,${C.navy},${C.steel})`,transition:"width .08s linear",pointerEvents:"none" }} />;
}

/* ─────────────────────────────────────────
   NAV
───────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position:"fixed",top:0,left:0,right:0,zIndex:900,
      height:76,padding:"0 5vw",
      display:"flex",alignItems:"center",justifyContent:"space-between",
      background:"rgba(246,245,241,.95)",
      backdropFilter:"blur(20px)",
      borderBottom:`1px solid ${C.rule}`,
      boxShadow: scrolled ? "0 2px 24px rgba(40,40,60,.08)" : "none",
      transition:"box-shadow .4s",
    }}>
      {/* Logo image exacte */}
      <a href="#accueil" style={{ display:"flex",alignItems:"center",textDecoration:"none" }}>
        <img
          src={logo}
          alt="SII — Société d'Ingénierie et d'Innovation"
          style={{ height:52, width:"auto", display:"block" }}
        />
      </a>

      {/* Liens */}
      <ul className="nav-links-desk" style={{ display:"flex",gap:"2rem",listStyle:"none",alignItems:"center" }}>
        {[["À Propos","#apropos"],["Services","#services"],["Missions","#missions"],["Références","#projets"]].map(([l,h]) => (
          <li key={h}><a href={h} className="nav-link">{l}</a></li>
        ))}
        <li>
          <a href="#contact" style={{
            padding:".46rem 1.2rem",border:`1px solid ${C.navy}`,
            fontFamily:"'DM Mono'",fontSize:".67rem",letterSpacing:".16em",
            textTransform:"uppercase",textDecoration:"none",color:C.navy,
            transition:"background .3s, color .3s",
          }}
            onMouseEnter={e=>{e.currentTarget.style.background=C.navy;e.currentTarget.style.color=C.white;}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=C.navy;}}
          >Contact</a>
        </li>
      </ul>
    </nav>
  );
}

/* ─────────────────────────────────────────
   HERO
───────────────────────────────────────── */
function Hero() {
  const kpis = [
    {val:"20",sup:"+",lbl:"Ans d'expérience cumulée des fondateurs"},
    {val:"550",sup:"+",lbl:"MMAD de projets réalisés par notre équipe"},
    {val:"5",sup:"",lbl:"Grands projets de référence"},
    {val:"2024",sup:"",lbl:"Année de création de SII"},
  ];
  return (
    <section id="accueil" style={{minHeight:"100vh",paddingTop:76}}>
      <div className="hero-split" style={{display:"grid",gridTemplateColumns:"55fr 45fr",minHeight:"calc(100vh - 76px)"}}>

        {/* GAUCHE */}
        <div className="hero-left" style={{
          background:C.navy,display:"flex",flexDirection:"column",
          justifyContent:"center",padding:"7vw 5vw",
          position:"relative",overflow:"hidden",
        }}>
          {/* Grille fond */}
          <div style={{position:"absolute",inset:0,pointerEvents:"none",backgroundImage:`repeating-linear-gradient(0deg,rgba(100,120,140,.06) 0 1px,transparent 1px 80px),repeating-linear-gradient(90deg,rgba(100,120,140,.06) 0 1px,transparent 1px 80px)`,backgroundSize:"80px 80px",animation:"gridDrift 40s linear infinite"}} />

          {/* Grue SVG animée */}
          <CraneScene />

          {/* Engrenages décoratifs fond */}
          <svg style={{position:"absolute",left:"2vw",top:"10%",pointerEvents:"none"}} width="120" height="120" viewBox="0 0 120 120">
            <GearDeco x={60} y={60} r={38} speed={20} opacity={.1} />
            <GearDeco x={60} y={60} r={18} speed={12} reverse opacity={.15} />
          </svg>

          {/* Ligne droite */}
          <div style={{position:"absolute",right:0,top:"10%",bottom:"10%",width:1,background:`linear-gradient(to bottom,transparent,${C.steel}50,transparent)`}} />

          {/* Logo */}
          <div style={{marginBottom:"2.5rem",animation:"fadeUp .9s cubic-bezier(.16,1,.3,1) .3s both",position:"relative",zIndex:1}}>
            <img src={logo} alt="SII" style={{height:64,width:"auto",filter:"brightness(0) invert(1)",opacity:.88}} />
          </div>

          {/* Badge */}
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:".36rem .9rem",marginBottom:"2rem",border:"1px solid rgba(100,120,140,.3)",width:"fit-content",fontFamily:"'DM Mono'",fontSize:".62rem",letterSpacing:".2em",textTransform:"uppercase",color:"rgba(255,255,255,.42)",animation:"fadeUp .8s cubic-bezier(.16,1,.3,1) .55s both",position:"relative",zIndex:1}}>
            <span style={{width:5,height:5,borderRadius:"50%",background:C.bronze,animation:"blink 2.5s ease infinite"}} />
            EIA · Électricité · Instrumentation · Automatisme
          </div>

          {/* H1 */}
          <h1 style={{fontFamily:"'Cormorant Garamond'",fontWeight:300,fontSize:"clamp(2.8rem,4.8vw,5.5rem)",lineHeight:1.06,color:C.white,animation:"fadeUp 1s cubic-bezier(.16,1,.3,1) .7s both",position:"relative",zIndex:1}}>
            L'ingénierie<br/>industrielle<br/>
            <em style={{fontStyle:"italic",color:C.bronzeL}}>au service<br/>du terrain</em>
          </h1>

          {/* Charte */}
          <p style={{marginTop:"1.8rem",fontFamily:"'Cormorant Garamond'",fontStyle:"italic",fontSize:"clamp(.95rem,1.3vw,1.2rem)",color:"rgba(255,255,255,.38)",borderLeft:`2px solid rgba(184,150,106,.35)`,paddingLeft:"1.2rem",maxWidth:400,animation:"fadeUp .8s cubic-bezier(.16,1,.3,1) .9s both",position:"relative",zIndex:1}}>
            Construisons l'avenir, projet par projet.
          </p>

          {/* Desc */}
          <p style={{marginTop:"1.8rem",fontSize:".96rem",lineHeight:1.82,color:"rgba(255,255,255,.45)",maxWidth:420,animation:"fadeUp .8s cubic-bezier(.16,1,.3,1) 1.05s both",position:"relative",zIndex:1}}>
            SII accompagne les industriels marocains dans leurs projets complexes — de l'étude à la mise en service — avec la rigueur et la précision que chaque installation mérite.
          </p>

          {/* CTA */}
          <a href="#contact" style={{display:"inline-flex",alignItems:"center",gap:12,marginTop:"2.5rem",width:"fit-content",textDecoration:"none",color:C.bronzeL,fontFamily:"'DM Mono'",fontSize:".7rem",letterSpacing:".2em",textTransform:"uppercase",paddingBottom:4,borderBottom:"1px solid rgba(184,150,106,.28)",animation:"fadeUp .8s cubic-bezier(.16,1,.3,1) 1.2s both",position:"relative",zIndex:1,transition:"gap .4s"}}
            onMouseEnter={e=>e.currentTarget.style.gap="22px"}
            onMouseLeave={e=>e.currentTarget.style.gap="12px"}
          >
            Discuter de votre projet →
          </a>

          {/* Câbles bas */}
          <ElectricCables light />
        </div>

        {/* DROITE */}
        <div className="hero-right" style={{background:C.smoke,display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"3vw",gap:2}}>
          {/* Photo */}
          <div style={{flex:1,display:"flex",alignItems:"flex-end",marginBottom:2}}>
            <div className="media-slot" style={{aspectRatio:"4/3"}}>
              <span style={{fontSize:"1.5rem",opacity:.25}}>📷</span>
              <span style={{fontFamily:"'DM Mono'",fontSize:".6rem",letterSpacing:".2em",textTransform:"uppercase",color:"rgba(40,40,60,.38)"}}>Photo chantier ou équipe</span>
              <span style={{fontFamily:"'DM Mono'",fontSize:".55rem",color:"rgba(40,40,60,.25)"}}>Remplacer par votre URL Cloudinary</span>
            </div>
          </div>
          {/* KPIs */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:2}}>
            {kpis.map((k,i)=>(
              <div key={i} style={{background:C.white,padding:"1.6rem",display:"flex",flexDirection:"column",justifyContent:"flex-end",animation:`fadeUp .8s cubic-bezier(.16,1,.3,1) ${.6+i*.15}s both`}}>
                <div style={{fontFamily:"'Cormorant Garamond'",fontSize:"2.8rem",fontWeight:600,lineHeight:1,color:C.navy}}>
                  {k.val}<sup style={{fontSize:".9rem",color:C.bronze}}>{k.sup}</sup>
                </div>
                <div style={{marginTop:".5rem",fontFamily:"'DM Mono'",fontSize:".6rem",letterSpacing:".15em",textTransform:"uppercase",color:`${C.navy}85`,lineHeight:1.4}}>{k.lbl}</div>
              </div>
            ))}
          </div>
          {/* Note */}
          <div style={{background:C.navy,padding:"1.5rem 1.8rem",fontSize:".82rem",lineHeight:1.7,color:"rgba(255,255,255,.44)",borderLeft:`2px solid ${C.bronze}`,animation:"fadeUp .8s cubic-bezier(.16,1,.3,1) 1.2s both"}}>
            <strong style={{color:C.white,fontWeight:400}}>Structure créée en 2024, équipe chevronnée. </strong>
            Nos fondateurs cumulent plus de vingt ans d'expérience sur de grands projets industriels marocains.
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   EYEBROW
───────────────────────────────────────── */
function Eyebrow({text}) {
  return (
    <div className="reveal" style={{fontFamily:"'DM Mono'",fontSize:".65rem",letterSpacing:".28em",textTransform:"uppercase",color:C.bronze,marginBottom:"1.1rem",display:"flex",alignItems:"center",gap:10}}>
      <span style={{display:"inline-block",width:18,height:1,background:C.bronze}} />
      {text}
    </div>
  );
}

/* ─────────────────────────────────────────
   À PROPOS
───────────────────────────────────────── */
function About() {
  const pillars = [
    {icon:"⚙",name:"Maîtrise Technique EIA",body:"Électricité industrielle, instrumentation et automatisme — couverture complète des disciplines."},
    {icon:"◈",name:"Méthodes Éprouvées",body:"Processus et outils de gestion alignés sur les standards internationaux de l'industrie."},
    {icon:"◎",name:"Ancrage Local",body:"Connaissance approfondie du tissu industriel marocain, de ses contraintes et de ses acteurs."},
    {icon:"◇",name:"Engagement Direct",body:"Interlocuteurs techniques impliqués à chaque étape, sans intermédiaires inutiles."},
  ];

  return (
    <section id="apropos" style={{background:C.white,position:"relative"}}>
      <div style={{padding:"8rem 5vw",maxWidth:1500,margin:"0 auto"}}>
        <div className="about-grid" style={{display:"grid",gridTemplateColumns:"5fr 6fr",gap:"6rem",alignItems:"start"}}>

          <div className="about-sticky" style={{position:"sticky",top:100}}>
            <Eyebrow text="À Propos de SII" />
            <p className="reveal" style={{fontFamily:"'Cormorant Garamond'",marginTop:"2rem",fontSize:"clamp(1.3rem,1.8vw,1.9rem)",lineHeight:1.45,fontWeight:400}}>
              Une structure <em style={{fontStyle:"italic",color:C.bronze}}>nouvelle</em>, portée par une équipe qui connaît l'industrie marocaine de l'intérieur.
            </p>
            {/* Engrenages décoratifs */}
            <svg width="140" height="140" viewBox="0 0 140 140" style={{marginTop:"2rem",opacity:.12}}>
              <GearDeco x={70} y={70} r={42} speed={22} opacity={1} />
              <GearDeco x={70} y={70} r={20} speed={14} reverse opacity={1} />
            </svg>
          </div>

          <div>
            <div className="reveal" style={{marginBottom:"2rem"}}>
              <div className="media-slot" style={{aspectRatio:"16/7"}}>
                <span style={{fontSize:"1.5rem",opacity:.25}}>📷</span>
                <span style={{fontFamily:"'DM Mono'",fontSize:".6rem",letterSpacing:".2em",textTransform:"uppercase",color:"rgba(40,40,60,.38)"}}>Photo de l'équipe SII</span>
              </div>
            </div>

            <p className="reveal" style={{fontSize:".97rem",lineHeight:1.9,color:`${C.navy}90`,marginBottom:"1.6rem"}}>
              <strong style={{color:C.navy,fontWeight:500}}>SII — Société d'Ingénierie et d'Innovation</strong> — est une entreprise marocaine créée en 2024, spécialisée dans les domaines de l'électricité industrielle, de l'instrumentation et de l'automatisme. Si la structure est récente, l'expertise qui la fonde est profondément ancrée dans le terrain.
            </p>
            <p className="reveal" style={{fontSize:".97rem",lineHeight:1.9,color:`${C.navy}90`,marginBottom:"1.6rem"}}>
              Ses fondateurs et ses équipes cumulent plus de vingt ans d'expérience opérationnelle sur des projets industriels d'envergure au Maroc. Cette trajectoire — bâtie dans des environnements exigeants, auprès de grands donneurs d'ordres — est le capital réel de SII.
            </p>
            <div style={{width:36,height:1,background:C.bronze,margin:"2rem 0"}} className="reveal" />
            <p className="reveal" style={{fontSize:".97rem",lineHeight:1.9,color:`${C.navy}90`,marginBottom:"1.6rem"}}>
              De la phase d'étude à la réception finale, SII s'engage sur le résultat. La rigueur du suivi, la clarté des livrables et la transparence avec le client sont les bases de travail que l'équipe applique sur chaque intervention, quelle qu'en soit l'échelle.
            </p>
            <div className="reveal" style={{background:C.smoke,padding:"1.7rem 2rem",borderLeft:`3px solid ${C.navy}`,marginBottom:"2.5rem"}}>
              <p style={{fontSize:".88rem",lineHeight:1.75,color:`${C.navy}85`,margin:0}}>
                <strong style={{color:C.navy,fontWeight:500}}>Pourquoi SII ?</strong> Parce que créer une structure dédiée, c'est choisir d'investir pleinement dans les projets de nos clients. Une équipe technique directement impliquée, de la première étude jusqu'à la mise en service.
              </p>
            </div>

            <div className="reveal pillars-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:C.rule}}>
              {pillars.map((p,i)=>(
                <div key={i} className="pillar">
                  <div style={{fontSize:"1.3rem",marginBottom:".6rem"}}>{p.icon}</div>
                  <div style={{fontFamily:"'Cormorant Garamond'",fontSize:"1.2rem",fontWeight:600,marginBottom:".3rem"}}>{p.name}</div>
                  <div style={{fontSize:".83rem",color:`${C.navy}82`,lineHeight:1.65}}>{p.body}</div>
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

/* ─────────────────────────────────────────
   SERVICES
───────────────────────────────────────── */
const SERVICES = [
  {num:"01",title:"Engineering & Solutions Contractuelles",desc:"Études sur mesure, du concept à l'exécution",body:"SII réalise des études pluridisciplinaires intégrées, en forfait ou en régie. Notre périmètre couvre les installations neuves comme les projets de mise en conformité ou de revamping. Chaque prestation est construite autour des contraintes techniques et budgétaires spécifiques du client.",items:["CCTV & systèmes de vidéosurveillance industrielle et urbaine","Électricité industrielle — HTB, HTA, BT : postes, boucles, tableaux","Automatisme & Instrumentation — P&ID, boucles de régulation, DCS/PLC","Fire Fighting & Fire Alarm — détection, extinction automatique","Études pluridisciplinaires intégrées","Solutions contractuelles — forfait & dépense contrôlée","Travaux neufs et construction industrielle"]},
  {num:"02",title:"Supervision & Gestion de Projets",desc:"Coordonner, suivre, livrer dans les règles",body:"Nos équipes assurent la coordination des corps de métier, le contrôle des délais et des budgets, et la conformité des livrables — avec un reporting clair et régulier. Sur des projets multi-sites, notre management de programme garantit une vision globale.",items:["Supervision de travaux — OPC, DET, coordination de chantier","Management HSE : Hygiène, Sécurité, Environnement","Management de programmes & projets complexes","Coordination des interfaces techniques multi-lots","Contrôle des coûts, planning et gestion des aléas","Reporting projet et tableaux de bord client"]},
  {num:"03",title:"Ingénierie & Ressources Techniques",desc:"Les bons profils, au bon moment",body:"SII met à disposition des clients des ressources techniques qualifiées, capables d'intervenir en assistance technique intégrée ou en autonomie dans l'équipe projet. Nos profils couvrent toutes les fonctions clés, du bureau d'études au terrain.",items:["Ingénieurs d'études et ingénieurs de chantier EIA","Techniciens spécialisés — instrumentation, électricité, automatisme","Dessinateurs CAO / DAO et ingénieurs maquette","Directeurs et responsables de construction","Préparateurs méthodes et planification","Profils junior à senior, selon le niveau requis"]},
  {num:"04",title:"Conseil & Assistance Technique",desc:"Un regard technique indépendant, orienté résultats",body:"Notre pôle conseil accompagne les directions techniques dans leurs arbitrages stratégiques — choix de solutions, sélection de prestataires, optimisation d'un DCE. Nos experts interviennent de manière ponctuelle ou continue, avec un positionnement neutre.",items:["Conseil technique en dépense contrôlée","Assistance technique intégrée aux équipes client","Experts métier — électricité, automatisme, instrumentation","Chefs de projets et PMO mis à disposition","Études de faisabilité technico-économiques","Diagnostics et audits techniques d'installations existantes"]},
];

function Services() {
  const [open, setOpen] = useState(0);
  return (
    <section id="services" style={{background:C.navy,position:"relative"}}>
      <div style={{padding:"8rem 5vw",maxWidth:1500,margin:"0 auto"}}>
        <div className="srv-intro" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4rem",alignItems:"end",marginBottom:"4rem"}}>
          <div>
            <Eyebrow text="Nos Domaines d'Intervention" />
            <h2 className="reveal" style={{fontFamily:"'Cormorant Garamond'",fontSize:"clamp(2.4rem,4vw,4.5rem)",fontWeight:300,lineHeight:1.1,color:C.white,marginTop:"1rem"}}>
              Un savoir-faire <em style={{fontStyle:"italic",color:C.bronzeL}}>complet</em>,<br/>de l'étude au chantier
            </h2>
          </div>
          <p className="reveal" style={{fontSize:".93rem",lineHeight:1.85,color:"rgba(255,255,255,.4)"}}>
            SII intervient sur <strong style={{color:C.white,fontWeight:400}}>l'ensemble de la chaîne de projet industriel</strong> — des études préliminaires jusqu'à la supervision des travaux et la mise en service.
          </p>
        </div>

        {/* Engrenages déco */}
        <div style={{position:"absolute",right:"4vw",top:"6rem",opacity:.08,pointerEvents:"none"}}>
          <svg width="180" height="180" viewBox="0 0 180 180">
            <GearDeco x={90} y={90} r={55} speed={25} opacity={1} />
            <GearDeco x={90} y={90} r={26} speed={15} reverse opacity={1} />
          </svg>
        </div>

        <div className="reveal" style={{borderTop:"1px solid rgba(255,255,255,.07)"}}>
          {SERVICES.map((s,i)=>(
            <AccItem key={i} {...s} isOpen={open===i} onToggle={()=>setOpen(open===i?-1:i)} />
          ))}
        </div>
      </div>
      <ElectricCables light />
    </section>
  );
}

function AccItem({num,title,desc,body,items,isOpen,onToggle}) {
  return (
    <div style={{borderBottom:"1px solid rgba(255,255,255,.07)"}}>
      <div onClick={onToggle} style={{display:"grid",gridTemplateColumns:"2.5rem 1fr 2rem",alignItems:"center",gap:"2rem",padding:"1.8rem 0",cursor:"pointer"}}>
        <span style={{fontFamily:"'DM Mono'",fontSize:".6rem",letterSpacing:".2em",color:"rgba(255,255,255,.2)"}}>{num}</span>
        <span style={{fontFamily:"'Cormorant Garamond'",fontSize:"clamp(1.2rem,1.8vw,1.75rem)",fontWeight:300,color:isOpen?C.bronzeL:C.white,transition:"color .3s"}}>{title}</span>
        <div style={{width:30,height:30,border:`1px solid ${isOpen?C.bronze:"rgba(255,255,255,.12)"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transform:isOpen?"rotate(45deg)":"none",background:isOpen?C.bronze:"transparent",transition:"all .5s cubic-bezier(.16,1,.3,1)"}}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </div>
      </div>
      <div style={{maxHeight:isOpen?900:0,overflow:"hidden",transition:"max-height .65s cubic-bezier(.16,1,.3,1)"}}>
        <div className="acc-inner" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3rem",padding:"0 0 2.5rem 4.5rem"}}>
          <div>
            <strong style={{display:"block",fontFamily:"'Cormorant Garamond'",fontSize:"1.15rem",fontWeight:300,color:C.white,marginBottom:".7rem"}}>{desc}</strong>
            <p style={{fontSize:".88rem",lineHeight:1.85,color:"rgba(255,255,255,.42)"}}>{body}</p>
            <div style={{marginTop:"1.5rem"}}>
              <div className="media-slot" style={{aspectRatio:"16/8"}}>
                <span style={{fontSize:"1.5rem",opacity:.25}}>📷</span>
                <span style={{fontFamily:"'DM Mono'",fontSize:".58rem",letterSpacing:".18em",textTransform:"uppercase",color:"rgba(255,255,255,.3)"}}>Photo — {title}</span>
              </div>
            </div>
          </div>
          <ul style={{listStyle:"none"}}>
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
    {label:"Phase 01 — Amont",title:"Planification & Études",items:["Élaboration de plans directeurs","Diagnostics techniques (DIAG)","Études de faisabilité technico-économiques","Études de conception et avant-projets","Optimisation des dossiers d'appel d'offres (DCE-ACT)","Contrôle et visa des études d'exécution"]},
    {label:"Phase 02 — Réalisation",title:"Exécution & Mise en Service",items:["Pilotage et supervision des travaux (OPC, DET)","Coordination et gestion des interfaces multi-lots","Réception FAT (usine) et SAT (site)","Commissioning et mise en service","Assistance au démarrage et à l'exploitation","Projets de mise en conformité & revamping"]},
  ];
  const specs = [
    {n:"01",title:"Électricité HTB · HTA · BT",body:"Études, installation et mise en conformité de postes de transformation, tableaux TGBT, boucles HTA et distribution BT industrielle."},
    {n:"02",title:"Automatisme & Instrumentation",body:"Systèmes de contrôle-commande, boucles de régulation, architectures DCS et PLC, instrumentation de process industriel."},
    {n:"03",title:"Protection Incendie",body:"Détection incendie, extinctions automatiques — sprinklers, CO₂, FM-200 — conformité APSAD et NFPA."},
    {n:"04",title:"CCTV & Sécurité",body:"Conception et déploiement de systèmes de vidéoprotection industrielle et urbaine, intégrés aux centres de supervision."},
  ];

  return (
    <section id="missions" style={{background:C.smoke,position:"relative"}}>
      <div style={{padding:"8rem 5vw",maxWidth:1500,margin:"0 auto"}}>
        <Eyebrow text="Nos Missions" />
        <h2 className="reveal" style={{fontFamily:"'Cormorant Garamond'",fontSize:"clamp(2.4rem,4vw,4.5rem)",fontWeight:300,lineHeight:1.1,marginTop:"1rem"}}>
          Présents à <em style={{fontStyle:"italic",color:C.bronze}}>chaque phase</em><br/>du cycle de vie du projet
        </h2>
        <div className="reveal miss-phases" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:C.rule,marginTop:"4rem"}}>
          {phases.map((p,i)=>(
            <div key={i} className="mphase">
              <div className="mphase-bar" />
              <div style={{fontFamily:"'DM Mono'",fontSize:".62rem",letterSpacing:".24em",textTransform:"uppercase",color:C.bronze,marginBottom:"1rem"}}>{p.label}</div>
              <h3 style={{fontFamily:"'Cormorant Garamond'",fontSize:"1.6rem",fontWeight:300,marginBottom:"1.3rem"}}>{p.title}</h3>
              <ul style={{listStyle:"none"}}>
                {p.items.map((item,j)=>(
                  <li key={j} style={{padding:".6rem 0",borderBottom:`1px solid ${C.navy}12`,fontSize:".87rem",color:`${C.navy}82`,display:"flex",alignItems:"center",gap:10}}>
                    <span style={{width:14,height:1,background:`${C.navy}28`,flexShrink:0,display:"block"}} />{item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="reveal specs-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:C.rule,marginTop:"3rem"}}>
          {specs.map((s,i)=>(
            <div key={i} className="spec">
              <div style={{fontFamily:"'Cormorant Garamond'",fontSize:"3.2rem",fontWeight:600,lineHeight:1,color:C.navy,opacity:.06}}>{s.n}</div>
              <div style={{fontFamily:"'Cormorant Garamond'",fontSize:"1.15rem",fontWeight:600,margin:".9rem 0 .4rem"}}>{s.title}</div>
              <div style={{fontSize:".83rem",lineHeight:1.7,color:`${C.navy}82`}}>{s.body}</div>
              <div className="spec-bar" />
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
  {n:"01",client:"OCP Group",name:"Hall de Stockage Automatisé",desc:"Supervision et coordination complète d'un projet d'automatisation des systèmes de stockage industriel. Mission couvrant la planification opérationnelle, la coordination des entreprises et le suivi de la mise en service.",tag:"Automatisation · Supervision",budget:"56",dur:"18"},
  {n:"02",client:"OCP Group",name:"Programme Détection & Protection Incendie",desc:"Étude et installation d'un programme de grande envergure couvrant les installations de détection et protection incendie du Groupe OCP. Mise en conformité NFPA et APSAD sur plusieurs sites en parallèle.",tag:"Fire Safety · Mise en Conformité",budget:"240",dur:"24"},
  {n:"03",client:"OCP Group",name:"Réhabilitation des Installations Incendie",desc:"Réhabilitation complète des systèmes de protection incendie sur plusieurs sites OCP. Remplacement et modernisation des équipements, intégration aux systèmes de supervision centralisée.",tag:"Réhabilitation · Installation",budget:"212",dur:"24"},
  {n:"04",client:"Client Industriel",name:"Poste Électrique MT/BT — Distribution Énergétique",desc:"Gestion multi-métiers d'un projet de mise en conformité et d'optimisation de la distribution énergétique. Études, fourniture et installation de postes MT/BT, coordination des interfaces techniques.",tag:"Électricité Industrielle · Distribution",budget:"34",dur:"14"},
  {n:"05",client:"Ville de Fès",name:"Vidéoprotection Urbaine — Fès",desc:"Conception et déploiement d'un système complet de vidéoprotection urbaine. Infrastructure de caméras intelligentes, centres de supervision et liaisons de transmission sécurisées.",tag:"CCTV · Sécurisation Urbaine",budget:"8",dur:"12"},
];

function Projects() {
  return (
    <section id="projets" style={{background:C.white,position:"relative"}}>
      <div style={{padding:"8rem 5vw",maxWidth:1500,margin:"0 auto"}}>
        <Eyebrow text="Références" />
        <h2 className="reveal" style={{fontFamily:"'Cormorant Garamond'",fontSize:"clamp(2.4rem,4vw,4.5rem)",fontWeight:300,lineHeight:1.1,marginTop:"1rem"}}>
          Projets réalisés<br/>par <em style={{fontStyle:"italic",color:C.bronze}}>notre équipe</em>
        </h2>
        <p className="reveal" style={{marginTop:"1rem",fontSize:".86rem",color:`${C.navy}80`,maxWidth:560,lineHeight:1.8}}>
          Les références ci-dessous ont été réalisées par les membres fondateurs et cadres de SII dans le cadre de leurs missions antérieures.
        </p>
        <div style={{marginTop:"3.5rem",borderTop:`1px solid ${C.rule}`}}>
          {PROJS.map((p,i)=><ProjRow key={i} {...p} idx={i} />)}
        </div>
      </div>
    </section>
  );
}

function ProjRow({n,client,name,desc,tag,budget,dur,idx}) {
  const [hov,setHov] = useState(false);
  return (
    <div className={`reveal proj-row d${Math.min(idx,4)}`}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{display:"grid",gridTemplateColumns:"2rem 1fr 180px",gap:"2.5rem",alignItems:"start",padding:`2.4rem ${hov?"1.2rem":"0"}`,borderBottom:`1px solid ${C.rule}`}}>
      <span style={{fontFamily:"'DM Mono'",fontSize:".6rem",letterSpacing:".2em",color:`${C.navy}28`,paddingTop:".3rem"}}>{n}</span>
      <div>
        <div style={{fontFamily:"'DM Mono'",fontSize:".6rem",letterSpacing:".2em",textTransform:"uppercase",color:C.bronze,marginBottom:".4rem"}}>{client}</div>
        <h3 style={{fontFamily:"'Cormorant Garamond'",fontSize:"clamp(1.2rem,1.7vw,1.7rem)",fontWeight:400,lineHeight:1.2,marginBottom:".6rem"}}>{name}</h3>
        <p style={{fontSize:".86rem",color:`${C.navy}82`,lineHeight:1.72,maxWidth:520}}>{desc}</p>
        <div style={{marginTop:"1rem",maxWidth:380}}>
          <div className="media-slot" style={{aspectRatio:"16/6"}}>
            <span style={{fontSize:"1.2rem",opacity:.25}}>📷</span>
            <span style={{fontFamily:"'DM Mono'",fontSize:".58rem",letterSpacing:".18em",textTransform:"uppercase",color:"rgba(40,40,60,.35)"}}>Photo du projet</span>
          </div>
        </div>
        <span style={{display:"inline-block",marginTop:".8rem",padding:".26rem .75rem",border:`1px solid ${C.navy}18`,fontFamily:"'DM Mono'",fontSize:".58rem",letterSpacing:".12em",textTransform:"uppercase",color:`${C.navy}55`}}>{tag}</span>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"1.2rem",alignItems:"flex-end"}}>
        <div>
          <div style={{fontFamily:"'Cormorant Garamond'",fontSize:"1.9rem",fontWeight:600,lineHeight:1,color:C.navy,textAlign:"right"}}>{budget} <span style={{fontSize:".85rem",color:C.bronze}}>MMAD</span></div>
          <div style={{fontFamily:"'DM Mono'",fontSize:".58rem",letterSpacing:".15em",textTransform:"uppercase",color:`${C.navy}50`,marginTop:".2rem",textAlign:"right"}}>Valeur</div>
        </div>
        <div>
          <div style={{fontFamily:"'Cormorant Garamond'",fontSize:"1.9rem",fontWeight:600,lineHeight:1,color:C.navy,textAlign:"right"}}>{dur} <span style={{fontSize:".85rem",color:C.bronze}}>mois</span></div>
          <div style={{fontFamily:"'DM Mono'",fontSize:".58rem",letterSpacing:".15em",textTransform:"uppercase",color:`${C.navy}50`,marginTop:".2rem",textAlign:"right"}}>Durée</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   CONTACT
───────────────────────────────────────── */
function Contact() {
  const [hovBtn,setHovBtn] = useState(false);
  return (
    <section id="contact" style={{background:C.cream,position:"relative"}}>
      <div style={{padding:"8rem 5vw",maxWidth:1500,margin:"0 auto"}}>
        <div className="contact-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6rem",alignItems:"start"}}>
          <div>
            <Eyebrow text="Travaillons ensemble" />
            <h2 className="reveal" style={{fontFamily:"'Cormorant Garamond'",fontSize:"clamp(2.2rem,3.5vw,4rem)",fontWeight:300,lineHeight:1.12,marginTop:"1.8rem"}}>
              Votre projet mérite<br/>une <em style={{fontStyle:"italic",color:C.bronze}}>équipe</em><br/>à sa mesure
            </h2>
            <p className="reveal" style={{marginTop:"2rem",fontSize:".95rem",lineHeight:1.85,color:`${C.navy}82`}}>
              Que vous soyez en phase d'étude, en cours d'appel d'offres ou en recherche d'un partenaire technique pour la réalisation, l'équipe SII est disponible pour analyser votre besoin et vous proposer une réponse adaptée.
            </p>
          </div>
          <div className="reveal">
            <div style={{background:C.white,padding:"3rem",borderTop:`3px solid ${C.navy}`}}>
              <h3 style={{fontFamily:"'Cormorant Garamond'",fontSize:"1.6rem",fontWeight:400,marginBottom:"2rem"}}>Nous contacter</h3>
              {[
                {lbl:"Email professionnel",val:<a href="mailto:contact@si-i.ma" style={{color:C.bronze,textDecoration:"none"}}>contact@si-i.ma</a>},
                {lbl:"Site web",val:<a href="http://www.si-i.ma" style={{color:C.bronze,textDecoration:"none"}}>www.si-i.ma</a>},
                {lbl:"Domaines d'intervention",val:<span style={{fontSize:".86rem",lineHeight:1.65,color:`${C.navy}80`}}>Électricité industrielle · Automatisme<br/>Instrumentation · Fire Safety · CCTV</span>},
                {lbl:"Marchés",val:"Maroc — Afrique"},
              ].map((l,i,arr)=>(
                <div key={i} style={{display:"flex",flexDirection:"column",gap:".3rem",padding:"1.2rem 0",borderBottom:i<arr.length-1?`1px solid ${C.rule}`:"none"}}>
                  <span style={{fontFamily:"'DM Mono'",fontSize:".58rem",letterSpacing:".22em",textTransform:"uppercase",color:`${C.navy}50`}}>{l.lbl}</span>
                  <span style={{fontSize:".95rem",color:C.navy}}>{l.val}</span>
                </div>
              ))}
              <a href="mailto:contact@si-i.ma"
                className="btn-send"
                onMouseEnter={()=>setHovBtn(true)}
                onMouseLeave={()=>setHovBtn(false)}
                style={{background:hovBtn?C.navy2:C.navy}}
              >
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
    <footer style={{background:C.navy,padding:"2.2rem 5vw",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem"}}>
      <img src={logo} alt="SII" style={{height:38,width:"auto",filter:"brightness(0) invert(1)",opacity:.55}} />
      <span style={{fontFamily:"'Cormorant Garamond'",fontStyle:"italic",fontSize:".88rem",color:"rgba(255,255,255,.28)"}}>Construisons l'avenir, projet par projet.</span>
      <span style={{fontFamily:"'DM Mono'",fontSize:".6rem",letterSpacing:".12em",color:"rgba(255,255,255,.2)"}}>© 2026 Société d'Ingénierie et d'Innovation</span>
    </footer>
  );
}

/* ─────────────────────────────────────────
   APP
───────────────────────────────────────── */
export default function App() {
  useReveal();
  useEffect(() => {
    const prog = document.getElementById("sii-progress");
    if (!prog) return;
    const fn = () => {
      const t = document.body.scrollHeight - window.innerHeight;
      if (t > 0) prog.style.width = (window.scrollY / t * 100) + "%";
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <style>{G}</style>
      <div id="sii-progress" style={{position:"fixed",top:0,left:0,zIndex:9999,height:2,width:"0%",background:`linear-gradient(90deg,${C.navy},${C.steel})`,transition:"width .08s linear",pointerEvents:"none"}} />
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
