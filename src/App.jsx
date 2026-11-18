import { useState, useEffect, useRef, Fragment } from "react";
import { NAME, TREASURES, DECOR, LETTER, QS, COUPONS } from "./data.js";

const RADIUS = 9;
const PAGES = ["map", "quiz", "sky", "lantern", "scratch", "final"];
const ICONS = ["🗺️", "💬", "✨", "🏮", "🎟️", "🎁"];

const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
};

function heat(d) {
  if (d < 17) return { t: "Burning hot! 🔥", c: "#ff5d8f" };
  if (d < 28) return { t: "Warm ☀️", c: "#ffb02e" };
  if (d < 42) return { t: "Cool 🌊", c: "#9be7ff" };
  return { t: "Freezing ❄️", c: "#ffffff" };
}

function Confetti({ run }) {
  const ref = useRef();
  useEffect(() => {
    if (!run) return;
    const c = ref.current, x = c.getContext("2d");
    c.width = innerWidth; c.height = innerHeight;
    const cols = ["#ffb02e", "#ff5d8f", "#2ec4b6", "#fff4e0", "#8a5cf6"];
    const p = Array.from({ length: 170 }, () => ({
      x: Math.random() * c.width, y: -20 - Math.random() * c.height * 0.6, r: 4 + Math.random() * 6,
      vy: 2 + Math.random() * 4, vx: -1.5 + Math.random() * 3, c: cols[(Math.random() * 5) | 0],
      a: Math.random() * 6, heart: Math.random() < 0.25,
    }));
    let id, t = 0;
    const loop = () => {
      x.clearRect(0, 0, c.width, c.height); t++;
      p.forEach((q) => {
        q.y += q.vy; q.x += q.vx + Math.sin((q.a += 0.05)); x.fillStyle = q.c;
        if (q.heart) { x.font = "18px serif"; x.fillText("❤", q.x, q.y); } else x.fillRect(q.x, q.y, q.r, q.r * 1.6);
      });
      if (t < 650) id = requestAnimationFrame(loop); else x.clearRect(0, 0, c.width, c.height);
    };
    loop();
    return () => cancelAnimationFrame(id);
  }, [run]);
  return <canvas ref={ref} className="cf" aria-hidden="true" />;
}

function Hearts() {
  return (
    <div className="hearts" aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <i key={i} style={{ left: i * 8.3 + 3 + "%", fontSize: 14 + (i % 4) * 6, animationDuration: 9 + ((i % 5) * 3) + "s", animationDelay: -i * 1.7 + "s" }}>
          {i % 3 ? "💗" : "✨"}
        </i>
      ))}
    </div>
  );
}

/* Page 1: treasure map */
function TreasureMap({ next }) {
  const [st, setSt] = useState(() => store.get("ayishu-map", null) || { started: false, found: [], digs: [] });
  const [heatMsg, setHeatMsg] = useState({ t: "Tap anywhere on the island to dig!", c: "#fff4e0" });
  const [reveal, setReveal] = useState(null);
  const update = (n) => { setSt(n); store.set("ayishu-map", n); };
  const done = st.found.length === TREASURES.length;
  const left = TREASURES.length - st.found.length;

  const dig = (e) => {
    if (reveal || done) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100, y = ((e.clientY - r.top) / r.height) * 100;
    let best = Infinity, bi = -1;
    TREASURES.forEach((t, i) => {
      if (st.found.includes(i)) return;
      const d = Math.hypot(t.x - x, (t.y - y) * 1.05);
      if (d < best) { best = d; bi = i; }
    });
    if (best < RADIUS) {
      update({ ...st, found: [...st.found, bi], digs: st.digs.filter((d) => Math.hypot(d.x - TREASURES[bi].x, d.y - TREASURES[bi].y) > RADIUS) });
      setReveal(TREASURES[bi]);
      setHeatMsg({ t: "You found something! 🎉", c: "#2ec4b6" });
    } else {
      const hh = heat(best);
      setHeatMsg(hh);
      update({ ...st, digs: [...st.digs.slice(-11), { x, y, c: hh.c }] });
    }
  };

  if (!st.started) {
    return (
      <main className="wrap">
        <Hearts />
        <div className="card">
          <h1 className="big">Ayishu’s treasure map 🗺️</h1>
          <p className="sub">A little island, five hidden treasures and one special chest. Tap the map to dig. The map tells you how close you are: freezing, cool, warm or burning hot.</p>
          <button onClick={() => update({ ...st, started: true })}>Begin the hunt</button>
        </div>
      </main>
    );
  }

  return (
    <main className="wrap">
      <Hearts />
      <div className="gems" aria-label="Treasures found">
        {TREASURES.map((t, i) => (
          <div key={i} className={"gem" + (st.found.includes(i) ? " on" : "")}>{st.found.includes(i) ? t.icon : "?"}</div>
        ))}
      </div>
      {!done && <div className="heat" style={{ color: heatMsg.c }} aria-live="polite">{heatMsg.t}</div>}
      {!done && (
        <div className="map" onClick={dig} role="button" aria-label="Treasure map. Tap to dig.">
          {DECOR.map((d, i) => <span key={i} className="deco" style={{ left: d[0] + "%", top: d[1] + "%" }}>{d[2]}</span>)}
          {st.digs.map((d, i) => <span key={"d" + i} className="mark" style={{ left: d.x + "%", top: d.y + "%", color: d.c }}>✕</span>)}
          {st.found.map((i) => <span key={"f" + i} className="found" style={{ left: TREASURES[i].x + "%", top: TREASURES[i].y + "%" }}>{TREASURES[i].icon}</span>)}
        </div>
      )}
      {reveal && (
        <div className="reveal">
          <span style={{ fontSize: 44 }}>{reveal.icon}</span>
          <b>{reveal.title}</b>
          <span>{reveal.msg}</span>
          <button onClick={() => { setReveal(null); setHeatMsg({ t: left ? `Keep digging! ${left} left` : "All found!", c: "#fff4e0" }); }}>
            {done ? "Continue" : "Keep hunting"}
          </button>
        </div>
      )}
      {done && !reveal && (
        <div className="card">
          <h2>Map complete! 🎉</h2>
          <p className="sub">You found every treasure. Four more surprises are waiting for you.</p>
          <button onClick={next}>Next: heart questions</button>
        </div>
      )}
    </main>
  );
}

