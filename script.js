const SYSTEM_PROMPT = `You are a CEO advisor for Marker Media, a creative luxury photography and media company.
 
Context:
- Specializes in professional photography and visual media
- Current rate: R3000 per shoot
- Goal: Transition to luxury and travel-based clientele
- Positioning: Premium storytelling, high-end brand identity
- Focus: Systems, pricing increases, premium clients, scalable growth
 
You have access to the following tools. Use them proactively at the start of every check-in to build real context before responding — do not wait to be asked:
 
- Gmail: Scan today's emails for unanswered leads, new client enquiries, pending follow-ups, or anything revenue-relevant. Summarise what you find.
- Google Calendar: Check today's and tomorrow's schedule. Note actual shoots, meetings, or gaps. Cross-reference what the user reports against what was actually booked.
- Notion: Look for any task lists, CRM entries, or project notes relevant to the check-in. If priority actions from past sessions exist there, check them for completion.
- Canva: Use if the user needs a deliverable created from the session, such as a strategy brief, client proposal, or one-pager.
 
At the start of each check-in, always query Gmail and Google Calendar first. Mention specifically what you found — unanswered emails, missed opportunities, upcoming shoots. This is real intelligence, not filler.
 
Your role in each check-in:
1. DAILY CLARITY: Use real data from Gmail and Calendar to assess the day, not just what the user reports.
2. REVENUE FOCUS: Push toward high-income activities. Call out unanswered leads from Gmail by name if found.
3. STRATEGIC THINKING: Guide decisions like a CEO. Advise on positioning and client targeting.
4. ACCOUNTABILITY: Cross-reference Calendar bookings with what the user claims was done. Call out gaps.
5. GROWTH: Identify scaling opportunities. Keep focus on premium, global brand building.
 
If a previous session summary is included, reference it to check follow-through on yesterday's actions.
 
At the end of EVERY response include this block exactly:
 
---ACTIONS---
PRIORITY_1: [action]
PRIORITY_2: [action]
PRIORITY_3: [action]
REVENUE: [non-negotiable revenue action]
STRATEGIC: [long-term strategic improvement]
---END---
 
Tone: Direct, sharp, no fluff. Speak like a high-level operator. Be concise but substantive.`;
 
let API_KEY = '';
let messages = [];
let isLoading = false;
let viewingDate = null;
let drawerOpen = false;
 
const todayKey = () => new Date().toISOString().split('T')[0];
 
// STORAGE
function saveSession(date, msgs, actions) {
  const key = `mm_session_${date}`;
  const existing = loadSession(date) || { date, messages: [], actions: null, preview: '' };
  existing.messages = msgs;
  if (actions) existing.actions = actions;
  const firstUser = msgs.find(m => m.role === 'user');
  if (firstUser) existing.preview = firstUser.content.slice(0, 60);
  localStorage.setItem(key, JSON.stringify(existing));
  let idx = JSON.parse(localStorage.getItem('mm_session_index') || '[]');
  if (!idx.includes(date)) { idx.push(date); idx.sort((a,b) => b.localeCompare(a)); }
  localStorage.setItem('mm_session_index', JSON.stringify(idx));
}
 
function loadSession(date) {
  const raw = localStorage.getItem(`mm_session_${date}`);
  return raw ? JSON.parse(raw) : null;
}
 
function getAllSessions() {
  const idx = JSON.parse(localStorage.getItem('mm_session_index') || '[]');
  return idx.map(d => loadSession(d)).filter(Boolean);
}
 
function getStreak() {
  const idx = JSON.parse(localStorage.getItem('mm_session_index') || '[]');
  if (!idx.length) return 0;
  let streak = 0;
  let check = new Date();
  if (idx[0] !== todayKey()) check.setDate(check.getDate() - 1);
  for (let i = 0; i < idx.length; i++) {
    const expected = check.toISOString().split('T')[0];
    if (idx[i] === expected) { streak++; check.setDate(check.getDate() - 1); }
    else break;
  }
  return streak;
}
 
// INIT
window.addEventListener('DOMContentLoaded', () => {
  const now = new Date();
  document.getElementById('live-date').textContent = now.toLocaleDateString('en-ZA', {
    weekday: 'long', day: 'numeric', month: 'long'
  });
  const saved = localStorage.getItem('mm_api_key');
  if (saved) { API_KEY = saved; document.getElementById('key-gate').style.display = 'none'; initApp(); }
});
 
