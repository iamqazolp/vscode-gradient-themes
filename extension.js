"use strict";

const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const os = require("os");
const crypto = require("crypto");
const https = require("https");

const EXTENSION_ID = "iamqazolp.vscode-gradient-themes";
const EXTENSION_VERSION = "1.2.0";
const GITHUB_REPO_URL = "https://github.com/iamqazolp/vscode-gradient-themes";
const GITHUB_ISSUES_URL = "https://github.com/iamqazolp/vscode-gradient-themes/issues";
const MARKETPLACE_URL =
  "https://marketplace.visualstudio.com/items?itemName=iamqazolp.vscode-gradient-themes";
const AUTHOR_USERNAMES = new Set(["iamqazolp"]);

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
  "Prism Rainbow Gradient (Pastel 4-Color Light)",
  "Prism Rainbow Gradient (Aurora 4-Color Dark)",
];

let telemetryLogger = null;
let telemetryOutputChannel = null;
let isExcludedAuthorEnv = false;
let isAuthorEnvironment = false;

function detectIsAuthorEnvironment(context) {
  try {
    if (context && context.extensionMode === vscode.ExtensionMode.Development) {
      return true;
    }
    const username = String((os.userInfo() && os.userInfo().username) || "")
      .trim()
      .toLowerCase();
    if (AUTHOR_USERNAMES.has(username)) {
      return true;
    }
    const home = os.homedir();
    if (home.toLowerCase().includes("iamqazolp")) {
      return true;
    }
    if (
      fs.existsSync(
        path.join(home, "Documents", "Projects", "vscode-gradient-themes", "install.py")
      )
    ) {
      return true;
    }
  } catch (_) {}
  return false;
}

function getAnonymousDistinctId() {
  const raw = String((vscode.env && vscode.env.machineId) || "anonymous");
  return crypto
    .createHash("sha256")
    .update(`vscode-gradient-themes:${raw}`)
    .digest("hex")
    .slice(0, 24);
}

function initTelemetry(context) {
  isExcludedAuthorEnv = detectIsAuthorEnvironment(context);
  isAuthorEnvironment = isExcludedAuthorEnv;
  telemetryOutputChannel = vscode.window.createOutputChannel("VSCode Gradient Themes");
  context.subscriptions.push(telemetryOutputChannel);

  const extVersion =
    (context &&
      context.extension &&
      context.extension.packageJSON &&
      context.extension.packageJSON.version) ||
    EXTENSION_VERSION;

  const sender = {
    sendEventData(eventName, data) {
      const enabledByCfg = vscode.workspace
        .getConfiguration("gradientThemes")
        .get("telemetry", true);
      if (!enabledByCfg || !vscode.env.isTelemetryEnabled) {
        return;
      }
      const payload = Object.assign(
        {
          distinct_id: getAnonymousDistinctId(),
          appName: vscode.env.appName || "VSCode",
          vscodeVersion: vscode.version,
          platform: process.platform,
          arch: process.arch,
          extVersion,
          colorTheme:
            vscode.workspace.getConfiguration("workbench").get("colorTheme") || "unknown",
          timestamp: new Date().toISOString(),
        },
        data || {}
      );
      if (isExcludedAuthorEnv) {
        if (telemetryOutputChannel) {
          telemetryOutputChannel.appendLine(
            `[Telemetry:AuthorExcluded] ${eventName} ${JSON.stringify(payload)}`
          );
        }
        return;
      }
      if (telemetryOutputChannel) {
        telemetryOutputChannel.appendLine(
          `[Telemetry:Event] ${eventName} ${JSON.stringify(payload)}`
        );
      }
    },
    sendErrorData(error, data) {
      if (isExcludedAuthorEnv) {
        if (telemetryOutputChannel) {
          telemetryOutputChannel.appendLine(
            `[Telemetry:AuthorExcludedError] ${error && error.message ? error.message : error}`
          );
        }
        return;
      }
      if (telemetryOutputChannel) {
        telemetryOutputChannel.appendLine(
          `[Telemetry:Error] ${error && error.message ? error.message : error} ${JSON.stringify(
            data || {}
          )}`
        );
      }
    },
  };

  if (typeof vscode.env.createTelemetryLogger === "function") {
    telemetryLogger = vscode.env.createTelemetryLogger(sender, {
      ignoreBuiltInCommonProperties: false,
    });
    context.subscriptions.push(telemetryLogger);
  }
}

