# 校园生活助手

面向高职在校学生的一站式校园服务响应式 Web 应用，集课表管理、二手集市、失物招领、校园资讯于一体。项目使用原生 HTML5 / CSS3 / JavaScript（ES6+）开发，不依赖任何前端框架，数据通过浏览器 localStorage 本地持久化。

## 技术栈

- HTML5 语义化结构
- CSS3：Flex / Grid 布局、媒体查询响应式、CSS 变量主题、过渡动画
- 原生 JavaScript（ES6+）：DOM 操作、事件委托、模块化组织、FileReader 图片读取
- localStorage：命名空间隔离的本地数据持久化（统一前缀 `campus_`）

## 功能清单

| 模块 | 功能 |
|------|------|
| 响应式布局 | PC / 平板 / 手机三端适配，导航在窄屏折叠为抽屉菜单 |
| 校园资讯 | 原生轮播图、快讯列表、首页数据概览 |
| 我的课表 | 课程录入、周课表网格渲染、点击删除、课程时间冲突检测 |
| 二手集市 | 发布表单与前端校验、本地图片上传预览、分类与关键词筛选、图片放大、状态管理 |
| 失物招领 | 寻物 / 招领发布、类型与状态筛选、信息状态流转 |
| 暗黑模式 | 一键切换亮色 / 暗黑主题，跟随系统偏好并记忆选择 |

## 目录结构

```
.
├── index.html          首页（资讯轮播 + 数据概览 + 服务入口）
├── schedule.html       我的课表
├── market.html         二手集市
├── lost.html           失物招领
├── css/
│   ├── base.css        变量、主题、基础样式、通用组件
│   ├── layout.css      页头导航、栅格、响应式断点
│   ├── components.css  按钮、卡片、表单、轮播、上传、灯箱
│   └── modules.css     课表网格与各模块专属样式
├── js/
│   ├── dataManager.js  localStorage 数据管理与种子数据
│   ├── theme.js        暗黑模式切换
│   ├── common.js       通用工具、提示、时间格式化
│   ├── carousel.js     资讯轮播组件
│   ├── home.js         首页渲染
│   ├── schedule.js     课表与冲突检测
│   ├── market.js       二手集市
│   └── lost.js         失物招领
└── README.md
```

## 本地运行

项目为纯静态页面，需通过本地服务器访问（localStorage 在 `file://` 下受限）。任选其一：

```bash
# 方式一：Node
npx serve .

# 方式二：Python
python -m http.server 8080
```

启动后浏览器访问 `http://localhost:8080`（端口以实际为准）。首次访问会自动写入演示数据。

## 部署（GitHub Pages）

1. 在 GitHub 新建仓库并推送本项目：

```bash
git remote add origin https://github.com/<用户名>/<仓库名>.git
git branch -M main
git push -u origin main
```

2. 进入仓库 `Settings → Pages`，`Source` 选择 `Deploy from a branch`，分支选 `main`、目录选 `/ (root)`，保存。
3. 稍候片刻，通过 `https://<用户名>.github.io/<仓库名>/` 访问。

## 浏览器兼容

已在 Chrome、Edge、Firefox 最新版的 PC 端与移动端模拟环境下验证通过。

## 小组信息

25 计算机应用技术 1 班 第 2 组

| 组员 | 角色 | 负责模块 |
|------|------|----------|
| 黄锐楷 | 组长 / 前端 | 响应式布局框架、课表管理与冲突检测、暗黑模式 |
| 余春鹏 | 前端 / 交互 | 校园资讯轮播、二手集市发布与图片预览 |
| 王志强 | 前端 / 测试 | 失物招领、浏览器兼容性测试、文档与部署 |
