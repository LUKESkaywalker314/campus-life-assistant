(function () {
  const CATEGORIES = ["全部", "教材书籍", "数码电子", "生活用品", "运动户外", "其他"];
  const state = { category: "全部", status: "", keyword: "" };
  let pendingImages = [];

  function readFiles(files) {
    Array.prototype.forEach.call(files, function (file) {
      if (!file.type || file.type.indexOf("image/") !== 0) return;
      if (pendingImages.length >= 4) {
        Toast.error("最多上传 4 张图片");
        return;
      }
      const reader = new FileReader();
      reader.onload = function (ev) {
        pendingImages.push(ev.target.result);
        renderThumbs();
      };
      reader.readAsDataURL(file);
    });
  }

  function renderThumbs() {
    const uploader = $("#uploader");
    $$(".thumb", uploader).forEach(function (t) { t.remove(); });
    const trigger = $(".upload-trigger", uploader);
    pendingImages.forEach(function (src, i) {
      const thumb = document.createElement("div");
      thumb.className = "thumb";
      thumb.innerHTML = '<img src="' + src + '" alt="预览" /><button type="button" class="remove" data-i="' + i + '">×</button>';
      uploader.insertBefore(thumb, trigger);
    });
    trigger.style.display = pendingImages.length >= 4 ? "none" : "grid";
  }

  function renderChips() {
    $("#categoryChips").innerHTML = CATEGORIES.map(function (c) {
      return '<button type="button" class="chip' + (state.category === c ? " active" : "") + '" data-cat="' + c + '">' + c + '</button>';
    }).join("");
  }

  function coverHtml(g) {
    if (g.images && g.images.length) {
      return '<div class="goods-cover"><img src="' + g.images[0] + '" alt="' + escapeHtml(g.title) + '" data-zoom="' + g.images[0] + '" /></div>';
    }
    return '<div class="goods-cover">' + escapeHtml(g.category) + '</div>';
  }

  function matched() {
    return DataManager.list("goods").filter(function (g) {
      if (state.category !== "全部" && g.category !== state.category) return false;
      if (state.status && g.status !== state.status) return false;
      if (state.keyword && g.title.toLowerCase().indexOf(state.keyword.toLowerCase()) === -1) return false;
      return true;
    });
  }

  function renderList() {
    const items = matched();
    $("#resultCount").textContent = "共 " + items.length + " 件商品";
    const wrap = $("#goodsList");
    if (!items.length) {
      wrap.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><div class="icon">📦</div>暂无商品</div>';
      return;
    }
    wrap.innerHTML = items.map(function (g) {
      const sold = g.status === "已售";
      return '<div class="card hoverable">' +
        coverHtml(g) +
        '<div class="card-body">' +
        '<div class="meta-row" style="margin-top:0">' +
        '<span class="tag ' + (sold ? "muted" : "success") + '">' + g.status + '</span>' +
        '<span class="tag">' + escapeHtml(g.condition) + '</span>' +
        '</div>' +
        '<div class="card-title" style="margin-top:8px">' + escapeHtml(g.title) + '</div>' +
        '<div class="price">¥' + g.price + '</div>' +
        '<div class="card-text" style="margin-top:6px">' + escapeHtml(g.desc || "") + '</div>' +
        '<div class="list-meta">' +
        '<span>👤 ' + escapeHtml(g.seller) + '</span>' +
        '<span>📞 ' + escapeHtml(g.contact) + '</span>' +
        '<span>🕒 ' + formatTime(g.createdAt) + '</span>' +
        '</div>' +
        '<div class="meta-row" style="margin-top:12px">' +
        '<button class="btn btn-ghost" data-act="toggle" data-id="' + g.id + '">' + (sold ? "重新上架" : "标记已售") + '</button>' +
        '<button class="btn btn-danger" data-act="del" data-id="' + g.id + '">删除</button>' +
        '</div>' +
        '</div></div>';
    }).join("");
  }

  function setError(name, msg) {
    const box = $('[data-err="' + name + '"]');
    if (box) box.textContent = msg || "";
  }

  function validate(form) {
    $$(".field-error", form).forEach(function (b) { b.textContent = ""; });
    $$(".input, .select", form).forEach(function (i) { i.classList.remove("invalid"); });
    let ok = true;
    function fail(name, msg, el) {
      setError(name, msg);
      if (el) el.classList.add("invalid");
      ok = false;
    }
    if (!form.title.value.trim()) fail("title", "请输入商品名称", form.title);
    const price = parseFloat(form.price.value);
    if (form.price.value === "" || isNaN(price) || price < 0) fail("price", "请输入有效价格", form.price);
    if (!form.category.value) fail("category", "请选择分类", form.category);
    if (!form.condition.value) fail("condition", "请选择成色", form.condition);
    if (!form.contact.value.trim()) fail("contact", "请填写联系方式", form.contact);
    return ok;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    if (!validate(form)) return;
    DataManager.insert("goods", {
      title: form.title.value.trim(),
      price: parseFloat(form.price.value),
      category: form.category.value,
      condition: form.condition.value,
      contact: form.contact.value.trim(),
      desc: form.desc.value.trim(),
      seller: "我",
      images: pendingImages.slice(),
      status: "在售"
    });
    form.reset();
    pendingImages = [];
    renderThumbs();
    renderList();
    Toast.success("发布成功");
  }

  function openLightbox(src) {
    const box = $("#lightbox");
    $("img", box).src = src;
    box.classList.add("show");
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderChips();
    renderList();

    $("#imgInput").addEventListener("change", function (e) {
      readFiles(e.target.files);
      e.target.value = "";
    });

    $("#uploader").addEventListener("click", function (e) {
      const btn = e.target.closest(".remove");
      if (btn) {
        pendingImages.splice(parseInt(btn.dataset.i, 10), 1);
        renderThumbs();
      }
    });

    $("#goodsForm").addEventListener("submit", handleSubmit);

    $("#categoryChips").addEventListener("click", function (e) {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      state.category = chip.dataset.cat;
      renderChips();
      renderList();
    });

    $("#searchInput").addEventListener("input", function (e) {
      state.keyword = e.target.value.trim();
      renderList();
    });

    $("#statusFilter").addEventListener("change", function (e) {
      state.status = e.target.value;
      renderList();
    });

    $("#goodsList").addEventListener("click", function (e) {
      const zoom = e.target.closest("[data-zoom]");
      if (zoom) { openLightbox(zoom.dataset.zoom); return; }
      const btn = e.target.closest("[data-act]");
      if (!btn) return;
      const id = btn.dataset.id;
      if (btn.dataset.act === "del") {
        Confirm.open("确定删除这件商品吗？", function () {
          DataManager.remove("goods", id);
          renderList();
          Toast.success("已删除");
        });
      } else if (btn.dataset.act === "toggle") {
        const g = DataManager.find("goods", id);
        DataManager.update("goods", id, { status: g.status === "已售" ? "在售" : "已售" });
        renderList();
      }
    });

    const box = $("#lightbox");
    box.addEventListener("click", function (e) {
      if (e.target === box || e.target.classList.contains("close")) box.classList.remove("show");
    });
  });
})();
