# 第五阶段：school-api 后端接口

技术栈：
- NestJS
- Prisma
- MySQL
- JWT

默认端口：
http://127.0.0.1:3001/api

默认账号：
admin / 123456

主要接口：
- POST /api/auth/login
- GET /api/auth/profile
- GET /api/categories
- GET /api/categories/tree
- POST /api/categories
- PATCH /api/categories/:id
- DELETE /api/categories/:id
- GET /api/articles
- GET /api/articles/:id
- POST /api/articles
- PATCH /api/articles/:id
- PATCH /api/articles/:id/top
- DELETE /api/articles/:id

启动步骤：
1. 复制 .env.example 为 .env
2. 修改 .env 里的 MySQL 密码
3. 创建 MySQL 数据库 school_official_site
4. npm install
5. npx prisma generate
6. npx prisma migrate dev --name init
7. npx prisma db seed
8. npm run start:dev
