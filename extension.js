"use strict";

const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const os = require("os");
const crypto = require("crypto");
const https = require("https");

const EXTENSION_ID = "iamqazolp.vscode-gradient-themes";
const EXTENSION_VERSION = "1.1.0";
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
  return crypto.createHash("sha256").update(`vscode-gradient-themes:${raw}`).digest("hex").slice(0, 24);
}

function initTelemetry(context) {
  isExcludedAuthorEnv = detectIsAuthorEnvironment(context);
  isAuthorEnvironment = isExcludedAuthorEnv;
  telemetryOutputChannel = vscode.window.createOutputChannel("VS Code Gradient Themes");
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

async function enableGradientOverlay(context, silent = false) {
  trackEvent("command.enableGradientOverlay", { silent });
  const { cssUrl, jsUrl } = getAssetUrls(context);
  const config = vscode.workspace.getConfiguration();

  const existing = config.get("vscode_custom_css.imports") || [];
  const filtered = Array.isArray(existing)
    ? existing.filter((u) => !isGradientAssetUrl(u))
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
      "Gradient Themes CSS & Randomizer paths configured! Install 'Custom CSS and JS Loader' (be5invis.vscode-custom-css) to activate the full-window gradient overlay.",
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
    "Rainbow Gradient & Live Randomizer configured! Reload Custom CSS and JS now to apply.",
    "Reload Custom CSS and JS"
  );
  if (action === "Reload Custom CSS and JS") {
    await vscode.commands.executeCommand("extension.updateCustomCss");
  }
}

async function disableGradientOverlay() {
  trackEvent("command.disableGradientOverlay");
  const config = vscode.workspace.getConfiguration();
  const existing = config.get("vscode_custom_css.imports") || [];
  const filtered = Array.isArray(existing)
    ? existing.filter((u) => !isGradientAssetUrl(u))
    : [];

  await config.update("vscode_custom_css.imports", filtered, vscode.ConfigurationTarget.Global);

  const action = await vscode.window.showInformationMessage(
    "Removed Rainbow Gradient overlay from vscode_custom_css.imports.",
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
  trackEvent("command.rollRandomTheme", { picked });
  await config.update("workbench.colorTheme", picked, vscode.ConfigurationTarget.Global);
  vscode.window.setStatusBarMessage(`🎨 Theme: ${picked}`, 4000);
}

function openPreviewPanel(context) {
  trackEvent("command.openPreview");
  const panel = vscode.window.createWebviewPanel(
    "gradientThemesPreview",
    "VS Code Gradient Themes Preview",
    vscode.ViewColumn.One,
    { enableScripts: true }
  );
  const htmlPath = path.join(context.extensionPath, "theme_preview.html");
  if (fs.existsSync(htmlPath)) {
    panel.webview.html = fs.readFileSync(htmlPath, "utf8");
  } else {
    panel.webview.html = "<html><body><h2>VS Code Gradient Themes</h2></body></html>";
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
  const imports = config.get("vscode_custom_css.imports") || [];
  const overlayEnabled = Array.isArray(imports) && imports.some(isGradientAssetUrl);
  const customCssInstalled = Boolean(vscode.extensions.getExtension("be5invis.vscode-custom-css"));

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
    `- **Rainbow Overlay & Randomizer**: \`${overlayEnabled ? "Enabled" : "Disabled"}\` (Custom CSS Loader: \`${customCssInstalled ? "Installed" : "Not Installed"}\`)`,
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
    `# VS Code Gradient Themes — Telemetry & Marketplace Report`,
    ``,
    `- **Extension**: \`${EXTENSION_ID}\` (local \`v${EXTENSION_VERSION}\`${mkt ? `, Marketplace \`v${mkt.version}\`` : ""})`,
    `- **Your Telemetry Status**: **${authorStatus}**`,
    `- **Repository**: ${GITHUB_REPO_URL}`,
    gh
      ? `- **GitHub Stats**: ⭐ **${gh.stars}** stars · 🍴 **${gh.forks}** forks · 🐛 **${gh.openIssues}** open issues`
      : `- **GitHub Stats**: *(offline or rate-limited)*`,
    ``,
    `## 📊 VS Code Marketplace Breakdown`,
    mkt
      ? [
          `| Metric | Count | What It Actually Measures |`,
          `| :--- | :---: | :--- |`,
          `| **In-App Installs (\`install\`)** | **${mkt.install}** | Users clicking **Install** inside VS Code / Cursor / Antigravity Extensions view |`,
          `| **Direct VSIX Downloads (\`downloadCount\`)** | **${mkt.downloadCount}** | Direct \`.vsix\` HTTP downloads (automated VSIX mirrors, security scanners like Socket/Snyk, & web downloads) |`,
          `| **Extension Updates (\`updateCount\`)** | **${mkt.updateCount}** | Automatic or manual version upgrades from an earlier release |`,
          `| **Total Acquisitions (\`install + downloadCount\`)** | **${totalAcquisitions}** | Combined headline number shown on the VS Code Publisher Dashboard |`,
        ].join("\n")
      : `*(Extension not yet indexed on marketplace.visualstudio.com or offline)*`,
    ``,
    `> [!NOTE]`,
    `> **Why does the Publisher Dashboard show ~30–40 Downloads/Acquisitions right after publishing?**`,
    `> Every time you publish a new version (\`1.0.0\`, \`1.1.0\`), public VSIX mirror registries, open-source archivers, and automated extension security scanners download the \`.vsix\` package (~8–10 automated pulls per version) to index and scan it. Microsoft's Publisher Dashboard adds \`install + downloadCount\` together into "Acquisitions", whereas **In-App Installs (\`install\`)** tracks real human installations from inside the IDE.`,
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

async function autoSyncExistingImportsOnStartup(context) {
  try {
    const config = vscode.workspace.getConfiguration();
    const existing = config.get("vscode_custom_css.imports");
    if (!Array.isArray(existing) || !existing.some(isGradientAssetUrl)) {
      return;
    }
    const { cssUrl, jsUrl } = getAssetUrls(context);
    if (!existing.includes(cssUrl) || !existing.includes(jsUrl)) {
      const filtered = existing.filter((u) => !isGradientAssetUrl(u));
      await config.update(
        "vscode_custom_css.imports",
        [...filtered, cssUrl, jsUrl],
        vscode.ConfigurationTarget.Global
      );
    }
  } catch (_) {}
}

function activate(context) {
  initTelemetry(context);
  trackEvent("extension.activate");
  autoSyncExistingImportsOnStartup(context);

  context.subscriptions.push(
    vscode.commands.registerCommand("gradientThemes.enableGradientOverlay", () =>
      enableGradientOverlay(context, false)
    ),
    vscode.commands.registerCommand("gradientThemes.disableGradientOverlay", () =>
      disableGradientOverlay()
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
