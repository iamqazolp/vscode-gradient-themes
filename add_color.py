#!/usr/bin/env python3
"""
Standardized Color & Palette Generator for VS Code Gradient Themes.

Automates the two color workflows in this repository:
  1. Single-Color Glacial Theme Pair (Light + Dark):
     Derives a complete 27-token Light (`7%–22%` Frost) + 27-token Dark (`Polar Night`)
     theme pair from a single seed hex color (`--color "#06B6D4"`) or hue (`--hue 189`),
     verifies WCAG contrast ratios and 6/8-digit hex formatting, saves to
     `palettes/custom_themes.json`, and rebuilds `themes/*.json` + `package.json`.

  2. 4-Color Status Bar Randomizer Palette (`🎲`):
     Validates 4 hex stops (`--stops "#06B6D4,#10B981,#3B82F6,#8B5CF6"`), shows their
     `7%–22%` translucent CSS values, and injects the palette into `CURATED_PALETTES`
     inside `js/gradient-randomizer.js`.

Usage Examples:
  python3 add_color.py list
  python3 add_color.py theme --name "Pure Cyan" --color "#06B6D4" --dry-run
  python3 add_color.py theme --name "Pure Cyan" --color "#06B6D4"
  python3 add_color.py randomizer --name "Cyber Mint" --stops "#06B6D4,#10B981,#3B82F6,#8B5CF6"
  python3 add_color.py remove-theme --name "Pure Cyan"
  python3 add_color.py remove-randomizer --name "Cyber Mint"
"""

import argparse
import colorsys
import json
import re
import sys
from pathlib import Path

REPO_DIR = Path(__file__).resolve().parent
CUSTOM_THEMES_JSON = REPO_DIR / "palettes" / "custom_themes.json"
RANDOMIZER_JS = REPO_DIR / "js" / "gradient-randomizer.js"


# ============================================================================
# Color Math & WCAG Contrast Utilities
# ============================================================================

def clean_hex6(h: str) -> str:
    """Validate and normalize a 6-digit #RRGGBB hex string."""
    s = h.strip().lstrip("#").upper()
    if len(s) != 6 or not all(c in "0123456789ABCDEF" for c in s):
        raise ValueError(f"Invalid 6-digit hex color '{h}' (expected #RRGGBB)")
    return f"#{s}"


def hex_to_rgb(h: str) -> tuple[int, int, int]:
    s = h.lstrip("#")[:6]
    return int(s[0:2], 16), int(s[2:4], 16), int(s[4:6], 16)


def rgb_to_hsl(r: int, g: int, b: int) -> tuple[float, float, float]:
    h, l, s = colorsys.rgb_to_hls(r / 255.0, g / 255.0, b / 255.0)
    return (h * 360.0) % 360.0, s * 100.0, l * 100.0


def hsl_to_hex(h_deg: float, s_pct: float, l_pct: float, alpha: str = "") -> str:
    """Convert HSL (H: 0-360, S: 0-100, L: 0-100) to #RRGGBB[AA]."""
    h = ((h_deg % 360.0) + 360.0) % 360.0 / 360.0
    s = max(0.0, min(100.0, s_pct)) / 100.0
    l = max(0.0, min(100.0, l_pct)) / 100.0
    r, g, b = colorsys.hls_to_rgb(h, l, s)
    ri = max(0, min(255, round(r * 255)))
    gi = max(0, min(255, round(g * 255)))
    bi = max(0, min(255, round(b * 255)))
    return f"#{ri:02X}{gi:02X}{bi:02X}{alpha.upper()}"


def relative_luminance(hex_color: str) -> float:
    r, g, b = hex_to_rgb(hex_color)
    channels = []
    for c in (r, g, b):
        v = c / 255.0
        channels.append(v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4)
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]


def contrast_ratio(hex1: str, hex2: str) -> float:
    l1 = relative_luminance(hex1)
    l2 = relative_luminance(hex2)
    lighter, darker = max(l1, l2), min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)


