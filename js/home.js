(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const news = DataManager.list("news");

    Carousel.build($("#newsCarousel"), news.slice(0, 5));

    const listEl = $("#newsList");
    if (!news.length) {
      listEl.innerHTML = '<div class="empty-state">暂无快讯</div>';
    } else {
      listEl.innerHTML = news.slice(0, 5).map(function (it, i) {
        return '<li class="news-item">' +
          '<span class="news-index">' + (i + 1) + '</span>' +
          '<div>' +
          '<div>' + escapeHtml(it.title) + '</div>' +
          '<div class="news-meta">' + escapeHtml(it.source) + ' · ' + formatDate(it.createdAt) + '</div>' +
          '</div></li>';
      }).join("");
    }

    const stats = [
      { icon: "📅", label: "本周课程", value: DataManager.list("courses").length, unit: "门" },
      { icon: "🛒", label: "在售闲置", value: DataManager.list("goods").filter(function (g) { return g.status === "在售"; }).length, unit: "件" },
      { icon: "🔎", label: "失物招领", value: DataManager.list("lost").length, unit: "条" },
      { icon: "📰", label: "校园快讯", value: DataManager.list("news").length, unit: "条" }
    ];

    $("#statStrip").innerHTML = stats.map(function (s) {
      return '<div class="card"><div class="card-body" style="display:flex;align-items:center;gap:14px">' +
        '<span class="module-icon">' + s.icon + '</span>' +
        '<div><div style="font-size:1.5rem;font-weight:800">' + s.value + '<small class="text-faint" style="font-size:0.8rem;font-weight:600">' + s.unit + '</small></div>' +
        '<div class="text-soft" style="font-size:0.86rem">' + s.label + '</div></div>' +
        '</div></div>';
    }).join("");
  });
})();