function initApp() {
  updateStreak();
  renderSessionList();
  loadTodayOrWelcome();
  checkDailyReminder();
  document.getElementById('total-sessions').textContent = getAllSessions().length;
}
 
function loadTodayOrWelcome() {
  const session = loadSession(todayKey());
  if (session && session.messages && session.messages.length > 0) {
    messages = session.messages;
    renderMessages(messages);
    if (session.actions) updateActionBoard(session.actions);
  } else {
    messages = [];
    renderMessages([]);
  }
  viewingDate = null;
  setReadOnly(false);
  document.getElementById('session-label').textContent = 'Today';
}
 
// KEY
function saveKey() {
  const input = document.getElementById('api-key-input').value.trim();
  if (!input.startsWith('sk-')) { document.getElementById('key-error').style.display = 'block'; return; }
  document.getElementById('key-error').style.display = 'none';
  localStorage.setItem('mm_api_key', input);
  API_KEY = input;
  document.getElementById('key-gate').style.display = 'none';
  initApp();
}
 
function resetKey() {
  localStorage.removeItem('mm_api_key');
  API_KEY = '';
  document.getElementById('api-key-input').value = '';
  closeSettings();
  document.getElementById('key-gate').style.display = 'flex';
}
 
// DRAWER
function toggleDrawer() {
  drawerOpen = !drawerOpen;
  document.getElementById('history-drawer').classList.toggle('open', drawerOpen);
  document.getElementById('main-content').classList.toggle('drawer-open', drawerOpen);
  document.getElementById('drawer-toggle').textContent = drawerOpen ? 'Close' : 'History';
}
 
function renderSessionList() {
  const list = document.getElementById('session-list');
  const sessions = getAllSessions();
  list.innerHTML = '';
  if (!sessions.length) {
    list.innerHTML = '<div style="padding:14px 20px;font-size:11px;color:var(--text-dim);">No past sessions yet.</div>';
    return;
  }
  sessions.forEach(s => {
    const div = document.createElement('div');
    const isToday = s.date === todayKey();
    const current = viewingDate || todayKey();
    div.className = 'session-item' + (s.date === current ? ' active' : '');
    const msgCount = s.messages ? s.messages.filter(m => m.role === 'user').length : 0;
    const dateStr = isToday ? 'Today' : fmtDate(s.date);
    div.innerHTML = `<div class="session-date">${dateStr}</div>${s.preview ? `<div class="session-preview">${s.preview}...</div>` : ''}<div class="session-count">${msgCount} exchange${msgCount !== 1 ? 's' : ''}</div>`;
    div.onclick = () => loadSessionView(s.date);
    list.appendChild(div);
  });
}
 
function fmtDate(d) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' });
}
 
function loadSessionView(date) {
  const session = loadSession(date);
  if (!session) return;
  viewingDate = date;
  messages = session.messages || [];
  renderMessages(messages);
  if (session.actions) updateActionBoard(session.actions);
  const isToday = date === todayKey();
  setReadOnly(!isToday);
  document.getElementById('session-label').textContent = isToday ? 'Today' : fmtDate(date);
  renderSessionList();
}
 
function startToday() {
  viewingDate = null;
  loadTodayOrWelcome();
  renderSessionList();
  if (drawerOpen) toggleDrawer();
}
 
function setReadOnly(ro) {
  document.getElementById('readonly-banner').classList.toggle('show', ro);
  document.getElementById('user-input').disabled = ro;
  document.getElementById('send-btn').disabled = ro;
}
 
// RENDER
function renderMessages(msgs) {
  const c = document.getElementById('messages');
  c.innerHTML = '';
  if (!msgs.length) {
    c.innerHTML = `<div class="msg assistant"><div class="msg-role">Advisor</div><div class="msg-body welcome-msg"><div class="welcome-title">Ready for your check-in.</div><div class="divider-line"></div><div class="welcome-body">Start with what you actually worked on today. Be specific. I'm here to separate what moved the business forward from what kept you busy.<br><br>The goal is always the same: premium clients, higher pricing, scalable systems.</div></div></div>`;
    return;
  }
  msgs.forEach(m => appendMsg(m.role, m.content, false));
  c.scrollTop = c.scrollHeight;
}
 