function trackEvent(eventName, properties = {}) {
  try {
    if (telemetryLogger && typeof telemetryLogger.logUsage === "function") {
      telemetryLogger.logUsage(eventName, properties);
    }
  } catch (_) {}
}

function toFileUrl(fsPath) {
  let normalized = fsPath.replace(/\\/g, "/");
  if (!normalized.startsWith("/")) {
    normalized = "/" + normalized;
  }
  return "file://" + normalized;
}

function getAssetUrls(context) {
  const cssPath = path.join(context.extensionPath, "css", "rainbow-gradient-light.css");
  const jsPath = path.join(context.extensionPath, "js", "gradient-randomizer.js");
  return {
    cssPath,
    jsPath,
    cssUrl: toFileUrl(cssPath),
    jsUrl: toFileUrl(jsPath),
  };
}

function isGradientAssetUrl(url) {
  return (
    typeof url === "string" &&
    (url.includes("rainbow-gradient-") ||
      url.includes("gradient-randomizer.js") ||
      url.includes("gemini-star-gradient-") ||
      url.includes("gemini-gradient-randomizer.js"))
  );
}

/**
 * Built-in Zero-Dependency Workbench HTML Locator
 * Supports VSCode, Cursor, Windsurf, and Antigravity IDE across macOS, Linux, and Windows.
 */
function locateWorkbenchHtml() {
  const roots = [];
  if (vscode.env && vscode.env.appRoot) {
    roots.push(path.join(vscode.env.appRoot, "out"));
    roots.push(vscode.env.appRoot);
  }
  if (require.main && require.main.filename) {
    roots.push(path.dirname(require.main.filename));
  }
  if (globalThis._VSCODE_FILE_ROOT) {
    roots.push(globalThis._VSCODE_FILE_ROOT);
  }

  const subDirs = [
    path.join("vs", "code", "electron-browser", "workbench"),
    path.join("vs", "code", "electron-browser"),
    path.join("vs", "code", "electron-sandbox", "workbench"),
    path.join("vs", "code", "electron-sandbox"),
  ];
  const fileNames = [
    "workbench.html",
    "workbench.esm.html",
    "workbench-dev.html",
    "workbench-apc-extension.html",
  ];

  for (const r of roots) {
    for (const sub of subDirs) {
      const dir = path.join(r, sub);
      for (const fn of fileNames) {
        const candidate = path.join(dir, fn);
        if (fs.existsSync(candidate)) {
          return { workbenchDir: dir, htmlPath: candidate };
        }
      }
    }
  }
  return null;
}

function buildInjectionPayload(context) {
  const { cssPath, jsPath } = getAssetUrls(context);
  const cssContent = fs.readFileSync(cssPath, "utf8");
  const jsContent = fs.readFileSync(jsPath, "utf8");
  const hash = crypto
    .createHash("sha1")
    .update(cssContent + "\n" + jsContent)
    .digest("hex")
    .slice(0, 16);

  const block = [
    `<!-- !! VSCODE-GRADIENT-THEMES-START ${hash} !! -->`,
    `<style>${cssContent}</style>`,
    `<script>${jsContent}</script>`,
    `<!-- !! VSCODE-GRADIENT-THEMES-END !! -->`,
  ].join("\n");

  return { hash, block };
}

function stripGradientBlocks(html) {
  let cleaned = html.replace(
    /<!-- !! VSCODE-GRADIENT-THEMES-START[\s\S]*?<!-- !! VSCODE-GRADIENT-THEMES-END !! -->\n*/g,
    ""
  );
  // Also strip legacy duplicate block if injected earlier via vscode-custom-css
  if (
    cleaned.includes("<!-- !! VSCODE-CUSTOM-CSS-START !! -->") &&
    cleaned.includes("PRISM 4-COLOR RAINBOW BLEND ENGINE")
  ) {
    cleaned = cleaned.replace(
      /<!-- !! VSCODE-CUSTOM-CSS-SESSION-ID [\w-]+ !! -->\n*/g,
      ""
    );
    cleaned = cleaned.replace(
      /<!-- !! VSCODE-CUSTOM-CSS-START !! -->[\s\S]*?<!-- !! VSCODE-CUSTOM-CSS-END !! -->\n*/g,
      ""
    );
  }
  return cleaned;
}

