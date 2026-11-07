import Mock from 'mockjs'
import type { Connect } from 'vite'

// dev 环境 mock 服务：挂载为 Vite 中间件，走真实 HTTP（DevTools Network 面板可见）
// 数据在服务启动时用 mockjs Random 动态生成；会话内保持稳定，点赞/收藏/评论可在会话内变更
const { Random } = Mock

// ---- 响应包装（与 http 层解包逻辑对应）----
const ok = <T>(data: T) => ({ code: 0, data, message: 'ok' })
const fail = (code: number, message: string) => ({ code, data: null, message })

// ---- 生成工具 ----
// 本地图片池：dev 下由 Vite 静态服务直接提供
const COVERS = [
  '/src/assets/images/meditation-1.png',
  '/src/assets/images/meditation-2.png',
  '/src/assets/images/meditation-3.png',
  '/src/assets/images/banner.png',
  '/src/assets/images/guide-bg.png',
]
const pickCover = () => Random.pick(COVERS) as string

/** 从池子随机取 count 个（不重复） */
const pickUnique = <T>(pool: T[], count: number): T[] =>
  [...pool].sort(() => Math.random() - 0.5).slice(0, count)

const formatViews = (count: number) =>
  count >= 10000 ? `${(count / 10000).toFixed(1)}万` : String(count)

const DESC_PARTS = [
  '通过循序渐进的引导练习，帮助你重建与自己的连接。',
  '每天抽出几分钟，感受专注与平静的变化。',
  '由资深冥想导师录制，适合利用碎片时间练习。',
  '配合呼吸引导，逐步释放身体的紧绷感。',
  '坚持完成整个计划，建立稳定的练习习惯。',
]
const genDesc = () => pickUnique(DESC_PARTS, Random.integer(2, 3)).join('')

const TIME_POOL = ['刚刚', '1 小时前', '3 小时前', '昨天', '2 天前', '上周']
const COMMENT_POOL = [
  '跟着练习了一周，状态明显好多了。',
  '引导语速刚刚好，很容易进入状态。',
  '睡前听一段，入睡快了很多。',
  '工作间隙练习，效率高了不少。',
  '声音很治愈，已经收藏了。',
]
const genComments = (prefix: string) =>
  pickUnique(COMMENT_POOL, Random.integer(0, 3)).map((content, i) => ({
    id: `${prefix}-c${i + 1}`,
    user: Random.cname() as string,
    content,
    time: Random.pick(TIME_POOL) as string,
  }))

// ---- 冥想数据 ----
// 首页卡片(id 1-3)与发现页主题(id t1-t4)的标题需与入口文案保持一致，其余字段动态生成
const FIXED_TITLES: Record<string, string> = {
  '1': '差旅冥想',
  '2': '专注冥想',
  '3': '晚安冥想',
  t1: '深度睡眠',
  t2: '情绪急救',
  t3: '专注力训练',
  t4: '清晨唤醒',
}
const FREE_THEMES = ['晨间冥想', '减压冥想', '身体放松']
const MEDITATION_IDS = ['1', '2', '3', '4', '5', '6', 't1', 't2', 't3', 't4']

const meditations = MEDITATION_IDS.map((id, index) => ({
  id,
  title: FIXED_TITLES[id] ?? FREE_THEMES[index % FREE_THEMES.length],
  image: pickCover(),
  views: Random.integer(20000, 200000),
  duration: `${Random.integer(5, 20)} 分钟`,
  desc: genDesc(),
  likeCount: Random.integer(200, 2000),
  favCount: Random.integer(100, 1000),
  liked: false,
  faved: false,
  comments: genComments(id),
}))

// ---- 课程数据：26 条，演示分页加载 ----
const COURSE_THEMES = ['冥想入门', '呼吸练习', '身体扫描', '专注力训练', '情绪管理', '睡前放松', '晨间唤醒', '正念饮食', '通勤静心', '深度专注']
const COURSE_SUFFIX = ['7 天计划', '进阶营', '基础课', '工作坊', '每日练习']
const COURSE_SUBTITLES = [
  '从零开始，建立稳定的练习习惯',
  '用最自然的方式安定身心',
  '在高压场景中保持内心稳定',
  '把碎片时间变成练习时间',
  '循序渐进，感受觉察的力量',
]
const LESSON_WORDS = ['觉察', '呼吸', '放松', '专注', '静坐', '行走', '身体']
const LESSON_KINDS = ['练习', '引导', '体验', '入门']

