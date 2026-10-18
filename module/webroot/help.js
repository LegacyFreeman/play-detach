// Play Detach help page
// Copyright 2026 Tears Burn (nikakvo). Licensed under the Apache License 2.0.

// Back arrow: return to the previous page instead of opening index.html again,
// so the phone's back button leaves the module afterwards.
document.getElementById("back").addEventListener("click", (e) => {
  if (history.length > 1) {
    e.preventDefault();
    history.back();
  }
});

let toastTimer;
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

function fallbackCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.append(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  ta.remove();
  return ok;
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return fallbackCopy(text);
  }
}

const COPY_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>';
const DONE_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

document.querySelectorAll(".help pre").forEach((pre) => {
  const wrap = document.createElement("div");
  wrap.className = "code";
  pre.replaceWith(wrap);
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "copy";
  btn.setAttribute("aria-label", "Copy command");
  btn.innerHTML = COPY_ICON;
  btn.addEventListener("click", async () => {
    if (await copy(pre.textContent)) {
      btn.innerHTML = DONE_ICON;
      btn.classList.add("done");
      toast("Command copied");
      setTimeout(() => {
        btn.innerHTML = COPY_ICON;
        btn.classList.remove("done");
      }, 1500);
    } else {
      toast("Copy is not supported here");
    }
  });
  wrap.append(pre, btn);
});
