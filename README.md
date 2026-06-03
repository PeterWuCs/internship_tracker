# 🗂️ Internship Tracker Widget

A lightweight macOS desktop widget built for [Übersicht](http://tracesof.net/uebersicht/) that helps you track internship applications without the overhead of a full tracking spreadsheet.

Because most companies ghost you anyway — you just need the numbers.

---

## What it does

- Tracks **total applications sent** and **number of firms** applied to
- Big, readable numbers that are visible at a glance
- **+** button to increment, small **−** button in case you misclick
- **Auto dark/light mode** — follows your macOS system appearance
- Counts **persist across restarts** — saved locally to `~/.internship_tracker.json`
- Sits on your desktop, behind all windows, out of the way

## Preview

| Light Mode (Day) | Dark Mode (Night) |
|---|---|
| Clean warm background | Dark frosted glass |

---

## Requirements

- macOS (tested on **Sequoia 15.7.3**)
- [Übersicht](http://tracesof.net/uebersicht/) — free, ~4MB

---

## Installation

1. **Install Übersicht** from [tracesof.net/uebersicht](http://tracesof.net/uebersicht/)
2. Launch Übersicht — you'll see its icon in your menu bar
3. Click the menu bar icon → **"Open Widgets Folder"**
   - Or manually open: `~/Library/Application Support/Übersicht/widgets`
4. Drop `internship-tracker.jsx` into that folder
5. The widget appears on your desktop automatically

---

## Usage

- Click **`+`** under **Applications** every time you submit an application
- Click **`+`** under **Firms** every time it's a new company
- Hit the small **`−`** if you accidentally incremented
- To interact with the widget, click the Übersicht menu bar icon → **"Allow Interaction"**

---

## Customization

### Change position
Edit the `className` at the top of the file:

```js
export const className = `
  left: 35%;
  top: 5%;
  transform: translateX(-50%);
  pointer-events: all;
`;
```

Adjust `left` and `top` to move the widget anywhere on your screen.

### Change dark/light mode hours
By default, light mode is active from **7am–7pm**. Edit this line:

```js
const isDay = hour >= 7 && hour < 19;
```

---

## Data

Counts are saved to:
```
~/.internship_tracker.json
```

You can manually edit this file to set any starting number:
```json
{ "apps": 42, "firms": 17 }
```

---

## Built with

- [Übersicht](http://tracesof.net/uebersicht/) — desktop widget engine for macOS
- React JSX (bundled by Übersicht)
- Shell script for reading/writing JSON state

---

Good luck with the applications. You got this. 🤞
