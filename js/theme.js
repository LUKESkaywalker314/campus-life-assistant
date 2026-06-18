(function () {
  const KEY = "campus_theme";
  const root = document.documentElement;

  function stored() {
    return localStorage.getItem(KEY);
  }

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function resolve() {
    const s = stored();
    if (s === "dark" || s === "light") return s;
    return systemPrefersDark() ? "dark" : "light";
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    const btn = document.querySelector(".theme-toggle");
    if (btn) {
      btn.textContent = theme === "dark" ? "☀" : "☾";
      btn.setAttribute("aria-label", theme === "dark" ? "切换到亮色模式" : "切换到暗黑模式");
    }
  }

  apply(resolve());

  document.addEventListener("DOMContentLoaded", function () {
    apply(resolve());
    const btn = document.querySelector(".theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      localStorage.setItem(KEY, next);
      apply(next);
    });
  });
})();
