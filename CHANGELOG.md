# Changelog

All notable changes to **VS Code Gradient Themes** will be documented in this file.

## [1.1.0] - 2026-11-05

### Added
- **Live Status Bar `🎲` Gradient Randomizer (30 Curated Palettes)**:
  - Left-click `🎲` in the Status Bar (or press `Alt + Shift + G`) to roll a fresh translucent 4-color gradient across the Workbench, Title Bar, Tabs, Sticky Scroll, and Integrated Terminal in `0ms` without reloading VS Code.
  - Includes **30 curated palettes** across 3 families (**12 Multi-Color Prism & Horizon**, **10 Atmospheric Pastels**, and **8 Pure Single-Hue Tonal Ombré** presets) with an 8-item recent-history filter and procedural HSL harmony generator.
  - Right-click or `Shift + Click` `🎲` (or press `Alt + Shift + 0`) to cycle between **Prism Classic** and **Theme Native (Overlay Off)** in `0ms`.
  - `Cmd/Ctrl + Click` `🎲` to toggle automatic gradient randomization (`• Auto`) on VS Code startup.
- **GitHub Links & 1-Click Diagnostic Issue Reporter (`gradientThemes.openGitHub`, `gradientThemes.reportIssue`)**:
  - Pre-fills GitHub bug reports and feature requests with extension version, IDE name/version, OS architecture, active VS Code color theme, and Custom CSS overlay status.
  - Added live VS Code Marketplace, Downloads, GitHub Repo, Report Issue, and License badges + direct `raw.githubusercontent.com` screenshot URLs to `README.md`.
- **Privacy-First Telemetry with Automatic Author Exclusion & Marketplace Inspector (`gradientThemes.showTelemetryStats`, `gradientThemes.telemetry`)**:
  - Uses VS Code's native `vscode.env.createTelemetryLogger` (respecting `telemetry.telemetryLevel` and `gradientThemes.telemetry`) while automatically detecting and excluding the author's development machine (`iamqazolp` / Extension Development Host) so zero author events are ever recorded.
  - Added **Gradient Themes: Show Extension Telemetry & Marketplace Stats** to query the live VS Code Marketplace Gallery API and break down real **In-App Installs (`install`)** vs **Direct VSIX Mirror/Scanner Downloads (`downloadCount`)** vs **Extension Updates (`updateCount`)**.
- **Standardized Color CLI (`add_color.py` & `COLOR_GUIDE.md`)**:
  - Generates Light + Dark theme pairs from a single hex color (`python3 add_color.py theme --name "Pure Cyan" --color "#06B6D4"`) with WCAG AAA contrast validation.
  - Injects 4-color palettes into the live Status Bar randomizer (`python3 add_color.py randomizer --name "Cyber Mint" --stops "#06B6D4,#10B981,#3B82F6,#8B5CF6"`).
- **Automated Release & Open VSX Workflow (`.github/workflows/release.yml`)**:
  - Pushing a `v*.*.*` tag automatically verifies JS & Python syntax, packages the `.vsix`, publishes a GitHub Release with the `.vsix` attached, and publishes to VS Code Marketplace (`VSCE_PAT`) and Open VSX (`OVSX_PAT`).

### Fixed
- Preserved native theme background colors under the translucent `rgba(...)` gradient overlay so the mesh blends with any selected VS Code theme instead of overwriting it.
- Fixed active Editor Tab pill, Panel `[Terminal]` tab pill, Terminal right-hand tabs sidebar, Scrollbar Overview Ruler `<canvas>`, Minimap `<canvas>`, `Text Editor` breadcrumb button, and frosted-glass Sticky Scroll header.
- Fixed terminal text selection contrast (`#RRGGBB00` transparent base + `.xterm-rows span.xterm-decoration-top` transparency) so selecting text in the terminal shows the smooth gradient across both characters and whitespace.

## [1.0.0] - 2026-11-04

### Added
- Initial release with **12 Core Gradient Themes** (*Prism Rainbow*, *Pure Blue*, *Matcha*, *Warm Sunset*, *Purple Mist*, and *Pink Blossom* in Light & Dark editions).
