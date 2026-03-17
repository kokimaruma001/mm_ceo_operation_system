# Marker Media — CEO Operating System

A personal AI-powered daily check-in tool for Marker Media. Built to keep focus on premium client acquisition, pricing strategy, and scalable growth. Runs entirely in the browser. No backend, no server, no subscription.

---

## What It Does

You open the app, brief the AI on what you worked on today, and it responds like a high-level CEO advisor. It assesses your day against your business goals, calls out busy work vs real progress, and ends every session with five specific actions: three priorities, one revenue action, and one strategic move.

Sessions are saved to your device. The next day, yesterday's actions are injected as context automatically, so the advisor tracks your follow-through without you repeating yourself.

---

## Features

- AI-powered daily advisory sessions via the Anthropic API
- Full session history stored locally in the browser
- Automatic follow-through tracking using previous session actions
- Daily check-in reminder with configurable time
- Browser push notifications when the app is open past your reminder time
- Consecutive check-in streak tracker
- Read-only view of past sessions
- Works on desktop and mobile, installable to home screen as a PWA

---

## Setup

### 1. Get an Anthropic API Key

Go to [console.anthropic.com/keys](https://console.anthropic.com/keys) and create a key. You will need a paid Anthropic account. Cost per daily check-in session is typically under $0.01.

### 2. Deploy the App

**Option A: Netlify Drop (fastest)**

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag `index.html` onto the page
3. Netlify gives you a live URL in under 30 seconds

**Option B: GitHub Pages**

1. Fork or clone this repo
2. Go to Settings > Pages
3. Set source to `main` branch, root folder
4. Your app will be live at `https://yourusername.github.io/repo-name`

### 3. Add to Your Phone Home Screen

**iPhone (Safari only):**
1. Open your deployed URL in Safari
2. Tap the Share icon
3. Tap "Add to Home Screen"

**Android (Chrome):**
1. Open your deployed URL in Chrome
2. Tap the three-dot menu
3. Tap "Add to Home Screen"

The app opens full screen with no browser chrome, behaving like a native app.

### 4. First Launch

On first open, you are prompted to enter your Anthropic API key. It is stored in `localStorage` on your device only. It is never sent anywhere except directly to the Anthropic API.

---

## Notifications

The app fires a reminder banner and browser notification when you open it past your configured reminder time without having checked in that day.

To set your reminder time: open **Settings** in the top right, set the time, and enable browser notifications.

**Limitation:** browser notifications only fire when the app is open. True background push notifications (app fully closed) require a push service. A free option is [ntfy.sh](https://ntfy.sh), which you can configure separately to send a daily push to your phone at a set time with a link back to the app.

---

## Data and Privacy

All session data is stored in your browser's `localStorage`. Nothing is sent to any external service except the Anthropic API during active chat sessions. Clearing your browser data will delete your session history.

---

## Customisation

The business context is defined in the `SYSTEM_PROMPT` constant in the `<script>` block of `index.html`. Edit it to adjust your current rate, goals, target industries, or advisory focus.

```javascript
const SYSTEM_PROMPT = `You are a CEO advisor for Marker Media...`;
```

The reminder time defaults to 18:00 and can be changed in Settings or directly in the script:

```javascript
(localStorage.getItem('mm_notif_time') || '18:00')
```

---

## Stack

- Vanilla HTML, CSS, JavaScript. No frameworks, no build step.
- [Anthropic Messages API](https://docs.anthropic.com/en/api/messages) — `claude-sonnet-4-20250514`
- Browser `localStorage` for session persistence
- Web Notifications API for reminders

---

## License

Personal use. Not intended for redistribution.
