import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/home/index.vue'),
      meta: { tab: 'home' },
    },
    {
      path: '/discover',
      name: 'discover',
      component: () => import('@/views/DiscoverView.vue'),
      meta: { tab: 'discover' },
    },
    {
      path: '/course',
      name: 'course',
      component: () => import('@/views/CourseView.vue'),
      meta: { tab: 'course' },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { tab: 'mine' },
    },
    {
      // 详情/登录为沉浸式页面，不展示底部 Tabbar
      path: '/course/:id',
      name: 'course-detail',
      component: () => import('@/views/CourseDetailView.vue'),
      meta: { tabbar: false },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { tabbar: false },
    },
    {
      path: '/meditation',
      name: 'meditation-list',
      component: () => import('@/views/MeditationListView.vue'),
      meta: { tabbar: false },
    },
    {
      path: '/meditation/:id',
      name: 'meditation-detail',
      component: () => import('@/views/MeditationDetailView.vue'),
      meta: { tabbar: false },
    },
    {
      path: '/course/:id/learn',
      name: 'course-learn',
      component: () => import('@/views/CourseLearnView.vue'),
      meta: { tabbar: false },
    },
    {
      // 资料详情：静态路由，优先于 /profile/:type 匹配
      path: '/profile/info',
      name: 'profile-info',
      component: () => import('@/views/ProfileInfoView.vue'),
      meta: { tabbar: false },
    },
    {
      // 个人页内页：favorite 收藏 / record 学习记录 / download 下载 / help 帮助
      path: '/profile/:type',
      name: 'profile-inner',
      component: () => import('@/views/ProfileInnerView.vue'),
      meta: { tabbar: false },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
