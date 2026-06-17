export const categoryTree = [
  {
    id: 'root',
    label: '学校官网管理平台',
    type: '系统根栏目',
    children: [
      {
        id: 'group',
        label: '集团动态',
        type: '普通栏目',
        children: [
          { id: 'group-news', label: '集团新闻', type: '普通栏目' },
          { id: 'group-intro', label: '集团简介', type: '普通栏目' },
          { id: 'leaders', label: '领导班子', type: '普通栏目' }
        ]
      },
      {
        id: 'party',
        label: '党建引领',
        type: '普通栏目',
        children: [
          { id: 'party-work', label: '党建工作', type: '普通栏目' },
          { id: 'moral', label: '德育活动', type: '普通栏目' }
        ]
      },
      {
        id: 'student',
        label: '学生成长',
        type: '普通栏目',
        children: [
          { id: 'club', label: '社团活动', type: '普通栏目' },
          { id: 'student-work', label: '学生作品', type: '普通栏目' }
        ]
      },
      {
        id: 'teacher',
        label: '教师发展',
        type: '普通栏目',
        children: [
          { id: 'teaching-research', label: '教研活动', type: '普通栏目' },
          { id: 'teacher-training', label: '教师培训', type: '普通栏目' }
        ]
      },
      {
        id: 'service',
        label: '后勤服务',
        type: '普通栏目',
        children: [
          { id: 'safety', label: '校园安全', type: '普通栏目' },
          { id: 'canteen', label: '食堂服务', type: '普通栏目' }
        ]
      },
      {
        id: 'recruit',
        label: '招生招聘',
        type: '普通栏目',
        children: [
          { id: 'admission-signup', label: '招生报名', type: '自定义链接' },
          { id: 'job-delivery', label: '招聘投递', type: '自定义链接' }
        ]
      },
      {
        id: 'notice',
        label: '通知公告',
        type: '普通栏目',
        children: [
          { id: 'school-notice', label: '学校公告', type: '普通栏目' }
        ]
      }
    ]
  }
]

export const flatCategories = [
  { label: '集团新闻', value: 'group-news' },
  { label: '集团简介', value: 'group-intro' },
  { label: '领导班子', value: 'leaders' },
  { label: '党建工作', value: 'party-work' },
  { label: '德育活动', value: 'moral' },
  { label: '社团活动', value: 'club' },
  { label: '学生作品', value: 'student-work' },
  { label: '教研活动', value: 'teaching-research' },
  { label: '教师培训', value: 'teacher-training' },
  { label: '校园安全', value: 'safety' },
  { label: '食堂服务', value: 'canteen' },
  { label: '招生报名', value: 'admission-signup' },
  { label: '招聘投递', value: 'job-delivery' },
  { label: '学校公告', value: 'school-notice' }
]

export const initialArticles = [
  {
    id: 'article_1',
    title: '2026年学校科创书院特色实验班招生简章',
    category: 'admission-signup',
    categoryName: '招生报名',
    type: '普通文章',
    status: '已发布',
    author: '管理员',
    department: '招生办',
    source: '学校官网',
    publishTime: '2026-06-16 09:00:00',
    isTop: true,
    linkUrl: '',
    listImage: '/images/feature-news.svg',
    headerImage: '/images/feature-news.svg',
    carouselImage: '/images/campus-banner.svg',
    attachmentName: '招生简章.pdf',
    content: '根据学校年度招生工作安排，现发布2026年科创书院特色实验班招生简章。请学生和家长及时关注学校官网后续通知。'
  },
  {
    id: 'article_2',
    title: '深耕课堂研真谛，以课促研提质效',
    category: 'teaching-research',
    categoryName: '教研活动',
    type: '普通文章',
    status: '待审核',
    author: '教务处',
    department: '教务处',
    source: '学校官网',
    publishTime: '2026-06-11 10:20:00',
    isTop: false,
    linkUrl: '',
    listImage: '/images/teaching.svg',
    headerImage: '/images/teaching.svg',
    carouselImage: '',
    attachmentName: '',
    content: '学校组织开展课堂教学研讨活动，持续推进高效课堂建设。'
  },
  {
    id: 'article_3',
    title: '致2026届高三学子及家长的安全告知信',
    category: 'school-notice',
    categoryName: '学校公告',
    type: '普通文章',
    status: '已发布',
    author: '学生处',
    department: '学生处',
    source: '学校官网',
    publishTime: '2026-06-10 08:30:00',
    isTop: false,
    linkUrl: '',
    listImage: '',
    headerImage: '',
    carouselImage: '',
    attachmentName: '',
    content: '为进一步做好学生安全教育工作，现将有关事项告知如下。'
  }
]