async function applyWorkbenchSettings(context, enable = true) {
  const { cssUrl, jsUrl } = getAssetUrls(context);
  const config = vscode.workspace.getConfiguration();

  if (enable) {
    await config.update("terminal.integrated.gpuAcceleration", "off", vscode.ConfigurationTarget.Global);
    await config.update("terminal.integrated.enableImages", true, vscode.ConfigurationTarget.Global);
    await config.update("editor.guides.bracketPairs", false, vscode.ConfigurationTarget.Global);
    await config.update("editor.bracketPairColorization.enabled", false, vscode.ConfigurationTarget.Global);
    await config.update("gradientThemes.autoEnableOverlay", true, vscode.ConfigurationTarget.Global);

    // Keep vscode_custom_css.imports synced for users who also use Custom CSS Loader
    const existing = config.get("vscode_custom_css.imports") || [];
    const filtered = Array.isArray(existing) ? existing.filter((u) => !isGradientAssetUrl(u)) : [];
    await config.update(
      "vscode_custom_css.imports",
      [...filtered, cssUrl, jsUrl],
      vscode.ConfigurationTarget.Global
    );
  } else {
    await config.update("gradientThemes.autoEnableOverlay", false, vscode.ConfigurationTarget.Global);
    const existing = config.get("vscode_custom_css.imports") || [];
    if (Array.isArray(existing) && existing.some(isGradientAssetUrl)) {
      const filtered = existing.filter((u) => !isGradientAssetUrl(u));
      await config.update("vscode_custom_css.imports", filtered, vscode.ConfigurationTarget.Global);
    }
  }
}

/**
 * Directly patches workbench.html without requiring any external extension.
 */
async function enableGradientOverlay(context, silent = false) {
  trackEvent("command.enableGradientOverlay", { silent });
  await applyWorkbenchSettings(context, true);

  const loc = locateWorkbenchHtml();
  if (!loc) {
    if (!silent) {
      vscode.window.showWarningMessage(
        "VSCode Gradient Themes: Could not locate workbench.html to inject the gradient mesh."
      );
    }
    return false;
  }

  try {
    const { htmlPath, workbenchDir } = loc;
    const backupPath = path.join(workbenchDir, "workbench.gradient-themes.bak");
    let html = await fs.promises.readFile(htmlPath, "utf8");

    if (!fs.existsSync(backupPath)) {
      const cleanForBackup = stripGradientBlocks(html);
      await fs.promises.writeFile(backupPath, cleanForBackup, "utf8");
    }

    html = stripGradientBlocks(html);
    html = html.replace(/<meta\s+http-equiv="Content-Security-Policy"[\s\S]*?\/>/i, "");

    const { block } = buildInjectionPayload(context);
    html = html.replace(/(<\/head>)/i, `${block}\n$1`);

    await fs.promises.writeFile(htmlPath, html, "utf8");

    if (!silent) {
      const action = await vscode.window.showInformationMessage(
        "✨ VSCode Gradient Themes: 4-Color Gradient Mesh & Live 🎲 Randomizer enabled! Reload window to apply.",
        "Reload Window"
      );
      if (action === "Reload Window") {
        await vscode.commands.executeCommand("workbench.action.reloadWindow");
      }
    }
    return true;
  } catch (err) {
    if (!silent) {
      vscode.window.showErrorMessage(
        `VSCode Gradient Themes: Permission required to update workbench.html (${err.message}).`
      );
    }
    return false;
  }
}

