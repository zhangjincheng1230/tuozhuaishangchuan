import store from '@/store'
import {Message} from 'element-ui'

export function hasPermission (permission) {
  if (store.getters.menuList.indexOf(permission) !== -1) {
    return true
  } else {
    Message({
      message: '没有权限！',
      type: 'error'
    })
    return false
  }
}