# ============================================================================
# Standardized Glacial Palette Formula (Light 7%–22% Frost & Dark Polar Night)
# ============================================================================

def generate_light_palette(h: float, s: float) -> dict:
    """
    Standardized Light Mode Formula:
    - Perimeter Frost (t=0.00 -> t=1.00): L=92.0% (22% frost) -> L=99.2% (7% snow-white)
    - Polar Slate Foreground: L=12.5% (WCAG AAA >= 13:1 against editor canvas)
    - Monochromatic/Analogous Syntax Tokens: Hue within [H-20°, H+20°], L in [28%, 36%]
    """
    s_frost = max(68.0, min(92.0, s))
    accent_l = 42.0 if (45.0 <= h <= 165.0) else 48.0  # Slightly deeper accent for yellow/green hues
    accent = hsl_to_hex(h, max(75.0, s), accent_l)
    soft_hi = hsl_to_hex(h, max(78.0, s), 56.0)

    return {
        "gradient_stops": [
            hsl_to_hex(h, s_frost, 92.0),        # 0.00: 22% Perimeter Glacier Frost
            hsl_to_hex(h, s_frost + 3, 95.2),    # 0.33: 15% Pack-Ice Mist
            hsl_to_hex(h, s_frost + 5, 97.6),    # 0.66: 10% Frosted Snowdrift
            hsl_to_hex(h, s_frost + 8, 99.2),    # 1.00: 7% Antarctic Snow White
        ],
        "line_num": hsl_to_hex(h, 26.0, 58.0),
        "selection": f"{accent}22",
        "selection_inactive": f"{accent}12",
        "selection_highlight": f"{soft_hi}1E",
        "word_highlight": f"{accent}18",
        "word_highlight_strong": f"{accent}24",
        "find_match": f"{soft_hi}38",
        "find_match_highlight": f"{accent}20",
        "scrollbar": f"{soft_hi}38",
        "scrollbar_hover": f"{accent}58",
        "fg": hsl_to_hex(h, 48.0, 12.5),         # Crisp Polar Slate
        "fg_muted": hsl_to_hex(h, 32.0, 33.0),   # Soft Glacial Slate
        "fg_dim": hsl_to_hex(h, 24.0, 51.0),     # Whisper Frost Slate
        "comment": hsl_to_hex(h, 24.0, 51.0),
        "docstring": hsl_to_hex(h - 6, 48.0, 34.0),
        "badge_fg": "#FFFFFF",
        "ansi_black": hsl_to_hex(h, 48.0, 12.5),
        "ansi_white": hsl_to_hex(h, 65.0, 95.5),
        "red_star": hsl_to_hex(h + 8, 66.0, 31.0),      # Keywords
        "orange_blend": hsl_to_hex(h + 15, 42.0, 35.0), # Parameters
        "yellow_star": hsl_to_hex(h - 10, 58.0, 30.0),  # Types & Classes
        "green_star": hsl_to_hex(h - 20, 60.0, 29.5),   # Strings
        "teal_blend": hsl_to_hex(h - 14, 55.0, 36.0),   # Operators
        "blue_star": hsl_to_hex(h, 70.0, 33.0),         # Functions
        "blue_accent": accent,
        "prop_blue": hsl_to_hex(h + 4, 42.0, 30.0),     # Properties
        "purple_blend": hsl_to_hex(h + 20, 54.0, 33.0), # Numbers & Constants
    }


