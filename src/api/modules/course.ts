import { http } from '..'
import type { BannerItem, CourseItem, CourseListResult, DiscoverTopic } from '@/types'

// cancelKey：页面重复进入/快速切换时自动取消前一次相同请求
export const getCourseList = (page = 1, pageSize = 8) =>
  http.instance.get<unknown, CourseListResult>('/course/list', {
    params: { page, pageSize },
    cancelKey: 'course-list',
  })

export const getCourseDetail = (id: string) =>
  http.instance.get<unknown, CourseItem>(`/course/${id}`, { cancelKey: 'course-detail' })

export const getBannerList = () =>
  http.instance.get<unknown, BannerItem[]>('/banner/list', { cancelKey: 'banner-list' })

export const getDiscoverTopics = () =>
  http.instance.get<unknown, DiscoverTopic[]>('/discover/topics', { cancelKey: 'discover-topics' })