async function disableGradientOverlay(context) {
  trackEvent("command.disableGradientOverlay");
  await applyWorkbenchSettings(context, false);

  const loc = locateWorkbenchHtml();
  if (loc) {
    try {
      const { htmlPath, workbenchDir } = loc;
      const backupPath = path.join(workbenchDir, "workbench.gradient-themes.bak");
      if (fs.existsSync(backupPath)) {
        const cleanHtml = await fs.promises.readFile(backupPath, "utf8");
        await fs.promises.writeFile(htmlPath, cleanHtml, "utf8");
      } else {
        const current = await fs.promises.readFile(htmlPath, "utf8");
        await fs.promises.writeFile(htmlPath, stripGradientBlocks(current), "utf8");
      }
    } catch (_) {}
  }

  const action = await vscode.window.showInformationMessage(
    "VSCode Gradient Themes: Full-workbench gradient overlay removed. Reload window to apply.",
    "Reload Window"
  );
  if (action === "Reload Window") {
    await vscode.commands.executeCommand("workbench.action.reloadWindow");
  }
}

/**
 * Zero-Command Auto-Setup & Auto-Update on Startup:
 * - On fresh install, automatically injects the 4-Color Gradient Mesh & 🎲 Randomizer into workbench.html
 *   and offers a single 1-click "Reload Window" button (no extra extension or commands needed).
 * - On extension updates, silently refreshes the inline CSS/JS hash inside workbench.html.
 */
async function autoSyncWorkbenchOnStartup(context) {
  try {
    const autoEnable = vscode.workspace
      .getConfiguration("gradientThemes")
      .get("autoEnableOverlay", true);
    if (!autoEnable) {
      return;
    }

    const loc = locateWorkbenchHtml();
    if (!loc) {
      return;
    }

    const currentHtml = await fs.promises.readFile(loc.htmlPath, "utf8");
    const { hash } = buildInjectionPayload(context);

    // Already up-to-date with the exact current CSS + 30-palette JS hash
    if (currentHtml.includes(`<!-- !! VSCODE-GRADIENT-THEMES-START ${hash} !! -->`)) {
      return;
    }

    const hadPreviousPatch =
      currentHtml.includes("VSCODE-GRADIENT-THEMES-START") ||
      currentHtml.includes("PRISM 4-COLOR RAINBOW BLEND ENGINE");

    const ok = await enableGradientOverlay(context, true);
    if (ok && !hadPreviousPatch) {
      const choice = await vscode.window.showInformationMessage(
        "✨ VSCode Gradient Themes: 4-Color Gradient Mesh & Live 🎲 Randomizer are ready! Click Reload Window to activate.",
        "Reload Window",
        "Disable Overlay"
      );
      if (choice === "Reload Window") {
        await vscode.commands.executeCommand("workbench.action.reloadWindow");
      } else if (choice === "Disable Overlay") {
        await disableGradientOverlay(context);
      }
    }
  } catch (_) {}
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
  trackEvent("command.rollRandomTheme", { picked });
  await config.update("workbench.colorTheme", picked, vscode.ConfigurationTarget.Global);
  vscode.window.setStatusBarMessage(`🎨 Theme: ${picked}`, 4000);
}

function openPreviewPanel(context) {
  trackEvent("command.openPreview");
  const panel = vscode.window.createWebviewPanel(
    "gradientThemesPreview",
    "VSCode Gradient Themes Preview",
    vscode.ViewColumn.One,
    { enableScripts: true }
  );
  const htmlPath = path.join(context.extensionPath, "theme_preview.html");
  if (fs.existsSync(htmlPath)) {
    panel.webview.html = fs.readFileSync(htmlPath, "utf8");
  } else {
    panel.webview.html = "<html><body><h2>VSCode Gradient Themes</h2></body></html>";
  }
}

async function openGitHubRepository() {
  trackEvent("github.openRepo");
  await vscode.env.openExternal(vscode.Uri.parse(GITHUB_REPO_URL));
}