def generate_dark_palette(h: float, s: float) -> dict:
    """
    Standardized Dark Mode Formula:
    - Polar Night Progression (t=0.00 -> t=1.00): L=5.5% -> L=14.5%
    - Snow-Ice Foreground: L=92.5% (WCAG AAA >= 11:1 against dark slate)
    - Pastel Frost Syntax Tokens: Hue within [H-20°, H+20°], L in [72%, 83%]
    """
    s_dark = max(28.0, min(42.0, s * 0.48))
    accent = hsl_to_hex(h, max(72.0, s), 55.0)
    soft_hi = hsl_to_hex(h, max(78.0, s), 66.0)

    return {
        "gradient_stops": [
            hsl_to_hex(h, s_dark, 5.5),          # 0.00: Deep Polar Night
            hsl_to_hex(h, s_dark, 8.5),          # 0.33: Subzero Slate
            hsl_to_hex(h, s_dark, 11.5),         # 0.66: Cold Glacial Slate
            hsl_to_hex(h, s_dark, 14.5),         # 1.00: Arctic Midnight Canvas
        ],
        "line_num": hsl_to_hex(h, 25.0, 44.0),
        "selection": f"{accent}30",
        "selection_inactive": f"{accent}1A",
        "selection_highlight": f"{soft_hi}22",
        "word_highlight": f"{soft_hi}1E",
        "word_highlight_strong": f"{soft_hi}2C",
        "find_match": f"{soft_hi}38",
        "find_match_highlight": f"{accent}24",
        "scrollbar": f"{soft_hi}28",
        "scrollbar_hover": f"{soft_hi}48",
        "fg": hsl_to_hex(h, 46.0, 92.5),         # Crisp Snow-Ice White
        "fg_muted": hsl_to_hex(h, 36.0, 72.0),   # Muted Frost Slate
        "fg_dim": hsl_to_hex(h, 24.0, 48.0),     # Quiet Polar Grey
        "comment": hsl_to_hex(h, 24.0, 48.0),
        "docstring": hsl_to_hex(h - 8, 46.0, 68.0),
        "badge_fg": "#FFFFFF",
        "ansi_black": hsl_to_hex(h, s_dark, 5.5),
        "ansi_white": hsl_to_hex(h, 46.0, 92.5),
        "red_star": hsl_to_hex(h + 8, 80.0, 74.0),      # Keywords
        "orange_blend": hsl_to_hex(h + 15, 54.0, 74.0), # Parameters
        "yellow_star": hsl_to_hex(h - 10, 82.0, 82.0),  # Types & Classes
        "green_star": hsl_to_hex(h - 20, 62.0, 71.0),   # Strings
        "teal_blend": hsl_to_hex(h - 14, 65.0, 74.0),   # Operators
        "blue_star": hsl_to_hex(h, 84.0, 79.0),         # Functions
        "blue_accent": accent,
        "prop_blue": hsl_to_hex(h + 4, 56.0, 81.0),     # Properties
        "purple_blend": hsl_to_hex(h + 20, 68.0, 75.0), # Numbers & Constants
    }


def validate_palette(palette: dict, mode: str) -> list[str]:
    """Verify hex formatting (6 or 8 digits only) and WCAG contrast ratios."""
    warnings = []
    # Check all hex values
    for k, v in palette.items():
        vals = v if isinstance(v, list) else [v]
        for hex_str in vals:
            raw = hex_str.lstrip("#")
            if len(raw) not in (6, 8):
                raise ValueError(
                    f"[{mode}] Key '{k}' produced invalid {len(raw)}-digit hex '{hex_str}' "
                    "(must be 6-digit #RRGGBB or 8-digit #RRGGBBAA; 10-digit triggers VS Code #FF0000 debug red!)"
                )

    editor_bg = palette["gradient_stops"][-1]
    fg_cr = contrast_ratio(palette["fg"], editor_bg)
    if fg_cr < 10.0:
        warnings.append(f"[{mode}] Foreground contrast {fg_cr:.1f}:1 is below AAA target (10.0:1)")

    token_keys = ["red_star", "blue_star", "green_star", "yellow_star", "orange_blend", "purple_blend", "prop_blue"]
    for tk in token_keys:
        cr = contrast_ratio(palette[tk], editor_bg)
        if cr < 4.5:
            warnings.append(f"[{mode}] Token '{tk}' ({palette[tk]}) contrast {cr:.1f}:1 is below WCAG AA (4.5:1)")
    return warnings


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


