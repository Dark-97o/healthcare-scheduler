import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  .hero-wrap {
    min-height: 100vh;
    background: #020d0d;
    font-family: 'Rajdhani', sans-serif;
    overflow: hidden;
    position: relative;
  }

  .bg-canvas {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    width: 100%;
    height: 100%;
  }

  .grid-overlay {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,255,180,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,180,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    z-index: 1;
    animation: gridPulse 4s ease-in-out infinite;
  }

  @keyframes gridPulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  .hero-content {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
  }

  .pulse-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 500px;
    height: 500px;
    border-radius: 50%;
    border: 1px solid rgba(0,255,200,0.08);
    animation: expandRing 3s ease-out infinite;
    z-index: 2;
    pointer-events: none;
  }
  .pulse-ring:nth-child(2) { animation-delay: 1s; width: 700px; height: 700px; }
  .pulse-ring:nth-child(3) { animation-delay: 2s; width: 900px; height: 900px; }

  @keyframes expandRing {
    0% { opacity: 0.6; transform: translate(-50%,-50%) scale(0.8); }
    100% { opacity: 0; transform: translate(-50%,-50%) scale(1.2); }
  }

  .version-badge {
    font-family: 'Orbitron', monospace;
    font-size: 10px;
    letter-spacing: 4px;
    color: #00e5ff;
    text-transform: uppercase;
    border: 1px solid rgba(0,229,255,0.3);
    padding: 4px 14px;
    border-radius: 2px;
    margin-bottom: 1.5rem;
    background: rgba(0,229,255,0.05);
    animation: fadeDown 0.8s 0.1s ease both;
  }

  .logo-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    animation: fadeDown 0.8s 0.15s ease both;
  }

  .logo-icon-svg {
    width: 52px;
    height: 52px;
    filter: drop-shadow(0 0 10px #00ffb4) drop-shadow(0 0 20px #00e5ff);
    animation: iconPulse 2s ease-in-out infinite;
  }

  @keyframes iconPulse {
    0%, 100% { filter: drop-shadow(0 0 8px #00ffb4) drop-shadow(0 0 16px #00e5ff); }
    50% { filter: drop-shadow(0 0 20px #00ffb4) drop-shadow(0 0 40px #00e5ff); }
  }

  .hero-title {
    font-family: 'Orbitron', monospace;
    font-size: clamp(28px, 5vw, 52px);
    font-weight: 900;
    text-align: center;
    line-height: 1.1;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #00ffb4 0%, #00e5ff 50%, #00ffb4 100%);
    background-size: 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: fadeDown 0.8s 0.2s ease both, shimmer 3s linear infinite;
  }

  @keyframes shimmer {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }

  .hero-sub {
    font-size: 16px;
    color: rgba(0,229,255,0.6);
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 2.5rem;
    animation: fadeDown 0.8s 0.3s ease both;
  }

  .heartbeat-line {
    width: 280px;
    height: 40px;
    margin-bottom: 2.5rem;
    animation: fadeDown 0.8s 0.35s ease both;
  }

  .hb-path {
    stroke-dasharray: 600;
    stroke-dashoffset: 600;
    animation: drawLine 2s 1s ease forwards, hbPulse 2.5s 3s ease-in-out infinite;
  }

  @keyframes drawLine { to { stroke-dashoffset: 0; } }

  @keyframes hbPulse {
    0%, 100% { opacity: 1; filter: drop-shadow(0 0 3px #00ffb4); }
    50% { opacity: 0.5; filter: drop-shadow(0 0 8px #00ffb4); }
  }

  .stats-row {
    display: flex;
    gap: 2rem;
    margin-bottom: 3rem;
    animation: fadeDown 0.8s 0.4s ease both;
  }

  .stat-item { text-align: center; }

  .stat-num {
    font-family: 'Orbitron', monospace;
    font-size: 28px;
    font-weight: 700;
    color: #00ffb4;
    text-shadow: 0 0 20px rgba(0,255,180,0.6);
    display: block;
  }

  .stat-label {
    font-size: 11px;
    letter-spacing: 2px;
    color: rgba(0,229,255,0.5);
    text-transform: uppercase;
  }

  .stat-divider {
    width: 1px;
    background: linear-gradient(to bottom, transparent, rgba(0,229,255,0.3), transparent);
  }

  .nav-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    max-width: 560px;
    width: 100%;
    animation: fadeUp 0.8s 0.5s ease both;
  }

  .nav-card {
    position: relative;
    background: rgba(0,20,20,0.8);
    border: 1px solid rgba(0,255,180,0.2);
    border-radius: 4px;
    padding: 1.4rem 1.2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    overflow: hidden;
    text-decoration: none;
    display: block;
    backdrop-filter: blur(10px);
  }

  .nav-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(0,255,180,0.08) 0%, rgba(0,229,255,0.03) 100%);
    opacity: 0;
    transition: opacity 0.3s;
  }

  .nav-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, #00ffb4, #00e5ff);
    transform: scaleX(0);
    transition: transform 0.3s ease;
    transform-origin: left;
  }

  .nav-card:hover {
    border-color: rgba(0,255,180,0.6);
    transform: translateY(-3px);
    box-shadow: 0 8px 40px rgba(0,255,180,0.15), 0 0 0 1px rgba(0,229,255,0.1);
  }

  .nav-card:hover::before { opacity: 1; }
  .nav-card:hover::after { transform: scaleX(1); }

  .nav-card-icon {
    width: 36px;
    height: 36px;
    border-radius: 3px;
    background: rgba(0,229,255,0.1);
    border: 1px solid rgba(0,229,255,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    transition: all 0.3s;
  }

  .nav-card:hover .nav-card-icon {
    background: rgba(0,255,180,0.15);
    border-color: rgba(0,255,180,0.5);
    box-shadow: 0 0 16px rgba(0,255,180,0.2);
  }

  .nav-card-icon svg {
    width: 18px;
    height: 18px;
    stroke: #00e5ff;
    transition: stroke 0.3s;
  }

  .nav-card:hover .nav-card-icon svg { stroke: #00ffb4; }

  .nav-card-title {
    font-family: 'Orbitron', monospace;
    font-size: 13px;
    font-weight: 700;
    color: #e0fffa;
    letter-spacing: 1px;
    margin-bottom: 4px;
  }

  .nav-card-desc {
    font-size: 12px;
    color: rgba(0,229,255,0.5);
    letter-spacing: 0.5px;
  }

  .nav-card-arrow {
    position: absolute;
    top: 1.2rem;
    right: 1rem;
    color: rgba(0,255,180,0.3);
    font-size: 16px;
    transition: all 0.3s;
  }

  .nav-card:hover .nav-card-arrow {
    color: #00ffb4;
    transform: translate(2px,-2px);
  }

  .corner-tl, .corner-br {
    position: absolute;
    width: 10px;
    height: 10px;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .corner-tl { top: 0; left: 0; border-top: 2px solid #00ffb4; border-left: 2px solid #00ffb4; }
  .corner-br { bottom: 0; right: 0; border-bottom: 2px solid #00e5ff; border-right: 2px solid #00e5ff; }
  .nav-card:hover .corner-tl,
  .nav-card:hover .corner-br { opacity: 1; }

  .scan-line {
    position: absolute;
    left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,255,180,0.4), transparent);
    animation: scan 3s linear infinite;
    z-index: 3;
    pointer-events: none;
  }

  @keyframes scan {
    0% { top: 0%; }
    100% { top: 100%; }
  }

  .bottom-bar {
    position: absolute;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 10;
    animation: fadeUp 0.8s 0.8s ease both;
  }

  .status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    animation: dotBlink 1.5s ease-in-out infinite;
  }

  .status-dot:nth-child(1) { background: #00ffb4; }
  .status-dot:nth-child(2) { background: #00e5ff; animation-delay: 0.5s; }
  .status-dot:nth-child(3) { background: rgba(0,255,180,0.4); animation-delay: 1s; }

  @keyframes dotBlink {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.3; transform: scale(0.6); }
  }

  .status-txt {
    font-family: 'Orbitron', monospace;
    font-size: 9px;
    letter-spacing: 3px;
    color: rgba(0,229,255,0.4);
    text-transform: uppercase;
  }

  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let W, H;

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 120 }, () => {
      const reset = () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? "0,255,180" : "0,229,255",
      });
      return reset();
    });

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,255,180,${0.06 * (1 - d / 80)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) {
          Object.assign(p, {
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.5 + 0.3,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            alpha: Math.random() * 0.5 + 0.1,
          });
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="bg-canvas"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}

function CountUp({ target, suffix = "+" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const dur = 1400;
      const steps = Math.ceil(dur / 16);
      const step = Math.ceil(target / steps);
      let current = 0;
      const interval = setInterval(() => {
        current = Math.min(current + step, target);
        setVal(current);
        if (current >= target) clearInterval(interval);
      }, 16);
      return () => clearInterval(interval);
    }, 800);
    return () => clearTimeout(timeout);
  }, [target]);
  return <>{val.toLocaleString()}{suffix}</>;
}

const NAV_ITEMS = [
  {
    to: "/doctor/register",
    title: "Register Doctor",
    desc: "Onboard specialists",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
        <path d="M20 21a8 8 0 1 0-16 0" />
        <path d="M16 14h4M18 12v4" />
      </svg>
    ),
  },
  {
    to: "/patient/register",
    title: "Register Patient",
    desc: "Create patient profile",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
        <path d="M20 21a8 8 0 1 0-16 0" />
        <path d="M9 17l2 2 4-4" />
      </svg>
    ),
  },
  {
    to: "/book",
    title: "Book Appointment",
    desc: "Schedule a visit",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
        <path d="M12 14v4M10 16h4" />
      </svg>
    ),
  },
  {
    to: "/dashboard",
    title: "View Dashboard",
    desc: "All appointments",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
];

