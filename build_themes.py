#!/usr/bin/env python3
"""
Builds and installs the "VSCode Gradient Themes" Extension
(`iamqazolp.vscode-gradient-themes`).

Designed for effortless, eye-friendly code reviewing:
1. ICE-COLD ANTARCTIC / GLACIAL ATMOSPHERE:
   - Whisper-soft frost gradients at the window perimeter that melt into a crisp,
     high-contrast snow-white (Light) or deep polar-slate (Dark) code editor canvas.
2. CALM, DESATURATED MONOCHROMATIC SYNTAX PALETTES:
   - High luminance contrast (AAA readability) with muted slate/glacial tones so reading
     code or reviewing diffs never strains the eyes.
3. OPAQUE FROSTED STICKY SCROLL & POPUPS:
   - Prevents scrolling code lines from bleeding through Sticky Scroll headers.
"""

import json
import os
import time
from pathlib import Path

REPO_DIR = Path(__file__).resolve().parent
CUSTOM_THEMES_JSON = REPO_DIR / "palettes" / "custom_themes.json"
EXT_DIR = Path(os.path.expanduser("~/.vscode/extensions/iamqazolp.vscode-gradient-themes-67.67.67"))
VSCODE_EXT_JSON = Path(os.path.expanduser("~/.vscode/extensions/extensions.json"))
VSCODE_SETTINGS_JSON = Path(os.path.expanduser("~/Library/Application Support/Code/User/settings.json"))


