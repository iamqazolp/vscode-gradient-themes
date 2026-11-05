"use strict";

const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

const THEMES = [
  "Pure Blue Gradient (Sky to Sapphire Light)",
  "Pure Blue Gradient (Abyssal Cobalt Dark)",
  "Pure Green Gradient (Mint to Emerald Light)",
  "Pure Green Gradient (Forest Emerald Dark)",
  "Pure Pink Gradient (Sakura to Rose Light)",
  "Pure Pink Gradient (Velvet Berry Dark)",
  "Pure Yellow Gradient (Sunlit Honey Light)",
  "Pure Yellow Gradient (Golden Amber Dark)",
  "Pure Purple Gradient (Lavender to Amethyst Light)",
  "Pure Purple Gradient (Cosmic Amethyst Dark)",
  "Gemini Prism Light (Pastel 4-Color Star)",
  "Gemini Prism Dark (4-Color Star)",
];

function toFileUrl(fsPath) {
  let normalized = fsPath.replace(/\\/g, "/");
  if (!normalized.startsWith("/")) {
    normalized = "/" + normalized;
  }
  return "file://" + normalized;
}

function getAssetUrls(context) {
  const cssPath = path.join(context.extensionPath, "css", "gemini-star-gradient-light.css");
  const jsPath = path.join(context.extensionPath, "js", "gemini-gradient-randomizer.js");
  return {
    cssUrl: toFileUrl(cssPath),
    jsUrl: toFileUrl(jsPath),
  };
}

function isGeminiAssetUrl(url) {
  return (
    typeof url === "string" &&
    (url.includes("gemini-star-gradient-") || url.includes("gemini-gradient-randomizer.js"))
  );
}

async function enableGradientOverlay(context, silent = false) {
  const { cssUrl, jsUrl } = getAssetUrls(context);
  const config = vscode.workspace.getConfiguration();

  const existing = config.get("vscode_custom_css.imports") || [];
  const filtered = Array.isArray(existing)
    ? existing.filter((u) => !isGeminiAssetUrl(u))
    : [];
  const updated = [...filtered, cssUrl, jsUrl];

  await config.update("vscode_custom_css.imports", updated, vscode.ConfigurationTarget.Global);
  await config.update("terminal.integrated.gpuAcceleration", "off", vscode.ConfigurationTarget.Global);
  await config.update("terminal.integrated.enableImages", true, vscode.ConfigurationTarget.Global);
  await config.update("editor.guides.bracketPairs", false, vscode.ConfigurationTarget.Global);
  await config.update("editor.bracketPairColorization.enabled", false, vscode.ConfigurationTarget.Global);

  if (silent) {
    return;
  }

  const customCssExt = vscode.extensions.getExtension("be5invis.vscode-custom-css");
  if (!customCssExt) {
    const choice = await vscode.window.showInformationMessage(
      "Gemini Prism CSS & Randomizer paths configured! Install 'Custom CSS and JS Loader' (be5invis.vscode-custom-css) to activate the full-window gradient overlay.",
      "Install Custom CSS Loader"
    );
    if (choice === "Install Custom CSS Loader") {
      await vscode.commands.executeCommand(
        "workbench.extensions.installExtension",
        "be5invis.vscode-custom-css"
      );
    }
    return;
  }

  const action = await vscode.window.showInformationMessage(
    "Gemini Prism 7%–22% Rainbow Gradient & Live Randomizer configured! Reload Custom CSS and JS now to apply.",
    "Reload Custom CSS and JS"
  );
  if (action === "Reload Custom CSS and JS") {
    await vscode.commands.executeCommand("extension.updateCustomCss");
  }
}

async function disableGradientOverlay() {
  const config = vscode.workspace.getConfiguration();
  const existing = config.get("vscode_custom_css.imports") || [];
  const filtered = Array.isArray(existing)
    ? existing.filter((u) => !isGeminiAssetUrl(u))
    : [];

  await config.update("vscode_custom_css.imports", filtered, vscode.ConfigurationTarget.Global);

  const action = await vscode.window.showInformationMessage(
    "Removed Gemini Prism overlay from vscode_custom_css.imports.",
    "Reload Custom CSS and JS"
  );
  if (action === "Reload Custom CSS and JS") {
    await vscode.commands.executeCommand("extension.updateCustomCss");
  }
}

function getAvailableThemes(context) {
  try {
    const pkgPath = path.join(context.extensionPath, "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    const themes = (pkg.contributes && pkg.contributes.themes) || [];
    if (themes.length > 0) {
      return themes.map((t) => t.label);
    }
  } catch (_) {}
  return THEMES;
}

async function rollRandomTheme(context) {
  const config = vscode.workspace.getConfiguration();
  const current = config.get("workbench.colorTheme");
  const allThemes = getAvailableThemes(context);
  const candidates = allThemes.filter((t) => t !== current);
  const picked = candidates[Math.floor(Math.random() * candidates.length)];
  await config.update("workbench.colorTheme", picked, vscode.ConfigurationTarget.Global);
  vscode.window.setStatusBarMessage(`🎨 Theme: ${picked}`, 4000);
}

function openPreviewPanel(context) {
  const panel = vscode.window.createWebviewPanel(
    "geminiPrismPreview",
    "Gemini Prism & Glacial Themes Preview",
    vscode.ViewColumn.One,
    { enableScripts: true }
  );
  const htmlPath = path.join(context.extensionPath, "theme_preview.html");
  if (fs.existsSync(htmlPath)) {
    panel.webview.html = fs.readFileSync(htmlPath, "utf8");
  } else {
    panel.webview.html = "<html><body><h2>Gemini Prism & Antarctic Frost Gradient Themes</h2></body></html>";
  }
}

async function autoSyncExistingImportsOnStartup(context) {
  try {
    const config = vscode.workspace.getConfiguration();
    const existing = config.get("vscode_custom_css.imports");
    if (!Array.isArray(existing) || !existing.some(isGeminiAssetUrl)) {
      return;
    }
    const { cssUrl, jsUrl } = getAssetUrls(context);
    if (!existing.includes(cssUrl) || !existing.includes(jsUrl)) {
      const filtered = existing.filter((u) => !isGeminiAssetUrl(u));
      await config.update(
        "vscode_custom_css.imports",
        [...filtered, cssUrl, jsUrl],
        vscode.ConfigurationTarget.Global
      );
    }
  } catch (_) {}
}

function activate(context) {
  autoSyncExistingImportsOnStartup(context);

  context.subscriptions.push(
    vscode.commands.registerCommand("geminiPrism.enableGradientOverlay", () =>
      enableGradientOverlay(context, false)
    ),
    vscode.commands.registerCommand("geminiPrism.disableGradientOverlay", () =>
      disableGradientOverlay()
    ),
    vscode.commands.registerCommand("geminiPrism.rollRandomTheme", () =>
      rollRandomTheme(context)
    ),
    vscode.commands.registerCommand("geminiPrism.openPreview", () =>
      openPreviewPanel(context)
    )
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
