// Play Detach WebUI
// Copyright 2026 Tears Burn (nikakvo). Licensed under the Apache License 2.0.

const MODDIR = "/data/adb/modules/play-detach";
const CLI = `${MODDIR}/play-detach`;
const PKG_RE = /^[A-Za-z0-9_]+(\.[A-Za-z0-9_]+)*$/;

const $ = (id) => document.getElementById(id);

// ---------------------------------------------------------------------------
// Root manager bridge (KernelSU / SukiSU / APatch WebUI API)
// ---------------------------------------------------------------------------

const ksu = window.ksu;
let callSeq = 0;

function exec(cmd) {
  return new Promise((resolve) => {
    if (!ksu) {
      resolve({ errno: -1, stdout: "", stderr: "WebUI bridge not available" });
      return;
    }
    const cb = `pd_exec_${Date.now()}_${callSeq++}`;
    window[cb] = (errno, stdout, stderr) => {
      delete window[cb];
      resolve({ errno, stdout: stdout || "", stderr: stderr || "" });
    };
    try {
      ksu.exec(cmd, "{}", cb);
    } catch (e) {
      delete window[cb];
      resolve({ errno: -1, stdout: "", stderr: String(e) });
    }
  });
}

const hasPkgApi = !!ksu && typeof ksu.listPackages === "function" && typeof ksu.getPackagesInfo === "function";

function listPackages(type) {
  try {
    return JSON.parse(ksu.listPackages(type)) || [];
  } catch {
    return [];
  }
}

function getPackagesInfo(pkgs) {
  try {
    return JSON.parse(ksu.getPackagesInfo(JSON.stringify(pkgs))) || [];
  } catch {
    return [];
  }
}

const lines = (s) => s.split("\n").map((l) => l.trim()).filter(Boolean);
const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()));

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

/** @type {Map<string, {pkg: string, label: string, system: boolean, installed: boolean, detached: boolean}>} */
const apps = new Map();
let tab = "user";
let query = "";

function addApp(pkg, system) {
  if (!PKG_RE.test(pkg) || apps.has(pkg)) return;
  apps.set(pkg, { pkg, label: pkg, system, installed: true, detached: false });
}

async function loadPackages() {
  if (hasPkgApi) {
    listPackages("user").forEach((p) => addApp(p, false));
    listPackages("system").forEach((p) => addApp(p, true));

    // Labels in chunks so the UI stays responsive.
    const all = [...apps.keys()];
    for (let i = 0; i < all.length; i += 60) {
      for (const info of getPackagesInfo(all.slice(i, i + 60))) {
        const app = apps.get(info.packageName);
        if (!app) continue;
        if (info.appLabel) app.label = info.appLabel;
        if (typeof info.isSystem === "boolean") app.system = info.isSystem;
      }
      await nextFrame();
    }
  } else {
    const [user, system] = await Promise.all([exec("pm list packages -3"), exec("pm list packages -s")]);
    lines(user.stdout).forEach((l) => addApp(l.replace(/^package:/, ""), false));
    lines(system.stdout).forEach((l) => addApp(l.replace(/^package:/, ""), true));
  }
}

