# Standardized Color & Palette Guide

All color themes and live randomizer palettes follow a strict mathematical specification so new colors never break readability, terminal transparency, or syntax contrast.

---

## 1. CLI Quick Start (`add_color.py`)

### Add a Single-Color Theme Pair (Light + Dark)
Generate a full 27-token Light + Dark theme pair from **one hex color** (or hue angle `0–360`):

```bash
# Preview generated stops, syntax tokens, and WCAG contrast ratios
python3 add_color.py theme --name "Pure Cyan" --color "#06B6D4" --dry-run

# Save to palettes/custom_themes.json and rebuild themes/*.json + package.json
python3 add_color.py theme --name "Pure Cyan" --color "#06B6D4" \
  --light-sub "Lagoon to Frost Light" \
  --dark-sub "Abyssal Teal Dark"
```

### Add a 4-Color Status Bar Randomizer Palette (`🎲`)
Inject a 4-stop palette into [`js/gradient-randomizer.js`](./js/gradient-randomizer.js):

```bash
# Preview 7%–22% translucent rgba() values
python3 add_color.py randomizer --name "Cyber Mint" --stops "#06B6D4,#10B981,#3B82F6,#8B5CF6" --dry-run

# Inject into CURATED_PALETTES
python3 add_color.py randomizer --name "Cyber Mint" --stops "#06B6D4,#10B981,#3B82F6,#8B5CF6"
```

### List or Remove Colors
```bash
python3 add_color.py list
python3 add_color.py remove-theme --name "Pure Cyan"
python3 add_color.py remove-randomizer --name "Cyber Mint"
```

---

## 2. Standardized HSL Color Formulas

Given a seed hue $H \in [0^\circ, 360^\circ)$ and saturation $S \in [68\%, 92\%]$:

### A. Surface Gradient Stops (`gradient_stops`)

| Stop | Workbench Region | Light Mode (`7%–22%` Frost) | Dark Mode (`Polar Night`) |
| :--- | :--- | :--- | :--- |
| **`stops[0]` (`t=0.00`)** | Title Bar & Activity Bar | $\text{HSL}(H, S, 92.0\%)$ *(22% tint)* | $\text{HSL}(H, 0.48S, 5.5\%)$ |
| **`stops[1]` (`t=0.33`)** | Sidebar & Tab Strip | $\text{HSL}(H, S+3\%, 95.2\%)$ *(15% tint)* | $\text{HSL}(H, 0.48S, 8.5\%)$ |
| **`stops[2]` (`t=0.66`)** | Gutter & Sticky Scroll | $\text{HSL}(H, S+5\%, 97.6\%)$ *(10% tint)* | $\text{HSL}(H, 0.48S, 11.5\%)$ |
| **`stops[3]` (`t=1.00`)** | Main Editor Canvas | $\text{HSL}(H, S+8\%, 99.2\%)$ *(7% tint)* | $\text{HSL}(H, 0.48S, 14.5\%)$ |

### B. Foreground & Monochromatic Syntax Tokens

To keep code reviews calm and free of rainbow visual clutter, syntax tokens stay within **$\Delta H \in [-20^\circ, +20^\circ]$** of the base hue:

| Token Key | Semantic Role | Hue Offset | Light Mode ($S, L$) | Dark Mode ($S, L$) | Min Contrast |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `fg` | Primary Code Text | $+0^\circ$ | $(48\%, 12.5\%)$ | $(46\%, 92.5\%)$ | **$\ge 11.0:1$ (AAA)** |
| `fg_muted` | Operators & Punctuation | $+0^\circ$ | $(32\%, 33.0\%)$ | $(36\%, 72.0\%)$ | $\ge 6.5:1$ |
| `fg_dim` / `comment` | Comments & Line Numbers | $+0^\circ$ | $(24\%, 51.0\%)$ | $(24\%, 48.0\%)$ | $\ge 3.5:1$ |
| `blue_star` | Functions & Methods | $+0^\circ$ | $(70\%, 33.0\%)$ | $(84\%, 79.0\%)$ | $\ge 6.0:1$ (AA) |
| `red_star` | Keywords & Storage | $+8^\circ$ | $(66\%, 31.0\%)$ | $(80\%, 74.0\%)$ | $\ge 6.0:1$ (AA) |
| `yellow_star` | Types, Classes & Interfaces | $-10^\circ$ | $(58\%, 30.0\%)$ | $(82\%, 82.0\%)$ | $\ge 6.5:1$ (AA) |
| `green_star` | Strings & Raw Code | $-20^\circ$ | $(60\%, 29.5\%)$ | $(62\%, 71.0\%)$ | $\ge 5.5:1$ (AA) |
| `orange_blend` | Parameters & Decorators | $+15^\circ$ | $(42\%, 35.0\%)$ | $(54\%, 74.0\%)$ | $\ge 5.5:1$ (AA) |
| `purple_blend` | Numbers, Booleans & Constants | $+20^\circ$ | $(54\%, 33.0\%)$ | $(68\%, 75.0\%)$ | $\ge 6.0:1$ (AA) |

---

## 3. Critical Workbench Constraints (Do Not Break)

1. **`xterm.js` 8-Digit Terminal Background (`#RRGGBB00`):**
   - `terminal.background` in [`build_themes.py`](./build_themes.py) **must** be an 8-digit hex string ending in `00` alpha (`f"{c_step5[:7]}00"`, e.g. `#F3F9FF00`).
   - **Why not `#00000000`?** `xterm.js` strips the alpha byte and blends `terminal.selectionBackground` over `#000000` (black) on every selected character `<span>`, turning selected text black while whitespace stays gradient.
   - **Why not 6-digit `#F3F9FF`?** Alpha `FF` disables `allowTransparency` in `xterm.js` and paints an opaque box over the terminal gradient.
   - **Why slice `[:7]` first?** `c_step5` already has an `E6` alpha suffix (`#F3F9FFE6`). Appending `00` without slicing produces a 10-digit hex (`#F3F9FFE600`), which VSCode renders as `#FF0000` (debug red).
2. **`7%–22%` Randomizer Opacity Clamp:**
   - In [`js/gradient-randomizer.js`](./js/gradient-randomizer.js), `--g-r1`..`--g-r4` and `--g-base` / `--g-bar` / `--g-side` / `--g-panel` must keep alpha between **`0.07` and `0.22`** so syntax highlighting remains readable across all themes.
