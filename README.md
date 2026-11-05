# ✨ Gemini Prism 4-Color Gradient Theme Family

Inspired by the **4-Point Gemini Star Gradient**:
- 🔴 **Top Point — Gemini Red / Coral (`#EA4335` / `#FF6B63`)**: Title Bar, Active Tab Top Highlight, Keywords & Tags
- 🟡 **Left Point — Gemini Golden Yellow (`#FBBC04` / `#FFD15C`)**: Activity Bar, Explorer Sidebar, Classes, Types & Cursor
- 🟢 **Bottom Point — Gemini Emerald Green (`#34A853` / `#4BE084`)**: Bottom Terminal Panel, Status Bar, Strings & Git Additions
- 🔵 **Right & Core — Gemini Azure Blue (`#4285F4` / `#6BA5FF`)**: Center Editor Canvas, `agy` Terminal, Functions & Focus Accents

---

## 🎨 6 Included Variants (`Cmd + K` then `Cmd + T`)

1. **✨ Gemini Prism Dark (4-Color Star)** — *Default Dark*: Deep sapphire editor (`#0F172A`) framed by a deep crimson-plum top bar (`#23131B`), warm golden-umber sidebar (`#1A1712`), and deep emerald-forest bottom panel (`#0E1E18`).
2. **🌈 Gemini Star Spectrum (Vibrant Dark)** — *High-Saturation Spatial Gradient*: Bold ruby top bar (`#331520`), marigold-bronze sidebar (`#241C10`), emerald-lagoon bottom terminal (`#0F291E`), and rich cobalt-sapphire editor (`#101E38`).
3. **🌌 Gemini Cosmic OLED (True Black)** — *Pitch-Black OLED*: Pure `#05070C` OLED canvas with dark-glass star-tinted side panels and neon 4-color syntax.
4. **🔮 Gemini Aurora Flow (Dusk Gradient)** — *Diagonal Dusk*: Flows smoothly from rose-magenta (`#241421`) and amethyst (`#1B1524`) into deep sapphire (`#11182B`) and aurora teal-emerald (`#0E2024`).
5. **☀️ Gemini Prism Light (Pastel 4-Color Star)** — *Multi-Zone Pastel Day*: Soft crystal sky-blue editor (`#EDF4FF`) framed by a pastel rose-coral top bar (`#FCE4E1`), sunlit buttercup-cream sidebar (`#FDF5D8`), and mint-emerald bottom panel (`#E3F6EB`).
6. **🌤️ Gemini Daylight Breeze (Warm Cream & Star)** — *Eye-Care Warm Light*: Warm sunlit ivory-cream editor (`#FAF7EE`) framed by a soft Gemini blue sidebar (`#E4EFFD`), rose-peach top bar (`#FCE8E4`), and ceremonial mint-emerald bottom panel (`#E2F5EA`).

---

## 🌟 Optional: Enable True CSS Mesh Gradients (`radial-gradient` & `linear-gradient`)

Because native VS Code JSON themes only accept solid hex colors per surface, this extension also bundles ready-to-use **True CSS Gradient Overlay** stylesheets:
- **Dark Mesh CSS:** `~/.vscode/extensions/iamqazolp.gemini-prism-gradient-theme-1.0.0/css/gemini-star-gradient-dark.css`
- **Light Mesh CSS:** `~/.vscode/extensions/iamqazolp.gemini-prism-gradient-theme-1.0.0/css/gemini-star-gradient-light.css`

To activate true CSS gradients using **Custom CSS and JS Loader** (`be5invis.vscode-custom-css`), add this to your `settings.json`:
```json
"vscode_custom_css.imports": [
  "file:///Users/iamqazolp/.vscode/extensions/iamqazolp.gemini-prism-gradient-theme-1.0.0/css/gemini-star-gradient-dark.css"
]
```
