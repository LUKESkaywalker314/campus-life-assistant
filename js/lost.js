(function () {
  const TYPES = ["全部", "寻物启事", "失物招领"];
  const state = { type: "全部", status: "", keyword: "" };

  function statusLabel(item) {
    if (item.status === "已完成") {
      return item.type === "寻物启事" ? "已找回" : "已认领";
    }
    return item.type === "寻物启事" ? "寻找中" : "待认领";
  }

  function normalizeDateTime(value) {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return formatTime(d.getTime());
  }

  function renderChips() {
    $("#typeChips").innerHTML = TYPES.map(function (t) {
      return '<button type="button" class="chip' + (state.type === t ? " active" : "") + '" data-type="' + t + '">' + t + '</button>';
    }).join("");
  }

  function matched() {
    return DataManager.list("lost").filter(function (it) {
      if (state.type !== "全部" && it.type !== state.type) return false;
      if (state.status && it.status !== state.status) return false;
      if (state.keyword && it.title.toLowerCase().indexOf(state.keyword.toLowerCase()) === -1) return false;
      return true;
    });
  }

  function renderList() {
    const items = matched();
    $("#resultCount").textContent = "共 " + items.length + " 条信息";
    const wrap = $("#lostList");
    if (!items.length) {
      wrap.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><div class="icon">🔎</div>暂无信息</div>';
      return;
    }
    wrap.innerHTML = items.map(function (it) {
      const done = it.status === "已完成";
      const typeTag = it.type === "寻物启事" ? "warning" : "success";
      return '<div class="card hoverable lost-card"><div class="card-body">' +
        '<div class="lost-head">' +
        '<span class="tag ' + typeTag + '">' + it.type + '</span>' +
        '<span class="tag ' + (done ? "muted" : "") + '">' + statusLabel(it) + '</span>' +
        '</div>' +
        '<div class="card-title">' + escapeHtml(it.title) + '</div>' +
        '<div class="card-text" style="margin-top:6px">' + escapeHtml(it.desc || "") + '</div>' +
        '<div class="list-meta">' +
        '<span>🏷 ' + escapeHtml(it.category) + '</span>' +
        '<span>📍 ' + escapeHtml(it.location) + '</span>' +
        '</div>' +
        '<div class="list-meta">' +
        '<span>🕒 ' + escapeHtml(it.happenAt || formatTime(it.createdAt)) + '</span>' +
        '<span>📞 ' + escapeHtml(it.contact) + '</span>' +
        '</div>' +
        '<div class="meta-row" style="margin-top:12px">' +
        '<button class="btn btn-ghost" data-act="toggle" data-id="' + it.id + '">' + (done ? "重新开启" : "标记完成") + '</button>' +
        '<button class="btn btn-danger" data-act="del" data-id="' + it.id + '">删除</button>' +
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
    if (!form.type.value) fail("type", "请选择信息类型", form.type);
    if (!form.title.value.trim()) fail("title", "请输入标题", form.title);
    if (!form.category.value) fail("category", "请选择物品分类", form.category);
    if (!form.location.value.trim()) fail("location", "请输入地点", form.location);
    if (!form.contact.value.trim()) fail("contact", "请填写联系方式", form.contact);
    return ok;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    if (!validate(form)) return;
    DataManager.insert("lost", {
      type: form.type.value,
      title: form.title.value.trim(),
      category: form.category.value,
      location: form.location.value.trim(),
      happenAt: normalizeDateTime(form.happenAt.value),
      contact: form.contact.value.trim(),
      desc: form.desc.value.trim(),
      status: "进行中"
    });
    form.reset();
    renderList();
    Toast.success("发布成功");
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderChips();
    renderList();

    $("#lostForm").addEventListener("submit", handleSubmit);

    $("#typeChips").addEventListener("click", function (e) {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      state.type = chip.dataset.type;
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

    $("#lostList").addEventListener("click", function (e) {
      const btn = e.target.closest("[data-act]");
      if (!btn) return;
      const id = btn.dataset.id;
      if (btn.dataset.act === "del") {
        Confirm.open("确定删除这条信息吗？", function () {
          DataManager.remove("lost", id);
          renderList();
          Toast.success("已删除");
        });
      } else if (btn.dataset.act === "toggle") {
        const it = DataManager.find("lost", id);
        DataManager.update("lost", id, { status: it.status === "已完成" ? "进行中" : "已完成" });
        renderList();
      }
    });
  });
})();
