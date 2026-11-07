# <img src="https://raw.githubusercontent.com/iamqazolp/vscode-gradient-themes/main/media/icon.png" width="38" height="38" align="top" alt="VSCode Gradient Themes Logo" /> VSCode Gradient Themes

[![VSCode Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/iamqazolp.vscode-gradient-themes?label=VSCode%20Marketplace&logo=visual-studio-code&color=22c55e)](https://marketplace.visualstudio.com/items?itemName=iamqazolp.vscode-gradient-themes)
[![VSCode Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/iamqazolp.vscode-gradient-themes?label=Downloads&color=38bdf8)](https://marketplace.visualstudio.com/items?itemName=iamqazolp.vscode-gradient-themes)
[![GitHub Repository](https://img.shields.io/badge/GitHub-iamqazolp%2Fvscode--gradient--themes-181717?logo=github)](https://github.com/iamqazolp/vscode-gradient-themes)
[![Report Issue](https://img.shields.io/badge/Issues-Report%20Bug%20%2F%20Feature-f59e0b?logo=github)](https://github.com/iamqazolp/vscode-gradient-themes/issues)
[![License: MIT](https://img.shields.io/badge/License-MIT-a855f7.svg)](https://github.com/iamqazolp/vscode-gradient-themes/blob/main/LICENSE.txt)

> **Turn your IDE into living aurora glass.** Seamless full-window 4-color gradient meshes, crisp **OKLCH Gradient Code Highlighting**, per-component palette sculpting (`Editor`, `Explorer`, `Chat`, `Terminal`, `Bars`, `Select`, `Syntax`), **Breathing Aurora** animations, and **30+ curated moods**—built for **VSCode, Cursor, Windsurf, and Antigravity IDE** with **0ms** keystroke overhead.

| 🌸 Gradient Studio — *Sakura Horizon (Light)* | 🌌 Gradient Studio — *Antarctic Borealis + Syntax Sculptor (Dark)* |
| :---: | :---: |
| ![Gradient Studio Light](https://raw.githubusercontent.com/iamqazolp/vscode-gradient-themes/main/media/screenshots/gradient-studio-light.png) | ![Gradient Studio Dark](https://raw.githubusercontent.com/iamqazolp/vscode-gradient-themes/main/media/screenshots/gradient-studio-dark.png) |

![Prism Rainbow Seamless Full-Window Mesh](https://raw.githubusercontent.com/iamqazolp/vscode-gradient-themes/main/media/screenshots/rainbow-overview.png)

---

## ✨ What Makes It Magical

* 🪟 **Seamless Full-Window Gradient Canvas (`Alt + Shift + S`)** — One continuous, unbroken 4-color aurora mesh flows across your Title Bar, Activity Bar, File Explorer, Editor Tabs, Code Canvas, Sticky Scroll, Terminal, AI Chat, and Status Bar. Prefer distinct per-panel gradients with glowing rainbow dividers? Toggle **`Seamless: ON / OFF`** in 1 click.
* 🌈 **Crisp 2-Stop Gradient Code Highlighting (`Alt + Shift + C`)** — Plain variables, punctuation, and comments stay **100% solid CoreText-antialiased native text** for effortless readability, while keywords, functions, types, strings, and numbers shimmer in perceptual **OKLCH** gradients.
* 🎯 **8 Independent Component Scopes** — Assign a single palette to **`All`**, or give **`Editor`**, **`Explorer`**, **`Chat`**, **`Terminal`**, **`Bars`**, **`Select`**, and **`Syntax`** their own custom 4-color palettes!
* 🫁 **4-Mode `Breathing Aurora` Engine (`Alt + Shift + B`)** — Mix **`Full Wave`** (rotating mesh angles), **`Pulse`** (gentle breathing opacity), **`Shimmer`** (4-stop color rotation), and **`Auto-Morph`** (smooth cross-fades into new palettes) with a live **`Speed` (`25%` – `250%`)** slider.
* 📌 **Sticky Scroll & Floating Widgets in a 4-Color Gradient Frame** — Sticky Scroll headers, Find/Replace widgets, Hover cards, and AI Chat prompt boxes float inside a frosted-glass gradient pill with a 4-stop rainbow border so scrolling code never bleeds through.

---

## 🌈 Gradient Code Highlighting & Editor Highlight Boxes

![Gradient Code Highlighting Showcase](https://raw.githubusercontent.com/iamqazolp/vscode-gradient-themes/main/media/screenshots/syntax-gradient-showcase.png)

Select the **`Syntax`** pill inside **Gradient Studio** (or press **`Alt + Shift + C`**) to customize how your code is painted:

| Syntax Mode | How It Works | Best For |
| :--- | :--- | :--- |
| **✦ Semantic Blend *(Default)*** | Extracts each token's semantic theme color, generates a 2-stop analogous hue gradient, and blends in your active 4-color palette in perceptual **`oklch`** color space. | Keeping familiar semantic colors (red keywords, blue functions, green strings) while tinting them to match your palette. |
| **🌈 4-Color Palette Prism (`Alt + Shift + C`)** | Cycles colored syntax tokens directly through your active 4-color **`Syntax`** (or **`All`**) palette with automatic Light/Dark luminance clamping (`74%–86%` L on Dark, `20%–36%` L on Light). | Full vaporwave, cyberpunk, pastel sakura, or monochrome ombré code canvases. |

**Every Editor Highlight Box is also upgraded to a 4-color gradient pill:**
* 🔍 **Find Matches (`.findMatch` / `.currentFindMatch`)** — Multi-stop gradient glow with a crisp gold/blue focus ring.
* 🖍️ **Symbol Occurrences (`.wordHighlight` / `.wordHighlightStrong`)** — Subtle aurora tint with an accent underline bar when clicking any variable or function.
* 🫧 **Text Selection (`Select` scope) & Bracket Match (`.bracket-match`)** — Smooth 4-color highlight across code, terminal, and chat, plus glowing bracket-pair frames.
* 💬 **Markdown & AI Chat Code Blocks** — Fenced code blocks (`.hljs-*`) and inline `` `code` `` pills in AI Chat and Markdown Previews inherit your active syntax gradient.

---

## 🖼️ Visual Mood & Syntax Gallery

![Visual Mood Gallery](https://raw.githubusercontent.com/iamqazolp/vscode-gradient-themes/main/media/screenshots/theme-gallery-grid.png)

| 🌸 *Sakura Horizon (Light · Seamless Mode)* | 🌌 *Antarctic Borealis (Dark · Split-Panel Mode)* |
| :---: | :---: |
| ![Sakura Horizon Light](https://raw.githubusercontent.com/iamqazolp/vscode-gradient-themes/main/media/screenshots/live-randomizer-light.png) | ![Antarctic Borealis Dark](https://raw.githubusercontent.com/iamqazolp/vscode-gradient-themes/main/media/screenshots/live-randomizer-dark.png) |

---

## 🎛️ 8-Component Gradient Sculpting

Inside **Gradient Studio**, click any pill in the **Component Bar** to toggle that surface on/off or assign it a dedicated 4-color palette (a glowing dot indicates a custom per-component palette):

| Component Pill | Workbench Surface Controlled | Independent Custom Palette? |
| :--- | :--- | :---: |
| **`All`** | Master switch & global 4-color palette across the entire IDE | ✅ Master |
| **`Editor`** | Main code editor canvas, gutter, Sticky Scroll frame & minimap | ✅ Yes |
| **`Explorer`** | Left File Explorer, Search, Source Control & Activity Bar | ✅ Yes |
| **`Chat`** | Right AI Chat sidebar (Cursor / Windsurf / Copilot / Antigravity) & inline `code` pills | ✅ Yes |
| **`Terminal`** | Integrated Terminal, Problems, Output & Debug Console | ✅ Yes |
| **`Bars`** | Title Bar, Active Editor Tab pill, Breadcrumbs & Status Bar | ✅ Yes |
| **`Select`** | Universal 4-color text selection & editor occurrence highlights | ✅ Yes |
| **`Syntax`** | Code syntax tokens (`.mtk*`), Markdown/Chat `.hljs-*` & Semantic/Prism mode | ✅ Yes |

---

## ⚡ Controls & Keyboard Shortcuts

### Status Bar Pills (`↻`, `Breathe`, `Studio ▴` — `0ms`, No Reload)
| Action | Click / Shortcut | What It Does |
| :--- | :--- | :--- |
| **Roll New Mood** | **Left-Click `↻`** or **`Alt + Shift + G`** | Instantly blends a new 4-color gradient & mesh angle |
| **Open Gradient Studio** | **Click `Studio ▴`**, **`Alt + Click`**, or **`Alt + Shift + P`** | Opens the frosted-glass Gradient Studio & 4-Stop Color Sculptor |
| **Toggle Breathing Aurora** | **Click `Breathe`** or **`Alt + Shift + B`** | Starts/pauses the 4-mode Breathing Aurora animation engine |
| **Toggle Seamless Mode** | **Click `Seamless: ON`** or **`Alt + Shift + S`** | Switches between **Unified Full-Window Canvas** and **Per-Panel Split Gradients** |
| **Toggle Syntax Mode** | **Click Syntax Mode Card** or **`Alt + Shift + C`** | Switches code syntax between **Semantic Blend (OKLCH)** and **4-Color Palette Prism** |
| **Undo / Previous Roll** | **`Alt + Shift + Z`** | Steps backward through your last 30 rolled palettes |
| **Rotate 4 Color Stops** | **`Alt + Shift + R`** | Rotates the 4 active colors around the corners |
| **Adjust Intensity** | **Drag Slider** or **`Alt + Shift + Up / Down`** | Scales gradient intensity from whisper-soft (`40%`) to neon (`180%`) |
| **Reset / Toggle Off** | **Right-Click `↻`** or **`Alt + Shift + 0`** | Cycles between **Prism Classic** and **Theme Native (Overlay Off)** |
| **Auto-Roll on Startup** | **`Cmd/Ctrl + Click`** on `↻` | Toggles `• Auto` to roll a fresh palette every time VSCode opens |

---

## 🎨 12 Core Color Themes (`Cmd + K, Cmd + T`)

Every theme is crafted in both a **Glacial Daylight (`Light`)** and **Deep Aurora (`Dark`)** edition:

| Palette Family | ☀️ Light Edition | 🌙 Dark Edition | Visual Vibe |
| :--- | :--- | :--- | :--- |
| **🌈 Prism Rainbow** | `Prism Rainbow Gradient (Pastel 4-Color Light)` | `Prism Rainbow Gradient (Aurora 4-Color Dark)` | Pastel 4-color prism mesh / Deep aurora night |
| **💧 Pure Blue** | `Pure Blue Gradient (Sky to Sapphire Light)` | `Pure Blue Gradient (Abyssal Cobalt Dark)` | Glacial sapphire sky / Abyssal cobalt |
| **🍵 Pure Green** | `Pure Green Gradient (Mint to Emerald Light)` | `Pure Green Gradient (Forest Emerald Dark)` | Ceremonial botanical jade / Deep forest emerald |
| **🌸 Pure Pink** | `Pure Pink Gradient (Sakura to Rose Light)` | `Pure Pink Gradient (Velvet Berry Dark)` | Sakura petal blush / Velvet berry night |
| **🌅 Pure Yellow** | `Pure Yellow Gradient (Sunlit Honey Light)` | `Pure Yellow Gradient (Golden Amber Dark)` | Golden-hour honey amber / Warm twilight ember |
| **🔮 Pure Purple** | `Pure Purple Gradient (Lavender to Amethyst Light)` | `Pure Purple Gradient (Cosmic Amethyst Dark)` | Wisteria & lavender mist / Cosmic amethyst |

![Pure Blue Glacial](https://raw.githubusercontent.com/iamqazolp/vscode-gradient-themes/main/media/screenshots/pure-blue-glacial.png)

---

## 🎲 30 Curated Studio Palettes (+ Unlimited Custom & Procedural Harmonies)

Filter by **`All`**, **`Favs ★`**, **`Prism`**, **`Pastel`**, **`Pure`**, or **`Custom`** inside **Gradient Studio**:

| 🌈 Prism & Aurora (12) | 🌸 Atmospheric Pastels (10) | 💧 Pure Single-Hue Ombré (8) |
| :--- | :--- | :--- |
| **Prism Classic** *(Red · Gold · Green · Blue)* | **Sakura Horizon** *(Pink · Quartz · Orchid · Sky)* | **Pure Lagoon Cyan** *(Teal → Seafoam)* |
| **Antarctic Borealis** *(Cyan · Ice · Mint · Violet)* | **Matcha Yuzu** *(Matcha · Bamboo · Yuzu · Sky)* | **Pure Apricot Peach** *(Coral → Nectarine)* |
| **Cosmic Lavender** *(Amethyst · Rose · Blue · Teal)* | **Peach Sorbet** *(Nectarine · Guava · Mango · Lilac)* | **Pure Starlight Indigo** *(Indigo → Periwinkle)* |
| **Sunset Lagoon** *(Coral · Amber · Lagoon · Ocean)* | **Rose Champagne** *(Rose · Gold · Blush · Orchid)* | **Pure Camellia Rose** *(Berry → Flamingo)* |
| **Nordic Fjord** *(Fjord · Indigo · Pine · Lilac)* | **Alpine Glacier** *(Sky · Indigo · Mint · Fuchsia)* | **Pure Glacier Blue** *(Cobalt → Polar Ice)* |
| **Kyoto Autumn** *(Maple · Persimmon · Gold · Violet)* | **Cafe Matcha** *(Emerald · Lime · Honey · Teal)* | **Pure Ceremonial Matcha** *(Uji Jade → Mint)* |
| **Bioluminescent Reef** *(Cyan · Emerald · Blue · Indigo)* | **Desert Mirage** *(Amber · Rose · Sun · Sky)* | **Pure Sunlit Honey** *(Amber → Champagne)* |
| **Cyberpunk Pastel** *(Neon Rose · Violet · Cyan · Gold)* | **Amalfi Citrus** *(Lemon · Orange · Mint · Azure)* | **Pure Wisteria Violet** *(Amethyst → Lavender)* |
| **Midnight Orchid** *(Orchid · Pink · Indigo · Teal)* | **Lavender Milk Tea** *(Lilac · Pink · Honey · Periwinkle)* | |
| **Tokyo Neon Mist** *(Crimson · Magenta · Indigo · Cyan)* | **Arctic Sunbeam** *(Ice Blue · Mint · Sunbeam · Indigo)* | |
| **Polaris Emerald** *(Emerald · Cyan · Blue · Violet)* | | |
| **Velvet Sangria** *(Ruby · Berry · Purple · Amber)* | | |

---

## ⚡ Command Palette (`Cmd + Shift + P`)

| Command | ID | Description |
| :--- | :--- | :--- |
| **Gradient Themes: Enable 4-Color Rainbow Gradient & Live Randomizer** | `gradientThemes.enableGradientOverlay` | Injects the 4-color gradient mesh, syntax engine, and Status Bar Studio |
| **Gradient Themes: Disable 4-Color Rainbow Gradient Overlay** | `gradientThemes.disableGradientOverlay` | Cleanly removes the full-workbench gradient overlay |
| **Gradient Themes: Roll Random Single-Color Glacial Theme** | `gradientThemes.rollRandomTheme` | Switches to a random core theme from the 12-theme suite |
| **Gradient Themes: Open Interactive Theme & Gradient Preview** | `gradientThemes.openPreview` | Opens the interactive webview preview gallery |
| **Gradient Themes: Open GitHub Repository** | `gradientThemes.openGitHub` | Opens `github.com/iamqazolp/vscode-gradient-themes` |
| **Gradient Themes: Report Issue on GitHub (with Diagnostics)** | `gradientThemes.reportIssue` | Opens a pre-filled GitHub issue with IDE, OS, active theme & overlay diagnostics |
| **Gradient Themes: Show Extension Telemetry & Marketplace Stats** | `gradientThemes.showTelemetryStats` | Queries live VSCode Marketplace metrics (`install` vs `downloadCount` vs `updateCount`) |

---

## 🛠️ CLI Palette & Theme Generator ([`COLOR_GUIDE.md`](https://github.com/iamqazolp/vscode-gradient-themes/blob/main/COLOR_GUIDE.md))

Want to generate new core themes or add custom 4-color presets via CLI? Use [`add_color.py`](https://github.com/iamqazolp/vscode-gradient-themes/blob/main/add_color.py):

```bash
# Generate a Light + Dark theme pair from a single hex color
python3 add_color.py theme --name "Pure Cyan" --color "#06B6D4"

# Add a custom 4-stop palette to the Status Bar Studio
python3 add_color.py randomizer --name "Cyber Mint" --stops "#06B6D4,#10B981,#3B82F6,#8B5CF6"

# List all active themes and Studio presets
python3 add_color.py list
```

---

## License

MIT © [iamqazolp](https://github.com/iamqazolp)