async function loadDetached() {
  const res = await exec(`${CLI} list`);
  if (res.errno !== 0) throw new Error(res.stderr.trim() || "could not read the detach list");
  for (const pkg of lines(res.stdout)) {
    if (!PKG_RE.test(pkg)) continue;
    const app = apps.get(pkg);
    if (app) app.detached = true;
    else apps.set(pkg, { pkg, label: pkg, system: false, installed: false, detached: true });
  }
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

const listEl = $("list");

function tileColor(pkg) {
  let h = 0;
  for (let i = 0; i < pkg.length; i++) h = (h * 31 + pkg.charCodeAt(i)) >>> 0;
  return `hsl(${h % 360} 45% 42%)`;
}

function makeTile(app) {
  const t = document.createElement("div");
  t.className = "tile";
  t.style.background = tileColor(app.pkg);
  t.textContent = (app.label.match(/[\p{L}\p{N}]/u) || ["?"])[0];
  return t;
}

function makeIcon(app) {
  if (!hasPkgApi || !app.installed) return makeTile(app);
  const img = document.createElement("img");
  img.className = "ico";
  img.alt = "";
  img.loading = "lazy";
  img.decoding = "async";
  img.src = `ksu://icon/${app.pkg}`;
  img.addEventListener("error", () => img.replaceWith(makeTile(app)), { once: true });
  return img;
}

function makeRow(app) {
  const row = document.createElement("label");
  row.className = "row" + (app.detached ? " on" : "");
  row.dataset.pkg = app.pkg;

  const meta = document.createElement("div");
  meta.className = "meta";
  const name = document.createElement("div");
  name.className = "name";
  name.textContent = app.label;
  const pkg = document.createElement("div");
  pkg.className = "pkg";
  pkg.textContent = app.pkg;
  if (!app.installed) {
    const b = document.createElement("span");
    b.className = "badge";
    b.textContent = "Not installed";
    name.append(b);
  }
  meta.append(name, pkg);

  const sw = document.createElement("span");
  sw.className = "switch";
  const input = document.createElement("input");
  input.type = "checkbox";
  input.setAttribute("role", "switch");
  input.setAttribute("aria-label", `Detach ${app.label}`);
  input.checked = app.detached;
  input.addEventListener("change", () => toggle(app, input, row));
  const track = document.createElement("span");
  track.className = "track";
  sw.append(input, track);

  row.append(makeIcon(app), meta, sw);
  return row;
}

function visibleApps() {
  const q = query.toLowerCase();
  return [...apps.values()]
    .filter((a) => {
      if (tab === "detached" && !a.detached) return false;
      if (tab === "user" && a.system) return false;
      if (tab === "system" && !a.system) return false;
      if (q && !a.label.toLowerCase().includes(q) && !a.pkg.toLowerCase().includes(q)) return false;
      return true;
    })
    .sort((a, b) => (b.detached - a.detached) || a.label.localeCompare(b.label, undefined, { sensitivity: "base" }));
}

function emptyState() {
  const div = document.createElement("div");
  div.className = "empty";
  if (query) {
    div.innerHTML = "<strong>No matches</strong><span>Try another name or package.</span>";
  } else if (tab === "detached") {
    div.innerHTML = `
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <rect x="8" y="22" width="26" height="20" rx="6" fill="#c77dff"/>
        <rect x="34" y="26" width="8" height="4" rx="2" fill="#c77dff"/>
        <rect x="34" y="34" width="8" height="4" rx="2" fill="#c77dff"/>
        <polygon points="17,27 17,37 25,32" fill="#22062f"/>
        <rect x="48" y="18" width="10" height="28" rx="4" stroke="#c77dff" stroke-width="3"/>
      </svg>
      <strong>No detached apps yet</strong>
      <span>Turn on the switch next to an app to stop Play Store updates for it.</span>`;
  } else {
    div.innerHTML = "<strong>No apps here</strong>";
  }
  return div;
}

function render() {
  const items = visibleApps();
  const frag = document.createDocumentFragment();
  if (items.length === 0) frag.append(emptyState());
  else items.forEach((a) => frag.append(makeRow(a)));
  listEl.replaceChildren(frag);
  $("foot").hidden = !(tab === "detached" && !query && items.length > 0);
  updateCounts();
}

function updateCounts() {
  let user = 0, system = 0, detached = 0;
  for (const a of apps.values()) {
    if (a.detached) detached++;
    if (!a.installed) continue;
    if (a.system) system++;
    else user++;
  }
  $("n-user").textContent = user;
  $("n-system").textContent = system;
  $("n-detached").textContent = detached;
  return detached;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

let toastTimer;
function toast(msg, error = false) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.toggle("error", error);
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), error ? 4500 : 2200);
}

