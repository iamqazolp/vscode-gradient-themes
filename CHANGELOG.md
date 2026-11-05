# Changelog

All notable changes to **Gemini Prism & Antarctic Frost Gradient Themes** will be documented in this file.

## [1.1.0] - 2026-11-05

### Added
- **Live `7%–22%` Gradient Randomizer (`🎲` in Status Bar)**:
  - Left-click `🎲` in the Status Bar (or press `Alt + Shift + G`) to roll a fresh `7%–22%` translucent 4-color gradient across the entire Workbench, Title Bar, Tabs, Sticky Scroll, and Integrated Terminal in 0ms without reloading VS Code.
  - Combines 8 curated 4-color palettes (*Gemini Classic*, *Antarctic Borealis*, *Sakura Horizon*, *Matcha Yuzu*, *Cosmic Lavender*, *Sunset Lagoon*, *Nordic Fjord*, *Peach Sorbet*) with a procedural HSL harmony generator (`Prism #Hue°`).
  - Right-click or `Shift + Click` `🎲` (or press `Alt + Shift + 0`) to reset to the classic Gemini 4-Color Star rainbow.
  - `Cmd/Ctrl + Click` `🎲` to toggle automatic gradient randomization on VS Code startup.
- **1-Click Command Palette Setup (`extension.js`)**:
  - `Gemini Prism: Enable 4-Color Rainbow Gradient & Live Randomizer` automatically configures `vscode_custom_css.imports` and transparent `xterm.js` terminal settings.
  - `Gemini Prism: Disable 4-Color Rainbow Gradient Overlay` cleanly removes the CSS/JS overlay imports.
  - `Gemini Prism: Roll Random Single-Color Glacial Theme` switches between the 12 included themes.
  - `Gemini Prism: Open Interactive Theme & Gradient Preview` opens the interactive preview dashboard inside VS Code.

### Fixed
- Preserved native theme background colors (`var(--vscode-*-background)`) under the `7%–22%` translucent Gemini `rgba(...)` gradient overlay so the rainbow effect combines with any selected VS Code theme instead of overwriting it.
- Fixed active Editor Tab pill, Panel `[Terminal]` tab pill, Terminal right-hand tabs sidebar, Scrollbar Overview Ruler `<canvas>`, Minimap `<canvas>`, `Text Editor` breadcrumb button, and frosted-glass Sticky Scroll header.
- Fixed terminal text selection contrast (`#RRGGBB00` transparent base + `.xterm-rows span.xterm-decoration-top` transparency) so selecting text in the terminal shows the smooth gradient across both characters and whitespace.

## [1.0.0] - 2026-11-04

### Added
- Initial release with **10 Pure Single-Color Glacial Gradient Themes** (*Pure Blue*, *Pure Green*, *Pure Pink*, *Pure Yellow*, and *Pure Purple* in Light & Dark variants) + **2 Gemini Prism 4-Color Star Themes** (Light & Dark), tuned to the `7%–22%` Antarctic frost range for eye-friendly code reviewing.
