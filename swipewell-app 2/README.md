# Swipewell

A campus event app you swipe through. It keeps a health score, tracks sleep, workouts and spending, and has a Premium tab.

It's a static web app: plain HTML, CSS and JavaScript with no build step and no server code. You can host it free anywhere that serves files. People can also install it on their phones from the browser, where it works like a normal app and keeps working offline.

```
swipewell-app/
├── index.html            the whole app
├── events.csv            your events (edit or replace this)
├── manifest.webmanifest  makes it installable
├── sw.js                 offline support
└── icons/                app icons
```

## Put it online (about 2 minutes)

### Option A: Netlify Drop (easiest, no tools)

1. Go to **https://app.netlify.com/drop**.
2. Drag the whole `swipewell-app` folder onto the page.
3. You get a public link like `https://something.netlify.app`. If Netlify asks you to sign up or claim the site, do it so the link stays live. You can rename the site in its settings.

To update events later, edit `events.csv` and drag the folder onto the site's **Deploys** page again.

### Option B: GitHub Pages

1. Create a new public repository on GitHub and upload the files inside `swipewell-app` (use **Add file → Upload files**).
2. Go to **Settings → Pages**, set Source to **Deploy from a branch**, pick `main` and `/ (root)`, then save.
3. After a minute the app is at `https://<your-username>.github.io/<repo-name>/`.

To update events, edit `events.csv` on GitHub and commit.

### Try it on your computer first

The browser won't let the app read `events.csv` if you just double-click `index.html`. Serve the folder instead:

```bash
cd swipewell-app
python3 -m http.server 8000
# open http://localhost:8000
```

If it can't read the file, the app still opens with its built-in sample events and shows a note saying so.

## Your events file

The app reads `events.csv` from the same folder. Column names aren't case-sensitive, and common alternatives work (for example `title` for `event_name`, or `venue` for `location`).

| Column | Required | Example | Notes |
|---|---|---|---|
| `event_name` | yes | Lakefront 5K Run Club | |
| `date` | yes | 2026-09-27 | `9/27/2026` also works |
| `start_time` | yes | 07:00 | `7 am` also works |
| `end_time` | | 08:00 | An end earlier than the start means it runs past midnight |
| `location` | | Lakefill Path | |
| `current_attendees` | | 42 | |
| `price` | | 0 | Numbers, `$12` or `Free` |
| `hosted_by` | | Wildcat Runners | |
| `category` | | Fitness | Social, Academic, Career, Fitness, Wellness, Nightlife, Arts or Volunteer |
| `distance_mi` | | 0.6 | Estimated if missing |
| `source` | | Google Calendar | Google Calendar, Outlook, Apple Calendar or Campus Events |
| `setting` | | Outdoor | Indoor, Outdoor or Virtual |
| `description` | | Easy-pace group run… | Put text that contains commas in "double quotes" |

Credits and priority are worked out automatically from the name, location, category and times. For example, "bar crawl" costs −20, "yoga" earns +10, and events ending after 11:30 PM cost −5. The rules are in `index.html` under `CREDIT ENGINE`.

**Prefer JSON?** Save the events as an array of objects with the same keys, name the file `events.json`, and set `DATA_FILE: 'events.json'` in the config below.

## Settings

Near the top of the `<script>` in `index.html`:

```js
const CONFIG = {
  DATA_FILE: 'events.csv',
  ANCHOR_DATE: '2026-09-26',  // shifts dummy dates so this date becomes "today"; use null for real dates
  DEMO_MODE: true             // sample history and sample calendar sync; set false for real users
};
```

- **Real, dated events:** set `ANCHOR_DATE: null`.
- **Launching to real users:** set `DEMO_MODE: false`. New users then start with a clean history.
- **After changing `index.html`:** also change `VERSION` in `sw.js` (for example to `swipewell-v2`), so phones that installed the app pick up the new version.

## Installing on a phone

- **iPhone (Safari):** open the link, tap Share, then **Add to Home Screen**.
- **Android (Chrome):** open the link, tap ⋮, then **Install app** (or **Add to Home screen**).

## What's real and what's simulated

Everything runs in the user's own browser, and each person's data is saved on their own device.

| Feature | Status | What it takes to make it real |
|---|---|---|
| Swiping, score, floor, check-ins, filters, schedule, spending, progress charts, goals | Works | Nothing. Data stays on the device. |
| Events from your file | Works | Replace `events.csv` |
| Accounts, and the same data on phone and laptop | Not included | Add a login and database, e.g. Supabase or Firebase (both have free tiers) |
| Calendar sync | Simulated with sample classes | Google Calendar API and Microsoft Graph (both need OAuth sign-in), or ask users for their calendar's ICS link |
| Premium payment | Simulated. The trial button unlocks the tab and collects no payment details | Stripe Payment Links or Checkout, plus a server check of who has paid |
| People like you | Sample profiles | Needs real accounts that share interests and RSVPs |

The first three rows of what's left (accounts, calendar sync, payments) are the natural next steps. Adding a login and database comes first, because the other two depend on it.