function appendMsg(role, content, animate = true, toolsUsed = []) {
  const c = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  if (!animate) div.style.animation = 'none';
  const rl = document.createElement('div');
  rl.className = 'msg-role';
  rl.textContent = role === 'user' ? 'You' : 'Advisor';
  const body = document.createElement('div');
  body.className = 'msg-body';
  if (role === 'assistant') {
    const { clean, actions } = parseResp(content);
    body.innerHTML = fmtText(clean);
    if (actions) updateActionBoard(actions);
    // Render tool chips if tools were used
    if (toolsUsed.length) {
      const chips = document.createElement('div');
      chips.className = 'tool-chips';
      toolsUsed.forEach(name => {
        const meta = CONNECTOR_META[name];
        const chip = document.createElement('div');
        chip.className = 'tool-chip';
        chip.textContent = meta ? meta.label : name;
        chips.appendChild(chip);
      });
      body.appendChild(chips);
    }
  } else {
    body.textContent = content;
  }
  div.appendChild(rl);
  div.appendChild(body);
  c.appendChild(div);
  c.scrollTop = c.scrollHeight;
}
 
function parseResp(text) {
  const m = text.match(/---ACTIONS---([\s\S]*?)---END---/);
  if (!m) return { clean: text, actions: null };
  const block = m[1].trim();
  const clean = text.replace(/---ACTIONS---[\s\S]*?---END---/, '').trim();
  const actions = {};
  block.split('\n').forEach(l => {
    if (l.startsWith('PRIORITY_1:')) actions.p1 = l.replace('PRIORITY_1:', '').trim();
    if (l.startsWith('PRIORITY_2:')) actions.p2 = l.replace('PRIORITY_2:', '').trim();
    if (l.startsWith('PRIORITY_3:')) actions.p3 = l.replace('PRIORITY_3:', '').trim();
    if (l.startsWith('REVENUE:')) actions.revenue = l.replace('REVENUE:', '').trim();
    if (l.startsWith('STRATEGIC:')) actions.strategic = l.replace('STRATEGIC:', '').trim();
  });
  return { clean, actions };
}
 
function fmtText(t) {
  return t.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--cream)">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/\n\n/g, '</p><p style="margin-top:10px">')
          .replace(/\n/g, '<br>');
}
 
function updateActionBoard(actions) {
  const board = document.getElementById('action-board');
  board.innerHTML = '';
  [
    { t: actions.p1, tag: 'Priority', cls: 'tag-priority', n: '1' },
    { t: actions.p2, tag: 'Priority', cls: 'tag-priority', n: '2' },
    { t: actions.p3, tag: 'Priority', cls: 'tag-priority', n: '3' },
    { t: actions.revenue, tag: 'Revenue', cls: 'tag-rev', n: 'R' },
    { t: actions.strategic, tag: 'Strategic', cls: 'tag-strat', n: 'S' },
  ].forEach(item => {
    if (!item.t) return;
    const d = document.createElement('div');
    d.className = 'action-item';
    d.innerHTML = `<div class="action-num">${item.n}</div><div><div class="action-text">${item.t}</div><div class="action-tag ${item.cls}">${item.tag}</div></div>`;
    board.appendChild(d);
  });
}
 
function updateStreak() {
  document.getElementById('streak-badge').textContent = `Streak: ${getStreak()}`;
}
 
// MCP SERVERS
// Connectors require Claude.ai OAuth session — disabled in standalone/mobile deployment
const IS_CLAUDE_AI = window.location.hostname.includes('claude.ai');
const MCP_SERVERS = IS_CLAUDE_AI ? [
  { type: 'url', url: 'https://gmail.mcp.claude.com/mcp',  name: 'gmail' },
  { type: 'url', url: 'https://gcal.mcp.claude.com/mcp',   name: 'google-calendar' },
  { type: 'url', url: 'https://mcp.notion.com/mcp',        name: 'notion' },
  { type: 'url', url: 'https://mcp.canva.com/mcp',         name: 'canva' }
] : [];
 
const CONNECTOR_META = {
  'gmail':           { label: 'Gmail',            dotId: 'dot-gmail',    statusId: 'status-gmail' },
  'google-calendar': { label: 'Calendar',         dotId: 'dot-gcal',     statusId: 'status-gcal' },
  'notion':          { label: 'Notion',           dotId: 'dot-notion',   statusId: 'status-notion' },
  'canva':           { label: 'Canva',            dotId: 'dot-canva',    statusId: 'status-canva' },
};
 
