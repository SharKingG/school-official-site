export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2026-06-16',
  css: ['~/assets/styles/main.css', '~/assets/styles/business.css'],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:3001/api'
    }
  },
  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '中学学校官网，包含校园新闻、通知公告、党建德育、学生成长、教师发展和招生招聘等栏目。' }
      ]
    }
  }
})
