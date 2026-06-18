import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const permissions = {
  all: [
    'dashboard:view',
    'category:manage',
    'article:create',
    'article:manage',
    'article:review',
    'banner:manage',
    'link:manage',
    'leader:manage',
    'admission:manage',
    'recruitment:manage',
    'query:manage',
    'file:manage',
    'site:manage',
    'system:manage',
    'log:view'
  ],
  content: ['dashboard:view', 'category:manage', 'article:create', 'article:manage', 'file:manage', 'site:manage'],
  admission: ['dashboard:view', 'admission:manage', 'file:manage'],
  recruitment: ['dashboard:view', 'recruitment:manage', 'file:manage'],
  query: ['dashboard:view', 'query:manage', 'file:manage'],
  reviewer: ['dashboard:view', 'article:manage', 'article:review']
}

function jsonPermissions(items: string[]) {
  return JSON.stringify(items)
}

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10)


  const defaultRoles = [
    { code: 'SUPER_ADMIN', name: '超级管理员', description: '拥有全部系统权限', permissions: permissions.all, sort: 1 },
    { code: 'CONTENT_ADMIN', name: '内容管理员', description: '负责栏目和文章内容维护', permissions: permissions.content, sort: 2 },
    { code: 'ADMISSION_ADMIN', name: '招生管理员', description: '负责招生计划和报名数据', permissions: permissions.admission, sort: 3 },
    { code: 'RECRUITMENT_ADMIN', name: '招聘管理员', description: '负责招聘岗位和投递数据', permissions: permissions.recruitment, sort: 4 },
    { code: 'QUERY_ADMIN', name: '查询管理员', description: '负责公共查询项目和查询结果', permissions: permissions.query, sort: 5 },
    { code: 'REVIEWER', name: '文章审核员', description: '负责审核文章发布流程', permissions: permissions.reviewer, sort: 6 }
  ]

  for (const role of defaultRoles) {
    await prisma.role.upsert({
      where: { code: role.code },
      update: {
        name: role.name,
        description: role.description,
        permissions: jsonPermissions(role.permissions),
        sort: role.sort,
        status: 'ENABLED'
      },
      create: {
        code: role.code,
        name: role.name,
        description: role.description,
        permissions: jsonPermissions(role.permissions),
        sort: role.sort,
        status: 'ENABLED'
      }
    })
  }

  const admin = await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: { role: 'SUPER_ADMIN', status: 'ENABLED' },
    create: {
      username: 'admin',
      passwordHash,
      nickname: '超级管理员',
      role: 'SUPER_ADMIN'
    }
  })


  const sampleUsers = [
    { username: 'content', nickname: '内容管理员', role: 'CONTENT_ADMIN' },
    { username: 'reviewer', nickname: '文章审核员', role: 'REVIEWER' },
    { username: 'admission', nickname: '招生管理员', role: 'ADMISSION_ADMIN' }
  ]

  for (const item of sampleUsers) {
    await prisma.adminUser.upsert({
      where: { username: item.username },
      update: { nickname: item.nickname, role: item.role, status: 'ENABLED' },
      create: {
        username: item.username,
        passwordHash,
        nickname: item.nickname,
        role: item.role,
        status: 'ENABLED'
      }
    })
  }

  async function upsertCategory(item: { name: string; slug: string; sort: number; parentSlug?: string; path?: string; type?: string }) {
    const parent = item.parentSlug
      ? await prisma.category.findUnique({ where: { slug: item.parentSlug } })
      : null

    return prisma.category.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        sort: item.sort,
        parentId: parent?.id || null,
        path: item.path || `/news?category=${item.slug}`,
        type: item.type || 'ARTICLE',
        status: 'ENABLED'
      },
      create: {
        name: item.name,
        slug: item.slug,
        sort: item.sort,
        parentId: parent?.id || null,
        path: item.path || `/news?category=${item.slug}`,
        type: item.type || 'ARTICLE',
        status: 'ENABLED'
      }
    })
  }

  const rootCategories = [
    { name: '首页', slug: 'home', sort: 0, path: '/', type: 'LINK' },
    { name: '集团动态', slug: 'campus', sort: 1 },
    { name: '党建引领', slug: 'party', sort: 2 },
    { name: '学生成长', slug: 'student', sort: 3 },
    { name: '教师发展', slug: 'teacher', sort: 4 },
    { name: '后勤服务', slug: 'service', sort: 5 },
    { name: '教工之家', slug: 'staff-home', sort: 6 },
    { name: '招生招聘', slug: 'recruit', sort: 7 },
    { name: '校庆专栏', slug: 'anniversary', sort: 8 }
  ]

  for (const item of rootCategories) {
    await upsertCategory(item)
  }

  const childCategories = [
    { parentSlug: 'campus', name: '集团新闻', slug: 'group-news', sort: 1 },
    { parentSlug: 'campus', name: '集团简介', slug: 'group-profile', sort: 2 },
    { parentSlug: 'campus', name: '通知公告', slug: 'notice', sort: 3 },

    { parentSlug: 'party', name: '党建动态', slug: 'party-news', sort: 1 },
    { parentSlug: 'party', name: '政策学习', slug: 'policy-study', sort: 2 },
    { parentSlug: 'party', name: '实施方案', slug: 'implementation-plan', sort: 3 },
    { parentSlug: 'party', name: '党务公开', slug: 'party-affairs', sort: 4 },

    { parentSlug: 'student', name: '德育动态', slug: 'moral-education', sort: 1 },
    { parentSlug: 'student', name: '团旗飘扬', slug: 'youth-league', sort: 2 },
    { parentSlug: 'student', name: '学生风采', slug: 'student-style', sort: 3 },
    { parentSlug: 'student', name: '文体活动', slug: 'culture-sports', sort: 4 },
    { parentSlug: 'student', name: '竞技风采', slug: 'competition-style', sort: 5 },
    { parentSlug: 'student', name: '学生社团', slug: 'student-clubs', sort: 6 },
    { parentSlug: 'student', name: '湛二翘楚', slug: 'excellent-students', sort: 7 },
    { parentSlug: 'student', name: '研学行', slug: 'study-tour', sort: 8 },

    { parentSlug: 'teacher', name: '师德师风', slug: 'teacher-ethics', sort: 1 },
    { parentSlug: 'teacher', name: '教学管理', slug: 'teaching-management', sort: 2 },
    { parentSlug: 'teacher', name: '教研动态', slug: 'teaching-research', sort: 3 },
    { parentSlug: 'teacher', name: '教研组建设', slug: 'research-group', sort: 4 },
    { parentSlug: 'teacher', name: '教师培训', slug: 'teacher-training', sort: 5 },
    { parentSlug: 'teacher', name: '名师工作室', slug: 'master-studio', sort: 6 },
    { parentSlug: 'teacher', name: '教学资源库', slug: 'teaching-resources', sort: 7 },

    { parentSlug: 'recruit', name: '招生报名', slug: 'admissions-entry', sort: 1, path: '/admissions', type: 'LINK' },
    { parentSlug: 'recruit', name: '招聘信息', slug: 'recruitment-entry', sort: 2, path: '/recruitment', type: 'LINK' },

    { parentSlug: 'anniversary', name: '校庆公告', slug: 'anniversary-notice', sort: 1 },
    { parentSlug: 'anniversary', name: '校庆飞鸿', slug: 'anniversary-letter', sort: 2 },
    { parentSlug: 'anniversary', name: '校友捐赠', slug: 'alumni-donation', sort: 3 },
    { parentSlug: 'anniversary', name: '校友动态', slug: 'alumni-news', sort: 4 }
  ]

  for (const item of childCategories) {
    await upsertCategory(item)
  }

  const recruitCategory = await prisma.category.findUnique({ where: { slug: 'recruit' } })
  const campusCategory = await prisma.category.findUnique({ where: { slug: 'campus' } })

  if (recruitCategory) {
    const exists = await prisma.article.findFirst({
      where: { title: '2026年学校科创书院特色实验班招生简章' }
    })

    if (!exists) {
      await prisma.article.create({
        data: {
          title: '2026年学校科创书院特色实验班招生简章',
          summary: '学校发布2026年科创书院特色实验班招生简章，欢迎广大学生和家长关注。',
          content:
            '根据学校年度招生工作安排，现发布2026年科创书院特色实验班招生简章。\n\n本次招生坚持公开、公平、公正原则，重点关注学生综合素养、创新潜质和学科基础。\n\n请学生和家长及时关注学校官网后续通知，按要求完成报名、材料提交和相关测试。',
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
    const exists = await prisma.article.findFirst({
      where: { title: '学校举行新学期开学典礼' }
    })

    if (!exists) {
      await prisma.article.create({
        data: {
          title: '学校举行新学期开学典礼',
          summary: '学校举行新学期开学典礼，师生共同开启新阶段学习生活。',
          content:
            '近日，学校举行新学期开学典礼。全体师生齐聚校园，共同迎接新学期的到来。\n\n典礼上，学校负责人围绕新学期目标、校园安全、学习习惯和全面发展等方面提出要求。\n\n新学期，学校将继续坚持立德树人，推进课程建设、教学改革和校园文化建设。',
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
    { name: '招生报名', url: '/admissions', category: 'QUICK_LINK', type: 'INTERNAL', openTarget: 'SELF', icon: '🎓', sort: 1 },
    { name: '招聘投递', url: '/recruitment', category: 'QUICK_LINK', type: 'INTERNAL', openTarget: 'SELF', icon: '👩‍🏫', sort: 2 },
    { name: '公共查询', url: '/public-query', category: 'QUICK_LINK', type: 'INTERNAL', openTarget: 'SELF', icon: '🔎', sort: 3 },
    { name: '学校领导', url: '/leaders', category: 'QUICK_LINK', type: 'INTERNAL', openTarget: 'SELF', icon: '👥', sort: 4 },
    { name: '教育局', url: 'https://www.gd.gov.cn/', category: 'FOOTER_LINK', type: 'EXTERNAL', openTarget: 'BLANK', icon: '', sort: 1 }
  ]

  for (const item of defaultLinks) {
    const exists = await prisma.linkItem.findFirst({
      where: { name: item.name, category: item.category }
    })
    if (!exists) await prisma.linkItem.create({ data: item })
  }

  const defaultLeaders = [
    { name: '张校长', title: '校长', photo: '/images/logo.svg', intro: '全面负责学校行政工作，推进学校高质量发展。', sort: 1 },
    { name: '李书记', title: '党总支书记', photo: '/images/logo.svg', intro: '负责党建、德育和师德师风建设工作。', sort: 2 }
  ]

  for (const item of defaultLeaders) {
    const exists = await prisma.leader.findFirst({ where: { name: item.name, title: item.title } })
    if (!exists) await prisma.leader.create({ data: item })
  }

  const admissionPlan = await prisma.admissionPlan.upsert({
    where: { id: 1 },
    update: {
      title: '2026年初一新生招生报名',
      status: 'ENABLED'
    },
    create: {
      id: 1,
      title: '2026年初一新生招生报名',
      description: '面向符合条件的小学毕业生开放网上报名。请如实填写学生基本信息，提交后等待学校审核通知。',
      target: '小学毕业生',
      contact: '招生办公室 0759-0000000',
      status: 'ENABLED',
      sort: 1
    }
  })

  const admissionRecordExists = await prisma.admissionRecord.findFirst({
    where: { planId: admissionPlan.id, studentName: '测试学生' }
  })

  if (!admissionRecordExists) {
    await prisma.admissionRecord.create({
      data: {
        planId: admissionPlan.id,
        studentName: '测试学生',
        gender: '男',
        idCard: '440800200001010000',
        phone: '13800000000',
        school: '某某小学',
        grade: '六年级',
        remark: '系统初始化测试报名数据'
      }
    })
  }

  const recruitmentPlan = await prisma.recruitmentPlan.upsert({
    where: { id: 1 },
    update: {
      title: '2026年语文教师招聘',
      status: 'ENABLED'
    },
    create: {
      id: 1,
      title: '2026年语文教师招聘',
      department: '初中语文组',
      positionCount: 2,
      description: '根据学校发展需要，现面向社会招聘优秀语文教师。',
      requirements: '本科及以上学历，具有教师资格证，有中学教学经验者优先。',
      contact: '人事办公室 0759-0000001',
      status: 'ENABLED',
      sort: 1
    }
  })

  const recruitmentRecordExists = await prisma.recruitmentRecord.findFirst({
    where: { planId: recruitmentPlan.id, applicantName: '测试教师' }
  })

  if (!recruitmentRecordExists) {
    await prisma.recruitmentRecord.create({
      data: {
        planId: recruitmentPlan.id,
        applicantName: '测试教师',
        gender: '女',
        phone: '13900000000',
        email: 'teacher@example.com',
        education: '本科',
        major: '汉语言文学',
        remark: '系统初始化测试投递数据'
      }
    })
  }

  const queryProject = await prisma.queryProject.upsert({
    where: { id: 1 },
    update: {
      title: '2026年录取结果查询',
      status: 'ENABLED'
    },
    create: {
      id: 1,
      title: '2026年录取结果查询',
      description: '请输入姓名和身份证号查询录取结果。',
      queryFields: 'name,idCard',
      status: 'ENABLED',
      sort: 1
    }
  })

  const queryRecordExists = await prisma.queryRecord.findFirst({
    where: { projectId: queryProject.id, name: '测试学生' }
  })

  if (!queryRecordExists) {
    await prisma.queryRecord.create({
      data: {
        projectId: queryProject.id,
        name: '测试学生',
        idCard: '440800200001010000',
        ticketNo: '20260001',
        resultTitle: '已录取',
        resultContent: '恭喜你已被我校初一年级录取，请按学校通知时间办理报到手续。',
        fileUrl: ''
      }
    })
  }


  const defaultSettings = [
    { key: 'schoolName', label: '学校名称', value: '某某市第一中学', group: 'BASIC', sort: 1 },
    { key: 'schoolEnglishName', label: '英文名称', value: 'Moumou No.1 Middle School', group: 'BASIC', sort: 2 },
    { key: 'logo', label: '学校 Logo', value: '/images/logo.svg', group: 'BASIC', sort: 3 },
    { key: 'banner', label: '默认首页横幅', value: '/images/campus-banner.svg', group: 'BASIC', sort: 4 },
    { key: 'slogan', label: '学校校训/口号', value: '厚德 博学 求实 创新', group: 'BASIC', sort: 5 },
    { key: 'subSlogan', label: '首页副标题', value: '建设有温度、有品质、有特色的现代化学校官网', group: 'BASIC', sort: 6 },
    { key: 'address', label: '学校地址', value: '某某市某某区某某路 1 号', group: 'CONTACT', sort: 10 },
    { key: 'phone', label: '联系电话', value: '0759-0000000', group: 'CONTACT', sort: 11 },
    { key: 'email', label: '邮箱', value: 'school@example.com', group: 'CONTACT', sort: 12 },
    { key: 'postcode', label: '邮政编码', value: '524000', group: 'CONTACT', sort: 13 },
    { key: 'icp', label: '备案号', value: '粤ICP备00000000号', group: 'FOOTER', sort: 20 },
    { key: 'copyrightYear', label: '版权年份', value: '2026', group: 'FOOTER', sort: 21 },
    { key: 'browserTitle', label: '浏览器标题', value: '某某市第一中学官网', group: 'SEO', sort: 30 },
    { key: 'searchPlaceholder', label: '搜索框提示语', value: '文章搜索', group: 'SEO', sort: 31 },
    { key: 'enableArticleReview', label: '是否开启文章审核', value: 'true', group: 'PARAM', type: 'BOOLEAN', sort: 40 },
    { key: 'enableAdmission', label: '是否开启招生报名', value: 'true', group: 'PARAM', type: 'BOOLEAN', sort: 41 },
    { key: 'enableRecruitment', label: '是否开启招聘投递', value: 'true', group: 'PARAM', type: 'BOOLEAN', sort: 42 },
    { key: 'enablePublicQueryCaptcha', label: '公共查询是否启用验证码', value: 'false', group: 'PARAM', type: 'BOOLEAN', sort: 43 },
    { key: 'uploadMaxSizeMb', label: '上传文件大小限制 MB', value: '20', group: 'PARAM', type: 'NUMBER', sort: 44 },
    { key: 'allowedUploadTypes', label: '允许上传的文件类型', value: 'jpg,png,gif,pdf,doc,docx,xls,xlsx', group: 'PARAM', sort: 45 }
  ]

  for (const item of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { settingKey: item.key },
      update: {
        label: item.label,
        valueType: item.type || 'TEXT',
        settingGroup: item.group,
        sort: item.sort
      },
      create: {
        settingKey: item.key,
        label: item.label,
        settingValue: item.value,
        valueType: item.type || 'TEXT',
        settingGroup: item.group,
        sort: item.sort
      }
    })
  }

  const defaultHomeSections = [
    { title: '党建引领', icon: '🚩', categorySlug: 'party', articleLimit: 5, moreLink: '/news?category=party', sort: 1 },
    { title: '学生成长', icon: '🌱', categorySlug: 'student', articleLimit: 5, moreLink: '/news?category=student', sort: 2 },
    { title: '教师发展', icon: '👩‍🏫', categorySlug: 'teacher', articleLimit: 5, moreLink: '/news?category=teacher', sort: 3 },
    { title: '后勤服务', icon: '🍽️', categorySlug: 'service', articleLimit: 5, moreLink: '/news?category=service', sort: 4 },
    { title: '招生招聘', icon: '📣', categorySlug: 'recruit', articleLimit: 5, moreLink: '/news?category=recruit', sort: 5 },
    { title: '校庆专栏', icon: '🎉', categorySlug: 'anniversary', articleLimit: 5, moreLink: '/news?category=anniversary', sort: 6 }
  ]

  for (const item of defaultHomeSections) {
    const exists = await prisma.homeSection.findFirst({ where: { title: item.title, categorySlug: item.categorySlug } })
    if (!exists) {
      await prisma.homeSection.create({
        data: {
          ...item,
          layout: 'CARD',
          visible: true
        }
      })
    }
  }

  const backupExists = await prisma.backupRecord.findFirst({ where: { title: '系统初始化备份记录' } })
  if (!backupExists) {
    await prisma.backupRecord.create({
      data: {
        title: '系统初始化备份记录',
        backupType: 'AUTO',
        scope: 'CONFIG_AND_BUSINESS',
        description: '第十一阶段初始化站点设置、首页配置和备份管理模块。',
        status: 'SUCCESS',
        createdBy: 'system'
      }
    })
  }

  const logExists = await prisma.operationLog.findFirst({ where: { module: '系统初始化', action: '初始化第十阶段权限角色' } })

  if (!logExists) {
    await prisma.operationLog.create({
      data: {
        userId: admin.id,
        username: admin.username,
        module: '系统初始化',
        action: '初始化第十阶段权限角色',
        targetType: 'system',
        description: '初始化角色、权限、测试账号、操作日志、站点设置和首页配置',
        result: 'SUCCESS'
      }
    })
  }

  console.log('Seed completed. Admin account: admin / 123456. Extra users: content/reviewer/admission / 123456. Stage 11 site settings initialized.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
