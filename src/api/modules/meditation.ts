import { http } from '..'
import type { CommentItem, MeditationDetail, MeditationItem, ProfileInner } from '@/types'

export const getMeditationList = () =>
  http.instance.get<unknown, MeditationItem[]>('/meditation/list', { cancelKey: 'meditation-list' })

export const getMeditationDetail = (id: string) =>
  http.instance.get<unknown, MeditationDetail>(`/meditation/${id}`, { cancelKey: 'meditation-detail' })

export const toggleMeditationLike = (id: string) =>
  http.instance.post<unknown, { liked: boolean; likeCount: number }>(`/meditation/${id}/like`)

export const toggleMeditationFav = (id: string) =>
  http.instance.post<unknown, { faved: boolean; favCount: number }>(`/meditation/${id}/fav`)

export const postMeditationComment = (id: string, data: { user: string; content: string }) =>
  http.instance.post<unknown, CommentItem>(`/meditation/${id}/comment`, data)

export const getProfileInner = (type: string) =>
  http.instance.get<unknown, ProfileInner>('/profile/inner', {
    params: { type },
    cancelKey: 'profile-inner',
  })