const genLessons = (courseId: string) =>
  Array.from({ length: Random.integer(3, 7) }, (_, i) => ({
    id: `${courseId}-${i + 1}`,
    title: `第 ${i + 1} 课 · ${Random.pick(LESSON_WORDS)}${Random.pick(LESSON_KINDS)}`,
    duration: `${Random.integer(5, 25)} 分钟`,
  }))

const coursePool = Array.from({ length: 26 }, (_, i) => ({
  id: String(i + 1),
  title: `${COURSE_THEMES[i % COURSE_THEMES.length]}${i < 10 ? '' : ` · ${Random.pick(COURSE_SUFFIX)}`}`,
  subtitle: Random.pick(COURSE_SUBTITLES) as string,
  cover: pickCover(),
  level: Random.pick(['入门', '进阶']) as string,
  duration: `${Random.integer(8, 30)} 分钟/天`,
  progress: Math.random() < 0.4 ? 0 : Random.integer(10, 90),
  desc: genDesc(),
  lessons: genLessons(String(i + 1)),
}))

// ---- Banner ----
const BANNER_COPY = [
  { title: '人间松弛指南', subtitle: '融进自己的精神世界' },
  { title: '专注时刻', subtitle: '把注意力还给自己' },
  { title: '晚安计划', subtitle: '与失眠温柔道别' },
  { title: '晨间清醒', subtitle: '用呼吸开启新的一天' },
]
const banners = pickUnique(BANNER_COPY, 3).map((item, i) => ({
  id: String(i + 1),
  ...item,
  image: pickCover(),
}))

// ---- 发现页主题：与 t1-t4 冥想详情联动（标题/封面/播放量取自对应冥想）----
const TOPIC_COPY = [
  { id: 't1', subtitle: '7天改善睡眠质量', tag: 'NEW' },
  { id: 't2', subtitle: '焦虑时给自己的5分钟', tag: undefined },
  { id: 't3', subtitle: '工作前的10分钟准备', tag: undefined },
  { id: 't4', subtitle: '用呼吸开启新的一天', tag: undefined },
]
const topics = TOPIC_COPY.map((item) => {
  const meditation = meditations.find((m) => m.id === item.id) as (typeof meditations)[number]
  return {
    id: item.id,
    title: meditation.title,
    subtitle: item.subtitle,
    cover: meditation.image,
    plays: formatViews(meditation.views),
    tag: item.tag,
  }
})

// ---- 个人页内页 ----
const profileInners: Record<string, { title: string; items: Array<{ id: string; title: string; desc: string }> }> = {
  favorite: {
    title: '我的收藏',
    items: pickUnique(meditations, 2).map((m, i) => ({
      id: String(i + 1),
      title: m.title,
      desc: `${m.duration} · 收藏于 ${Random.pick(TIME_POOL)}`,
    })),
  },
  record: {
    title: '学习记录',
    items: pickUnique(coursePool, 3).map((c, i) => ({
      id: String(i + 1),
      title: c.title,
      desc: `已学 ${Random.integer(10, 90)}% · ${Random.pick(TIME_POOL)}`,
    })),
  },
  download: {
    title: '下载管理',
    items: pickUnique(meditations, 2).map((m, i) => ({
      id: String(i + 1),
      title: `${m.title}音频`,
      desc: `${Random.integer(8, 20)}.${Random.integer(0, 9)} MB · 已完成`,
    })),
  },
  help: {
    title: '帮助与反馈',
    items: [
      { id: '1', title: '如何使用冥想定时器？', desc: '常见问题' },
      { id: '2', title: '意见反馈', desc: '告诉我们你的想法' },
    ],
  },
}

// ---- 路由表 ----
interface RouteCtx {
  match: RegExpMatchArray
  query: URLSearchParams
  body: Record<string, unknown>
}
type Handler = (ctx: RouteCtx) => unknown

const findMeditation = (match: RegExpMatchArray) => meditations.find((m) => m.id === match[1])