/* Page 2: romantic questions */
function Quiz({ next }) {
  const [i, setI] = useState(0), [r, setR] = useState(null), [txt, setTxt] = useState("");
  const q = QS[i], last = i + 1 >= QS.length;
  const cont = () => { setR(null); setTxt(""); last ? next() : setI(i + 1); };
  return (
    <div className="card">
      <p className="sub">Question {i + 1} of {QS.length}. There are no wrong answers.</p>
      <h2 className="q">{q.q}</h2>
      {!r && (q.text ? (
        <Fragment>
          <input value={txt} maxLength={80} placeholder="Love feels like…" aria-label="Your answer" onChange={(e) => setTxt(e.target.value)} />
          <button onClick={() => txt.trim() && setR(`“${txt.trim()}”. ${q.r}`)}>Share</button>
        </Fragment>
      ) : q.o.map((o) => <button key={o} className="opt" onClick={() => setR(q.r)}>{o}</button>))}
      {r && (
        <div className="reveal">
          <span>{r}</span>
          <button onClick={cont}>{last ? "Continue" : "Next question"}</button>
        </div>
      )}
    </div>
  );
}

/* Page 3: connect the stars */
const STARS = [[50, 30], [36, 14], [18, 16], [8, 34], [22, 58], [50, 82], [78, 58], [92, 34], [82, 16], [64, 14]];
function Sky({ next }) {
  const [n, setN] = useState(0), [msg, setMsg] = useState("Tap the glowing star to begin.");
  const done = n >= STARS.length, pts = STARS.slice(0, n);
  const tap = (i) => {
    if (done) return;
    if (i === n) { setN(n + 1); setMsg(n + 1 === STARS.length ? "A heart written in the stars, just for you. 💖" : "Beautiful. Keep going…"); }
    else setMsg("Follow the glowing star.");
  };
  return (
    <div className="card">
      <h2 className="q">Write a heart in the stars</h2>
      <p className="sub">Connect the stars in order to draw something special.</p>
      <svg viewBox="0 0 100 96" className="sky" aria-label="Star map">
        {pts.slice(1).map((p, i) => <line key={i} x1={pts[i][0]} y1={pts[i][1]} x2={p[0]} y2={p[1]} />)}
        {done && <line x1={STARS[9][0]} y1={STARS[9][1]} x2={STARS[0][0]} y2={STARS[0][1]} />}
        {STARS.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={i === n ? 4 : 2.5} className={"st" + (i < n ? " lit" : "") + (i === n ? " next" : "")} onClick={() => tap(i)} />
        ))}
      </svg>
      <div className="heat" aria-live="polite">{msg}</div>
      {done && <button onClick={next}>Continue</button>}
    </div>
  );
}

