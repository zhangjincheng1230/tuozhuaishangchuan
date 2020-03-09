// 系统api
import {get, post} from '@/utils/request'

export function getCorps (param) {
  return get('/zxkj/sm_user/gsQuery', param)
}

export function jumpToOther (param) {
  return get('/auth/to/' + param.platformTag)
}

export function loginByToken (param) {
  return get('/auth/loginByToken', param)
}

export function login (data) {
  return post('/auth/login', data)
}

export function getCheckCode (param) {
  return get('/auth/captcha', param)
}

export function selectSys () {
  return get('/auth/selectSys')
}

export function logout (data) {
  return post('/auth/logout', data)
}

export function selectCorp (param) {
  return get('/zxkj/sm_user/gsSelect', param)
}

export function changeLoginCorpAndDate (param) {
  return get('/zxkj/sm_user/switchCorp', param)
}

export function getCorpinfoByHomePage (data) {
  return post('/zxkj/sys_corpinfo/getCorpInfoByHomepage', data)
}

export function queryFunNode (data) {
  return get('/auth/queryFunNode', data)
}

export function getCorpServiceInfo (param) {
  return get('/zxkj/sys_corpinfo/getCorpServiceInfo', param)
}

export function getDefaultLoginDate (param) {
  return get('/zxkj/sm_user/getDefaultLoginDate', param)
}