export const initialBanners = [
  { id: 'banner_1', name: '首页校园主图', category: '首页顶部轮播', image: '/images/campus-banner.svg', size: '1920*620', status: '启用', sort: 1 },
  { id: 'banner_2', name: '中部广告位', category: '网站中部广告', image: '/images/feature-news.svg', size: '285*80', status: '启用', sort: 2 }
]

export const initialLinks = [
  { id: 'link_1', name: '公共查询', url: '/public-query', category: '首页右侧应用', type: '内部链接', openType: '当前窗口', status: '启用' },
  { id: 'link_2', name: '招生报名', url: '/admission', category: '首页右侧应用', type: '内部链接', openType: '当前窗口', status: '启用' },
  { id: 'link_3', name: '湛江市教育局', url: 'https://www.zhanjiang.gov.cn/', category: '底部友情链接', type: '外部链接', openType: '新窗口', status: '启用' }
]

export const initialLeaders = [
  { id: 'leader_1', name: '李小峰', title: '校长', sort: 1, photo: '/images/logo.svg', intro: '全面主持学校行政工作，推进学校高质量发展。', status: '启用' },
  { id: 'leader_2', name: '刘华', title: '副校长', sort: 2, photo: '/images/logo.svg', intro: '分管教学教研与教师发展工作。', status: '启用' }
]

export const initialAdmissions = [
  {
    id: 'admission_1',
    planName: '2026年初一招生计划',
    startTime: '2026-06-01 08:00:00',
    endTime: '2026-06-30 18:00:00',
    status: '报名中',
    description: '面向符合条件的小学毕业生开放网上报名。',
    image: '/images/student.svg',
    applicants: [
      { id: 'student_1', name: '张三', gender: '男', idNumber: '440800********1234', phone: '13800000001', school: '某某小学', submitTime: '2026-06-10 09:12:00' },
      { id: 'student_2', name: '李四', gender: '女', idNumber: '440800********5678', phone: '13800000002', school: '某某实验小学', submitTime: '2026-06-12 14:35:00' }
    ]
  }
]

export const initialRecruitments = [
  {
    id: 'recruitment_1',
    planName: '2026年教师招聘计划',
    startTime: '2026-06-02 08:00:00',
    endTime: '2026-06-20 18:00:00',
    status: '投递中',
    description: '招聘语文、数学、英语、物理、信息技术等学科教师。',
    image: '/images/teaching.svg',
    applicants: [
      { id: 'job_1', name: '王老师', gender: '女', idNumber: '440800********4321', phone: '13900000001', position: '语文教师', education: '硕士', submitTime: '2026-06-10 11:20:00' },
      { id: 'job_2', name: '陈老师', gender: '男', idNumber: '440800********8765', phone: '13900000002', position: '数学教师', education: '本科', submitTime: '2026-06-12 16:10:00' }
    ]
  }
]

export const initialPublicQueries = [
  { id: 'query_1', name: '录取结果查询', templateName: '录取结果模板.xlsx', status: '启用', uploadTime: '2026-06-15 10:00:00', resultFile: '录取结果名单.xlsx' },
  { id: 'query_2', name: '分班结果查询', templateName: '分班结果模板.xlsx', status: '停用', uploadTime: '2026-06-16 15:30:00', resultFile: '分班结果名单.xlsx' }
]

export const initialFiles = [
  { id: 'file_1', name: '录取通知书下载模板.pdf', url: '/uploads/admission-notice.pdf', category: '公共查询结果文件', size: '2.4MB', uploadTime: '2026-06-15 09:40:00' },
  { id: 'file_2', name: '招聘报名表.docx', url: '/uploads/job-form.docx', category: '招聘附件', size: '128KB', uploadTime: '2026-06-10 11:12:00' }
]
