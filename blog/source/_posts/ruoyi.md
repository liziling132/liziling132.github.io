---
title: ruoyi框架
date: 2025-12-19 16:00:00
tags: [ruoyi]    # 标签
cover: /img/11.png
---

这里版本为 **前后端分离版本 (RuoYi-Vue)**。如果环境（JDK, Maven, MySQL, Redis, Node.js）基本齐备，按以下步骤操作，通常 **15-20分钟** 就能跑通。

---

### 第一阶段：环境准备 (必做)

在开始之前，请确保电脑上已经安装并运行了以下软件。如果缺少任何一个，项目都跑不起来。

1. **JDK:** 1.8 (推荐) 或 11/17 (取决于下载的版本，默认 1.8 最稳)。
2. **MySQL:** 5.7 或 8.0+ (记得 root 密码)。
3. **Redis:** **必须安装并启动** (若依用它存 Token 和缓存，没它后端会报错)。
4. **Maven:** 配置好阿里云镜像，否则下载依赖会很慢。
5. **Node.js:** 前端运行环境 (建议 v14 或 v16，版本过高有时会有依赖兼容问题，但也通常可行)。

---

### 第二阶段：获取代码与数据库

#### 1. 下载代码

去 Gitee (码云) 下载速度最快。

* 地址：`https://gitee.com/y_project/RuoYi-Vue`
* 可以 `git clone` 或者直接下载 ZIP 包并解压。

#### 2. 初始化数据库 (关键)

1. 打开数据库管理工具 (Navicat / DBeaver)。
2. 新建一个数据库，名字建议叫 `ry-vue` (字符集选 `utf8mb4`)。
3. 在解压后的项目文件夹中找到 `sql` 目录，依次运行下面两个文件：
* `ry_20xx_xx_xx.sql` (主结构数据)
* `quartz.sql` (定时任务表)



> **注意：** 一定要确保所有表都成功创建。

---

### 第三阶段：后端启动 (Backend)

1. **导入项目：** 打开 IntelliJ IDEA -> Open -> 选择解压后的文件夹 (根目录)。
2. **等待依赖下载：** 这是一个 Maven 多模块项目，右下角通常会提示 "Load Maven Project"，点击让它自动下载 Jar 包。
3. **修改配置 (连接数据库)：**
* 找到 `ruoyi-admin` 模块 -> `src/main/resources` -> `application-druid.yml`。
* **修改 URL：** 确认端口是否是 `3306`，数据库名是否是刚才建的 `ry-vue`。
* **修改账号密码：** 把 `username` 和 `password` 改成本地 MySQL 的账号密码。



4. **检查 Redis 配置：**
* 打开 `application.yml`，查看 Redis 配置 (通常默认是 `localhost` 和 `6379`，无密码)。如果本地 Redis 有密码，记得在这里填上。

5. **启动：**
* 找到 `RuoYiApplication.java` (在 `ruoyi-admin` 模块下)，右键 -> **Run 'RuoYiApplication'**。
* 观察控制台，如果看到 **"若依启动成功"** 的大字图案，说明后端通了！

---

### 第四阶段：前端启动 (Frontend)

1. **进入前端目录：**
* 打开终端 (CMD 或 IDEA 的 Terminal)。
* 进入 `ruoyi-ui` 目录：`cd ruoyi-ui`。

2. **安装依赖：**
* 执行命令：`npm install`
* *技巧：如果下载慢或报错，可以使用淘宝镜像：* `npm install --registry=https://registry.npmmirror.com`

3. **启动服务：**
* 执行命令：`npm run dev`

4. **成功：**
* 启动完成后，浏览器通常会自动弹出，或者手动访问 `http://localhost:80`。

---

### 第五阶段：登录验证

如果不出意外，应该能看到一个蓝色的登录界面。

* **默认账号：** `admin`
* **默认密码：** `admin123`
* **验证码：** 如果能看到验证码图片，说明后端 -> Redis -> 前端的链路是通的。如果验证码裂了，通常是 Redis 没开或者后端报错了。



