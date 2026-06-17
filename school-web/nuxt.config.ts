export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2026-06-16',
  css: ['~/assets/styles/main.css'],
  app: {
    head: {
      htmlAttrs: {
        lang: 'zh-CN'
      },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '中学学校官网，包含校园新闻、通知公告、党建德育、学生成长、教师发展和招生招聘等栏目。' }
      ]
    }
  }
})