async function openGitHubReportIssue() {
  trackEvent("github.reportIssue");
  const config = vscode.workspace.getConfiguration();
  const activeThemeName = config.get("workbench.colorTheme", "Default");
  const loc = locateWorkbenchHtml();
  let overlayPatched = false;
  if (loc && fs.existsSync(loc.htmlPath)) {
    try {
      const html = fs.readFileSync(loc.htmlPath, "utf8");
      overlayPatched =
        html.includes("VSCODE-GRADIENT-THEMES-START") ||
        html.includes("PRISM 4-COLOR RAINBOW BLEND ENGINE");
    } catch (_) {}
  }

  const title = encodeURIComponent("[Bug / Feature]: ");
  const bodyLines = [
    "### Describe the issue or feature request",
    "",
    "",
    "### Steps to reproduce (if applicable)",
    "1. ",
    "2. ",
    "",
    "### Diagnostics",
    `- **Extension**: \`${EXTENSION_ID}\` v${EXTENSION_VERSION}`,
    `- **IDE**: ${vscode.env.appName} (${vscode.version})`,
    `- **OS**: ${process.platform} (${os.release()}, ${process.arch})`,
    `- **Active Color Theme**: \`${activeThemeName}\``,
    `- **Rainbow Overlay & Randomizer**: \`${overlayPatched ? "Enabled (Built-in Engine)" : "Disabled"}\``,
  ];
  const body = encodeURIComponent(bodyLines.join("\n"));
  const issueUrl = `${GITHUB_ISSUES_URL}/new?title=${title}&body=${body}`;
  await vscode.env.openExternal(vscode.Uri.parse(issueUrl));
}

function fetchMarketplaceStats() {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      filters: [
        {
          criteria: [{ filterType: 7, value: EXTENSION_ID }],
        },
      ],
      flags: 914,
    });
    const req = https.request(
      {
        hostname: "marketplace.visualstudio.com",
        path: "/_apis/public/gallery/extensionquery",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;api-version=3.0-preview.1",
          "Content-Length": Buffer.byteLength(payload),
        },
        timeout: 5000,
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => {
          raw += chunk;
        });
        res.on("end", () => {
          try {
            const parsed = JSON.parse(raw);
            const ext =
              parsed &&
              parsed.results &&
              parsed.results[0] &&
              parsed.results[0].extensions &&
              parsed.results[0].extensions[0];
            if (!ext) {
              resolve(null);
              return;
            }
            const statsMap = {};
            for (const s of ext.statistics || []) {
              statsMap[s.statisticName] = s.value;
            }
            const latestVer =
              ext.versions && ext.versions[0] ? ext.versions[0].version : EXTENSION_VERSION;
            resolve({
              version: latestVer,
              install: statsMap.install || 0,
              downloadCount: statsMap.downloadCount || 0,
              updateCount: statsMap.updateCount || 0,
              averagerating: statsMap.averagerating || 0,
              ratingcount: statsMap.ratingcount || 0,
            });
          } catch (_) {
            resolve(null);
          }
        });
      }
    );
    req.on("error", () => resolve(null));
    req.on("timeout", () => {
      req.destroy();
      resolve(null);
    });
    req.write(payload);
    req.end();
  });
}

function fetchGitHubRepoStats() {
  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: "api.github.com",
        path: "/repos/iamqazolp/vscode-gradient-themes",
        method: "GET",
        headers: {
          "User-Agent": "vscode-gradient-themes-vsix",
          Accept: "application/vnd.github+json",
        },
        timeout: 5000,
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => {
          raw += chunk;
        });
        res.on("end", () => {
          try {
            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed.stargazers_count !== "number") {
              resolve(null);
              return;
            }
            resolve({
              stars: parsed.stargazers_count || 0,
              forks: parsed.forks_count || 0,
              openIssues: parsed.open_issues_count || 0,
            });
          } catch (_) {
            resolve(null);
          }
        });
      }
    );
    req.on("error", () => resolve(null));
    req.on("timeout", () => {
      req.destroy();
      resolve(null);
    });
    req.end();
  });
}

