// 公共正则与校验文案，表单规则统一从这里取，避免散落在各页面
export const PHONE_REG = /^1\d{10}$/
export const PHONE_MSG = '手机号格式不正确'

export const PASSWORD_REG = /^.{6,20}$/
export const PASSWORD_MSG = '密码需为 6-20 位'