function setConnectorActive(serverName, active) {
  const meta = CONNECTOR_META[serverName];
  if (!meta) return;
  const dot = document.getElementById(meta.dotId);
  const status = document.getElementById(meta.statusId);
  if (!dot || !status) return;
  if (active) {
    dot.classList.add('active');
    status.textContent = 'Reading';
    status.classList.add('live');
  } else {
    dot.classList.remove('active');
    status.textContent = 'Done';
    status.classList.remove('live');
  }
}
 
function resetConnectors() {
  const label = IS_CLAUDE_AI ? 'Ready' : 'claude.ai only';
  Object.values(CONNECTOR_META).forEach(meta => {
    const dot = document.getElementById(meta.dotId);
    const status = document.getElementById(meta.statusId);
    if (dot) { dot.classList.remove('active'); if (!IS_CLAUDE_AI) dot.style.background = 'var(--text-dim)'; }
    if (status) { status.textContent = label; status.classList.remove('live'); }
  });
}
 
// SEND
async function sendMessage() {
  if (isLoading || viewingDate) return;
  const input = document.getElementById('user-input');
  const text = input.value.trim();
  if (!text) return;
 
  input.value = ''; input.style.height = 'auto';
  isLoading = true;
  document.getElementById('send-btn').disabled = true;
  document.getElementById('status-text').textContent = 'Connecting';
  document.getElementById('status-dot').classList.remove('active');
  resetConnectors();
 
  messages.push({ role: 'user', content: text });
  appendMsg('user', text);
  showThinking(IS_CLAUDE_AI ? 'Pulling Gmail and Calendar' : 'Reviewing');
 
  // Animate connectors sequentially (only in claude.ai where MCP is active)
  const connSeq = ['gmail', 'google-calendar', 'notion'];
  let ci = 0;
  const connTimer = IS_CLAUDE_AI ? setInterval(() => {
    if (ci > 0) setConnectorActive(connSeq[ci - 1], false);
    if (ci < connSeq.length) { setConnectorActive(connSeq[ci], true); ci++; }
    else clearInterval(connTimer);
  }, 1800) : null;
 
  try {
    const payload = Object.assign({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: buildCtx(messages)
    }, MCP_SERVERS.length ? { mcp_servers: MCP_SERVERS } : {});
 
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify(payload)
    });
 
    if (connTimer) clearInterval(connTimer);
 
    // Surface HTTP errors clearly
    if (!res.ok) {
      let errMsg = `API error ${res.status}`;
      try {
        const errData = await res.json();
        if (errData.error?.message) errMsg = errData.error.message;
        else if (errData.error?.type) errMsg = errData.error.type;
      } catch(_) {}
      throw new Error(errMsg);
    }
 
    const data = await res.json();
 
    // Surface API-level errors (e.g. invalid key, overloaded)
    if (data.error) throw new Error(data.error.message || data.error.type || 'API error');
 
    // Identify which tools were actually used
    const toolsUsed = (data.content || [])
      .filter(b => b.type === 'mcp_tool_use')
      .map(b => b.server_name)
      .filter((v, i, a) => a.indexOf(v) === i);
 
    // Briefly show active state for each real tool used, then idle
    toolsUsed.forEach((name, i) => {
      setTimeout(() => setConnectorActive(name, true), i * 300);
      setTimeout(() => setConnectorActive(name, false), i * 300 + 800);
    });
 
    // Extract text
    const reply = (data.content || [])
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n\n')
      .trim();
 
    if (!reply) throw new Error('Empty response from API. Try again.');
 
    messages.push({ role: 'assistant', content: reply });
    removeThinking();
    appendMsg('assistant', reply, true, toolsUsed);
    const { actions } = parseResp(reply);
    saveSession(todayKey(), messages, actions);
    renderSessionList();
    document.getElementById('total-sessions').textContent = getAllSessions().length;
    updateStreak();
  } catch(e) {
    if (connTimer) clearInterval(connTimer);
    resetConnectors();
    removeThinking();
    // Remove the user message we added optimistically so they can retry
    messages.pop();
    const errText = e.message || 'Unknown error';
    appendMsg('assistant', `Error: ${errText}`, true);
    console.error('API error:', e);
  }
 
  setTimeout(resetConnectors, 3000);
  document.getElementById('status-text').textContent = 'System Online';
  document.getElementById('status-dot').classList.add('active');
  document.getElementById('send-btn').disabled = false;
  isLoading = false;
}
 