async function showTelemetryAndMarketplaceStats() {
  trackEvent("command.showTelemetryStats");
  const [mkt, gh] = await Promise.all([fetchMarketplaceStats(), fetchGitHubRepoStats()]);
  const cfgTelemetry = vscode.workspace
    .getConfiguration("gradientThemes")
    .get("telemetry", true);

  const authorStatus = isAuthorEnvironment
    ? "EXCLUDED (Author machine detected — 0 events sent from your machine)"
    : cfgTelemetry && vscode.env.isTelemetryEnabled
    ? "ENABLED (Anonymous usage events active)"
    : "DISABLED (Opted out via settings)";

  const totalAcquisitions = mkt ? (mkt.install || 0) + (mkt.downloadCount || 0) : null;
  const lines = [
    `# VSCode Gradient Themes — Telemetry & Marketplace Report`,
    ``,
    `- **Extension**: \`${EXTENSION_ID}\` (local \`v${EXTENSION_VERSION}\`${mkt ? `, Marketplace \`v${mkt.version}\`` : ""})`,
    `- **Your Telemetry Status**: **${authorStatus}**`,
    `- **Repository**: ${GITHUB_REPO_URL}`,
    gh
      ? `- **GitHub Stats**: ⭐ **${gh.stars}** stars · 🍴 **${gh.forks}** forks · 🐛 **${gh.openIssues}** open issues`
      : `- **GitHub Stats**: *(offline or rate-limited)*`,
    ``,
    `## 📊 VSCode Marketplace Breakdown`,
    mkt
      ? [
          `| Metric | Count | What It Actually Measures |`,
          `| :--- | :---: | :--- |`,
          `| **In-App Installs (\`install\`)** | **${mkt.install}** | Users clicking **Install** inside VSCode / Cursor / Antigravity Extensions view |`,
          `| **Direct VSIX Downloads (\`downloadCount\`)** | **${mkt.downloadCount}** | Direct \`.vsix\` HTTP downloads (automated VSIX mirrors, security scanners like Socket/Snyk, & web downloads) |`,
          `| **Extension Updates (\`updateCount\`)** | **${mkt.updateCount}** | Automatic or manual version upgrades from an earlier release |`,
          `| **Total Acquisitions (\`install + downloadCount\`)** | **${totalAcquisitions}** | Combined headline number shown on the VSCode Publisher Dashboard |`,
        ].join("\n")
      : `*(Extension not yet indexed on marketplace.visualstudio.com or offline)*`,
    ``,
    `> [!NOTE]`,
    `> **Why does the Publisher Dashboard show ~30–40 Downloads/Acquisitions right after publishing?**`,
    `> Every time you publish a new version (\`1.0.0\`, \`1.2.0\`), public VSIX mirror registries, open-source archivers, and automated extension security scanners download the \`.vsix\` package (~8–10 automated pulls per version) to index and scan it. Microsoft's Publisher Dashboard adds \`install + downloadCount\` together into "Acquisitions", whereas **In-App Installs (\`install\`)** tracks real human installations from inside the IDE.`,
  ];

  const channel = vscode.window.createOutputChannel("Gradient Themes Telemetry & Stats", "markdown");
  channel.clear();
  channel.appendLine(lines.join("\n"));
  channel.show(true);

  const summaryMsg = mkt
    ? `Marketplace v${mkt.version}: ${mkt.install} In-App Installs · ${mkt.downloadCount} VSIX Mirrors/Downloads (${totalAcquisitions} Total) · Author Telemetry: ${
        isAuthorEnvironment ? "EXCLUDED" : "Active"
      }`
    : `Author Telemetry: ${isAuthorEnvironment ? "EXCLUDED (Author machine)" : "Active"}`;

  const action = await vscode.window.showInformationMessage(
    summaryMsg,
    "Open GitHub Repo",
    "Open Marketplace Page"
  );
  if (action === "Open GitHub Repo") {
    await openGitHubRepository();
  } else if (action === "Open Marketplace Page") {
    await vscode.env.openExternal(vscode.Uri.parse(MARKETPLACE_URL));
  }
}

function activate(context) {
  initTelemetry(context);
  trackEvent("extension.activate");
  autoSyncWorkbenchOnStartup(context);

  context.subscriptions.push(
    vscode.commands.registerCommand("gradientThemes.enableGradientOverlay", () =>
      enableGradientOverlay(context, false)
    ),
    vscode.commands.registerCommand("gradientThemes.disableGradientOverlay", () =>
      disableGradientOverlay(context)
    ),
    vscode.commands.registerCommand("gradientThemes.rollRandomTheme", () =>
      rollRandomTheme(context)
    ),
    vscode.commands.registerCommand("gradientThemes.openPreview", () =>
      openPreviewPanel(context)
    ),
    vscode.commands.registerCommand("gradientThemes.openGitHub", () =>
      openGitHubRepository()
    ),
    vscode.commands.registerCommand("gradientThemes.reportIssue", () =>
      openGitHubReportIssue()
    ),
    vscode.commands.registerCommand("gradientThemes.showTelemetryStats", () =>
      showTelemetryAndMarketplaceStats()
    )
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