def hex_to_rgb(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")[:6]
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


def rgb_to_hex(r: float, g: float, b: float, alpha: str = "") -> str:
    ri = max(0, min(255, round(r)))
    gi = max(0, min(255, round(g)))
    bi = max(0, min(255, round(b)))
    return f"#{ri:02X}{gi:02X}{bi:02X}{alpha}"


def lerp_hex(c1: str, c2: str, t: float, alpha: str = "") -> str:
    """Linearly interpolate between two hex colors (0.0 <= t <= 1.0)."""
    r1, g1, b1 = hex_to_rgb(c1)
    r2, g2, b2 = hex_to_rgb(c2)
    return rgb_to_hex(
        r1 + (r2 - r1) * t,
        g1 + (g2 - g1) * t,
        b1 + (b2 - b1) * t,
        alpha=alpha,
    )


def multi_stop_lerp(stops: list[str], t: float, alpha: str = "") -> str:
    """Sample a smooth multi-stop color gradient at position t in [0.0, 1.0]."""
    if t <= 0:
        return lerp_hex(stops[0], stops[0], 0, alpha)
    if t >= 1:
        return lerp_hex(stops[-1], stops[-1], 0, alpha)
    scaled = t * (len(stops) - 1)
    idx = int(scaled)
    frac = scaled - idx
    return lerp_hex(stops[idx], stops[min(idx + 1, len(stops) - 1)], frac, alpha)


def make_ombre_theme(name: str, ui_type: str, p: dict) -> dict:
    """
    Create a whisper-soft, high-contrast glacial gradient theme optimized for code review.
    """
    stops = p["gradient_stops"]

    # 8-Step Glacial Progression from Perimeter Frost (t=0.0) to Crisp Snow/Slate Editor (t=1.0)
    c_step0 = multi_stop_lerp(stops, 0.00, "E6")  # Activity Bar & Title Bar
    c_step1 = multi_stop_lerp(stops, 0.22, "E6")  # Sidebar & Tab Strip
    c_step2 = multi_stop_lerp(stops, 0.42, "EE")  # Sidebar Header & Breadcrumbs
    c_step3_opaque = multi_stop_lerp(stops, 0.60) # Sticky Scroll (Opaque so text never bleeds through!)
    c_step3 = multi_stop_lerp(stops, 0.60, "EE")  # Editor Gutter
    c_step4 = multi_stop_lerp(stops, 0.85)        # Main Editor Canvas (Crisp Snow / Deep Polar Slate)
    c_step5 = multi_stop_lerp(stops, 0.72, "E6")  # Minimap & Bottom Terminal Panel
    c_step6 = multi_stop_lerp(stops, 0.95)        # Elevated Widgets & Popups
    c_step7 = multi_stop_lerp(stops, 0.15, "E6")  # Status Bar

    indent_guide = lerp_hex(p["fg_dim"], c_step4, 0.72)
    indent_guide_active = lerp_hex(p["fg_muted"], c_step4, 0.40)

    return {
        "name": name,
        "type": ui_type,
        "semanticHighlighting": True,
        "colors": {
            # Base & Window
            "focusBorder": "#00000000",
            "contrastBorder": "#00000000",
            "foreground": p["fg"],
            "descriptionForeground": p["fg_muted"],
            "errorForeground": "#C93B3B" if ui_type == "light" else "#F87171",
            "widget.shadow": "#00000000",
            "selection.background": p["selection"],
            "icon.foreground": p["fg_muted"],
            "sash.hoverBorder": p["blue_star"],

            # VSCode 2026 Modern UI / Floating Panels tokens
            "surface.background": c_step1,
            "surface.border": "#00000000",
            "modernUI.shellBackground": c_step0,
            "modernPanel.border": "#00000000",
            "modernActivityBar.border": "#00000000",
            "modernEditorTab.activeBackground": c_step4,
            "modernEditorTab.inactiveBackground": c_step1,
            "modernTab.activeBackground": c_step4,
            "chat.list.background": c_step1,

            # Title Bar & Activity Bar
            "titleBar.activeBackground": c_step0,
            "titleBar.activeForeground": p["fg"],
            "titleBar.inactiveBackground": c_step0,
            "titleBar.inactiveForeground": p["fg_dim"],
            "titleBar.border": "#00000000",
            "commandCenter.background": c_step2,
            "commandCenter.activeBackground": c_step4,
            "commandCenter.foreground": p["fg"],
            "commandCenter.activeForeground": p["fg"],
            "commandCenter.border": "#00000000",

            "activityBar.background": c_step0,
            "activityBar.foreground": p["fg"],
            "activityBar.inactiveForeground": p["fg_dim"],
            "activityBar.border": "#00000000",
            "activityBarBadge.background": p["blue_accent"],
            "activityBarBadge.foreground": p["badge_fg"],
            "activityBar.activeBorder": p["blue_accent"],
            "activityBar.activeBackground": c_step1,

            # Side Bar
            "sideBar.background": c_step1,
            "sideBar.foreground": p["fg"],
            "sideBar.border": "#00000000",
            "sideBarTitle.foreground": p["fg"],
            "sideBarSectionHeader.background": c_step2,
            "sideBarSectionHeader.foreground": p["fg_muted"],
            "sideBarSectionHeader.border": "#00000000",

            # Lists & Trees
            "list.activeSelectionBackground": lerp_hex(c_step1, p["blue_accent"], 0.16),
            "list.activeSelectionForeground": p["fg"],
            "list.activeSelectionIconForeground": p["blue_accent"],
            "list.inactiveSelectionBackground": lerp_hex(c_step1, p["blue_accent"], 0.10),
            "list.inactiveSelectionForeground": p["fg"],
            "list.hoverBackground": lerp_hex(c_step1, c_step4, 0.45),
            "list.hoverForeground": p["fg"],
            "list.focusBackground": c_step2,
            "list.highlightForeground": p["blue_accent"],
            "tree.indentGuidesStroke": indent_guide,

            # Editor Group & Tabs
            "editorGroup.border": "#00000000",
            "editorGroupHeader.tabsBackground": c_step1,
            "editorGroupHeader.tabsBorder": "#00000000",
            "tab.activeBackground": c_step4,
            "tab.activeForeground": p["fg"],
            "tab.activeBorderTop": p["blue_accent"],
            "tab.activeBorder": "#00000000",
            "tab.inactiveBackground": c_step1,
            "tab.inactiveForeground": p["fg_muted"],
            "tab.hoverBackground": c_step2,
            "tab.hoverForeground": p["fg"],
            "tab.border": "#00000000",
            "tab.unfocusedActiveBorderTop": "#00000000",

            # Breadcrumbs
            "breadcrumb.background": c_step2,
            "breadcrumb.foreground": p["fg_muted"],
            "breadcrumb.focusForeground": p["fg"],
            "breadcrumb.activeSelectionForeground": p["fg"],

            # Sticky Scroll & Gutter (Opaque Sticky Scroll so code underneath never overlaps!)
            "editorStickyScroll.background": c_step3_opaque,
            "editorStickyScrollHover.background": lerp_hex(c_step3_opaque, c_step1, 0.35),
            "editorStickyScroll.border": "#00000000",
            "editorGutter.background": c_step3,
            "editorGutter.modifiedBackground": "#2563EB" if ui_type == "light" else "#60A5FA",
            "editorGutter.addedBackground": "#16A34A" if ui_type == "light" else "#4ADE80",
            "editorGutter.deletedBackground": "#DC2626" if ui_type == "light" else "#F87171",

            # Main Editor Canvas (Crisp, calm, high-contrast surface for code reviewing)
            "editor.background": c_step4,
            "editor.foreground": p["fg"],
            "editorLineNumber.foreground": p["line_num"],
            "editorLineNumber.activeForeground": p["fg"],
            "editorCursor.foreground": p["blue_accent"],
            "editorCursor.background": c_step4,
            "editor.selectionBackground": p["selection"],
            "editor.inactiveSelectionBackground": p["selection_inactive"],
            "editor.selectionHighlightBackground": p["selection_highlight"],
            "editor.wordHighlightBackground": p["word_highlight"],
            "editor.wordHighlightStrongBackground": p["word_highlight_strong"],
            "editor.findMatchBackground": p["find_match"],
            "editor.findMatchHighlightBackground": p["find_match_highlight"],
            "editor.findMatchBorder": p["blue_accent"],
            "editor.lineHighlightBackground": lerp_hex(c_step4, c_step1, 0.35, "66"),
            "editor.lineHighlightBorder": "#00000000",
            "editorWhitespace.foreground": indent_guide,
            "editorRuler.foreground": indent_guide,
            "editorBracketMatch.background": p["selection_highlight"],
            "editorBracketMatch.border": p["blue_accent"],

            # Subtle, Uniform Frost Indent Guides (No rainbow clutter!)
            "editorIndentGuide.background1": indent_guide,
            "editorIndentGuide.background2": indent_guide,
            "editorIndentGuide.background3": indent_guide,
            "editorIndentGuide.background4": indent_guide,
            "editorIndentGuide.background5": indent_guide,
            "editorIndentGuide.background6": indent_guide,
            "editorIndentGuide.activeBackground1": indent_guide_active,
            "editorIndentGuide.activeBackground2": indent_guide_active,
            "editorIndentGuide.activeBackground3": indent_guide_active,
            "editorIndentGuide.activeBackground4": indent_guide_active,
            "editorIndentGuide.activeBackground5": indent_guide_active,
            "editorIndentGuide.activeBackground6": indent_guide_active,

            # Calm Tonal Bracket Pair Colorization (Muted slate tones instead of 6-color rainbow)
            "editorBracketHighlight.foreground1": p["fg_muted"],
            "editorBracketHighlight.foreground2": p["blue_star"],
            "editorBracketHighlight.foreground3": p["teal_blend"],
            "editorBracketHighlight.foreground4": p["fg_muted"],
            "editorBracketHighlight.foreground5": p["blue_star"],
            "editorBracketHighlight.foreground6": p["teal_blend"],
            "editorBracketHighlight.unexpectedBracket.foreground": "#DC2626" if ui_type == "light" else "#F87171",

            # Minimap & Bottom Terminal Panel
            "minimap.background": c_step5,
            "minimap.selectionHighlight": p["selection"],
            "minimap.findMatchHighlight": p["find_match"],
            "editorOverviewRuler.border": "#00000000",
            "editorOverviewRuler.background": c_step5,

            "panel.background": c_step5,
            "panel.border": "#00000000",
            "panelSectionHeader.background": c_step4,
            "panelTitle.activeBorder": p["blue_accent"],
            "panelTitle.activeForeground": p["fg"],
            "panelTitle.inactiveForeground": p["fg_muted"],

            # Gradient Integrated Terminal (High-contrast text & clean ANSI colors)
            # Use 6-digit RRGGBB + "00" alpha (8 hex digits total) so xterm.js keeps allowTransparency=true
            # while computing selection contrast against RRGGBB instead of #000000 black!
            "terminal.background": f"{c_step5[:7]}00",
            "terminal.border": "#00000000",
            "terminal.foreground": p["fg"],
            "terminal.selectionBackground": p["selection"],
            "terminal.inactiveSelectionBackground": p["selection_inactive"],
            "terminal.findMatchBackground": p["find_match"],
            "terminal.findMatchBorder": p["blue_accent"],
            "terminal.findMatchHighlightBackground": p["find_match_highlight"],
            "terminal.hoverHighlightBackground": p["word_highlight"],
            "terminal.tab.activeBorder": p["blue_accent"],
            "terminalCursor.foreground": p["blue_accent"],
            "terminalCursor.background": c_step4,
            "terminalCommandDecoration.defaultBackground": p["fg_dim"],
            "terminalCommandDecoration.successBackground": "#16A34A" if ui_type == "light" else "#4ADE80",
            "terminalCommandDecoration.errorBackground": "#DC2626" if ui_type == "light" else "#F87171",
            "terminalOverviewRuler.cursorForeground": p["blue_accent"],
            "terminalOverviewRuler.findMatchForeground": p["find_match"],
            "terminalOverviewRuler.border": "#00000000",
            "terminalStickyScroll.background": c_step3_opaque,
            "terminalStickyScroll.border": "#00000000",
            "terminalStickyScrollHover.background": c_step2,
            "terminal.ansiBlack": p["ansi_black"],
            "terminal.ansiRed": p["red_star"],
            "terminal.ansiGreen": p["green_star"],
            "terminal.ansiYellow": p["yellow_star"],
            "terminal.ansiBlue": p["blue_star"],
            "terminal.ansiMagenta": p["purple_blend"],
            "terminal.ansiCyan": p["teal_blend"],
            "terminal.ansiWhite": p["ansi_white"],
            "terminal.ansiBrightBlack": p["fg_dim"],
            "terminal.ansiBrightRed": p["red_star"],
            "terminal.ansiBrightGreen": p["green_star"],
            "terminal.ansiBrightYellow": p["orange_blend"],
            "terminal.ansiBrightBlue": p["blue_star"],
            "terminal.ansiBrightMagenta": p["purple_blend"],
            "terminal.ansiBrightCyan": p["teal_blend"],
            "terminal.ansiBrightWhite": p["fg"],

            # Status Bar
            "statusBar.background": c_step7,
            "statusBar.foreground": p["fg"],
            "statusBar.border": "#00000000",
            "statusBar.debuggingBackground": p["blue_accent"],
            "statusBar.debuggingForeground": p["badge_fg"],
            "statusBar.noFolderBackground": c_step7,
            "statusBarItem.remoteBackground": p["blue_accent"],
            "statusBarItem.remoteForeground": p["badge_fg"],

            # Editor Widgets, Inputs & Dropdowns
            "editorWidget.background": c_step6,
            "editorWidget.foreground": p["fg"],
            "editorWidget.border": indent_guide,
            "editorSuggestWidget.background": c_step6,
            "editorSuggestWidget.border": indent_guide,
            "editorSuggestWidget.foreground": p["fg"],
            "editorSuggestWidget.highlightForeground": p["blue_accent"],
            "editorSuggestWidget.selectedBackground": c_step2,
            "editorHoverWidget.background": c_step6,
            "editorHoverWidget.border": indent_guide,
            "peekView.border": p["blue_accent"],
            "peekViewEditor.background": c_step4,
            "peekViewEditor.matchHighlightBackground": p["find_match_highlight"],
            "peekViewResult.background": c_step2,
            "peekViewTitle.background": c_step1,

            # Crystal-Clear Code Review & Git Diff Highlights
            "diffEditor.insertedTextBackground": "#16a34a24" if ui_type == "light" else "#2ea04330",
            "diffEditor.removedTextBackground": "#dc262622" if ui_type == "light" else "#f8514930",
            "diffEditor.insertedLineBackground": "#16a34a12" if ui_type == "light" else "#2ea04318",
            "diffEditor.removedLineBackground": "#dc262612" if ui_type == "light" else "#f8514918",

            "input.background": c_step4,
            "input.foreground": p["fg"],
            "input.border": indent_guide,
            "input.placeholderForeground": p["fg_dim"],
            "inputOption.activeBorder": p["blue_accent"],
            "inputOption.activeBackground": p["selection_highlight"],
            "dropdown.background": c_step4,
            "dropdown.foreground": p["fg"],
            "dropdown.border": indent_guide,
            "button.background": p["blue_accent"],
            "button.foreground": p["badge_fg"],
            "button.hoverBackground": p["blue_star"],
            "button.secondaryBackground": c_step2,
            "button.secondaryForeground": p["fg"],
            "badge.background": p["blue_accent"],
            "badge.foreground": p["badge_fg"],

            "scrollbar.shadow": "#00000000",
            "scrollbarSlider.background": p["scrollbar"],
            "scrollbarSlider.hoverBackground": p["scrollbar_hover"],
            "scrollbarSlider.activeBackground": p["blue_accent"],

            "gitDecoration.addedResourceForeground": "#15803D" if ui_type == "light" else "#4ADE80",
            "gitDecoration.modifiedResourceForeground": p["blue_star"],
            "gitDecoration.deletedResourceForeground": "#B91C1C" if ui_type == "light" else "#F87171",
            "gitDecoration.untrackedResourceForeground": p["teal_blend"],
            "gitDecoration.ignoredResourceForeground": p["fg_dim"],
            "gitDecoration.conflictingResourceForeground": p["orange_blend"],

            "notebook.editorBackground": c_step4,
            "notebook.cellBorderColor": indent_guide,
            "notebook.focusedCellBorder": p["blue_accent"],
            "notebook.cellEditorBackground": c_step4,
            "notebook.cellStatusBarItemHoverBackground": c_step2,
        },
        "tokenColors": [
            {
                "name": "Comments & Docblocks",
                "scope": ["comment", "punctuation.definition.comment"],
                "settings": {"foreground": p["comment"], "fontStyle": "italic"},
            },
            {
                "name": "Docstrings",
                "scope": ["string.quoted.docstring", "comment.block.documentation"],
                "settings": {"foreground": p["docstring"], "fontStyle": "italic"},
            },
            {
                "name": "Keywords & Storage",
                "scope": [
                    "keyword",
                    "keyword.control",
                    "keyword.operator.logical",
                    "keyword.operator.wordlike",
                    "keyword.operator.new",
                    "storage",
                    "storage.type",
                    "storage.modifier",
                ],
                "settings": {"foreground": p["red_star"]},
            },
            {
                "name": "Function Parameters & Decorators",
                "scope": [
                    "variable.parameter",
                    "meta.function.parameters variable",
                    "entity.name.variable.parameter",
                    "meta.decorator",
                    "entity.name.function.decorator",
                    "punctuation.definition.decorator",
                ],
                "settings": {"foreground": p["orange_blend"]},
            },
            {
                "name": "Classes, Types & Structs",
                "scope": [
                    "entity.name.type",
                    "entity.name.class",
                    "entity.other.inherited-class",
                    "support.type",
                    "support.class",
                    "entity.name.namespace",
                ],
                "settings": {"foreground": p["yellow_star"]},
            },
            {
                "name": "Strings",
                "scope": ["string", "string.quoted", "string.template"],
                "settings": {"foreground": p["green_star"]},
            },
            {
                "name": "Operators, Punctuation & Regex",
                "scope": [
                    "keyword.operator",
                    "punctuation.separator",
                    "punctuation.terminator",
                    "punctuation.accessor",
                    "constant.character.escape",
                    "punctuation.definition.template-expression",
                    "constant.other.placeholder",
                    "string.regexp",
                ],
                "settings": {"foreground": p["fg_muted"]},
            },
            {
                "name": "Functions & Methods",
                "scope": [
                    "entity.name.function",
                    "support.function",
                    "meta.function-call.generic",
                    "variable.function",
                ],
                "settings": {"foreground": p["blue_star"]},
            },
            {
                "name": "Object Properties & Attributes",
                "scope": [
                    "variable.other.property",
                    "support.variable.property",
                    "meta.attribute",
                    "entity.other.attribute-name",
                ],
                "settings": {"foreground": p["prop_blue"]},
            },
            {
                "name": "Numbers, Constants & Booleans",
                "scope": [
                    "constant.numeric",
                    "constant.language",
                    "constant.character",
                    "constant.other",
                    "variable.other.constant",
                ],
                "settings": {"foreground": p["purple_blend"]},
            },
            {
                "name": "Self / This / Language Variables",
                "scope": ["variable.language", "variable.language.self", "variable.language.this"],
                "settings": {"foreground": p["red_star"], "fontStyle": "italic"},
            },
            {
                "name": "Variables & Identifiers",
                "scope": [
                    "variable",
                    "variable.other.readwrite",
                    "meta.definition.variable",
                ],
                "settings": {"foreground": p["fg"]},
            },
            {
                "name": "HTML / JSX / XML Tags",
                "scope": ["entity.name.tag", "punctuation.definition.tag"],
                "settings": {"foreground": p["red_star"]},
            },
            {
                "name": "JSON / YAML Keys",
                "scope": [
                    "support.type.property-name.json",
                    "entity.name.tag.yaml",
                ],
                "settings": {"foreground": p["blue_star"]},
            },
            {
                "name": "Markdown Headings",
                "scope": ["markup.heading", "entity.name.section.markdown"],
                "settings": {"foreground": p["red_star"], "fontStyle": "bold"},
            },
            {
                "name": "Markdown Bold",
                "scope": ["markup.bold"],
                "settings": {"foreground": p["fg"], "fontStyle": "bold"},
            },
            {
                "name": "Markdown Italic",
                "scope": ["markup.italic"],
                "settings": {"foreground": p["fg_muted"], "fontStyle": "italic"},
            },
            {
                "name": "Markdown Inline Code & Raw Blocks",
                "scope": ["markup.inline.raw", "markup.fenced_code.block"],
                "settings": {"foreground": p["green_star"]},
            },
            {
                "name": "Markdown Links",
                "scope": [
                    "markup.underline.link",
                    "string.other.link",
                    "support.class.math",
                    "constant.character.math",
                ],
                "settings": {"foreground": p["blue_star"]},
            },
        ],
        "semanticTokenColors": {
            "function": p["blue_star"],
            "method": p["blue_star"],
            "class": p["yellow_star"],
            "type": p["yellow_star"],
            "interface": p["yellow_star"],
            "namespace": p["prop_blue"],
            "parameter": p["orange_blend"],
            "variable.readonly": p["purple_blend"],
            "property": p["prop_blue"],
            "keyword": p["red_star"],
            "number": p["purple_blend"],
            "string": p["green_star"],
            "decorator": p["orange_blend"],
        },
    }


# ===========================================================================
# ICE-COLD ANTARCTIC & WHISPER-FROST SINGLE-COLOR GRADIENT THEMES
# ===========================================================================

# 1. 💙 PURE BLUE GRADIENT — LIGHT ("Antarctic Glacier Ice" 7%–22%)
PURE_BLUE_LIGHT = {
    "gradient_stops": [
        "#D8ECFD",  # 0.00: 22% Arctic Glacier Blue
        "#E6F3FE",  # 0.33: 15% Pack-Ice Mist
        "#F2F8FF",  # 0.66: 10% Frosted Snowdrift
        "#FAFDFF",  # 1.00: 7% Antarctic Snow White
    ],
    "line_num": "#7A99B8",
    "selection": "#3B82F624",
    "selection_inactive": "#3B82F614",
    "selection_highlight": "#60A5FA20",
    "word_highlight": "#3B82F618",
    "word_highlight_strong": "#2563EB24",
    "find_match": "#60A5FA40",
    "find_match_highlight": "#3B82F622",
    "scrollbar": "#60A5FA38",
    "scrollbar_hover": "#3B82F658",
    "fg": "#122238",                    # Crisp Polar Slate
    "fg_muted": "#3B5575",              # Soft Glacial Slate
    "fg_dim": "#6B87A8",                # Whisper Frost Slate
    "comment": "#6B87A8",
    "docstring": "#2E5B88",
    "badge_fg": "#FFFFFF",
    "ansi_black": "#122238",
    "ansi_white": "#EBF4FC",
    "red_star": "#1D4E8F",              # Keywords: Clear Glacier Blue
    "orange_blend": "#3A5E85",          # Parameters: Soft Steel Blue
    "yellow_star": "#265278",           # Types/Classes: Fjord Slate
    "green_star": "#206678",            # Strings: Icy Arctic Teal-Blue
    "teal_blend": "#2E6FB0",            # Operators: Pack-Ice Blue
    "blue_star": "#185A9E",             # Functions: Crisp Ice Sapphire
    "blue_accent": "#2563EB",
    "prop_blue": "#304F73",             # Properties: Polar Slate
    "purple_blend": "#2C5080",          # Numbers: Ice Cobalt
}

# 2. 💙 PURE BLUE GRADIENT — DARK ("Antarctic Polar Night")
PURE_BLUE_DARK = {
    "gradient_stops": [
        "#090E16",  # 0.00: Deep Polar Night
        "#0D1522",  # 0.33: Subzero Navy Slate
        "#121E30",  # 0.66: Cold Glacial Slate
        "#162438",  # 1.00: Arctic Midnight
    ],
    "line_num": "#4E6A8A",
    "selection": "#3B82F633",
    "selection_inactive": "#3B82F61C",
    "selection_highlight": "#60A5FA24",
    "word_highlight": "#38BDF820",
    "word_highlight_strong": "#60A5FA30",
    "find_match": "#38BDF840",
    "find_match_highlight": "#3B82F628",
    "scrollbar": "#60A5FA28",
    "scrollbar_hover": "#93C5FD48",
    "fg": "#E2ECF7",                    # Crisp Snow-Ice White
    "fg_muted": "#94B0CE",              # Muted Frost Slate
    "fg_dim": "#5A7696",                # Quiet Polar Grey-Blue
    "comment": "#5A7696",
    "docstring": "#7AA8D6",
    "badge_fg": "#FFFFFF",
    "ansi_black": "#090E16",
    "ansi_white": "#E2ECF7",
    # Calm Antarctic Frost Syntax Palette
    "red_star": "#7CC0F8",              # Keywords: Clear Glacier Sky
    "orange_blend": "#94B8D8",          # Parameters: Frost Steel
    "yellow_star": "#A8C7FA",           # Types: Pale Arctic Ice
    "green_star": "#7AC7D4",            # Strings: Frozen Seafoam-Ice
    "teal_blend": "#88B8E6",            # Operators: Pack-Ice Blue
    "blue_star": "#9CD2FC",             # Functions: Crisp Ice Blue
    "blue_accent": "#3B82F6",
    "prop_blue": "#B0CBE8",             # Properties: Pale Snow-Slate
    "purple_blend": "#8CA8E8",          # Numbers: Polar Twilight Blue
}

# 3. 💚 PURE GREEN GRADIENT — LIGHT ("Glacial Mint Ice" 7%–22%)
PURE_GREEN_LIGHT = {
    "gradient_stops": [
        "#D6F3E0",  # 0.00: 22% Mint Glacier Ice
        "#E5F8EC",  # 0.33: 15% Jade Mist
        "#F2FCF6",  # 0.66: 10% Botanical Snow
        "#FAFEFC",  # 1.00: 7% Alpine Snow White
    ],
    "line_num": "#749C84",
    "selection": "#16A34A22",
    "selection_inactive": "#16A34A12",
    "selection_highlight": "#22C55E1E",
    "word_highlight": "#10B98118",
    "word_highlight_strong": "#15803D22",
    "find_match": "#22C55E38",
    "find_match_highlight": "#16A34A20",
    "scrollbar": "#4ADE8038",
    "scrollbar_hover": "#22C55E58",
    "fg": "#102419",
    "fg_muted": "#355944",
    "fg_dim": "#638A73",
    "comment": "#638A73",
    "docstring": "#286140",
    "badge_fg": "#FFFFFF",
    "ansi_black": "#102419",
    "ansi_white": "#EBF7F0",
    "red_star": "#185936",
    "orange_blend": "#38664A",
    "yellow_star": "#23533D",
    "green_star": "#1F6642",
    "teal_blend": "#266B5A",
    "blue_star": "#14634C",
    "blue_accent": "#16A34A",
    "prop_blue": "#2D523E",
    "purple_blend": "#1F5C4B",
}

# 4. 💚 PURE GREEN GRADIENT — DARK ("Nordic Pine Night")
PURE_GREEN_DARK = {
    "gradient_stops": [
        "#08100C",  # 0.00: Deep Pine Night
        "#0C1812",  # 0.33: Quiet Conifer Slate
        "#112219",  # 0.66: Muted Moss Slate
        "#152A1F",  # 1.00: Dark Alpine Canopy
    ],
    "line_num": "#4E7860",
    "selection": "#22C55E30",
    "selection_inactive": "#22C55E1A",
    "selection_highlight": "#4ADE8022",
    "word_highlight": "#34D3991E",
    "word_highlight_strong": "#4ADE802C",
    "find_match": "#4ADE8038",
    "find_match_highlight": "#22C55E24",
    "scrollbar": "#4ADE8028",
    "scrollbar_hover": "#86EFAC48",
    "fg": "#E2F2E8",                    # Crisp Mint-Snow White
    "fg_muted": "#96C4A8",              # Muted Celadon Slate
    "fg_dim": "#588268",                # Quiet Moss Grey-Green
    "comment": "#588268",
    "docstring": "#78BFA0",
    "badge_fg": "#FFFFFF",
    "ansi_black": "#08100C",
    "ansi_white": "#E2F2E8",
    "red_star": "#7AD99E",              # Keywords: Clear Glacial Mint
    "orange_blend": "#98C9AA",          # Parameters: Frosted Sage
    "yellow_star": "#A6E3BD",           # Types: Pale Celadon Ice
    "green_star": "#74C796",            # Strings: Soft Seafoam Green
    "teal_blend": "#7EC9B8",            # Operators: Eucalyptus Frost
    "blue_star": "#94E0B2",             # Functions: Crisp Alpine Mint
    "blue_accent": "#22C55E",
    "prop_blue": "#B0D9C0",             # Properties: Pale Sage-Slate
    "purple_blend": "#85CCB1",          # Numbers: Muted Jade Frost
}

# 5. 🩷 PURE PINK GRADIENT — LIGHT ("Frosted Sakura Ice" 7%–22%)
PURE_PINK_LIGHT = {
    "gradient_stops": [
        "#FADCEB",  # 0.00: 22% Sakura Ice
        "#FCE8F2",  # 0.33: 15% Rosewater Mist
        "#FEF3F8",  # 0.66: 10% Porcelain Blush
        "#FFFBFE",  # 1.00: 7% Rose-Snow White
    ],
    "line_num": "#A37A8E",
    "selection": "#DB277720",
    "selection_inactive": "#DB277712",
    "selection_highlight": "#EC48991C",
    "word_highlight": "#F43F5E16",
    "word_highlight_strong": "#BE185D22",
    "find_match": "#EC489935",
    "find_match_highlight": "#DB27771E",
    "scrollbar": "#F472B638",
    "scrollbar_hover": "#EC489958",
    "fg": "#26111B",
    "fg_muted": "#5E384A",
    "fg_dim": "#8F6579",
    "comment": "#8F6579",
    "docstring": "#7A3354",
    "badge_fg": "#FFFFFF",
    "ansi_black": "#26111B",
    "ansi_white": "#FBEBF2",
    "red_star": "#7A244B",
    "orange_blend": "#6B3B52",
    "yellow_star": "#752946",
    "green_star": "#6E3550",
    "teal_blend": "#7D3C5A",
    "blue_star": "#8C2D56",
    "blue_accent": "#DB2777",
    "prop_blue": "#5C3246",
    "purple_blend": "#823059",
}

# 6. 🩷 PURE PINK GRADIENT — DARK ("Muted Velvet Rose")
PURE_PINK_DARK = {
    "gradient_stops": [
        "#11090E",  # 0.00: Deep Rosewood Night
        "#1A0F16",  # 0.33: Muted Mulberry Slate
        "#23141E",  # 0.66: Quiet Plum Charcoal
        "#2B1925",  # 1.00: Dark Velvet Berry
    ],
    "line_num": "#875A70",
    "selection": "#EC489930",
    "selection_inactive": "#EC48991A",
    "selection_highlight": "#F472B622",
    "word_highlight": "#FB71851E",
    "word_highlight_strong": "#F472B62C",
    "find_match": "#FB718538",
    "find_match_highlight": "#EC489924",
    "scrollbar": "#F472B628",
    "scrollbar_hover": "#F9A8D448",
    "fg": "#F7E8F0",                    # Crisp Porcelain White
    "fg_muted": "#CFA0B7",              # Muted Rose Slate
    "fg_dim": "#8C6277",                # Quiet Mauve Grey
    "comment": "#8C6277",
    "docstring": "#D996B8",
    "badge_fg": "#FFFFFF",
    "ansi_black": "#11090E",
    "ansi_white": "#F7E8F0",
    "red_star": "#E89BBF",              # Keywords: Soft Frosted Sakura
    "orange_blend": "#D49AB5",          # Parameters: Dusty Blush
    "yellow_star": "#F2B6D2",           # Types: Pale Rose Ice
    "green_star": "#D996B8",            # Strings: Muted Camellia Pink
    "teal_blend": "#CFA0C4",            # Operators: Heather Frost
    "blue_star": "#F0A8C8",             # Functions: Clear Rosewater
    "blue_accent": "#DB2777",
    "prop_blue": "#E0B8CB",             # Properties: Pale Mauve-Slate
    "purple_blend": "#DE92B8",          # Numbers: Muted Peony Rose
}

# 7. 💛 PURE YELLOW GRADIENT — LIGHT ("Sunlit Champagne Ice" 7%–22%)
PURE_YELLOW_LIGHT = {
    "gradient_stops": [
        "#FBECC0",  # 0.00: 22% Honey-Gold Ice
        "#FDF3D6",  # 0.33: 15% Buttercup Mist
        "#FEF9EA",  # 0.66: 10% Ivory Cream
        "#FFFEFA",  # 1.00: 7% Warm Snow White
    ],
    "line_num": "#9C8865",
    "selection": "#D9770620",
    "selection_inactive": "#D9770612",
    "selection_highlight": "#F59E0B1E",
    "word_highlight": "#EAB30818",
    "word_highlight_strong": "#B4530922",
    "find_match": "#F59E0B38",
    "find_match_highlight": "#D977061E",
    "scrollbar": "#FBBF2440",
    "scrollbar_hover": "#F59E0B58",
    "fg": "#241C0E",
    "fg_muted": "#59482B",
    "fg_dim": "#877352",
    "comment": "#877352",
    "docstring": "#705324",
    "badge_fg": "#FFFFFF",
    "ansi_black": "#241C0E",
    "ansi_white": "#FAF3DF",
    "red_star": "#6E470B",
    "orange_blend": "#664C22",
    "yellow_star": "#754A0E",
    "green_star": "#5E4B24",
    "teal_blend": "#6B532A",
    "blue_star": "#7A5211",
    "blue_accent": "#D97706",
    "prop_blue": "#544326",
    "purple_blend": "#7D4E14",
}

# 8. 💛 PURE YELLOW GRADIENT — DARK ("Warm Espresso Bronze")
PURE_YELLOW_DARK = {
    "gradient_stops": [
        "#110E08",  # 0.00: Deep Espresso Night
        "#19150D",  # 0.33: Dark Umber Slate
        "#221C12",  # 0.66: Muted Bronze Charcoal
        "#2A2317",  # 1.00: Warm Roast Slate
    ],
    "line_num": "#857352",
    "selection": "#EAB3082E",
    "selection_inactive": "#EAB30818",
    "selection_highlight": "#FACC1520",
    "word_highlight": "#FBBF241C",
    "word_highlight_strong": "#FACC152A",
    "find_match": "#FACC1538",
    "find_match_highlight": "#EAB30822",
    "scrollbar": "#FACC1526",
    "scrollbar_hover": "#FDE04745",
    "fg": "#F7F0E2",                    # Crisp Warm Ivory
    "fg_muted": "#C9B792",              # Muted Sand Slate
    "fg_dim": "#877758",                # Quiet Umber Grey
    "comment": "#877758",
    "docstring": "#CFB57E",
    "badge_fg": "#110E08",
    "ansi_black": "#110E08",
    "ansi_white": "#F7F0E2",
    "red_star": "#E0BE6E",              # Keywords: Soft Champagne Gold
    "orange_blend": "#C9AE74",          # Parameters: Warm Sand
    "yellow_star": "#EDD28E",           # Types: Pale Wheat Gold
    "green_star": "#D4B475",            # Strings: Muted Honey-Sand
    "teal_blend": "#C7B083",            # Operators: Warm Linen
    "blue_star": "#E8C87D",             # Functions: Clear Sunlit Gold
    "blue_accent": "#D97706",
    "prop_blue": "#DBC8A0",             # Properties: Pale Ivory-Slate
    "purple_blend": "#D9B262",          # Numbers: Muted Amber Gold
}

# 9. 💜 PURE PURPLE GRADIENT — LIGHT ("Frosted Lavender Ice" 7%–22%)
PURE_PURPLE_LIGHT = {
    "gradient_stops": [
        "#E4D9FC",  # 0.00: 22% Wisteria Ice
        "#EDE6FD",  # 0.33: 15% Lavender Mist
        "#F5F2FE",  # 0.66: 10% Orchid Snow
        "#FCFBFF",  # 1.00: 7% Twilight Snow White
    ],
    "line_num": "#8678A8",
    "selection": "#7C3AED20",
    "selection_inactive": "#7C3AED12",
    "selection_highlight": "#8B5CF61C",
    "word_highlight": "#9333EA16",
    "word_highlight_strong": "#6D28D922",
    "find_match": "#8B5CF635",
    "find_match_highlight": "#7C3AED1E",
    "scrollbar": "#A78BFA38",
    "scrollbar_hover": "#8B5CF658",
    "fg": "#1A122B",
    "fg_muted": "#4A3B69",
    "fg_dim": "#78689A",
    "comment": "#78689A",
    "docstring": "#4E3580",
    "badge_fg": "#FFFFFF",
    "ansi_black": "#1A122B",
    "ansi_white": "#F2EDFE",
    "red_star": "#482882",
    "orange_blend": "#543D7A",
    "yellow_star": "#592E8A",
    "green_star": "#3E3875",
    "teal_blend": "#4C3F7D",
    "blue_star": "#52328C",
    "blue_accent": "#7C3AED",
    "prop_blue": "#433466",
    "purple_blend": "#5E3594",
}

# 10. 💜 PURE PURPLE GRADIENT — DARK ("Deep Cosmic Slate")
PURE_PURPLE_DARK = {
    "gradient_stops": [
        "#0D0A14",  # 0.00: Deep Twilight Void
        "#141020",  # 0.33: Muted Amethyst Slate
        "#1C162D",  # 0.66: Quiet Indigo Charcoal
        "#231C38",  # 1.00: Dark Wisteria Slate
    ],
    "line_num": "#6E5D94",
    "selection": "#8B5CF630",
    "selection_inactive": "#8B5CF61A",
    "selection_highlight": "#A78BFA22",
    "word_highlight": "#C084FC1E",
    "word_highlight_strong": "#A78BFA2C",
    "find_match": "#C084FC38",
    "find_match_highlight": "#8B5CF624",
    "scrollbar": "#A78BFA28",
    "scrollbar_hover": "#D8B4FE48",
    "fg": "#EFEBF9",                    # Crisp Lilac-Snow White
    "fg_muted": "#B6A6D9",              # Muted Wisteria Slate
    "fg_dim": "#756599",                # Quiet Lavender Grey
    "comment": "#756599",
    "docstring": "#B29CE0",
    "badge_fg": "#FFFFFF",
    "ansi_black": "#0D0A14",
    "ansi_white": "#EFEBF9",
    "red_star": "#B99EF0",              # Keywords: Soft Frosted Lavender
    "orange_blend": "#B5A0DC",          # Parameters: Dusty Lilac
    "yellow_star": "#CBB6F8",           # Types: Pale Wisteria Ice
    "green_star": "#A599E8",            # Strings: Muted Periwinkle Frost
    "teal_blend": "#ACA3DE",            # Operators: Iris Mist
    "blue_star": "#C3ADEF",             # Functions: Clear Twilight Lilac
    "blue_accent": "#7C3AED",
    "prop_blue": "#C6B8E8",             # Properties: Pale Lavender-Slate
    "purple_blend": "#B898ED",          # Numbers: Muted Amethyst Frost
}

# ===========================================================================
# PRISM 4-COLOR RAINBOW THEMES (Dialed down to Soft Pearl & Subtle Aurora Slate)
# ===========================================================================
PRISM_RAINBOW_DARK = {
    "gradient_stops": [
        "#0E131D",
        "#0D1618",
        "#0F1714",
        "#151410",
        "#161116",
    ],
    "line_num": "#566E87",
    "selection": "#3B82F630",
    "selection_inactive": "#3B82F61A",
    "selection_highlight": "#60A5FA22",
    "word_highlight": "#34A85320",
    "word_highlight_strong": "#4285F42C",
    "find_match": "#FBBC0438",
    "find_match_highlight": "#34A85324",
    "scrollbar": "#60A5FA28",
    "scrollbar_hover": "#93C5FD48",
    "fg": "#E6EDF5",
    "fg_muted": "#9EB2C7",
    "fg_dim": "#637A91",
    "comment": "#637A91",
    "docstring": "#7ABFA0",
    "badge_fg": "#FFFFFF",
    "ansi_black": "#0C1017",
    "ansi_white": "#E6EDF5",
    "red_star": "#E57368",
    "orange_blend": "#E09F67",
    "yellow_star": "#DEC16E",
    "green_star": "#6BC48D",
    "teal_blend": "#68BFC4",
    "blue_star": "#78ADE8",
    "blue_accent": "#3B82F6",
    "prop_blue": "#94BBE3",
    "purple_blend": "#B094E0",
}

PRISM_RAINBOW_LIGHT = {
    "gradient_stops": [
        "#F9F3DF",
        "#EAF7EE",
        "#EBF6F8",
        "#ECF3FC",
        "#FAF0EE",
    ],
    "line_num": "#6E859C",
    "selection": "#3B82F622",
    "selection_inactive": "#3B82F612",
    "selection_highlight": "#60A5FA1E",
    "word_highlight": "#34A85318",
    "word_highlight_strong": "#4285F422",
    "find_match": "#FBBC0440",
    "find_match_highlight": "#34A85320",
    "scrollbar": "#3B82F626",
    "scrollbar_hover": "#2563EB45",
    "fg": "#14202E",
    "fg_muted": "#3F556B",
    "fg_dim": "#6E859C",
    "comment": "#6E859C",
    "docstring": "#266644",
    "badge_fg": "#FFFFFF",
    "ansi_black": "#14202E",
    "ansi_white": "#F2F6FA",
    "red_star": "#A8322B",
    "orange_blend": "#8F4F1A",
    "yellow_star": "#7D5914",
    "green_star": "#1D683B",
    "teal_blend": "#1A6473",
    "blue_star": "#1B5299",
    "blue_accent": "#2563EB",
    "prop_blue": "#2B4F78",
    "purple_blend": "#5E358C",
}

THEMES_MANIFEST = [
    {
        "label": "Pure Blue Gradient (Sky to Sapphire Light)",
        "uiTheme": "vs",
        "file": "pure-blue-light-color-theme.json",
        "palette": PURE_BLUE_LIGHT,
        "type": "light",
    },
    {
        "label": "Pure Blue Gradient (Abyssal Cobalt Dark)",
        "uiTheme": "vs-dark",
        "file": "pure-blue-dark-color-theme.json",
        "palette": PURE_BLUE_DARK,
        "type": "dark",
    },
    {
        "label": "Pure Green Gradient (Mint to Emerald Light)",
        "uiTheme": "vs",
        "file": "pure-green-light-color-theme.json",
        "palette": PURE_GREEN_LIGHT,
        "type": "light",
    },
    {
        "label": "Pure Green Gradient (Forest Emerald Dark)",
        "uiTheme": "vs-dark",
        "file": "pure-green-dark-color-theme.json",
        "palette": PURE_GREEN_DARK,
        "type": "dark",
    },
    {
        "label": "Pure Pink Gradient (Sakura to Rose Light)",
        "uiTheme": "vs",
        "file": "pure-pink-light-color-theme.json",
        "palette": PURE_PINK_LIGHT,
        "type": "light",
    },
    {
        "label": "Pure Pink Gradient (Velvet Berry Dark)",
        "uiTheme": "vs-dark",
        "file": "pure-pink-dark-color-theme.json",
        "palette": PURE_PINK_DARK,
        "type": "dark",
    },
    {
        "label": "Pure Yellow Gradient (Sunlit Honey Light)",
        "uiTheme": "vs",
        "file": "pure-yellow-light-color-theme.json",
        "palette": PURE_YELLOW_LIGHT,
        "type": "light",
    },
    {
        "label": "Pure Yellow Gradient (Golden Amber Dark)",
        "uiTheme": "vs-dark",
        "file": "pure-yellow-dark-color-theme.json",
        "palette": PURE_YELLOW_DARK,
        "type": "dark",
    },
    {
        "label": "Pure Purple Gradient (Lavender to Amethyst Light)",
        "uiTheme": "vs",
        "file": "pure-purple-light-color-theme.json",
        "palette": PURE_PURPLE_LIGHT,
        "type": "light",
    },
    {
        "label": "Pure Purple Gradient (Cosmic Amethyst Dark)",
        "uiTheme": "vs-dark",
        "file": "pure-purple-dark-color-theme.json",
        "palette": PURE_PURPLE_DARK,
        "type": "dark",
    },
    {
        "label": "Prism Rainbow Gradient (Pastel 4-Color Light)",
        "uiTheme": "vs",
        "file": "prism-rainbow-light-color-theme.json",
        "palette": PRISM_RAINBOW_LIGHT,
        "type": "light",
    },
    {
        "label": "Prism Rainbow Gradient (Aurora 4-Color Dark)",
        "uiTheme": "vs-dark",
        "file": "prism-rainbow-dark-color-theme.json",
        "palette": PRISM_RAINBOW_DARK,
        "type": "dark",
    },
]

def get_all_themes_manifest() -> list[dict]:
    manifest = list(THEMES_MANIFEST)
    if CUSTOM_THEMES_JSON.exists():
        try:
            custom_items = json.loads(CUSTOM_THEMES_JSON.read_text(encoding="utf-8"))
            existing_files = {m["file"] for m in manifest}
            for item in custom_items:
                if item["file"] in existing_files:
                    manifest = [m if m["file"] != item["file"] else item for m in manifest]
                else:
                    manifest.append(item)
        except Exception as exc:
            print(f"[WARN] Could not load {CUSTOM_THEMES_JSON}: {exc}")
    return manifest


def build_package_json(manifest: list[dict]) -> dict:
    return {
        "name": "vscode-gradient-themes",
        "displayName": "VSCode Gradient Themes",
        "description": "Full-workbench atmospheric gradient meshes, single-hue ombré themes, and a 0ms Status Bar (🎲) mood roller with 30 curated palettes.",
        "version": "67.67.67",
        "publisher": "iamqazolp",
        "license": "MIT",
        "icon": "media/icon.png",
        "galleryBanner": {
            "color": "#f4f8ff",
            "theme": "light",
        },
        "homepage": "https://github.com/iamqazolp/vscode-gradient-themes#readme",
        "repository": {
            "type": "git",
            "url": "https://github.com/iamqazolp/vscode-gradient-themes.git",
        },
        "bugs": {
            "url": "https://github.com/iamqazolp/vscode-gradient-themes/issues",
        },
        "qna": "marketplace",
        "engines": {"vscode": "^1.75.0"},
        "categories": ["Themes"],
        "keywords": [
            "gradient",
            "rainbow",
            "randomizer",
            "antarctica",
            "glacial",
            "pastel",
            "minimal",
            "dark",
            "light",
            "theme",
            "vscode",
            "antigravity",
        ],
        "scripts": {
            "package": "npx --yes @vscode/vsce package --baseImagesUrl https://raw.githubusercontent.com/iamqazolp/vscode-gradient-themes/main --baseContentUrl https://github.com/iamqazolp/vscode-gradient-themes/blob/main",
            "publish": "npx --yes @vscode/vsce publish --baseImagesUrl https://raw.githubusercontent.com/iamqazolp/vscode-gradient-themes/main --baseContentUrl https://github.com/iamqazolp/vscode-gradient-themes/blob/main",
            "publish:ovsx": "npx --yes ovsx publish",
        },
        "activationEvents": ["onStartupFinished"],
        "main": "./extension.js",
        "contributes": {
            "themes": [
                {
                    "label": item["label"],
                    "uiTheme": item["uiTheme"],
                    "path": f"./themes/{item['file']}",
                }
                for item in manifest
            ],
            "commands": [
                {
                    "command": "gradientThemes.enableGradientOverlay",
                    "title": "Gradient Themes: Enable 4-Color Rainbow Gradient & Live Randomizer",
                },
                {
                    "command": "gradientThemes.disableGradientOverlay",
                    "title": "Gradient Themes: Disable 4-Color Rainbow Gradient Overlay",
                },
                {
                    "command": "gradientThemes.rollRandomTheme",
                    "title": "Gradient Themes: Roll Random Single-Color Glacial Theme",
                },
                {
                    "command": "gradientThemes.openPreview",
                    "title": "Gradient Themes: Open Interactive Theme & Gradient Preview",
                    "icon": "$(symbol-color)",
                },
                {
                    "command": "gradientThemes.openGitHub",
                    "title": "Gradient Themes: Open GitHub Repository",
                    "icon": "$(github)",
                },
                {
                    "command": "gradientThemes.reportIssue",
                    "title": "Gradient Themes: Report Issue on GitHub (with Diagnostics)",
                    "icon": "$(bug)",
                },
                {
                    "command": "gradientThemes.showTelemetryStats",
                    "title": "Gradient Themes: Show Extension Telemetry & Marketplace Stats",
                    "icon": "$(graph)",
                },
            ],
            "configuration": {
                "title": "VSCode Gradient Themes",
                "properties": {
                    "gradientThemes.autoEnableOverlay": {
                        "type": "boolean",
                        "default": True,
                        "description": "Automatically inject and keep the 4-Color Gradient Mesh & Status Bar (🎲) Randomizer updated without requiring external extensions.",
                    },
                    "gradientThemes.telemetry": {
                        "type": "boolean",
                        "default": True,
                        "description": "Enable anonymous extension usage and error telemetry (automatically disabled for the extension author and when VSCode telemetry is off).",
                    },
                },
            },
        },
    }


def register_extension(ext_id: str, folder_name: str, ext_path: Path):
    if not VSCODE_EXT_JSON.exists():
        return
    try:
        ext_list = json.loads(VSCODE_EXT_JSON.read_text(encoding="utf-8"))
        ext_list = [e for e in ext_list if e.get("identifier", {}).get("id") != ext_id]
        ext_list.append({
            "identifier": {"id": ext_id},
            "version": "67.67.67",
            "location": {
                "$mid": 1,
                "path": str(ext_path),
                "scheme": "file",
            },
            "relativeLocation": folder_name,
        })
        VSCODE_EXT_JSON.write_text(json.dumps(ext_list, indent=2), encoding="utf-8")
    except Exception as exc:
        print(f"[WARN] Could not update extensions.json: {exc}")


def main():
    manifest = get_all_themes_manifest()
    pkg_json = build_package_json(manifest)

    built_themes = {}
    for item in manifest:
        theme_obj = make_ombre_theme(item["label"], item["type"], item["palette"])
        built_themes[item["file"]] = theme_obj

    # Write to REPO_DIR and installed extension folder
    for target_root in [REPO_DIR, EXT_DIR]:
        if target_root == REPO_DIR or target_root.exists():
            t_dir = target_root / "themes"
            t_dir.mkdir(parents=True, exist_ok=True)
            (target_root / "package.json").write_text(json.dumps(pkg_json, indent=2) + "\n", encoding="utf-8")
            for filename, theme_obj in built_themes.items():
                (t_dir / filename).write_text(json.dumps(theme_obj, indent=2) + "\n", encoding="utf-8")

    register_extension(
        "iamqazolp.vscode-gradient-themes",
        "iamqazolp.vscode-gradient-themes-67.67.67",
        EXT_DIR,
    )

    print(f"[OK] Built {len(built_themes)} themes across {REPO_DIR.name} and {EXT_DIR.name}.")


if __name__ == "__main__":
    main()
