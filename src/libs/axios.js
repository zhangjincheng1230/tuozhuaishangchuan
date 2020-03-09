import axios from 'axios'
import { getHeaders } from '../utils/request'

let prefixTemp = '/api/zxkj'
export const prefix = prefixTemp // process.env.BASE_URL
export const suffix = ''
axios.defaults.timeout = 60000
export function postAxios (url, data, header, timeout) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: prefix + url + suffix,
      // data: qs.stringify(data, {arrayFormat: 'brackets'}),
      data: data,
      // 设置默认请求头
      // headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', ...header},
      headers: getHeaders(),
      timeout: 6000000
    }).then(response => {
      // if (response.data.code === '501') {
      if (response && response.data && response.data.msg && (response.data.msg.indexOf('请先登录') >= 0 || response.data.msg.indexOf('会话已过期') >= 0)) {
        // router.push(prefix + '/')
        window.location.href = prefix + '/'
        resolve(response.data.data)
      } else {
        // resolve(response.headers && response.config ? response.data : response)
        resolve(response.data.data)
      }
    }).catch(function (error) {
      reject(error)
    })
  })
}
// 封装请求
export function getAxios (url, data) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: prefix + url + suffix,
      params: data,
      // 设置默认请求头
      // headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
      headers: getHeaders(),
    }).then(response => {
      if (response && response.data && response.data.msg && (response.data.msg.indexOf('请先登录') >= 0 || response.data.msg.indexOf('会话已过期') >= 0)) {
        // router.push(prefix + '/')
        window.location.href = prefix + '/'
        resolve(response.data.data)
      } else {
        // resolve(response.headers && response.config ? response.data : response)
        resolve(response.data.data)
      }
    }).catch(function (error) {
      reject(error)
    })
  })
}

export function postAxiosFile (url, data) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: prefix + url + suffix,
      data: data,
      withCredentials: true,
      // 设置默认请求头
      headers: { ...getHeaders(), 'Content-Type': 'multipart/form-data'}
    }).then(response => {
      if (response.data.code === '501') {
        // router.push(prefix + '/')
        window.location.href = prefix + '/'
        return false
        // resolve(response.data)
      } else {
        resolve(response.data)
      }
    }).catch(function (error) {
      reject(error)
    })
  })
}

export function convertFormData (json) {
  let formData = new FormData()
  for (var p in json) {
    if (json[p]) {
      formData.append(p, json[p])
    }
  }
  return formData
}
