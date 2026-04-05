Trip to Japan in April! Young budget conscious couple.
Ask clarifying questions when helping us plan our trip!

# Flights
| Flight | Date | From | Departs | To  | Arrives | Duration |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| AC009 | Fri 10 Apr 2026 | Toronto – Pearson Intl (YYZ), T1 | 13:30 | Tokyo – Narita (NRT), T1 | 15:50 (+1 day) | 13h 20m |
| UA876 | Thu 30 Apr 2026 | Tokyo – Haneda Int. (HND), T3 | 15:50 | San Francisco – SFO Int. Terminal | 09:35 | 9h 45m |
| AC740 | Thu 30 Apr 2026 | San Francisco Intl (SFO), T2 | 12:00 | Toronto – Pearson Intl (YYZ), T1 | 20:00 | 5h 00m |

## Google Calendar
My google calendar has some events already added to the calendar 'Viv and Alex <3'. If you want to modify the calendar you must ask for my permission first!

---

# Trip App

Static site that renders `trip.json` into HTML pages via EJS templates. Hosted on GitHub Pages.

## How it works
```
trip.json  →  build.js (Node + EJS)  →  dist/*.html  →  GitHub Pages
```

- `trip.json` is the **single source of truth** for all itinerary and packing data
- `node build.js` reads it and generates HTML pages in `dist/`
- `dist/` is gitignored — produced by CI or locally, never committed
- GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys on push to `main`
- Preview locally: `npx serve dist`

## Key files
| File | Purpose |
|------|---------|
| `trip.json` | All trip data — the only file edited during travel |
| `build.js` | Build script: reads trip.json, renders templates → dist/ |
| `src/style.css` | Shared styles (design system from prototypes) |
| `src/main.js` | Client-side JS (expand/collapse, packing + localStorage) |
| `src/templates/*.ejs` | EJS templates (layout, index, section, packing) |
| `src/manifest.json` | PWA manifest |
| `src/sw.js` | Service worker (offline support) |

## Generated pages
| Page | Section ID | Dates |
|------|-----------|-------|
| `tokyo-arrival.html` | `tokyo-arrival` | Apr 11 |
| `kanazawa.html` | `kanazawa` | Apr 12–14 |
| `kyoto.html` | `kyoto` | Apr 15–17 |
| `osaka.html` | `osaka` | Apr 18–21 |
| `hiroshima.html` | `hiroshima` | Apr 22–23 |
| `hakone.html` | `hakone` | Apr 24–25 |
| `tokyo-final.html` | `tokyo-final` | Apr 26–30 |
| `packing.html` | — | Packing list |
| `index.html` | — | Home (auto-redirects to active section) |

---

# Updating itineraries

`trip.json` is organized as `sections[] → days[] → events[]`. When working on a day's itinerary, **read the existing day object first**, then replace it with an updated version matching the schema below.

To locate a day: find the section by `id`, then the day by `date`.

**After editing trip.json, always run `node build.js` to regenerate the site and verify it builds cleanly.**

## Day object schema
```json
{
  "date": "2026-04-15",
  "title": "Short memorable name for the day",
  "subtitle": "Wednesday Apr 15 · Travel day from Kanazawa · Afternoon only",
  "note": "Optional callout shown at top of day (travel context, heads-up, etc.)",
  "accommodation": {
    "name": "Hotel Grand Bach",
    "notes": "Refund before Apr 13 · $750 · Paid",
    "maps_url": "https://maps.app.goo.gl/...",
    "booking_url": "https://www.expedia.ca/..."
  },
  "events": []
}
```
- `note` is optional — use for travel logistics, weather warnings, or context
- `accommodation` is optional — omit on departure days with no overnight stay
- `accommodation.maps_url` and `accommodation.booking_url` are both optional

## Event object schema
```json
{
  "type": "flight | train | activity | restaurant | note",
  "time": "14:00",
  "duration": "30 min",
  "title": "Check in · Hotel Grand Bach",
  "tagline": "Drop bags, freshen up, get oriented",
  "notes": "Freeform detail shown in the expanded card body. Use \\n for line breaks.",
  "maps_url": "https://maps.app.goo.gl/...",
  "booking_url": "https://www.expedia.ca/...",
  "booking_ref": "Confirmation number",
  "pills": ["booked", "free", "cost", "food", "photo"],
  "optional": false
}
```
- `time` and `duration` are optional (omit for flexible/unscheduled items)
- `pills` is an array of zero or more: `free` (green), `cost` (neutral), `booked` (red), `food` (gold), `photo` (blue)
- `optional: true` shows a grey "optional" label on the card
- `notes`, `maps_url`, `booking_url`, `booking_ref` are all optional
- `type` controls the emoji: ✈️ flight, 🚄 train, 📍 activity, 🍜 restaurant, 📝 note

## Section-level fields (rarely changed)
```json
{
  "id": "kyoto",
  "title": "Kyoto",
  "subtitle": "Three days",
  "dates_label": "Apr 15 – 17",
  "meta_chips": ["🏨 Hotel Grand Bach", "📸 Photography focus"],
  "days": []
}
```
- `id` determines the output filename (`kyoto` → `kyoto.html`)
- `meta_chips` are freeform strings shown as grey chips in the page header