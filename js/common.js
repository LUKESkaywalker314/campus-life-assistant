const $ = function (sel, scope) {
  return (scope || document).querySelector(sel);
};

const $$ = function (sel, scope) {
  return Array.prototype.slice.call((scope || document).querySelectorAll(sel));
};

function pad(n) {
  return n < 10 ? "0" + n : "" + n;
}

function formatTime(ts) {
  const d = new Date(ts);
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) +
    " " + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
}

function formatDate(ts) {
  const d = new Date(ts);
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}

function escapeHtml(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const Toast = (function () {
  let layer = null;
  function ensure() {
    if (!layer) {
      layer = document.createElement("div");
      layer.className = "toast-layer";
      document.body.appendChild(layer);
    }
    return layer;
  }
  function show(message, type) {
    const el = document.createElement("div");
    el.className = "toast" + (type ? " " + type : "");
    el.textContent = message;
    ensure().appendChild(el);
    requestAnimationFrame(function () { el.classList.add("show"); });
    setTimeout(function () {
      el.classList.remove("show");
      setTimeout(function () { el.remove(); }, 250);
    }, 2200);
  }
  return {
    info: function (m) { show(m); },
    success: function (m) { show(m, "success"); },
    error: function (m) { show(m, "error"); }
  };
})();

const Confirm = (function () {
  function open(message, onOk) {
    const mask = document.createElement("div");
    mask.className = "modal-mask show";
    mask.innerHTML =
      '<div class="modal">' +
      '<div class="modal-head">操作确认</div>' +
      '<div class="modal-body">' + escapeHtml(message) + '</div>' +
      '<div class="modal-foot">' +
      '<button class="btn btn-ghost" data-act="cancel">取消</button>' +
      '<button class="btn btn-danger" data-act="ok">确定</button>' +
      '</div></div>';
    document.body.appendChild(mask);
    function close() { mask.remove(); }
    mask.addEventListener("click", function (e) {
      if (e.target === mask || e.target.dataset.act === "cancel") close();
      if (e.target.dataset.act === "ok") { close(); onOk(); }
    });
  }
  return { open };
})();

function initLayout() {
  const path = location.pathname.split("/").pop() || "index.html";
  $$(".main-nav a").forEach(function (a) {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });

  const toggle = $(".nav-toggle");
  const nav = $(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  const yearEl = $("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", initLayout);
