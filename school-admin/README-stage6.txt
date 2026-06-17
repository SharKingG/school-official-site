# school-admin 第六阶段说明

本阶段将后台管理系统接入 school-api。

已接入真实接口的模块：

- 登录系统：POST /api/auth/login
- 栏目管理：GET/POST/PATCH/DELETE /api/categories
- 文章发布：POST /api/articles
- 管理我的文章：GET/PATCH/DELETE /api/articles
- 管理所有文章：GET/PATCH/DELETE /api/articles，PATCH /api/articles/:id/top

仍使用 localStorage 的模块：

- 横幅管理
- 链接管理
- 学校领导
- 招生管理
- 招聘管理
- 公共查询
- 文件管理

运行前请先启动后端：

cd ../school-api
npm run start:dev

然后启动后台：

cd ../school-admin
npm install
npm run dev

默认后台地址：
http://127.0.0.1:5174/

默认后端地址：
http://127.0.0.1:3001/api

默认账号：
admin / 123456
