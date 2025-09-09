# Poker Timer

A simple, friendly poker tournament timer and manager. Run it locally in your browser to manage blind levels, players, seating, sessions, chips, sounds, themes, and more — no database setup required.

This guide is written for non‑technical users. Follow the steps in order and you’ll be up and running quickly.

---

## What you can do with it

- Tournament timer with visual display and sound notifications
- Predefined level presets and a level editor
- Manage players, sessions, and seating plans
- Chip calculator and overview
- Debt tracking and simple leaderboards
- Quick save/load of setups
- Light/Dark theme, mobile-friendly UI
- Data is saved in your browser automatically
- Optional “Cloud Save” to share/load by key + password

Note: Internet connection is only required for “Cloud Save/Load.” Everything else runs locally on your computer.

---

## Quick Start (the shortest path)

1. Install Node.js LTS (the tool that runs this app)

- Go to https://nodejs.org
- Download and install the “LTS” version (recommended).
- After installation, restart your computer (optional but helps avoid PATH issues).

2. Get the project files

- Option A: Download ZIP from GitHub
  - Visit the repository page, click “Code” → “Download ZIP”
  - Unzip it somewhere, for example your Desktop
- Option B: If you know Git
  - Open Terminal (macOS) or Command Prompt/PowerShell (Windows)
  - Run:
    ```
    git clone https://github.com/eliasfloreteng/poker-timer.git
    ```
  - Then open the folder:
    ```
    cd poker-timer
    ```

3. Install dependencies (one-time setup)

- In Terminal/Command Prompt, go into the folder that contains this README, then run:
  ```
  npm install
  ```

4. Start the app (development mode)

- Run:
  ```
  npm run dev
  ```
- After a few seconds, open your browser to:
  - http://localhost:3000

That’s it. You should now see the Poker Timer app running.

---

## Using the app

- Timer: Go to the Timer page to start/pause the tournament clock and progress through levels.
- Levels: Use the Level Presets or Level Editor to set blind structures and durations.
- Players & Seating: Add players and use the seating tools to plan tables.
- Sessions: Save your tournament setups and results as “sessions.”
- Chips: Use the chip calculator to plan stacks and denominations.
- Settings: Change theme, sounds, and other preferences.
- Save/Load:
  - Local: Saved automatically in your browser (persists on the same computer and browser).
  - Cloud (optional): Save with a key + password to load on another device or share.

Tip: Local browser storage is per device and per browser. If you switch computers or use a different browser, your local data won’t be there (use Cloud Save to move data).

---

## Optional: Bun instead of Node/npm

If you prefer Bun (a faster JavaScript runtime), there’s a `bun.lock` included:

- Install Bun: https://bun.sh (macOS: `brew install oven-sh/bun/bun`)
- Install and run:
  ```
  bun install
  bun run dev
  ```
  Open http://localhost:3000

If you’re not sure, just use the Node/npm steps above.

---

## Requirements and notes

- Operating systems: macOS, Windows, or Linux
- Browser: Any modern browser (Chrome, Edge, Firefox, Safari)
- Node.js: Version 18.17+ or 20+ (LTS recommended)
- No database setup required
- Sounds: The app plays a small sound file for notifications. If you don’t hear it:
  - Turn up your system volume
  - Allow your browser to play audio for the page
  - Some browsers block autoplay — interact with the page once (e.g., click somewhere)

---

## Troubleshooting

- “npm” command not found

  - Node.js is not installed or your Terminal hasn’t picked it up yet.
  - Install Node.js from https://nodejs.org and then restart Terminal/Command Prompt.

- Port already in use (nothing shows up at http://localhost:3000)

  - Another app may be using port 3000. Start on a different port:
    ```
    npm run dev -- --port 3001
    ```
  - Then open http://localhost:3001

- Blank/unstyled page

  - Fully stop the dev server (press Ctrl + C in the terminal) and run `npm run dev` again.
  - Try a hard refresh in the browser (hold Shift and click the refresh button).

- Cloud Save/Load failing

  - Requires internet access.
  - Double-check your key and password (they must match exactly).
  - Don’t store sensitive data; this feature is meant for simple, shareable state.

- Audio doesn’t play

  - Interact with the page once (click anywhere) so the browser allows sound.
  - Check system volume and browser site permissions.

- Nothing happens after “npm run dev”
  - If your Terminal shows the server started but the browser shows nothing:
    - Manually open http://localhost:3000
    - Try a different browser
    - Ensure no VPN/firewall is blocking localhost

---

## How to stop the app

- In the Terminal window where it’s running, press:
  - macOS/Linux: Ctrl + C
  - Windows: Ctrl + C (then press Y and Enter if prompted)

---

## Build for production (optional)

If you want a “compiled” version that runs faster:

1. Build the app:

```
npm run build
```

2. Start the production server:

```
npm run start
```

3. Open http://localhost:3000

Tip: This is useful if you plan to host the app on your own server. For casual home use, running `npm run dev` is usually enough.

---

## Use on your phone (same Wi‑Fi) — optional

To open the app on your phone while it runs on your computer:

1. Find your computer’s local IP address (e.g., 192.168.1.10).
2. Start the dev server so it’s reachable on your network:

```
npm run dev -- --hostname 0.0.0.0
```

3. On your phone’s browser, open:

```
http://YOUR-IP:3000
```

Replace `YOUR-IP` with your computer’s IP (for example, http://192.168.1.10:3000). Both devices must be on the same Wi‑Fi.

---

## Privacy and data

- Local data is stored in your browser’s local storage. Clearing browser data or using private mode may remove it.
- Cloud Save/Load uses a remote service keyed by a “key + password.”
  - Treat it as a convenience feature. Do not store sensitive information.
  - Internet connection required.

---

## Tech stack (for those curious)

- Next.js 14 (React 18)
- Tailwind CSS & shadcn/ui (Radix UI primitives)
- TypeScript

Folders you may notice:

- `app/` — Pages and routing
- `components/` — UI components (timer, levels, players, seating, chips, etc.)
- `hooks/` — Small helpers for local storage, timer, theme, etc.
- `lib/` — Utilities and the tiny API client used for optional cloud save
- `public/` — Static files (like the notification sound)
- `types/` — TypeScript types

---

## Updating the app (optional)

- To update packages:
  ```
  npm install
  ```
  (If you cloned from GitHub, you can also pull the latest changes with `git pull`.)

---

## Frequently asked questions

- Can I run this without internet?  
  Yes. Everything except the optional Cloud Save/Load works fully offline.

- Can I share my setup with a friend?  
  Yes. Use Cloud Save. Share the key and password you used with them.

- Will this work on Windows/macOS/Linux?  
  Yes. The steps are the same: install Node.js, install dependencies, run the dev server.

---

## License

If a license file is present in the repository, that applies. If not, treat this as “all rights reserved” by default.

---

## Need help?

- Re-read the Quick Start and Troubleshooting sections above.
- If you still run into an issue, open an issue on the GitHub repository if it’s public, and include:
  - Your operating system and version
  - Node.js version (run `node -v`)
  - What you tried and what happened (screenshots help)

Enjoy your games!
