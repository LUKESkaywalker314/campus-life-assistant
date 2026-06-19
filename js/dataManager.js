const DataManager = (function () {
  const NS = "campus_";
  const SEED_FLAG = NS + "seeded_v1";

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(NS + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(NS + key, JSON.stringify(value));
  }

  function list(key) {
    return read(key, []);
  }

  function genId(prefix) {
    return (prefix || "id") + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function insert(key, item) {
    const items = list(key);
    const record = Object.assign({ id: genId(key), createdAt: Date.now() }, item);
    items.unshift(record);
    write(key, items);
    return record;
  }

  function update(key, id, patch) {
    const items = list(key).map(function (it) {
      return it.id === id ? Object.assign({}, it, patch) : it;
    });
    write(key, items);
  }

  function remove(key, id) {
    write(key, list(key).filter(function (it) {
      return it.id !== id;
    }));
  }

  function find(key, id) {
    return list(key).find(function (it) {
      return it.id === id;
    }) || null;
  }

  function daysAgo(n) {
    return Date.now() - n * 86400000;
  }

  function seed() {
    if (localStorage.getItem(SEED_FLAG)) return;

    write("news", [
      { id: genId("news"), theme: "g1", category: "校园通知", title: "2026 春季学期期末考试安排公布", summary: "教务处发布本学期期末考试时间表，请同学们登录教务系统查询本人考场与座位号。", source: "教务处", createdAt: daysAgo(0) },
      { id: genId("news"), theme: "g2", category: "活动预告", title: "第十届校园技能文化节本周五开幕", summary: "为期一周的技能文化节涵盖前端开发大赛、网页设计展、职业规划讲座等系列活动。", source: "团委", createdAt: daysAgo(1) },
      { id: genId("news"), theme: "g3", category: "图书馆", title: "图书馆延长期末复习开放时间", summary: "即日起至考试结束，图书馆自习区每日开放至 22:30，新增三楼静音自习室 120 个座位。", source: "图书馆", createdAt: daysAgo(2) },
      { id: genId("news"), theme: "g4", category: "就业服务", title: "2026 届毕业生春季双选会下周举行", summary: "本次双选会邀请到八十余家用人单位进场招聘，涵盖软件开发、UI 设计、运维等岗位。", source: "招生就业处", createdAt: daysAgo(3) },
      { id: genId("news"), theme: "g5", category: "校园通知", title: "宿舍楼用电安全专项检查通知", summary: "后勤处将于本周开展宿舍用电安全检查，请同学们提前移除大功率违规电器。", source: "后勤处", createdAt: daysAgo(4) }
    ]);

    write("courses", [
      { id: genId("course"), name: "Web 前端进阶", teacher: "陈晓明", location: "实训楼 A305", day: 1, start: 1, end: 2, weeks: "1-16周", color: "c1" },
      { id: genId("course"), name: "数据库原理", teacher: "李文静", location: "教学楼 B201", day: 1, start: 3, end: 4, weeks: "1-16周", color: "c2" },
      { id: genId("course"), name: "JavaScript 框架开发", teacher: "王志远", location: "实训楼 A308", day: 2, start: 3, end: 5, weeks: "1-12周", color: "c3" },
      { id: genId("course"), name: "计算机网络", teacher: "赵磊", location: "教学楼 C102", day: 3, start: 1, end: 2, weeks: "1-16周", color: "c4" },
      { id: genId("course"), name: "UI 交互设计", teacher: "孙佳", location: "设计楼 D210", day: 3, start: 6, end: 7, weeks: "2-15周", color: "c5" },
      { id: genId("course"), name: "软件项目管理", teacher: "周倩", location: "教学楼 B305", day: 4, start: 3, end: 4, weeks: "1-14周", color: "c6" },
      { id: genId("course"), name: "体育（篮球）", teacher: "马强", location: "体育馆", day: 5, start: 1, end: 2, weeks: "1-16周", color: "c7" }
    ]);

    write("goods", [
      { id: genId("goods"), title: "数据结构与算法分析 C 语言版", price: 18, category: "教材书籍", condition: "九成新", desc: "考试用书，无笔记无划线，封面轻微磨损，适合下届同学复习使用。", seller: "黄锐楷", contact: "微信 hrk_0142", images: [], status: "在售", createdAt: daysAgo(0) },
      { id: genId("goods"), title: "罗技 G102 有线鼠标", price: 65, category: "数码电子", condition: "八成新", desc: "自用一年，功能完好，宏驱动可正常使用，附原装盒。毕业出闲，校内当面交易。", seller: "余春鹏", contact: "QQ 100138", images: [], status: "在售", createdAt: daysAgo(1) },
      { id: genId("goods"), title: "小米台灯 1S 护眼款", price: 45, category: "生活用品", condition: "九成新", desc: "三档亮度可调，无频闪，宿舍搬迁转让，可小刀。", seller: "王志强", contact: "微信 wzq_0103", images: [], status: "在售", createdAt: daysAgo(2) },
      { id: genId("goods"), title: "篮球 斯伯丁 7 号", price: 50, category: "运动户外", condition: "七成新", desc: "室内外通用，弹性正常，气针赠送，体育馆自提。", seller: "林涛", contact: "电话 138****6677", images: [], status: "在售", createdAt: daysAgo(3) },
      { id: genId("goods"), title: "考研英语单词书 红宝书", price: 22, category: "教材书籍", condition: "全新", desc: "重复购买，全新未拆封，原价五折出。", seller: "郑欣怡", contact: "微信 zxy_book", images: [], status: "在售", createdAt: daysAgo(4) },
      { id: genId("goods"), title: "宿舍折叠晾衣架", price: 12, category: "生活用品", condition: "八成新", desc: "可折叠不占地，承重稳，毕业转让。", seller: "吴迪", contact: "QQ 887766", images: [], status: "已售", createdAt: daysAgo(6) }
    ]);

    write("lost", [
      { id: genId("lost"), type: "寻物启事", title: "遗失一张校园一卡通", category: "证件卡片", location: "第一食堂二楼", happenAt: "2026-06-27 12:30:00", contact: "微信 lost_card01", desc: "卡面姓名黄锐楷，午餐时遗落，捡到的同学麻烦联系，必有酬谢。", status: "进行中", createdAt: daysAgo(2) },
      { id: genId("lost"), type: "失物招领", title: "捡到黑色雨伞一把", category: "生活物品", location: "实训楼 A 栋大厅", happenAt: "2026-06-28 18:10:00", contact: "实训楼前台", desc: "长柄自动伞，伞骨完好，现暂存于实训楼前台，失主可凭描述领取。", status: "进行中", createdAt: daysAgo(1) },
      { id: genId("lost"), type: "寻物启事", title: "寻找蓝色保温杯", category: "生活物品", location: "图书馆三楼自习区", happenAt: "2026-06-26 21:00:00", contact: "QQ 556677", desc: "膳魔师品牌，杯身有一张校徽贴纸，自习离开时忘记带走。", status: "进行中", createdAt: daysAgo(3) },
      { id: genId("lost"), type: "失物招领", title: "捡到一串钥匙", category: "钥匙", location: "操场看台", happenAt: "2026-06-28 17:40:00", contact: "微信 keys_found", desc: "三把钥匙带一个篮球挂件，傍晚在操场捡到。", status: "进行中", createdAt: daysAgo(1) }
    ]);

    localStorage.setItem(SEED_FLAG, "1");
  }

  function reset() {
    Object.keys(localStorage)
      .filter(function (k) { return k.indexOf(NS) === 0; })
      .forEach(function (k) { localStorage.removeItem(k); });
    seed();
  }

  seed();

  return { read, write, list, insert, update, remove, find, genId, reset };
})();