async function toggle(app, input, row) {
  const on = input.checked;
  // Show the new state right away; revert only if the command fails.
  row.classList.toggle("on", on);
  input.disabled = true;

  const res = await exec(`${CLI} ${on ? "add" : "remove"} ${app.pkg}`);
  input.disabled = false;

  if (res.errno === 0) {
    app.detached = on;
    toast(on ? `${app.label} detached` : `${app.label} re-attached`);
    if (!on && !app.installed) {
      apps.delete(app.pkg);
      row.remove();
    }
    updateCounts();
    refreshStatus();
  } else {
    input.checked = !on;
    row.classList.toggle("on", !on);
    toast(res.stderr.trim() || "Could not change the list", true);
  }
}

async function reattachAll() {
  const res = await exec(`${CLI} clear`);
  if (res.errno !== 0) {
    toast(res.stderr.trim() || "Could not clear the list", true);
    return;
  }
  for (const [pkg, a] of apps) {
    if (!a.installed) apps.delete(pkg);
    else a.detached = false;
  }
  render();
  refreshStatus();
  toast("All apps re-attached");
}

// ---------------------------------------------------------------------------
// Status line
// ---------------------------------------------------------------------------

function setStatus(state, text) {
  $("status").dataset.state = state;
  $("status-text").textContent = text;
}

async function refreshStatus() {
  const count = updateCounts();
  if (count === 0) {
    setStatus("idle", "No apps detached yet");
    return;
  }
  const noun = count === 1 ? "app" : "apps";
  const res = await exec("logcat -d -s PlayDetach | tail -n 1");
  const last = res.stdout.trim();
  if (/active in Play Store/.test(last)) {
    setStatus("ok", `Active in Play Store - ${count} ${noun} detached`);
  } else if (last && /\bE PlayDetach\b|: .*(failed|not found|unsupported)/i.test(last)) {
    setStatus("error", `Problem: ${last.replace(/^.*PlayDetach:\s*/, "")}`);
  } else {
    setStatus("warn", `${count} ${noun} detached - applies when the Play Store opens`);
  }
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

function setupUi() {
  const search = $("search");
  const clear = $("clear");
  let t;
  search.addEventListener("input", () => {
    clear.hidden = !search.value;
    clearTimeout(t);
    t = setTimeout(() => {
      query = search.value.trim();
      render();
    }, 120);
  });
  clear.addEventListener("click", (e) => {
    e.preventDefault();
    search.value = "";
    clear.hidden = true;
    query = "";
    render();
    search.focus();
  });

  document.querySelectorAll(".tab").forEach((btn) =>
    btn.addEventListener("click", () => {
      tab = btn.dataset.tab;
      document.querySelectorAll(".tab").forEach((b) => b.setAttribute("aria-selected", String(b === btn)));
      render();
      window.scrollTo({ top: 0 });
    })
  );

  const confirm = $("confirm");
  $("reattach-all").addEventListener("click", () => (confirm.hidden = false));
  $("confirm-no").addEventListener("click", () => (confirm.hidden = true));
  confirm.addEventListener("click", (e) => {
    if (e.target === confirm) confirm.hidden = true;
  });
  $("confirm-yes").addEventListener("click", () => {
    confirm.hidden = true;
    reattachAll();
  });
}

async function main() {
  setupUi();

  if (!ksu) {
    setStatus("error", "Open this page from your root manager");
    listEl.replaceChildren();
    return;
  }

  exec(`sed -n 's/^version=//p' ${MODDIR}/module.prop`).then((r) => {
    const v = r.stdout.trim();
    if (v) $("version").textContent = `Zygisk module - ${v}`;
  });

  try {
    await loadPackages();
    await loadDetached();
  } catch (e) {
    setStatus("error", String(e.message || e));
  }
  render();
  refreshStatus();
}

main();
