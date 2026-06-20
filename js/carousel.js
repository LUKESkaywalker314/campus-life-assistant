(function () {
  const gradients = {
    g1: "linear-gradient(135deg, #2f6fed, #5b8dff)",
    g2: "linear-gradient(135deg, #e8920a, #f0b94c)",
    g3: "linear-gradient(135deg, #1aa860, #4cd08a)",
    g4: "linear-gradient(135deg, #8a4cf0, #b07bff)",
    g5: "linear-gradient(135deg, #e5484d, #ff7a7d)"
  };

  function build(container, items) {
    if (!items.length) {
      container.innerHTML = '<div class="empty-state"><div class="icon">📰</div>暂无资讯</div>';
      return;
    }
    const track = document.createElement("div");
    track.className = "carousel-track";

    items.forEach(function (it) {
      const slide = document.createElement("div");
      slide.className = "carousel-slide";
      slide.style.background = gradients[it.theme] || gradients.g1;
      slide.innerHTML =
        '<div class="slide-content">' +
        '<span class="slide-tag">' + escapeHtml(it.category) + '</span>' +
        '<h3>' + escapeHtml(it.title) + '</h3>' +
        '<p>' + escapeHtml(it.summary) + '</p>' +
        '</div>';
      track.appendChild(slide);
    });

    const prev = document.createElement("button");
    prev.className = "carousel-btn prev";
    prev.textContent = "‹";
    const next = document.createElement("button");
    next.className = "carousel-btn next";
    next.textContent = "›";

    const dots = document.createElement("div");
    dots.className = "carousel-dots";
    items.forEach(function (_, i) {
      const dot = document.createElement("button");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", function () { go(i); });
      dots.appendChild(dot);
    });

    container.innerHTML = "";
    container.appendChild(track);
    if (items.length > 1) {
      container.appendChild(prev);
      container.appendChild(next);
      container.appendChild(dots);
    }

    let index = 0;
    let timer = null;

    function render() {
      track.style.transform = "translateX(" + -index * 100 + "%)";
      $$(".carousel-dots button", container).forEach(function (d, i) {
        d.classList.toggle("active", i === index);
      });
    }
    function go(i) {
      index = (i + items.length) % items.length;
      render();
    }
    function start() {
      if (items.length < 2) return;
      timer = setInterval(function () { go(index + 1); }, 4000);
    }
    function stop() {
      if (timer) clearInterval(timer);
    }

    prev.addEventListener("click", function () { go(index - 1); });
    next.addEventListener("click", function () { go(index + 1); });
    container.addEventListener("mouseenter", stop);
    container.addEventListener("mouseleave", start);
    render();
    start();
  }

  window.Carousel = { build };
})();
