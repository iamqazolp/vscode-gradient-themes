#!/usr/bin/env python3
"""Install or update the VS Code Gradient Themes (`iamqazolp.vscode-gradient-themes`) extension."""

from __future__ import annotations

import json
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


def install_extension(repo_root: Path) -> list[Path]:
    pkg = json.loads((repo_root / "package.json").read_text(encoding="utf-8"))
    ext_version = str(pkg.get("version", "1.1.0"))
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

        installed_paths.append(target)

    return installed_paths


if __name__ == "__main__":
    root = Path(__file__).resolve().parent
    paths = install_extension(root)
    for p in paths:
        print(f"[OK] Installed to: {p}")
