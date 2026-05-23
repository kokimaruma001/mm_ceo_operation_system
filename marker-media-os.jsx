import { useState, useRef, useEffect } from "react";

const MARKER_CONTEXT = `You are a CEO advisor for Marker Media, a luxury creative photography and media company based in Cape Town, South Africa.

Marker Media context:
- Specializes in professional photography and visual media
- Current average rate: R3000 per shoot
- Goal: Transition into high-income, luxury, and travel-based clientele
- Positioning: Creative luxury, premium storytelling, high-end brand identity
- Focus: Building systems, increasing pricing, attracting premium clients, and scaling sustainably

Tone rules:
- Direct, sharp, strategic
- No fluff, no generic motivation
- Speak like a high-level operator, not a coach
- Short, punchy responses unless depth is needed
- Never use em dashes
`;

const AGENTS = [
  {
    id: "clarity",
    label: "Daily Clarity",
    sub: "Focus & Progress",
    icon: "ti-adjustments-horizontal",
    accent: "#C9A96E",
    prompt: `${MARKER_CONTEXT}
Your role: Daily Clarity Agent.
You identify what moved the business forward today versus what was busy work. You surface gaps between daily actions and long-term goals.
Open by asking what the founder worked on today. One question only. Be direct.`,
  },
  {
    id: "revenue",
    label: "Revenue Focus",
    sub: "Pricing & Offers",
    icon: "ti-currency-dollar",
    accent: "#A8C5A0",
    prompt: `${MARKER_CONTEXT}
Your role: Revenue Focus Agent.
You push toward high-income activities. You challenge underpricing. You help refine offers, packages, and pricing toward the R8000 to R25000 range per engagement.
Open by asking what revenue activity the founder is working on right now. One question only. Be direct.`,
  },
  {
    id: "strategy",
    label: "Strategic Thinking",
    sub: "Vision & Positioning",
    icon: "ti-topology-star-3",
    accent: "#9BBDD4",
    prompt: `${MARKER_CONTEXT}
Your role: Strategic Thinking Agent.
You guide decisions like a CEO, not a creative. You advise on positioning, brand perception, and premium client targeting. You suggest scalable approaches for luxury market entry globally.
Open by asking what strategic decision or challenge is on the founder's mind. One question only. Be direct.`,
  },
  {
    id: "accountability",
    label: "Accountability",
    sub: "Discipline & Standards",
    icon: "ti-shield-check",
    accent: "#C4A0B0",
    prompt: `${MARKER_CONTEXT}
Your role: Accountability Agent.
You track execution and consistency. You call out procrastination without softening. You hold the founder to their highest standard.
Open by asking what commitment was made yesterday and whether it was completed. One question only. Be blunt.`,
  },
  {
    id: "growth",
    label: "Growth & Expansion",
    sub: "Systems & Scale",
    icon: "ti-trending-up",
    accent: "#B8A8D0",
    prompt: `${MARKER_CONTEXT}
Your role: Growth & Expansion Agent.
You identify bottlenecks to scaling. You suggest systems, automation, and partnerships. You keep focus on entering higher-paying industries: luxury hospitality, travel brands, fashion, architecture, high-end real estate.
Open by asking what the biggest bottleneck to scaling is right now. One question only. Be direct.`,
  },
];

const DAILY_OUTPUT_PROMPT = `${MARKER_CONTEXT}
Based on this conversation history provided, generate a structured daily output summary for Marker Media.

Format exactly as:
PRIORITY ACTIONS FOR TOMORROW
1. [action]
2. [action]
3. [action]

REVENUE-DRIVING ACTION (non-negotiable)
[single action]

STRATEGIC IMPROVEMENT (long-term)
[single action]

Be specific to what was discussed. No generic advice.`;

