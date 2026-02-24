import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 220, 190, ${p.opacity})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');

        :root {
          --bg: #0d0f14;
          --surface: #13161e;
          --border: #1e2330;
          --accent: #63dcbe;
          --accent2: #e05c7a;
          --text: #e8eaf0;
          --muted: #5a607a;
        }

        .nf-root {
          font-family: 'Syne', sans-serif;
          background: var(--bg);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          color: var(--text);
        }

        .nf-canvas {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .nf-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,220,190,0.06) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .nf-center {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Fake chat thread */
        .nf-chat {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 36px;
          width: 320px;
          animation: fadeUp 0.8s 0.1s cubic-bezier(0.16,1,0.3,1) both;
        }

        .nf-bubble {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nf-bubble.right { align-items: flex-end; }
        .nf-bubble.left { align-items: flex-start; }

        .nf-bubble-inner {
          padding: 10px 14px;
          border-radius: 18px;
          font-size: 13px;
          font-family: 'DM Mono', monospace;
          max-width: 220px;
          line-height: 1.5;
          position: relative;
        }

        .nf-bubble.right .nf-bubble-inner {
          background: var(--accent);
          color: #0d0f14;
          border-bottom-right-radius: 4px;
        }

        .nf-bubble.left .nf-bubble-inner {
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text);
          border-bottom-left-radius: 4px;
        }

        .nf-bubble-meta {
          font-size: 10px;
          color: var(--muted);
          font-family: 'DM Mono', monospace;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .nf-failed-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(224, 92, 122, 0.12);
          border: 1px solid rgba(224, 92, 122, 0.3);
          border-radius: 20px;
          padding: 3px 10px;
          font-size: 11px;
          color: var(--accent2);
          font-family: 'DM Mono', monospace;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .nf-failed-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent2);
          animation: pulse 2s ease-in-out infinite;
        }

        /* 404 number */
        .nf-code {
          font-size: clamp(80px, 18vw, 140px);
          font-weight: 800;
          line-height: 1;
          letter-spacing: -6px;
          color: transparent;
          -webkit-text-stroke: 2px var(--border);
          position: relative;
          animation: fadeUp 0.8s 0.2s cubic-bezier(0.16,1,0.3,1) both;
          user-select: none;
        }

        .nf-code::after {
          content: '404';
          position: absolute;
          inset: 0;
          color: transparent;
          -webkit-text-stroke: 0;
          background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          clip-path: polygon(0 0, 40% 0, 60% 100%, 0% 100%);
        }

        .nf-title {
          font-size: clamp(18px, 4vw, 26px);
          font-weight: 700;
          margin-top: 8px;
          color: var(--text);
          letter-spacing: -0.5px;
          animation: fadeUp 0.8s 0.3s cubic-bezier(0.16,1,0.3,1) both;
        }

        .nf-sub {
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          color: var(--muted);
          margin-top: 10px;
          text-align: center;
          max-width: 280px;
          line-height: 1.7;
          animation: fadeUp 0.8s 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }

        .nf-actions {
          display: flex;
          gap: 12px;
          margin-top: 32px;
          animation: fadeUp 0.8s 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }

        .nf-btn {
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          padding: 12px 28px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          letter-spacing: 0.3px;
        }

        .nf-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }

        .nf-btn:active {
          transform: translateY(0);
        }

        .nf-btn-primary {
          background: var(--accent);
          color: #0d0f14;
        }

        .nf-btn-secondary {
          background: transparent;
          color: var(--text);
          border: 1px solid var(--border);
        }

        .nf-btn-secondary:hover {
          border-color: var(--accent);
          color: var(--accent);
        }

        /* decorative lines */
        .nf-line {
          position: absolute;
          background: var(--border);
          pointer-events: none;
        }
        .nf-line-h {
          width: 100vw;
          height: 1px;
          top: 20%;
          left: 0;
          opacity: 0.4;
        }
        .nf-line-h2 {
          width: 100vw;
          height: 1px;
          bottom: 20%;
          left: 0;
          opacity: 0.25;
        }
        .nf-line-v {
          width: 1px;
          height: 100vh;
          top: 0;
          left: 15%;
          opacity: 0.2;
        }
        .nf-line-v2 {
          width: 1px;
          height: 100vh;
          top: 0;
          right: 15%;
          opacity: 0.2;
        }

        /* typing indicator bubble */
        .nf-typing {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 10px 14px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 18px;
          border-bottom-left-radius: 4px;
          width: fit-content;
        }

        .nf-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--muted);
        }

        .nf-dot:nth-child(1) { animation: bounce 1.2s 0s ease-in-out infinite; }
        .nf-dot:nth-child(2) { animation: bounce 1.2s 0.2s ease-in-out infinite; }
        .nf-dot:nth-child(3) { animation: bounce 1.2s 0.4s ease-in-out infinite; }

        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>

      <div className="nf-root">
        <canvas ref={canvasRef} className="nf-canvas" />
        <div className="nf-glow" />

        {/* Decorative grid lines */}
        <div className="nf-line nf-line-h" />
        <div className="nf-line nf-line-h2" />
        <div className="nf-line nf-line-v" />
        <div className="nf-line nf-line-v2" />

        <div className="nf-center">
          {/* Fake chat thread */}
          <div className="nf-chat">
            <div className="nf-bubble right">
              <div className="nf-bubble-inner">hey where is this page? 👀</div>
              <div className="nf-bubble-meta">
                <span>12:04</span>
                <span style={{ color: "#63dcbe" }}>✓✓</span>
              </div>
            </div>

            <div className="nf-bubble left">
              <div className="nf-typing">
                <div className="nf-dot" />
                <div className="nf-dot" />
                <div className="nf-dot" />
              </div>
              <div className="nf-bubble-meta" style={{ marginLeft: "4px" }}>
                Server is typing...
              </div>
            </div>

            <div className="nf-bubble right" style={{ marginTop: "4px" }}>
              <div className="nf-bubble-inner" style={{ background: "rgba(224,92,122,0.15)", color: "var(--accent2)", border: "1px solid rgba(224,92,122,0.25)" }}>
                /chat/page-that-doesnt-exist
              </div>
              <div className="nf-bubble-meta">
                <div className="nf-failed-badge">
                  <div className="nf-failed-dot" />
                  Not delivered
                </div>
              </div>
            </div>
          </div>

          <div className="nf-code">404</div>
          <div className="nf-title">Message not delivered</div>
          <div className="nf-sub">
            This page got lost somewhere between the server and you. It might have been deleted, moved, or never existed.
          </div>

          <div className="nf-actions">
            <button className="nf-btn nf-btn-primary" onClick={() => navigate("/")}>
              Go Home
            </button>
            <button className="nf-btn nf-btn-secondary" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;