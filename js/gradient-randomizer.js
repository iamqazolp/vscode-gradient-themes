/**
 * ============================================================================
 * 🎲 VS CODE GRADIENT THEMES — LIVE GRADIENT RANDOMIZER ENGINE (7%–22%)
 * ============================================================================
 * Injected via `vscode_custom_css.imports` alongside `rainbow-gradient-light.css`.
 *
 * Controls (Zero Window Reload Required!):
 *   • Left-Click `🎲 Prism` in Status Bar (or press `Alt + Shift + G`):
 *       Rolls a new 7%–22% translucent 4-color gradient + angles live!
 *   • Right-Click or Shift-Click `🎲 Prism` (or press `Alt + Shift + 0`):
 *       Resets immediately to the Classic 4-Color Rainbow.
 *   • Cmd+Click (Mac) / Ctrl+Click (Win/Linux) `🎲 Prism`:
 *       Toggles "Randomize Gradient on Startup" on/off.
 * ============================================================================
 */
(function () {
  "use strict";

  const STORAGE_KEY_STATE = "gradientThemes.randomizer.state.v1";
  const STORAGE_KEY_AUTO = "gradientThemes.randomizer.autoOnStartup.v1";
  const STORAGE_KEY_FAVS = "gradientThemes.randomizer.favorites.v1";
  const STORAGE_KEY_FAV_ONLY = "gradientThemes.randomizer.favOnly.v1";
  const STORAGE_KEY_CUSTOM = "gradientThemes.randomizer.customPalettes.v1";
  const STORAGE_KEY_REMOVED = "gradientThemes.randomizer.removedPalettes.v1";
  const STORAGE_KEY_INTENSITY = "gradientThemes.randomizer.intensity.v1";
  const STORAGE_KEY_BREATHE = "gradientThemes.randomizer.breathe.v1";
  const STORAGE_KEY_BREATHE_CFG = "gradientThemes.randomizer.breatheCfg.v1";
  const STORAGE_KEY_SCOPE = "gradientThemes.randomizer.scope.v1";
  const STORAGE_KEY_COMPONENTS = "gradientThemes.randomizer.components.v1";
  const STORAGE_KEY_SEAMLESS = "gradientThemes.randomizer.seamless.v1";
  const STORAGE_KEY_SYNTAX_MODE = "gradientThemes.randomizer.syntaxMode.v1";
  const STORAGE_KEY_HISTORY = "gradientThemes.randomizer.history.v1";

  const COMPONENT_DEFS = [
    { key: "editor", label: "Editor", tip: "Code Editor Canvas & Current Line" },
    { key: "explorer", label: "Explorer", tip: "Activity Bar & Left Explorer Sidebar" },
    { key: "chat", label: "Chat", tip: "Right AI Chat / Secondary Sidebar" },
    { key: "terminal", label: "Terminal", tip: "Bottom Terminal / Output Panel" },
    { key: "bars", label: "Bars", tip: "Title Bar, Editor Tabs, Breadcrumbs & Status Bar" },
    { key: "selection", label: "Select", tip: "Text Selection Highlight (Editor, Terminal & DOM)" },
    { key: "syntax", label: "Syntax", tip: "Gradient Code Syntax Coloring & Highlight Boxes" },
  ];

  // Curated 4-stop palettes (RGB tuples; alpha is strictly clamped to 7%–22%)
  const CURATED_PALETTES = [
    {
      name: "Prism Classic",
      isDefault: true,
      stops: [
        [234, 67, 53],   // #EA4335 Red
        [251, 188, 4],   // #FBBC04 Yellow
        [52, 168, 83],   // #34A853 Green
        [66, 133, 244],  // #4285F4 Blue
      ],
    },
    {
      name: "Antarctic Borealis",
      stops: [
        [0, 180, 216],   // Glacier Cyan
        [72, 202, 228],  // Ice Sky
        [6, 214, 160],   // Aurora Mint
        [114, 9, 183],   // Polar Violet
      ],
    },
    {
      name: "Sakura Horizon",
      stops: [
        [255, 117, 143], // Sakura Pink
        [255, 179, 198], // Rose Quartz
        [199, 125, 255], // Orchid Mist
        [76, 201, 240],  // Sky Frost
      ],
    },
    {
      name: "Matcha Yuzu",
      stops: [
        [82, 183, 136],  // Matcha Leaf
        [149, 213, 178], // Dew Bamboo
        [250, 204, 21],  // Yuzu Citrus
        [56, 189, 248],  // Spring Stream
      ],
    },
    {
      name: "Cosmic Lavender",
      stops: [
        [139, 92, 246],  // Amethyst
        [236, 72, 153],  // Nebula Rose
        [59, 130, 246],  // Starlight Blue
        [45, 212, 191],  // Comet Teal
      ],
    },
    {
      name: "Sunset Lagoon",
      stops: [
        [251, 113, 133], // Coral
        [251, 191, 36],  // Amber Sun
        [45, 212, 191],  // Tropical Lagoon
        [96, 165, 250],  // Ocean Breeze
      ],
    },
    {
      name: "Nordic Fjord",
      stops: [
        [56, 189, 248],  // Fjord Blue
        [129, 140, 248], // Indigo Ice
        [52, 211, 153],  // Pine Frost
        [192, 132, 252], // Twilight Lilac
      ],
    },
    {
      name: "Peach Sorbet",
      stops: [
        [251, 146, 60],  // Nectarine
        [244, 114, 182], // Guava Pink
        [250, 204, 21],  // Mango Glow
        [167, 139, 250], // Violet Cream
      ],
    },
    {
      name: "Kyoto Autumn",
      stops: [
        [244, 63, 94], // #F43F5E
        [249, 115, 22], // #F97316
        [234, 179, 8], // #EAB308
        [139, 92, 246], // #8B5CF6
      ],
    },
    {
      name: "Bioluminescent Reef",
      stops: [
        [6, 182, 212], // #06B6D4
        [16, 185, 129], // #10B981
        [59, 130, 246], // #3B82F6
        [99, 102, 241], // #6366F1
      ],
    },
    {
      name: "Rose Champagne",
      stops: [
        [251, 113, 133], // #FB7185
        [251, 191, 36], // #FBBF24
        [244, 114, 182], // #F472B6
        [192, 132, 252], // #C084FC
      ],
    },
    {
      name: "Alpine Glacier",
      stops: [
        [56, 189, 248], // #38BDF8
        [129, 140, 248], // #818CF8
        [45, 212, 191], // #2DD4BF
        [232, 121, 249], // #E879F9
      ],
    },
    {
      name: "Cafe Matcha",
      stops: [
        [52, 211, 153], // #34D399
        [163, 230, 53], // #A3E635
        [251, 191, 36], // #FBBF24
        [45, 212, 191], // #2DD4BF
      ],
    },
    {
      name: "Cyberpunk Pastel",
      stops: [
        [244, 63, 94], // #F43F5E
        [139, 92, 246], // #8B5CF6
        [6, 182, 212], // #06B6D4
        [250, 204, 21], // #FACC15
      ],
    },
    {
      name: "Desert Mirage",
      stops: [
        [251, 146, 60], // #FB923C
        [244, 63, 94], // #F43F5E
        [250, 204, 21], // #FACC15
        [56, 189, 248], // #38BDF8
      ],
    },
    {
      name: "Midnight Orchid",
      stops: [
        [168, 85, 247], // #A855F7
        [236, 72, 153], // #EC4899
        [99, 102, 241], // #6366F1
        [20, 184, 166], // #14B8A6
      ],
    },
    {
      name: "Tokyo Neon Mist",
      stops: [
        [244, 63, 94], // #F43F5E
        [217, 70, 239], // #D946EF
        [99, 102, 241], // #6366F1
        [6, 182, 212], // #06B6D4
      ],
    },
    {
      name: "Amalfi Citrus",
      stops: [
        [250, 204, 21], // #FACC15
        [251, 146, 60], // #FB923C
        [52, 211, 153], // #34D399
        [56, 189, 248], // #38BDF8
      ],
    },
    {
      name: "Lavender Milk Tea",
      stops: [
        [192, 132, 252], // #C084FC
        [244, 114, 182], // #F472B6
        [251, 191, 36], // #FBBF24
        [129, 140, 248], // #818CF8
      ],
    },
    {
      name: "Polaris Emerald",
      stops: [
        [16, 185, 129], // #10B981
        [6, 182, 212], // #06B6D4
        [59, 130, 246], // #3B82F6
        [168, 85, 247], // #A855F7
      ],
    },
    {
      name: "Velvet Sangria",
      stops: [
        [225, 29, 72], // #E11D48
        [219, 39, 119], // #DB2777
        [147, 51, 234], // #9333EA
        [245, 158, 11], // #F59E0B
      ],
    },
    {
      name: "Arctic Sunbeam",
      stops: [
        [56, 189, 248], // #38BDF8
        [45, 212, 191], // #2DD4BF
        [253, 224, 71], // #FDE047
        [129, 140, 248], // #818CF8
      ],
    },
    {
      name: "Pure Lagoon Cyan",
      stops: [
        [8, 145, 178], // #0891B2
        [6, 182, 212], // #06B6D4
        [34, 211, 238], // #22D3EE
        [103, 232, 249], // #67E8F9
      ],
    },
    {
      name: "Pure Apricot Peach",
      stops: [
        [234, 88, 12], // #EA580C
        [249, 115, 22], // #F97316
        [251, 146, 60], // #FB923C
        [253, 186, 116], // #FDBA74
      ],
    },
    {
      name: "Pure Starlight Indigo",
      stops: [
        [79, 70, 229], // #4F46E5
        [99, 102, 241], // #6366F1
        [129, 140, 248], // #818CF8
        [165, 180, 252], // #A5B4FC
      ],
    },
    {
      name: "Pure Camellia Rose",
      stops: [
        [225, 29, 72], // #E11D48
        [244, 63, 94], // #F43F5E
        [251, 113, 133], // #FB7185
        [253, 164, 175], // #FDA4AF
      ],
    },
    {
      name: "Pure Glacier Blue",
      stops: [
        [37, 99, 235], // #2563EB
        [59, 130, 246], // #3B82F6
        [96, 165, 250], // #60A5FA
        [147, 197, 253], // #93C5FD
      ],
    },
    {
      name: "Pure Ceremonial Matcha",
      stops: [
        [5, 150, 105], // #059669
        [16, 185, 129], // #10B981
        [52, 211, 153], // #34D399
        [110, 231, 183], // #6EE7B7
      ],
    },
    {
      name: "Pure Sunlit Honey",
      stops: [
        [217, 119, 6], // #D97706
        [245, 158, 11], // #F59E0B
        [251, 191, 36], // #FBBF24
        [253, 224, 71], // #FDE047
      ],
    },
    {
      name: "Pure Wisteria Violet",
      stops: [
        [124, 58, 237], // #7C3AED
        [139, 92, 246], // #8B5CF6
        [167, 139, 250], // #A78BFA
        [196, 181, 253], // #C4B5FD
      ],
    },
  ];

  function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360;
    s /= 100;
    l /= 100;
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [
      Math.round(255 * f(0)),
      Math.round(255 * f(8)),
      Math.round(255 * f(4)),
    ];
  }

  function rgbToHex([r, g, b]) {
    return (
      "#" +
      [r, g, b]
        .map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase()
    );
  }

  function hexToRgb(hex) {
    const clean = String(hex || "#3B82F6").replace("#", "").trim();
    if (clean.length !== 6) return [59, 130, 246];
    return [
      parseInt(clean.slice(0, 2), 16) || 0,
      parseInt(clean.slice(2, 4), 16) || 0,
      parseInt(clean.slice(4, 6), 16) || 0,
    ];
  }

  function rgba([r, g, b], alpha) {
    const clamped = Math.max(0.02, Math.min(0.65, alpha));
    return `rgba(${r}, ${g}, ${b}, ${clamped.toFixed(2)})`;
  }

  function getIntensity() {
    try {
      const raw = parseFloat(localStorage.getItem(STORAGE_KEY_INTENSITY) || "1");
      if (!Number.isNaN(raw)) {
        return Math.max(0.4, Math.min(1.8, raw));
      }
    } catch (_) {}
    return 1.0;
  }

  function setIntensity(val) {
    const clamped = Math.max(0.4, Math.min(1.8, Math.round(val * 20) / 20));
    try {
      localStorage.setItem(STORAGE_KEY_INTENSITY, String(clamped));
    } catch (_) {}
    const wb = document.querySelector(".monaco-workbench");
    const saved = getSavedPalette();
    if (wb && !(saved && saved.isNativeOff)) {
      const stops =
        lastLiveStops && lastLiveStops.length === 4
          ? lastLiveStops
          : saved && saved.stops && saved.stops.length === 4
          ? saved.stops
          : CURATED_PALETTES[0].stops;
      const angles =
        lastLiveAngles ||
        (saved && saved.angles) || {
          base: 135,
          bar: 90,
          side: 165,
          panel: 105,
        };
      writeGradientCssVars(wb, stops, angles, clamped);
    }
    refreshPopoverHeaderAndIntensity();
  }

  function getFavorites() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_FAVS);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function toggleFavorite(name) {
    const favs = getFavorites();
    const idx = favs.indexOf(name);
    if (idx >= 0) {
      favs.splice(idx, 1);
    } else {
      favs.push(name);
    }
    try {
      localStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify(favs));
    } catch (_) {}
    renderPaletteGrid();
    refreshPopoverHeaderAndIntensity();
  }

  function isFavOnlyEnabled() {
    return localStorage.getItem(STORAGE_KEY_FAV_ONLY) === "true";
  }

  function toggleFavOnly() {
    const next = !isFavOnlyEnabled();
    try {
      localStorage.setItem(STORAGE_KEY_FAV_ONLY, String(next));
    } catch (_) {}
    refreshPopoverHeaderAndIntensity();
    renderPaletteGrid();
  }

  function isSeamlessEnabled() {
    return localStorage.getItem(STORAGE_KEY_SEAMLESS) !== "false";
  }

  function syncSeamlessClass(wb) {
    if (!wb) return;
    wb.classList.toggle("prism-split-panels", !isSeamlessEnabled());
  }

  function toggleSeamlessMode() {
    const next = !isSeamlessEnabled();
    try {
      localStorage.setItem(STORAGE_KEY_SEAMLESS, String(next));
    } catch (_) {}
    const wb = document.querySelector(".monaco-workbench");
    syncSeamlessClass(wb);
    if (!next && wb && lastLiveStops && lastLiveStops.length === 4) {
      writeGradientCssVars(
        wb,
        lastLiveStops,
        lastLiveAngles || { base: 135, bar: 90, side: 165, panel: 105 },
        getIntensity()
      );
    }
    refreshPopoverHeaderAndIntensity();
    renderPaletteGrid();
  }

  function rgbToHsl([r, g, b]) {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const d = max - min;
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    if (d !== 0) {
      s = d / (1 - Math.abs(2 * l - 1));
      switch (max) {
        case rn:
          h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
          break;
        case gn:
          h = ((bn - rn) / d + 2) * 60;
          break;
        case bn:
          h = ((rn - gn) / d + 4) * 60;
          break;
      }
    }
    return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
  }

  function parseCssColorToRgb(str) {
    if (!str) return null;
    const s = String(str).trim();
    if (s.startsWith("#")) {
      const hex = s.slice(1);
      if (hex.length === 3 || hex.length === 4) {
        return [
          parseInt(hex[0] + hex[0], 16) || 0,
          parseInt(hex[1] + hex[1], 16) || 0,
          parseInt(hex[2] + hex[2], 16) || 0,
        ];
      }
      if (hex.length >= 6) {
        return [
          parseInt(hex.slice(0, 2), 16) || 0,
          parseInt(hex.slice(2, 4), 16) || 0,
          parseInt(hex.slice(4, 6), 16) || 0,
        ];
      }
    }
    const m = s.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (m) {
      return [Number(m[1]) || 0, Number(m[2]) || 0, Number(m[3]) || 0];
    }
    return null;
  }

  function toReadableSyntaxRgb(rgb, isDark) {
    const [h, s, l] = rgbToHsl(rgb);
    if (isDark) {
      return hslToRgb(h, Math.max(86, Math.min(98, s + 14)), Math.max(74, Math.min(86, l + 8)));
    }
    return hslToRgb(h, Math.max(82, Math.min(96, s + 14)), Math.max(22, Math.min(35, l - 8)));
  }

  function getSyntaxMode() {
    return localStorage.getItem(STORAGE_KEY_SYNTAX_MODE) === "palette" ? "palette" : "semantic";
  }

  function syncSyntaxModeClass(wb) {
    if (!wb) return;
    wb.classList.toggle("prism-syntax-palette", getSyntaxMode() === "palette");
  }

  function toggleSyntaxMode() {
    const next = getSyntaxMode() === "palette" ? "semantic" : "palette";
    try {
      localStorage.setItem(STORAGE_KEY_SYNTAX_MODE, next);
    } catch (_) {}
    const wb = document.querySelector(".monaco-workbench");
    syncSyntaxModeClass(wb);
    refreshPopoverHeaderAndIntensity();
    renderPaletteGrid();
  }

  let lastSyntaxSheetSig = "";
  let lastSyntaxThemeDark = null;
  let lastSyntaxStops = null;
  let lastSyntaxRgbs = null;
  let lastSyntaxAngles = null;
  let lastSyntaxK = 1.0;
  let monacoColorsObserver = null;
  let observedMonacoStyleEl = null;
  let cachedMonacoTokenSig = "";
  let cachedMonacoTokenMap = null;
  let cachedPreparedTokens = null;
  let lastSyntaxHexSig = "";
  let cachedComponentsConfig = null;
  let lastAppliedWbElement = null;
  const lastAppliedVars = new Map();
  let lastSwatchGrad = "";
  let lastBackdropMesh = "";

  // Non-inherited local CSS custom properties (`inherits: false` in Blink PropertyRegistry)
  // Updating these on individual containers/elements triggers kLocalStyleChange (1 node)
  // with ZERO descendant DOM tree walks (InheritedEqual() === true) and near-zero Oilpan GC!
  const LOCAL_BREATHING_PROPS = [
    "--prism-local-bg",
    "--prism-local-bar",
    "--prism-local-border",
    "--prism-local-border-v",
    "--prism-local-frame",
  ];
  const localStyledElements = new Set();
  let lastLocalVars = new WeakMap();
  let cachedBreathingTargets = null;
  let cachedBreathingTargetsWb = null;
  let cachedBreathingTargetsTs = 0;
  let breatheTickCount = 0;
  let lastBreathingBarByComp = null;
  let hoveredBreathingTargets = [];
  let hoveredBreathingComp = "";

  function registerNonInheritedCssProps() {
    if (typeof CSS === "undefined" || typeof CSS.registerProperty !== "function") return;
    // Note: only --prism-local-frame is left unregistered so pseudo-elements (::before / ::after
    // on .monaco-sash.vertical and sticky containers) can inherit it from their originating element.
    const nonInherited = [
      "--prism-local-bg",
      "--prism-local-bar",
      "--prism-local-border",
      "--prism-local-border-v",
    ];
    for (let i = 0; i < nonInherited.length; i++) {
      try {
        CSS.registerProperty({
          name: nonInherited[i],
          syntax: "*",
          inherits: false,
        });
      } catch (_) {
        // Already registered in this window
      }
    }
  }
  registerNonInheritedCssProps();

  function setLocalProp(el, prop, val) {
    if (!el) return;
    let map = lastLocalVars.get(el);
    if (!map) {
      map = new Map();
      lastLocalVars.set(el, map);
    }
    if (map.get(prop) === val) return;
    map.set(prop, val);
    localStyledElements.add(el);
    el.style.setProperty(prop, val);
  }

  function setLocalPropsOnList(list, propA, valA, propB, valB) {
    if (!list || !list.length) return;
    for (let i = 0; i < list.length; i++) {
      const el = list[i];
      if (!el || !el.isConnected) continue;
      if (propA && valA) setLocalProp(el, propA, valA);
      if (propB && valB) setLocalProp(el, propB, valB);
    }
  }

  let hoverListenerAttached = false;

  const HOVER_TARGET_SELECTOR =
    ".monaco-list-row, .terminal-tabs-entry, .monaco-action-bar .action-item, .tabs-container > .tab, .statusbar-item, .getting-started-step";

  function assignHoveredBreathingTarget(hit) {
    if (!hit) {
      hoveredBreathingTargets = [];
      hoveredBreathingComp = "";
      return;
    }
    let comp = "shared";
    if (hit.closest(".part.panel")) {
      comp = "terminal";
    } else if (hit.closest(".part.sidebar, .part.activitybar")) {
      comp = "explorer";
    } else if (hit.closest(".part.auxiliarybar, .part.sessionspart")) {
      comp = "chat";
    } else if (
      hit.closest(".part.statusbar, .part.titlebar, .editor-group-container > .title")
    ) {
      comp = "bars";
    } else if (hit.closest(".part.editor")) {
      comp = "editor";
    }
    const nextTargets = [hit];
    const inner = hit.querySelector(
      ":scope > .active-item-indicator, :scope > .tab-fill, :scope > a.statusbar-item-label"
    );
    if (inner) nextTargets.push(inner);
    hoveredBreathingTargets = nextTargets;
    hoveredBreathingComp = comp;
    if (lastBreathingBarByComp) {
      const barCss = lastBreathingBarByComp[comp] || lastBreathingBarByComp.shared;
      if (barCss) {
        setLocalPropsOnList(nextTargets, "--prism-local-bar", barCss);
      }
    }
  }

  // Zero-Subtree-Walk Hover Tracker: attached ONLY while Breathing Aurora is active.
  // Sets non-inherited --prism-local-bar directly on the single hovered row/tab/action element
  // (kLocalStyleChange on 1-2 nodes, 0 subtree walk).
  function onBreathingMouseOver(e) {
    if (!lastBreathingBarByComp || !breatheTimer) return;
    const t = e.target;
    if (!t || typeof t.closest !== "function") return;
    if (
      hoveredBreathingTargets.length > 0 &&
      hoveredBreathingTargets[0] &&
      hoveredBreathingTargets[0].contains(t)
    ) {
      return;
    }
    const hit = t.closest(HOVER_TARGET_SELECTOR);
    if (!hit) {
      hoveredBreathingTargets = [];
      hoveredBreathingComp = "";
      return;
    }
    if (hoveredBreathingTargets[0] === hit) return;
    assignHoveredBreathingTarget(hit);
  }

  function attachBreathingHoverListener() {
    if (hoverListenerAttached) return;
    hoverListenerAttached = true;
    document.addEventListener("mouseover", onBreathingMouseOver, { passive: true });
  }

  function detachBreathingHoverListener() {
    if (!hoverListenerAttached) return;
    hoverListenerAttached = false;
    document.removeEventListener("mouseover", onBreathingMouseOver);
  }

  function clearLocalBreathingProps() {
    detachBreathingHoverListener();
    lastBreathingBarByComp = null;
    hoveredBreathingTargets = [];
    hoveredBreathingComp = "";
    const legacyLiveStyle = document.getElementById("prism-live-vars");
    if (legacyLiveStyle) legacyLiveStyle.remove();
    if (localStyledElements.size === 0) return;
    localStyledElements.forEach((el) => {
      if (!el) return;
      for (let i = 0; i < LOCAL_BREATHING_PROPS.length; i++) {
        el.style.removeProperty(LOCAL_BREATHING_PROPS[i]);
      }
    });
    localStyledElements.clear();
    lastLocalVars = new WeakMap();
  }

  function ensureAuroraBackdrop(wb) {
    if (!wb) return null;
    let el = document.getElementById("prism-aurora-backdrop");
    if (!el) {
      el = document.createElement("div");
      el.id = "prism-aurora-backdrop";
      wb.insertBefore(el, wb.firstChild);
      lastBackdropMesh = "";
    } else if (el.parentElement !== wb) {
      wb.insertBefore(el, wb.firstChild);
    }
    return el;
  }

  function setBackdropMesh(wb, meshCss) {
    const el = ensureAuroraBackdrop(wb);
    if (!el) return;
    if (lastBackdropMesh === meshCss) return;
    lastBackdropMesh = meshCss;
    el.style.backgroundImage = meshCss;
  }

  function setWbProp(wb, prop, val) {
    if (!wb) return;
    if (lastAppliedWbElement !== wb) {
      lastAppliedWbElement = wb;
      lastAppliedVars.clear();
    }
    if (lastAppliedVars.get(prop) === val) return;
    lastAppliedVars.set(prop, val);
    wb.style.setProperty(prop, val);
  }

  function removeWbProp(wb, prop) {
    if (!wb) return;
    if (lastAppliedWbElement !== wb) {
      lastAppliedWbElement = wb;
      lastAppliedVars.clear();
    }
    if (!lastAppliedVars.has(prop) && !wb.style.getPropertyValue(prop)) return;
    lastAppliedVars.delete(prop);
    wb.style.removeProperty(prop);
  }

  function isPopoverOpen() {
    const pop = document.getElementById("prism-palette-popover");
    return Boolean(pop && pop.isConnected && pop.style.display !== "none");
  }

  function isWindowActive() {
    if (document.hidden) return false;
    if (typeof document.hasFocus === "function" && !document.hasFocus()) return false;
    return true;
  }

  function extractMonacoTokenColors(isDark) {
    const tokenStyle = document.querySelector("style.vscode-tokens-styles");
    const fastStyle =
      tokenStyle && (tokenStyle.textContent || "").includes(".mtk")
        ? tokenStyle
        : null;
    if (
      fastStyle &&
      fastStyle === observedMonacoStyleEl &&
      cachedMonacoTokenMap &&
      cachedPreparedTokens &&
      cachedMonacoTokenSig === `${isDark ? "d" : "l"}|${fastStyle.textContent?.length || 0}`
    ) {
      return { tokenMap: cachedMonacoTokenMap, prepared: cachedPreparedTokens, sig: cachedMonacoTokenSig };
    }
    const tokenMap = new Map();
    const styles = fastStyle
      ? [fastStyle]
      : document.querySelectorAll("style:not(#prism-syntax-style)");
    const mtkRegex = /\.mtk(\d+)\s*\{\s*color:\s*(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))/gi;
    for (let i = 0; i < styles.length; i++) {
      const st = styles[i];
      const txt = st.textContent || "";
      if (!txt.includes(".mtk")) continue;
      if (observedMonacoStyleEl !== st) {
        observedMonacoStyleEl = st;
        if (monacoColorsObserver) {
          monacoColorsObserver.disconnect();
        }
        monacoColorsObserver = new MutationObserver(() => {
          cachedMonacoTokenSig = "";
          cachedMonacoTokenMap = null;
          cachedPreparedTokens = null;
          const wb = document.querySelector(".monaco-workbench");
          if (wb) ensureSyntaxStyleSheet(wb, true);
        });
        monacoColorsObserver.observe(st, { childList: true, characterData: true, subtree: true });
      }
      let match;
      mtkRegex.lastIndex = 0;
      while ((match = mtkRegex.exec(txt)) !== null) {
        const idx = parseInt(match[1], 10);
        const rgb = parseCssColorToRgb(match[2]);
        if (idx > 0 && rgb) {
          tokenMap.set(idx, rgb);
        }
      }
    }

    if (tokenMap.size < 4) {
      const defaults = isDark
        ? [
            [1, [230, 237, 245]],
            [3, [99, 122, 145]],
            [4, [122, 191, 160]],
            [5, [229, 115, 104]],
            [6, [224, 159, 103]],
            [7, [222, 193, 110]],
            [8, [107, 196, 141]],
            [9, [158, 178, 199]],
            [10, [120, 173, 232]],
            [11, [148, 187, 227]],
            [12, [176, 148, 224]],
          ]
        : [
            [1, [30, 41, 59]],
            [3, [100, 116, 139]],
            [4, [13, 148, 136]],
            [5, [225, 29, 72]],
            [6, [217, 119, 6]],
            [7, [180, 83, 9]],
            [8, [5, 150, 105]],
            [9, [71, 85, 105]],
            [10, [37, 99, 235]],
            [11, [2, 132, 199]],
            [12, [124, 58, 237]],
          ];
      defaults.forEach(([idx, rgb]) => {
        if (!tokenMap.has(idx)) tokenMap.set(idx, rgb);
      });
    }

    const prepared = [];
    const sigParts = [];
    tokenMap.forEach((rgb, n) => {
      sigParts.push(`${n}:${rgb[0]},${rgb[1]},${rgb[2]}`);
      if (n <= 1) return; // Keep .mtk1 (plain variables, identifiers, brackets & punctuation) 100% solid native text
      const [h, s, l] = rgbToHsl(rgb);
      if (s < 28) return; // Keep muted comments & slate operators 100% solid native CoreText-antialiased text

      // Deterministic hue-quadrant slot assignment: immune to .mtk* insertion order changes
      // when scrolling raw Markdown with lazily tokenized fenced code blocks or links
      const slot1 = h < 22 || h >= 315 ? 0 : h < 95 ? 1 : h < 190 ? 2 : 3;
      const slot2 = (slot1 + 1) % 4;

      const rgbA = hslToRgb(
        h - 18,
        Math.max(86, Math.min(98, s + 16)),
        isDark ? Math.min(86, Math.max(75, l + 12)) : Math.max(20, Math.min(32, l - 10))
      );
      const rgbB = hslToRgb(
        h + 24,
        Math.max(86, Math.min(98, s + 16)),
        isDark ? Math.max(71, Math.min(83, l + 6)) : Math.min(36, Math.max(24, l - 5))
      );
      prepared.push({ n, rgbA, rgbB, slot1, slot2 });
    });

    const tokenSig = `${isDark ? "d" : "l"}|${fastStyle ? fastStyle.textContent?.length || 0 : sigParts.join(";")}`;
    cachedMonacoTokenSig = tokenSig;
    cachedMonacoTokenMap = tokenMap;
    cachedPreparedTokens = prepared;
    return { tokenMap, prepared, sig: tokenSig };
  }

  function ensureSyntaxStyleSheet(
    wb,
    force = false,
    cStops = null,
    kVal = null,
    cSynRgbs = null,
    cAngles = null
  ) {
    if (!wb) return;
    const isDark = wb.classList.contains("vs-dark") || wb.classList.contains("hc-black");
    const themeFlipped = lastSyntaxThemeDark !== null && lastSyntaxThemeDark !== isDark;

    const stops =
      cStops && cStops.length === 4
        ? cStops
        : lastSyntaxStops && lastSyntaxStops.length === 4
        ? lastSyntaxStops
        : lastLiveStops && lastLiveStops.length === 4
        ? lastLiveStops
        : CURATED_PALETTES[0].stops;
    const effectiveK = typeof kVal === "number" ? kVal : lastSyntaxK;
    const angles =
      cAngles ||
      lastSyntaxAngles ||
      lastLiveAngles || { base: 135, bar: 90, side: 165, panel: 105 };

    const synRgbs =
      cSynRgbs && cSynRgbs.length === 4
        ? cSynRgbs
        : !cStops && !themeFlipped && lastSyntaxRgbs && lastSyntaxRgbs.length === 4
        ? lastSyntaxRgbs
        : stops.map((s) => toReadableSyntaxRgb(s, isDark));

    lastSyntaxStops = stops.map((s) => [...s]);
    lastSyntaxRgbs = synRgbs.map((s) => [...s]);
    lastSyntaxAngles = { ...angles };
    lastSyntaxK = effectiveK;

    const synHexes = synRgbs.map(rgbToHex);
    const mixRatio = Math.max(0.24, Math.min(0.76, 0.44 * effectiveK));
    const mixRatioB = Math.min(0.82, mixRatio + 0.08);
    const mixKey = Math.round(mixRatio * 100);
    const barAngle = Math.round(angles.bar || 90);

    let styleEl = document.getElementById("prism-syntax-style");
    const { prepared, sig: tokenSig } = extractMonacoTokenColors(isDark);
    const sig = `${isDark ? "d" : "l"}|${synHexes.join(",")}|${mixKey}|${barAngle}|${tokenSig}`;
    if (!force && styleEl && styleEl.isConnected && sig === lastSyntaxSheetSig) {
      lastSyntaxThemeDark = isDark;
      return;
    }
    lastSyntaxSheetSig = sig;
    lastSyntaxThemeDark = isDark;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "prism-syntax-style";
      (document.documentElement || document.head || wb).appendChild(styleEl);
    }

    const rules = [];
    const scopeSel =
      ":is(.monaco-editor .view-line, .monaco-editor .sticky-line-content, .monaco-tokenized-source)";
    const strokeRule = isDark
      ? "-webkit-text-stroke: 0.2px rgba(255, 255, 255, 0.14);"
      : "-webkit-text-stroke: 0.15px rgba(0, 0, 0, 0.10);";

    for (let i = 0; i < prepared.length; i++) {
      const tok = prepared[i];
      // Bake static hex colors directly into #prism-syntax-style (zero var() / color-mix() on span.mtk*
      // so Blink caches 1 CSSLinearGradientValue per rule and skips all 2,000 token spans during style recalc)
      const semHexA = rgbToHex(lerpRgb(tok.rgbA, synRgbs[tok.slot1], mixRatio));
      const semHexB = rgbToHex(lerpRgb(tok.rgbB, synRgbs[tok.slot2], mixRatioB));
      const palHexA = synHexes[tok.slot1];
      const palHexB = synHexes[tok.slot2];

      rules.push(
        `.monaco-workbench:not(.prism-no-syntax):not(.prism-syntax-palette) ${scopeSel} span.mtk${tok.n} {` +
          `background-image: linear-gradient(95deg, ${semHexA} 0%, ${semHexB} 100%) !important;` +
          `-webkit-background-clip: text !important; background-clip: text !important;` +
          `-webkit-text-fill-color: transparent !important; ${strokeRule}` +
        `}`
      );
      rules.push(
        `.monaco-workbench:not(.prism-no-syntax).prism-syntax-palette ${scopeSel} span.mtk${tok.n} {` +
          `background-image: linear-gradient(95deg, ${palHexA} 0%, ${palHexB} 100%) !important;` +
          `-webkit-background-clip: text !important; background-clip: text !important;` +
          `-webkit-text-fill-color: transparent !important; ${strokeRule}` +
        `}`
      );
    }

    const [h1, h2, h3, h4] = synHexes;
    const synBarCss = buildBarCss(stops, angles, effectiveK * 0.72);
    const synStrongCss = buildSelectionCss(stops, angles, effectiveK * 0.85);
    const synFrameCss = buildFrameCss(stops);
    rules.push(
      `.monaco-workbench:not(.prism-no-syntax) .rendered-markdown pre code :is(.hljs-keyword, .hljs-selector-tag, .hljs-meta, .hljs-doctag) { background-image: linear-gradient(95deg, ${h1} 0%, ${h2} 100%) !important; }`,
      `.monaco-workbench:not(.prism-no-syntax) .rendered-markdown pre code :is(.hljs-string, .hljs-regexp, .hljs-addition) { background-image: linear-gradient(95deg, ${h3} 0%, ${h4} 100%) !important; }`,
      `.monaco-workbench:not(.prism-no-syntax) .rendered-markdown pre code :is(.hljs-title, .hljs-function, .hljs-section, .hljs-built_in) { background-image: linear-gradient(95deg, ${h4} 0%, ${h1} 100%) !important; }`,
      `.monaco-workbench:not(.prism-no-syntax) .rendered-markdown pre code :is(.hljs-type, .hljs-class, .hljs-attr, .hljs-variable, .hljs-template-variable, .hljs-params) { background-image: linear-gradient(95deg, ${h2} 0%, ${h3} 100%) !important; }`,
      `.monaco-workbench:not(.prism-no-syntax) .rendered-markdown pre code :is(.hljs-number, .hljs-literal, .hljs-symbol, .hljs-bullet) { background-image: linear-gradient(95deg, ${h1} 0%, ${h4} 100%) !important; }`,
      `.monaco-workbench:not(.prism-no-syntax) .monaco-editor .view-overlays :is(.wordHighlight, .wordHighlightText, .rangeHighlight, .symbolHighlight, .findMatch) { background-image: ${synBarCss} !important; }`,
      `.monaco-workbench:not(.prism-no-syntax) .monaco-editor .view-overlays :is(.wordHighlightStrong, .currentFindMatch) { background-image: ${synStrongCss} !important; }`,
      `.monaco-workbench:not(.prism-no-syntax) .monaco-editor .view-overlays .bracket-match { background-image: ${synBarCss}, ${synFrameCss} !important; }`,
      `.monaco-workbench:not(.prism-no-syntax) :is(.rendered-markdown, .monaco-hover .hover-contents) :not(pre) > code { background-image: ${synBarCss}, linear-gradient(0deg, var(--g-canvas-bg, var(--vscode-editor-background, #ffffff)), var(--g-canvas-bg, var(--vscode-editor-background, #ffffff))), ${synFrameCss} !important; }`
    );

    styleEl.textContent = rules.join("\n");
  }

  function disableSyntaxCssVars(wb) {
    if (!wb) return;
    wb.classList.add("prism-no-syntax");
    setWbProp(wb, "--g-syntax-bar", "none");
    setWbProp(wb, "--g-syntax-strong", "none");
    setWbProp(wb, "--g-syntax-frame", "none");
  }

  function applySyntaxCssVars(
    wb,
    compStops,
    compAngles,
    effectiveK,
    fromBreatheTick = false,
    cSynRgbs = null
  ) {
    if (!wb) return;
    wb.classList.remove("prism-no-syntax");
    syncSyntaxModeClass(wb);
    const isDark = wb.classList.contains("vs-dark") || wb.classList.contains("hc-black");
    const synRgbs =
      cSynRgbs && cSynRgbs.length === 4
        ? cSynRgbs
        : compStops.map((s) => toReadableSyntaxRgb(s, isDark));
    const [h1, h2, h3, h4] = synRgbs.map(rgbToHex);
    const mixPct = `${Math.round(Math.max(24, Math.min(76, 44 * effectiveK)))}%`;
    const hexSig = `${h1}|${h2}|${h3}|${h4}|${mixPct}`;
    if (hexSig !== lastSyntaxHexSig) {
      lastSyntaxHexSig = hexSig;
      setWbProp(wb, "--g-syntax-bar", buildBarCss(compStops, compAngles, effectiveK * 0.72));
      setWbProp(wb, "--g-syntax-strong", buildSelectionCss(compStops, compAngles, effectiveK * 0.85));
      setWbProp(wb, "--g-syntax-frame", buildFrameCss(compStops));
    }
    if (!fromBreatheTick) {
      ensureSyntaxStyleSheet(wb, false, compStops, effectiveK, synRgbs, compAngles);
    }
  }

  function getComponentsConfig() {
    if (cachedComponentsConfig) {
      return cachedComponentsConfig;
    }
    const out = {};
    let legacyScope = null;
    try {
      const rawScope = localStorage.getItem(STORAGE_KEY_SCOPE);
      if (rawScope) legacyScope = JSON.parse(rawScope);
    } catch (_) {}

    let parsed = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_COMPONENTS);
      if (raw) parsed = JSON.parse(raw);
    } catch (_) {}

    COMPONENT_DEFS.forEach((def) => {
      const k = def.key;
      const entry = parsed && typeof parsed[k] === "object" && parsed[k] ? parsed[k] : null;
      let enabled = true;
      if (entry && typeof entry.enabled === "boolean") {
        enabled = entry.enabled;
      } else if (legacyScope) {
        if (k === "explorer" || k === "chat") {
          enabled = legacyScope.sidebar !== false;
        } else if (k in legacyScope) {
          enabled = legacyScope[k] !== false;
        }
      }
      let customPalette = null;
      if (
        entry &&
        entry.customPalette &&
        Array.isArray(entry.customPalette.stops) &&
        entry.customPalette.stops.length === 4
      ) {
        customPalette = {
          name: entry.customPalette.name || "Custom",
          stops: entry.customPalette.stops,
          angles: entry.customPalette.angles || {
            base: 135,
            bar: 90,
            side: 165,
            panel: 105,
          },
          phaseOffset: Number(entry.customPalette.phaseOffset) || 0,
        };
      }
      out[k] = { enabled, customPalette };
    });
    cachedComponentsConfig = out;
    return out;
  }

  function saveComponentsConfig(nextMap) {
    cachedComponentsConfig = nextMap;
    try {
      localStorage.setItem(STORAGE_KEY_COMPONENTS, JSON.stringify(nextMap));
    } catch (_) {}
  }

  function applySingleComponentCssVars(wb, compKey) {
    if (!wb || !compKey || compKey === "all") return;
    const compMap = getComponentsConfig();
    const cfg = compMap[compKey] || { enabled: true, customPalette: null };
    const k = getIntensity();
    const breatheOn = isBreathingEnabled();
    const breatheCfg = getBreatheConfig();
    const shimmerOn = breatheOn && breatheCfg.shimmer;
    const waveOn = breatheOn && breatheCfg.wave;

    const hasCustom =
      cfg.customPalette &&
      Array.isArray(cfg.customPalette.stops) &&
      cfg.customPalette.stops.length === 4;

    if (compKey !== "selection" && compKey !== "syntax") {
      wb.classList.toggle(`prism-custom-${compKey}`, !cfg.enabled || Boolean(hasCustom));
    }

    if (!cfg.enabled) {
      if (compKey === "selection") {
        wb.classList.add("prism-no-selection");
        setWbProp(wb, "--g-selection", "var(--vscode-editor-selectionBackground)");
        setWbProp(
          wb,
          "--g-sel-tint",
          "var(--vscode-selection-background, var(--vscode-editor-selectionBackground))"
        );
        clearDomSelectionOverlay();
      } else if (compKey === "syntax") {
        disableSyntaxCssVars(wb);
      } else {
        setWbProp(wb, `--g-${compKey}-mesh`, "none");
        setWbProp(wb, `--g-${compKey}-bar`, "none");
        setWbProp(
          wb,
          `--g-${compKey}-frame`,
          "linear-gradient(90deg, rgba(128, 128, 128, 0.22), rgba(128, 128, 128, 0.22))"
        );
        if (compKey === "explorer" || compKey === "chat") {
          setWbProp(wb, `--g-${compKey}-side`, "none");
        } else if (compKey === "terminal") {
          setWbProp(wb, "--g-terminal-panel", "none");
        }
      }
      return;
    }

    const globalPal = getActiveTargetPalette("all");
    const fallbackStops =
      lastLiveStops && lastLiveStops.length === 4
        ? lastLiveStops
        : globalPal.stops || CURATED_PALETTES[0].stops;
    const fallbackAngles = lastLiveAngles ||
      globalPal.angles || { base: 135, bar: 90, side: 165, panel: 105 };

    let compStops = fallbackStops;
    let compAngles = fallbackAngles;

    if (hasCustom) {
      const phaseDelta = Math.max(0, breathePhase - (Number(cfg.customPalette.phaseOffset) || 0));
      compStops = shimmerOn
        ? getShiftedStops(cfg.customPalette.stops, phaseDelta * 0.16)
        : cfg.customPalette.stops;
      const baseA = cfg.customPalette.angles || {
        base: 135,
        bar: 90,
        side: 165,
        panel: 105,
      };
      compAngles = waveOn
        ? {
            base: Math.round(baseA.base + Math.sin(breathePhase * 0.65) * 32),
            bar: Math.round(baseA.bar + Math.sin(breathePhase * 0.8) * 24),
            side: Math.round(baseA.side + Math.sin(breathePhase * 0.55) * 28),
            panel: Math.round(baseA.panel + Math.sin(breathePhase * 0.7) * 28),
          }
        : baseA;
    }

    const effectiveK =
      breatheOn && breatheCfg.pulse
        ? Math.max(0.25, Math.min(2.2, k * (1 + Math.sin(breathePhase * 0.78) * 0.24)))
        : k;

    if (compKey === "selection") {
      wb.classList.remove("prism-no-selection");
      setWbProp(wb, "--g-selection", buildSelectionCss(compStops, compAngles, effectiveK));
      setWbProp(wb, "--g-sel-tint", rgba(compStops[0], 0.28 * effectiveK));
    } else if (compKey === "syntax") {
      const isDark = wb.classList.contains("vs-dark") || wb.classList.contains("hc-black");
      let synRgbs = null;
      if (hasCustom) {
        const phaseDelta = Math.max(0, breathePhase - (Number(cfg.customPalette.phaseOffset) || 0));
        const customBaseSyn = cfg.customPalette.stops.map((s) => toReadableSyntaxRgb(s, isDark));
        synRgbs = shimmerOn
          ? getShiftedStops(customBaseSyn, phaseDelta * 0.16)
          : customBaseSyn;
      } else if (breatheOn && lastSyntaxRgbs && lastSyntaxRgbs.length === 4) {
        synRgbs = lastSyntaxRgbs;
      }
      applySyntaxCssVars(wb, compStops, compAngles, effectiveK, false, synRgbs);
    } else if (!hasCustom) {
      setWbProp(wb, `--g-${compKey}-mesh`, "var(--g-default-mesh)");
      setWbProp(wb, `--g-${compKey}-bar`, "var(--g-bar)");
      setWbProp(wb, `--g-${compKey}-frame`, "var(--g-default-frame)");
      if (compKey === "explorer" || compKey === "chat") {
        setWbProp(wb, `--g-${compKey}-side`, "var(--g-side)");
      } else if (compKey === "terminal") {
        setWbProp(wb, "--g-terminal-panel", "var(--g-default-terminal-panel)");
      }
    } else {
      setWbProp(wb, `--g-${compKey}-mesh`, buildMeshCss(compStops, compAngles, effectiveK));
      setWbProp(wb, `--g-${compKey}-bar`, buildBarCss(compStops, compAngles, effectiveK));
      setWbProp(wb, `--g-${compKey}-frame`, buildFrameCss(compStops));
      if (compKey === "explorer" || compKey === "chat") {
        setWbProp(wb, `--g-${compKey}-side`, buildSideCss(compStops, compAngles, effectiveK));
      } else if (compKey === "terminal") {
        setWbProp(
          wb,
          "--g-terminal-panel",
          buildTerminalPanelCss(compStops, compAngles, effectiveK)
        );
      }
    }
  }

  function reapplyCurrentWorkbench(onlyCompKey) {
    const wb = document.querySelector(".monaco-workbench");
    if (onlyCompKey && onlyCompKey !== "all" && wb) {
      applySingleComponentCssVars(wb, onlyCompKey);
      const targetPal = getActiveTargetPalette(activeComponent);
      if (targetPal && targetPal.stops) {
        syncBuilderPickers(targetPal.stops);
      }
      renderPaletteGrid();
      refreshPopoverHeaderAndIntensity();
      return;
    }
    const saved = getSavedPalette();
    applyPaletteToWorkbench(saved || null, { skipHistory: true });
  }

  function toggleComponentEnabled(compKey) {
    const map = getComponentsConfig();
    if (!map[compKey]) return;
    map[compKey].enabled = !map[compKey].enabled;
    saveComponentsConfig(map);
    reapplyCurrentWorkbench(compKey);
  }

  function setComponentPalette(compKey, palette) {
    const map = getComponentsConfig();
    if (!map[compKey]) return;
    map[compKey].enabled = true;
    map[compKey].customPalette = palette
      ? {
          name: palette.name || "Custom",
          stops: palette.stops.map((s) => [...s]),
          angles: palette.angles || { base: 135, bar: 90, side: 165, panel: 105 },
          phaseOffset: breathePhase,
        }
      : null;
    saveComponentsConfig(map);
    reapplyCurrentWorkbench(compKey);
  }

  function resetAllComponentCustomPalettes() {
    const map = getComponentsConfig();
    COMPONENT_DEFS.forEach((def) => {
      if (map[def.key]) {
        map[def.key].customPalette = null;
      }
    });
    saveComponentsConfig(map);
  }

  function getActiveTargetPalette(compKey) {
    const saved = getSavedPalette();
    const globalPalette =
      saved && !saved.isNativeOff && saved.stops && saved.stops.length === 4
        ? saved
        : CURATED_PALETTES[0];
    if (!compKey || compKey === "all") {
      return globalPalette;
    }
    const map = getComponentsConfig();
    const entry = map[compKey];
    if (entry && entry.customPalette && entry.customPalette.stops) {
      return entry.customPalette;
    }
    return globalPalette;
  }

  function parseFourHexStops(str) {
    if (!str) return null;
    const text = String(str).trim();
    // Support Coolors URLs like coolors.co/ea4335-fbbc04-34a853-4285f4 or standard hex lists
    const matches = text.match(/(?:#|\b)([0-9a-fA-F]{6})\b/g);
    if (!matches || matches.length < 4) return null;
    return matches.slice(0, 4).map((m) => hexToRgb(m.replace("#", "")));
  }

  function getCustomPalettes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CUSTOM);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function getRemovedPalettes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_REMOVED);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function saveCustomPalette(name, stops) {
    const customs = getCustomPalettes().filter((p) => p.name !== name);
    const entry = {
      name: name || `Custom #${customs.length + 1}`,
      stops,
      isCustom: true,
    };
    customs.unshift(entry);
    const removed = getRemovedPalettes().filter((n) => n !== entry.name);
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(customs));
      localStorage.setItem(STORAGE_KEY_REMOVED, JSON.stringify(removed));
    } catch (_) {}
    if (activeComponent && activeComponent !== "all") {
      setComponentPalette(activeComponent, entry);
    } else {
      resetAllComponentCustomPalettes();
      applyPaletteToWorkbench(entry);
    }
    renderPaletteGrid();
  }

  function removePalette(name) {
    const customs = getCustomPalettes().filter((p) => p.name !== name);
    const removed = getRemovedPalettes();
    if (CURATED_PALETTES.some((p) => p.name === name) && !removed.includes(name)) {
      removed.push(name);
    }
    const favs = getFavorites().filter((n) => n !== name);
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(customs));
      localStorage.setItem(STORAGE_KEY_REMOVED, JSON.stringify(removed));
      localStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify(favs));
    } catch (_) {}
    renderPaletteGrid();
  }

  function restoreRemovedPalettes() {
    try {
      localStorage.removeItem(STORAGE_KEY_REMOVED);
    } catch (_) {}
    renderPaletteGrid();
  }

  function getAllPalettes() {
    const removed = getRemovedPalettes();
    const tagged = CURATED_PALETTES.map((p, idx) => ({
      ...p,
      category: idx < 12 ? "prism" : idx < 22 ? "pastel" : "pure",
    })).filter((p) => !removed.includes(p.name));
    const customs = getCustomPalettes().map((p) => ({
      ...p,
      category: "custom",
      isCustom: true,
    }));
    return [...tagged, ...customs];
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateProceduralPalette() {
    const baseHue = randInt(0, 359);
    // Harmonious step (analogous-triadic between 42° and 95°)
    const step = randInt(42, 95);
    const stops = [0, 1, 2, 3].map((i) =>
      hslToRgb(baseHue + i * step, randInt(72, 90), randInt(54, 64))
    );
    return {
      name: `Prism #${baseHue}°`,
      stops,
      angles: {
        base: randInt(115, 160),
        bar: randInt(82, 102),
        side: randInt(150, 185),
        panel: randInt(95, 130),
      },
    };
  }

  const recentNames = [];
  const rollHistory = [];
  let activeCategory = "all";
  let activeComponent = "all";
  let breatheTimer = null;
  let breathePhase = 0;
  let morphSourceStops = null;
  let morphSourceAngles = null;
  let morphTargetPalette = null;
  let morphProgress = 0;
  let lastLiveStops = null;
  let lastLiveAngles = null;

  function pushRollHistory(entry) {
    if (!entry) return;
    const prev = rollHistory[rollHistory.length - 1];
    if (prev && prev.name === entry.name && Boolean(prev.isNativeOff) === Boolean(entry.isNativeOff)) {
      if (!entry.stops || (prev.stops && JSON.stringify(prev.stops) === JSON.stringify(entry.stops))) {
        return;
      }
    }
    rollHistory.push(JSON.parse(JSON.stringify(entry)));
    if (rollHistory.length > 30) {
      rollHistory.shift();
    }
  }

  function undoPreviousRoll() {
    if (rollHistory.length === 0) return;
    const prev = rollHistory.pop();
    if (!prev || prev.isDefault) {
      applyPaletteToWorkbench(null, { skipHistory: true });
    } else {
      applyPaletteToWorkbench(prev, { skipHistory: true });
    }
  }

  function rotateActiveStops(reverse = false) {
    const targetPalette = getActiveTargetPalette(activeComponent);
    const currentStops = targetPalette.stops.map((s) => [...s]);
    const rotated = reverse
      ? [currentStops[3], currentStops[2], currentStops[1], currentStops[0]]
      : [currentStops[1], currentStops[2], currentStops[3], currentStops[0]];
    const currentName = targetPalette.name || "Prism Classic";
    const nextEntry = {
      name: currentName.endsWith(" ⇄") ? currentName : `${currentName} ⇄`,
      stops: rotated,
      angles: targetPalette.angles || { base: 135, bar: 90, side: 165, panel: 105 },
    };
    if (activeComponent && activeComponent !== "all") {
      setComponentPalette(activeComponent, nextEntry);
    } else {
      applyPaletteToWorkbench(nextEntry);
    }
  }

  function isBreathingEnabled() {
    return localStorage.getItem(STORAGE_KEY_BREATHE) === "true";
  }

  function getBreatheConfig() {
    const defaults = {
      wave: true,
      pulse: true,
      shimmer: true,
      morph: false,
      speedPct: 100,
    };
    try {
      const raw = localStorage.getItem(STORAGE_KEY_BREATHE_CFG);
      if (!raw) return defaults;
      const parsed = JSON.parse(raw);
      let speedPct = Number(parsed.speedPct);
      if (!Number.isFinite(speedPct) || speedPct < 20 || speedPct > 300) {
        speedPct =
          parsed.speed === "slow" ? 45 : parsed.speed === "fast" ? 220 : 100;
      }
      return {
        wave: parsed.wave !== false,
        pulse: parsed.pulse !== false,
        shimmer: parsed.shimmer !== false,
        morph: Boolean(parsed.morph),
        speedPct: Math.round(speedPct),
      };
    } catch (_) {
      return defaults;
    }
  }

  function saveBreatheConfig(nextCfg) {
    const merged = Object.assign(getBreatheConfig(), nextCfg);
    try {
      localStorage.setItem(STORAGE_KEY_BREATHE_CFG, JSON.stringify(merged));
    } catch (_) {}
    refreshPopoverHeaderAndIntensity();
    return merged;
  }

  function lerpRgb(a, b, t) {
    return [
      Math.round(a[0] + (b[0] - a[0]) * t),
      Math.round(a[1] + (b[1] - a[1]) * t),
      Math.round(a[2] + (b[2] - a[2]) * t),
    ];
  }

  function getShiftedStops(stops, shiftPhase) {
    const out = [];
    for (let i = 0; i < 4; i++) {
      const pos = (((i + shiftPhase) % 4) + 4) % 4;
      const idxA = Math.floor(pos);
      const idxB = (idxA + 1) % 4;
      const frac = pos - idxA;
      const smooth = frac * frac * (3 - 2 * frac);
      out.push(lerpRgb(stops[idxA], stops[idxB], smooth));
    }
    return out;
  }

  function buildMeshCss(cStops, cAngles, kVal, coords) {
    const [s1, s2, s3, s4] = cStops;
    const r1 = rgba(s1, 0.18 * kVal);
    const r2 = rgba(s2, 0.18 * kVal);
    const r3 = rgba(s3, 0.18 * kVal);
    const r4 = rgba(s4, 0.22 * kVal);
    const p1x = coords ? coords.p1x : 15;
    const p1y = coords ? coords.p1y : 15;
    const p2x = coords ? coords.p2x : 85;
    const p2y = coords ? coords.p2y : 25;
    const p3x = coords ? coords.p3x : 25;
    const p3y = coords ? coords.p3y : 85;
    const p4x = coords ? coords.p4x : 85;
    const p4y = coords ? coords.p4y : 85;
    const base = `linear-gradient(${Math.round(cAngles.base)}deg, ${rgba(s1, 0.14 * kVal)} 0%, ${rgba(
      s2,
      0.11 * kVal
    )} 33%, ${rgba(s3, 0.11 * kVal)} 66%, ${rgba(s4, 0.16 * kVal)} 100%)`;
    return [
      `radial-gradient(ellipse 75% 55% at ${p1x}% ${p1y}%, ${r1} 0%, transparent 70%)`,
      `radial-gradient(ellipse 65% 75% at ${p2x}% ${p2y}%, ${r2} 0%, transparent 72%)`,
      `radial-gradient(ellipse 75% 60% at ${p3x}% ${p3y}%, ${r3} 0%, transparent 72%)`,
      `radial-gradient(ellipse 70% 70% at ${p4x}% ${p4y}%, ${r4} 0%, transparent 75%)`,
      base,
    ].join(", ");
  }

  function buildBarCss(cStops, cAngles, kVal) {
    const [s1, s2, s3, s4] = cStops;
    return `linear-gradient(${Math.round(cAngles.bar)}deg, ${rgba(s1, 0.20 * kVal)} 0%, ${rgba(
      s2,
      0.15 * kVal
    )} 33%, ${rgba(s3, 0.15 * kVal)} 66%, ${rgba(s4, 0.22 * kVal)} 100%)`;
  }

  function buildSideCss(cStops, cAngles, kVal) {
    const [s1, s2, s3, s4] = cStops;
    return `linear-gradient(${Math.round(cAngles.side)}deg, ${rgba(s1, 0.16 * kVal)} 0%, ${rgba(
      s2,
      0.13 * kVal
    )} 33%, ${rgba(s3, 0.13 * kVal)} 66%, ${rgba(s4, 0.16 * kVal)} 100%)`;
  }

  function buildTerminalPanelCss(cStops, cAngles, kVal, coords) {
    const [s1, s2, s3, s4] = cStops;
    const r1 = rgba(s1, 0.18 * kVal);
    const r2 = rgba(s2, 0.18 * kVal);
    const r3 = rgba(s3, 0.18 * kVal);
    const t1x = coords ? coords.p1x : 12;
    const t1y = coords ? coords.p1y : 20;
    const t2x = coords ? coords.p2x : 88;
    const t2y = coords ? coords.p4y : 80;
    const t3x = coords ? Math.round(50 + (coords.p3x - 25)) : 50;
    const t3y = coords ? Math.round(50 + (coords.p2y - 25)) : 50;
    const panel = `linear-gradient(${Math.round(cAngles.panel)}deg, ${rgba(s2, 0.07 * kVal)} 0%, ${rgba(
      s3,
      0.13 * kVal
    )} 50%, ${rgba(s4, 0.18 * kVal)} 100%)`;
    return [
      `radial-gradient(ellipse 65% 85% at ${t1x}% ${t1y}%, ${r1} 0%, transparent 70%)`,
      `radial-gradient(ellipse 60% 80% at ${t2x}% ${t2y}%, ${r2} 0%, transparent 70%)`,
      `radial-gradient(ellipse 55% 65% at ${t3x}% ${t3y}%, ${r3} 0%, transparent 75%)`,
      panel,
    ].join(", ");
  }

  function buildSelectionCss(cStops, cAngles, kVal) {
    const [s1, s2, s3, s4] = cStops;
    return `linear-gradient(${Math.round(cAngles.bar)}deg, ${rgba(s1, 0.30 * kVal)} 0%, ${rgba(
      s2,
      0.25 * kVal
    )} 33%, ${rgba(s3, 0.25 * kVal)} 66%, ${rgba(s4, 0.32 * kVal)} 100%)`;
  }

  function buildFrameCss(cStops) {
    const [s1, s2, s3, s4] = cStops;
    return `linear-gradient(90deg, ${rgba(s1, 0.72)} 0%, ${rgba(
      s2,
      0.66
    )} 33%, ${rgba(s3, 0.66)} 66%, ${rgba(s4, 0.76)} 100%)`;
  }

  function writeGradientCssVars(wb, stops, angles, k, coords, opts) {
    const fromBreatheTick = Boolean(opts && opts.fromBreatheTick);
    clearLocalBreathingProps();
    const [c1, c2, c3, c4] = stops;
    const defaultMeshCss = buildMeshCss(stops, angles, k, coords);
    const defaultTerminalPanelCss = buildTerminalPanelCss(stops, angles, k, coords);
    setBackdropMesh(wb, defaultMeshCss);
    setWbProp(wb, "--g-default-mesh", defaultMeshCss);
    setWbProp(wb, "--g-default-terminal-panel", defaultTerminalPanelCss);

    setWbProp(wb, "--g-r1", rgba(c1, 0.18 * k));
    setWbProp(wb, "--g-r2", rgba(c2, 0.18 * k));
    setWbProp(wb, "--g-r3", rgba(c3, 0.18 * k));
    setWbProp(wb, "--g-r4", rgba(c4, 0.22 * k));

    setWbProp(
      wb,
      "--g-base",
      `linear-gradient(${Math.round(angles.base)}deg, ${rgba(c1, 0.14 * k)} 0%, ${rgba(
        c2,
        0.11 * k
      )} 33%, ${rgba(c3, 0.11 * k)} 66%, ${rgba(c4, 0.16 * k)} 100%)`
    );

    const sharedBarCss = buildBarCss(stops, angles, k);
    const sharedSideCss = buildSideCss(stops, angles, k);
    const sharedFrameCss = buildFrameCss(stops);

    setWbProp(wb, "--g-bar", sharedBarCss);
    setWbProp(wb, "--g-side", sharedSideCss);
    setWbProp(wb, "--g-default-frame", sharedFrameCss);

    setWbProp(
      wb,
      "--g-panel",
      `linear-gradient(${Math.round(angles.panel)}deg, ${rgba(c2, 0.07 * k)} 0%, ${rgba(
        c3,
        0.13 * k
      )} 50%, ${rgba(c4, 0.18 * k)} 100%)`
    );

    setWbProp(
      wb,
      "--g-border",
      `linear-gradient(90deg, ${rgbToHex(c1)} 0%, ${rgbToHex(
        c2
      )} 33%, ${rgbToHex(c3)} 66%, ${rgbToHex(c4)} 100%)`
    );

    setWbProp(
      wb,
      "--g-border-v",
      `linear-gradient(180deg, ${rgbToHex(c1)} 0%, ${rgbToHex(
        c2
      )} 33%, ${rgbToHex(c3)} 66%, ${rgbToHex(c4)} 100%)`
    );

    const compMap = getComponentsConfig();
    const breatheOn = isBreathingEnabled();
    const breatheCfg = getBreatheConfig();
    const shimmerOn = breatheOn && breatheCfg.shimmer;
    const waveOn = breatheOn && breatheCfg.wave;

    COMPONENT_DEFS.forEach((def) => {
      const key = def.key;
      const cfg = compMap[key] || { enabled: true, customPalette: null };
      const hasCustom =
        cfg.customPalette &&
        Array.isArray(cfg.customPalette.stops) &&
        cfg.customPalette.stops.length === 4;

      if (key !== "selection" && key !== "syntax") {
        wb.classList.toggle(`prism-custom-${key}`, !cfg.enabled || Boolean(hasCustom));
      }

      if (!cfg.enabled) {
        if (key === "selection") {
          wb.classList.add("prism-no-selection");
          setWbProp(wb, "--g-selection", "var(--vscode-editor-selectionBackground)");
          setWbProp(
            wb,
            "--g-sel-tint",
            "var(--vscode-selection-background, var(--vscode-editor-selectionBackground))"
          );
          clearDomSelectionOverlay();
        } else if (key === "syntax") {
          disableSyntaxCssVars(wb);
        } else {
          setWbProp(wb, `--g-${key}-mesh`, "none");
          setWbProp(wb, `--g-${key}-bar`, "none");
          setWbProp(
            wb,
            `--g-${key}-frame`,
            "linear-gradient(90deg, rgba(128, 128, 128, 0.22), rgba(128, 128, 128, 0.22))"
          );
          if (key === "explorer" || key === "chat") {
            setWbProp(wb, `--g-${key}-side`, "none");
          } else if (key === "terminal") {
            setWbProp(wb, "--g-terminal-panel", "none");
          }
        }
        return;
      }

      if (!hasCustom) {
        if (key === "selection") {
          wb.classList.remove("prism-no-selection");
          setWbProp(wb, "--g-selection", buildSelectionCss(stops, angles, k));
          setWbProp(wb, "--g-sel-tint", rgba(stops[0], 0.28 * k));
        } else if (key === "syntax") {
          applySyntaxCssVars(
            wb,
            stops,
            angles,
            k,
            fromBreatheTick,
            opts && opts.synRgbs ? opts.synRgbs : null
          );
        } else {
          setWbProp(wb, `--g-${key}-mesh`, "var(--g-default-mesh)");
          setWbProp(wb, `--g-${key}-bar`, "var(--g-bar)");
          setWbProp(wb, `--g-${key}-frame`, "var(--g-default-frame)");
          if (key === "explorer" || key === "chat") {
            setWbProp(wb, `--g-${key}-side`, "var(--g-side)");
          } else if (key === "terminal") {
            setWbProp(wb, "--g-terminal-panel", "var(--g-default-terminal-panel)");
          }
        }
        return;
      }

      const phaseDelta = Math.max(0, breathePhase - (Number(cfg.customPalette.phaseOffset) || 0));
      const compStops = shimmerOn
        ? getShiftedStops(cfg.customPalette.stops, phaseDelta * 0.16)
        : cfg.customPalette.stops;
      const baseA = cfg.customPalette.angles || {
        base: 135,
        bar: 90,
        side: 165,
        panel: 105,
      };
      const compAngles = waveOn
        ? {
            base: Math.round(baseA.base + Math.sin(breathePhase * 0.65) * 32),
            bar: Math.round(baseA.bar + Math.sin(breathePhase * 0.8) * 24),
            side: Math.round(baseA.side + Math.sin(breathePhase * 0.55) * 28),
            panel: Math.round(baseA.panel + Math.sin(breathePhase * 0.7) * 28),
          }
        : baseA;

      if (key === "selection") {
        wb.classList.remove("prism-no-selection");
        setWbProp(wb, "--g-selection", buildSelectionCss(compStops, compAngles, k));
        setWbProp(wb, "--g-sel-tint", rgba(compStops[0], 0.28 * k));
      } else if (key === "syntax") {
        const isDark = wb.classList.contains("vs-dark") || wb.classList.contains("hc-black");
        const customBaseSyn = cfg.customPalette.stops.map((s) => toReadableSyntaxRgb(s, isDark));
        const customSynRgbs = shimmerOn
          ? getShiftedStops(customBaseSyn, phaseDelta * 0.16)
          : customBaseSyn;
        applySyntaxCssVars(wb, compStops, compAngles, k, fromBreatheTick, customSynRgbs);
      } else {
        setWbProp(wb, `--g-${key}-mesh`, buildMeshCss(compStops, compAngles, k, coords));
        setWbProp(wb, `--g-${key}-bar`, buildBarCss(compStops, compAngles, k));
        setWbProp(wb, `--g-${key}-frame`, buildFrameCss(compStops));
        if (key === "explorer" || key === "chat") {
          setWbProp(wb, `--g-${key}-side`, buildSideCss(compStops, compAngles, k));
        } else if (key === "terminal") {
          setWbProp(
            wb,
            "--g-terminal-panel",
            buildTerminalPanelCss(compStops, compAngles, k, coords)
          );
        }
      }
    });

    setWbProp(wb, "--g-workbench-mesh", "var(--g-default-mesh)");
    syncSeamlessClass(wb);

    lastLiveStops = stops.map((s) => [...s]);
    lastLiveAngles = { ...angles };
    const liveGrad = `linear-gradient(90deg, ${rgbToHex(c1)} 0%, ${rgbToHex(
      c2
    )} 33%, ${rgbToHex(c3)} 66%, ${rgbToHex(c4)} 100%)`;
    if (liveGrad !== lastSwatchGrad) {
      lastSwatchGrad = liveGrad;
      const swatchEl = document.getElementById("prism-randomizer-swatch");
      if (swatchEl) {
        swatchEl.style.background = liveGrad;
      }
    }

    if (isPopoverOpen()) {
      const activeTargetStops =
        activeComponent && activeComponent !== "all"
          ? getActiveTargetPalette(activeComponent).stops
          : stops;
      const [tc1, tc2, tc3, tc4] = activeTargetStops;
      const targetGrad = `linear-gradient(90deg, ${rgbToHex(tc1)} 0%, ${rgbToHex(
        tc2
      )} 33%, ${rgbToHex(tc3)} 66%, ${rgbToHex(tc4)} 100%)`;
      const previewBar = document.getElementById("pp-builder-preview-bar");
      if (previewBar) {
        previewBar.style.background = targetGrad;
      }
    }
  }

  function getBreathingTargets(wb) {
    const now = performance.now();
    if (
      cachedBreathingTargets &&
      cachedBreathingTargetsWb === wb &&
      now - cachedBreathingTargetsTs < 900
    ) {
      return cachedBreathingTargets;
    }
    cachedBreathingTargetsWb = wb;
    cachedBreathingTargetsTs = now;

    const q = (sel) => Array.from(wb.querySelectorAll(sel));
    const targets = {
      // Split-Panel / Custom Component Container Elements
      editorParts: q(".part.editor"),
      explorerParts: q(".part.activitybar, .part.sidebar"),
      chatParts: q(".part.auxiliarybar, .part.sessionspart"),
      terminalParts: q(
        ".part.panel, .part.editor .editor-instance .terminal-outer-container, .chat-terminal-output-terminal"
      ),
      terminalTitleParts: q(
        ".part.panel > .title, .part.panel > .composite.title, .part.panel > .header-or-footer"
      ),
      barsParts: q(
        ".part.titlebar, .part.banner, .part.statusbar, .editor-group-container > .title > .tabs-and-actions-container"
      ),
      // Active UI Chrome Elements (~8-12 nodes total across the window)
      statusPills: q("#prism-randomizer-breathe, #prism-randomizer-chevron"),
      editorBar: q(
        ".monaco-editor .view-overlays .current-line, .monaco-editor .margin-view-overlays .current-line-margin"
      ),
      editorSticky: q(
        ".monaco-editor .sticky-widget, .notebookOverlay .notebook-sticky-scroll-container, .coverage-summary-widget, .editor-instance .terminal-sticky-scroll, .part.editor .monaco-tree-sticky-container:not(.empty), .part.editor .gettingStartedContainer :is(button.getting-started-category, .getting-started-category), .part.editor .gettingStartedContainer .getting-started-category :is(.featured, .new-badge), .monaco-editor .find-widget.visible, .monaco-editor .parameter-hints-widget.visible, .editor-widget.suggest-widget.visible, .monaco-hover:not(.hidden)"
      ),
      explorerBar: q(
        ".part.activitybar .monaco-action-bar .action-item.checked .active-item-indicator, .part.sidebar :is(.title, .composite.title, .header-or-footer) .monaco-action-bar .action-item.checked > .active-item-indicator, :is(.activitybar, .part.activitybar) .badge .badge-content, .profile-badge .profile-text-overlay"
      ),
      explorerSticky: q(
        ".part.sidebar .monaco-tree-sticky-container:not(.empty), .part.sidebar .terminal-sticky-scroll, .part.sidebar .output-view .sticky-widget, .part.sidebar .monaco-list .monaco-list-row.selected, .part.sidebar .monaco-list .monaco-list-row.focused, .monaco-tree-type-filter, .monaco-list-type-filter, .part.sidebar .monaco-list-row .monaco-inputbox"
      ),
      chatBar: q(
        ".interactive-session .chat-input-container, .interactive-item-container.interactive-request .value .rendered-markdown, .prompt-timeline-sticky-band, .interactive-session .interactive-item-container.chat-sticky-progress:not(:empty), .interactive-session .chat-editing-session .chat-editing-session-container, .interactive-session .interactive-input-part .chat-todo-list-widget-container .chat-todo-list-widget, :is(.part.auxiliarybar, .part.sessionspart) :is(.title, .composite.title, .header-or-footer) .monaco-action-bar .action-item.checked > .active-item-indicator, :is(.part.auxiliarybar, .part.sessionspart) .monaco-list .monaco-list-row.selected, :is(.part.auxiliarybar, .part.sessionspart) .monaco-list .monaco-list-row.focused"
      ),
      chatSticky: q(
        ":is(.part.auxiliarybar, .part.sessionspart) .monaco-tree-sticky-container:not(.empty), :is(.part.auxiliarybar, .part.sessionspart) .terminal-sticky-scroll"
      ),
      terminalBar: q(
        ".part.panel :is(.title, .composite.title, .header-or-footer) .monaco-action-bar .action-item.checked > .active-item-indicator, .part.panel .monaco-list .monaco-list-row.selected, .part.panel .monaco-list .monaco-list-row.focused, .pane-body.integrated-terminal .tabs-list .monaco-list-row.selected, .pane-body.integrated-terminal .tabs-list .monaco-list-row.focused"
      ),
      terminalSticky: q(
        ".part.panel .terminal-sticky-scroll, .part.panel > .content .pane-body.output-view .sticky-widget, .part.panel .monaco-tree-sticky-container:not(.empty), .pane-body.integrated-terminal .terminal-tabs-entry.is-active"
      ),
      barsBar: q(
        '.editor-group-container > .title .sticky-tabs-background, .editor-group-container > .title .tabs-container > .tab.sticky, .editor-group-container > .title .tabs-container > .tab.sticky > .tab-fill, .editor-group-container > .title .tabs-container > .tab.active:not(.sticky), .editor-group-container > .title .tabs-container > .tab.active:not(.sticky) > .tab-fill, .part.titlebar .update-indicator, .part.titlebar :is(.command-center-center, .command-center .action-item.command-center-center), .quick-input-widget:not([style*="display: none"]), .context-view .monaco-menu, .notifications-toasts .notification-toast'
      ),
      barsSticky: q(
        '.quick-input-widget .monaco-tree-sticky-container:not(.empty), .part.statusbar > .items-container > .statusbar-item:is([id="iamqazolp.vscode-gradient-themes"], [id^="iamqazolp.vscode-gradient-themes."], [aria-label*="Reload for Gradient"]) > a.statusbar-item-label'
      ),
      selectionBar: q(
        ".monaco-editor .selected-text, .monaco-editor .selectionHighlight, .xterm .xterm-selection div, #prism-dom-selection-layer .prism-dom-sel-rect"
      ),
      editorSash: q(
        ".part.editor :is(.monaco-grid-view, .monaco-split-view2) .monaco-sash.vertical"
      ),
      verticalSliders: q(
        ".monaco-scrollable-element > .scrollbar.visible.vertical > .slider, .monaco-scrollable-element > .scrollbar.visible:not(.horizontal) > .slider"
      ),
      horizontalSliders: q(
        ".monaco-scrollable-element > .scrollbar.visible.horizontal > .slider"
      ),
      editorCursors: q(".monaco-editor .cursors-layer .cursor"),
      terminalCursors: q(".xterm .xterm-cursor"),
    };

    if (
      hoveredBreathingTargets.length === 0 ||
      !hoveredBreathingTargets[0] ||
      !hoveredBreathingTargets[0].isConnected ||
      !hoveredBreathingTargets[0].matches(":hover")
    ) {
      const initialHover = wb.querySelector(
        ".monaco-list-row:hover, .terminal-tabs-entry:hover, .monaco-action-bar .action-item:hover, .tabs-container > .tab:hover, .statusbar-item:hover, .getting-started-step:hover"
      );
      if (initialHover) {
        assignHoveredBreathingTarget(initialHover);
      }
    }

    // Prune any element that is no longer active/selected so it reverts cleanly to workbench CSS
    const activeSet = new Set();
    Object.values(targets).forEach((arr) => {
      for (let i = 0; i < arr.length; i++) activeSet.add(arr[i]);
    });
    if (
      hoveredBreathingTargets.length > 0 &&
      hoveredBreathingTargets[0] &&
      hoveredBreathingTargets[0].isConnected &&
      hoveredBreathingTargets[0].matches(":hover")
    ) {
      for (let i = 0; i < hoveredBreathingTargets.length; i++) {
        activeSet.add(hoveredBreathingTargets[i]);
      }
    }
    localStyledElements.forEach((el) => {
      if (!activeSet.has(el)) {
        for (let i = 0; i < LOCAL_BREATHING_PROPS.length; i++) {
          el.style.removeProperty(LOCAL_BREATHING_PROPS[i]);
        }
        localStyledElements.delete(el);
        lastLocalVars.delete(el);
      }
    });

    cachedBreathingTargets = targets;
    return targets;
  }

  function updateBreathingTargets(wb, stops, angles, k, coords, tickCount, syntaxRgbs) {
    const [c1, c2, c3, c4] = stops;
    const splitMode = !isSeamlessEnabled();
    const defaultMeshCss = buildMeshCss(stops, angles, k, coords);

    // 1. In Seamless Mode, update the single childless leaf #prism-aurora-backdrop every 100ms (10 FPS)
    if (!splitMode) {
      setBackdropMesh(wb, defaultMeshCss);
    }

    lastLiveStops = stops.map((s) => [...s]);
    lastLiveAngles = { ...angles };

    const compMap = getComponentsConfig();
    const breatheCfg = getBreatheConfig();
    const shimmerOn = breatheCfg.shimmer;
    const waveOn = breatheCfg.wave;

    const resolveCompSpec = (key, sharedBar, sharedFrame) => {
      const cfg = compMap[key] || { enabled: true, customPalette: null };
      if (!cfg.enabled) return null;
      const hasCustom =
        cfg.customPalette &&
        Array.isArray(cfg.customPalette.stops) &&
        cfg.customPalette.stops.length === 4;
      if (!hasCustom) {
        return {
          hasCustom: false,
          stops,
          angles,
          barCss: sharedBar,
          frameCss: sharedFrame,
        };
      }
      const phaseDelta = Math.max(0, breathePhase - (Number(cfg.customPalette.phaseOffset) || 0));
      const cStops = shimmerOn
        ? getShiftedStops(cfg.customPalette.stops, phaseDelta * 0.16)
        : cfg.customPalette.stops;
      const baseA = cfg.customPalette.angles || {
        base: 135,
        bar: 90,
        side: 165,
        panel: 105,
      };
      const cAngles = waveOn
        ? {
            base: Math.round(baseA.base + Math.sin(breathePhase * 0.65) * 32),
            bar: Math.round(baseA.bar + Math.sin(breathePhase * 0.8) * 24),
            side: Math.round(baseA.side + Math.sin(breathePhase * 0.55) * 28),
            panel: Math.round(baseA.panel + Math.sin(breathePhase * 0.7) * 28),
          }
        : baseA;
      return {
        hasCustom: true,
        stops: cStops,
        angles: cAngles,
        barCss: buildBarCss(cStops, cAngles, k),
        frameCss: buildFrameCss(cStops),
      };
    };

    const targets = getBreathingTargets(wb);
    const sharedBarCss = buildBarCss(stops, angles, k);
    const sharedFrameCss = buildFrameCss(stops);

    const editorSpec = resolveCompSpec("editor", sharedBarCss, sharedFrameCss);
    const explorerSpec = resolveCompSpec("explorer", sharedBarCss, sharedFrameCss);
    const chatSpec = resolveCompSpec("chat", sharedBarCss, sharedFrameCss);
    const terminalSpec = resolveCompSpec("terminal", sharedBarCss, sharedFrameCss);
    const barsSpec = resolveCompSpec("bars", sharedBarCss, sharedFrameCss);
    const selectionSpec = resolveCompSpec("selection", sharedBarCss, sharedFrameCss);
    const syntaxSpec = resolveCompSpec("syntax", sharedBarCss, sharedFrameCss);

    // 2. Update Split-Panel / Custom Component Container Backgrounds at 100ms via non-inherited --prism-local-bg
    if (splitMode || (editorSpec && editorSpec.hasCustom)) {
      if (editorSpec) {
        const mesh = editorSpec.hasCustom
          ? buildMeshCss(editorSpec.stops, editorSpec.angles, k, coords)
          : defaultMeshCss;
        setLocalPropsOnList(targets.editorParts, "--prism-local-bg", mesh);
      }
    }
    if (splitMode || (explorerSpec && explorerSpec.hasCustom)) {
      if (explorerSpec) {
        const bg = splitMode
          ? buildSideCss(explorerSpec.stops, explorerSpec.angles, k)
          : buildMeshCss(explorerSpec.stops, explorerSpec.angles, k, coords);
        setLocalPropsOnList(targets.explorerParts, "--prism-local-bg", bg);
      }
    }
    if (splitMode || (chatSpec && chatSpec.hasCustom)) {
      if (chatSpec) {
        const bg = splitMode
          ? buildSideCss(chatSpec.stops, chatSpec.angles, k)
          : buildMeshCss(chatSpec.stops, chatSpec.angles, k, coords);
        setLocalPropsOnList(targets.chatParts, "--prism-local-bg", bg);
      }
    }
    if (splitMode || (terminalSpec && terminalSpec.hasCustom)) {
      if (terminalSpec) {
        const bg = splitMode
          ? buildTerminalPanelCss(terminalSpec.stops, terminalSpec.angles, k, coords)
          : buildMeshCss(terminalSpec.stops, terminalSpec.angles, k, coords);
        setLocalPropsOnList(targets.terminalParts, "--prism-local-bg", bg);
        if (splitMode) {
          setLocalPropsOnList(targets.terminalTitleParts, "--prism-local-bar", terminalSpec.barCss);
        }
      }
    }
    if (splitMode || (barsSpec && barsSpec.hasCustom)) {
      if (barsSpec) {
        if (splitMode) {
          setLocalPropsOnList(targets.barsParts, "--prism-local-bar", barsSpec.barCss);
        } else {
          setLocalPropsOnList(
            targets.barsParts,
            "--prism-local-bg",
            buildMeshCss(barsSpec.stops, barsSpec.angles, k, coords)
          );
        }
      }
    }

    const sharedBorderVCss = `linear-gradient(180deg, ${rgbToHex(c1)} 0%, ${rgbToHex(
      c2
    )} 33%, ${rgbToHex(c3)} 66%, ${rgbToHex(c4)} 100%)`;

    const editorBorderVCss = editorSpec
      ? `linear-gradient(180deg, ${rgbToHex(editorSpec.stops[0])} 0%, ${rgbToHex(
          editorSpec.stops[1]
        )} 33%, ${rgbToHex(editorSpec.stops[2])} 66%, ${rgbToHex(editorSpec.stops[3])} 100%)`
      : sharedBorderVCss;

    lastBreathingBarByComp = {
      shared: sharedBarCss,
      editor: editorSpec ? editorSpec.barCss : sharedBarCss,
      explorer: explorerSpec ? explorerSpec.barCss : sharedBarCss,
      chat: chatSpec ? chatSpec.barCss : sharedBarCss,
      terminal: terminalSpec ? terminalSpec.barCss : sharedBarCss,
      bars: barsSpec ? barsSpec.barCss : sharedBarCss,
    };

    if (hoveredBreathingTargets.length > 0) {
      if (
        hoveredBreathingTargets[0] &&
        hoveredBreathingTargets[0].isConnected &&
        hoveredBreathingTargets[0].matches(":hover")
      ) {
        const hoverBarCss =
          lastBreathingBarByComp[hoveredBreathingComp] || sharedBarCss;
        setLocalPropsOnList(hoveredBreathingTargets, "--prism-local-bar", hoverBarCss);
      } else {
        hoveredBreathingTargets = [];
        hoveredBreathingComp = "";
      }
    }

    // 3. Update small UI chrome elements (sticky bars, active tabs, selected files, selection, statusbar swatch)
    //    every 200ms (5 FPS) with non-inherited --prism-local-bar / --prism-local-border (0 subtree walks!)
    if (tickCount % 2 !== 0) return;

    const liveGrad = `linear-gradient(90deg, ${rgbToHex(c1)} 0%, ${rgbToHex(
      c2
    )} 33%, ${rgbToHex(c3)} 66%, ${rgbToHex(c4)} 100%)`;
    if (liveGrad !== lastSwatchGrad) {
      lastSwatchGrad = liveGrad;
      const swatchEl = document.getElementById("prism-randomizer-swatch");
      if (swatchEl) {
        swatchEl.style.backgroundImage = liveGrad;
      }
    }
    setLocalPropsOnList(targets.statusPills, "--prism-local-bar", sharedBarCss);

    if (editorSpec) {
      setLocalPropsOnList(targets.editorBar, "--prism-local-bar", editorSpec.barCss);
      setLocalPropsOnList(
        targets.editorSticky,
        "--prism-local-bar",
        editorSpec.barCss,
        "--prism-local-frame",
        editorSpec.frameCss
      );
      setLocalPropsOnList(targets.editorSash, "--prism-local-frame", editorBorderVCss);
      setLocalPropsOnList(targets.verticalSliders, "--prism-local-border-v", editorBorderVCss);
      setLocalPropsOnList(targets.horizontalSliders, "--prism-local-border", editorSpec.frameCss);
      setLocalPropsOnList(targets.editorCursors, "--prism-local-border-v", editorBorderVCss);
    }
    if (explorerSpec) {
      setLocalPropsOnList(
        targets.explorerBar,
        "--prism-local-bar",
        explorerSpec.barCss,
        "--prism-local-border",
        explorerSpec.frameCss
      );
      setLocalPropsOnList(
        targets.explorerSticky,
        "--prism-local-bar",
        explorerSpec.barCss,
        "--prism-local-frame",
        explorerSpec.frameCss
      );
    }
    if (chatSpec) {
      setLocalPropsOnList(
        targets.chatBar,
        "--prism-local-bar",
        chatSpec.barCss,
        "--prism-local-border",
        chatSpec.frameCss
      );
      setLocalPropsOnList(
        targets.chatSticky,
        "--prism-local-bar",
        chatSpec.barCss,
        "--prism-local-frame",
        chatSpec.frameCss
      );
    }
    if (terminalSpec) {
      const terminalBorderVCss = `linear-gradient(180deg, ${rgbToHex(
        terminalSpec.stops[0]
      )} 0%, ${rgbToHex(terminalSpec.stops[1])} 33%, ${rgbToHex(
        terminalSpec.stops[2]
      )} 66%, ${rgbToHex(terminalSpec.stops[3])} 100%)`;
      setLocalPropsOnList(
        targets.terminalBar,
        "--prism-local-bar",
        terminalSpec.barCss,
        "--prism-local-border",
        terminalSpec.frameCss
      );
      setLocalPropsOnList(
        targets.terminalSticky,
        "--prism-local-bar",
        terminalSpec.barCss,
        "--prism-local-frame",
        terminalSpec.frameCss
      );
      setLocalPropsOnList(
        targets.terminalCursors,
        "--prism-local-border-v",
        terminalBorderVCss
      );
    }
    if (barsSpec) {
      setLocalPropsOnList(
        targets.barsBar,
        "--prism-local-bar",
        barsSpec.barCss,
        "--prism-local-border",
        barsSpec.frameCss
      );
      setLocalPropsOnList(
        targets.barsSticky,
        "--prism-local-bar",
        barsSpec.barCss,
        "--prism-local-frame",
        barsSpec.frameCss
      );
    }
    if (selectionSpec) {
      const selCss = buildSelectionCss(selectionSpec.stops, selectionSpec.angles, k);
      setLocalPropsOnList(targets.selectionBar, "--prism-local-bar", selCss);
    }
    if (syntaxSpec) {
      let targetSynRgbs = syntaxRgbs;
      if (syntaxSpec.hasCustom) {
        const isDark = wb.classList.contains("vs-dark") || wb.classList.contains("hc-black");
        const cfg = compMap.syntax;
        const phaseDelta = Math.max(0, breathePhase - (Number(cfg.customPalette.phaseOffset) || 0));
        const customBaseSyn = cfg.customPalette.stops.map((s) => toReadableSyntaxRgb(s, isDark));
        targetSynRgbs = shimmerOn
          ? getShiftedStops(customBaseSyn, phaseDelta * 0.16)
          : customBaseSyn;
      }
      ensureSyntaxStyleSheet(
        wb,
        false,
        syntaxSpec.stops,
        k,
        targetSynRgbs,
        syntaxSpec.angles
      );
    }

    if (isPopoverOpen()) {
      const activeTargetStops =
        activeComponent && activeComponent !== "all"
          ? getActiveTargetPalette(activeComponent).stops
          : stops;
      const [tc1, tc2, tc3, tc4] = activeTargetStops;
      const targetGrad = `linear-gradient(90deg, ${rgbToHex(tc1)} 0%, ${rgbToHex(
        tc2
      )} 33%, ${rgbToHex(tc3)} 66%, ${rgbToHex(tc4)} 100%)`;
      const previewBar = document.getElementById("pp-builder-preview-bar");
      if (previewBar) {
        previewBar.style.backgroundImage = targetGrad;
      }
    }
  }

  function startOrStopBreathingAurora() {
    if (breatheTimer) {
      clearInterval(breatheTimer);
      breatheTimer = null;
    }
    if (!isBreathingEnabled()) {
      const hadActiveBreathing = localStyledElements.size > 0;
      clearLocalBreathingProps();
      if (hadActiveBreathing) {
        const wb = document.querySelector(".monaco-workbench");
        if (wb && lastLiveStops && lastLiveStops.length === 4) {
          const saved = getSavedPalette();
          if (!saved || !saved.isNativeOff) {
            writeGradientCssVars(
              wb,
              lastLiveStops,
              lastLiveAngles || { base: 135, bar: 90, side: 165, panel: 105 },
              getIntensity(),
              null,
              { synRgbs: lastSyntaxRgbs }
            );
          }
        }
      }
      return;
    }
    if (!isWindowActive()) {
      // Freeze smoothly in place when window is unfocused (0% background CPU/heap churn)
      detachBreathingHoverListener();
      return;
    }

    attachBreathingHoverListener();
    breatheTimer = setInterval(() => {
      if (!isWindowActive()) return;
      const targetWb = document.querySelector(".monaco-workbench");
      if (!targetWb) return;
      const saved = getSavedPalette();
      if (saved && saved.isNativeOff) return;

      const cfg = getBreatheConfig();
      const speedMult = (cfg.speedPct || 100) / 100;

      // 100ms tick interval (10 FPS)
      breathePhase += 0.036 * speedMult;
      breatheTickCount = (breatheTickCount + 1) % 1000000;

      const activePalette =
        saved && saved.stops && saved.stops.length === 4
          ? saved
          : CURATED_PALETTES[0];

      const isDark =
        targetWb.classList.contains("vs-dark") || targetWb.classList.contains("hc-black");

      let baseStops = activePalette.stops.map((s) => [...s]);
      let baseSyntaxRgbs = null;
      let baseAngles = {
        ...(activePalette.angles || {
          base: 135,
          bar: 90,
          side: 165,
          panel: 105,
        }),
      };

      // 1. Auto-Morph Between Palettes (Smooth RGB + Angle crossfade starting at 0.0)
      if (cfg.morph) {
        if (!morphSourceStops || !morphTargetPalette) {
          morphSourceStops = baseStops.map((s) => [...s]);
          morphSourceAngles = { ...baseAngles };
          morphTargetPalette = rollRandomPalette(activePalette.name);
          morphProgress = 0;
        }
        morphProgress += 0.0056 * speedMult;
        if (morphProgress >= 1) {
          const completed = morphTargetPalette;
          morphSourceStops = completed.stops.map((s) => [...s]);
          morphSourceAngles = {
            ...(completed.angles || {
              base: 135,
              bar: 90,
              side: 165,
              panel: 105,
            }),
          };
          try {
            localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(completed));
          } catch (_) {}
          updateStatusBarPill(completed.name, null);
          if (isPopoverOpen()) {
            if (activeComponent === "all") {
              syncBuilderPickers(completed.stops);
            }
            renderPaletteGrid();
          }
          morphTargetPalette = rollRandomPalette(completed.name);
          morphProgress = 0;
          baseStops = morphSourceStops.map((s) => [...s]);
          baseAngles = { ...morphSourceAngles };
          baseSyntaxRgbs = baseStops.map((s) => toReadableSyntaxRgb(s, isDark));
        } else {
          const smoothT =
            morphProgress * morphProgress * (3 - 2 * morphProgress);
          baseStops = [0, 1, 2, 3].map((i) =>
            lerpRgb(morphSourceStops[i], morphTargetPalette.stops[i], smoothT)
          );
          const srcSyn = morphSourceStops.map((s) => toReadableSyntaxRgb(s, isDark));
          const tgtSyn = morphTargetPalette.stops.map((s) => toReadableSyntaxRgb(s, isDark));
          baseSyntaxRgbs = [0, 1, 2, 3].map((i) => lerpRgb(srcSyn[i], tgtSyn[i], smoothT));
          const srcA = morphSourceAngles || baseAngles;
          const tgtA = morphTargetPalette.angles || {
            base: 135,
            bar: 90,
            side: 165,
            panel: 105,
          };
          baseAngles = {
            base: srcA.base + (tgtA.base - srcA.base) * smoothT,
            bar: srcA.bar + (tgtA.bar - srcA.bar) * smoothT,
            side: srcA.side + (tgtA.side - srcA.side) * smoothT,
            panel: srcA.panel + (tgtA.panel - srcA.panel) * smoothT,
          };
        }
      } else {
        morphSourceStops = null;
        morphSourceAngles = null;
        morphTargetPalette = null;
        morphProgress = 0;
        baseSyntaxRgbs = baseStops.map((s) => toReadableSyntaxRgb(s, isDark));
      }

      // 2. Color Stop Rotation / Shimmer (Flow the 4 stops smoothly from 0 offset)
      const animatedStops = cfg.shimmer
        ? getShiftedStops(baseStops, breathePhase * 0.16)
        : baseStops;
      const animatedSyntaxRgbs = cfg.shimmer
        ? getShiftedStops(baseSyntaxRgbs, breathePhase * 0.16)
        : baseSyntaxRgbs;

      // 3. Inhale / Exhale Opacity Pulse (Zero offset at breathePhase = 0)
      const baseK = getIntensity();
      const effectiveK = cfg.pulse
        ? Math.max(0.25, Math.min(2.2, baseK * (1 + Math.sin(breathePhase * 0.78) * 0.24)))
        : baseK;

      // 4. Full-Workbench Wave
      let liveAngles = baseAngles;
      let waveCoords = null;
      if (cfg.wave) {
        waveCoords = {
          p1x: Math.round(15 + Math.sin(breathePhase * 0.9) * 14),
          p1y: Math.round(15 + Math.sin(breathePhase * 0.75) * 13),
          p2x: Math.round(85 - Math.sin(breathePhase * 0.85) * 14),
          p2y: Math.round(25 + Math.sin(breathePhase * 1.05) * 14),
          p3x: Math.round(25 + Math.sin(breathePhase * 0.7) * 14),
          p3y: Math.round(85 - Math.sin(breathePhase * 0.8) * 13),
          p4x: Math.round(85 - Math.sin(breathePhase * 0.65) * 14),
          p4y: Math.round(85 - Math.sin(breathePhase * 0.95) * 13),
        };
        liveAngles = {
          base: Math.round(baseAngles.base + Math.sin(breathePhase * 0.65) * 32),
          bar: Math.round(baseAngles.bar + Math.sin(breathePhase * 0.8) * 24),
          side: Math.round(baseAngles.side + Math.sin(breathePhase * 0.55) * 28),
          panel: Math.round(baseAngles.panel + Math.sin(breathePhase * 0.7) * 28),
        };
      }

      // Zero-.monaco-workbench-walk fast path:
      // Updates leaf #prism-aurora-backdrop, non-inherited --prism-local-* properties on
      // cached chrome elements, and leaf #prism-syntax-style rules without invalidating
      // the 10,000-node workbench DOM tree!
      updateBreathingTargets(
        targetWb,
        animatedStops,
        liveAngles,
        effectiveK,
        waveCoords,
        breatheTickCount,
        animatedSyntaxRgbs
      );
    }, 100);
  }

  function setBreathingEnabled(next) {
    try {
      localStorage.setItem(STORAGE_KEY_BREATHE, String(Boolean(next)));
    } catch (_) {}
    startOrStopBreathingAurora();
    const saved = getSavedPalette();
    updateStatusBarPill(
      saved ? saved.name : "Prism Classic",
      saved ? saved.stops : null,
      saved && saved.isNativeOff
    );
    refreshPopoverHeaderAndIntensity();
  }

  function toggleBreathing() {
    setBreathingEnabled(!isBreathingEnabled());
  }

  function rollRandomPalette(currentName) {
    const allPresets = getAllPalettes();
    const favNames = getFavorites();
    const favOnly = isFavOnlyEnabled();

    // If Favs-Only lock is active (or 35% favorite boost when user has multiple favorites)
    if (favNames.length > 0 && (favOnly || (favNames.length > 1 && Math.random() < 0.35))) {
      let favPool = allPresets.filter(
        (p) => favNames.includes(p.name) && p.name !== currentName
      );
      if (favPool.length === 0 && favOnly) {
        favPool = allPresets.filter((p) => favNames.includes(p.name));
      }
      if (favPool.length > 0) {
        const picked = favPool[randInt(0, favPool.length - 1)];
        return {
          name: picked.name,
          stops: [...picked.stops],
          angles: {
            base: randInt(120, 155),
            bar: 90,
            side: randInt(155, 178),
            panel: randInt(100, 125),
          },
        };
      }
    }

    // 80% chance curated/custom palette, 20% chance procedural HSL harmony
    if (Math.random() < 0.8) {
      const candidates = allPresets.filter(
        (p) => !p.isDefault && p.name !== currentName && !recentNames.includes(p.name)
      );
      const pool =
        candidates.length > 0
          ? candidates
          : allPresets.filter((p) => !p.isDefault && p.name !== currentName);
      if (pool.length === 0) {
        return generateProceduralPalette();
      }
      const picked = pool[randInt(0, pool.length - 1)];
      recentNames.push(picked.name);
      if (recentNames.length > 8) {
        recentNames.shift();
      }
      const stops = [...picked.stops];
      if (Math.random() < 0.4) {
        stops.reverse();
      }
      return {
        name: picked.name,
        stops,
        angles: {
          base: randInt(120, 155),
          bar: 90,
          side: randInt(155, 178),
          panel: randInt(100, 125),
        },
      };
    }
    return generateProceduralPalette();
  }

  function applyPaletteToWorkbench(palette, opts) {
    const wb = document.querySelector(".monaco-workbench");
    if (!wb) return;
    syncSeamlessClass(wb);
    const k = getIntensity();

    if (!opts || !opts.skipHistory) {
      const currentSaved = getSavedPalette();
      const targetName = !palette || palette.isDefault ? "Prism Classic" : palette.name;
      const currentName = currentSaved ? currentSaved.name : "Prism Classic";
      if (
        targetName !== currentName ||
        (palette &&
          palette.stops &&
          currentSaved &&
          currentSaved.stops &&
          JSON.stringify(palette.stops) !== JSON.stringify(currentSaved.stops))
      ) {
        pushRollHistory(
          currentSaved || {
            name: "Prism Classic",
            isDefault: true,
            stops: CURATED_PALETTES[0].stops,
          }
        );
      }
    }

    // Reset any in-flight morph transition and phase offset when user explicitly picks/rolls a palette
    morphSourceStops = null;
    morphSourceAngles = null;
    morphTargetPalette = null;
    morphProgress = 0;
    breathePhase = 0;

    if (palette && palette.isNativeOff) {
      // Turn off the 4-color overlay so the pure single-color theme shines through natively
      clearLocalBreathingProps();
      setBackdropMesh(wb, "none");
      ["--g-r1", "--g-r2", "--g-r3", "--g-r4"].forEach((prop) =>
        setWbProp(wb, prop, "transparent")
      );
      [
        "--g-base",
        "--g-bar",
        "--g-side",
        "--g-panel",
        "--g-default-mesh",
        "--g-default-terminal-panel",
        "--g-default-frame",
        "--g-workbench-mesh",
        "--g-explorer-side",
        "--g-chat-side",
        "--g-terminal-panel",
      ].forEach((prop) => setWbProp(wb, prop, "none"));
      COMPONENT_DEFS.forEach((def) => {
        if (def.key === "selection" || def.key === "syntax") return;
        wb.classList.remove(`prism-custom-${def.key}`);
        setWbProp(wb, `--g-${def.key}-mesh`, "none");
        setWbProp(wb, `--g-${def.key}-bar`, "none");
        setWbProp(
          wb,
          `--g-${def.key}-frame`,
          "linear-gradient(90deg, rgba(128, 128, 128, 0.22), rgba(128, 128, 128, 0.22))"
        );
      });
      wb.classList.add("prism-no-selection");
      setWbProp(wb, "--g-selection", "var(--vscode-editor-selectionBackground)");
      setWbProp(
        wb,
        "--g-sel-tint",
        "var(--vscode-selection-background, var(--vscode-editor-selectionBackground))"
      );
      setWbProp(
        wb,
        "--g-border",
        "linear-gradient(90deg, var(--vscode-focusBorder, #3B82F6), var(--vscode-focusBorder, #3B82F6))"
      );
      setWbProp(
        wb,
        "--g-border-v",
        "linear-gradient(180deg, var(--vscode-focusBorder, #3B82F6), var(--vscode-focusBorder, #3B82F6))"
      );
      disableSyntaxCssVars(wb);
      clearDomSelectionOverlay();
      try {
        localStorage.setItem(
          STORAGE_KEY_STATE,
          JSON.stringify({ name: "Theme Native", isNativeOff: true })
        );
      } catch (_) {}
      updateStatusBarPill("Theme Native", null, true);
      if (isPopoverOpen()) {
        renderPaletteGrid();
        refreshPopoverHeaderAndIntensity();
      }
      return;
    }

    const isDefaultPrism = !palette || palette.isDefault;
    if (isDefaultPrism) {
      localStorage.removeItem(STORAGE_KEY_STATE);
    }

    const activePalette = isDefaultPrism ? CURATED_PALETTES[0] : palette;
    const angles = activePalette.angles || {
      base: 135,
      bar: 90,
      side: 165,
      panel: 105,
    };

    writeGradientCssVars(wb, activePalette.stops, angles, k);

    if (!isDefaultPrism) {
      try {
        localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(palette));
      } catch (_) {}
    }

    updateStatusBarPill(activePalette.name, activePalette.stops, false);
    if (isPopoverOpen()) {
      const targetPal = getActiveTargetPalette(activeComponent);
      syncBuilderPickers(targetPal.stops);
      renderPaletteGrid();
      refreshPopoverHeaderAndIntensity();
    }
  }

  function toggleResetOrNative() {
    const saved = getSavedPalette();
    if (!saved) {
      // Currently on Prism Classic -> switch to Theme Native (Overlay Off)
      applyPaletteToWorkbench({ name: "Theme Native", isNativeOff: true });
    } else {
      // Currently on a randomized palette or Theme Native -> reset to Prism Classic
      applyPaletteToWorkbench(null);
    }
  }

  function updateStatusBarPill(name, stops, isNativeOff) {
    const swatchEl = document.getElementById("prism-randomizer-swatch");
    const rollEl = document.getElementById("prism-randomizer-roll");
    const sbBreatheEl = document.getElementById("prism-randomizer-breathe");

    const autoOn = localStorage.getItem(STORAGE_KEY_AUTO) === "true";
    const breatheOn = isBreathingEnabled();
    if (sbBreatheEl) {
      sbBreatheEl.classList.toggle("active", breatheOn);
    }
    const k = Math.round(getIntensity() * 100);
    const kSuffix = k !== 100 ? ` (${k}%)` : "";
    if (rollEl) {
      rollEl.title =
        `↻ ${name || "Prism Classic"}${kSuffix}${breatheOn ? " • Breathing" : ""}${autoOn ? " • Auto" : ""}\n` +
        "• Left-Click (or Alt+Shift+G): Roll random gradient\n" +
        "• Right-Click / Shift+Click (or Alt+Shift+0): Cycle Prism Classic / Theme Native (Off)\n" +
        "• Cmd/Ctrl+Click: Toggle Auto-Randomize on Startup";
    }

    if (swatchEl) {
      if (isNativeOff) {
        swatchEl.style.background = "var(--vscode-focusBorder, #64748B)";
      } else if (stops && stops.length === 4) {
        const hexes = stops.map(rgbToHex);
        swatchEl.style.background = `linear-gradient(90deg, ${hexes[0]} 0%, ${hexes[1]} 33%, ${hexes[2]} 66%, ${hexes[3]} 100%)`;
      } else if (lastLiveStops && lastLiveStops.length === 4) {
        const hexes = lastLiveStops.map(rgbToHex);
        swatchEl.style.background = `linear-gradient(90deg, ${hexes[0]} 0%, ${hexes[1]} 33%, ${hexes[2]} 66%, ${hexes[3]} 100%)`;
      } else {
        swatchEl.style.background =
          "linear-gradient(90deg, #EA4335 0%, #FBBC04 33%, #34A853 66%, #4285F4 100%)";
      }
    }
  }

  function syncBuilderPickers(stops) {
    if (!isPopoverOpen() || !stops || stops.length !== 4) return;
    const hexes = stops.map(rgbToHex);
    for (let i = 0; i < 4; i++) {
      const inp = document.getElementById(`pp-stop-${i}`);
      const hexLabel = document.getElementById(`pp-stop-hex-${i}`);
      if (inp) inp.value = hexes[i];
      if (hexLabel) hexLabel.textContent = hexes[i];
    }
    const previewBar = document.getElementById("pp-builder-preview-bar");
    if (previewBar) {
      previewBar.style.background = `linear-gradient(90deg, ${hexes[0]} 0%, ${hexes[1]} 33%, ${hexes[2]} 66%, ${hexes[3]} 100%)`;
    }
  }

  function refreshPopoverTabs() {
    if (!isPopoverOpen()) return;
    const tabsBar = document.getElementById("prism-popover-tabs");
    if (!tabsBar) return;
    const all = getAllPalettes();
    const favs = getFavorites();
    const favCount = all.filter((p) => favs.includes(p.name)).length;
    const customCount = all.filter((p) => p.category === "custom").length;
    const removedCount = getRemovedPalettes().length;

    const labelMap = {
      all: `All (${all.length})`,
      favs: favCount > 0 ? `Favs (${favCount})` : "Favs",
      prism: "Prism",
      pastel: "Pastel",
      pure: "Pure",
      custom: customCount > 0 ? `Custom (${customCount})` : "Custom",
    };

    tabsBar.querySelectorAll(".pp-tab[data-cat]").forEach((el) => {
      const cat = el.getAttribute("data-cat");
      if (cat && labelMap[cat]) {
        el.textContent = labelMap[cat];
      }
      el.classList.toggle("active", cat === activeCategory);
    });

    let restoreBtn = document.getElementById("pp-btn-restore-removed");
    if (removedCount > 0) {
      if (!restoreBtn) {
        restoreBtn = document.createElement("button");
        restoreBtn.id = "pp-btn-restore-removed";
        restoreBtn.className = "pp-tab";
        restoreBtn.style.flex = "0 0 auto";
        restoreBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          restoreRemovedPalettes();
        });
        tabsBar.appendChild(restoreBtn);
      }
      restoreBtn.textContent = `↺ (${removedCount})`;
      restoreBtn.title = `Restore ${removedCount} hidden built-in palette${removedCount > 1 ? "s" : ""}`;
    } else if (restoreBtn) {
      restoreBtn.remove();
    }
  }

  function refreshPopoverHeaderAndIntensity() {
    if (!isPopoverOpen()) return;
    const pop = document.getElementById("prism-palette-popover");
    if (!pop) return;
    const k = getIntensity();
    const kPct = Math.round(k * 100);
    const slider = document.getElementById("pp-intensity-slider");
    const label = document.getElementById("pp-intensity-val");
    if (slider) slider.value = String(kPct);
    if (label) label.textContent = `${kPct}%`;

    const breatheOn = isBreathingEnabled();
    const breatheBtn = document.getElementById("pp-btn-breathe");
    if (breatheBtn) {
      breatheBtn.classList.toggle("active", breatheOn);
    }

    const seamlessOn = isSeamlessEnabled();
    const seamlessBtn = document.getElementById("pp-btn-seamless");
    if (seamlessBtn) {
      seamlessBtn.classList.toggle("active", seamlessOn);
      seamlessBtn.textContent = seamlessOn ? "Seamless: ON" : "Seamless: OFF";
    }

    const breatheStatus = document.getElementById("pp-breathe-status");
    if (breatheStatus) {
      breatheStatus.textContent = breatheOn ? "ACTIVE" : "PAUSED";
      breatheStatus.style.opacity = breatheOn ? "1" : "0.6";
    }

    const cfg = getBreatheConfig();
    ["wave", "pulse", "shimmer", "morph"].forEach((modeKey) => {
      const chip = document.getElementById(`pp-breathe-mode-${modeKey}`);
      if (chip) chip.classList.toggle("active", Boolean(cfg[modeKey]));
    });
    const speedSlider = document.getElementById("pp-breathe-speed-slider");
    const speedVal = document.getElementById("pp-breathe-speed-val");
    if (speedSlider) speedSlider.value = String(cfg.speedPct || 100);
    if (speedVal) speedVal.textContent = `${cfg.speedPct || 100}%`;

    const comps = getComponentsConfig();
    const globalPal = getActiveTargetPalette("all");
    const globalHexes = (globalPal.stops || CURATED_PALETTES[0].stops).map(rgbToHex);

    const allPill = document.getElementById("pp-comp-all");
    const allDot = document.getElementById("pp-comp-dot-all");
    if (allPill) {
      allPill.classList.toggle("active", activeComponent === "all");
    }
    if (allDot) {
      allDot.classList.toggle("off", !seamlessOn);
      if (seamlessOn) {
        allDot.style.background = `linear-gradient(135deg, ${globalHexes[0]} 0%, ${globalHexes[1]} 33%, ${globalHexes[2]} 66%, ${globalHexes[3]} 100%)`;
      } else {
        allDot.style.background = "transparent";
      }
    }

    COMPONENT_DEFS.forEach((def) => {
      const pill = document.getElementById(`pp-comp-${def.key}`);
      const dot = document.getElementById(`pp-comp-dot-${def.key}`);
      const cState = comps[def.key] || { enabled: true, customPalette: null };
      if (pill) {
        pill.classList.toggle("active", activeComponent === def.key);
        pill.classList.toggle("is-off", !cState.enabled);
      }
      if (dot) {
        dot.classList.toggle("off", !cState.enabled);
        if (cState.enabled) {
          const hexes =
            cState.customPalette && Array.isArray(cState.customPalette.stops) && cState.customPalette.stops.length === 4
              ? cState.customPalette.stops.map(rgbToHex)
              : globalHexes;
          dot.style.background = `linear-gradient(135deg, ${hexes[0]} 0%, ${hexes[1]} 33%, ${hexes[2]} 66%, ${hexes[3]} 100%)`;
        } else {
          dot.style.background = "transparent";
        }
      }
    });

    const bTitle = document.getElementById("pp-builder-title");
    if (bTitle) {
      if (activeComponent === "all") {
        bTitle.textContent = "Pick your own color";
      } else {
        const compDef = COMPONENT_DEFS.find((d) => d.key === activeComponent);
        bTitle.textContent = `Pick your own color • ${compDef ? compDef.label : activeComponent}`;
      }
    }

    const targetPal = getActiveTargetPalette(activeComponent);
    if (targetPal && targetPal.stops) {
      syncBuilderPickers(targetPal.stops);
    }
  }

  function renderPaletteGrid() {
    if (!isPopoverOpen()) return;
    refreshPopoverTabs();
    const grid = document.getElementById("prism-popover-grid");
    if (!grid) return;

    const comps = getComponentsConfig();
    const targetPal = getActiveTargetPalette(activeComponent);
    const activeName = targetPal ? targetPal.name : "Prism Classic";
    const favs = getFavorites();
    const all = getAllPalettes();

    const filtered = all.filter((p) => {
      if (activeCategory === "all") return true;
      if (activeCategory === "favs") return favs.includes(p.name);
      return p.category === activeCategory;
    });

    grid.textContent = "";

    // When "All" is selected, show a quick Seamless Mode ON/OFF card at the top of the grid
    if (activeComponent === "all") {
      const seamlessOn = isSeamlessEnabled();
      const sCard = document.createElement("div");
      sCard.className = `pp-card${!seamlessOn ? " selected" : ""}`;
      sCard.style.gridColumn = "1 / -1";
      const sSwatch = document.createElement("div");
      sSwatch.className = "pp-swatch";
      const gHexes = (targetPal && targetPal.stops ? targetPal.stops : CURATED_PALETTES[0].stops).map(rgbToHex);
      sSwatch.style.background = seamlessOn
        ? `linear-gradient(90deg, ${gHexes[0]} 0%, ${gHexes[1]} 33%, ${gHexes[2]} 66%, ${gHexes[3]} 100%)`
        : `repeating-linear-gradient(90deg, ${gHexes[0]} 0%, ${gHexes[1]} 16%, ${gHexes[2]} 33%, ${gHexes[3]} 50%)`;
      const sRow = document.createElement("div");
      sRow.className = "pp-card-row";
      const sName = document.createElement("span");
      sName.className = "pp-card-name";
      sName.textContent = seamlessOn
        ? "● Seamless Mode: ON (Click for Per-Component Split Gradients)"
        : "○ Seamless Mode: OFF — Each Component Has Own Gradient (Click for Seamless)";
      sRow.appendChild(sName);
      sCard.appendChild(sSwatch);
      sCard.appendChild(sRow);
      sCard.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleSeamlessMode();
      });
      grid.appendChild(sCard);
    }

    // When a specific component is selected, show quick On/Off and "Same as All" cards at the top of the grid
    if (activeComponent !== "all") {
      const compDef = COMPONENT_DEFS.find((d) => d.key === activeComponent);
      const compState = comps[activeComponent] || { enabled: true, customPalette: null };
      const compLabel = compDef ? compDef.label : activeComponent;

      // Card 1: Turn Component Gradient ON / OFF
      const toggleCard = document.createElement("div");
      toggleCard.className = `pp-card${!compState.enabled ? " selected" : ""}`;
      const toggleSwatch = document.createElement("div");
      toggleSwatch.className = "pp-swatch";
      toggleSwatch.style.background = compState.enabled
        ? "linear-gradient(90deg, #22C55E 0%, #10B981 100%)"
        : "rgba(128, 128, 128, 0.25)";
      const toggleRow = document.createElement("div");
      toggleRow.className = "pp-card-row";
      const toggleName = document.createElement("span");
      toggleName.className = "pp-card-name";
      toggleName.textContent = compState.enabled
        ? `● ${compLabel}: ON (Turn Off)`
        : `○ ${compLabel}: OFF (Turn On)`;
      toggleRow.appendChild(toggleName);
      toggleCard.appendChild(toggleSwatch);
      toggleCard.appendChild(toggleRow);
      toggleCard.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleComponentEnabled(activeComponent);
      });
      grid.appendChild(toggleCard);

      // Card 2: Reset Component to Unified "Same as All" Gradient
      const inheritCard = document.createElement("div");
      inheritCard.className = `pp-card${compState.enabled && !compState.customPalette ? " selected" : ""}`;
      const globalStops = getActiveTargetPalette("all").stops || CURATED_PALETTES[0].stops;
      const gHexes = globalStops.map(rgbToHex);
      const inheritSwatch = document.createElement("div");
      inheritSwatch.className = "pp-swatch";
      inheritSwatch.style.background = `linear-gradient(90deg, ${gHexes[0]} 0%, ${gHexes[1]} 33%, ${gHexes[2]} 66%, ${gHexes[3]} 100%)`;
      const inheritRow = document.createElement("div");
      inheritRow.className = "pp-card-row";
      const inheritName = document.createElement("span");
      inheritName.className = "pp-card-name";
      inheritName.textContent = "⇄ Same as All (Unified)";
      inheritRow.appendChild(inheritName);
      inheritCard.appendChild(inheritSwatch);
      inheritCard.appendChild(inheritRow);
      inheritCard.addEventListener("click", (e) => {
        e.stopPropagation();
        setComponentPalette(activeComponent, null);
      });
      grid.appendChild(inheritCard);

      if (activeComponent === "syntax") {
        const synMode = getSyntaxMode();
        const isPalMode = synMode === "palette";
        const modeCard = document.createElement("div");
        modeCard.className = `pp-card${isPalMode ? " selected" : ""}`;
        modeCard.style.gridColumn = "1 / -1";
        const modeSwatch = document.createElement("div");
        modeSwatch.className = "pp-swatch";
        const sHexes = (targetPal && targetPal.stops ? targetPal.stops : globalStops).map(rgbToHex);
        modeSwatch.style.background = isPalMode
          ? `linear-gradient(90deg, ${sHexes[0]} 0%, ${sHexes[1]} 33%, ${sHexes[2]} 66%, ${sHexes[3]} 100%)`
          : "linear-gradient(90deg, #E57368 0%, #6BC48D 33%, #78ADE8 66%, #B094E0 100%)";
        const modeRow = document.createElement("div");
        modeRow.className = "pp-card-row";
        const modeName = document.createElement("span");
        modeName.className = "pp-card-name";
        modeName.textContent = isPalMode
          ? "🌈 Syntax Mode: Active 4-Color Palette Prism (Click for Semantic Blend)"
          : "✦ Syntax Mode: Per-Token Semantic Gradients (Click for 4-Color Palette Prism)";
        modeRow.appendChild(modeName);
        modeCard.appendChild(modeSwatch);
        modeCard.appendChild(modeRow);
        modeCard.addEventListener("click", (e) => {
          e.stopPropagation();
          toggleSyntaxMode();
        });
        grid.appendChild(modeCard);
      }
    }

    if (filtered.length === 0) {
      const empty = document.createElement("div");
      empty.style.cssText =
        "grid-column:1/-1;padding:22px;text-align:center;opacity:0.7;font-size:11.5px;";
      empty.textContent =
        activeCategory === "favs"
          ? "No favorites yet — click ☆ on any palette card to pin it here!"
          : "No custom palettes saved yet — sculpt one with the 4 glowing color orbs below!";
      grid.appendChild(empty);
      return;
    }

    filtered.forEach((p) => {
      const compState = activeComponent !== "all" ? comps[activeComponent] : null;
      const isSelected =
        activeComponent === "all"
          ? p.name === activeName
          : Boolean(
              compState &&
                compState.enabled &&
                compState.customPalette &&
                compState.customPalette.name === p.name
            );

      const card = document.createElement("div");
      card.className = `pp-card${isSelected ? " selected" : ""}`;

      // Tint each card with its own subtle 4-stop gradient mesh
      const [c1, c2, c3, c4] = p.stops;
      card.style.backgroundImage = `linear-gradient(135deg, ${rgba(c1, 0.16)} 0%, ${rgba(
        c2,
        0.11
      )} 33%, ${rgba(c3, 0.11)} 66%, ${rgba(c4, 0.18)} 100%)`;

      const swatch = document.createElement("div");
      swatch.className = "pp-swatch";
      const hexes = p.stops.map(rgbToHex);
      swatch.style.background = `linear-gradient(90deg, ${hexes[0]} 0%, ${hexes[1]} 33%, ${hexes[2]} 66%, ${hexes[3]} 100%)`;

      const row = document.createElement("div");
      row.className = "pp-card-row";

      const nameEl = document.createElement("span");
      nameEl.className = "pp-card-name";
      nameEl.textContent = p.name;
      nameEl.title = `${p.name} (${hexes.join(" → ")})`;

      const rightWrap = document.createElement("span");
      rightWrap.style.cssText = "display:inline-flex;align-items:center;gap:4px;flex-shrink:0;";

      // 4 mini glowing color dots
      const dotsWrap = document.createElement("span");
      dotsWrap.className = "pp-dots";
      hexes.forEach((h) => {
        const d = document.createElement("span");
        d.className = "pp-dot";
        d.style.background = h;
        dotsWrap.appendChild(d);
      });
      rightWrap.appendChild(dotsWrap);

      const isFav = favs.includes(p.name);
      const star = document.createElement("span");
      star.className = `pp-star${isFav ? " fav" : ""}`;
      star.textContent = isFav ? "★" : "☆";
      if (isFav) {
        star.style.color = "#f59e0b";
      }
      star.title = isFav ? "Remove from Favorites" : "Pin to Favorites";
      star.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFavorite(p.name);
      });
      rightWrap.appendChild(star);

      const del = document.createElement("span");
      del.className = "pp-del";
      del.textContent = "×";
      del.title = `Remove "${p.name}"`;
      del.addEventListener("click", (e) => {
        e.stopPropagation();
        removePalette(p.name);
      });
      rightWrap.appendChild(del);

      row.appendChild(nameEl);
      row.appendChild(rightWrap);
      card.appendChild(swatch);
      card.appendChild(row);

      card.addEventListener("click", (e) => {
        e.stopPropagation();
        const nameInp = document.getElementById("pp-custom-name-input");
        if (nameInp && p.isCustom) {
          nameInp.value = p.name;
        }
        if (activeComponent !== "all") {
          setComponentPalette(activeComponent, {
            name: p.name,
            stops: [...p.stops],
            angles: { base: 135, bar: 90, side: 165, panel: 105 },
          });
          return;
        }
        resetAllComponentCustomPalettes();
        if (p.isDefault) {
          applyPaletteToWorkbench(null);
        } else {
          applyPaletteToWorkbench({
            name: p.name,
            stops: [...p.stops],
            angles: { base: 135, bar: 90, side: 165, panel: 105 },
          });
        }
      });

      grid.appendChild(card);
    });
  }

  function createCycleArrowsSvg(size = 13) {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("width", String(size));
    svg.setAttribute("height", String(size));
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2.2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("class", "prism-cycle-svg");
    svg.style.cssText = "display:inline-block;vertical-align:middle;flex-shrink:0;";

    const paths = [
      "M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
      "M3 3v5h5",
      "M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16",
      "M16 16h5v5",
    ];
    paths.forEach((d) => {
      const p = document.createElementNS(ns, "path");
      p.setAttribute("d", d);
      svg.appendChild(p);
    });
    return svg;
  }

  let studioIconSeq = 0;
  function createStudioIconSvg(size = 16) {
    studioIconSeq += 1;
    const uid = studioIconSeq;
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("width", String(size));
    svg.setAttribute("height", String(size));
    svg.setAttribute("viewBox", "0 0 512 512");
    svg.style.cssText =
      "display:inline-block;vertical-align:middle;flex-shrink:0;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.18);";

    const defs = document.createElementNS(ns, "defs");

    const bgGrad = document.createElementNS(ns, "linearGradient");
    bgGrad.setAttribute("id", `prismLogoBg_${uid}`);
    bgGrad.setAttribute("x1", "0");
    bgGrad.setAttribute("y1", "0");
    bgGrad.setAttribute("x2", "1");
    bgGrad.setAttribute("y2", "1");
    [
      ["0", "#AFDFFF"],
      ["0.35", "#D4D9FE"],
      ["0.68", "#FFCFF4"],
      ["1", "#FFDDCA"],
    ].forEach(([offset, color]) => {
      const st = document.createElementNS(ns, "stop");
      st.setAttribute("offset", offset);
      st.setAttribute("stop-color", color);
      bgGrad.appendChild(st);
    });
    defs.appendChild(bgGrad);

    const markGrad = document.createElementNS(ns, "linearGradient");
    markGrad.setAttribute("id", `prismLogoMark_${uid}`);
    markGrad.setAttribute("gradientUnits", "userSpaceOnUse");
    markGrad.setAttribute("x1", "1.0");
    markGrad.setAttribute("y1", "2.5");
    markGrad.setAttribute("x2", "15.0");
    markGrad.setAttribute("y2", "13.5");
    [
      ["0.05", "#2481FF"],
      ["0.38", "#765BFE"],
      ["0.68", "#E844AC"],
      ["1.0", "#FF8F5A"],
    ].forEach(([offset, color]) => {
      const st = document.createElementNS(ns, "stop");
      st.setAttribute("offset", offset);
      st.setAttribute("stop-color", color);
      markGrad.appendChild(st);
    });
    defs.appendChild(markGrad);
    svg.appendChild(defs);

    const bgCircle = document.createElementNS(ns, "circle");
    bgCircle.setAttribute("cx", "256");
    bgCircle.setAttribute("cy", "256");
    bgCircle.setAttribute("r", "246");
    bgCircle.setAttribute("fill", `url(#prismLogoBg_${uid})`);
    bgCircle.setAttribute("stroke", "rgba(255,255,255,0.85)");
    bgCircle.setAttribute("stroke-width", "16");
    svg.appendChild(bgCircle);

    const gMark = document.createElementNS(ns, "g");
    gMark.setAttribute("transform", "translate(116 116) scale(17.5)");
    const pathMark = document.createElementNS(ns, "path");
    pathMark.setAttribute("fill", `url(#prismLogoMark_${uid})`);
    pathMark.setAttribute(
      "d",
      "M15.434 1.72887L12.14 0.144875C12.002 0.078875 11.855 0.046875 11.709 0.046875C11.353 0.046875 11.18 0.211875 11.155 0.228875C11.073 0.270875 11.005 0.337875 11.004 0.338875L4.698 6.08888L1.951 4.00488C1.832 3.91388 1.69 3.86987 1.548 3.86987C1.387 3.86987 1.226 3.92788 1.1 4.04288L0.219 4.84387C0.074 4.97587 0.001 5.15688 0.001 5.33687C0.001 5.51687 0.073 5.69688 0.218 5.82888L2.6 8.00088L0.217 10.1719C0.072 10.3039 0 10.4839 0 10.6639C0 10.8439 0.073 11.0249 0.218 11.1569L1.099 11.9579C1.226 12.0729 1.386 12.1309 1.547 12.1309C1.688 12.1309 1.83 12.0859 1.95 11.9959L4.697 9.91187L11.003 15.6619C11.003 15.6619 11.072 15.7299 11.155 15.7719C11.179 15.7889 11.353 15.9529 11.709 15.9529C11.855 15.9529 12.003 15.9209 12.141 15.8549L15.435 14.2709C15.781 14.1049 16.001 13.7539 16.001 13.3699V2.62888C16.001 2.24487 15.781 1.89488 15.435 1.72787L15.434 1.72887ZM7.217 7.99988L12.002 4.36987V11.6299L7.217 7.99988Z"
    );
    gMark.appendChild(pathMark);
    svg.appendChild(gMark);
    return svg;
  }

  function togglePalettePopover() {
    const existing = document.getElementById("prism-palette-popover");
    if (existing) {
      existing.remove();
      return;
    }
    const wb = document.querySelector(".monaco-workbench");
    if (!wb) return;
    syncSeamlessClass(wb);

    const pop = document.createElement("div");
    pop.id = "prism-palette-popover";
    pop.addEventListener("click", (e) => e.stopPropagation());

    // 0. Top 4-Color Glowing Ribbon
    const ribbon = document.createElement("div");
    ribbon.className = "pp-top-ribbon";
    pop.appendChild(ribbon);

    // 1. Luxury Header Bar (Clean: Studio title + Breathe, Roll, Mode, Close)
    const header = document.createElement("div");
    header.className = "pp-header";

    const titleWrap = document.createElement("div");
    titleWrap.className = "pp-title";
    titleWrap.appendChild(createStudioIconSvg(18));
    const titleText = document.createElement("span");
    titleText.textContent = "Gradient Studio";
    titleWrap.appendChild(titleText);

    const actions = document.createElement("div");
    actions.className = "pp-actions";

    const breatheBtn = document.createElement("button");
    breatheBtn.id = "pp-btn-breathe";
    breatheBtn.className = `pp-btn${isBreathingEnabled() ? " active" : ""}`;
    breatheBtn.textContent = "Breathe";
    breatheBtn.title = "Toggle Breathing Aurora Engine (Alt+Shift+B)";
    breatheBtn.addEventListener("click", () => toggleBreathing());

    const rollBtn = document.createElement("button");
    rollBtn.className = "pp-btn pp-btn-primary";
    rollBtn.appendChild(createCycleArrowsSvg(12));
    const rollText = document.createElement("span");
    rollText.textContent = "Roll";
    rollBtn.appendChild(rollText);
    rollBtn.title = "Roll random 4-color gradient (Alt+Shift+G)";
    rollBtn.addEventListener("click", () => {
      const targetPal = getActiveTargetPalette(activeComponent);
      const next = rollRandomPalette(targetPal ? targetPal.name : "");
      if (activeComponent !== "all") {
        setComponentPalette(activeComponent, next);
      } else {
        resetAllComponentCustomPalettes();
        applyPaletteToWorkbench(next);
      }
    });

    const nativeBtn = document.createElement("button");
    nativeBtn.id = "pp-btn-mode";
    nativeBtn.className = "pp-btn";
    nativeBtn.textContent = "Mode";
    nativeBtn.title = "Toggle Gradient On/Off or Cycle Prism Classic / Theme Native (Alt+Shift+0)";
    nativeBtn.addEventListener("click", () => {
      if (activeComponent !== "all") {
        toggleComponentEnabled(activeComponent);
      } else {
        toggleResetOrNative();
      }
    });

    const closeBtn = document.createElement("button");
    closeBtn.className = "pp-btn pp-btn-icon";
    closeBtn.textContent = "✕";
    closeBtn.title = "Close Studio (Esc)";
    closeBtn.addEventListener("click", () => pop.remove());

    actions.appendChild(breatheBtn);
    actions.appendChild(rollBtn);
    actions.appendChild(nativeBtn);
    actions.appendChild(closeBtn);
    header.appendChild(titleWrap);
    header.appendChild(actions);

    // 2. Intensity / Opacity Slider + Breathing Aurora + Component Selector Bar
    const intSec = document.createElement("div");
    intSec.className = "pp-section";

    const intRow = document.createElement("div");
    intRow.className = "pp-row";

    const intLabel = document.createElement("span");
    intLabel.style.cssText = "font-weight:700;font-size:11px;min-width:58px;";
    intLabel.textContent = "Intensity";

    const slider = document.createElement("input");
    slider.id = "pp-intensity-slider";
    slider.type = "range";
    slider.min = "40";
    slider.max = "180";
    slider.step = "5";
    slider.className = "pp-slider";
    slider.value = String(Math.round(getIntensity() * 100));

    const valSpan = document.createElement("span");
    valSpan.id = "pp-intensity-val";
    valSpan.style.cssText =
      "font-size:11px;font-weight:700;min-width:38px;text-align:right;";
    valSpan.textContent = `${Math.round(getIntensity() * 100)}%`;

    slider.addEventListener("input", () => {
      setIntensity(parseInt(slider.value, 10) / 100);
    });

    const seamlessBtn = document.createElement("button");
    seamlessBtn.id = "pp-btn-seamless";
    seamlessBtn.className = `pp-btn${isSeamlessEnabled() ? " active" : ""}`;
    seamlessBtn.textContent = isSeamlessEnabled() ? "Seamless: ON" : "Seamless: OFF";
    seamlessBtn.title =
      "Toggle Seamless Full-Window Gradient vs Per-Component Individual Gradients with Terminal Separator Strip (Alt+Shift+S)";
    seamlessBtn.addEventListener("click", () => toggleSeamlessMode());

    intRow.appendChild(intLabel);
    intRow.appendChild(slider);
    intRow.appendChild(valSpan);
    intRow.appendChild(seamlessBtn);
    intSec.appendChild(intRow);

    // 2B. Breathing Aurora Multi-Mode Studio Drawer
    const breatheDrawer = document.createElement("div");
    breatheDrawer.className = "pp-breathe-drawer";

    const bdHeader = document.createElement("div");
    bdHeader.className = "pp-breathe-header";

    const bdTitle = document.createElement("span");
    bdTitle.className = "pp-breathe-title";
    bdTitle.textContent = "Breathing Aurora";

    const bdStatus = document.createElement("span");
    bdStatus.id = "pp-breathe-status";
    bdStatus.style.cssText =
      "font-size:9.5px;font-weight:700;letter-spacing:0.4px;cursor:pointer;";
    bdStatus.textContent = isBreathingEnabled() ? "ACTIVE" : "PAUSED";
    bdStatus.addEventListener("click", () => toggleBreathing());

    bdHeader.appendChild(bdTitle);
    bdHeader.appendChild(bdStatus);

    const cfg = getBreatheConfig();

    const modesRow = document.createElement("div");
    modesRow.className = "pp-chip-group";
    const modeDefs = [
      {
        key: "wave",
        label: "Full Wave",
        tip: "Rotate gradient angles & focal corners across Editor, Bars, Explorer, Chat & Terminal",
      },
      {
        key: "pulse",
        label: "Pulse",
        tip: "Inhale / exhale gradient intensity like a calm heartbeat",
      },
      {
        key: "shimmer",
        label: "Shimmer",
        tip: "Smoothly rotate & flow the 4 color stops through each other",
      },
      {
        key: "morph",
        label: "Auto-Morph",
        tip: "Slowly cross-fade RGB stops into new palettes automatically",
      },
    ];

    modeDefs.forEach((m) => {
      const chip = document.createElement("button");
      chip.id = `pp-breathe-mode-${m.key}`;
      chip.className = `pp-chip${cfg[m.key] ? " active" : ""}`;
      chip.textContent = m.label;
      chip.title = m.tip;
      chip.addEventListener("click", () => {
        const cur = getBreatheConfig();
        saveBreatheConfig({ [m.key]: !cur[m.key] });
        if (!isBreathingEnabled()) {
          setBreathingEnabled(true);
        }
      });
      modesRow.appendChild(chip);
    });

    const speedRow = document.createElement("div");
    speedRow.className = "pp-row";

    const speedLabel = document.createElement("span");
    speedLabel.style.cssText = "font-size:10.5px;font-weight:600;min-width:58px;";
    speedLabel.textContent = "Speed";

    const speedSlider = document.createElement("input");
    speedSlider.id = "pp-breathe-speed-slider";
    speedSlider.type = "range";
    speedSlider.min = "25";
    speedSlider.max = "250";
    speedSlider.step = "5";
    speedSlider.className = "pp-slider";
    speedSlider.value = String(cfg.speedPct || 100);

    const speedValSpan = document.createElement("span");
    speedValSpan.id = "pp-breathe-speed-val";
    speedValSpan.style.cssText =
      "font-size:10.5px;font-weight:700;min-width:38px;text-align:right;";
    speedValSpan.textContent = `${cfg.speedPct || 100}%`;

    speedSlider.addEventListener("input", () => {
      const nextSpd = parseInt(speedSlider.value, 10);
      speedValSpan.textContent = `${nextSpd}%`;
      saveBreatheConfig({ speedPct: nextSpd });
      if (!isBreathingEnabled()) {
        setBreathingEnabled(true);
      }
    });

    speedRow.appendChild(speedLabel);
    speedRow.appendChild(speedSlider);
    speedRow.appendChild(speedValSpan);

    breatheDrawer.appendChild(bdHeader);
    breatheDrawer.appendChild(modesRow);
    breatheDrawer.appendChild(speedRow);
    intSec.appendChild(breatheDrawer);

    // 2C. Per-Component Selector & Gradient On/Off Bar
    const compBar = document.createElement("div");
    compBar.className = "pp-comp-bar";

    const allPill = document.createElement("button");
    allPill.id = "pp-comp-all";
    allPill.className = `pp-comp-pill${activeComponent === "all" ? " active" : ""}`;
    allPill.title =
      "All Components\n• Click to select All\n• Click dot (or click All again) to toggle Seamless Full-Window Gradient vs Per-Component Individual Gradients";
    const allDot = document.createElement("span");
    allDot.id = "pp-comp-dot-all";
    allDot.className = `pp-comp-dot${isSeamlessEnabled() ? "" : " off"}`;
    allDot.title = "Click to toggle Seamless Mode ON / OFF";
    allDot.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleSeamlessMode();
    });
    const allLbl = document.createElement("span");
    allLbl.textContent = "All";
    allPill.appendChild(allDot);
    allPill.appendChild(allLbl);
    allPill.addEventListener("click", () => {
      if (activeComponent === "all") {
        toggleSeamlessMode();
      } else {
        activeComponent = "all";
        renderPaletteGrid();
        refreshPopoverHeaderAndIntensity();
      }
    });
    compBar.appendChild(allPill);

    COMPONENT_DEFS.forEach((def) => {
      const pill = document.createElement("button");
      pill.id = `pp-comp-${def.key}`;
      pill.className = `pp-comp-pill${activeComponent === def.key ? " active" : ""}`;
      pill.title = `${def.tip}\n• Click pill to customize ${def.label} gradient color\n• Click dot (or click selected pill again) to turn ${def.label} gradient ON / OFF`;

      const dot = document.createElement("span");
      dot.id = `pp-comp-dot-${def.key}`;
      dot.className = "pp-comp-dot";
      dot.title = `Click to toggle ${def.label} gradient ON / OFF`;
      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleComponentEnabled(def.key);
      });

      const lbl = document.createElement("span");
      lbl.textContent = def.label;

      pill.appendChild(dot);
      pill.appendChild(lbl);

      pill.addEventListener("click", () => {
        if (activeComponent === def.key) {
          toggleComponentEnabled(def.key);
        } else {
          activeComponent = def.key;
          renderPaletteGrid();
          refreshPopoverHeaderAndIntensity();
        }
      });

      compBar.appendChild(pill);
    });
    intSec.appendChild(compBar);

    // 3. Category Filter Tabs
    const tabsBar = document.createElement("div");
    tabsBar.id = "prism-popover-tabs";
    tabsBar.className = "pp-tabs";
    const categories = [
      { id: "all", label: "All" },
      { id: "favs", label: "Favs" },
      { id: "prism", label: "Prism" },
      { id: "pastel", label: "Pastel" },
      { id: "pure", label: "Pure" },
      { id: "custom", label: "Custom" },
    ];
    categories.forEach((cat) => {
      const t = document.createElement("button");
      t.setAttribute("data-cat", cat.id);
      t.className = `pp-tab${activeCategory === cat.id ? " active" : ""}`;
      t.textContent = cat.label;
      t.addEventListener("click", () => {
        activeCategory = cat.id;
        renderPaletteGrid();
      });
      tabsBar.appendChild(t);
    });

    // 4. Scrollable 2-Column Palette Grid
    const grid = document.createElement("div");
    grid.id = "prism-popover-grid";
    grid.className = "pp-grid";

    // 5. Custom 4-Stop Gradient Builder Footer with Glowing Orbs & Live Preview Bar
    const builder = document.createElement("div");
    builder.className = "pp-builder";

    const bHead = document.createElement("div");
    bHead.className = "pp-builder-head";

    const bTitle = document.createElement("div");
    bTitle.id = "pp-builder-title";
    bTitle.className = "pp-builder-title";
    bTitle.textContent = "Pick your own color";

    bHead.appendChild(bTitle);

    const targetPal = getActiveTargetPalette(activeComponent);
    const initialStops =
      targetPal && targetPal.stops && targetPal.stops.length === 4
        ? targetPal.stops
        : CURATED_PALETTES[0].stops;
    const initHexes = initialStops.map(rgbToHex);

    const previewBar = document.createElement("div");
    previewBar.id = "pp-builder-preview-bar";
    previewBar.className = "pp-builder-preview";
    previewBar.style.background = `linear-gradient(90deg, ${initHexes[0]} 0%, ${initHexes[1]} 33%, ${initHexes[2]} 66%, ${initHexes[3]} 100%)`;

    const orbsRow = document.createElement("div");
    orbsRow.className = "pp-orbs-row";

    const colorInputs = [];
    for (let i = 0; i < 4; i++) {
      const ci = document.createElement("input");
      ci.type = "color";
      ci.id = `pp-stop-${i}`;
      ci.className = "pp-color-orb";
      ci.value = initHexes[i];
      ci.title = `Pick Color ${i + 1} (${initHexes[i]})`;

      ci.addEventListener("input", () => {
        ci.title = `Pick Color ${i + 1} (${ci.value.toUpperCase()})`;
        const liveStops = colorInputs.map((inp) => hexToRgb(inp.value));
        const customName = (nameInput.value || "").trim() || "Custom Live";
        const customPal = {
          name: customName,
          stops: liveStops,
          angles: { base: 135, bar: 90, side: 165, panel: 105 },
        };
        if (activeComponent !== "all") {
          setComponentPalette(activeComponent, customPal);
        } else {
          resetAllComponentCustomPalettes();
          applyPaletteToWorkbench(customPal);
        }
      });

      colorInputs.push(ci);
      orbsRow.appendChild(ci);
    }

    const nameInput = document.createElement("input");
    nameInput.id = "pp-custom-name-input";
    nameInput.type = "text";
    nameInput.className = "pp-text-input";
    nameInput.placeholder = "Name or paste 4 #hex colors...";
    nameInput.addEventListener("input", () => {
      const parsed = parseFourHexStops(nameInput.value);
      if (parsed) {
        nameInput.value = "";
        const hexPal = {
          name: "Custom Hex",
          stops: parsed,
          angles: { base: 135, bar: 90, side: 165, panel: 105 },
        };
        if (activeComponent !== "all") {
          setComponentPalette(activeComponent, hexPal);
        } else {
          resetAllComponentCustomPalettes();
          applyPaletteToWorkbench(hexPal);
        }
      }
    });

    const saveBtn = document.createElement("button");
    saveBtn.className = "pp-btn pp-btn-primary";
    saveBtn.textContent = "+ Save";
    saveBtn.title = "Save or Update Custom Palette";
    saveBtn.addEventListener("click", () => {
      const stops = colorInputs.map((inp) => hexToRgb(inp.value));
      const cname =
        (nameInput.value || "").trim() || `Custom #${getCustomPalettes().length + 1}`;
      nameInput.value = "";
      saveCustomPalette(cname, stops);
    });

    const saveRow = document.createElement("div");
    saveRow.className = "pp-row";

    saveRow.appendChild(nameInput);
    saveRow.appendChild(saveBtn);

    builder.appendChild(bHead);
    builder.appendChild(previewBar);
    builder.appendChild(orbsRow);
    builder.appendChild(saveRow);

    pop.appendChild(header);
    pop.appendChild(intSec);
    pop.appendChild(tabsBar);
    pop.appendChild(grid);
    pop.appendChild(builder);
    wb.appendChild(pop);

    renderPaletteGrid();
    refreshPopoverHeaderAndIntensity();
  }

  // Close popover when clicking outside or pressing Escape
  document.addEventListener("click", (e) => {
    const pop = document.getElementById("prism-palette-popover");
    if (!pop) return;
    const pill = document.getElementById("prism-randomizer-item");
    if (pop.contains(e.target) || (pill && pill.contains(e.target))) return;
    pop.remove();
  });

  function mountStatusBarPill() {
    if (document.getElementById("prism-randomizer-item")) return true;
    const rightItems = document.querySelector(".part.statusbar .right-items");
    if (!rightItems) return false;

    const item = document.createElement("div");
    item.id = "prism-randomizer-item";
    item.className = "statusbar-item right";
    item.style.cssText =
      "display:inline-flex;align-items:center;gap:4px;user-select:none;padding:0 6px;height:100%;";

    const pill = document.createElement("a");
    pill.id = "prism-randomizer-roll";
    pill.className = "statusbar-item-label";
    pill.style.cssText =
      "display:inline-flex;align-items:center;gap:6px;padding:1px 8px;border-radius:999px;font-size:11.5px;line-height:18px;cursor:pointer;";
    pill.title =
      "↻ Gradient Themes Randomizer\n" +
      "• Left-Click (or Alt+Shift+G): Roll random gradient\n" +
      "• Right-Click / Shift+Click (or Alt+Shift+0): Cycle Prism Classic / Theme Native (Off)\n" +
      "• Cmd/Ctrl+Click: Toggle Auto-Randomize on Startup";

    const icon = document.createElement("span");
    icon.style.cssText = "display:inline-flex;align-items:center;justify-content:center;";
    icon.appendChild(createCycleArrowsSvg(13));

    const swatch = document.createElement("span");
    swatch.id = "prism-randomizer-swatch";
    swatch.style.cssText =
      "display:inline-block;width:34px;height:7.5px;border-radius:999px;box-shadow:inset 0 0 0 1px rgba(128,128,128,0.28);background:linear-gradient(90deg,#EA4335 0%,#FBBC04 33%,#34A853 66%,#4285F4 100%);";

    const sbBreatheBtn = document.createElement("span");
    sbBreatheBtn.id = "prism-randomizer-breathe";
    sbBreatheBtn.className = isBreathingEnabled() ? "active" : "";
    sbBreatheBtn.textContent = "Breathe";
    sbBreatheBtn.title = "Toggle Breathing Aurora Animation (Alt+Shift+B)";
    sbBreatheBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleBreathing();
    });

    const studioBtn = document.createElement("span");
    studioBtn.id = "prism-randomizer-chevron";
    studioBtn.title = "Open Gradient Studio & Color Picker (Alt+Shift+P)";
    studioBtn.appendChild(createStudioIconSvg(14));
    const studioBtnText = document.createElement("span");
    studioBtnText.textContent = "Studio ▴";
    studioBtn.appendChild(studioBtnText);
    studioBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      togglePalettePopover();
    });

    pill.appendChild(icon);
    pill.appendChild(swatch);
    item.appendChild(pill);
    item.appendChild(sbBreatheBtn);
    item.appendChild(studioBtn);

    pill.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.altKey) {
        togglePalettePopover();
        return;
      }
      if (e.metaKey || e.ctrlKey) {
        const nextAuto = localStorage.getItem(STORAGE_KEY_AUTO) !== "true";
        localStorage.setItem(STORAGE_KEY_AUTO, String(nextAuto));
        const saved = getSavedPalette();
        updateStatusBarPill(
          saved ? saved.name : "Prism Classic",
          saved ? saved.stops : null,
          saved && saved.isNativeOff
        );
        return;
      }
      if (e.shiftKey) {
        toggleResetOrNative();
        return;
      }
      const saved = getSavedPalette();
      const next = rollRandomPalette(saved ? saved.name : "");
      applyPaletteToWorkbench(next);
    });

    pill.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleResetOrNative();
    });

    rightItems.insertBefore(item, rightItems.firstChild);

    // Restore saved or auto-roll on startup
    const autoOn = localStorage.getItem(STORAGE_KEY_AUTO) === "true";
    if (autoOn) {
      const next = rollRandomPalette("");
      applyPaletteToWorkbench(next);
    } else {
      const saved = getSavedPalette();
      if (saved) {
        applyPaletteToWorkbench(saved);
      } else {
        applyPaletteToWorkbench(null);
      }
    }
    startOrStopBreathingAurora();
    return true;
  }

  function getSavedPalette() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_STATE);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  // Universal DOM Selection Gradient Overlay (AI Chat, Markdown, Hover Popups, Settings, etc.)
  function getOrCreateDomSelectionLayer() {
    let layer = document.getElementById("prism-dom-selection-layer");
    if (!layer) {
      const wb = document.querySelector(".monaco-workbench");
      if (!wb) return null;
      layer = document.createElement("div");
      layer.id = "prism-dom-selection-layer";
      wb.appendChild(layer);
    }
    return layer;
  }

  function clearDomSelectionOverlay() {
    const layer = document.getElementById("prism-dom-selection-layer");
    if (layer && layer.firstChild) {
      layer.textContent = "";
    }
    const wb = document.querySelector(".monaco-workbench.prism-dom-sel-active");
    if (wb) wb.classList.remove("prism-dom-sel-active");
  }

  let selRafId = 0;
  function scheduleDomSelectionUpdate() {
    if (selRafId) return;
    selRafId = requestAnimationFrame(() => {
      selRafId = 0;
      renderDomSelectionGradient();
    });
  }

  function renderDomSelectionGradient() {
    const sel = window.getSelection ? window.getSelection() : null;
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
      clearDomSelectionOverlay();
      return;
    }

    const saved = getSavedPalette();
    const comps = getComponentsConfig();
    if ((saved && saved.isNativeOff) || !comps.selection || !comps.selection.enabled) {
      clearDomSelectionOverlay();
      return;
    }

    const anchorEl =
      sel.anchorNode && sel.anchorNode.nodeType === 1
        ? sel.anchorNode
        : sel.anchorNode && sel.anchorNode.parentElement;
    if (
      !anchorEl ||
      anchorEl.closest(".monaco-editor, .xterm, input, textarea, .monaco-inputbox")
    ) {
      clearDomSelectionOverlay();
      return;
    }

    const layer = getOrCreateDomSelectionLayer();
    const wb = document.querySelector(".monaco-workbench");
    if (!layer || !wb) return;

    const rects = [];
    for (let i = 0; i < sel.rangeCount; i++) {
      const range = sel.getRangeAt(i);
      const clientRects = range.getClientRects();
      for (let j = 0; j < clientRects.length; j++) {
        const r = clientRects[j];
        if (r.width > 1 && r.height > 2) {
          rects.push(r);
        }
      }
    }

    if (rects.length === 0 || rects.length > 250) {
      clearDomSelectionOverlay();
      return;
    }

    wb.classList.add("prism-dom-sel-active");
    layer.textContent = "";
    const frag = document.createDocumentFragment();
    for (let i = 0; i < rects.length; i++) {
      const r = rects[i];
      const div = document.createElement("div");
      div.className = "prism-dom-sel-rect";
      div.style.left = `${r.left}px`;
      div.style.top = `${r.top}px`;
      div.style.width = `${r.width}px`;
      div.style.height = `${r.height}px`;
      frag.appendChild(div);
    }
    layer.appendChild(frag);
  }

  document.addEventListener("selectionchange", scheduleDomSelectionUpdate, {
    capture: true,
    passive: true,
  });
  window.addEventListener(
    "scroll",
    (e) => {
      if (e && e.target && e.target.closest && e.target.closest("#prism-palette-popover")) {
        return;
      }
      scheduleDomSelectionUpdate();
    },
    { capture: true, passive: true }
  );
  window.addEventListener("resize", scheduleDomSelectionUpdate, {
    capture: true,
    passive: true,
  });
  window.addEventListener(
    "mousedown",
    () => {
      cachedBreathingTargetsTs = 0;
    },
    { capture: true, passive: true }
  );
  window.addEventListener(
    "mouseup",
    () => {
      cachedBreathingTargetsTs = 0;
    },
    { capture: true, passive: true }
  );
  window.addEventListener(
    "keydown",
    () => {
      cachedBreathingTargetsTs = 0;
    },
    { capture: true, passive: true }
  );

  // Pause Breathing Aurora in unfocused / background VS Code windows so only the active
  // window animates (0% background CPU and 0 MB/hr Oilpan CSSValue heap growth).
  window.addEventListener("focus", () => {
    cachedComponentsConfig = null;
    startOrStopBreathingAurora();
  });
  window.addEventListener("blur", () => {
    startOrStopBreathingAurora();
  });
  document.addEventListener("visibilitychange", () => {
    startOrStopBreathingAurora();
  });

  // Direct-Stream Terminal IME Handler (Disables xterm's .composition-view buffer for Vietnamese IME):
  // Intercepts IME composition events on .xterm-helper-textarea in capture phase and streams
  // character/tone updates (\x7f backspace + code points) directly to xterm's PTY in real time.
  const xtermImeMap = new WeakMap();
  const isXtermTa = (el) =>
    Boolean(el && el.tagName === "TEXTAREA" && el.classList && el.classList.contains("xterm-helper-textarea"));

  function diffIme(prevStr, nextStr) {
    const a = Array.from(prevStr || "");
    const b = Array.from(nextStr || "");
    let i = 0;
    while (i < a.length && i < b.length && a[i] === b[i]) i++;
    return (a.length > i ? "\x7f".repeat(a.length - i) : "") + b.slice(i).join("");
  }

  function sendToXterm(ta, data) {
    if (!ta || !data) return;
    const ev = new InputEvent("input", { data, inputType: "insertText", composed: false });
    ev._prismDirect = true;
    ta.dispatchEvent(ev);
  }

  window.addEventListener(
    "compositionstart",
    (e) => {
      const ta = e.target;
      if (!isXtermTa(ta)) return;
      e.stopImmediatePropagation();
      const s = Math.min(ta.selectionStart ?? ta.value.length, ta.selectionEnd ?? ta.value.length);
      const en = Math.max(ta.selectionStart ?? ta.value.length, ta.selectionEnd ?? s);
      xtermImeMap.set(ta, { composing: true, prev: "", start: s, suffix: ta.value.substring(en), handled: true });
    },
    true
  );

  window.addEventListener(
    "compositionupdate",
    (e) => {
      const ta = e.target;
      if (!isXtermTa(ta)) return;
      e.stopImmediatePropagation();
      let st = xtermImeMap.get(ta);
      if (!st || !st.composing) {
        st = { composing: true, prev: "", start: ta.selectionStart ?? ta.value.length, suffix: "", handled: true };
        xtermImeMap.set(ta, st);
      }
      st.handled = true;
      const next = e.data || "";
      sendToXterm(ta, diffIme(st.prev, next));
      st.prev = next;
    },
    true
  );

  window.addEventListener(
    "compositionend",
    (e) => {
      const ta = e.target;
      if (!isXtermTa(ta)) return;
      e.stopImmediatePropagation();
      const st = xtermImeMap.get(ta);
      if (!st) return;
      st.composing = false;
      const endData = typeof e.data === "string" ? e.data : st.prev;
      sendToXterm(ta, diffIme(st.prev, endData));
      st.prev = endData;
      const { start: snapStart, suffix: snapSuffix, prev: snapPrev } = st;
      setTimeout(() => {
        const cur = xtermImeMap.get(ta);
        if (cur && cur.composing) return;
        const val = ta.value || "";
        const valEnd = snapSuffix.length > 0 && val.endsWith(snapSuffix) ? val.length - snapSuffix.length : val.length;
        const actual = val.substring(snapStart, Math.max(snapStart, valEnd));
        if (actual.length > snapPrev.length && actual.startsWith(snapPrev)) {
          sendToXterm(ta, actual.substring(snapPrev.length));
        }
        ta.value = "";
        xtermImeMap.delete(ta);
      }, 0);
    },
    true
  );

  window.addEventListener(
    "input",
    (e) => {
      const ta = e.target;
      if (isXtermTa(ta) && !e._prismDirect && (e.isComposing || xtermImeMap.has(ta) || (e.inputType && e.inputType.includes("Composition")))) {
        e.stopImmediatePropagation();
      }
    },
    true
  );

  // Global keyboard shortcuts & terminal IME keyCode 229 guard:
  //   Alt + Shift + G -> Roll new random gradient
  //   Alt + Shift + Z -> Undo / Previous rolled gradient
  //   Alt + Shift + R -> Rotate 4 color stops around corners
  //   Alt + Shift + 0 -> Cycle Prism Classic / Theme Native (Off)
  //   Alt + Shift + P -> Toggle Gradient Studio Popover
  //   Alt + Shift + B -> Toggle 🌊 Breathing Aurora animation
  //   Alt + Shift + Up / Down -> Increase / decrease Gradient Intensity (±15%)
  window.addEventListener(
    "keydown",
    (e) => {
      const ta = e.target;
      if (isXtermTa(ta)) {
        const st = xtermImeMap.get(ta);
        if (st && st.composing) {
          if (e.keyCode === 229 || e.keyCode === 20 || (e.keyCode >= 16 && e.keyCode <= 18)) {
            e.stopImmediatePropagation();
            return;
          }
          st.composing = false;
          ta.value = "";
          xtermImeMap.delete(ta);
        } else if (e.keyCode === 229) {
          e.stopImmediatePropagation();
          const oldVal = ta.value || "";
          setTimeout(() => {
            const cur = xtermImeMap.get(ta);
            if (cur && (cur.composing || cur.handled)) return;
            const newVal = ta.value || "";
            if (newVal.length > oldVal.length) {
              sendToXterm(ta, newVal.slice(oldVal.length));
              ta.value = "";
            } else if (newVal.length < oldVal.length) {
              sendToXterm(ta, "\x7f");
            }
          }, 0);
          return;
        }
      }
      if (e.key === "Escape") {
        const pop = document.getElementById("prism-palette-popover");
        if (pop) {
          pop.remove();
        }
        return;
      }
      if (!e.altKey || !e.shiftKey) return;
      if (e.code === "KeyG" || e.key === "G" || e.key === "g") {
        e.preventDefault();
        const saved = getSavedPalette();
        const next = rollRandomPalette(saved ? saved.name : "");
        applyPaletteToWorkbench(next);
      } else if (e.code === "KeyZ" || e.key === "Z" || e.key === "z") {
        e.preventDefault();
        undoPreviousRoll();
      } else if (e.code === "KeyR" || e.key === "R" || e.key === "r") {
        e.preventDefault();
        rotateActiveStops(false);
      } else if (e.code === "Digit0" || e.key === ")" || e.key === "0") {
        e.preventDefault();
        toggleResetOrNative();
      } else if (e.code === "KeyP" || e.key === "P" || e.key === "p") {
        e.preventDefault();
        togglePalettePopover();
      } else if (e.code === "KeyB" || e.key === "B" || e.key === "b") {
        e.preventDefault();
        toggleBreathing();
      } else if (e.code === "KeyS" || e.key === "S" || e.key === "s") {
        e.preventDefault();
        toggleSeamlessMode();
      } else if (e.code === "KeyC" || e.key === "C" || e.key === "c") {
        e.preventDefault();
        toggleSyntaxMode();
      } else if (e.code === "ArrowUp" || e.key === "ArrowUp") {
        e.preventDefault();
        setIntensity(getIntensity() + 0.15);
      } else if (e.code === "ArrowDown" || e.key === "ArrowDown") {
        e.preventDefault();
        setIntensity(getIntensity() - 0.15);
      }
    },
    true
  );

  // Self-healing mount & palette keeper:
  // Fast poll during initial workbench boot, then lightweight 1.5s heartbeat
  // so Status Bar rebuilds or layout resets never lose the 🎲 pill or active gradient.
  function ensureMountedAndSynced() {
    const existing = document.getElementById("prism-randomizer-item");
    if (!existing || !existing.isConnected) {
      mountStatusBarPill();
      return;
    }
    const wb = document.querySelector(".monaco-workbench");
    if (!wb) return;
    syncSeamlessClass(wb);
    syncSyntaxModeClass(wb);
    const saved = getSavedPalette();
    if (saved) {
      if (saved.isNativeOff && wb.style.getPropertyValue("--g-base") !== "none") {
        applyPaletteToWorkbench(saved, { skipHistory: true });
      } else if (!saved.isNativeOff && saved.stops && !wb.style.getPropertyValue("--g-base")) {
        applyPaletteToWorkbench(saved, { skipHistory: true });
      }
    } else if (!wb.style.getPropertyValue("--g-editor-mesh")) {
      applyPaletteToWorkbench(null, { skipHistory: true });
    }
    if (!wb.classList.contains("prism-no-syntax")) {
      ensureSyntaxStyleSheet(wb, false);
    }
  }

  let fastTicks = 0;
  const fastTimer = setInterval(() => {
    fastTicks++;
    ensureMountedAndSynced();
    if (fastTicks >= 40) {
      clearInterval(fastTimer);
    }
  }, 350);

  setInterval(ensureMountedAndSynced, 1500);
})();
