第七阶段：school-web 前台官网接入 school-api

运行顺序：
1. 启动后端 school-api：cd school-api && npm run start:dev
2. 启动前台 school-web：cd school-web && npm run dev -- --host 127.0.0.1
3. 打开 http://127.0.0.1:3000/

本阶段改动：
- 新增 app/api/cms.ts：统一封装 school-api 请求和数据转换
- 首页从 /api/articles 读取文章
- 新闻列表页从 /api/articles 读取文章
- 新闻详情页从 /api/articles/:id 读取文章详情
- 搜索页从 /api/articles?keyword=xxx 读取搜索结果
- 栏目 tabs 从 /api/categories 读取栏目
- 保留原有视觉样式、Logo、Banner 和右侧更多功能按钮

注意：
- 必须先启动 school-api，否则前台页面会显示“接口连接失败”的提示。
- 默认后端接口地址为 http://127.0.0.1:3001/api，可通过 .env 中的 NUXT_PUBLIC_API_BASE_URL 修改。
