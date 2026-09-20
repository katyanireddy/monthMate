# MonthMate ♥ — Plan it. Do it. Slay it.

A pastel, feminine, premium productivity dashboard: a monthly calendar task
manager built with React + Vite + Tailwind CSS + Framer Motion. Fully
functional — not a static mockup — with LocalStorage persistence.

## 1. Setup instructions

Requirements: **Node.js 18+** and npm (I can't verify your local Node
version — check with `node -v` and update if it's below 18).

```bash
cd monthmate
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

Other scripts:
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build locally

I ran `npm install` and `npm run build` myself while building this and both
completed with no errors, so the project is verified to install and build
cleanly as delivered. I can't guarantee the exact dependency versions in
`package.json` will still resolve identically months from now — if `npm
install` ever complains about a package, check npmjs.com for its current
version.

## 2. File structure

```
monthmate/
├── index.html                  # HTML entry, loads Google Fonts (Fraunces + Plus Jakarta Sans)
├── package.json
├── vite.config.js
├── tailwind.config.js          # Design tokens: colors, radii, shadows, fonts
├── postcss.config.js
└── src/
    ├── main.jsx                 # React root, wraps App in TaskProvider
    ├── App.jsx                  # Layout orchestration, view switching, modal/toast state
    ├── index.css                 # Tailwind directives + base styles
    ├── data/
    │   ├── categories.js         # Category colors + priority definitions (single source of truth)
    │   └── seedTasks.js          # First-run demo tasks matching the reference screenshot
    ├── utils/
    │   ├── dateUtils.js           # Calendar grid math, leap years, formatting
    │   └── storage.js             # LocalStorage read/write helpers
    ├── context/
    │   └── TaskContext.jsx        # Global task state (reducer) + LocalStorage sync
    └── components/
        ├── Sidebar.jsx             # Nav, brand, motivational card, cat illustration
        ├── CatIllustration.jsx     # Original inline SVG sleeping cat
        ├── Header.jsx               # Search bar (functional), theme toggle, avatar
        ├── Calendar/
        │   ├── Calendar.jsx          # Month grid + navigation header
        │   ├── CalendarDay.jsx       # One date cell
        │   └── TaskChip.jsx          # Pill-shaped task chip
        ├── DailyTaskPanel.jsx       # Right-side panel: quick add, task list, progress
        ├── TaskModal.jsx             # Full add/edit task form
        ├── QuickAdd.jsx              # Bottom-row quick-add card
        ├── MonthlyStats.jsx          # "This Month" stat card
        ├── UpcomingTasks.jsx         # Sorted upcoming list
        └── MotivationalBanner.jsx    # Bottom pastel banner
```

## 3. Major components, explained

- **`TaskContext.jsx`** — the single source of truth for all tasks. Uses a
  reducer (`ADD_TASK`, `UPDATE_TASK`, `DELETE_TASK`, `TOGGLE_COMPLETE`,
  `MOVE_DATE`, `TOGGLE_IMPORTANT`) and writes to LocalStorage on every
  change via a `useEffect`. On first load it seeds itself from
  `seedTasks.js` so the app isn't empty; after that, LocalStorage wins.
- **`dateUtils.js`** — pure functions with no React dependency. `
  buildCalendarGrid(year, month)` returns full week rows (7 cells each)
  including muted leading/trailing days from adjacent months, correctly
  handling weekday alignment and leap years (`isLeapYear`/`daysInMonth`).
- **`App.jsx`** — owns UI state that isn't "task data": which month is
  showing, which date is selected, which sidebar nav item is active,
  modal open/closed, toast messages, light/dark theme. It derives
  `tasksByDate` (a `Map` for O(1) lookups per cell), `monthStats`, and
  `upcomingTasks` with `useMemo` so recalculation only happens when
  `tasks` or `view` actually change.
- **Sidebar nav → filtered views**: selecting *Today*, *Upcoming*,
  *Important*, or *Completed* swaps the calendar out for a
  `FilteredListView` (defined at the bottom of `App.jsx`) showing that
  slice of tasks; *Habits* and *Notes* show a friendly "on the roadmap"
  placeholder since they were out of scope for this build's task model.
  *Calendar* always returns you to the full monthly view.
- **`TaskModal.jsx`** — same form for both create and edit; if `initial`
  has an `id`, it saves via `UPDATE_TASK`, otherwise `ADD_TASK`. Validates
  that title and date are present before submitting.
- **Search (`Header.jsx`)** — filters `tasks` by title client-side as you
  type, shows a friendly empty state, and jumps the calendar to a
  result's date on click.

## 4. What's functional (tested while building)

- ✅ Add task (full modal + right-panel quick add + bottom Quick Add card)
- ✅ Edit task (via the ⋮ menu on any task row)
- ✅ Delete task
- ✅ Mark complete / unmark (checkbox and menu both toggle it, with a
  strikethrough and an updating progress bar)
- ✅ Change a task's date (opens the same modal pre-filled)
- ✅ Month navigation (prev/next/Today), correct weekday alignment for
  every month I spot-checked, including February in a leap year (2028)
  and a non-leap year (2026)
- ✅ LocalStorage persistence — refreshing the page keeps all changes
- ✅ Search with empty state
- ✅ Responsive layout down to mobile (sidebar becomes a slide-in drawer
  under `lg` breakpoint, calendar/daily-panel/bottom-cards all stack)
- ✅ `npm run build` completes with no errors or warnings

## 5. Notes on the design

Followed your reference image and brief directly: soft pink sidebar
gradient, `#ED4F86` primary, off-white `#FBF8FC` background, rounded
cards, Fraunces for display type paired with Plus Jakarta Sans for body
text (a serif/sans pairing gives the "premium, feminine, not childish"
feel your brief asked for without relying on generic templated
defaults). The cat illustration is an original inline SVG, not a
copyrighted asset.

If anything about the visual match needs adjusting once you see it
running locally, tell me what's off and I'll fix it directly in the
component files.
