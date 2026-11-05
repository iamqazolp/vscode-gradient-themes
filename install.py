#!/usr/bin/env python3
"""Install or update the VSCode Gradient Themes (`iamqazolp.vscode-gradient-themes`) extension."""

from __future__ import annotations

import hashlib
import json
import re
import shutil
from pathlib import Path

EXT_ID = "iamqazolp.vscode-gradient-themes"
COPY_ITEMS = (
    "extension.js",
    "package.json",
    "themes",
    "css",
    "js",
    "media",
    "theme_preview.html",
    "README.md",
    "CHANGELOG.md",
    "LICENSE",
)

WORKBENCH_CANDIDATES = (
    Path("/Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/code/electron-browser/workbench/workbench.html"),
    Path("/Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html"),
    Path("/Applications/Cursor.app/Contents/Resources/app/out/vs/code/electron-browser/workbench/workbench.html"),
    Path("/Applications/Windsurf.app/Contents/Resources/app/out/vs/code/electron-browser/workbench/workbench.html"),
)


def strip_gradient_blocks(html: str) -> str:
    cleaned = re.sub(
        r"<!-- !! VSCODE-GRADIENT-THEMES-START[\s\S]*?<!-- !! VSCODE-GRADIENT-THEMES-END !! -->\n*",
        "",
        html,
    )
    if (
        "<!-- !! VSCODE-CUSTOM-CSS-START !! -->" in cleaned
        and "PRISM 4-COLOR RAINBOW BLEND ENGINE" in cleaned
    ):
        cleaned = re.sub(r"<!-- !! VSCODE-CUSTOM-CSS-SESSION-ID [\w-]+ !! -->\n*", "", cleaned)
        cleaned = re.sub(
            r"<!-- !! VSCODE-CUSTOM-CSS-START !! -->[\s\S]*?<!-- !! VSCODE-CUSTOM-CSS-END !! -->\n*",
            "",
            cleaned,
        )
    return cleaned


def patch_local_workbench_html(repo_root: Path) -> list[Path]:
    css_text = (repo_root / "css" / "rainbow-gradient-light.css").read_text(encoding="utf-8")
    js_text = (repo_root / "js" / "gradient-randomizer.js").read_text(encoding="utf-8")
    digest = hashlib.sha1((css_text + "\n" + js_text).encode("utf-8")).hexdigest()[:16]
    block = (
        f"<!-- !! VSCODE-GRADIENT-THEMES-START {digest} !! -->\n"
        f"<style>{css_text}</style>\n"
        f"<script>{js_text}</script>\n"
        f"<!-- !! VSCODE-GRADIENT-THEMES-END !! -->"
    )

    patched: list[Path] = []
    for html_path in WORKBENCH_CANDIDATES:
        if not html_path.exists():
            continue
        try:
            html = html_path.read_text(encoding="utf-8")
            backup_path = html_path.parent / "workbench.gradient-themes.bak"
            if not backup_path.exists():
                backup_path.write_text(strip_gradient_blocks(html), encoding="utf-8")
            html = strip_gradient_blocks(html)
            html = re.sub(
                r'<meta\s+http-equiv="Content-Security-Policy"[\s\S]*?/>',
                "",
                html,
                flags=re.IGNORECASE,
            )
            if re.search(r"</html>", html, flags=re.IGNORECASE):
                html = re.sub(r"(</html>)", lambda m: f"{block}\n{m.group(1)}", html, count=1, flags=re.IGNORECASE)
            else:
                html = re.sub(r"(</head>)", lambda m: f"{block}\n{m.group(1)}", html, count=1, flags=re.IGNORECASE)
            html_path.write_text(html, encoding="utf-8")
            patched.append(html_path)
        except Exception as exc:
            print(f"[WARN] Could not patch {html_path}: {exc}")
    return patched


def install_extension(repo_root: Path) -> list[Path]:
    pkg = json.loads((repo_root / "package.json").read_text(encoding="utf-8"))
    ext_version = str(pkg.get("version", "1.2.2"))
    ext_dir_name = f"{EXT_ID}-{ext_version}"

    home = Path.home()
    ext_roots = [
        home / ".vscode" / "extensions",
        home / ".antigravity" / "extensions",
        home / ".cursor" / "extensions",
    ]

    installed_paths: list[Path] = []
    for idx, root in enumerate(ext_roots):
        if idx > 0 and not root.exists():
            continue
        root.mkdir(parents=True, exist_ok=True)
        target = root / ext_dir_name

        # Remove older version directories of the same extension
        for old_dir in root.glob(f"{EXT_ID}-*"):
            if old_dir.resolve() != target.resolve() and old_dir.resolve() != repo_root.resolve():
                if old_dir.is_symlink():
                    old_dir.unlink()
                elif old_dir.is_dir():
                    shutil.rmtree(old_dir, ignore_errors=True)

        if repo_root.resolve() != target.resolve():
            if target.is_symlink():
                target.unlink()
            elif target.is_dir():
                shutil.rmtree(target)
            target.mkdir(parents=True, exist_ok=True)
            for item_name in COPY_ITEMS:
                src = repo_root / item_name
                if not src.exists():
                    continue
                dst = target / item_name
                if src.is_dir():
                    shutil.copytree(
                        src,
                        dst,
                        ignore=shutil.ignore_patterns("__pycache__", "*.pyc", ".DS_Store"),
                    )
                else:
                    shutil.copy2(src, dst)

        ext_json = root / "extensions.json"
        if ext_json.exists():
            try:
                ext_list = json.loads(ext_json.read_text(encoding="utf-8"))
                ext_list = [
                    e
                    for e in ext_list
                    if str(e.get("identifier", {}).get("id", "")).lower() != EXT_ID.lower()
                ]
                ext_list.append(
                    {
                        "identifier": {"id": EXT_ID},
                        "version": ext_version,
                        "location": {"$mid": 1, "path": str(target), "scheme": "file"},
                        "relativeLocation": ext_dir_name,
                    }
                )
                ext_json.write_text(json.dumps(ext_list, indent=2), encoding="utf-8")
            except Exception as exc:
                print(f"[WARN] Could not update {ext_json}: {exc}")

        installed_paths.append(target)

    return installed_paths


if __name__ == "__main__":
    root = Path(__file__).resolve().parent
    paths = install_extension(root)
    for p in paths:
        print(f"[OK] Installed to: {p}")
    for wb in patch_local_workbench_html(root):
        print(f"[OK] Patched workbench HTML: {wb}")
