第三阶段：学校官网视觉与资源配置版

本压缩包包含 school-web 前台项目的完整替换代码。

覆盖内容：
1. app 目录：页面、布局、组件、模拟数据、全局样式
2. public/images 目录：临时 Logo 与校园图片 SVG 资源
3. package.json
4. nuxt.config.ts

使用方式：
1. 停止当前运行的 npm run dev
2. 将本压缩包解压
3. 把 app、public、package.json、nuxt.config.ts 复制到 D:\projects\school-official-site\school-web
4. 出现同名文件时选择替换
5. 在 D:\projects\school-official-site\school-web 运行 npm install
6. 运行 npm run dev -- --host 127.0.0.1
7. 浏览器打开 http://127.0.0.1:3000/

后续你只需要优先修改 app/data/site.ts，即可替换学校名称、英文名、电话、地址、备案号、Logo 和 Banner 路径。