function Home() {
  return (
    <>
      <style>{styles}</style>
      <div className="hero-wrap">
        <ParticleCanvas />
        <div className="grid-overlay" />
        <div className="scan-line" />
        <div className="pulse-ring" />
        <div className="pulse-ring" />
        <div className="pulse-ring" />

        <div className="hero-content">
          <div className="version-badge">v2.4 · AI-Powered Platform</div>

          <div className="logo-wrap">
            <svg className="logo-icon-svg" viewBox="0 0 52 52" fill="none">
              <rect x="2" y="2" width="48" height="48" rx="8" stroke="#00ffb4" strokeWidth="1.5" />
              <path d="M26 12 L26 40 M14 26 L38 26" stroke="#00e5ff" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="26" cy="26" r="6" stroke="#00ffb4" strokeWidth="1.5" />
              <circle cx="26" cy="26" r="10" stroke="rgba(0,255,180,0.3)" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="26" cy="12" r="3" fill="#00ffb4" />
              <circle cx="26" cy="40" r="3" fill="#00e5ff" />
              <circle cx="14" cy="26" r="3" fill="#00e5ff" />
              <circle cx="38" cy="26" r="3" fill="#00ffb4" />
            </svg>
          </div>

          <h1 className="hero-title">
            Smart Healthcare
            <br />
            Scheduler
          </h1>
          <p className="hero-sub">Next-Gen Medical Intelligence</p>

          <svg className="heartbeat-line" viewBox="0 0 280 40" fill="none">
            <defs>
              <linearGradient id="hbGrad" x1="0" y1="0" x2="280" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00ffb4" stopOpacity="0" />
                <stop offset="30%" stopColor="#00ffb4" />
                <stop offset="70%" stopColor="#00e5ff" />
                <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              className="hb-path"
              d="M0 20 L40 20 L50 20 L58 4 L66 36 L74 20 L80 20 L88 12 L96 28 L104 20 L120 20 L128 8 L136 32 L144 20 L160 20 L168 4 L176 36 L184 20 L200 20 L208 14 L216 26 L224 20 L240 20 L280 20"
              stroke="url(#hbGrad)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-num"><CountUp target={248} /></span>
              <span className="stat-label">Doctors</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-num"><CountUp target={3890} /></span>
              <span className="stat-label">Patients</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-num"><CountUp target={12400} /></span>
              <span className="stat-label">Appointments</span>
            </div>
          </div>

          <div className="nav-grid">
            {NAV_ITEMS.map((item) => (
              <Link key={item.to} to={item.to} className="nav-card">
                <div className="corner-tl" />
                <div className="corner-br" />
                <div className="nav-card-icon">{item.icon}</div>
                <div className="nav-card-title">{item.title}</div>
                <div className="nav-card-desc">{item.desc}</div>
                <span className="nav-card-arrow">↗</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bottom-bar">
          <div className="status-dot" />
          <div className="status-dot" />
          <div className="status-dot" />
          <span className="status-txt">System Online · Secure Connection</span>
        </div>
      </div>
    </>
  );
}

export default Home;