import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10)

  const admin = await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash,
      nickname: '超级管理员',
      role: 'SUPER_ADMIN'
    }
  })

  const categories = [
    { name: '集团动态', slug: 'campus', sort: 1 },
    { name: '党建引领', slug: 'party', sort: 2 },
    { name: '学生成长', slug: 'student', sort: 3 },
    { name: '教师发展', slug: 'teacher', sort: 4 },
    { name: '后勤服务', slug: 'service', sort: 5 },
    { name: '招生招聘', slug: 'recruit', sort: 6 },
    { name: '通知公告', slug: 'notice', sort: 7 },
    { name: '校庆专栏', slug: 'anniversary', sort: 8 }
  ]

  for (const item of categories) {
    await prisma.category.upsert({
      where: { slug: item.slug },
      update: { name: item.name, sort: item.sort },
      create: item
    })
  }

  const recruitCategory = await prisma.category.findUnique({ where: { slug: 'recruit' } })
  const campusCategory = await prisma.category.findUnique({ where: { slug: 'campus' } })

  if (recruitCategory) {
    const exists = await prisma.article.findFirst({ where: { title: '2026年学校科创书院特色实验班招生简章' } })
    if (!exists) {
      await prisma.article.create({
        data: {
          title: '2026年学校科创书院特色实验班招生简章',
          summary: '学校发布2026年科创书院特色实验班招生简章，欢迎广大学生和家长关注。',
          content: '根据学校年度招生工作安排，现发布2026年科创书院特色实验班招生简章。\n\n本次招生坚持公开、公平、公正原则，重点关注学生综合素养、创新潜质和学科基础。\n\n请学生和家长及时关注学校官网后续通知，按要求完成报名、材料提交和相关测试。',
          categoryId: recruitCategory.id,
          author: '招生办公室',
          source: '学校官网',
          department: '招生办公室',
          status: 'PUBLISHED',
          isTop: true,
          coverImage: '/images/feature-news.svg',
          listImage: '/images/feature-news.svg',
          publishedAt: new Date(),
          creatorId: admin.id
        }
      })
    }
  }

  if (campusCategory) {
    const exists = await prisma.article.findFirst({ where: { title: '学校举行新学期开学典礼' } })
    if (!exists) {
      await prisma.article.create({
        data: {
          title: '学校举行新学期开学典礼',
          summary: '学校举行新学期开学典礼，师生共同开启新阶段学习生活。',
          content: '近日，学校举行新学期开学典礼。全体师生齐聚校园，共同迎接新学期的到来。\n\n典礼上，学校负责人围绕新学期目标、校园安全、学习习惯和全面发展等方面提出要求。\n\n新学期，学校将继续坚持立德树人，推进课程建设、教学改革和校园文化建设。',
          categoryId: campusCategory.id,
          author: '学校办公室',
          source: '学校官网',
          department: '学校办公室',
          status: 'PUBLISHED',
          isTop: false,
          coverImage: '/images/campus-banner.svg',
          listImage: '/images/campus-banner.svg',
          publishedAt: new Date(),
          creatorId: admin.id
        }
      })
    }
  }

  await prisma.banner.upsert({
    where: { id: 1 },
    update: {
      title: '校园全景轮播图',
      imageUrl: '/images/campus-banner.svg',
      position: 'HOME_TOP',
      status: 'ENABLED',
      sort: 1
    },
    create: {
      id: 1,
      title: '校园全景轮播图',
      subtitle: '厚德 博学 求实 创新',
      imageUrl: '/images/campus-banner.svg',
      position: 'HOME_TOP',
      size: '1920*620',
      status: 'ENABLED',
      sort: 1
    }
  })

  const defaultLinks = [
    { name: '招生招聘', url: '/news?category=recruit', category: 'QUICK_LINK', type: 'INTERNAL', openTarget: 'SELF', icon: '📣', sort: 1 },
    { name: '通知公告', url: '/news?category=notice', category: 'QUICK_LINK', type: 'INTERNAL', openTarget: 'SELF', icon: '🔔', sort: 2 },
    { name: '校园新闻', url: '/news?category=campus', category: 'QUICK_LINK', type: 'INTERNAL', openTarget: 'SELF', icon: '📰', sort: 3 },
    { name: '教育局', url: 'https://www.gd.gov.cn/', category: 'FOOTER_LINK', type: 'EXTERNAL', openTarget: 'BLANK', icon: '🔗', sort: 1 }
  ]

  for (const item of defaultLinks) {
    const exists = await prisma.linkItem.findFirst({ where: { name: item.name, category: item.category } })
    if (!exists) {
      await prisma.linkItem.create({ data: item })
    }
  }

  const defaultLeaders = [
    { name: '张校长', title: '校长', photo: '/images/logo.svg', intro: '全面负责学校行政工作，推进学校高质量发展。', sort: 1 },
    { name: '李书记', title: '党总支书记', photo: '/images/logo.svg', intro: '负责党建、德育和师德师风建设工作。', sort: 2 }
  ]

  for (const item of defaultLeaders) {
    const exists = await prisma.leader.findFirst({ where: { name: item.name, title: item.title } })
    if (!exists) {
      await prisma.leader.create({ data: item })
    }
  }

  console.log('Seed completed. Admin account: admin / 123456')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
