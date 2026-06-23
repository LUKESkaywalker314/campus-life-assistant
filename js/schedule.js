(function () {
  const DAYS = ["", "周一", "周二", "周三", "周四", "周五", "周六", "周日"];
  const SECTIONS = [
    { n: 1, time: "08:00" },
    { n: 2, time: "08:50" },
    { n: 3, time: "10:00" },
    { n: 4, time: "10:50" },
    { n: 5, time: "14:00" },
    { n: 6, time: "14:50" },
    { n: 7, time: "16:00" },
    { n: 8, time: "16:50" }
  ];
  const COLORS = ["c1", "c2", "c3", "c4", "c5", "c6", "c7"];

  function overlap(a, b) {
    return a.day === b.day && a.start <= b.end && a.end >= b.start;
  }

  function findConflict(courses, target, ignoreId) {
    return courses.find(function (c) {
      return c.id !== ignoreId && overlap(c, target);
    }) || null;
  }

  function fillSectionOptions() {
    const opts = SECTIONS.map(function (s) {
      return '<option value="' + s.n + '">第 ' + s.n + ' 节（' + s.time + '）</option>';
    }).join("");
    $("#startSel").innerHTML = '<option value="">起始</option>' + opts;
    $("#endSel").innerHTML = '<option value="">结束</option>' + opts;
  }

  function renderTimetable() {
    const courses = DataManager.list("courses");
    const grid = $("#timetable");
    let html = '<div class="tt-cell tt-head">节次</div>';
    for (let d = 1; d <= 7; d++) {
      html += '<div class="tt-cell tt-head">' + DAYS[d] + '</div>';
    }
    SECTIONS.forEach(function (s) {
      html += '<div class="tt-cell tt-time" style="grid-row:' + (s.n + 1) + ';grid-column:1">' +
        '<strong>第' + s.n + '节</strong>' + s.time + '</div>';
    });

    courses.forEach(function (c, i) {
      const conflict = findConflict(courses, c, c.id);
      const color = c.color || COLORS[i % COLORS.length];
      html += '<div class="tt-course ' + color + (conflict ? " conflict" : "") + '" ' +
        'data-id="' + c.id + '" ' +
        'style="grid-column:' + (c.day + 1) + ';grid-row:' + (c.start + 1) + " / " + (c.end + 2) + '">' +
        '<b>' + escapeHtml(c.name) + '</b>' +
        '<span>' + escapeHtml(c.location || "") + '</span>' +
        '<span>' + escapeHtml(c.teacher || "") + '</span>' +
        '</div>';
    });

    grid.innerHTML = html;

    $$(".tt-course", grid).forEach(function (el) {
      el.addEventListener("click", function () {
        const id = el.dataset.id;
        const course = DataManager.find("courses", id);
        Confirm.open("确定删除课程「" + course.name + "」吗？", function () {
          DataManager.remove("courses", id);
          renderTimetable();
          Toast.success("已删除课程");
        });
      });
    });
  }

  function setError(name, msg) {
    const box = $('[data-err="' + name + '"]');
    if (box) box.textContent = msg || "";
  }

  function clearErrors() {
    $$(".field-error").forEach(function (b) { b.textContent = ""; });
    $$(".input, .select").forEach(function (i) { i.classList.remove("invalid"); });
  }

  function handleSubmit(e) {
    e.preventDefault();
    clearErrors();
    const form = e.target;
    const name = form.name.value.trim();
    const day = parseInt(form.day.value, 10);
    const start = parseInt(form.start.value, 10);
    const end = parseInt(form.end.value, 10);

    let valid = true;
    if (!name) { setError("name", "请输入课程名称"); form.name.classList.add("invalid"); valid = false; }
    if (!day) { setError("day", "请选择上课星期"); form.day.classList.add("invalid"); valid = false; }
    if (!start || !end) { setError("section", "请选择起始与结束节次"); valid = false; }
    else if (end < start) { setError("section", "结束节次不能早于起始节次"); valid = false; }
    if (!valid) return;

    const target = { name: name, day: day, start: start, end: end };
    const conflict = findConflict(DataManager.list("courses"), target, null);
    if (conflict) {
      setError("section", "与「" + conflict.name + "」（" + DAYS[conflict.day] + " 第" + conflict.start + "-" + conflict.end + "节）时间冲突");
      Toast.error("课程时间冲突，未能添加");
      return;
    }

    DataManager.insert("courses", {
      name: name,
      day: day,
      start: start,
      end: end,
      teacher: form.teacher.value.trim(),
      location: form.location.value.trim(),
      weeks: form.weeks.value.trim(),
      color: COLORS[DataManager.list("courses").length % COLORS.length]
    });

    form.reset();
    renderTimetable();
    Toast.success("已添加到课表");
  }

  document.addEventListener("DOMContentLoaded", function () {
    fillSectionOptions();
    renderTimetable();
    $("#courseForm").addEventListener("submit", handleSubmit);
  });
})();