function buildCtx(todayMsgs) {
  // Inject yesterday's actions as context on first message of the day
  if (todayMsgs.length !== 1) return todayMsgs;
  const yDate = new Date();
  yDate.setDate(yDate.getDate() - 1);
  const ySession = loadSession(yDate.toISOString().split('T')[0]);
  if (!ySession || !ySession.actions) return todayMsgs;
  const a = ySession.actions;
  return [
    { role: 'user', content: `[Yesterday's actions: 1) ${a.p1||'N/A'} 2) ${a.p2||'N/A'} 3) ${a.p3||'N/A'} | Revenue: ${a.revenue||'N/A'} | Strategic: ${a.strategic||'N/A'}. Check my follow-through in today's brief.]` },
    { role: 'assistant', content: "Understood. I have yesterday's priorities. Brief me on today." },
    ...todayMsgs
  ];
}
 
function showThinking(label = 'Reviewing') {
  const c = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'msg assistant'; div.id = 'thinking-msg';
  const rl = document.createElement('div'); rl.className = 'msg-role'; rl.textContent = 'Advisor';
  const body = document.createElement('div'); body.className = 'thinking';
  body.innerHTML = `<div class="thinking-dots"><span></span><span></span><span></span></div><span id="thinking-label">${label}</span>`;
  div.appendChild(rl); div.appendChild(body); c.appendChild(div); c.scrollTop = c.scrollHeight;
}
 
function updateThinking(label) {
  const el = document.getElementById('thinking-label');
  if (el) el.textContent = label;
}
 
function removeThinking() { const t = document.getElementById('thinking-msg'); if (t) t.remove(); }
 
function autoResize(el) { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 130) + 'px'; }
function handleKey(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }
function quickPrompt(text) { if (viewingDate) return; document.getElementById('user-input').value = text; autoResize(document.getElementById('user-input')); sendMessage(); }
 
// NOTIFICATIONS
function checkDailyReminder() {
  const session = loadSession(todayKey());
  const checkedIn = session && session.messages && session.messages.filter(m => m.role === 'user').length > 0;
  if (checkedIn) return;
  const [h, m] = (localStorage.getItem('mm_notif_time') || '18:00').split(':').map(Number);
  const now = new Date();
  if (now.getHours() > h || (now.getHours() === h && now.getMinutes() >= m)) {
    document.getElementById('notif-banner').classList.add('show');
    if (Notification.permission === 'granted') {
      new Notification('Marker Media CEO Check-In', { body: "Your daily check-in is waiting. What did you work on today?" });
    }
  } else {
    const target = new Date(); target.setHours(h, m, 0, 0);
    const delay = target - now;
    if (delay > 0 && delay < 86400000) setTimeout(checkDailyReminder, delay);
  }
}
 
function dismissBanner(checkin) {
  document.getElementById('notif-banner').classList.remove('show');
  if (checkin) { if (drawerOpen) toggleDrawer(); document.getElementById('user-input').focus(); }
}
 
async function requestNotifPermission() {
  if (!('Notification' in window)) { updateNotifStatus('denied', 'Not supported in this browser.'); return; }
  const result = await Notification.requestPermission();
  if (result === 'granted') {
    updateNotifStatus('granted', 'Enabled. You will be notified when the app is open past your reminder time.');
    document.getElementById('notif-perm-btn').textContent = 'Notifications Enabled';
  } else {
    updateNotifStatus('denied', 'Blocked. Enable notifications for this site in your device settings.');
  }
}
 
function updateNotifStatus(type, msg) {
  const el = document.getElementById('notif-status'); el.className = 'notif-status ' + type; el.textContent = msg;
}
 
// SETTINGS
function openSettings() {
  const saved = localStorage.getItem('mm_notif_time');
  if (saved) document.getElementById('notif-time').value = saved;
  if (Notification.permission === 'granted') {
    document.getElementById('notif-perm-btn').textContent = 'Notifications Enabled';
    updateNotifStatus('granted', 'Notifications are currently enabled.');
  } else if (Notification.permission === 'denied') {
    document.getElementById('notif-perm-btn').textContent = 'Notifications Blocked';
    updateNotifStatus('denied', 'Blocked in browser settings. Change this in your OS notification settings.');
  }
  document.getElementById('settings-modal').classList.add('show');
}
 
function closeSettings() { document.getElementById('settings-modal').classList.remove('show'); }
function saveSettings() { const t = document.getElementById('notif-time').value; if (t) localStorage.setItem('mm_notif_time', t); closeSettings(); }
