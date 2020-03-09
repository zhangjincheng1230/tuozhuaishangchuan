import axios from 'axios'
import router from '@/router'
import store from '@/store'
// eslint-disable-next-line no-unused-vars
import { Message } from 'element-ui'

import system from './system'

const service = axios.create({
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 60000 // request timeout
})

service.interceptors.response.use(function (response) {
  if (response && response.data && response.data.msg && (response.data.msg.indexOf('请先登录') >= 0 || response.data.msg.indexOf('会话已过期') >= 0)) {
    if (router.currentRoute.path !== '/login') {
      router.replace({
        path: '/login',
        query: { redirect: router.currentRoute.path }
      })
    }
  }
  if (response.data.status !== 200) {
    Message.closeAll()
    Message({
      type: 'error',
      message: response.data.message
    })
    return Promise.reject(response.data.message)
  } else {
    return response.data.data
  }
}, function (error) {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        // 返回 401 清除token信息并跳转到登录页面
        store.commit('CLEAR_LOGIN_INFO')
        switch (error.response.data.status) {
          case 40101:
            Message({
              type: 'error',
              message: error.response.data.message
            })
        }
        router.replace({
          path: '/login',
          query: { redirect: router.currentRoute.path }
        })
        break
      case 403:
        Message({
          type: 'error',
          message: '没有权限'
        })
        break
      case 402:
        store.commit('CLEAR_LOGIN_INFO')
        Message({
          type: 'error',
          message: '被其他用户强制退出'
        })
        router.replace({
          path: '/login',
          query: { redirect: router.currentRoute.path }
        })
        break
    }
  }
  return Promise.reject(error)
})

// 给URL加前缀、后缀
function convertUrl (url) {
  return process.env.VUE_APP_BASE_API + url
}
// 给url添加token信息
export function addAuthenticationToUrl (url) {
  url = convertUrl(url)
  let addition = ''
  let headers = getHeaders()
  Object.entries(headers).forEach(([key, value]) => {
    addition += '&' + key + '=' + value
  })
  if (url.indexOf('?') === -1) {
    addition = '?' + addition.substring(1)
  }
  url += addition
  return url
}

export function getHeaders () {
  const loginCorpId = store.getters.getLoginCorpId
  const userid = store.getters.getUserId
  const headers = {'X-CLIENT-ID': system.getClientId()}
  const token = store.getters.getToken
  if (loginCorpId) {
    headers['X-Login-Corp'] = loginCorpId
    headers['X-Login-Date'] = store.getters.getLoginDate
  }
  if (userid) {
    headers['X-Login-User'] = userid
  }
  if (token) {
    headers['X-ACCESS-TOKEN'] = token
  }
  return headers
}

function request (axiosConfig, config = {}) {
  axiosConfig.headers = getHeaders()
  axiosConfig.url = convertUrl(axiosConfig.url)
  return new Promise((resolve, reject) => {
    service(axiosConfig).then(res => {
      resolve(res)
      if (config.cb && typeof config.cb === 'function') {
        config.cb(res)
      }
    }).catch(e => {
      reject(e)
    })
  })
}

export function get (url, params = {}, config) {
  const axiosConfig = {
    method: 'get',
    params,
    url
  }
  return request(axiosConfig, config)
}

export function post (url, data = {}, config) {
  if (data.unjl === 'Y') {
    // 不记录日志
    url += '?unjl=Y'
  }
  const axiosConfig = {
    method: 'post',
    data,
    url
  }
  return request(axiosConfig, config)
}

export function patch (url, data = {}, config) {
  const axiosConfig = {
    method: 'patch',
    data,
    url
  }
  return request(axiosConfig, config)
}

export function put (url, data = {}, config) {
  const axiosConfig = {
    method: 'put',
    data,
    url
  }
  return request(axiosConfig, config)
}

export function del (url, data = {}, config) {
  const axiosConfig = {
    method: 'delete',
    data,
    url
  }
  return request(axiosConfig, config)
}
export function downloadFile (url, param = {}, config) {
  const form = document.createElement('form')
  const id = 'downloadForm' + new Date().getTime()
  form.setAttribute('action', convertUrl(url))
  form.setAttribute('id', id)
  form.style.display = 'none'
  form.setAttribute('method', 'post')
  form.setAttribute('target', '_blank')
  Object.assign(param, getHeaders())
  Object.entries(param).forEach(([key, value]) => {
    const input = document.createElement('input')
    input.name = key
    input.value = value
    form.appendChild(input)
  })
  document.body.appendChild(form)
  form.submit()
  destroyForm(id)
}
function destroyForm (id) {
  document.getElementById(id).remove()
}

const exportAxios = axios.create({
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 60000 // request timeout
})

exportAxios.interceptors.response.use(function (response) {
  const contentDisposition = response.headers['content-disposition']
  const patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
  const result = patt.exec(contentDisposition)
  response.data.fileName = result[1]
  return response.data
})

// 下载附件
export function downFj (url, fileName, data, callback, fileType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=gb2312') {
  const axiosConfig = {
    method: 'post',
    url: convertUrl(url),
    data: data,
    headers: getHeaders(),
    responseType: 'blob'
  }
  exportAxios(axiosConfig).then((res) => {
    const link = document.createElement('a')
    link.setAttribute('target', '_blank')
    let blob = new Blob([res], {type: fileType})
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    if (!fileName) { fileName = res.fileName }
    link.download = fileName// 下载的文件名
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }).catch(error => {
    Message({
      message: '导出异常！',
      type: 'error'
    })
    console.log(error)
  }).finally(() => {
    if (callback) {
      callback()
    }
  })
}

export function exportExcel (url, fileName, data, callback, fileType = 'application/vnd.ms-excel;charset=gb2312') {
  const axiosConfig = {
    method: 'post',
    url: convertUrl(url),
    data: data,
    headers: getHeaders(),
    responseType: 'blob'
  }
  exportAxios(axiosConfig).then((res) => {
    const url = window.URL.createObjectURL(new Blob([res], {type: fileType}))
    const link = document.createElement('a')
    link.href = url
    if (fileName.indexOf('.') === -1) {
      link.setAttribute('download', fileName + '.xls')
    } else {
      link.setAttribute('download', fileName)
    }

    document.body.appendChild(link)
    link.click()
  }).catch(error => {
    Message({
      message: '导出异常！',
      type: 'error'
    })
    console.log(error)
  }).finally(() => {
    if (callback) {
      callback()
    }
  })
}

export function printpdf (url, fileName, data, callback) {
  const axiosConfig = {
    method: 'post',
    url: convertUrl(url),
    data: data,
    headers: getHeaders(),
    responseType: 'blob'
  }
  var tempwindow
  if (store.getters.paramSettingMap.get('dzf015').pdvalue !== 1) {
    tempwindow = window.open()
  }
  axios(axiosConfig).then((res) => {
    if (store.getters.paramSettingMap.get('dzf015').pdvalue === 1) {
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName + '.pdf')
      document.body.appendChild(link)
      link.click()
    } else {
      tempwindow.location.href = URL.createObjectURL(res.data)
    }
  }).catch(error => {
    Message({
      message: '导出异常！',
      type: 'error'
    })
    console.log(error)
  }).finally(() => {
    if (callback) {
      callback()
    }
  })
}