# ============================================================================
# CLI Commands
# ============================================================================

def cmd_theme(args):
    if args.color:
        hex6 = clean_hex6(args.color)
        r, g, b = hex_to_rgb(hex6)
        h, s, _ = rgb_to_hsl(r, g, b)
    elif args.hue is not None:
        h = float(args.hue) % 360.0
        s = 82.0
        hex6 = hsl_to_hex(h, s, 50.0)
    else:
        sys.exit("Error: Provide either --color '#RRGGBB' or --hue <0-360>.")

    base_name = args.name.strip()
    if not base_name.lower().endswith("gradient"):
        family_prefix = f"{base_name} Gradient"
    else:
        family_prefix = base_name

    slug = slugify(base_name.replace("Gradient", "").strip())
    light_sub = args.light_sub or "Glacial Frost Light"
    dark_sub = args.dark_sub or "Polar Night Dark"

    light_label = f"{family_prefix} ({light_sub})"
    dark_label = f"{family_prefix} ({dark_sub})"
    light_file = f"{slug}-light-color-theme.json"
    dark_file = f"{slug}-dark-color-theme.json"

    light_pal = generate_light_palette(h, s)
    dark_pal = generate_dark_palette(h, s)

    warnings = validate_palette(light_pal, "Light") + validate_palette(dark_pal, "Dark")

    light_bg = light_pal["gradient_stops"][-1]
    dark_bg = dark_pal["gradient_stops"][-1]

    print(f"=== Standardized Glacial Theme Pair: {family_prefix} ===")
    print(f"Seed Color: {hex6}  (Hue: {h:.1f}°, Sat: {s:.1f}%)")
    print(f"\n[Light] {light_label} -> themes/{light_file}")
    print(f"  Gradient Stops (22% -> 7%): {' -> '.join(light_pal['gradient_stops'])}")
    print(f"  Foreground: {light_pal['fg']} vs Canvas {light_bg} (Contrast: {contrast_ratio(light_pal['fg'], light_bg):.1f}:1 AAA)")
    print(f"  Syntax Tokens: kw={light_pal['red_star']} fn={light_pal['blue_star']} str={light_pal['green_star']} type={light_pal['yellow_star']}")

    print(f"\n[Dark]  {dark_label} -> themes/{dark_file}")
    print(f"  Gradient Stops (Night):     {' -> '.join(dark_pal['gradient_stops'])}")
    print(f"  Foreground: {dark_pal['fg']} vs Canvas {dark_bg} (Contrast: {contrast_ratio(dark_pal['fg'], dark_bg):.1f}:1 AAA)")
    print(f"  Syntax Tokens: kw={dark_pal['red_star']} fn={dark_pal['blue_star']} str={dark_pal['green_star']} type={dark_pal['yellow_star']}")

    if warnings:
        print("\nWarnings:")
        for w in warnings:
            print(f"  - {w}")

    if args.dry_run:
        print("\n[Dry Run] No files written. Omit --dry-run to save and build.")
        return

    CUSTOM_THEMES_JSON.parent.mkdir(parents=True, exist_ok=True)
    custom_list = []
    if CUSTOM_THEMES_JSON.exists():
        try:
            custom_list = json.loads(CUSTOM_THEMES_JSON.read_text(encoding="utf-8"))
        except Exception:
            custom_list = []

    new_entries = [
        {
            "label": light_label,
            "uiTheme": "vs",
            "file": light_file,
            "palette": light_pal,
            "type": "light",
        },
        {
            "label": dark_label,
            "uiTheme": "vs-dark",
            "file": dark_file,
            "palette": dark_pal,
            "type": "dark",
        },
    ]

    replace_files = {light_file, dark_file}
    custom_list = [item for item in custom_list if item.get("file") not in replace_files]
    custom_list.extend(new_entries)
    CUSTOM_THEMES_JSON.write_text(json.dumps(custom_list, indent=2) + "\n", encoding="utf-8")
    print(f"\n[Saved] Updated {CUSTOM_THEMES_JSON.relative_to(REPO_DIR)}")

    import build_themes
    build_themes.main()


