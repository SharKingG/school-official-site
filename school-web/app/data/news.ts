export type NewsCategory =
  | 'campus'
  | 'notice'
  | 'party'
  | 'student'
  | 'teacher'
  | 'recruit'
  | 'service'
  | 'anniversary'
  | 'profile'
  | 'campusArea'
  | 'affiliated'

export interface NewsArticle {
  id: string
  title: string
  date: string
  category: NewsCategory
  categoryName: string
  summary: string
  content: string[]
  cover?: string
  isTop?: boolean
}

export const categoryOptions: Array<{
  key: NewsCategory
  label: string
}> = [
  { key: 'campus', label: '集团动态' },
  { key: 'notice', label: '通知公告' },
  { key: 'party', label: '党建引领' },
  { key: 'student', label: '学生成长' },
  { key: 'teacher', label: '教师发展' },
  { key: 'service', label: '后勤服务' },
  { key: 'recruit', label: '招生招聘' },
  { key: 'anniversary', label: '校庆专栏' },
  { key: 'profile', label: '学校概况' },
  { key: 'campusArea', label: '校区动态' },
  { key: 'affiliated', label: '附属学校' }
]

export const articles: NewsArticle[] = [
  {
    id: '1',
    title: '2026年学校科创书院特色实验班招生简章',
    date: '2026-06-16',
    category: 'recruit',
    categoryName: '招生招聘',
    summary: '学校发布2026年科创书院特色实验班招生简章，欢迎广大学生和家长关注。',
    cover: '/images/feature-news.svg',
    isTop: true,
    content: [
      '根据学校年度招生工作安排，现发布2026年科创书院特色实验班招生简章。',
      '本次招生坚持公开、公平、公正原则，重点关注学生综合素养、创新潜质和学科基础。',
      '请学生和家长及时关注学校官网后续通知，按要求完成报名、材料提交和相关测试。'
    ]
  },
  {
    id: '2',
    title: '深耕课堂研真谛，以课促研提质效',
    date: '2026-06-11',
    category: 'teacher',
    categoryName: '教师发展',
    summary: '学校组织开展课堂教学专题研讨活动，推动教师专业成长。',
    cover: '/images/teaching.svg',
    content: [
      '近日，学校组织开展课堂教学专题研讨活动。各学科教师围绕课堂目标、教学活动、评价反馈等环节进行交流。',
      '活动通过示范课、说课评课、专题讲座等形式展开，促进教师在真实课堂中发现问题、研究问题、解决问题。',
      '学校将继续以课堂教学改革为抓手，推动教学质量持续提升。'
    ]
  },
  {
    id: '3',
    title: '致2026届高三学子及家长的安全告知信',
    date: '2026-06-10',
    category: 'notice',
    categoryName: '通知公告',
    summary: '学校发布面向2026届高三学生及家长的安全告知信。',
    content: [
      '为保障高三学生考后安全和假期健康生活，学校发布安全告知信。',
      '请家长加强交通、防溺水、防诈骗、心理健康和外出活动等方面的教育提醒。',
      '学校祝愿全体高三学子保持良好状态，走向更加广阔的人生舞台。'
    ]
  },
  {
    id: '4',
    title: '此去山高水阔，少年击水擎云',
    date: '2026-06-10',
    category: 'student',
    categoryName: '学生成长',
    summary: '学校举行毕业季主题活动，祝福学子奔赴山海。',
    cover: '/images/student.svg',
    content: [
      '毕业季如约而至，学校举行毕业主题活动，为毕业生送上祝福。',
      '师生共同回顾校园生活中的难忘瞬间，表达对母校、老师和同学的感恩之情。',
      '愿全体毕业生心怀理想、脚踏实地，在新征程上勇毅前行。'
    ]
  },
  {
    id: '5',
    title: '高考期间安全教育告知书',
    date: '2026-06-04',
    category: 'notice',
    categoryName: '通知公告',
    summary: '学校发布高考期间安全教育告知书，提醒考生和家长注意相关事项。',
    content: [
      '高考期间，请考生和家长合理安排出行时间，提前熟悉考点环境。',
      '请考生保持规律作息，注意饮食卫生，避免剧烈运动和不必要外出。',
      '学校将全力做好服务保障工作，为考生营造安全、有序、温馨的考试环境。'
    ]
  },
  {
    id: '6',
    title: '凝心抓德育塑魂，聚力强教研赋能',
    date: '2025-11-14',
    category: 'campusArea',
    categoryName: '校区动态',
    summary: '校区召开教育教学工作交流会，推进德育和教研协同发展。',
    cover: '/images/meeting.svg',
    content: [
      '校区召开教育教学工作交流会，围绕德育管理、课堂教学和教师成长进行深入研讨。',
      '会议强调，要以学生发展为中心，促进德育工作和教学研究深度融合。',
      '下一阶段，校区将继续完善常规管理机制，提升教育教学品质。'
    ]
  },
  {
    id: '7',
    title: '聚焦“三习惯”，班级文化展风采',
    date: '2025-10-13',
    category: 'student',
    categoryName: '学生成长',
    summary: '学校开展班级文化建设展示活动，营造积极向上的校园氛围。',
    content: [
      '学校围绕学习习惯、生活习惯和文明习惯开展班级文化建设展示活动。',
      '各班通过主题展板、班级公约和特色活动展示良好班风。',
      '活动进一步提升了学生自主管理能力和集体荣誉感。'
    ]
  },
  {
    id: '8',
    title: '科创二中，捷报频传',
    date: '2025-10-13',
    category: 'campus',
    categoryName: '集团动态',
    summary: '学校学生在科技创新竞赛中取得优异成绩。',
    cover: '/images/science.svg',
    content: [
      '学校高度重视科技创新教育，积极为学生搭建创新实践平台。',
      '近期，学生在多项科技创新竞赛中取得优异成绩，展现出良好的科学素养和创新能力。',
      '学校将继续推进科技特色课程建设，培养学生实践能力和创新精神。'
    ]
  },
  {
    id: '9',
    title: '追寻革命先烈足迹，探寻史馆红色印记',
    date: '2025-04-02',
    category: 'party',
    categoryName: '党建引领',
    summary: '学校开展红色研学主题活动，赓续红色血脉。',
    cover: '/images/party.svg',
    content: [
      '学校组织师生开展红色研学主题活动，追寻革命先烈足迹。',
      '活动通过参观学习、主题讲解和交流分享等方式，引导学生厚植家国情怀。',
      '学校将继续发挥红色资源育人作用，推动党建引领与德育工作融合发展。'
    ]
  },
  {
    id: '10',
    title: 'AI赋能习惯养成，跳绳点亮健康校园',
    date: '2025-04-02',
    category: 'student',
    categoryName: '学生成长',
    summary: '学校开展智慧体育活动，促进学生健康成长。',
    content: [
      '学校积极探索人工智能与体育教育融合，开展智慧跳绳活动。',
      '学生通过数据记录和即时反馈，提升运动兴趣，培养坚持锻炼的良好习惯。',
      '学校将持续丰富体育活动形式，建设健康、活力校园。'
    ]
  },
  {
    id: '11',
    title: '以寒促教强功底，深耕“双新”助成长',
    date: '2025-04-02',
    category: 'teacher',
    categoryName: '教师发展',
    summary: '学校开展教师专题培训，助力新课程新教材实施。',
    content: [
      '学校围绕新课程、新教材实施开展教师专题培训。',
      '培训内容涵盖教学设计、学科核心素养、课堂评价和作业优化等方面。',
      '教师们在交流研讨中更新教育理念，提升专业能力。'
    ]
  },
  {
    id: '12',
    title: '校园食堂食品安全专项检查完成',
    date: '2025-03-28',
    category: 'service',
    categoryName: '后勤服务',
    summary: '学校开展食品安全专项检查，守护师生舌尖上的安全。',
    content: [
      '学校对食堂环境卫生、原料采购、食品留样和从业人员管理等环节开展专项检查。',
      '检查组要求食堂严格落实食品安全责任，规范操作流程。',
      '学校将持续加强后勤服务管理，为师生提供安全、放心的校园餐饮。'
    ]
  },
  {
    id: '13',
    title: '校庆专题征稿活动启动',
    date: '2025-03-18',
    category: 'anniversary',
    categoryName: '校庆专栏',
    summary: '学校启动校庆专题征稿活动，邀请师生校友共同书写校园记忆。',
    content: [
      '为展示学校办学成果，凝聚师生校友情感，学校启动校庆专题征稿活动。',
      '征稿内容包括校园故事、师生回忆、校友感言、老照片说明等。',
      '欢迎广大师生校友积极参与，共同记录学校发展历程。'
    ]
  },
  {
    id: '14',
    title: '学校简介：传承与创新并重的现代化中学',
    date: '2025-03-01',
    category: 'profile',
    categoryName: '学校概况',
    summary: '学校坚持立德树人，推进优质特色发展，努力办好人民满意的教育。',
    cover: '/images/campus-banner.svg',
    content: [
      '学校坚持社会主义办学方向，全面贯彻党的教育方针，落实立德树人根本任务。',
      '学校重视课程建设、教师发展、学生成长和校园文化建设，持续提升办学品质。',
      '面向未来，学校将继续坚持内涵发展、特色发展、创新发展。'
    ]
  }
]

export function getArticlesByCategory(category: NewsCategory, limit?: number) {
  const list = articles.filter((item) => item.category === category)
  return typeof limit === 'number' ? list.slice(0, limit) : list
}

export function getArticleById(id: string) {
  return articles.find((item) => item.id === id)
}

export function searchArticles(keyword: string) {
  const text = keyword.trim().toLowerCase()

  if (!text) {
    return articles
  }

  return articles.filter((item) => {
    return (
      item.title.toLowerCase().includes(text) ||
      item.summary.toLowerCase().includes(text) ||
      item.categoryName.toLowerCase().includes(text) ||
      item.content.join('').toLowerCase().includes(text)
    )
  })
}
