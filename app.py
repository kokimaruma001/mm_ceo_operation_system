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
      body { font-family: Arial, sans-serif; background: #111; color: #f5f0e6; margin: 0; padding: 24px; }
      h1 { color: #c6a15b; }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; }
      .card { background: #1d1d1d; border: 1px solid #c6a15b; border-radius: 12px; padding: 18px; }
      .label { color: #c6a15b; font-weight: bold; }
      ul { padding-left: 18px; }
      input, button { font-size: 16px; padding: 10px; border-radius: 8px; }
      input { width: 70%; margin-right: 8px; }
      button { background: #c6a15b; color: #111; border: none; cursor: pointer; }
    </style>
  </head>
  <body>
    <h1>Marker Media Agent Dashboard</h1>
    <div>
      <input id="task-input" type="text" value="new lead inquiry" placeholder="Describe the task" />
      <button onclick="routeTask()">Route task</button>
    </div>
    <div id="result" class="card" style="margin-top: 20px;"></div>

    <div class="grid" style="margin-top: 24px;">
      {% for agent in agents %}
      <div class="card">
        <div class="label">{{ agent.name }}</div>
        <p>{{ agent.mission }}</p>
        <div class="label">KPIs</div>
        <ul>
          {% for kpi in agent.kpis %}
          <li>{{ kpi }}</li>
          {% endfor %}
        </ul>
      </div>
      {% endfor %}
    </div>

    <script>
      async function routeTask() {
        const task = document.getElementById('task-input').value;
        const response = await fetch('/route?task=' + encodeURIComponent(task));
        const data = await response.json();
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `
          <div class="label">Selected Agent</div>
          <h2>${data.selected_agent}</h2>
          <p><strong>Mission:</strong> ${data.mission}</p>
          <div class="label">Responsibilities</div>
          <ul>${data.responsibilities.map(item => '<li>' + item + '</li>').join('')}</ul>
          <div class="label">Prompt</div>
          <p>${data.prompt}</p>
        `;
      }
      routeTask();
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