def cmd_randomizer(args):
    raw_stops = [s.strip() for s in args.stops.split(",") if s.strip()]
    if len(raw_stops) != 4:
        sys.exit(f"Error: Expected exactly 4 comma-separated hex stops, got {len(raw_stops)}.")

    hex_stops = [clean_hex6(s) for s in raw_stops]
    rgb_stops = [list(hex_to_rgb(h)) for h in hex_stops]
    name = args.name.strip()

    print(f"=== 4-Color Status Bar Randomizer Palette: {name} ===")
    for i, (hx, rgb) in enumerate(zip(hex_stops, rgb_stops), start=1):
        alpha = 0.22 if i == 4 else 0.18
        print(f"  Stop {i} (--g-r{i}): {hx}  ->  rgba({rgb[0]}, {rgb[1]}, {rgb[2]}, {alpha:.2f})")

    if args.dry_run:
        print("\n[Dry Run] No files written. Omit --dry-run to inject into js/gradient-randomizer.js.")
        return

    js_text = RANDOMIZER_JS.read_text(encoding="utf-8")
    block_lines = [
        "    {",
        f'      name: "{name}",',
        "      stops: [",
        f"        [{rgb_stops[0][0]}, {rgb_stops[0][1]}, {rgb_stops[0][2]}], // {hex_stops[0]}",
        f"        [{rgb_stops[1][0]}, {rgb_stops[1][1]}, {rgb_stops[1][2]}], // {hex_stops[1]}",
        f"        [{rgb_stops[2][0]}, {rgb_stops[2][1]}, {rgb_stops[2][2]}], // {hex_stops[2]}",
        f"        [{rgb_stops[3][0]}, {rgb_stops[3][1]}, {rgb_stops[3][2]}], // {hex_stops[3]}",
        "      ],",
        "    },",
    ]
    entry_block = "\n".join(block_lines)

    # Check if palette with same name already exists
    pattern = re.compile(
        r'\{\s*name:\s*"' + re.escape(name) + r'"[\s\S]*?\n\s*\},',
        re.MULTILINE,
    )
    if pattern.search(js_text):
        js_text = pattern.sub(entry_block.lstrip(), js_text, count=1)
    else:
        marker = "  ];\n\n  function hslToRgb"
        if marker not in js_text:
            sys.exit("Error: Could not locate CURATED_PALETTES closing marker in js/gradient-randomizer.js")
        js_text = js_text.replace(marker, f"{entry_block}\n  ];\n\n  function hslToRgb", 1)

    RANDOMIZER_JS.write_text(js_text, encoding="utf-8")
    print(f"\n[Saved] Injected '{name}' into {RANDOMIZER_JS.relative_to(REPO_DIR)}")


def cmd_remove_theme(args):
    if not CUSTOM_THEMES_JSON.exists():
        print("No custom themes file found.")
        return
    slug = slugify(args.name.replace("Gradient", "").strip())
    targets = {f"{slug}-light-color-theme.json", f"{slug}-dark-color-theme.json"}
    custom_list = json.loads(CUSTOM_THEMES_JSON.read_text(encoding="utf-8"))
    filtered = [item for item in custom_list if item.get("file") not in targets and args.name.lower() not in item.get("label", "").lower()]
    CUSTOM_THEMES_JSON.write_text(json.dumps(filtered, indent=2) + "\n", encoding="utf-8")
    for t in targets:
        p = REPO_DIR / "themes" / t
        if p.exists():
            p.unlink()
    import build_themes
    build_themes.main()
    print(f"[Removed] Removed custom theme '{args.name}'.")


