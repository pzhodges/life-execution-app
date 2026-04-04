# Life Execution V5

Life Execution is a local-first personal operating system built as a premium dark-mode web app. It is designed to feel more like a calm high-performance coach and mission-control dashboard than a basic to-do list. The app adapts the day based on the user's energy, mood, goal clarity, and life situation while still being useful with very little input.

## Features

- Daily Opening screen shown once per day
- 35 original daily quotes with disciplined, calm, and zen tones
- Flexible onboarding that collects goal clarity first, then generates the first milestone with AI
- Adaptive dashboard with goal, phase, roadmap, mission, fuel, reflection, and win tracking
- Rule-based mission generation that changes with daily mode and life updates
- Life Update modal for stress, health, travel, opportunity, and family shifts
- Win history and streak logic
- All data stored locally with `localStorage`
- AI-generated next milestone suggestions with user approval or editing
- Small Node server route for OpenAI calls without exposing the API key in frontend code

## Run Locally

1. Download or clone this repository.
2. Set your OpenAI API key in the shell before starting the app.
3. Start the local server with `npm start` or `node server.js`.
4. Open `http://localhost:3000` in any modern browser.
5. For the best mobile experience, open the local or deployed URL in Safari on iPhone and save it to your home screen if you want.

Example in PowerShell:

```powershell
$env:OPENAI_API_KEY="your_api_key_here"
npm start
```

Optional:

- Set `OPENAI_MILESTONE_MODEL` to override the default server model.
- Set `PORT` if you do not want to use port `3000`.

There is still no build step or frontend framework. The server uses only Node built-ins.

## Publish With GitHub Pages

GitHub Pages alone is no longer enough for the AI milestone flow because the app now needs a backend route for OpenAI calls. If you want the AI suggestions to work in production, deploy the app somewhere that can run the included Node server.

If you still open `index.html` directly, the rest of the app continues to work, but AI milestone suggestions will fall back to manual editing because `/api/suggest-next-milestone` will not exist.

## Data Storage

The app still uses browser `localStorage` for the user's saved app state.

Stored data includes:

- Goal and profile details
- Daily opening state and assigned mode
- Daily mission items and completion state
- Reflections by date
- Wins by date
- Current streak and total wins
- Life update history
- Daily quote metadata

For AI milestone suggestions only, the server sends milestone-planning context to OpenAI:

- Primary goal
- Baseline
- Completed milestone
- Current daily state
- Optional profile and supporting context

## Project Files

- `index.html`: App structure and UI sections
- `style.css`: Mobile-first dark premium styling
- `script.js`: LocalStorage logic, adaptive missions, and dashboard behavior
- `server.js`: Static server and API entry point
- `server/`: Modular OpenAI milestone planner helpers
- `README.md`: Project guide

## Notes

- Clearing browser site data or `localStorage` resets the app.
- The app is intentionally framework-free to keep future upgrades simple.
- The app remains local-first. The OpenAI route is used only for milestone suggestions after milestone completion.
