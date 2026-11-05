# <img src="./media/icon.png" width="36" height="36" align="top" alt="VS Code Gradient Themes Logo" /> VS Code Gradient Themes

12 gradient color themes (6 Light & Dark families) + a translucent 4-color gradient overlay and live Status Bar randomizer (`🎲` with 30 curated palettes + procedural HSL harmonies) for VS Code, Cursor, Windsurf, and Antigravity IDE.

![4-Color Rainbow Overlay](./media/screenshots/rainbow-overview.png)

| Single-Color Glacial Palette Suite |
| :---: |
| ![Single-Color Glacial Palette Suite](./media/screenshots/theme-gallery-grid.png) |

| Live `🎲` Randomizer (Light — Sakura Horizon) | Live `🎲` Randomizer (Dark — Antarctic Borealis) | Pure Blue Glacial Theme |
| :---: | :---: | :---: |
| ![Live Randomizer Light](./media/screenshots/live-randomizer-light.png) | ![Live Randomizer Dark](./media/screenshots/live-randomizer-dark.png) | ![Pure Blue Glacial](./media/screenshots/pure-blue-glacial.png) |

---

## How Themes & the `🎲` Randomizer Work Together

The extension has two independent layers that can be used separately or combined:

1. **Base Color Theme (`Cmd + K, Cmd + T`):**
   Sets the workbench's base background colors (`var(--vscode-*-background)`) and **monochromatic syntax highlighting** tuned to that color family.
2. **Live `🎲` Gradient Overlay (`js/gradient-randomizer.js` + `css/rainbow-gradient-light.css`):**
   Instead of overwriting `background-color`, the CSS overlay applies a translucent `background-image` mesh over your active theme's native surface variables.
   - **Combining both:** Pick any Light or Dark theme in `Cmd + K, Cmd + T` (for its base tone and syntax colors), then click **`🎲`** in the Status Bar to blend different 4-color gradients on top in real time (`0ms`, no reload).
   - **Pure single-color theme only:** Right-click **`🎲`** (or press `Alt + Shift + 0`) to cycle between **Prism Classic** and **Theme Native (Overlay Off)** without restarting VS Code.

---

## 1. 12 Color Themes (`Cmd + K, Cmd + T`)

| Family | Light Theme (`vs`) | Dark Theme (`vs-dark`) | Light Stops | Dark Stops |
| :--- | :--- | :--- | :--- | :--- |
| **Pure Blue** | `Pure Blue Gradient (Sky to Sapphire Light)` | `Pure Blue Gradient (Abyssal Cobalt Dark)` | `#D8ECFD → #FAFDFF` | `#090E16 → #162438` |
| **Pure Green** | `Pure Green Gradient (Mint to Emerald Light)` | `Pure Green Gradient (Forest Emerald Dark)` | `#D6F3E0 → #FAFEFC` | `#08100C → #152A1F` |
| **Pure Pink** | `Pure Pink Gradient (Sakura to Rose Light)` | `Pure Pink Gradient (Velvet Berry Dark)` | `#FADCEB → #FFFBFE` | `#11090E → #2B1925` |
| **Pure Yellow** | `Pure Yellow Gradient (Sunlit Honey Light)` | `Pure Yellow Gradient (Golden Amber Dark)` | `#FBECC0 → #FFFEFA` | `#110E08 → #2A2317` |
| **Pure Purple** | `Pure Purple Gradient (Lavender to Amethyst Light)` | `Pure Purple Gradient (Cosmic Amethyst Dark)` | `#E4D9FC → #FCFBFF` | `#0D0A14 → #231C38` |
| **Prism Rainbow** | `Prism Rainbow Gradient (Pastel 4-Color Light)` | `Prism Rainbow Gradient (Aurora 4-Color Dark)` | `#F9F3DF → #FAF0EE` | `#0E131D → #161116` |

---

## 2. Full-Workbench Rainbow Overlay & `🎲` Randomizer

### Enable / Disable
1. Open Command Palette (**`Cmd + Shift + P`** / **`Ctrl + Shift + P`**).
2. Run **`Gradient Themes: Enable 4-Color Rainbow Gradient & Live Randomizer`**.
3. Click **`Reload Custom CSS and JS`** → **Restart** (uses [`be5invis.vscode-custom-css`](https://marketplace.visualstudio.com/items?itemName=be5invis.vscode-custom-css)).

### Status Bar `🎲` Controls (No Reload Needed)
| Action | Shortcut / Click | Effect |
| :--- | :--- | :--- |
| **Roll Gradient** | **Left-Click `🎲`** or **`Alt + Shift + G`** | Rolls a new 4-color gradient & mesh angle in `0ms` (30 curated palettes + procedural HSL harmonies) |
| **Reset / Toggle Native** | **Right-Click / `Shift + Click` `🎲`** or **`Alt + Shift + 0`** | Cycles between **Prism Classic** (`#EA4335`, `#FBBC04`, `#34A853`, `#4285F4`) and **Theme Native (Overlay Off)** |
| **Auto-Roll on Startup** | **`Cmd/Ctrl + Click` `🎲`** | Toggles `• Auto` mode to roll a fresh gradient whenever VS Code opens |

---

## 3. Adding Custom Colors ([`COLOR_GUIDE.md`](./COLOR_GUIDE.md))

Use [`add_color.py`](./add_color.py) to generate standardized themes or randomizer palettes from a single hex code:

```bash
# 1. Generate a Light + Dark theme pair from one hex color (auto-checks WCAG AAA contrast)
python3 add_color.py theme --name "Pure Cyan" --color "#06B6D4"

# 2. Add a 4-color palette to the Status Bar 🎲 randomizer
python3 add_color.py randomizer --name "Cyber Mint" --stops "#06B6D4,#10B981,#3B82F6,#8B5CF6"

# 3. List all active themes and randomizer palettes
python3 add_color.py list
```

See [**`COLOR_GUIDE.md`**](./COLOR_GUIDE.md) for the exact HSL formulas, WCAG contrast targets, and `xterm.js` `#RRGGBB00` terminal transparency rules.

---

## License

MIT © [iamqazolp](https://github.com/iamqazolp)
