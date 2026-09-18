from __future__ import annotations

from flask import Flask, jsonify, render_template_string, request

from marker_media_agents import AGENT_CLASSES
from web_dashboard import route_task_payload, get_agent_catalog

app = Flask(__name__)

HTML = """
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Marker Media Agent Dashboard</title>
    <style>
      :root {
        --bg: #0f1115;
        --panel: #171b21;
        --gold: #c6a15b;
        --gold-soft: rgba(198, 161, 91, 0.2);
        --tan: #d8c6a5;
        --ink: #f4efe8;
        --muted: #c9c2b1;
        --room: #1d2330;
        --room-alt: #243041;
        --active: #2b3b2a;
        --line: rgba(255,255,255,0.08);
      }

      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Arial, sans-serif;
        background: radial-gradient(circle at top, #1f232a, var(--bg) 56%);
        color: var(--ink);
        min-height: 100vh;
        padding: 24px;
      }

      .app-shell {
        max-width: 1400px;
        margin: 0 auto;
      }

      .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 20px;
        padding: 8px 12px;
      }

      h1 {
        margin: 0;
        font-size: 2.1rem;
        color: var(--gold);
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }

      .controls {
        display: flex;
        gap: 12px;
        align-items: center;
      }

      input {
        width: 420px;
        border: 1px solid var(--gold);
        border-radius: 10px;
        background: rgba(255,255,255,0.03);
        color: var(--ink);
        font-size: 1rem;
        padding: 12px 14px;
      }

      button {
        background: var(--gold);
        color: #111;
        border: none;
        border-radius: 10px;
        padding: 12px 18px;
        font-size: 0.95rem;
        font-weight: 700;
        cursor: pointer;
      }

      .main-layout {
        display: grid;
        grid-template-columns: 1.5fr 1.2fr;
        gap: 18px;
      }

      .floor-plan {
        background: rgba(18, 22, 28, 0.96);
        border: 3px solid var(--gold);
        border-radius: 18px;
        padding: 18px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.35);
      }

      .office-grid {
        display: grid;
        grid-template-columns: 1fr 1.3fr;
        grid-template-rows: 1fr 1fr 1fr;
        gap: 14px;
        min-height: 760px;
      }

      .room {
        position: relative;
        background: linear-gradient(135deg, var(--room), var(--room-alt));
        border: 2px solid rgba(198,161,91,0.7);
        border-radius: 16px;
        padding: 14px 16px;
        overflow: hidden;
        min-height: 180px;
        transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
      }

      .room:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.22);
      }

      .room.active {
        border-color: #8fe18f;
        box-shadow: 0 0 0 2px rgba(143, 225, 143, 0.4), 0 12px 24px rgba(0,0,0,0.2);
        background: linear-gradient(135deg, #1d3126, var(--room-alt));
      }

      .room-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 10px;
      }

      .room-title {
        margin: 0;
        font-size: 1rem;
        font-weight: 700;
        color: var(--gold);
      }

      .room-badge {
        font-size: 0.7rem;
        padding: 4px 8px;
        border-radius: 999px;
        background: var(--gold-soft);
        color: var(--gold);
        border: 1px solid rgba(198,161,91,0.5);
      }

      .room-mission {
        margin: 0 0 10px;
        font-size: 0.82rem;
        color: var(--muted);
        line-height: 1.45;
      }

      .room-kpis {
        margin: 0;
        padding-left: 16px;
        color: var(--ink);
        font-size: 0.72rem;
        line-height: 1.6;
      }

      .room .desk {
        position: absolute;
        right: 18px;
        bottom: 18px;
        width: 74px;
        height: 52px;
        border-radius: 8px;
        background: linear-gradient(180deg, #8d6f54, #5d4736);
        border: 2px solid rgba(255,255,255,0.1);
      }

      .room .desk::before,
      .room .desk::after {
        content: "";
        position: absolute;
        background: rgba(255,255,255,0.12);
        border-radius: 999px;
      }

      .room .desk::before {
        width: 8px;
        height: 8px;
        left: 10px;
        top: 8px;
      }

      .room .desk::after {
        width: 8px;
        height: 8px;
        right: 10px;
        top: 8px;
      }

      .detail-panel {
        background: rgba(22, 25, 31, 0.96);
        border: 3px solid var(--gold);
        border-radius: 18px;
        padding: 20px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.35);
      }

      .detail-panel h2 {
        margin: 0 0 12px;
        color: var(--gold);
        font-size: 1.8rem;
      }

      .detail-panel .mission {
        font-size: 1rem;
        line-height: 1.6;
        color: var(--muted);
        margin-bottom: 18px;
      }

      .section {
        margin-top: 18px;
      }

      .section-label {
        margin: 0 0 8px;
        color: var(--gold);
        font-size: 0.8rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      ul {
        margin: 0;
        padding-left: 18px;
        color: var(--ink);
        line-height: 1.7;
      }

      .prompt-box {
        margin-top: 16px;
        background: rgba(255,255,255,0.02);
        border: 1px solid var(--line);
        border-radius: 12px;
        padding: 14px 16px;
        color: var(--ink);
        line-height: 1.6;
      }

      @media (max-width: 980px) {
        .main-layout {
          grid-template-columns: 1fr;
        }
        .controls {
          flex-direction: column;
          align-items: stretch;
        }
        input {
          width: 100%;
        }
      }
    </style>
  </head>
  <body>
    <div class="app-shell">
      <div class="topbar">
        <h1>Marker Media HQ</h1>
        <div class="controls">
          <input id="task-input" type="text" value="new lead inquiry" placeholder="Describe the task" />
          <button onclick="routeTask()">Route task</button>
        </div>
      </div>

      <div class="main-layout">
        <section class="floor-plan">
          <div class="office-grid" id="office-grid"></div>
        </section>

        <aside class="detail-panel" id="detail-panel">
          <h2>Client Relations Agent</h2>
          <div class="mission">Run the client from first inquiry to confirmed booking...</div>
          <div class="section">
            <div class="section-label">Responsibilities</div>
            <ul id="responsibilities"></ul>
          </div>
          <div class="section">
            <div class="section-label">KPIs</div>
            <ul id="kpis"></ul>
          </div>
          <div class="section">
            <div class="section-label">Prompt</div>
            <div class="prompt-box" id="prompt-box"></div>
          </div>
        </aside>
      </div>
    </div>

    <script>
      const agents = {{ agents|tojson }};

      function renderRooms() {
        const grid = document.getElementById('office-grid');
        grid.innerHTML = agents.map((agent, index) => `
          <div class="room ${index === 0 ? 'active' : ''}" data-name="${agent.name}" data-index="${index}">
            <div class="room-header">
              <h3 class="room-title">${agent.name}</h3>
              <span class="room-badge">${index === 0 ? 'HQ' : 'Team'}</span>
            </div>
            <p class="room-mission">${agent.mission}</p>
            <ul class="room-kpis">
              ${agent.kpis.slice(0, 2).map(kpi => `<li>${kpi}</li>`).join('')}
            </ul>
            <div class="desk"></div>
          </div>
        `).join('');

        document.querySelectorAll('.room').forEach((room) => {
          room.addEventListener('click', () => {
            const name = room.dataset.name;
            const agent = agents.find((item) => item.name === name);
            if (agent) {
              setActiveAgent(agent);
            }
          });
        });
      }

      function setActiveAgent(agent) {
        document.querySelectorAll('.room').forEach((room) => {
          room.classList.toggle('active', room.dataset.name === agent.name);
        });

        document.getElementById('detail-panel').innerHTML = `
          <h2>${agent.name}</h2>
          <div class="mission">${agent.mission}</div>
          <div class="section">
            <div class="section-label">Responsibilities</div>
            <ul>${agent.responsibilities.map(item => `<li>${item}</li>`).join('')}</ul>
          </div>
          <div class="section">
            <div class="section-label">KPIs</div>
            <ul>${agent.kpis.map(item => `<li>${item}</li>`).join('')}</ul>
          </div>
          <div class="section">
            <div class="section-label">Prompt</div>
            <div class="prompt-box">${agent.prompt || 'No prompt available.'}</div>
          </div>
        `;
      }

      async function routeTask() {
        const task = document.getElementById('task-input').value;
        const response = await fetch('/route?task=' + encodeURIComponent(task));
        const data = await response.json();

        const selectedAgent = agents.find((agent) => agent.name === data.selected_agent);
        if (selectedAgent) {
          setActiveAgent(selectedAgent);
        }
      }

      renderRooms();
      if (agents.length) {
        setActiveAgent(agents[1]);
      }
    </script>
  </body>
</html>
"""


@app.route("/")
def index():
    return render_template_string(HTML, agents=get_agent_catalog())


@app.route("/route")
def route():
    task = request.args.get("task", "new lead inquiry")
    return jsonify(route_task_payload(task))


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
