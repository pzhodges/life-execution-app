# Life Execution

Life Execution is a local-first personal operating system built as a premium dark-mode web app. It is designed to feel more like a calm high-performance coach and mission-control dashboard than a basic to-do list. The app adapts the day based on the user's energy, mood, goal clarity, and life situation while still being useful with very little input.

## Features

- Daily Opening screen shown once per day
- 35 original daily quotes with disciplined, calm, and zen tones
- Flexible onboarding with only a goal title required
- Adaptive dashboard with goal, phase, roadmap, mission, fuel, reflection, and win tracking
- Rule-based mission generation that changes with daily mode and life updates
- Life Update modal for stress, health, travel, opportunity, and family shifts
- Win history and streak logic
- All data stored locally with `localStorage`
- Works by opening `index.html` directly in a browser

## Run Locally

1. Download or clone this repository.
2. Open `index.html` in any modern browser.
3. For the best mobile experience, open it in Safari on iPhone or deploy it to GitHub Pages and save it to your home screen.

No install step, build process, backend, or dependencies are required.

## Publish With GitHub Pages

1. Push this project to a GitHub repository.
2. In GitHub, open `Settings`.
3. Open `Pages`.
4. Under `Build and deployment`, choose `Deploy from a branch`.
5. Select the main branch and the `/ (root)` folder.
6. Save the settings and wait for GitHub Pages to publish the site.
7. Open the published URL on your phone and optionally add it to the home screen.

Because the app is fully static, GitHub Pages works without any extra configuration.

## Data Storage

The app uses browser `localStorage` only. Nothing is sent to a server.

Stored data includes:

- Goal and profile details
- Daily opening state and assigned mode
- Daily mission items and completion state
- Reflections by date
- Wins by date
- Current streak and total wins
- Life update history
- Daily quote metadata

## Project Files

- `index.html`: App structure and UI sections
- `style.css`: Mobile-first dark premium styling
- `script.js`: LocalStorage logic, adaptive missions, and dashboard behavior
- `README.md`: Project guide

## Notes

- Clearing browser site data or `localStorage` resets the app.
- The app is intentionally framework-free to keep future upgrades simple.
- Since it is static and local-first, it is a strong fit for offline-friendly personal use and GitHub Pages hosting.