function TypingDots({ color }) {
  return (
    <div style={{ display: "flex", gap: 5, padding: "12px 16px", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: color,
            opacity: 0.7,
            animation: "blink 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}

async function callClaude(systemPrompt, messages) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages,
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "Something went wrong.";
}

export default function MarkerMediaOS() {
  const [active, setActive] = useState(null);
  const [convos, setConvos] = useState({});
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dailyOutput, setDailyOutput] = useState(null);
  const [outputLoading, setOutputLoading] = useState(false);
  const bottomRef = useRef(null);

  const msgs = active ? (convos[active.id] || []) : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  const openAgent = async (agent) => {
    setActive(agent);
    setDailyOutput(null);
    if (convos[agent.id]?.length > 0) return;
    setLoading(true);
    try {
      const reply = await callClaude(agent.prompt, [
        { role: "user", content: "Begin the session." },
      ]);
      setConvos((p) => ({ ...p, [agent.id]: [{ role: "assistant", content: reply }] }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    if (!input.trim() || loading || !active) return;
    const userMsg = { role: "user", content: input.trim() };
    const updated = [...msgs, userMsg];
    setConvos((p) => ({ ...p, [active.id]: updated }));
    setInput("");
    setLoading(true);
    try {
      const reply = await callClaude(active.prompt, updated);
      setConvos((p) => ({ ...p, [active.id]: [...updated, { role: "assistant", content: reply }] }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const generateOutput = async () => {
    const allConvos = Object.entries(convos)
      .filter(([, m]) => m.length > 0)
      .map(([id, m]) => {
        const agent = AGENTS.find((a) => a.id === id);
        return `[${agent.label}]\n${m.map((x) => `${x.role === "user" ? "Founder" : "Advisor"}: ${x.content}`).join("\n")}`;
      })
      .join("\n\n");

    if (!allConvos) return;
    setOutputLoading(true);
    setDailyOutput(null);
    try {
      const reply = await callClaude(DAILY_OUTPUT_PROMPT, [
        { role: "user", content: allConvos },
      ]);
      setDailyOutput(reply);
    } catch (e) {
      console.error(e);
    } finally {
      setOutputLoading(false);
    }
  };

  const hasAnyConvo = Object.values(convos).some((m) => m.length > 0);
  const currentAccent = active?.accent || "#C9A96E";

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", background: "#0B0B0B", minHeight: "100vh", color: "#DDD5C8", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:0.2;transform:scale(0.7)} 50%{opacity:1;transform:scale(1)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #2A2A2A; border-radius: 2px; }
        textarea:focus, input:focus { outline: none; }
        button { cursor: pointer; }
      `}</style>

      {/* Top bar */}
      <div style={{ padding: "20px 28px", borderBottom: "1px solid #1C1C1C", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: "0.35em", color: "#555", textTransform: "uppercase", marginBottom: 4 }}>Marker Media</div>
          <div style={{ fontSize: 20, color: "#C9A96E", fontWeight: 400, letterSpacing: "0.04em" }}>CEO Operating System</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {hasAnyConvo && (
            <button
              onClick={generateOutput}
              disabled={outputLoading}
              style={{ background: "transparent", border: "1px solid #2A2A2A", color: "#888", padding: "6px 16px", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "inherit", transition: "all 0.15s" }}
            >
              {outputLoading ? "Generating..." : "Daily Output"}
            </button>
          )}
          <div style={{ fontSize: 10, color: "#3A3A3A", letterSpacing: "0.15em" }}>
            {new Date().toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short" }).toUpperCase()}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
        {/* Sidebar */}
        <div style={{ width: 220, borderRight: "1px solid #181818", display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto" }}>
          <div style={{ padding: "20px 20px 10px", fontSize: 9, letterSpacing: "0.3em", color: "#3A3A3A", textTransform: "uppercase" }}>Agents</div>
          {AGENTS.map((a) => {
            const isActive = active?.id === a.id;
            const hasMsgs = (convos[a.id]?.length || 0) > 0;
            return (
              <button
                key={a.id}
                onClick={() => openAgent(a)}
                style={{ width: "100%", background: isActive ? "#141414" : "transparent", border: "none", borderLeft: `2px solid ${isActive ? a.accent : "transparent"}`, padding: "13px 18px", textAlign: "left", transition: "all 0.12s", display: "flex", alignItems: "center", gap: 10 }}
              >
                <i className={`ti ${a.icon}`} style={{ fontSize: 15, color: isActive ? a.accent : "#3A3A3A", flexShrink: 0 }} aria-hidden="true" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: isActive ? "#DDD5C8" : "#666", fontFamily: "inherit", letterSpacing: "0.02em" }}>{a.label}</div>
                  <div style={{ fontSize: 10, color: "#3A3A3A", letterSpacing: "0.1em", marginTop: 2 }}>{a.sub}</div>
                </div>
                {hasMsgs && <div style={{ width: 5, height: 5, borderRadius: "50%", background: a.accent, flexShrink: 0 }} />}
              </button>
            );
          })}

          {/* Agent status summary */}
          <div style={{ marginTop: "auto", padding: "16px 20px", borderTop: "1px solid #181818" }}>
            <div style={{ fontSize: 9, letterSpacing: "0.25em", color: "#333", textTransform: "uppercase", marginBottom: 10 }}>Sessions</div>
            {AGENTS.map((a) => {
              const count = Math.floor((convos[a.id]?.length || 0) / 2);
              return (
                <div key={a.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "center" }}>
                  <div style={{ fontSize: 10, color: "#444", letterSpacing: "0.05em" }}>{a.label}</div>
                  <div style={{ fontSize: 10, color: count > 0 ? a.accent : "#2A2A2A" }}>{count > 0 ? `${count}` : "—"}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
          {!active && !dailyOutput ? (
            /* Welcome state */
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
              <div style={{ textAlign: "center", maxWidth: 380 }}>
                <div style={{ fontSize: 28, color: "#1E1E1E", marginBottom: 20 }}>
                  {AGENTS.map((a) => <i key={a.id} className={`ti ${a.icon}`} style={{ marginRight: 12, color: a.accent + "44" }} />)}
                </div>
                <div style={{ fontSize: 13, color: "#444", letterSpacing: "0.05em", lineHeight: 1.8, marginBottom: 28 }}>
                  Five agents. One operating system. Select an agent to begin today's session.
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  {AGENTS.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => openAgent(a)}
                      style={{ background: "transparent", border: `1px solid #222`, color: "#666", padding: "10px 20px", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 10, transition: "all 0.12s", justifyContent: "flex-start" }}
                    >
                      <i className={`ti ${a.icon}`} style={{ fontSize: 14, color: a.accent }} />
                      <span>{a.label}</span>
                      <span style={{ marginLeft: "auto", color: "#333", fontSize: 9, letterSpacing: "0.1em" }}>{a.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : dailyOutput ? (
            /* Daily output view */
            <div style={{ flex: 1, overflowY: "auto", padding: "36px 40px" }}>
              <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
                <i className="ti ti-clipboard-list" style={{ fontSize: 18, color: "#C9A96E" }} />
                <div>
                  <div style={{ fontSize: 15, color: "#DDD5C8", letterSpacing: "0.03em" }}>Daily Output</div>
                  <div style={{ fontSize: 10, color: "#3A3A3A", letterSpacing: "0.15em", textTransform: "uppercase" }}>End of session summary</div>
                </div>
                <button
                  onClick={() => setDailyOutput(null)}
                  style={{ marginLeft: "auto", background: "transparent", border: "1px solid #222", color: "#555", padding: "5px 14px", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "inherit" }}
                >
                  Back
                </button>
              </div>
              <div style={{ background: "#0F0F0F", border: "1px solid #1C1C1C", borderLeft: "3px solid #C9A96E", padding: "24px 28px", fontSize: 13, lineHeight: 1.9, color: "#C8C0B0", whiteSpace: "pre-wrap", letterSpacing: "0.02em" }}>
                {dailyOutput}
              </div>
            </div>
          ) : (
            /* Chat view */
            <>
              {/* Agent header */}
              <div style={{ padding: "16px 28px", borderBottom: "1px solid #181818", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                <i className={`ti ${active.icon}`} style={{ fontSize: 17, color: active.accent }} />
                <div>
                  <div style={{ fontSize: 15, color: "#DDD5C8", letterSpacing: "0.03em" }}>{active.label}</div>
                  <div style={{ fontSize: 9, color: "#3A3A3A", letterSpacing: "0.2em", textTransform: "uppercase" }}>{active.sub}</div>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                  {msgs.length > 0 && (
                    <button
                      onClick={() => setConvos((p) => ({ ...p, [active.id]: [] }))}
                      style={{ background: "transparent", border: "1px solid #1E1E1E", color: "#444", padding: "4px 12px", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "inherit" }}
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "28px", display: "flex", flexDirection: "column", gap: 20 }}>
                {msgs.length === 0 && !loading && (
                  <div style={{ textAlign: "center", marginTop: 60, color: "#333" }}>
                    <i className={`ti ${active.icon}`} style={{ fontSize: 28 }} />
                  </div>
                )}
                {msgs.map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth: "70%",
                      padding: "12px 16px",
                      background: m.role === "user" ? "#131313" : "#0F0F0F",
                      border: m.role === "user" ? "1px solid #1E1E1E" : "1px solid #161616",
                      borderLeft: m.role === "assistant" ? `3px solid ${active.accent}` : undefined,
                      fontSize: 13,
                      lineHeight: 1.8,
                      color: m.role === "user" ? "#888" : "#C8C0B0",
                      fontFamily: "'Georgia', serif",
                      whiteSpace: "pre-wrap",
                      letterSpacing: "0.02em",
                    }}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ background: "#0F0F0F", borderLeft: `3px solid ${active.accent}`, width: "fit-content" }}>
                    <TypingDots color={active.accent} />
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div style={{ padding: "16px 28px", borderTop: "1px solid #181818", display: "flex", gap: 10, flexShrink: 0 }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                  placeholder={`Reply to ${active.label.toLowerCase()}...`}
                  disabled={loading}
                  style={{ flex: 1, background: "#0E0E0E", border: "1px solid #1E1E1E", color: "#C8C0B0", padding: "10px 14px", fontSize: 13, fontFamily: "Georgia, serif", letterSpacing: "0.02em" }}
                />
                <button
                  onClick={send}
                  disabled={loading || !input.trim()}
                  style={{ background: loading || !input.trim() ? "#141414" : active.accent, border: "none", color: loading || !input.trim() ? "#333" : "#0B0B0B", padding: "10px 22px", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "inherit", transition: "all 0.12s", flexShrink: 0 }}
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
