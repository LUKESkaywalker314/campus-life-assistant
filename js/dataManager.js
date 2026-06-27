const DataManager = (function () {
  const NS = "campus_";
  const SEED_FLAG = NS + "seeded_v2";

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
      { id: genId("news"), theme: "g1", cover: "assets/img/news-library.jpg", category: "校园通知", title: "2026 春季学期期末考试安排公布", summary: "教务处发布本学期期末考试时间表，请同学们登录教务系统查询本人考场与座位号。", source: "教务处", createdAt: daysAgo(0) },
      { id: genId("news"), theme: "g2", cover: "assets/img/news-festival.jpg", category: "活动预告", title: "第十届校园社团文化节本周五开幕", summary: "为期一周的文化节涵盖社团招新、文艺演出、趣味运动会与公益市集等系列活动。", source: "团委", createdAt: daysAgo(1) },
      { id: genId("news"), theme: "g3", category: "图书馆", title: "图书馆延长期末复习开放时间", summary: "即日起至考试结束，图书馆自习区每日开放至 22:30，新增三楼静音自习室 120 个座位。", source: "图书馆", createdAt: daysAgo(2) },
      { id: genId("news"), theme: "g4", cover: "assets/img/news-jobfair.jpg", category: "就业服务", title: "2026 届毕业生春季双选会下周举行", summary: "本次双选会邀请到八十余家用人单位进场招聘，覆盖文秘、营销、设计、运营等多个行业岗位。", source: "招生就业处", createdAt: daysAgo(3) },
      { id: genId("news"), theme: "g5", category: "校园通知", title: "宿舍楼用电安全专项检查通知", summary: "后勤处将于本周开展宿舍用电安全检查，请同学们提前移除大功率违规电器。", source: "后勤处", createdAt: daysAgo(4) }
    ]);

    write("courses", [
      { id: genId("course"), name: "高等数学", teacher: "李文静", location: "教学楼 B201", day: 1, start: 1, end: 2, weeks: "1-16周", color: "c1" },
      { id: genId("course"), name: "大学英语", teacher: "孙佳", location: "教学楼 C305", day: 1, start: 3, end: 4, weeks: "1-16周", color: "c2" },
      { id: genId("course"), name: "计算机应用基础", teacher: "陈晓明", location: "实训楼 A305", day: 2, start: 3, end: 5, weeks: "1-12周", color: "c3" },
      { id: genId("course"), name: "思想道德与法治", teacher: "周倩", location: "教学楼 A102", day: 3, start: 1, end: 2, weeks: "1-14周", color: "c4" },
      { id: genId("course"), name: "体育（篮球）", teacher: "马强", location: "体育馆", day: 3, start: 6, end: 7, weeks: "1-16周", color: "c5" },
      { id: genId("course"), name: "大学语文", teacher: "赵磊", location: "教学楼 B210", day: 4, start: 3, end: 4, weeks: "1-15周", color: "c6" },
      { id: genId("course"), name: "心理健康教育", teacher: "郑敏", location: "综合楼 D108", day: 5, start: 1, end: 2, weeks: "2-15周", color: "c7" }
    ]);

    write("goods", [
      { id: genId("goods"), title: "捷安特山地自行车", price: 280, category: "运动户外", condition: "八成新", desc: "代步通勤自行车，变速正常，刹车灵敏，车胎完好，毕业转让，校内当面交易。", seller: "黄锐楷", contact: "微信 hrk_0142", images: ["assets/img/goods-bike.jpg"], status: "在售", createdAt: daysAgo(0) },
      { id: genId("goods"), title: "大学英语四级词汇书", price: 20, category: "教材书籍", condition: "九成新", desc: "备考用书，无笔记无划线，翻新如初，适合下学期备考的同学。", seller: "余春鹏", contact: "QQ 100138", images: ["assets/img/goods-book.jpg"], status: "在售", createdAt: daysAgo(1) },
      { id: genId("goods"), title: "小米护眼 LED 台灯", price: 45, category: "生活用品", condition: "九成新", desc: "三档亮度可调，无频闪，宿舍搬迁转让，可小刀。", seller: "王志强", contact: "微信 wzq_0103", images: ["assets/img/goods-lamp.jpg"], status: "在售", createdAt: daysAgo(2) },
      { id: genId("goods"), title: "斯伯丁 7 号篮球", price: 50, category: "运动户外", condition: "七成新", desc: "室内外通用，弹性正常，赠送气针，体育馆自提。", seller: "林涛", contact: "电话 138****6677", images: ["assets/img/goods-basketball.jpg"], status: "在售", createdAt: daysAgo(3) },
      { id: genId("goods"), title: "单板入门木吉他", price: 320, category: "其他", condition: "八成新", desc: "41 寸民谣吉他，音准稳定，附琴包与拨片，适合初学者，自提试音。", seller: "郑欣怡", contact: "微信 zxy_music", images: ["assets/img/goods-guitar.jpg"], status: "在售", createdAt: daysAgo(4) },
      { id: genId("goods"), title: "宿舍 USB 小电扇", price: 25, category: "生活用品", condition: "八成新", desc: "静音三档风力，USB 供电，夹式可调角度，夏天宿舍必备，毕业转让。", seller: "吴迪", contact: "QQ 887766", images: ["assets/img/goods-fan.jpg"], status: "已售", createdAt: daysAgo(6) }
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