def cmd_remove_randomizer(args):
    js_text = RANDOMIZER_JS.read_text(encoding="utf-8")
    name = args.name.strip()
    pattern = re.compile(
        r'\n\s*\{\s*name:\s*"' + re.escape(name) + r'"[\s\S]*?\n\s*\},',
        re.MULTILINE,
    )
    if not pattern.search(js_text):
        print(f"Palette '{name}' not found in {RANDOMIZER_JS.relative_to(REPO_DIR)}.")
        return
    js_text = pattern.sub("", js_text, count=1)
    RANDOMIZER_JS.write_text(js_text, encoding="utf-8")
    print(f"[Removed] Removed randomizer palette '{name}' from {RANDOMIZER_JS.relative_to(REPO_DIR)}.")


def cmd_list(_args):
    import build_themes
    manifest = build_themes.get_all_themes_manifest()
    print(f"=== Color Themes ({len(manifest)} total) ===")
    for item in manifest:
        stops = item["palette"]["gradient_stops"]
        fg = item["palette"]["fg"]
        cr = contrast_ratio(fg, stops[-1])
        print(f"  • [{item['type']:5s}] {item['label']:52s} ({stops[0]} -> {stops[-1]}, FG {cr:.1f}:1)")

    js_text = RANDOMIZER_JS.read_text(encoding="utf-8")
    curated_section = js_text.split("function hslToRgb")[0]
    names = re.findall(r'name:\s*"([^"]+)"', curated_section)
    print(f"\n=== Curated 4-Color Randomizer Palettes ({len(names)} total) ===")
    for n in names:
        print(f"  • 🎲 {n}")


def main():
    parser = argparse.ArgumentParser(
        description="Standardized Color & Palette Generator for VS Code Gradient Themes"
    )
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_list = sub.add_parser("list", help="List all active color themes and 4-color randomizer palettes")
    p_list.set_defaults(func=cmd_list)

    p_theme = sub.add_parser("theme", help="Generate and register a Light + Dark single-color glacial theme pair")
    p_theme.add_argument("--name", required=True, help="Theme family name (e.g. 'Pure Cyan')")
    p_theme.add_argument("--color", help="Seed hex color (e.g. '#06B6D4')")
    p_theme.add_argument("--hue", type=float, help="Seed hue in degrees (0-360) if --color is omitted")
    p_theme.add_argument("--light-sub", help="Light theme subtitle (default: 'Glacial Frost Light')")
    p_theme.add_argument("--dark-sub", help="Dark theme subtitle (default: 'Polar Night Dark')")
    p_theme.add_argument("--dry-run", action="store_true", help="Preview generated hex palette and WCAG contrast without saving")
    p_theme.set_defaults(func=cmd_theme)

    p_rand = sub.add_parser("randomizer", help="Add a 4-color palette to the Status Bar live randomizer")
    p_rand.add_argument("--name", required=True, help="Palette display name (e.g. 'Cyber Mint')")
    p_rand.add_argument("--stops", required=True, help="4 comma-separated hex stops (e.g. '#06B6D4,#10B981,#3B82F6,#8B5CF6')")
    p_rand.add_argument("--dry-run", action="store_true", help="Preview 7%%-22%% rgba stops without modifying JS")
    p_rand.set_defaults(func=cmd_randomizer)

    p_rm_theme = sub.add_parser("remove-theme", help="Remove a custom theme family added via 'theme'")
    p_rm_theme.add_argument("--name", required=True, help="Theme family name to remove")
    p_rm_theme.set_defaults(func=cmd_remove_theme)

    p_rm_rand = sub.add_parser("remove-randomizer", help="Remove a 4-color palette from the Status Bar randomizer")
    p_rm_rand.add_argument("--name", required=True, help="Palette display name to remove")
    p_rm_rand.set_defaults(func=cmd_remove_randomizer)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