/* Page 4: wish lanterns */
function Lanterns({ next }) {
  const [ws, setWs] = useState([]), [t, setT] = useState("");
  const release = () => { if (t.trim() && ws.length < 3) { setWs([...ws, t.trim()]); setT(""); } };
  return (
    <div className="card">
      <h2 className="q">Make a wish</h2>
      <p className="sub">Write a birthday wish and send it into the night sky on a lantern. You can release up to 3.</p>
      <div className="night">
        {ws.map((w, i) => (
          <div key={i} className="lan" style={{ left: 3 + i * 33 + "%", "--b": 52 + (i % 2) * 14 + "%" }}>
            <span>🏮</span><small>{w}</small>
          </div>
        ))}
      </div>
      {ws.length < 3 && <input value={t} maxLength={50} placeholder="I wish…" aria-label="Your wish" onChange={(e) => setT(e.target.value)} onKeyDown={(e) => e.key === "Enter" && release()} />}
      {ws.length < 3 && <button onClick={release}>Release lantern 🏮</button>}
      {ws.length > 0 && <button className={ws.length < 3 ? "ghost" : ""} onClick={next}>Continue</button>}
    </div>
  );
}

/* Page 5: scratch cards */
function ScratchCard({ icon, text, onDone }) {
  const ref = useRef(), down = useRef(false), [open, setOpen] = useState(false);
  useEffect(() => {
    const c = ref.current, x = c.getContext("2d"), g = x.createLinearGradient(0, 0, c.width, c.height);
    g.addColorStop(0, "#ffb02e"); g.addColorStop(1, "#ff5d8f");
    x.fillStyle = g; x.fillRect(0, 0, c.width, c.height);
    x.fillStyle = "#1b1033"; x.font = "700 22px Nunito, sans-serif"; x.textAlign = "center";
    x.fillText("Scratch here ✨", c.width / 2, c.height / 2 + 8);
  }, []);
  const scratch = (e) => {
    if (!down.current) return;
    const c = ref.current, r = c.getBoundingClientRect(), x = c.getContext("2d");
    x.globalCompositeOperation = "destination-out"; x.beginPath();
    x.arc(((e.clientX - r.left) * c.width) / r.width, ((e.clientY - r.top) * c.height) / r.height, 20, 0, 7); x.fill();
  };
  const up = () => {
    down.current = false;
    if (open) return;
    const c = ref.current, d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    let k = 0, tot = 0;
    for (let i = 3; i < d.length; i += 16) { tot++; if (d[i] === 0) k++; }
    if (k / tot > 0.45) { setOpen(true); onDone(); }
  };
  return (
    <div className="coupon">
      <div className="cp"><span style={{ fontSize: 40 }}>{icon}</span><span>{text}</span></div>
      <canvas ref={ref} width={320} height={100} className={"scr" + (open ? " gone" : "")} aria-label="Scratch card"
        onPointerDown={(e) => { down.current = true; e.currentTarget.setPointerCapture(e.pointerId); scratch(e); }}
        onPointerMove={scratch} onPointerUp={up} onPointerCancel={up} />
    </div>
  );
}
function ScratchPage({ next }) {
  const [n, setN] = useState(0);
  return (
    <div className="card">
      <h2 className="q">Your love coupons</h2>
      <p className="sub">Scratch each card with your finger to reveal a gift.</p>
      {COUPONS.map((c, i) => <ScratchCard key={i} icon={c[0]} text={c[1]} onDone={() => setN((v) => v + 1)} />)}
      {n >= COUPONS.length && <button onClick={next}>Open the treasure chest</button>}
    </div>
  );
}

/* Page 6: the chest */
function Finale() {
  const [taps, setTaps] = useState(0), [w, setW] = useState(0);
  const open = taps >= 3;
  const restart = () => { store.set("ayishu-map", null); store.set("ayishu-page", "map"); location.reload(); };
  return (
    <div className="card">
      <h2 className="big">{open ? `Happy Birthday, ${NAME}!` : "The treasure chest"}</h2>
      {!open && <p className="sub">Every surprise is unlocked. Tap the chest 3 times to open it.</p>}
      {!open && <button key={w} className={"chest " + (w ? "wob" : "")} aria-label="Tap the chest" onClick={() => { setTaps(taps + 1); setW(w + 1); }}>{taps < 1 ? "🔒" : taps < 2 ? "🧰" : "📦"}</button>}
      {open && <div className="letter">{LETTER}</div>}
      {open && <button className="ghost" onClick={restart}>Hunt again</button>}
      <Confetti run={open} />
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState(() => store.get("ayishu-page", "map"));
  const go = (p) => { setPage(p); store.set("ayishu-page", p); window.scrollTo(0, 0); };
  const next = () => go(PAGES[PAGES.indexOf(page) + 1]);
  if (page === "map") return <TreasureMap next={next} />;
  const Page = { quiz: Quiz, sky: Sky, lantern: Lanterns, scratch: ScratchPage, final: Finale }[page];
  return (
    <main className="wrap">
      <Hearts />
      <div className="steps">
        {ICONS.map((s, i) => <span key={i} className={i <= PAGES.indexOf(page) ? "on" : ""}>{s}</span>)}
      </div>
      <Page next={next} />
    </main>
  );
}
