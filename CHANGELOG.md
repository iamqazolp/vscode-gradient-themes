# Changelog

All notable changes to **VSCode Gradient Themes** will be documented in this file.

## [67.67.67] - 2026-11-07

### Changed
- **Golden Favorite Star (`★`) in Gradient Studio (`css/`, `js/gradient-randomizer.js`)**:
  - Changed the favorite star (`★` / `.pp-star.fav` and `:hover`) color from black/inherited foreground to golden amber (`#F59E0B` in Light mode, `#FBBF24` in Dark mode) with a soft golden glow.

## [36.67.69] - 2026-11-06

![36.67.69](https://raw.githubusercontent.com/iamqazolp/vscode-gradient-themes/main/media/screenshots/changelog-36.67.69.jpg)

## [2.0.1] - 2026-11-06

### Changed & Fixed
- **Unified Pure White (`#FFFFFF`) Base Canvas in Light Mode (`themes/prism-rainbow-light-color-theme.json`, `css/rainbow-gradient-light.css`)**:
  - Replaced tinted yellow/green/grey base surfaces with a uniform pure white (`#FFFFFF`) base canvas across the Workbench, Editor, Title Bar, Tabs, Activity Bar, Sidebars, Terminal Panel, and Status Bar so translucent 4-color gradients blend cleanly without color muddiness.
- **Cross-Platform & Windows Workbench Patching (`extension.js`)**:
  - Added `locateAllWorkbenchHtmls()` to patch and verify **all** matching workbench HTML entrypoints (`workbench.html` + `workbench.esm.html` across `electron-sandbox` and `electron-browser`) on Windows, macOS, and Linux.
  - Added dynamic cross-platform `file:///` path resolution for bundled `media/Comfortaa.ttf` in `buildInjectionPayload()`.

## [2.0.0] - 2026-11-06

### Added
- **Interactive Status Bar `Gradient Studio` Popover (`Alt + Shift + P` / `Studio ▴`)**:
  - Soft frosted-glass studio window styled with **Comfortaa** typography, a custom 4-color gradient scrollbar, and a fixed-height 2-column palette browser across `All`, `Favs`, `Prism`, `Pastel`, `Pure`, and `Custom` tabs.
  - Added ability to pin favorites (`★`) and remove any palette (`×`).
- **Live Gradient Intensity Slider (`40%` – `180%`)**:
  - Continuous slider, `60%`/`100%`/`150%` quick presets, and `Alt + Shift + Up / Down` shortcuts that scale gradient mesh opacity in place without resetting the active colors.
- **4-Mode `Breathing Aurora` Engine (`Alt + Shift + B` & Status Bar `Breathe` Pill)**:
  - Combinable **`Full Wave`** (rotating angles & corner focal points), **`Pulse`** (heartbeat intensity breathing), **`Shimmer`** (continuous 4-stop rotation), and **`Auto-Morph`** (smooth RGB cross-fading across palettes) with a continuous **`Speed` (`25%` – `250%`)** slider.
  - Pausing `Breathe` freezes and preserves the exact live colors on screen instead of snapping back to the original palette.
- **`Pick your own color` 4-Stop Live Color Sculptor**:
  - Full-bleed rounded color pills with `0ms` live workbench preview, procedural **`Harmony`** generator, and custom palette saving.
- **Redesigned Status Bar Controls & Extension Logo**:
  - Updated extension icon (`media/icon.svg`, `media/icon.png`) and circular Studio badge (`Studio ▴`), dedicated Status Bar `Breathe` toggle pill, animated cycle-arrows button (`↻`), and a continuous live 4-color sneak-peek bar.

## [1.2.2] - 2026-11-06

### Added
- **Universal 4-Color Gradient Text Selection Everywhere (`css/` & `js/gradient-randomizer.js`)**:
  - Extended the 4-color gradient text selection (`--g-selection`) beyond the Integrated Terminal to cover **all Code Editors, Diff Views, Peek Editors, Notebook Cells, Output & Debug Consoles** (`.monaco-editor .selected-text` and `.selectionHighlight`), as well as a live 60fps DOM selection overlay (`#prism-dom-selection-layer`) for **AI Chat panels, Markdown, Hover Documentation popups, and Settings UI**.
  - Syncs dynamically with all 30 curated Status Bar (`🎲`) randomizer palettes and respects **Theme Native (Overlay Off)** mode.

## [1.2.1] - 2026-11-06

### Fixed
- **Crash-Proof Workbench Patching Without External Extensions (`extension.js`)**:
  - Fixed an unhandled configuration error when `be5invis.vscode-custom-css` is not installed (`vscode_custom_css.imports` is now safely gated behind an extension check and wrapped in `safeConfigUpdate`), ensuring `workbench.html` is always patched first on startup and after VSCode app updates.
  - Updated `workbench.html` injection placement to right before `</html>` so it never conflicts with VSCode's `<head>` dynamic CSS module loader.
  - Added a multi-window reload status bar indicator (`✨ Reload for Gradient & 🎲`) whenever a VSCode update resets `workbench.html` and the extension auto-restores the patch on startup.
- **Self-Healing Status Bar `🎲` Mood Roller (`js/gradient-randomizer.js`)**:
  - Replaced the one-shot startup mount timer with a continuous self-healing heartbeat (`ensureMountedAndSynced`) that automatically re-mounts the `🎲` Status Bar pill and re-applies the active gradient palette if VSCode ever rebuilds the Status Bar DOM or resets workbench styles.

## [1.2.0] - 2026-11-05

### Added
- **Built-In Zero-Dependency Gradient Engine (`extension.js`)**:
  - Automatically injects the 4-Color Gradient Mesh and Status Bar `🎲` Randomizer directly into `workbench.html` on install and keeps it updated across versions—no external extensions or manual configuration required.
- **Live Status Bar `🎲` Gradient Randomizer (30 Curated Palettes)**:
  - Left-click `🎲` in the Status Bar (or press `Alt + Shift + G`) to roll a fresh translucent 4-color gradient across the Workbench, Title Bar, Tabs, Sticky Scroll, and Integrated Terminal in `0ms` without reloading VSCode.
  - Includes **30 curated palettes** across 3 families (**12 Multi-Color Prism & Horizon**, **10 Atmospheric Pastels**, and **8 Pure Single-Hue Tonal Ombré** presets) with an 8-item recent-history filter and procedural HSL harmony generator.
  - Right-click or `Shift + Click` `🎲` (or press `Alt + Shift + 0`) to cycle between **Prism Classic** and **Theme Native (Overlay Off)** in `0ms`.
  - `Cmd/Ctrl + Click` `🎲` to toggle automatic gradient randomization (`• Auto`) on VSCode startup.
- **GitHub Links & 1-Click Diagnostic Issue Reporter (`gradientThemes.openGitHub`, `gradientThemes.reportIssue`)**:
  - Pre-fills GitHub bug reports and feature requests with extension version, IDE name/version, OS architecture, active VSCode color theme, and overlay status.
  - Added live VSCode Marketplace, Downloads, GitHub Repo, Report Issue, and License badges + direct `raw.githubusercontent.com` screenshot URLs to `README.md`.
- **Privacy-First Telemetry with Automatic Author Exclusion & Marketplace Inspector (`gradientThemes.showTelemetryStats`, `gradientThemes.telemetry`)**:
  - Uses VSCode's native `vscode.env.createTelemetryLogger` (respecting `telemetry.telemetryLevel` and `gradientThemes.telemetry`) while automatically detecting and excluding the author's development machine (`iamqazolp` / Extension Development Host) so zero author events are ever recorded.
  - Added **Gradient Themes: Show Extension Telemetry & Marketplace Stats** to query the live VSCode Marketplace Gallery API and break down real **In-App Installs (`install`)** vs **Direct VSIX Mirror/Scanner Downloads (`downloadCount`)** vs **Extension Updates (`updateCount`)**.
- **Standardized Color CLI (`add_color.py` & `COLOR_GUIDE.md`)**:
  - Generates Light + Dark theme pairs from a single hex color (`python3 add_color.py theme --name "Pure Cyan" --color "#06B6D4"`) with WCAG AAA contrast validation.
  - Injects 4-color palettes into the live Status Bar randomizer (`python3 add_color.py randomizer --name "Cyber Mint" --stops "#06B6D4,#10B981,#3B82F6,#8B5CF6"`).
- **Automated Release & Open VSX Workflow (`.github/workflows/release.yml`)**:
  - Pushing a `v*.*.*` tag automatically verifies JS & Python syntax, packages the `.vsix`, publishes a GitHub Release with the `.vsix` attached, and publishes to VSCode Marketplace (`VSCE_PAT`) and Open VSX (`OVSX_PAT`).

### Fixed
- Preserved native theme background colors under the translucent `rgba(...)` gradient overlay so the mesh blends with any selected VSCode theme instead of overwriting it.
- Fixed active Editor Tab pill, Panel `[Terminal]` tab pill, Terminal right-hand tabs sidebar, Scrollbar Overview Ruler `<canvas>`, Minimap `<canvas>`, `Text Editor` breadcrumb button, and frosted-glass Sticky Scroll header.
- Fixed terminal text selection contrast (`#RRGGBB00` transparent base + `.xterm-rows span.xterm-decoration-top` transparency) so selecting text in the terminal shows the smooth gradient across both characters and whitespace.

## [1.0.0] - 2026-11-04

### Added
- Initial release with **12 Core Gradient Themes** (*Prism Rainbow*, *Pure Blue*, *Matcha*, *Warm Sunset*, *Purple Mist*, and *Pink Blossom* in Light & Dark editions).
