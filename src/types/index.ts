// 冥想 App 相关的 TypeScript 类型定义

/** Tab 导航项（首页顶部） */
export interface TabItem {
  id: string
  label: string
  active?: boolean
}

/** 轮播 Banner 数据 */
export interface BannerItem {
  id: string
  title: string       // 副标题
  subtitle: string    // 主标题
  image: string       // 背景图
}

/** 听声日贴卡片 */
export interface DailyPost {
  id: string
  number: string      // 日期数字
  title: string       // 标题 "听声日贴"
  tag?: string        // NEW 标签
  content: string     // 引用文字
}

/** 冥想卡片 */
export interface MeditationCard {
  id: string
  title: string       // 卡片标题，如 "差旅"
  image: string       // 封面图
}

/** 冥想入门指南卡片 */
export interface GuideCard {
  title: string
  subtitle: string
  background: string
}

/** 底部导航项 */
export interface NavItem {
  id: string
  label: string
  icon: string        // 图标名称
  path: string        // 路由地址
}

/** 发现页主题卡片 */
export interface DiscoverTopic {
  id: string
  title: string
  subtitle: string
  cover: string
  plays: string       // 播放量文案
  tag?: string
}

/** 课程章节 */
export interface CourseLesson {
  id: string
  title: string
  duration: string    // 章节时长
}

/** 课程页课程卡片 */
export interface CourseItem {
  id: string
  title: string
  subtitle: string
  cover: string
  level: string       // 入门 / 进阶
  duration: string    // 时长文案
  progress: number    // 学习进度（0-100）
  desc: string        // 课程介绍（详情页）
  lessons: CourseLesson[] // 章节列表（详情页）
}

/** 课程列表分页结果 */
export interface CourseListResult {
  list: CourseItem[]
  total: number
  page: number
  pageSize: number
}

/** 登录用户信息 */
export interface AuthUser {
  nickname: string
  phone: string
}

/** 冥想练习项（列表页） */
export interface MeditationItem {
  id: string
  title: string
  image: string
  views: number      // 访问量
  duration: string
  desc: string
}

/** 评论 */
export interface CommentItem {
  id: string
  user: string
  content: string
  time: string
}

/** 冥想详情（含互动数据） */
export interface MeditationDetail extends MeditationItem {
  likeCount: number
  favCount: number
  liked: boolean
  faved: boolean
  comments: CommentItem[]
}

/** 个人页内页条目 */
export interface ProfileInnerItem {
  id: string
  title: string
  desc: string
}

export interface ProfileInner {
  title: string
  items: ProfileInnerItem[]
}

/** 个人中心统计项 */
export interface UserStat {
  id: string
  label: string
  value: string
}

/** 个人中心功能入口 */
export interface MenuItem {
  id: string
  title: string
  icon: string
}
