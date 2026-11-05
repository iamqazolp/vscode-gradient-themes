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

  function rgba([r, g, b], alpha) {
    return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
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

  function rollRandomPalette(currentName) {
    // 80% chance curated palette (30 curated presets), 20% chance procedural HSL harmony
    if (Math.random() < 0.8) {
      const candidates = CURATED_PALETTES.filter(
        (p) => !p.isDefault && p.name !== currentName && !recentNames.includes(p.name)
      );
      const pool =
        candidates.length > 0
          ? candidates
          : CURATED_PALETTES.filter((p) => !p.isDefault && p.name !== currentName);
      const picked = pool[randInt(0, pool.length - 1)];
      recentNames.push(picked.name);
      if (recentNames.length > 8) {
        recentNames.shift();
      }
      // Shuffle stop order occasionally for extra variety
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

  function applyPaletteToWorkbench(palette) {
    const wb = document.querySelector(".monaco-workbench");
    if (!wb) return;

    if (palette && palette.isNativeOff) {
      // Turn off the 4-color overlay so the pure single-color theme shines through natively
      ["--g-r1", "--g-r2", "--g-r3", "--g-r4"].forEach((prop) =>
        wb.style.setProperty(prop, "transparent")
      );
      ["--g-base", "--g-bar", "--g-side", "--g-panel"].forEach((prop) =>
        wb.style.setProperty(prop, "none")
      );
      wb.style.setProperty("--g-border", "var(--vscode-focusBorder, #3B82F6)");
      try {
        localStorage.setItem(
          STORAGE_KEY_STATE,
          JSON.stringify({ name: "Theme Native", isNativeOff: true })
        );
      } catch (_) {}
      updateStatusBarPill("Theme Native", null, true);
      return;
    }

    if (!palette || palette.isDefault) {
      // Clear inline overrides so classic rainbow CSS takes over
      [
        "--g-r1",
        "--g-r2",
        "--g-r3",
        "--g-r4",
        "--g-base",
        "--g-bar",
        "--g-side",
        "--g-panel",
        "--g-border",
      ].forEach((prop) => wb.style.removeProperty(prop));
      localStorage.removeItem(STORAGE_KEY_STATE);
      updateStatusBarPill("Prism Classic");
      return;
    }

    const [c1, c2, c3, c4] = palette.stops;
    const angles = palette.angles || {
      base: 135,
      bar: 90,
      side: 165,
      panel: 105,
    };

    wb.style.setProperty("--g-r1", rgba(c1, 0.18));
    wb.style.setProperty("--g-r2", rgba(c2, 0.18));
    wb.style.setProperty("--g-r3", rgba(c3, 0.18));
    wb.style.setProperty("--g-r4", rgba(c4, 0.22));

    wb.style.setProperty(
      "--g-base",
      `linear-gradient(${angles.base}deg, ${rgba(c1, 0.14)} 0%, ${rgba(
        c2,
        0.11
      )} 33%, ${rgba(c3, 0.11)} 66%, ${rgba(c4, 0.16)} 100%)`
    );

    wb.style.setProperty(
      "--g-bar",
      `linear-gradient(${angles.bar}deg, ${rgba(c1, 0.20)} 0%, ${rgba(
        c2,
        0.15
      )} 33%, ${rgba(c3, 0.15)} 66%, ${rgba(c4, 0.22)} 100%)`
    );

    wb.style.setProperty(
      "--g-side",
      `linear-gradient(${angles.side}deg, ${rgba(c1, 0.16)} 0%, ${rgba(
        c2,
        0.13
      )} 33%, ${rgba(c3, 0.13)} 66%, ${rgba(c4, 0.16)} 100%)`
    );

    wb.style.setProperty(
      "--g-panel",
      `linear-gradient(${angles.panel}deg, ${rgba(c2, 0.07)} 0%, ${rgba(
        c3,
        0.13
      )} 50%, ${rgba(c4, 0.18)} 100%)`
    );

    wb.style.setProperty(
      "--g-border",
      `linear-gradient(90deg, ${rgbToHex(c1)} 0%, ${rgbToHex(
        c2
      )} 33%, ${rgbToHex(c3)} 66%, ${rgbToHex(c4)} 100%)`
    );

    try {
      localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(palette));
    } catch (_) {}

    updateStatusBarPill(palette.name, palette.stops);
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
    const labelEl = document.getElementById("prism-randomizer-label");
    const swatchEl = document.getElementById("prism-randomizer-swatch");
    if (!labelEl) return;

    const autoOn = localStorage.getItem(STORAGE_KEY_AUTO) === "true";
    labelEl.textContent = `${name}${autoOn ? " • Auto" : ""}`;

    if (swatchEl) {
      if (isNativeOff) {
        swatchEl.style.background = "var(--vscode-focusBorder, #64748B)";
      } else if (stops && stops.length === 4) {
        const hexes = stops.map(rgbToHex);
        swatchEl.style.background = `linear-gradient(90deg, ${hexes[0]}, ${hexes[1]}, ${hexes[2]}, ${hexes[3]})`;
      } else {
        swatchEl.style.background =
          "linear-gradient(90deg, #EA4335, #FBBC04, #34A853, #4285F4)";
      }
    }
  }

  function mountStatusBarPill() {
    if (document.getElementById("prism-randomizer-item")) return true;
    const rightItems = document.querySelector(".part.statusbar .right-items");
    if (!rightItems) return false;

    const item = document.createElement("div");
    item.id = "prism-randomizer-item";
    item.className = "statusbar-item right";
    item.style.cssText =
      "display:inline-flex;align-items:center;cursor:pointer;user-select:none;padding:0 6px;height:100%;";
    item.title =
      "🎲 Gradient Themes Randomizer\n" +
      "• Left-Click (or Alt+Shift+G): Roll random gradient\n" +
      "• Right-Click / Shift+Click (or Alt+Shift+0): Cycle Prism Classic / Theme Native (Off)\n" +
      "• Cmd/Ctrl+Click: Toggle Auto-Randomize on Startup";

    const pill = document.createElement("a");
    pill.className = "statusbar-item-label";
    pill.style.cssText =
      "display:inline-flex;align-items:center;gap:5px;padding:1px 7px;border-radius:99px;font-size:11.5px;line-height:18px;";

    const icon = document.createElement("span");
    icon.textContent = "🎲";
    icon.style.fontSize = "12px";

    const swatch = document.createElement("span");
    swatch.id = "prism-randomizer-swatch";
    swatch.style.cssText =
      "display:inline-block;width:18px;height:6px;border-radius:99px;background:linear-gradient(90deg,#EA4335,#FBBC04,#34A853,#4285F4);";

    const label = document.createElement("span");
    label.id = "prism-randomizer-label";
    label.textContent = "Prism Classic";

    pill.appendChild(icon);
    pill.appendChild(swatch);
    pill.appendChild(label);
    item.appendChild(pill);

    item.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
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

    item.addEventListener("contextmenu", (e) => {
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
        updateStatusBarPill("Prism Classic", null);
      }
    }
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

  // Global keyboard shortcuts:
  //   Alt + Shift + G -> Roll new random gradient
  //   Alt + Shift + 0 -> Cycle Prism Classic / Theme Native (Off)
  window.addEventListener(
    "keydown",
    (e) => {
      if (e.altKey && e.shiftKey && (e.code === "KeyG" || e.key === "G" || e.key === "g")) {
        e.preventDefault();
        const saved = getSavedPalette();
        const next = rollRandomPalette(saved ? saved.name : "");
        applyPaletteToWorkbench(next);
      } else if (e.altKey && e.shiftKey && (e.code === "Digit0" || e.key === ")" || e.key === "0")) {
        e.preventDefault();
        toggleResetOrNative();
      }
    },
    true
  );

  // Poll until workbench & statusbar are mounted
  let attempts = 0;
  const timer = setInterval(() => {
    attempts++;
    if (mountStatusBarPill() || attempts > 60) {
      clearInterval(timer);
    }
  }, 500);
})();
