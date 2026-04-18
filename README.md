# Hijri ReCalendar

### Highly customizable Hijri (Umm al-Qura) calendar for ReMarkable tablets

Hijri ReCalendar generates a personalized Islamic calendar PDF optimized for the [ReMarkable tablet](https://remarkable.com/store/remarkable-2), using the Umm al-Qura calendar as the primary timeline and showing Gregorian dates alongside for cross-reference. Everything runs in your browser — no data leaves your machine.

This is a fork of [ReCalendar](https://github.com/klimeryk/recalendar.js) by Igor Klimer, re-plumbed around the Hijri calendar. The original PDF layout and configuration system are preserved; the date engine has been swapped so that year, month, week, and day pages all iterate on the Hijri year.

## What's Hijri about it

- **Year overview** lists 12 Hijri months (Muharram → Dhu al-Hijjah) with mini month grids.
- **Month overview pages** are triggered on the 1st of each Hijri month, with a habit-tracker grid that matches the Hijri month's 29- or 30-day length.
- **Day pages** show the Hijri day number (`01`–`30`) as the big number, the Hijri month + year in the title, and the weekday + Gregorian date in the subtitle.
- **Week overview / retrospective pages** display both the Hijri date range and the Gregorian date range.
- **Mini-calendars** render the Hijri month grid and link back to month/week/day pages correctly.
- **Special dates** are keyed by Hijri `MM-DD`, so holidays like Eid al-Fitr (10-01) or Day of Arafah (12-09) recur correctly on every Hijri year. The default config ships with common Islamic holidays.
- **ICS imports** of Gregorian calendars are automatically converted to Hijri `MM-DD` keys.

## Calendar algorithm

Uses the [@umalqura/core](https://www.npmjs.com/package/@umalqura/core) library, which implements the official Saudi Umm al-Qura calendar tables (supported range: **1318–1500 AH**).

## Quickstart

[Vite](https://vitejs.dev/) drives development. Use `nvm` (or equivalent) to pick the Node version from `.nvmrc`.

```sh
nvm use
npm install
npm run dev
```

Then open http://localhost:5173/create.html.

## Current status

Phase 1 (Hijri iteration + dual-date rendering + config form) is functional end-to-end. Arabic font rendering and RTL layout are not yet wired up — Hijri month names are shown in transliterated Latin (`Muharram`, `Ramadan`, `Dhu al-Hijjah`, etc.). Hooking up a Noto Naskh Arabic face in [src/pdf/lib/fonts.js](src/pdf/lib/fonts.js) is the main remaining item.

## License

Inherits [AGPL-3.0](LICENSE) from upstream ReCalendar. Changes made in this fork must be published under the same terms.