const routes: Array<{ method: string; pattern: RegExp; handler: Handler }> = [
  {
    method: 'POST',
    pattern: /^\/auth\/login$/,
    handler: ({ body }) => {
      const phone = String(body.phone ?? '')
      if (!/^1\d{10}$/.test(phone)) return fail(400, '手机号格式不正确')
      const nickname =
        typeof body.nickname === 'string' && body.nickname.trim()
          ? body.nickname.trim()
          : (Random.cname() as string)
      return ok({
        token: `mock-token-${Date.now()}`,
        refreshToken: `mock-refresh-${Date.now()}`,
        user: { nickname, phone },
      })
    },
  },
  {
    method: 'POST',
    pattern: /^\/auth\/refresh$/,
    handler: () => ok({ token: `mock-token-${Date.now()}` }),
  },
  {
    method: 'GET',
    pattern: /^\/course\/list$/,
    handler: ({ query }) => {
      const page = Number(query.get('page') ?? 1)
      const pageSize = Number(query.get('pageSize') ?? 8)
      const start = (page - 1) * pageSize
      return ok({
        list: coursePool.slice(start, start + pageSize),
        total: coursePool.length,
        page,
        pageSize,
      })
    },
  },
  {
    method: 'GET',
    pattern: /^\/course\/(\w+)$/,
    handler: ({ match }) => {
      const course = coursePool.find((item) => item.id === match[1])
      return course ? ok(course) : fail(404, '课程不存在或已下架')
    },
  },
  { method: 'GET', pattern: /^\/banner\/list$/, handler: () => ok(banners) },
  { method: 'GET', pattern: /^\/discover\/topics$/, handler: () => ok(topics) },
  { method: 'GET', pattern: /^\/meditation\/list$/, handler: () => ok(meditations) },
  {
    method: 'GET',
    pattern: /^\/meditation\/(\w+)$/,
    handler: ({ match }) => {
      const item = findMeditation(match)
      return item ? ok(item) : fail(404, '内容不存在或已下架')
    },
  },
  {
    method: 'POST',
    pattern: /^\/meditation\/(\w+)\/like$/,
    handler: ({ match }) => {
      const item = findMeditation(match)
      if (!item) return fail(404, '内容不存在')
      item.liked = !item.liked
      item.likeCount += item.liked ? 1 : -1
      return ok({ liked: item.liked, likeCount: item.likeCount })
    },
  },
  {
    method: 'POST',
    pattern: /^\/meditation\/(\w+)\/fav$/,
    handler: ({ match }) => {
      const item = findMeditation(match)
      if (!item) return fail(404, '内容不存在')
      item.faved = !item.faved
      item.favCount += item.faved ? 1 : -1
      return ok({ faved: item.faved, favCount: item.favCount })
    },
  },
  {
    method: 'POST',
    pattern: /^\/meditation\/(\w+)\/comment$/,
    handler: ({ match, body }) => {
      const item = findMeditation(match)
      if (!item) return fail(404, '内容不存在')
      const comment = {
        id: `c-${Date.now()}`,
        user: String(body.user ?? Random.cname()),
        content: String(body.content ?? ''),
        time: '刚刚',
      }
      item.comments.unshift(comment)
      return ok(comment)
    },
  },
  {
    method: 'GET',
    pattern: /^\/profile\/inner$/,
    handler: ({ query }) => {
      const inner = profileInners[query.get('type') ?? '']
      return inner ? ok(inner) : fail(404, '页面不存在')
    },
  },
]

const readBody = (req: Connect.IncomingMessage) =>
  new Promise<Record<string, unknown>>((resolve) => {
    let raw = ''
    req.on('data', (chunk: Buffer | string) => (raw += chunk))
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw || '{}') as Record<string, unknown>)
      } catch {
        resolve({})
      }
    })
    req.on('error', () => resolve({}))
  })

// Connect 中间件：挂载于 /api 前缀（见 vite.config.ts），req.url 已去掉前缀
export const mockMiddleware: Connect.NextHandleFunction = (req, res) => {
  const url = new URL(req.url ?? '/', 'http://mock.local')
  const route = routes.find((r) => r.method === req.method && r.pattern.test(url.pathname))
  if (!route) {
    res.statusCode = 404
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify(fail(404, '接口不存在')))
    return
  }
  void readBody(req).then((body) => {
    // 模拟弱网延迟 200-600ms，便于观察 loading / 并发限制 / 重试行为
    setTimeout(() => {
      const match = url.pathname.match(route.pattern) as RegExpMatchArray
      const result = route.handler({ match, query: url.searchParams, body })
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify(result))
    }, Random.integer(200, 600))
  })
}
